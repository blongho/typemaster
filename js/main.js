function fillDate()
{
	document.getElementById("year").innerHTML =
		new Date().getFullYear().toString();
}

window.addEventListener("load", fillDate, false);