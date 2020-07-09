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

	// Contstants
	const playerCard = document.getElementById('playerCard');
	const moderatorCard = document.getElementById('moderatorCard');

	/*
   * Function to make a collection of multiple games
   */
  function setDocument() {
		/* thanks to Silver Ringvee: https://stackoverflow.com/users/4769218/silver-ringvee */
		const randomNumber = Math.random().toString(36).substr(2, 5);
		localStorage.setItem('GameCode', randomNumber);
		console.log(randomNumber);

		firebase.auth().onAuthStateChanged((user) => {
			navigator.geolocation.getCurrentPosition((position) => {
				// object of the game with info moderator
				const game = {
					moderator: {
						location: {
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
						},
						image: user.photoURL,
						name: user.displayName,
					},
					status: true,
					started: false,
					distance: null,
					time: null,
				};

				// putting object in the collection games
				App.firebase.getFirestore().collection('games').doc(randomNumber)
				.set(game);
			});
		});
  }

	/*
   	* Function to set player in game
   */
  /* function setPlayer() {
		const gamecode = localStorage.getItem('GameCode');
		console.log(gamecode);
		firebase.auth().onAuthStateChanged((user) => {
			navigator.geolocation.getCurrentPosition((position) => {
				const lat = position.coords.latitude;
				const lon = position.coords.longitude;

				// object of player/user
				const player = {
					location: {
						latitude: lat,
						longitude: lon,
					},
					image: user.photoURL,
					name: user.displayName,
				};

				// setting object/player in the collection players
				App.firebase.getFirestore().collection('games').doc(gamecode)
				.collection('players')
				.doc()
				.set(player)
				.then(() => {
					console.log('Je bent aan de game toegevoegt');
				});
			});
		});
	} */

	function resetLocal() {
		localStorage.removeItem('Distance');
		localStorage.removeItem('Timer');
	}

	// Setting boolean in localstorage to know if the player is a moderator or a normal player
	playerCard.addEventListener('click', () => {
		localStorage.setItem('Moderator', false);
	});

	moderatorCard.addEventListener('click', () => {
		localStorage.setItem('Moderator', true);
		resetLocal();
		setDocument();
		// setPlayer();
	});
};
