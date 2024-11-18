from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore
import numpy as np # type: ignore
from tensorflow.keras.models import load_model # type: ignore
from tensorflow.keras.preprocessing.image import img_to_array, load_img # type: ignore
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = "Simple_CNN_best_model.keras"
model = load_model(MODEL_PATH)

def preprocess_image(image_path):
    image = load_img(image_path, target_size=(224, 224))
    image = img_to_array(image) / 255.0  
    image = np.expand_dims(image, axis=0)
    return image

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files["file"]
    
    file_path = os.path.join("temp", file.filename)
    file.save(file_path)

    try:
        image = preprocess_image(file_path)
        prediction = model.predict(image)[0][0]
        label = "Lumpy Skin Disease" if prediction > 0.5 else "Normal Skin"
        confidence = round(float(prediction) * 100, 2) if prediction > 0.5 else round((1 - float(prediction)) * 100, 2)

        os.remove(file_path)

        return jsonify({"label": label, "confidence": f"{confidence}%"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    os.makedirs("temp", exist_ok=True)
    app.run(host="0.0.0.0", port=5000, debug=True)


