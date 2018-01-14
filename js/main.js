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

/***
 * Manually add a test object
 * @param ti test title
 * @param au test author
 * @param la test language
 * @param txt test text
 * @returns {Test}
 */
function newTest(ti, au, la, txt) {
	var test = Object.create(Test);
	test.title = ti;
	test.author = au;
	test.lang = la;
	test.text = txt;
	return test;
}

var spanChars; // a list of all the test characters

var currentTestText = ""; // get the current text in the test area.
var tractTest = "";
var actionButtons = [];  // array that holds play/stop action buttons

var engTexts = [], // array to hold english texts
	sweTexts = []; // array to hold swedish texts

var quirtTexts = []; // array to hold other text formats

function loadQuirks() {
	quirtTexts.push(newTest("Förändringens Tid", "Erik Ström", "swedish",
		"Vinden viner över sällsamma ruiner, över berg och slätter, dagar" +
		" som nätter. Ger världen form inför den kommande storm, likt gudars sång, skall bli dess undergång. Svart som natten, blank likt vatten, i skyn du häver då Allfader kräver. Åter resas skall nu han, som i misteln döden fann. Sonas med sin ene broder, den blinde född av samma moder. Satt att råda är de båda, bröders hand över evigt land."));

	quirtTexts.push(newTest("Moln", "Karin Boye", "swedish",
		"Se de mäktiga moln, vilkas fjärran höga toppar stolta, skimrande" +
		" resa sig, vita som vit snö! Lugna glida de fram för att slutligen lugnt dö sakta lösande sig i en skur av svala droppar. Majestätiska moln - genom livet, genom döden gå de leende fram i en strålande sols sken utan skymmande oro i eter så klart ren, gå med storstilat, stilla förakt för sina öden."));

	quirtTexts.push(
		newTest("Jag har en dröm", "Martin Luther King Jr.", "swedish",
			"Så säger jag er, mina vänner, att jag trots dagens och morgondagens svårigheter har en dröm. Det är en dröm med djupa rötter i den amerikanska drömmen om att denna nation en dag kommer att resa sig och leva ut den övertygelsens innersta mening, som vi håller för självklar: Att alla människor är skapade med samma värde."));
	quirtTexts.push(newTest("Doktor Glas", "Hjalmar Söderberg", "swedish",
		"Jag stod vid pastor Gregorius bädd; han låg sjuk. Övre delen av hans kropp var blottad, och jag lyssnade på hans hjärta. Sängen stod i hans arbetsrum; en kammarorgel stod i ett hörn, och någon spelade på den. Ingen koral, knappt en melodi. Bara formlösa fugaartade tongångar fram och tillbaka. En dörr stod öppen; det oroade mig, men jag kunde inte komma mig för att få den stängd."));

	quirtTexts.push(newTest("En Önskan", "Edith Södergram", "swedish",
		"Av hela vår soliga värld önskar jag blott en trädgårdssoffa där en katt solar sig... Där skulle jag sitta med ett brev i barmen, ett enda litet brev. Så ser min dröm ut..."));
	quirtTexts.push(newTest("Katherine", "Abraham Lincoln", "english",
		"I am not bound to win, but I am bound to be true. I am not bound to succeed, but I am bound to live by the light that I have. I must stand with anybody that stands right, and stand with him while he is right, and part with him when he goes wrong."));

	quirtTexts.push(newTest("Love and Weirdness", "Dr. Seuss", "english",
	"We are all a little weird and life's a little weird, and when we find someone whose weirdness is compatible with ours, we join up with them and fall in mutual weirdness and call it love."));

	quirtTexts.push(newTest("Integrity", "Francis Bacon", "english",
		"It's not what we eat but what we digest that makes us strong; not what we gain but what we save that makes us rich; not what we read but what we remember that makes us learned; and not what we profess but what we practice that gives us integrity."));

	quirtTexts.push(newTest("The Odyssey", "Homer", "english",
		"May the gods grant you all things which your heart desires, and may they give you a husband and a home and gracious concord, for there is nothing greater and better than this - when a husband and wife keep a household in oneness of mind, a great woe to their enemies and joy to their friends, and win high renown."));

	quirtTexts.push(newTest("At the end of the day", "Kim Kardashian", "english",
		"At the end of the day, life is about being happy being who you are, and I feel like we are so blessed to have the support system and the best family to really just support each other no matter what we're going through."));

	quirtTexts.sort(sortByTitle);
}

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
			var title, author, lang, text;

			for (var i = 0; i < texts.length; i++) {

				title = titleList[i].firstChild.data;
				author = authorList[i].firstChild.data;
				lang = langList[i].firstChild.data;
				text = texts[i].firstChild.data;

				var test = newTest(title, author, lang, text);

				test.lang === "english" ? engTexts.push(test) :
					sweTexts.push(test);
			}
			sweTexts.sort(sortByTitle);
			engTexts.sort(sortByTitle);
		}

	};
	xhr.open("GET", "texts.xml", false);
	xhr.send(null);
	//console.log(engTexts);
	//console.log(sweTexts);
}

