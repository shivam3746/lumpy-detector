import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  CardMedia,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

const Input = styled('input')({
  display: 'none',
});

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please upload an image!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setLoading(true);
      const response = await axios.post(
        'http://127.0.0.1:5000/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setLoading(false);
      setResult(response.data);
    } catch (error) {
      setLoading(false);
      console.error('Error occurred while submitting the image:', error);
      alert('Failed to get prediction. Please try again!');
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setResult(null); // Clear previous result
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #3e8fc6, #13dbdb)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container
        maxWidth="sm"
        style={{
          // marginTop: "50px",
          textAlign: 'center',
          paddingTop: '100px',
          paddingBottom: '100px',
          background: 'white',
          borderRadius: '20px',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Lumpy Skin Disease Detector
        </Typography>

        <Box mt={4} mb={2}>
          <label htmlFor="file-upload">
            <Input
              accept="image/*"
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <Button
              variant="contained"
              component="span"
              sx={{ textTransform: 'none' }}
            >
              Upload Image
            </Button>
          </label>
        </Box>

        {imagePreview && (
          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              Selected File Preview:
            </Typography>
            <CardMedia
              component="img"
              image={imagePreview}
              alt="Selected Image"
              style={{ maxHeight: '300px', objectFit: 'contain' }}
            />
            <IconButton
              onClick={handleRemoveImage}
              aria-label="delete"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#ffffff',
                '&:hover': {
                  backgroundColor: '#ffcccc',
                },
              }}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        )}

        {selectedFile && (
          <Typography variant="body1" gutterBottom>
            File: {selectedFile.name}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ marginTop: '20px', textTransform: 'none' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>

        {result && (
          <Box mt={4}>
            <Typography variant="h4" gutterBottom>
              Prediction Result:
            </Typography>
            <Typography variant="h5">Label: {result.label}</Typography>
            <Typography variant="h5">
              Confidence: {result.confidence}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ImageUploader;
