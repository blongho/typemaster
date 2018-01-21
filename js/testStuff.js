/**
 * @file testStuff.js
 * @author Bernard Che Longho (lobe1602) lobe1602[at]student.miun.se <br />
 * @desc File with js functions that handle the typing tracking and results
 * display
 * @since 2018-01-21
 */
var minutes = 0; // number of minutes passed since last typed character
var startTime = 0; // time when typing starts (milliseconds)
var endTime = 0;  // time elapsed after last key stroke
var typedIndex = 0; // index of currently typed text
var trackingIndex = typedIndex + 1; // index of test text
var typedEntries = 0;  // number of typed characters
var errorEntries = 0;   // number of wrongly typed characters
var correctEntries = 0;  // number of correctly typed characters
var sec = 0; // seconds
var netWPM = 0; // net word per minute
var grossWPM = 0;
var point = {x: 0, y: 0};
var points = [];
var maxTime = 300;    // maximum time for the game (5 minutes)

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
 * Check that a char is not white space
 * @param char Character to check
 * @returns {boolean} -1 if value is not a char. Otherwise, a positive number
 */
function isChar(char) {
	return "\t\n\r ".indexOf(char) < 0;
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

	var errorSound = document.getElementById("shout");
	userText.addEventListener("input", function () {
		var input = document.getElementById("userText").value;

		typedEntries++;

		var typedChar = input[input.length - 1]; // the just typed char

		var testChar = tractTest[typedIndex];

		if (trackingIndex < tractTest.length) {
			tractTest[trackingIndex].style.backgroundColor = "grey";
			trackingIndex++;
		}

		// clear input fill when whitespace is encountered
		if (!isChar(typedChar)) {
			this.value = "";
			//this.placeholder = selectedLanguage() == "english"? "Type" +
			//" here...": "Skriv här..";
		}
		if (isSameChar(typedChar, testChar.innerHTML)) {
			testChar.style.color = "green";
			++correctEntries;
		} else {
			if (isChar(testChar.innerHTML)) {
				testChar.style.color = "red";
			}
			errorSound.play();
			errorSound.currentTime = 0; // if not opera will not play again
			++errorEntries;
		}
		endTime = new Date().getTime();

		sec = (endTime - startTime) / 1000;

		minutes = sec / 60;

		point.x = sec;
		point.y = netWPM;
		points.push(point);

		updateStatistics(typedEntries, correctEntries, errorEntries, minutes);

		//drawProgress();
		timer.innerHTML = "Time elapsed : " + formattedTime(sec);

		++typedIndex;

		if ((typedIndex === tractTest.length) || (sec.toFixed() >= maxTime)) {
			displayStopReason();
			endGame();
			playStopSound();
		}

	}, false);

}

/**
 * Dynamically update statistics as the user types
 * @param typed Number of entries typed
 * @param correct Number of correct entries typed
 * @param errors Number of mis-match entries typed
 * @param time Time elapsed since typing started.
 */
function drawProgress() {
	var c = document.getElementById("progressGraph");
	var ctx = c.getContext("2d");
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 2;
	if (points.length > 1) {
		c.className = "";
		var from = points[points.length - 2];
		var to = points[points.length - 1];
		console.log("From: " + from.x, normalizePoint(from.y));
		console.log("To: " + to.x, normalizePoint(to.y));

		ctx.beginPath();
		ctx.moveTo(from.x, normalizePoint(from.y));
		ctx.lineTo(to.x, normalizePoint(to.y));

		ctx.stroke();
	}
}

/**
 * Set points to be in the range of -100 to 100
 * @param pt
 * @returns {number}
 */
function normalizePoint(pt) {
	var p = 0;
	if (pt > 100) {
		p = 100;
	} else if (pt < -100) {
		p = -100;
	} else {
		p = pt;
	}
	return p;
}

function updateStatistics(typed, correct, errors, time) {
	document.getElementById("errors").innerHTML = errors;
	document.getElementById("accuracy").innerHTML =
		(correct / typed * 100).toFixed();

	grossWPM = (typed / 5) / time;
	document.getElementById("grossWPM").innerHTML = grossWPM.toFixed();

	netWPM = (grossWPM - (errors / time)).toFixed();
	document.getElementById("netWPM").innerHTML = netWPM.toString();
}

/**
 * Reset the input area
 */
function resetInput() {
	var userText = document.getElementById("userText");
	userText.value = "";
	userText.placeholder = selectedLanguage() === "english" ?
		"Type here..." : "Skrive här ...";
	userText.style.backgroundColor = "white";
	userText.disabled = false;
}

/**
 * Display reason why test has stopped <br />
 * Test stops if: <br/>
 *  i. The user has spent 5 minutes since s(he) typed the first character
 *  ii. The number of keystrokes has reached the text length
 */
function displayStopReason() {
	var briefInfo = document.getElementById("testInfo");
	briefInfo.style.display = "block";
	briefInfo.className = "";
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
			briefInfo.innerHTML = "Du nådde text längden!";
		}
	} else if (sec < maxTime && typedIndex < tractTest.length) {
		briefInfo.innerHTML = selectedLanguage() === "english" ?
			"You chose to end the test" : "Du vald att sluta spelet";
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
 * All events that happen when the user clicks on the input area <br/>
 * The following occurs<br/>
 * i. The clock starts ticking
 * ii. The place holder it cleared
 * iii. The action button changes from play to stop
 * */
function inputEvents() {
	var userText = document.getElementById("userText");

	userText.addEventListener("click", startTimer, false);

	userText.addEventListener("click", function () {
		this.placeholder = "";
	}, false);

	userText.addEventListener("click", function () {
		var actionImage = document.getElementById("action_image");
		if (actionButtons.length !== 0) {
			actionImage.src = actionButtons[1].src;
			actionImage.alt = actionButtons[1].alt;
			actionImage.title = actionButtons[1].title;
		}
	}, false);

}

/**
 * Start the timer
 * If the seconds is still 0, then the timer starts
 */
function startTimer() {
	startTime = sec === 0 ? new Date().getTime() : startTime;

}

/**
 * The stop sound plays when program terminates
 */
function playStopSound() {
	document.getElementById("endSound").play();
}

/**
 * Load all events in this when the page loads.
 */
function loadActionListeners() {
	fillDate();
	loadTexts();
	addOptions();
	loadActionButtons();
	resetGame();
	changeTest();
	languageChangeEvents();
	resetActionButton();
	translateInterface();
	actionButtonEvents();
	inputEvents();
	runTest();
	resetStatistics();
}

window.addEventListener("load", loadActionListeners, false);