import onnxruntime as ort
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import io
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load ONNX Model
ort_session = ort.InferenceSession("C:/Users/KIIT/Documents/AD/Cancer Cell Detection/backend/swin_model.onnx")

# Get input name dynamically (to avoid missing key issue)
input_name = ort_session.get_inputs()[0].name

def preprocess_image(file):
    """Preprocess the uploaded image to match ONNX model input format."""
    file.seek(0)
    image = Image.open(io.BytesIO(file.read())).convert("RGB")

    # Resize to match the input size expected by the model
    image = image.resize((224, 224))

    # Convert image to NumPy array
    image = np.array(image).astype(np.float32) / 255.0  # Normalize [0,1]
    image = (image - 0.5) / 0.5  # Normalize to [-1,1]

    # Convert HWC to CHW format (ONNX requires channels first)
    image = np.transpose(image, (2, 0, 1))

    # Add batch dimension
    image = np.expand_dims(image, axis=0)

    return image

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files["file"]
        image = preprocess_image(file)

        # Run ONNX Model
        result = ort_session.run(None, {input_name: image})[0]

        # Convert output to confidence score
        confidence = float(1 / (1 + np.exp(-result[0][0]))) * 100
        prediction = "Malignant" if confidence > 50 else "Benign"

        return jsonify({"prediction": prediction, "confidence": round(confidence, 2)})

    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
