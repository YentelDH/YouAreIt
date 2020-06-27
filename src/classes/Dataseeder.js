/* eslint-disable no-tabs */
/* eslint-disable indent */

class Dataseeder {
	constructor() {
		this.latitude = 4.098112;
		this.longitude = 51.0312293;
	}

	changeLocation() {
		// zorgt dat de coordoniaten steeds andere waarden hebben
		const randomInt = (Math.random() - 0.5) * 0.1;

		this.latitude += randomInt;
		this.longitude += randomInt;
	}

	// function to let the player move
	startPlayer() {
		this.interval = setInterval(() => {
			this.changeLocation();
			// console.log(`New position: ${this.latitude} ${this.longitude}`);
		},
		1000);
	}

	// function to call later to stop "the player" from moving
	stopPlayer() {
		clearInterval(this.interval);
	}
}

export default Dataseeder;
