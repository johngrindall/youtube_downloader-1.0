#Imports
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, JsonResponse
from pytube import *
import random
import encodings
import os
from moviepy.editor import *
import base64

# Create your views here.

#View for retrieving title of video
def ajax(request):
	if request.method == "GET":

		#Use pytube to get video title
		YT_video = YouTube(request.GET['vid'])
		YT_name = YT_video.streams.get_lowest_resolution().title
		YT_author = YT_video.author

		#Return response
		data = {
		    'name': YT_name,
		    'author': YT_author,
	    }
		return JsonResponse(data, safe=False)

#For the home page
def home(request):

	#Method to process post request coming from index.html
	if request.method == "POST" and not request.POST.get('audio'):

		#If the request is for video

		#Generate a random video ID
		video_ID = "VIDEO_" + str(random.randint(1, 10000))

		#Retrieve YT link from form
		YT_link = request.POST['YT_link']
		YT_video = YouTube(YT_link)

		#Set video resolution
		YT_stream = YT_video.streams.filter(res=request.POST['quality']).first()

		#Activate download
		try:
			YT_stream.download('downloads', filename=video_ID)
		except:
			print("EXCEPTION")
			YT_stream = YT_video.streams.first().download('downloads', filename=video_ID)


		#Find file location
		YT_video_path = os.path.join('downloads', video_ID + ".mp4")

		#Attempt to send file to client side
		try:

			with open(YT_video_path, 'rb') as video_file:
				response = HttpResponse(video_file.read(), content_type='video/mp4')
				response['Content-Disposition'] = 'attachment; filename="%s"' % (video_ID + ".mp4")
			video_file.close

		except IOError:
			response = HttpResponseNotFound("<h1>" +YT_video_path+ "</h1>")

		#Delete the file on the server's file system
		os.remove(YT_video_path)

		return response
	elif request.method == "POST" and request.POST.get('audio'):

		#If the request is for audio

		#Generate a random audio ID
		audio_ID = "AUDIO_" + str(random.randint(1, 10000))

		#Retrieve youtube link from the form
		YT_link = request.POST['YT_link']
		YT_video = YouTube(YT_link)

		#Extract audio exclusively
		YT_audio = YT_video.streams.filter(only_audio=True).first()

		#Download the file
		YT_audio.download('downloads', audio_ID)

		#Generate a path for the downloaded
		YT_audio_path = os.path.join('downloads', audio_ID + ".mp4")
		YT_desired_path = os.path.join('downloads', audio_ID + ".mp3")

		#Change file extension to MP3
		os.rename(YT_audio_path, YT_desired_path)

		#Attempt to send file to client side
		try:

			with open(YT_desired_path, 'rb') as audio_file:
				response = HttpResponse(audio_file.read(), content_type='audio/mp3')
				response['Content-Disposition'] = 'attachment; filename="%s"' % (audio_ID + ".mp3")
			audio_file.close

		except IOError:
			response = HttpResponseNotFound("<h1>" +YT_desired_path+ "</h1>")

		#Delete the file on the server's file system
		os.remove(YT_desired_path)

		#Return file
		return response

	#Retrieve index.html from templates
	return render(request, 'index.html')
