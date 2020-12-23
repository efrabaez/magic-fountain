const { io } = require('../server');
let playersQueue = [];
let activeEvent = false;
let isActive = false;

let delayInMilliseconds = 1000; //1 second
let height= '0'
let  rgbw = '0';
let sequence = '0';


//OMX player for play audio in console
let Omx = require('node-omxplayer');
let pkill = require('pkill');
let player = Omx();
let currentSong = '00';
let songsPath='/media/pi/USB/music/';

//For serial communication with Arduino
let SerialPort = require('serialport');

/**
 * Path to arduinos can be ttyUSB* or ttyACM*, then you create usb-serial rules with
 * idProduct, idVendor and serial of arduino.
 * BaudRate must match Arduino's BaudRate
 */
let serial_one = new SerialPort('/dev/arduino_1',{ 
  baudRate: 9600, 
  parser: SerialPort.parsers.raw
});

let serial_two = new SerialPort('/dev/arduino_2',{ 
  baudRate: 9600, 
  parser: SerialPort.parsers.raw
});




io.on('connection', (client) => {
	console.log("User is now conected!"+client.id);
	client.join(client.id);

	client.on('initFountain', function (data){
		let startGameDate = new Date();
		let endGameDate = new Date();

		startGameDate.setSeconds(startGameDate.getSeconds()+12); //Give initial 12 seconds for prepare
    endGameDate.setSeconds(endGameDate.getSeconds()+72); //This time the player should end the game
		if(playersQueue.length == 0){
		
			player = {
				"email": data.email,
				"startGame": startGameDate,
				"endGame": endGameDate,
				"playing": true
			}

			playersQueue.push(player);

      io.sockets.connected[client.id].emit('playerData', { playerData: player});
		}else{
			// Check if email is alredy in queue
			let result = playersQueue.filter(x => x.email === data.email);
			if(result.length > 0){
				console.log("Ya está en queue, no se agrega");
				//Email is in queue. Only search and send his info to the user
        var index = indexOfQueue(data.email);
				io.sockets.connected[client.id].emit('playerData', { playerData: playersQueue[index]});
			}else{
				//Get last insert, then set start & end time for the next player.
				let newStarGame = new Date(playersQueue[playersQueue.length -1].endGame)
        let newEndGame = new Date(playersQueue[playersQueue.length -1].endGame)
				newStarGame.setSeconds(newStarGame.getSeconds() + 10); //Give 10 seconds after user ended to let fountain prepare for next user
        newEndGame.setSeconds(newEndGame.getSeconds() + 70); //This will be the next end time
				
				player = {
          "email": data.email, 
          "startGame": newStarGame,
          "endGame": newEndGame
        }
				playersQueue.push(player);
				io.sockets.connected[client.id].emit('playerData', { playerData: player});


			}
		}
	});

	client.on('initGame', function (data){
		let index = indexOfQueue(data.email);
    let currentTime = new Date();
    let dataTime = new Date (playersQueue[index].endGame);
    let difference = Math.round((dataTime - currentTime) / 1000);
    
    playersQueue[index].playing = true;
    activeEvent = true;


    if(!isActive){
      var x = setInterval(function() {
        /*
        *We need to compare endGame time with nows time in order
        *to only give the user 60s no matter if he's playing or not.
        */
        if(difference <= 0 || isActive == false){
          playersQueue.splice(index, 1);
          isActive = false;
          clearInterval(x);
          activeEvent = false;
	//socket.broadcast.to('fuente').emit('finJuego');
	console.log("==== End Game =====");
          serialArduino_one('401,0,0,0,0'); 
    	  	serialArduino_two('401,0,0,0,0'); 
          if(currentSong != '00'){
            player.quit();
            currentSong = '00';
          }
          
        }
        //console.log("Time: ", difference);
        difference --;
      }, 1000);
    }
    isActive = true;


	});

	client.on('cancelQueue', function (data){
    let index = 0;

    if(playersQueue.length > 1){

      index = indexOfQueue(data.token);

      for(var i = playersQueue.length; i == index; i--){
        playersQueue[i].startGame = playersQueue[i-1].startGame;
        playersQueue[i].endGame = playersQueue[i-1].endGame;
      }

    }

    playersQueue.splice(index, 1);
		io.sockets.connected[client.id].emit('playerRemove', { playerData: "remove"});
		isActive = false;
	});

	client.on('userData', function (data){
		var index = indexOfQueue(data.email);
		io.sockets.connected[client.id].emit('playerData', { playerData: playersQueue[index]});
	});



  /**
   * Functions to get data of RGBA, Height, Music.
   */
  client.on('startPlaying', function (_data){ 
		console.log("inicio juego");
			serialArduino_one('400,0,0,0,0'); 
			serialArduino_two('400,0,0,0,0'); 
			activeEvent = true;
		});
	
	client.on('color', function (data){
		if(true){
			if(parseInt(rgbw) != data.rgbw){
				serialArduino_one(data.rgbw);
				rgbw = data.rgbw;
			}
		}
	});
	
	client.on('height', function (data){
		if(true){
			if(parseInt(height) != data.movimiento){
				serialArduino_two(data.movimiento.toString());
				height = data.height;
			}
		}
	});

	client.on('sequence', function (data){
		if(currentSong != '00'){
			player.quit();
			currentSong = '00';
		}

		if(activeEvent == 1){
			activeEvent = 0;
		}
		if(sequence != data){
			serialArduino_two(data);
			setTimeout(function() {
				serialArduino_one('401');
			}, delayInMilliseconds);
		}
		sequence = data;
	});
	
	client.on('playSong', function (data){
    console.log("playSong: ", data);
    if(currentSong != '00'){
      //stop music
      player.quit();
      currentSong = '00'
    }
    currentSong = data;
    player = Omx(songsPath+data);
  });

	client.on('endGame', function (){
    activeEvent = false;
    if(currentSong != '00'){
      player.quit();
    }
    currentSong = '00';
    serialArduino_one('401,0,0,0,0'); 
    serialArduino_two('401,0,0,0,0'); 
  });

	



});



//Functions that don't depend on sockets
function indexOfQueue(_token){
  var indexOfQueue = 0;
  for(var i = 0; i < playersQueue.length; i++){
    if(playersQueue.token == _token){
      indexOfQueue = i;
    }  
  }
  return indexOfQueue;
}



/**
 * Arduino
 */

function serialArduino_one(_data){
	console.log('Write Arduino 1:  ' + _data);
  serial_one.write(_data, function(err) {
    if (err) {
      return console.log('Error on write1: ', err.message);
    }
  });
  serial_one.write("\n", function(err) {
    if (err) {
      return console.log('Error on write1 n: ', err.message);
    }
  }); 
}


function serialArduino_two(_data){
  console.log('Write Arduino 2:  ' + _data);
  serial_two.write(_data, function(err) {
    if (err) {
      return console.log('Error on write1: ', err.message);
    }
  });
  serial_two.write("\n", function(err) {
    if (err) {
      return console.log('Error on write1 n: ', err.message);
    }
  });
}
