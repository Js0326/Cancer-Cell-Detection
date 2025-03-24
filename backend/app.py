import onnxruntime as ort
import numpy as np
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io
from PIL import Image
import time
import os
import json
import torch
import torchvision.transforms as transforms

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load ONNX Model
MODEL_PATH = os.path.abspath("C:/Users/KIIT/Documents/AD/Cancer Cell Detection/backend/swin_model.onnx")
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model '{MODEL_PATH}' not found.")

session = ort.InferenceSession(MODEL_PATH, providers=["CPUExecutionProvider"])
print("ONNX model loaded!")

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
])

# Store results in memory (in a real app, this would be a database)
results_store = {}

def preprocess_image(file):
    """Preprocess the uploaded image to match ONNX model input format."""
    file.seek(0)
    image_data = file.read()
    image = Image.open(io.BytesIO(image_data)).convert("RGB")

    # Get original image metadata
    metadata = {
        "resolution": f"{image.width}×{image.height}",
        "format": file.filename.split('.')[-1].upper(),
        "size": f"{round(len(image_data) / (1024 * 1024), 2)} MB",
        "color_space": image.mode
    }

    # Apply the same preprocessing as the original implementation
    image = transform(image)
    image = image.unsqueeze(0).numpy()

    return image, metadata, image_data

def predict(image):
    input_name = session.get_inputs()[0].name
    outputs = session.run(None, {input_name: image})[0]

    probabilities = torch.nn.functional.softmax(torch.tensor(outputs), dim=1)
    predicted_class = torch.argmax(probabilities, dim=1).item()
    
    class_labels = {0: "Benign", 1: "Malignant"}
    
    return {
        "prediction": class_labels[predicted_class],
        "confidence": float(probabilities[0, predicted_class])
    }

@app.route("/predict", methods=["POST"])
def predict_route():
    try:
        start_time = time.time()
        
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files["file"]
        image, metadata, image_data = preprocess_image(file)

        # Get prediction using the original predict function
        result = predict(image)

        # Calculate processing time
        processing_time = round(time.time() - start_time, 2)

        # Generate a result ID
        result_id = f"result_{len(results_store) + 1}"

        # Store the result
        result_data = {
            "id": result_id,
            "prediction": result["prediction"],
            "confidence": round(result["confidence"] * 100, 2),  # Convert to percentage
            "processing_time": processing_time,
            "image_metadata": metadata,
            "filename": file.filename,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        results_store[result_id] = result_data

        return jsonify(result_data)

    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

@app.route("/results/<result_id>", methods=["GET"])
def get_result(result_id):
    """Fetch a specific result by ID."""
    if result_id not in results_store:
        return jsonify({"error": "Result not found"}), 404
    
    return jsonify(results_store[result_id])

if __name__ == "__main__":
    app.run(debug=True)
