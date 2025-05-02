from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import joblib
import pandas as pd
from collections import Counter
import shutil
import os
from pydantic import BaseModel
from typing import List
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a FastAPI instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model variables
video_model = None
video_scaler = None
video_label_encoder = None
qs_model = None

# Load the video prediction models
try:
    video_model = joblib.load("Vid_pred/autism_model.pkl")
    video_scaler = joblib.load("Vid_pred/scaler (2).pkl")
    video_label_encoder = joblib.load("Vid_pred/label_encoder.pkl")
    logger.info("Successfully loaded video prediction models")
except Exception as e:
    logger.error(f"Error loading video models: {str(e)}")

# Load the questionnaire prediction model
try:
    qs_model = joblib.load("qs_pred/random_forest_model.pkl")
    logger.info("Successfully loaded questionnaire model")
except Exception as e:
    logger.error(f"Error loading questionnaire model: {str(e)}")

# Directory to store uploaded videos
UPLOAD_DIR = "uploaded_videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class QuestionnaireData(BaseModel):
    features: List[int]

@app.post("/predict")
async def predict_questionnaire(data: QuestionnaireData):
    if qs_model is None:
        raise HTTPException(status_code=500, detail="Questionnaire model not loaded")
    
    try:
        # Convert features to numpy array
        features = np.array(data.features).reshape(1, -1)
        
        # Make prediction
        prediction = qs_model.predict(features)
        probability = qs_model.predict_proba(features)
        
        # Get the probability of autism
        autism_prob = probability[0][1]
        
        return {
            "prediction": "Autistic" if prediction[0] == 1 else "Non-Autistic",
            "autism_probability": f"{autism_prob:.2%}"
        }
    except Exception as e:
        logger.error(f"Error in questionnaire prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/")
async def predict_video(file: UploadFile = File(...)):
    if video_model is None or video_scaler is None or video_label_encoder is None:
        raise HTTPException(status_code=500, detail="Video prediction models not loaded")

    if not file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.wmv')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a video file.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    logger.info(f"Processing video: {file.filename}")
    
    try:
        # Save the uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Saved file to {file_path}")

        # Process the video
        cap = cv2.VideoCapture(file_path)
        if not cap.isOpened():
            raise HTTPException(status_code=400, detail="Could not open video file")

        frame_features = []
        frame_count = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Convert frame to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Extract statistical features
            mean_pixel = np.mean(gray)
            std_pixel = np.std(gray)

            frame_features.append([mean_pixel, std_pixel])
            frame_count += 1

        cap.release()
        logger.info(f"Processed {frame_count} frames")

        # Clean up the uploaded file
        os.remove(file_path)

        if not frame_features:
            raise HTTPException(status_code=400, detail="No frames could be extracted from the video")

        # Convert to DataFrame
        video_df = pd.DataFrame(frame_features, columns=['mean_pixel', 'std_pixel'])
        logger.info("Created features DataFrame")

        # Align feature names
        feature_names = list(video_scaler.feature_names_in_)
        video_df_full = pd.DataFrame(np.zeros((video_df.shape[0], len(feature_names))), columns=feature_names)

        if 'mean_pixel' in feature_names and 'std_pixel' in feature_names:
            video_df_full['mean_pixel'] = video_df['mean_pixel']
            video_df_full['std_pixel'] = video_df['std_pixel']

        # Standardize features
        video_df_scaled = video_scaler.transform(video_df_full)
        logger.info("Standardized features")

        # Make predictions
        y_video_pred = video_model.predict(video_df_scaled)
        predicted_classes = video_label_encoder.inverse_transform(y_video_pred)
        logger.info("Made predictions")

        # Aggregate predictions
        class_counts = Counter(predicted_classes)
        most_common_class = class_counts.most_common(1)[0][0]

        # Return result
        result = "Autistic" if most_common_class == "A" else "Non-Autistic"
        logger.info(f"Final prediction: {result}")
        return {"prediction": result}

    except Exception as e:
        logger.error(f"Error processing video: {str(e)}")
        # Clean up the uploaded file in case of error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    status = {
        "message": "Autism Prediction API is running",
        "video_models_loaded": video_model is not None and video_scaler is not None and video_label_encoder is not None,
        "questionnaire_model_loaded": qs_model is not None
    }
    return status 