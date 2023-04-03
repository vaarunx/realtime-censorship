from flask import Flask, request
from tensorflow.keras.models import load_model
import cv2
import numpy as np
import os
import requests
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

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
    #print('links = '+str(data))
    labels=[]
    for i in data:
        preprocessed_image = preprocess(i)
        if preprocessed_image == 'img not available':
            labels.append('img not found')
        else:
            #print('preprocessed image = '+str(preprocessed_image))
            result = model.predict(preprocessed_image) > 0.5
            #print('result = '+str(result))
            if result[0][0]:
                prediction='NSFW'
            else:
                prediction='Safe'
            labels.append(prediction)
            #print('prediction = '+prediction)
    unsafe_links = []
    print('labels: '+str(labels)+' len labels: '+str(len(labels))+' len data: '+str(len(data)))
    for i in range(len(data)):
        if labels[i] == 'NSFW':
            print(data[i])
            unsafe_links.append(data[i])
    print('unsafe links: '+str(unsafe_links))
    return unsafe_links