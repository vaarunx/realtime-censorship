from flask import Flask, request
import json
from flask_cors import CORS


app = Flask(__name__)

CORS(app)

# <[^>]*>


@app.route('/sendData', methods=['POST'])
def my_api_function():
    my_array = json.loads(request.data)
    print(my_array)
    
    return 'Array received'


@app.route("/" , methods = ["GET"])
def home():
    return ("Hello WOrdle")