/**
 * @file testStuff.js
 * @author Bernard Che Longho (lobe1602) lobe1602[at]student.miun.se <br />
 * @desc File with js functions that handle the typing tracking and results
 * display
 */
var seconds = 0;
var startTime = 0;  // start time
var stopTime;   // end time of game
var maxTime;    // maximum time for the game (2 minutes)
var typedIndex = 0; // index of currently typed text
var trackingIndex = typedIndex + 1; // index of test text

function displayTime() {
	if (tick) {
		++seconds;
	}

	var timer = document.getElementById("timer");
	var sec = document.getElementById("seconds");
	var p = document.getElementById("time");
	p.style.border = "1px inset green";
	p.style.padding = "0.5em";
	p.style.backgroundColor = "white";
	p.style.font = "bold 140% Verdana, serif";
	//timer.style.color = seconds < 30 ? "green" : "red";
	//timer.innerHTML = seconds < 10 ? "0" + seconds : seconds;

	sec.style.color = "black";
	sec.innerHTML = " seconds";
//	if (seconds >= 120) {
//		tick = false;
//		document.getElementById("userText").disabled = true;
//		sec.innerHTML = "";
//		timer.innerHTML = "TIME LIMIT <<" + seconds + ">> SECONDS REACHED"
//	}

}

/**
 * End game
 */
function endGame() {
	document.getElementById("userText").disabled = true;
	//pauseGame();
}

/**
 * Dynamically update statistics as the user types
 * @param typed Number of entries typed
 * @param correct Number of correct entries typed
 * @param errors Number of mis-match entries typed
 * @param time Time elapsed since typing started.
 */

function updateStatistics(typed, correct, errors, time) {
	var textLength = tractTest.length; // number of characters for the test text

	document.getElementById("errors").innerHTML = errors;
	document.getElementById("accuracy").innerHTML =
		(correct / textLength * 100).toFixed();

	var gross = (typed / 5) / time;
	document.getElementById("grossWPM").innerHTML = gross.toFixed();

	document.getElementById("netWPM").innerHTML =
		(gross - (errors / time)).toFixed();
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
	//console.log("Value of ignoreChecked = " + ignoreChecked);

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
function measurements() {
	var timer = document.getElementById("timer");
	var typedEntries = 0;
	var errorEntries = 0;
	var correctEntries = 0;

	var len = tractTest.length;
	//console.log(tractTest);

	const startTime = new Date().getTime();

	document.getElementById("userText").addEventListener("input", function () {
		var typed = document.getElementById("userText").value;

		typedEntries++;

		var typedChar = typed[typed.length - 1];

		var errorChar = tractTest[typedIndex];

		tractTest[typedEntries].style.backgroundColor = "grey";

		// clear input fill when whitespace is encountered
		if (!isChar(typedChar)) {
			this.value = "";
		}
		if (isSameChar(typedChar, currentTestText[typedIndex])) {
			++correctEntries;
		} else {
			if (isChar(errorChar)) {
				errorChar.style.color = "red";
			}
			document.getElementById("shout").play();
			++errorEntries;
		}
		var now = new Date().getTime();
		var timeElapsed = (now - startTime) / 60000;

		timer.innerHTML = "Time elapsed : " + ((now - startTime) / 1000).toFixed();

		updateStatistics(typedEntries, correctEntries, errorEntries,
			timeElapsed);

		++typedIndex;
		++trackingIndex;

		if (typedEntries === len) { // end of test text reached
			endGame();
		}
		console.log("Typed entries : " + typedEntries);
	}, false);

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
 * The method setInterval calls updateTimer() which increments seconds every
 * 1000 milliseconds = 1 second
 */
function inputEvents() {
	var userText = document.getElementById("userText");

	/*userText.addEventListener(
	 "click", function () {
	 setInterval("displayTime()", 1000);
	 }, false);*/

	userText.addEventListener("click", function () {
		this.placeholder = "";
	}, false);

	userText.addEventListener("click", changeActionButton, false);

}

/**
 * Give different colors to the user statistics based on their performance
 */
function colorResults() {
	var results = document.getElementsByClassName("result");
	for (var i = 0; i < results.length; i++) {
		if (results[i].innerHTML < Number(30)) {
			results[i].style.color = "red";
		} else if (results[i].innerHTML > Number(30) && results[i].innerHTML <
			Number(50)) {
			results[i].style.color = "lightgreen";
		} else {
			results[i].style.color = "green";
		}
	}
}

function init() {
	colorResults();
	measurements();
	//console.log(isChar(" "));
	//console.log(isChar("g"));
}

window.addEventListener("load", init, false);
window.addEventListener("load", inputEvents, false);
//window.addEventListener("load", endGame, false);