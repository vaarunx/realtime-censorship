#!/usr/bin/env python
import sys
import argparse
import tensorflow as tf

from model import OpenNsfwModel, InputType
from image_utils import create_tensorflow_image_loader
from image_utils import create_yahoo_image_loader

import requests
import numpy as np


IMAGE_LOADER_TENSORFLOW = "tensorflow"
IMAGE_LOADER_YAHOO = "yahoo"


# def main(argv):
    # parser = argparse.ArgumentParser()

    # parser.add_argument("input_file", help="Path to the input image.\
    #                     Only jpeg images are supported.")

    # parser.add_argument("-m", "--model_weights", required=True,
    #                     help="Path to trained model weights file")

    # parser.add_argument("-l", "--image_loader",
    #                     default=IMAGE_LOADER_YAHOO,
    #                     help="image loading mechanism",
    #                     choices=[IMAGE_LOADER_YAHOO, IMAGE_LOADER_TENSORFLOW])

    # parser.add_argument("-i", "--input_type",
    #                     default=InputType.TENSOR.name.lower(),
    #                     help="input type",
    #                     choices=[InputType.TENSOR.name.lower(),
    #                              InputType.BASE64_JPEG.name.lower()])

    # args = parser.parse_args()
def main(img_data):
    model = OpenNsfwModel()

    with tf.compat.v1.Session() as sess:

        input_type = InputType['BASE64_JPEG']
        model.build(weights_path='./open_nsfw-weights.npy', input_type=input_type)

        fn_load_image = None

        # if input_type == InputType.TENSOR:
        #     if args.image_loader == IMAGE_LOADER_TENSORFLOW:
        #         fn_load_image = create_tensorflow_image_loader(tf.Session(graph=tf.Graph()))
        #     else:
        #         fn_load_image = create_yahoo_image_loader()
        # elif input_type == InputType.BASE64_JPEG:
        #     import base64
        #     fn_load_image = lambda filename: np.array([base64.urlsafe_b64encode(open(filename, "rb").read())])

        import base64
        fn_load_image = lambda filename: np.array([base64.urlsafe_b64encode(filename)])

        sess.run(tf.compat.v1.global_variables_initializer())

        image = fn_load_image(img_data)

        predictions = \
            sess.run(model.predictions,
                     feed_dict={model.input: image})

        # print("Results for '{}'".format(args.input_file))
        # print("\tSFW score:\t{}\n\tNSFW score:\t{}".format(*predictions[0]))

        result = "\tSFW score:\t{}\n\tNSFW score:\t{}".format(*predictions[0])

        return result

if __name__ == "__main__":
    main(sys.argv)
