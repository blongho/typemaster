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
var trackingIndex = 1; // index of test text

var typedEntries = 0;

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

function endGame() {
	document.getElementById("userText").disabled = true;
	//pauseGame();

}

/**
 * Compare two characters. <br/>
 * Checks if "Ignore case" is checked. <br/>
 * If checked, a case-insensitive comparison is done otherwise normal comparison
 * @param c1 Character1 to compare
 * @param c2 Character2 to compare
 * @returns {boolean} true if they are the same characters
 */
function compareChar(c1, c2) {
	var ignoreChecked = document.settingsForm.case.checked;
	if (ignoreChecked) {
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

	var grossWPM = document.getElementById("grossWPM");// gross WPM
	var errors = document.getElementById("errors"); // number of
	var netWPM = document.getElementById("netWPM");// net WPM in
	var accuracy = document.getElementById("accuracy");// the

	var timer = document.getElementById("timer");

	var error = 0;
	var correct = 0;
	var len = tractTest.length;
	const startTime = new Date().getTime();

	document.getElementById("userText").addEventListener("input", function () {
		var typed = document.getElementById("userText").value;

		var lastChar = typed[typed.length - 1];

		var errorChar = tractTest[typedIndex];

		tractTest[trackingIndex].style.backgroundColor = "grey";

		// clear input fill when whitespace is encountered
		if (!isChar(lastChar)) {
			this.value = "";
		}
		if (compareChar(lastChar, currentTestText[typedIndex])) {
			++correct;
			accuracy.innerHTML = (correct / len * 100).toFixed();
		} else {
			if (isChar(errorChar)) {
				errorChar.style.color = "red";
			}
			errors.innerHTML = ++error;
			document.getElementById("shout").play();
		}

		++typedIndex;
		++trackingIndex;
		var nt = (new Date().getTime() - startTime) / 1000;

		if (trackingIndex === len) { // end of test text reached
			timer.innerHTML =nt.toFixed() < 10 ? "0" + nt.toFixed() : nt.toFixed();

			endGame();
		}
		console.log("Time passed: " + nt.toFixed());
		console.log("\nTyped index = " + typedIndex + "\nTracking index =" +
			trackingIndex);
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
	console.log(isChar(" "));
	console.log(isChar("g"));
}

window.addEventListener("load", init, false);
window.addEventListener("load", inputEvents, false);
//window.addEventListener("load", endGame, false);