/**
 * Read xml file
 */
function loadTexts() {
	var xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else {
		// code for older browsers
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.open("GET", "texts.xml",false);
	xhr.send();
	var xmlData = xhr.responseText;
	document.getElementById("testContent").innerHTML = xmlData;
}

/**
 * Dynamically set the date value in the footer section
 */
function fillDate() {
	document.getElementById("year").innerHTML =
		new Date().getFullYear().toString();
}

window.addEventListener("load", fillDate, false);
//window.addEventListener("load", loadTexts, false);