/**
 * @file main.js
 * @author Bernard Che Longho (lobe1602) lobe1602@student.miun.se
 * @desc Javascript functions for typing game
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
var engTexts = []; // Array to store english texts
var sweTexts = []; // Array to store swedish texts

var spanChars; // a list of all the test characters
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
		xhr = new XMLHttpRequest();
	} else {
		// code for older browsers
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.open("GET", "texts.xml", false);
	xhr.send();

	var xmlDoc = xhr.responseXML;

	var object = xmlDoc.getElementsByTagName("object")[0];

	var titleList = object.getElementsByTagName("title");
	var authorList = object.getElementsByTagName("author");
	var texts = object.getElementsByTagName("text");
	var langList = object.getElementsByTagName("language");

	var len = titleList.length;

	for (var i = 0; i < len; i++) {

		var test = Object.create(Test);

		test.title = titleList[i].firstChild.data;
		test.author = authorList[i].firstChild.data;
		test.lang = langList[i].firstChild.data;
		test.text = texts[i].firstChild.data;

		if (test.lang === "english") {
			engTexts.push(test);
		} else {
			sweTexts.push(test);
		}
	}
	//console.log(engTexts);
	//console.log(sweTexts);
	//console.log(sweTexts[3].title + "\n" + sweTexts[3].summary());
}

function getTestText(title) {
	var textLanguage = document.interface.value;
}

/**
 * Get the language the user chose to type with
 * @returns {string|Number} The language of the text to display
 */
function getSelectedLanguage() {
	//var lang =
	// document.querySelector('input[name="interface"]:checked').value;
	return document.querySelector('input[name="interface"]:checked').value;
	//console.log(lang);
}

/**
 * This function populates the test options as well as the test sample.
 * It does a "smart" switch of options and populates the tests as per the
 * user's language of preference
 */
function addOptions() {
	// choose which  array
	var arr = getSelectedLanguage() === "english" ? engTexts : sweTexts;

	var textOptions = document.getElementById("text");

	if (textOptions.children.length === 0) {
		for (var i = 0; i < arr.length; i++) {
			var option = document.createElement("option");
			var title = arr[i].title;
			option.value = title;
			option.text = title;
			textOptions.add(option);
		}
	}
	var choice = textOptions.options[textOptions.selectedIndex].value;
	addTestText(arr, choice);
}

function appInterface() {
	var lang = getSelectedLanguage();
	if (lang === "swedish") {
		document.getElementById("caseLabel").innerHTML = "Ignorera" +
			" versaler / gemener";
		document.getElementById("swe").innerHTML = "Svenska";
		document.getElementById("eng").innerHTML = "Engelska";
		document.getElementById("langLabel").innerHTML = "Språk";
		document.getElementById("choice").innerHTML = "Textväljare";
		document.getElementById("userText").placeholder = "Skriv här..";
		document.getElementById("title").innerHTML = "Mäta din" +
			" skrivhastighet och träffsäkerhet";
		document.getElementById("head_title").innerHTML = "Mäta din" +
			" skrivhästighet";

	}
}

/**
 * This function fills the "test" area with the text title, author and summary
 * @param arr   The array for which the text is to be extracted.
 * @param option The option selected
 */
function addTestText(arr, option) {

	for (var i = 0; i < arr.length; i++) {
		if (option === arr[i].title) {
			var text = Object.create(Test);
			text = arr[i];
		}
	}
	document.getElementById("testTitle").innerHTML = text.title;
	document.getElementById("authorAndStatistics").innerHTML =
		text.summary();
	document.getElementById("testContent").innerHTML = spanText(text.text);

	// get the list of all the characters
	spanChars = document.getElementsByClassName("char");
}

/**
 * Add appropriate text content in the test area based on user choice
 */
function changeTest() {
	document.getElementById("text")
		.addEventListener("change", addOptions, false);
	document.getElementById("text")
		.addEventListener("change", highlightFirstChar, false);
	document.getElementById("userText")
		.addEventListener("input", highlightNextChar, false);
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
 * Highlight the first character of the test text
 * This function is expected to be called at the beginning and everything the
 * user changes text content
 */
function highlightFirstChar() {
	spanChars[0].style.backgroundColor = "grey";
}

/**
 * Highlight the next character as the user types in
 */
function highlightNextChar() {
	for (var i = 0; i < spanChars.length; i++) {
		if (document.getElementById("userText").value ===
			spanChars[i].innerHTML) {
			console.log("Yes " + spanChars[i].innerHTML + "\n")
		}
	}
}

/**
 * Give different colors to the user statistics based on their performance
 */
function colorResults() {
	var results = document.getElementsByClassName("result");
	for (var i = 0; i < results.length; i++) {
		if (results[i].innerHTML < 30) {
			results[i].style.color = "red";
		} else if (results[i].innerHTML > 30 && results[i].innerHTML < 50) {
			results[i].style.color = "lightgreen";
		} else {
			results[i].style.color = "green";
		}
	}
}

function init() {
	fillDate();
	loadTexts();
	addOptions();
	colorResults();
	appInterface();
	highlightFirstChar();
	highlightNextChar();
}

/**
 * Dynamically set the date value in the footer section
 */
function fillDate() {
	document.getElementById("year").innerHTML =
		new Date().getFullYear().toString();
}

window.addEventListener("load", init, false);
window.addEventListener("load", changeTest, false);