const languaje = localStorage.getItem('languaje');
if ( languaje == null){
	window.location.href = "index.html";
}

const languajeURL = `assets/languaje/${languaje}.json`;
readTextFile(languajeURL, function(text){
		var data = JSON.parse(text);
		document.getElementById("play-homeTitle").innerHTML = data['homeTitle'];
		document.getElementById('play-homeContent').innerHTML = data['homeContent'];

		document.getElementById("play-usTitle").innerHTML = data['usTitle'];
		document.getElementById('play-usContent').innerHTML = data['usContent'];

		document.getElementById("play-waitGoBack").innerHTML = data['playGoBack'];
		document.getElementById('play-controlFountain').innerHTML = data['playControlFountain'];					
		document.getElementById("play-waiting").innerHTML = data['playWaiting'];
		document.getElementById('play-permissions').innerHTML = data['playPermissions'];
		document.getElementById("play-waitingSmall").innerHTML = data['playWaitingSmall'];
		document.getElementById('play-cancelGame').innerHTML = data['playCancel'];

		document.getElementById("play-cancelGoBack").innerHTML = data['playGoBack'];
		document.getElementById("play-cancelText").innerHTML = data['playCancelText'];
		document.getElementById("play-cancelPlayAgain").innerHTML = data['playAgain'];


		document.getElementById("play-finishedGoBack").innerHTML = data['playGoBack'];
		document.getElementById("play-finishedPlayAgain").innerHTML = data['playAgain'];



});





function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function() {
			if (rawFile.readyState === 4 && rawFile.status == "200") {
					callback(rawFile.responseText);
			}
	}
	rawFile.send(null);
}
