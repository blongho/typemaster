/**
 * @file testStuff.js
 * @author Bernard Che Longho (lobe1602) lobe1602[at]student.miun.se <br />
 * @desc File with js functions that handle the typing tracking and results
 * display
 */
var minutes = 0;
var startTime = 0;
var endTime = 0;
var typedIndex = 0; // index of currently typed text
var trackingIndex = typedIndex + 1; // index of test text
var typedEntries = 0;
var errorEntries = 0;
var correctEntries = 0;
var sec = 0;
var netWPM = 0;

const maxTime = 300;    // maximum time for the game (5 minutes)
const alertTime = 5; // Time to display telling the user that test is on

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

function drawProgress(speed){
	var canvas = document.getElementById("progressGraph");
	var context = canvas.getContext("2d");
	context.beginPath();
	var prevPoint = speed;
	var currPoint = netWPM;

	context.moveTo(0, speed);
	context.lineTo(sec, speed);
	context.lineWidth = 1;
	context.strokeStyle = "yellow";

	context.stroke();
}
function updateStatistics(typed, correct, errors, time) {
	document.getElementById("errors").innerHTML = errors;
	document.getElementById("accuracy").innerHTML =
		(correct / tractTest.length * 100).toFixed();

	var gross = (typed / 5) / time;
	document.getElementById("grossWPM").innerHTML = gross.toFixed();

	netWPM = (gross - (errors / time)).toFixed();
	document.getElementById("netWPM").innerHTML =netWPM.toString();

	//drawProgress(netWPM);


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
			briefInfo.innerHTML = "You have exceeded the time limit [5 minutes]";
		} else {
			briefInfo.innerHTML = "Den maximala test tiden är passerade [5 minuter]";
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
	//drawProgress(netWPM);
	inputEvents();
	runTest();
}

window.addEventListener("load", test, false);