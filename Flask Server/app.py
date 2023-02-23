from flask import Flask, request
import json
import re
import joblib
from flask_cors import CORS
 


app = Flask(__name__)

CORS(app)



@app.route('/sendData', methods=['POST'])
def my_api_function():
    my_array = json.loads(request.data)
    pattern = r"<[^>]*>"

    finalText = [item for item in my_array if not re.search(pattern, item)]


    classifier = joblib.load('../bert-small-512-sentiment.sav')
    prediction = classifier.predict(finalText)

    print(prediction)

    # print("My Array " , my_array)


    
    return 'Array received'


@app.route("/" , methods = ["GET"])
def home():
    return ("Hello WOrdle")