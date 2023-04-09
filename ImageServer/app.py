from flask import Flask, request
from tensorflow.keras.models import load_model
import cv2
import numpy as np
import os
import requests
from classify_nsfw import main
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

def preprocess(file):
    try:
        response = requests.get(file, stream=True)
        image_data = response.content
        return image_data
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
            result = main(preprocessed_image)
            #print('result = '+str(result))
            result = result.split('\t')
            nsfw_score = float(result[4])
            sfw_score = float(result[2][:-1])
            if nsfw_score>sfw_score:
                prediction = 'NSFW'
            else:
                prediction = 'Safe'
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