/**
 * Sort texts by title
 * @param t1 text to the left
 * @param t2 text to the right
 * @returns {boolean} true if t2.title comes before t1.title in alphabetical
 * order
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
 */
function sortByTitle(t1, t2) {
	return t1.title.localeCompare(t2.title) > 0;
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
	var arr = [];
	//var arr = selectedLanguage() === "english" ? engTexts : sweTexts;
	if (browserName() === "Chrome" || browserName() === "Firefox") {
		arr = selectedLanguage() === "english" ? engTexts : sweTexts;
	}
	else {
		arr = quirtTexts;
		//alert(browserName() + " " + quirtTexts[0].summary());
	}
	//var arr = selectedLanguage() === "english" ? engTexts : sweTexts;

	// clear all options if there are any
	if (textOptions.length !== 0) textOptions.length = 0;

	for (var i = 0; i < arr.length; i++) {
		var option = document.createElement("option");
			option.value = arr[i].title;
			option.text = arr[i].title;
			textOptions.add(option);
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
	//var arr = selectedLanguage() === "english" ? engTexts : sweTexts;
	var arr = [];
	var test = Object.create(Test);

	//var arr = selectedLanguage() === "english" ? engTexts : sweTexts;
	if (browserName() === "Chrome" || browserName() === "Firefox") {
		arr = selectedLanguage() === "english" ? engTexts : sweTexts;
		for (var i = 0; i < arr.length; i++) {
			if (option === arr[i].title) {
				test = arr[i];
			}
		}
	}
	else {
		arr= quirtTexts;
		for (var i = 0; i < arr.length; i++) {
			if (option === arr[i].title) {
				test = arr[i];
			}
		}
		document.getElementById("testTitle").innerText = test.title;
		document.getElementById("authorAndStatistics").innerText =
			test.summary();
		document.getElementById("testContent").innerText = spanText(test.text);
	}
	//var arr = selectedLanguage() === "english" ? engTexts : sweTexts;

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

function browserName() {
	var nAgt = navigator.userAgent;
	var browserName = navigator.appName;
	var nameOffset, verOffset, ix;

// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset = nAgt.indexOf("Opera")) != -1) {
		browserName = "Opera";
	}
// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
		browserName = "Microsoft Internet Explorer";
	}
// In Chrome, the true version is after "Chrome"
	else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
		browserName = "Chrome";

	}
// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
		browserName = "Safari";
	}
// In Firefox, the true version is after "Firefox"
	else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
		browserName = "Firefox";
	}
// In most other browsers, "name/version" is at the end of userAgent
	else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
		(verOffset = nAgt.lastIndexOf('/'))) {
		browserName = nAgt.substring(nameOffset, verOffset);
	}

	return browserName;

	/**
	 * All events and stored here to be loaded at program start
	 */
}

function init() {
	//alert(browserName());
	fillDate();
	loadTexts();
	loadQuirks();
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

window.addEventListener("load", init, false);