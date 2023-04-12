import numpy as np
import opennsfw2 as n2
from PIL import Image
import requests
from io import BytesIO

# Load and preprocess image.
img_url1 = 'https://i.imgur.com/6nZbEdk.jpg'
response1 = requests.get(img_url1, stream=True)
image_data1 = response1.content
pil_image = Image.open(BytesIO(image_data1))
image = n2.preprocess_image(pil_image, n2.Preprocessing.YAHOO)
# The preprocessed image is a NumPy array of shape (224, 224, 3).

# Create the model.
# By default, this call will search for the pre-trained weights file from path:
# $HOME/.opennsfw2/weights/open_nsfw_weights.h5
# If not exists, the file will be downloaded from this repository.
# The model is a `tf.keras.Model` object.
model = n2.make_open_nsfw_model()

# Make predictions.
inputs = np.expand_dims(image, axis=0)  # Add batch axis (for single image).
predictions = model.predict(inputs)

# The shape of predictions is (num_images, 2).
# Each row gives [sfw_probability, nsfw_probability] of an input image, e.g.:
sfw_probability, nsfw_probability = predictions[0]
print(sfw_probability, nsfw_probability)
