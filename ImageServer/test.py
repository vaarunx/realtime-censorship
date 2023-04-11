import requests
import numpy as np
import cv2
import base64
from classify_nsfw import main
import tensorflow as tf

from model import OpenNsfwModel, InputType
from image_utils import create_tensorflow_image_loader
from image_utils import create_yahoo_image_loader

IMAGE_LOADER_TENSORFLOW = "tensorflow"
IMAGE_LOADER_YAHOO = "yahoo"

img_url = 'https://burst.shopifycdn.com/photos/professional-man-portrait.jpg'
# response = requests.get(img_url, stream=True)
# image_data = response.content
# # result = main(image_data)

# # print(result)

# # result = result.split('\t')
# # nsfw_score = float(result[4])
# # sfw_score = float(result[2][:-1])
# # if nsfw_score>sfw_score:
# #     print('NSFW')
# # else:
# #     print('Safe')

# model = OpenNsfwModel()

# input_type = InputType['BASE64_JPEG']
# model.build(weights_path='./open_nsfw-weights.npy', input_type=input_type)

# with tf.compat.v1.Session() as sess:

#     fn_load_image = lambda filename: np.array([base64.urlsafe_b64encode(filename)])
#     sess.run(tf.compat.v1.global_variables_initializer())
#     image = fn_load_image(image_data)
#     predictions = sess.run(model.predictions,feed_dict={model.input: image})
#     result = "\tSFW score:\t{}\n\tNSFW score:\t{}".format(*predictions[0])

#     print(result)

#     predictions = sess.run(model.predictions,feed_dict={model.input: image})

#     result = "\tSFW score:\t{}\n\tNSFW score:\t{}".format(*predictions[0])

#     print(result)

print('http' in img_url)