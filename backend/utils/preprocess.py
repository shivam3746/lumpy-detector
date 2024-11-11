import numpy as np
from tensorflow.keras.preprocessing import image

def preprocess_image(img):
    img = img.resize((128, 128))  
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0) 
    return img_array
