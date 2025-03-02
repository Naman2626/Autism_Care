import os
import joblib
import numpy as np
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# ✅ Define the path to the 'qs_pred' directory
qs_pred_path = os.path.join(os.getcwd(), "qs_pred")

# ✅ Define paths for model and scaler
model_path = os.path.join(qs_pred_path, "random_forest_model.pkl")
scaler_path = os.path.join(qs_pred_path, "scaler.pkl")

# ✅ Check if files exist before loading
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found: {model_path}")

if not os.path.exists(scaler_path):
    raise FileNotFoundError(f"Scaler file not found: {scaler_path}")

# ✅ Load the model and scaler
model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

# ✅ Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Define input format
class AutismInput(BaseModel):
    features: list

# ✅ Prediction endpoint
@app.post("/predict")
async def predict_autism(data: AutismInput):
    try:
        # Convert input to NumPy array
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
