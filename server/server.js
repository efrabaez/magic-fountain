/** 
 * @author Efra
 * 23/12/2020 Last modified
 * Company: Mosbites.com
*/


const express = require('express');
const socketIO = require('socket.io');
const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
    key: fs.readFileSync('certificates/mitienda.key'),
    cert: fs.readFileSync('certificates/mitienda.crt')
};


const app = express();
let server = https.createServer(options, app);


const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 4300;

app.use(express.static(publicPath));

// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);

require('./sockets/socket');





server.listen(port, (err) => {
  if (err) throw new Error(err);
  console.log(`Servidor corriendo en puerto ${ port }`);
});

/*const musicFolder = '/media/pi/USB/music/';

const songs = [];

fs.readdirSync(musicFolder).forEach(file => {
	let jsonData = {
		song: file
	}
	songs.push(file);
});

fs.writeFileSync('./public/assets/music.json', JSON.stringify(songs));*/


