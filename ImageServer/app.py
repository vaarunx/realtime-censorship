
from flask import Flask, request
from tensorflow.keras.models import load_model
import cv2
import numpy as np
import os
import requests
from flask_cors import CORS

import base64
import tensorflow as tf
from model import OpenNsfwModel, InputType
from image_utils import create_yahoo_image_loader
from image_utils import create_tensorflow_image_loader

IMAGE_LOADER_TENSORFLOW = "tensorflow"
IMAGE_LOADER_YAHOO = "yahoo"

app = Flask(__name__)

CORS(app)

# Building Model
                
def preprocess(file):
    response = requests.get(file, stream=True)
    return response.content
    
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/imageclassify", methods=['POST'])
def imageclassify():
    data = request.get_json()
    #print('links = '+str(data))
    labels=[]
    for i in data:
        if 'http' in i:
            model = OpenNsfwModel()
            input_type = InputType['BASE64_JPEG']
            model.build(weights_path='./open_nsfw-weights.npy', input_type=input_type)
            fn_load_image = lambda filename: np.array([base64.urlsafe_b64encode(filename)])
            response = requests.get(i, stream=True)
            preprocessed_image = response.content
            #print('preprocessed image = '+str(preprocessed_image))
            image = fn_load_image(preprocessed_image)
            print(type(preprocessed_image))
            print(type(image))
            predictions = model.predict(image)
            result = "\tSFW score:\t{}\n\tNSFW score:\t{}".format(*predictions[0])
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
            sess.close()
            tf.compat.v1.reset_default_graph()
        else:
            labels.append('img not found')
    unsafe_links = []
    print('labels: '+str(labels)+' len labels: '+str(len(labels))+' len data: '+str(len(data)))
    for i in range(len(data)):
        if labels[i] == 'NSFW':
            print(data[i])
            unsafe_links.append(data[i])
    print('unsafe links: '+str(unsafe_links))
    return unsafe_links