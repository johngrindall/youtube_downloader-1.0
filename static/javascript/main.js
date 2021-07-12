//Function that uses AJAX to request and load channel and title into the page
function updateTitle(videoLink){

	//Open a new xhttp request
	var xhttp = new XMLHttpRequest();

	//Function for state change
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			response_obj = JSON.parse(this.response);
			document.getElementById("primary-title").innerHTML = response_obj.name;
			document.getElementById("author").innerHTML = response_obj.author;
		}
	};

	xhttp.open("GET", "/title?vid=" + videoLink, false);
	xhttp.send(null);

}

//Function that is called when the submission button is clicked
function slideUp(e){

	//Select modal, modal overlay, thumbnail img and search input 
	var modal_overlay = document.getElementById("modal-overlay");
	var modal = document.getElementById("modal");
	var thumbnail = document.getElementById("thumbnail");
	var search_bar = document.getElementById("link");

	//Change thumbnail src
	var current_link = search_bar.value;
	var youtube_id = current_link.substring(current_link.indexOf("=") + 1, current_link.length);

	//Retrieve image object
	var thumbnail_image = new Image();
	var localstore = false;
	thumbnail_image.src = "http://img.youtube.com/vi/" + youtube_id + "/mqdefault.jpg";

	thumbnail_image.onload = function(){
		console.log(this.width);
		if(this.width == 120){
			document.getElementById("submission-button").onclick = null;
			document.getElementById("submission-button").classList.add("shaking-button");
			setTimeout(function(){ 
				document.getElementById("submission-button").classList.remove("shaking-button");
				alert("Enter A Valid Link");
			}, 300)
			document.getElementById("submission-button").onclick = slideUp;
			return;
		}

		//If search bar is empty then alert user and end function
		if(search_bar.value.replace(/\s/g, '') == ""){
			alert("Type a valid YouTube link and then press download");
			return;
		}

		//Engage glowing animation
		document.getElementById("submission-button").classList.add("glow-button");

		console.log(youtube_id + ":ID");
		var src_string = "http://img.youtube.com/vi/" + youtube_id + "/maxresdefault.jpg";
		var alt_string = "http://img.youtube.com/vi/" + youtube_id + "/mqdefault.jpg";
		thumbnail.onerror = function(){
			thumbnail.src = alt_string;
		}
		thumbnail.src = src_string;

		//Retrieve title and update title div
		updateTitle(current_link);

		//Enable form submission
		document.getElementById("main-form").action = "";

		//Reassign classes
		modal.style.visibility = "visible";
		modal.classList.add('visible-modal');
		modal_overlay.style.visibility = "visible";
		modal_overlay.onclick = slideDown;

		//Disengage glowing animation
		document.getElementById("submission-button").classList.remove("glow-button");

	}

}

//Function that hides the modal after exit
function slideDown(e){

	console.log("REMOVING");

	//Hide modal
	var modal = document.getElementById("modal");
	modal.classList.remove('visible-modal');
	modal.classList.add("invisible-modal");

	//Hide modal overlay
	var modal_overlay = document.getElementById("modal-overlay");
	modal_overlay.style.visibility = "hidden";
	modal_overlay.onclick = null;

	//Disable form submission
	document.getElementById("main-form").action = "javascript:void(0)";

}

//Function that sets the currently focused tile to an Mp3 tile
function setMp3(e){

	//Remove focused class from the mp4 tile and add unfocused class
	var mp4_tile = document.getElementById("right-tile");
	mp4_tile.classList.remove("focused-tile");
	mp4_tile.classList.add("unfocused-tile");

	//Add focused tile class to mp3 tile
	var mp3_tile = document.getElementById("left-tile");
	mp3_tile.classList.add("focused-tile");
	mp3_tile.classList.remove("unfocused-tile");

	//Toggle checkbox
	document.getElementById("audio").checked = true;

	//Disable the quality selector
	document.getElementById("quality-selector").disabled = true;
}

//Function that sets the currently focused tile to an Mp4 tile
function setMp4(e){

	//Remove focused class from the mp3 tile and add unfocused class
	var mp4_tile = document.getElementById("right-tile");
	mp4_tile.classList.add("focused-tile");
	mp4_tile.classList.remove("unfocused-tile");

	//Add focused tile class to mp4 tile
	var mp3_tile = document.getElementById("left-tile");
	mp3_tile.classList.remove("focused-tile");
	mp3_tile.classList.add("unfocused-tile");

	//Toggle checkbox
	document.getElementById("audio").checked = false;

	//Enable the quality selector
	document.getElementById("quality-selector").disabled = false;

}

//Function to hide the clip div
function settingsHide(e){

	//Select the clip div
	var settings_div = document.getElementById("settings-sidebar");

	//Add clip-div-hidden to the classlist and remove class-list-shown
	settings_div.classList.add("settings-hidden");
	settings_div.classList.remove("settings-shown");

	//Z index change
	document.getElementById("modal-overlay").style.zIndex = 10000; 

	//Set modal action
	var modal_overlay = document.getElementById("modal-overlay");
	modal_overlay.onclick = slideDown;


}

//Function that unhides the clip div
function settingsShow(e){

	console.log("SHOWING SETTINGS DIV");

	//Select the clip div
	var settings_div = document.getElementById("settings-sidebar");

	//Add clip-div-shown to the classlist and remove class-list-hidden
	settings_div.classList.add("settings-shown");
	settings_div.classList.remove("settings-hidden");

	//Z index change
	document.getElementById("modal-overlay").style.zIndex = 40000; 

	//Set modal action
	var modal_overlay = document.getElementById("modal-overlay");
	modal_overlay.onclick = settingsHide;

}

//Function that pastes contents and hits go.
async function pasteFunction() {

	//Paste and hit go
	try {
		const text = await navigator.clipboard.readText();
		document.getElementById("link").value = text;
		slideUp()
	} catch (err) {
		console.error('Failed to read clipboard contents: ', err);
	}

}

//Select the button which pulls up the modal
window.onload = function(){

	//Set click events of all relevant
	var submission_button = document.getElementById("submission-button");
	submission_button.onclick = slideUp;

	var modal_overlay = document.getElementById("modal-overlay");
	var modal_exit = document.getElementById("modal-exit");
	modal_exit.onclick = slideDown;

	var mp3_tile = document.getElementById("left-tile");
	var mp4_tile = document.getElementById("right-tile");
	mp3_tile.onclick = setMp3;
	mp4_tile.onclick = setMp4;

	var modal_settings = document.getElementById("modal-settings");
	modal_settings.onclick = settingsShow; 

	var paste_button = document.getElementById("paste-link-button");
	paste_button.onclick = pasteFunction;

	console.log("Main.js Loaded");

}



