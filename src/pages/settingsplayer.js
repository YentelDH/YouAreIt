/**
 * The Profile Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable eqeqeq */

import * as firebase from 'firebase/app';
import App from '../lib/App';

const settingsPlayerTemplate = require('../templates/settingsplayer.hbs');

export default () => {
	// render the template
	App.render(settingsPlayerTemplate());

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	// Constants
	const inputGamecode = document.getElementById('inputGamecode');
	const nextBtn = document.getElementById('next');
	const error = document.getElementById('txtError');

	/* thanks to Silver Ringvee: https://stackoverflow.com/users/4769218/silver-ringvee */
	const playerCode = Math.random().toString(36).substr(2, 5);
	localStorage.setItem('playerCode', playerCode);

	function setPlayer() {
		const gamecode = inputGamecode.value;
		firebase.auth().onAuthStateChanged((user) => {
			navigator.geolocation.getCurrentPosition((position) => {
				const lat = position.coords.latitude;
				const lon = position.coords.longitude;

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
				.doc(playerCode)
				.set(player)
				.then(() => {
					// console.log('Je bent aan de game toegevoegd');
				});
			});
		});
	}

	// Check if code from input exist in storage
	function codeChecker() {
		const gamecode = inputGamecode.value;
		if (gamecode == '') {
			error.innerHTML = 'Gelieve een gamecode in te geven';
		} else {
			App.firebase.getFirestore().collection('games').doc(gamecode).get()
			.then((doc) => {
				if (doc.exists) {
					localStorage.setItem('GameCode', gamecode);
					window.location.href = '/#!/settingsplayer2';
					setPlayer();
				} else {
					error.innerHTML = 'Deze code bestaat niet, probeer nog eens';
				}
			});
		}
	}

	// When clicking on next button, run the function
	nextBtn.addEventListener('click', () => {
		codeChecker();
	});
};
