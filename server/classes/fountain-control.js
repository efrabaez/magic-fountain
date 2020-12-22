const fs = require('fs');

class FountainControl {
	constructor (){
		this.lastUser = 0;
		this.today = new Date().getDate();

		let data = require('../data/data.json');
		if(data.today === this.today){

		}else{
			this.resetQueue();
		}

	}

	resetQueue(){
		let jsonData = {
			last: this.lastUser,
			today: this.today
		}
		let jsonDataString = JSON.stringify(jsonData);

		fs.writeFileSync('./server/data/data.json', jsonDataString);
		console.log("System has been initialized");
	}

}

module.exports = {
	FountainControl
}