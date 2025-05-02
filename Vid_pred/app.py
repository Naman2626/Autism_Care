from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import joblib
import pandas as pd
from collections import Counter
import shutil
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the trained model and preprocessing tools
try:
    model = joblib.load("autism_model.pkl")
    scaler = joblib.load("scaler (2).pkl")
    label_encoder = joblib.load("label_encoder.pkl")
    logger.info("Successfully loaded all models")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    raise

# Create a FastAPI instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store uploaded files
UPLOAD_DIR = "uploaded_videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/predict/")
async def predict_video(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.wmv')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a video file.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    logger.info(f"Processing video: {file.filename}")
    
    # Save the uploaded file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Successfully saved file to {file_path}")
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not save uploaded file")

    try:
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
        logger.info(f"Processed {frame_count} frames from video")

        # Clean up the uploaded file
        os.remove(file_path)

        if not frame_features:
            raise HTTPException(status_code=400, detail="No frames could be extracted from the video")

        # Convert to DataFrame
        video_df = pd.DataFrame(frame_features, columns=['mean_pixel', 'std_pixel'])
        logger.info("Created features DataFrame")

        # Align feature names
        feature_names = list(scaler.feature_names_in_)
        video_df_full = pd.DataFrame(np.zeros((video_df.shape[0], len(feature_names))), columns=feature_names)

        if 'mean_pixel' in feature_names and 'std_pixel' in feature_names:
            video_df_full['mean_pixel'] = video_df['mean_pixel']
            video_df_full['std_pixel'] = video_df['std_pixel']

        # Standardize features
        video_df_scaled = scaler.transform(video_df_full)
        logger.info("Standardized features")

        # Make predictions
        y_video_pred = model.predict(video_df_scaled)
        predicted_classes = label_encoder.inverse_transform(y_video_pred)
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
    return {"message": "Video Prediction API is running"} 