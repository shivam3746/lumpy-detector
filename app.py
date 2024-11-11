from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io
from utils.preprocess import preprocess_image

app = Flask(__name__)

MODEL_PATH = "model/skin_model.h5"
model = load_model(MODEL_PATH)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    img = Image.open(file.stream)
    img_array = preprocess_image(img)
    prediction = model.predict(img_array)
    predicted_class = np.argmax(prediction, axis=-1).tolist()
    
    return jsonify({"predicted_class": predicted_class})

if __name__ == '__main__':
    app.run(debug=True)
