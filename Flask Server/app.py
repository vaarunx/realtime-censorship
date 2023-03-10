from flask import Flask, request
import json
import re
import joblib
from flask_cors import CORS
import os
# import shutil
import tensorflow as tf
# import pytorch
# import tensorflow_hub as hub
# import tensorflow_text as text
# from official.nlp import optimization 
# import matplotlib.pyplot as plt

from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

app = Flask(__name__)

CORS(app)
tokenizer = AutoTokenizer.from_pretrained("michellejieli/NSFW_text_classifier")
model = AutoModelForSequenceClassification.from_pretrained("michellejieli/NSFW_text_classifier")
classifier = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)



@app.route('/sendData', methods=['POST'])
def my_api_function():
    return 'array received'
    """ my_array = json.loads(request.data)
    pattern = r"<[^>]*>" """

    # finalText = [item for item in my_array if not re.search(pattern, item)]
    # finalText =  ['Tutorials', 'References', 'Exercises and Quizzes', 'HTML Tutorial', 'HTML is the standard markup language for Web pages.', 'With HTML you can create your own Website.', 'HTML is easy to learn - You will enjoy it!', 'Easy Learning with HTML "Try it Yourself"', 'Example', 'HTML Examples', 'Go to HTML Examples!', 'HTML Exercises', 'This HTML tutorial also contains nearly 100 HTML exercises.', 'Test Yourself With Exercises', 'Exercise:', 'Add a "tooltip" to the paragraph below with the text "About W3Schools".', 'Start the Exercise', 'HTML Quiz Test', 'Test your HTML skills with our HTML Quiz!', 'Start HTML Quiz!', 'My Learning', 'Track your progress with the free "My Learning" program here at W3Schools.', 'Log in to your account, and start earning points!', 'This is an optional feature. You can study W3Schools without using My Learning.', 'HTML References', 'Kickstart your career', 'Get certified by completing the HTML course', 'COLOR PICKER', 'LIKE US', 'Report Error', 'If you want to report an error, or if you want to make a suggestion, do not hesitate to send us an e-mail:', 'help@w3schools.com', 'Your Suggestion:', 'Thank You For Helping Us!', 'Your message has been sent to W3Schools.', 'Web Certificates' , 'Fuck you CJ, All you had to do was follow the damn train', "Bro what the actual heck is wrong with you?" , "Shit, I feel for you man"]
    # classifier = joblib.load('../bert-small-512-sentiment.sav')
    # prediction = classifier.predict(finalText)
    # print(prediction)
    # print("My Array " , my_array)

    """ saved_model_path = "../small-bert-512"
    print("Varun saying print something")
    reloaded_model = tf.saved_model.load(saved_model_path)
    reloaded_results = tf.sigmoid(reloaded_model(tf.constant(finalText)))
    print(reloaded_results)

    print(finalText)
 """
    """ labels=[]
    for i in reloaded_results:
        if i > 0.1:
            labels.append('pos')
        else:
            labels.append('neg')
    print(labels) """

#     def print_my_examples(inputs, results):
#   result_for_printing = \
# [f'input: {inputs[i]:<30} : score: {results[i][0]:.6f}'
#                          for i in range(len(inputs))]
#   print(*result_for_printing, sep='\n')
#   print()
# print_my_examples(examples, reloaded_results)
    
"""     tokenizer = AutoTokenizer.from_pretrained("michellejieli/NSFW_text_classifier")
    model = AutoModelForSequenceClassification.from_pretrained("michellejieli/NSFW_text_classifier")
    classifier = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
    print(classifier("And triple cheeseburgers. You could probably also add extra patties, I'm assuming. Never tried, but I doubt they would say no."))
    print(classifier("Exactly. Cause they'd feel like a fatass if they just ate it themselves. I'm sure Jesus is also involved since it is Good Friday.")) """
# return 'Array received'

@app.route("/" , methods = ["GET"])
def home():

    """
    tokenizer = AutoTokenizer.from_pretrained("michellejieli/NSFW_text_classifier")
    model = AutoModelForSequenceClassification.from_pretrained("michellejieli/NSFW_text_classifier")
    classifier = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)
    print(classifier("And triple cheeseburgers. You could probably also add extra patties, I'm assuming. Never tried, but I doubt they would say no."))
    print(classifier("Exactly. Cause they'd feel like a fatass if they just ate it themselves. I'm sure Jesus is also involved since it is Good Friday."))
     """
    return ("Hello, World!")

@app.route("/apiTesting" , methods = ["POST"])
def apiTesting():

    my_array = json.loads(request.data)
    # pattern = r"<[^>]*>"
    # print(my_array)

    # finalText = [item for item in my_array if not re.search(pattern, item)]
    # my_array = ["Fuck you man" , 'hello']

    pattern = r'<.*?>'
    pattern1 = r"<style>(.*?)</style>"

    finalText=[]
    finalText2=[]
    #text = ["<p>This is a <b>bold</b> statement.</p><style>body {background-color: yellow;}</style><div><h1>Heading</h1><p>Some text</p></div>", "Hi"]

    #print(re.sub(pattern1, '', text[0]))

    # Remove the opening and closing tags but leave the content inside
    for i in range(len(my_array)):
        cleaned = re.sub(pattern1, '', my_array[i])
        if(len(cleaned)>0):
            finalText.append(cleaned)

    for i in range(len(finalText)):
        cleaned = re.sub(pattern, '', finalText[i])
        if(len(cleaned)>0):
            finalText2.append(cleaned)

    # finalText = re.sub(pattern, '', my_array[0])

    print(finalText2)
    print(len(finalText2))

    for i in finalText2:
        print(classifier(i[:512]))

    # print("Thank You For Helping Us! -----> " , classifier("Thank You For Helping Us!"))

    # print("Shit, I feel for you man ---> " , classifier("Shit, I feel for you man"))

    # print("Bro what the actual heck is wrong with you? ---> " , classifier("Bro what the actual heck is wrong with you?"))

    return "hello"