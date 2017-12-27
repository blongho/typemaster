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
	console.log(engTexts);
	console.log(sweTexts);
	console.log(sweTexts[3].title + "\n" + sweTexts[3].summary());
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
	var lang = getSelectedLanguage();
	var arr = lang === "english" ? engTexts : sweTexts; // choose which array

	var textOptions = document.getElementById("text");
	for (var i = 0; i < arr.length; i++) {
		var title = arr[i].title;
		var option = document.createElement("option");
		option.value = title;
		option.text = title;
		textOptions.add(option);
	}

	var choice = textOptions.options[textOptions.selectedIndex].value;

	addTestText(arr, choice);
}

function optionsExists(optionList, option) {
	for (var i = 0; i = optionList.length; i++) {
		if (optionList.options[optionList.selectedIndex].value === option) {
			return true
		}
	}
	return false;
}

/**
 * This function fills the "test" area with the text title, author and summary
 * @param arr   The array for which the text is to be extracted.
 * @param option The option selected
 */
function addTestText(arr, option) {
	var text = Object.create(Test);
	for (var i = 0; i < arr.length; i++) {
		if (option === arr[i].title) {
			text = arr[i];
		}
	}

	// load text and details
	document.getElementById("testTitle").innerHTML = text.title;
	document.getElementById("authorAndStatistics").innerHTML = text.summary();
	document.getElementById("testContent").innerHTML = text.text;

}

function changeTest() {
//	if(document.getElementById("text").hasChildNodes()){
//		var del = document.getElementById("text").children;
//		for(var i = 0; i < del.length; i++){
//			document.getElementById("text").removeChild(del[i]);
//		}
//	}
	//document.getElementById("text").options.length = 0;

	document.getElementById("text")
		.addEventListener("change", addOptions, false);

}

function spanText(text) {
	var newText = "";
	for (var i = 0; i < text.length; i++) {
		var span = document.createElement("span");
		span.class = "char";
		span.text = text[i];
		newText += span;
	}
	return newText;
}

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