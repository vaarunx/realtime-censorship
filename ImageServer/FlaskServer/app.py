from flask import Flask, request
from tensorflow.keras.models import load_model
import cv2
import numpy as np
import os
import requests

app = Flask(__name__)

model = load_model('nsfw_classifier.h5')

def preprocess(file):
    try:
        response  = requests.get(file, stream=True)
        arr = np.asarray(bytearray(response.content), dtype=np.uint8)
        img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        test_img_re = cv2.resize(img, (306, 306), interpolation=cv2.INTER_AREA)
        test_img = np.expand_dims(test_img_re, axis=0)
        return test_img
    except:
        return 'img not available'
    
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/imageclassify", methods=['POST'])
def imageclassify():
    data = request.get_json()
    links = data['links']
    labels=[]
    for i in links:
        preprocessed_image = preprocess(i)
        #print('preprocessed image'+str(preprocessed_image))
        result = model.predict(preprocessed_image) > 0.5
        #print('result'+str(result))
        if result[0][0]:
            prediction='NSFW'
        else:
            prediction='Safe'
        labels.append(prediction)
        #print('prediction'+prediction)
    unsafe_links = []
    for i in range(len(links)):
        if labels[i] == 'NSFW':
            unsafe_links.append(links[i])
    return unsafe_links