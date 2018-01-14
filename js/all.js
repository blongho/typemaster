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
var minutes = 0;
var startTime = 0;
var endTime = 0;
var typedIndex = 0; // index of currently typed text
var trackingIndex = typedIndex + 1; // index of test text
var typedEntries = 0;
var errorEntries = 0;
var correctEntries = 0;
var sec = 0;

const maxTime = 300;    // maximum time for the game (5 minutes)
const alertTime = 5; // Time to display telling the user that test is on

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
	resetGame();
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
	resetGame();

}

/**
 *Load action buttons for easy surfing later on
 */
function loadActionButtons() {
	var play = new Image();
	play.src = "img/play.png";
	play.alt = "play button";
	play.title = "Start play again";

	var stop = new Image();
	stop.src = "img/stop.png";
	stop.alt = "stop button";
	stop.title = "Stop the game";

	var reset = new Image();
	reset.src = "img/reset.png";
	reset.alt = "reset button";
	reset.title = "Reset the game";

	actionButtons.push(play);
	actionButtons.push(stop);
	actionButtons.push(reset);
	//console.log(actionButtons)
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
		actionImage.title = actionButtons[0].title;
	}
}

/**
 * Reset all game values
 */
function resetGame() {
	document.getElementById("testInfo").style.display = "none";
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
 * @file testStuff.js
 * @author Bernard Che Longho (lobe1602) lobe1602[at]student.miun.se <br />
 * @desc File with js functions that handle the typing tracking and results
 * display
 */

/**
 * End game
 * Disable input area and give it another color
 */
function endGame() {
	var actionImage = document.getElementById("action_image");
	var userText = document.getElementById("userText");
	userText.placeholder = "";
	userText.value = "GAME ENDED";
	userText.style.backgroundColor = "#ff794d";
	userText.disabled = true;
	document.getElementById("endSound").play();
	actionImage.src = actionButtons[2].src;
	actionImage.alt = actionButtons[2].alt;
	actionImage.title = actionButtons[2].title;
	actionImage.style.width = 80;
}

/**
 * Dynamically update statistics as the user types
 * @param typed Number of entries typed
 * @param correct Number of correct entries typed
 * @param errors Number of mis-match entries typed
 * @param time Time elapsed since typing started.
 */

function updateStatistics(typed, correct, errors, time) {
	document.getElementById("errors").innerHTML = errors;
	document.getElementById("accuracy").innerHTML =
		(correct / tractTest.length * 100).toFixed();

	var gross = (typed / 5) / time;
	document.getElementById("grossWPM").innerHTML = gross.toFixed();

	document.getElementById("netWPM").innerHTML =
		(gross - (errors / time)).toFixed();

	//console.log("Value of time is " + time*60);
}

/**
 * Compare two characters. <br/>
 * Checks if "Ignore case" is checked. <br/>
 * If checked, a case-insensitive comparison is done otherwise normal comparison
 * @param c1 Character1 to compare
 * @param c2 Character2 to compare
 * @returns {boolean} true if they are the same characters
 */
function isSameChar(c1, c2) {
	if (document.settingsForm.case.checked) {
		return c1.toLowerCase() === c2.toLowerCase();
	}
	return c1 === c2;
}

/**
 * As the user types <br/>
 * The typed char is compared with that of the test text. Consideration is
 * taken<br/> whether the user wants to ignore the case or not by calling
 * the <code>compareCase()</code> function<br/>
 * If chars are equal, the correct and error counts are updated dynamically
 * based <br/>whether or not the chars are equal.
 * Input field is disabled when all text is highlighted.
 */
function runTest() {
	var timer = document.getElementById("timer");
	var userText = document.getElementById("userText");
	var briefInfo = document.getElementById("testInfo");

	userText.addEventListener("input", function () {
		var input = document.getElementById("userText").value;

		typedEntries++;

		var typedChar = input[input.length - 1]; // the just typed char

		var testChar = tractTest[typedIndex];

		if (trackingIndex < tractTest.length) {
			tractTest[trackingIndex].style.backgroundColor = "grey";
			trackingIndex++;

		}
		// alertStart();

		// clear input fill when whitespace is encountered
		if (!isChar(typedChar)) {
			this.value = "";
		}
		if (isSameChar(typedChar, testChar.innerHTML)) {
			testChar.style.color = "green";
			++correctEntries;
		} else {
			if (isChar(testChar.innerHTML)) {
				testChar.style.color = "red";
			}
			document.getElementById("shout").play();
			++errorEntries;
		}
		endTime = new Date().getTime();

		sec = (endTime - startTime) / 1000;

		minutes = sec / 60;

		updateStatistics(typedEntries, correctEntries, errorEntries, minutes);

		timer.innerHTML = "Time elapsed : " + formattedTime(sec);

		++typedIndex;

		if ((typedIndex === tractTest.length) || (sec.toFixed() >= maxTime)) {
			displayStopReason();
			endGame();
		}

	}, false);

}

/**
 * Reset the input area
 */
function resetInput() {
	var userText = document.getElementById("userText");
	userText.value = "";
	if (selectedLanguage().toLowerCase() === "swedish") {
		userText.placeholder = "Skriv här ...";
	}
	else {
		userText.placeholder = "Type here ...";
	}
	userText.style.backgroundColor = "white";
	userText.disabled = false;
}

/**
 * Print a 5 seconds message informing that timing has started
 */
function displayStopReason() {
	var briefInfo = document.getElementById("testInfo");
	briefInfo.style.display = "block";
	if (sec >= maxTime) {
		if (selectedLanguage() === "english") {
			briefInfo.innerHTML =
				"You have exceeded the time limit [5 minutes]";
		} else {
			briefInfo.innerHTML =
				"Den maximala test tiden är passerade [5 minuter]";
		}
	}
	else if (typedIndex === tractTest.length) {
		if (selectedLanguage() === "english") {
			briefInfo.innerHTML = "You have reached the end of the test text";
		} else {
			briefInfo.innerHTML = "Test texten är slut!";
		}
	}
}

/**
 * Small snippet to convert total seconds to hh:mm:ss <br />
 * Source: https://gist.github.com/martinbean/2bf88c446be8048814cf02b2641ba276
 * @param totalSec Seconds to convert to hh:mm:ss
 * @returns {string} hh:mm:ss
 */
function formattedTime(totalSec) {
	return new Date(totalSec * 1000).toISOString().substr(11, 8);
}

/**
 * Reset all results to zero and the typedIndex to the starting position (0)
 */
function resetStatistics() {
	document.getElementById("grossWPM").innerHTML = 0;
	document.getElementById("errors").innerHTML = 0;
	document.getElementById("netWPM").innerHTML = 0;
	document.getElementById("accuracy").innerHTML = 0;
	document.getElementById("timer").innerHTML = "";
	//document.getElementById("testInfo").innerHTML = "";
	typedIndex = 0;
	trackingIndex = typedIndex + 1;
	startTime = 0;
	endTime = 0;
	sec = 0;
	minutes = 0;
	typedEntries = 0;
	errorEntries = 0;
	correctEntries = 0;
	resetInput();
}

/**
 * Check that a char is not white space
 * @param char Character to check
 * @returns {boolean} -1 if value is not a char. Otherwise, a positive number
 */
function isChar(char) {
	return "\t\n\r ".indexOf(char) < 0;
}

/**
 * Start timer: Call this when user starts typing.
 * The method setInterval calls updateTimer() which increments minutes every
 * 1000 milliseconds = 1 second
 */
function inputEvents() {
	var userText = document.getElementById("userText");

	userText.addEventListener("click", function () {
		startTime = sec === 0 ? new Date().getTime() : startTime;
	}, false);

	userText.addEventListener("click", function () {
		this.placeholder = "";
	}, false);

	userText.addEventListener("click", changeActionButton, false);

}

function test() {
	inputEvents();
	runTest();
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

	document.getElementById("action_image").addEventListener(
		"click", function () {
			if (this.alt.split(" ")[0] === "reset") {
				addOptions();
				resetGame();
			}
		}, false);

}

window.addEventListener("load", test, false);
window.addEventListener("load", init, false);