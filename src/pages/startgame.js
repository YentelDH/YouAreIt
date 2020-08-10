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
		const randomNumberLow = Math.random().toString(36).substr(2, 5);
		const randomNumber = randomNumberLow.toUpperCase();
		localStorage.setItem('GameCode', randomNumber);

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
