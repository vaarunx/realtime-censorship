import requests
import numpy as np
import cv2
from classify_nsfw import main

img_url = 'https://burst.shopifycdn.com/photos/professional-man-portrait.jpg'
response = requests.get(img_url, stream=True)
image_data = response.content
result = main(image_data)

print(result)

result = result.split('\t')
nsfw_score = float(result[4])
sfw_score = float(result[2][:-1])
if nsfw_score>sfw_score:
    print('NSFW')
else:
    print('Safe')