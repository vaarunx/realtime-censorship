import cv2
import requests
import numpy as np
from PIL import Image
from io import BytesIO
import opennsfw2 as n2
import tensorflow as tf
from flask_cors import CORS
from flask import Flask, request

app = Flask(__name__)

CORS(app)

model = n2.make_open_nsfw_model()

@app.route("/")
def hello_world():
    return "<h1>Hello, World!</h1>"

@app.route("/imageclassify", methods=['POST'])
def imageclassify():
    data = request.get_json()
    #print('links = '+str(data))
    labels=[]
    for i in data:
        if 'http' in i:
            response = requests.get(i, stream=True)
            image_data = response.content

            pil_image = Image.open(BytesIO(image_data))
            image = n2.preprocess_image(pil_image, n2.Preprocessing.YAHOO)

            inputs = np.expand_dims(image, axis=0)
            predictions = model.predict(inputs)

            sfw_score, nsfw_score = predictions[0]
            # print(i, sfw_score, nsfw_score)

            if nsfw_score>sfw_score:
                prediction = 'NSFW'
            else:
                prediction = 'Safe'
            labels.append(prediction)

        else:
            labels.append('img not found')

    unsafe_links = []
    #print('labels: '+str(labels)+' len labels: '+str(len(labels))+' len data: '+str(len(data)))
    for i in range(len(data)):
        if labels[i] == 'NSFW':
            unsafe_links.append(data[i])
    #print('unsafe links: '+str(unsafe_links))
    return unsafe_links