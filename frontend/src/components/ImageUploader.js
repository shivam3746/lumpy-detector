import React, { useState } from 'react';
import axios from 'axios';

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      console.error("No file selected");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setPrediction(response.data.predicted_class);
    } catch (error) {
      console.error("Error uploading the image:", error);
      alert("Failed to get a prediction. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Upload an Image for Prediction</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
        Predict
      </button>
      {prediction !== null && (
        <div style={{ marginTop: "20px" }}>
          <h3>Prediction Result: {prediction}</h3>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
