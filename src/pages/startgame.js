/**
 * The Start Game Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */
import * as firebase from 'firebase/app';
import App from '../lib/App';

const startgameTemplate = require('../templates/startgame.hbs');

export default () => {
  // render the template
	App.render(startgameTemplate());

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	const playerCard = document.getElementById('playerCard');
	const moderatorCard = document.getElementById('moderatorCard');

	/*
   * Function to make a collection of multiple games
   */
  function setDocument() {
		/* thanks to Silver Ringvee: https://stackoverflow.com/users/4769218/silver-ringvee */
		const randomNumber = Math.random().toString(36).substr(2, 5);
		localStorage.setItem('GameCode', randomNumber);
		App.firebase.getFirestore().collection('games').doc(randomNumber).set({
		});
  }

  function setCollection() {
		firebase.auth().onAuthStateChanged((user) => {
			const gamecode = localStorage.getItem('GameCode');
			App.firebase.getFirestore().collection('games').doc(gamecode).set({
				moderator: user.displayName,
				status: true,
				started: false,
			});
		});
  }

	/*
   	* Function to set player in game
   */
  function setPlayer() {
	firebase.auth().onAuthStateChanged((user) => {
		const gamecode = localStorage.getItem('GameCode');

		navigator.geolocation.getCurrentPosition((position) => {
			const lat = position.coords.latitude;
			const lon = position.coords.longitude;

			localStorage.setItem('Latitude', lat);
			localStorage.setItem('Longitude', lon);
		});

		const lat = localStorage.getItem('Latitude');
		const lon = localStorage.getItem('Longitude');

		const player = {
			location: {
				latitude: lat,
				longitude: lon,
			},
			image: user.photoURL,
			name: user.displayName,
		};

		App.firebase.getFirestore().collection('games').doc(gamecode)
		.collection('players')
		.doc()
		.set(player)
		.then(() => {
			console.log('Je bent aan de game toegevoegd');
		});
	});
}

	// Setting boolean in localstorage to know if the player is a moderator or a normal player
	playerCard.addEventListener('click', () => {
		localStorage.setItem('Moderator', false);
	});

	moderatorCard.addEventListener('click', () => {
		localStorage.setItem('Moderator', true);
		localStorage.removeItem('Distance');
		localStorage.removeItem('Timer');
		setDocument();
		setCollection();
		setPlayer();
	});
};
