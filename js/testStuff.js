/**
 * @file testStuff.js
 * @author Bernard Che Longho (lobe1602) lobe1602[at]student.miun.se <br />
 * @desc File with js functions that handle the typing tracking and results
 * display
 */

var errors;     // number of errors
var correct;    // number of correctly typed words
var grossWPM;   // gross WPM (correct/5) /elapsed time
var netwpm;     // net WPM in percentage ( grossWPM - (errors/min))
var accuracy;   // the accuracy of the typing
var startTime = 0;  // start time
var stopTime;   // end time of game
var maxTime;    // maximum time for the game (2 minutes)

var actionButtons = [];  // array that holds play/stop action buttons

/**
 * Load action buttons for easy surfing later on
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
}

/**
 * Change the action image from play to stop and vis-versa when user clicks on
 * the button
 */
function changeActionButton() {
	document.getElementById("action_image").addEventListener(
		"click", function () {
			var action = this.alt.split(" ")[0];
			switch (action) {
				case "play":
					this.src = actionButtons[1].src;
					this.alt = actionButtons[1].alt;
					break;
				case "stop":
					this.src = actionButtons[0].src;
					this.alt = actionButtons[0].alt;
					break;
			}
		});
}

/**
 * Reset the action button to play
 */
function resetActionButton() {
	var actionImage = document.getElementById("action_image");
	actionImage.src = actionButtons[0].src;
	actionImage.alt = actionButtons[0].alt;
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

function measurements() {
	var i = 0;
	errors = 0;
	var punct = "/[-{}()*+?.,^|# ";

	
	document.getElementById("userText").addEventListener(
		"input", function () {

			var typed = document.getElementById("userText").value;
			var lastChar = typed[typed.length - 1];

			correct = 0;
			if (lastChar === currentTestText[i]) {
				console.log(lastChar + "\n");

				++correct;
			} else if (lastChar !== currentTestText[i]) {
				if(punct.indexOf(lastChar) > 1)
					errors++;
				document.getElementById("errors").innerHTML = errors;

			}
			console.log("The value of i is: " + i + "\nerrors: " + errors);
			i++;
		}, false);

}

/**
 * Reset all game values
 */
function resetGame() {
	resetActionButton();
	document.getElementById("grossWPM").innerHTML = 0;
	document.getElementById("errors").innerHTML = 0;
	document.getElementById("netWPM").innerHTML = 0;
	document.getElementById("errors").innerHTML = 0;
	document.getElementById("accuracy").innerHTML = 0;
}

function init() {
	colorResults();
	loadActionButtons();
	resetGame();
	changeActionButton();
	measurements();
}

window.addEventListener("load", init, false);