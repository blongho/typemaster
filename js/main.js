/**
 * @file main.js
 * @author Bernard Che Longho (lobe1602) lobe1602@student.miun.se
 * @desc Javascript functions for typing game
 * @since 2018-01-05
 */

/**
 * A test object. It has the following characteristics <br>
 *     title    : The title of the text <br>
 *     author   : The author of the text <br>
 *     lang     : The language in which the text is written <br>
 *     text     : The text content <br>
 *     summary  : A summary of the Test object (author, words, characters)
 *
 * */
var Test = {
	title: "",
	author: "",
	lang: "",
	text: "",
	summary: function () {
		var words = this.text.split(" ").length;
		var characters = this.text.length;

		return (this.author + " (" + words + " words, " + characters +
			" chars)");
	}
};

var spanChars; // a list of all the test characters

var currentTestText = ""; // get the current text in the test area.
var tractTest = "";
var actionButtons = [];  // array that holds play/stop action buttons

var engTexts = [], // array to hold english texts
	sweTexts = []; // array to hold swedish texts

/**
 * Read xml file
 * texts.xml is parsed and every Test object is read.
 * English texts are stored in the engTexts array and Swedish texts are
 * stored in the sweTexts array
 * thanks to https://www.youtube.com/watch?v=3H0PNRXRUKw
 */
function loadTexts() {
	var xhr;

	if (window.XMLHttpRequest) {
		// code for modern browsers
		xhr = new XMLHttpRequest();
	} else {
		// code for old IE browsers
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var xmlDoc = xhr.responseXML;

			var object = xmlDoc.getElementsByTagName("object")[0];

			var titleList = object.getElementsByTagName("title");
			var authorList = object.getElementsByTagName("author");
			var texts = object.getElementsByTagName("text");
			var langList = object.getElementsByTagName("language");

			var len = texts.length;
			for (var i = 0; i < len; i++) {

				var test = Object.create(Test);

				test.title = titleList[i].firstChild.data;
				test.author = authorList[i].firstChild.data;
				test.lang = langList[i].firstChild.data;
				test.text = texts[i].firstChild.data;

				test.lang === "english" ? engTexts.push(test) :
					sweTexts.push(test);
			}
		}
	};
	xhr.open("GET", "texts.xml", false);
	xhr.send(null);
	//console.log(engTexts);
	//console.log(sweTexts);
}

/**
 * Get the language the user chose to type with
 * @returns {string|Number} The language of the text to display
 */
function selectedLanguage() {
	return document.settingsForm.interface.value;
}

/**
 * This function populates the test options as well as the test sample.<br>
 * If there are options in the options list, they are first cleared  and
 * <br> The options list is populated with texts based on the user language
 */
function addOptions() {
	var textOptions = document.getElementById("text");
	var arr = selectedLanguage() === "english" ? engTexts : sweTexts;

	// clear all options if there are any
	if (textOptions.length !== 0) textOptions.length = 0;

	for (var i = 0; i < arr.length; i++) {
		var option = document.createElement("option");
		if (arr[i].lang === selectedLanguage()) {
			option.value = arr[i].title;
			option.text = arr[i].title;
			textOptions.add(option);
		}
	}
	var choice = textOptions.options[textOptions.selectedIndex].value;
	addTestText(choice);
}

/**
 * Translate the interface to swedish if the language chosen is swedish
 */
function translateInterface() {
	var userText = document.getElementById("userText"); // placeholder for
                                                        // test
	var ignore = document.getElementById("caseLabel"); // ignore case label
	var swe = document.getElementById("swe"); // interface language
	var eng = document.getElementById("eng"); // interface language
	var langLabel = document.getElementById("langLabel"); // label for
                                                          // interface
	var textChoice = document.getElementById("choice"); // label for text
                                                        // choice
	var title = document.getElementById("title"); // app title
	var headTitle = document.getElementById("headTitle"); // window header

	switch (selectedLanguage().toLowerCase()) {
		case "swedish":
			ignore.innerHTML = "Ignorera versaler / gemener";
			swe.innerHTML = "Svenska";
			eng.innerHTML = "Engelska";
			langLabel.innerHTML = "Språk";
			textChoice.innerHTML = "Textväljare";
			userText.placeholder = "Skriv här ...";
			title.innerHTML = "Mäta din skrivhastighet och träffsäkerhet";
			headTitle.innerHTML = "Mäta din skrivhästighet";
			break;
		case "english":
			ignore.innerHTML = "Ignore case";
			swe.innerHTML = "Swedish";
			eng.innerHTML = "English";
			langLabel.innerHTML = "Language";
			userText.placeholder = "Type here ...";
			textChoice.innerHTML = "Text choice";
			title.innerHTML = "Measure your typing speed and accuracy";
			headTitle.innerHTML = "Measure your typing speed and accuracy";
			break;
	}
}

