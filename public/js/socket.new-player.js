let lastColor = "0";
let lastCircuit = "300";
let lastHeigth = 0;
let slider = document.getElementById("myRange");


//Establish connection with server
let socket = io();

socket.on('connect', function(){
	console.log('Connected with server');
});

socket.on('disconnect', function(){
	console.log('Disconnected of server');
});

socket.on('playerData', function (data){ 
	localStorage.setItem("isCancel", false);
  let currentTime = new Date();
	let dataTime = new Date (data.playerData.startGame);
	let difference = (dataTime - currentTime) / 1000;
	console.log(dataTime.playerData);
	console.log(dataTime);
	
	//document.getElementById("rowQueue").hidden = false;
  //document.getElementById("rowCancel").hidden = true;
  if(!data.playerData.playing){
    countDown(Math.round(difference), data.playerData.endGame);
  }else{
    countDown(Math.round(difference), data.playerData.endGame);
  }


});

socket.on('removePlayer', function(){
	console.log("remove player");
	//userData();
});

socket.on('playerRemove', function(){
	console.log("remove player");
	localStorage.setItem("isCancel", true);
});


$( "#pills-play-tab" ).click(function() {
	socket.emit('initFountain',{
		email: param('id')
	});
});

//Colors of the lights
$(".colorBar").ColorPickerSliders({
	flat: true,
	color: 'orange',
	swatches: false,
	order: {
			hsl: 1
	},onchange: function(container, color) {
				var color = color.rgba.r+' '+color.rgba.g+' '+color.rgba.b;
				if(lastColor != color){
					socket.emit('color', {
						rgbw: lastCircuit+','+color.replace(/\s+/g, ',')+',0'
					});
				}

				var lastColor = color;

		}, 
});

// Update the current slider value (each time you drag the slider handle)
function changeHeight(height) { 
    lastHeigth = height;
    socket.emit('height', {
      movimiento: lastCircuit+","+lastHeigth
    });
} 
//Acelerometer
function addHeight(_data){
  if(Math.abs(parseInt(_data) - parseInt(lastHeigth)) > 2 ){
    lastHeigth = Math.round(_data);
    if(Math.round(_data) > 0 ){
      socket.emit('height', {
        movimiento: lastCircuit+","+lastHeigth
      });
    }
  }
}

function changeSequence(_sequence){
  socket.emit('sequence', _sequence);
}

function changeFountain(_data){
  socket.emit(_data, {
    rgbw: '0,0,0,0',
    height: '0'
  });
}

function playSong(_idSong){
	socket.emit('playSong', _idSong);
	document.getElementById("current-playing").innerHTML = "Reproduciendo actualmente: "+_idSong;
}

function cancelGame(){
	socket.emit('cancelQueue', {
		token: param('token')
	});
	
	localStorage.setItem("isCancel", true);
	window.location.reload();
}

function cancelQueue(){
	socket.emit('cancelQueue', {
		token: param('token')
	});
	socket.emit('endGame');
	localStorage.setItem("isCancel", true);
	document.getElementById("rowQueue").hidden = true;
	document.getElementById("rowCancel").hidden = false;
}

function playAgain(){
	localStorage.setItem("isCancel", false);
	window.location.reload();
}

function userData(){
	socket.emit('userData',{
		email: param('id')
	});
}







let fixed = 2;
let betaAxu = 0;
let beta = document.getElementById("beta");



if (window.DeviceOrientationEvent) {
  document.getElementById("support").innerText = "Suuport: YES";
  document.getElementById("heightSlider").style.display = "none";
  window.addEventListener('deviceorientation', function (evt) {
    setTimeout(function() {
      try {
          beta.innerText= Math.round(evt.beta.toFixed(fixed));
          addHeight(evt.beta.toFixed(fixed));
    
      } catch (ex) {
        document.getElementById("support").innerText = "Suuport: NOT";
        document.getElementById("heightSlider").style.display = "inline-block";
      }
    },300);
  });
}



/**
 * Functions that not depend entirely on sockets
 */

//Return param of URL, used to get email from url
function param(name) {
		return (location.search.split(name + '=')[1] || '').split('&')[0];
}

function changeCircuit(_value){
  if(_value != lastCircuit){
    lastCircuit = _value;
    document.getElementById("cActual").innerText = "Actualmente jugando con circuito: "+lastCircuit;
    console.log(lastCircuit);   
  }
}



function countDown(_difference, _dataEnd){
  var x = setInterval(function() {
    if (_difference <= 0 || localStorage.getItem("isCancel") == "true") {
      clearInterval(x);
      if(localStorage.getItem("isCancel") == "false"){
        console.log("Pasamos a jugar");
        document.getElementById("rowQueue").hidden = true;
        document.getElementById("rowPlaying").hidden = false;

        socket.emit('initGame', {
          email: param('id')
        });

        playingTime(_dataEnd);

      }else{
        //console.log("Ya no pasamos a jugar");
        _difference = 0;
      }
    }
    document.getElementById("waitTime").innerHTML = fmtMSS(_difference);
    _difference--;
  }, 1000);
}

function playingTime(_endTime){
socket.emit('startPlaying', {
  email: param('id')
});
  var currentTime = new Date();
  var dataTime = new Date (_endTime);
  var difference = Math.round((dataTime - currentTime) / 1000);
  
  var x = setInterval(function() {
      /*
      *We need to compare endGame time with nows time in order
      *to only give the user 60s no matter if he's playing or not.
      */
      if(difference <= 0  || localStorage.getItem("isCancel") == "true"){
        clearInterval(x);
        document.getElementById("rowPlaying").hidden = true;
        document.getElementById("rowEndGame").hidden = false;
      }
      //console.log("Time: ", difference);
      document.getElementById("count").innerHTML = difference;
      difference --;
    }, 1000);
  
}

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
