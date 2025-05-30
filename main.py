import os
import joblib
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import pandas as pd
from collections import Counter
import shutil
from typing import List
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Update CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define paths
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "qs_pred", "random_forest_model.pkl")
scaler_path = os.path.join(current_dir, "qs_pred", "scaler.pkl")

# Load model and scaler
try:
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
except Exception as e:
    print(f"Error loading model: {str(e)}")
    raise

# ✅ Define input format
class AutismInput(BaseModel):
    features: list

# ✅ Prediction endpoint
@app.post("/predict")
async def predict_autism(data: AutismInput):
    try:
        # Validate input length
        if len(data.features) != 31:
            raise HTTPException(
                status_code=400, 
                detail="Input must contain exactly 31 features"
            )

        # Convert input to numpy array
        input_data = np.array(data.features).reshape(1, -1)
        
        # Scale input
        input_scaled = scaler.transform(input_data)
        
        # Make prediction
        prediction = model.predict(input_scaled)[0]
        probability = model.predict_proba(input_scaled)[0][1] * 100
        
        return {
            "prediction": "Autistic" if prediction == 1 else "Not Autistic",
            "autism_probability": f"{probability:.2f}%"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Add a root endpoint for testing
@app.get("/")
async def root():
    return {"message": "Autism Prediction API is running"}

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
