import numpy as np
import opennsfw2 as n2
from PIL import Image
import requests
from io import BytesIO

img_url1 = 'https://i.imgur.com/6nZbEdk.jpg'
response1 = requests.get(img_url1, stream=True)
image_data1 = response1.content

pil_image = Image.open(BytesIO(image_data1))
image = n2.preprocess_image(pil_image, n2.Preprocessing.YAHOO)

model = n2.make_open_nsfw_model()

inputs = np.expand_dims(image, axis=0)
predictions = model.predict(inputs)

sfw_probability, nsfw_probability = predictions[0]
print(sfw_probability, nsfw_probability)

if sfw_probability>nsfw_probability:
    print('Safe')
else:
    print('NSFW')