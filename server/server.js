/** 
 * @author Efra
 * 23/12/2020 Last modified
 * Company: Mosbites.com
*/


const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const path = require('path');

const app = express();
let server = http.createServer(app);


const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);

require('./sockets/socket');





server.listen(port, (err) => {
  if (err) throw new Error(err);
  console.log(`Servidor corriendo en puerto ${ port }`);
});

/*const musicFolder = '/media/pi/USB/music/';
const fs = require('fs');
const songs = [];

fs.readdirSync(musicFolder).forEach(file => {
	let jsonData = {
		song: file
	}
	songs.push(file);
});

fs.writeFileSync('./public/assets/music.json', JSON.stringify(songs));*/


