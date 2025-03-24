import os
import onnxruntime as ort
import numpy as np
from PIL import Image
import torch
import torchvision.transforms as transforms

# 🔍 Define the ONNX model path
model_path = "C:/Users/KIIT/Documents/AD/Cancer Cell Detection/backend/swin_model.onnx"

# ✅ Debugging: Print the expected absolute path
print(f" Looking for model at: {os.path.abspath(model_path)}")

# ✅ Check if the file exists before proceeding
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file '{model_path}' not found. Please check the path.")

# ✅ Load the ONNX model
session = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])
print("ONNX model loaded successfully!")

# 🔄 Define image preprocessing (should match training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Swin Transformer typically expects 224x224
    transforms.ToTensor(),
    transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])  # Normalize across RGB channels
])

def preprocess_image(image_path):
    """Loads an image and applies necessary transformations."""
    if not os.path.exists(image_path):
        raise FileNotFoundError(f" Image file '{image_path}' not found.")

    image = Image.open(image_path).convert("RGB")  # Open image
    image = transform(image)  # Apply transformations
    image = image.unsqueeze(0).numpy()  # Add batch dimension & convert to NumPy
    return image

def predict(image_path):
    """Runs inference on the given image and returns the prediction."""
    image = preprocess_image(image_path)

    # 🔥 Fix: Swin Transformer ONNX models use "pixel_values" or "images" as input keys
    input_name = session.get_inputs()[0].name  # Automatically get correct input name

    # Run inference
    outputs = session.run(None, {input_name: image})[0]  # ✅ Fix: Use dynamic input name
    
    # Convert logits to probabilities (Softmax)
    probabilities = torch.nn.functional.softmax(torch.tensor(outputs), dim=1)
    
    # Get the predicted class
    predicted_class = torch.argmax(probabilities, dim=1).item()

    # Class labels (Modify if needed)
    class_labels = {0: "Benign", 1: "Malignant"}
    
    return class_labels[predicted_class], probabilities.numpy()

# 🎯 Example usage (Replace with your image path)
image_path = "C:/Users/KIIT/Documents/AD/Cancer Cell Detection/backend/test.png"  # Update this with your actual image path
if os.path.exists(image_path):
    prediction, probs = predict(image_path)
    print(f"Prediction: {prediction} (Confidence: {probs.max():.4f})")
else:
    print(f"Image file '{image_path}' not found. Provide a valid image.")