/**
 * This function fills the "test" area with the text title, author and
 * summary
 * @param option The option selected
 */
function addTestText(option) {
	var arr = selectedLanguage() === "english" ? engTexts : sweTexts;

	for (var i = 0; i < arr.length; i++) {
		if (option === arr[i].title) {
			var test = Object.create(Test);
			test = arr[i];
		}
	}
	resetGame();
	document.getElementById("testTitle").innerHTML = test.title;
	document.getElementById("authorAndStatistics").innerHTML =
		test.summary();
	document.getElementById("testContent").innerHTML = spanText(test.text);
	//document.getElementById("testContent").innerHTML = test.text;

	currentTestText = test.text;

	// get the list of all the characters and highlight first character
	spanChars = document.getElementsByClassName("char");
	spanChars[0].style.backgroundColor = "grey";
	tractTest = spanChars;
	//console.log(spanChars);
}

/**
 *Load action buttons for easy surfing later on
 */
function loadActionButtons() {
	var play = new Image();
	play.src = "img/play.png";
	play.alt = "play button";

	var stop = new Image();
	stop.src = "img/stop.png";
	stop.alt = "stop button";

	actionButtons.push(play);
	actionButtons.push(stop);
	console.log(actionButtons)
}

/**
 * Add appropriate text content in the test area based on user choice
 * When a user changes a text option, the appropriate texts is loaded
 */
function changeTest() {
	document.getElementById("text").addEventListener(
		"change", function () {
			var textOptions = document.getElementById("text");
			var choice = textOptions.options[textOptions.selectedIndex].value;
			addTestText(choice);
			resetGame();
		}, false);
}

/**
 * When a language button is clicked,
 * <ul>
 *     <li>Interface is translated to the selected language</li>
 *     <li>Options are loaded with sample test for the first options </li>
 * </ul>
 */
function languageChangeEvents() {
	var langOptions = document.settingsForm.interface;

	for (var i = 0; i < langOptions.length; i++) {
		langOptions[i].addEventListener("click", translateInterface, false);
		langOptions[i].addEventListener("click", addOptions, false);
		langOptions[i].addEventListener("click", resetGame, false);
	}
}

/**
 * Enclose every character of a string into a span
 * @param text Text whose characters will be spanned
 * @returns {string} The "spanned" string
 */
function spanText(text) {
	return "<span class='char'>" +
		text.split("").join("<\/span><span class='char'>") + "<\/span>";
}

/**
 * Change the action image from play to stop and vis-versa when user clicks
 * on the button
 */
function changeActionButton() {
	var action_button = document.getElementById("action_image");
	var action = action_button.alt.split(" ")[0];
	switch (action) {
		case "play":
			action_button.src = actionButtons[1].src;
			action_button.alt = actionButtons[1].alt;
			//continueGame();
			break;
		case "stop":
			action_button.src = actionButtons[0].src;
			action_button.alt = actionButtons[0].alt;
			//pauseGame();
			break;
	}

}

/**
 * Reset the action button to play
 */
function resetActionButton() {
	var actionImage = document.getElementById("action_image");
	if (actionButtons.length !== 0) {
		actionImage.src = actionButtons[0].src;
		actionImage.alt = actionButtons[0].alt;
	}
}

/**
 * Reset all game values
 */
function resetGame() {
	resetActionButton();
	resetStatistics();
}

/**
 * Dynamically set the date value in the footer section
 */
function fillDate() {
	document.getElementById("year").innerHTML =
		new Date().getFullYear().toString();
}

/**
 * All events and stored here to be loaded at program start
 */
function init() {
	fillDate();
	loadTexts();
	addOptions();
	loadActionButtons();
	resetGame();
	changeTest();
	languageChangeEvents();
	translateInterface();
	document.getElementById("action_image").addEventListener(
		"click", changeActionButton, true);
}

window.addEventListener("load", init, false);