import os
import sys
import time
import json
import Image
import urllib, cStringIO
from os.path import splitext
from PIL import ImageEnhance
from selenium import webdriver
from pyvirtualdisplay import Display
try:
    from urllib.parse import urlparse
except ImportError:
     from urlparse import urlparse
from selenium.webdriver.common.keys import Keys
display = Display(visible=0, size=(1366, 720))
display.start()

google_img_links = []
local_links = []
to_search = sys.argv[1]
request_id = sys.argv[2]
print request_id
chromedriver = "/home/g1ji/bin/chromedriver"
driver = webdriver.Chrome(chromedriver)
driver.get("https://images.google.com")
#assert "Python" in driver.title
elem = driver.find_element_by_id("lst-ib")
elem.clear()
elem.send_keys(to_search)
elem.send_keys(Keys.RETURN)
time.sleep(2)
imagesLink = []
images = driver.find_elements_by_css_selector('a[jsname="hSRGPd"]')
for index,img in enumerate(images):
	if index <15 :
		try:
			img_link = img.get_attribute('href')
			imagesLink.append(img_link)
		except:
			print 'Unable to parse the image url'
image_dir = "./public/upload/"+request_id
if not os.path.exists(image_dir):
    os.makedirs(image_dir)
for index,img_link in enumerate(imagesLink):
	try:
		driver.get(img_link)
		img_element = driver.find_element_by_css_selector('img[class="irc_mi"]')
		image_url = img_element.get_attribute('src')
		google_img_links.append(image_url)
		path = urlparse(image_url).path
		file_name = str(int(time.time()))
		# ext = splitext(path)[1]
		file = cStringIO.StringIO(urllib.urlopen(image_url).read())
		img = Image.open(file)
		img = img.convert('LA')
		img.save(image_dir+"/"+file_name+".png")
		local_links.append('/upload/'+request_id+"/"+file_name +'.png')
	except:
		print 'Unable to apply filter on image'	
		local_links.append('images/G1JI_BOT.jpg')

with open(image_dir+"/google_img_links.txt", 'w') as outfile:
    json.dump(google_img_links, outfile)

with open(image_dir+"/local_links.txt", 'w') as outfile:
    json.dump(local_links, outfile)
    
driver.close()
display.stop()

