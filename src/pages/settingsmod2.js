/**
 * The Settings Moderator Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable eqeqeq */

import * as firebase from 'firebase/app';
import App from '../lib/App';

const settingsMod2Template = require('../templates/settingsmod2.hbs');

export default () => {
	const timerPlaceholder = localStorage.getItem('Timer');

	// render the template
	App.render(settingsMod2Template({ timerPlaceholder }));

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	// Constants
	const inputMinutes = document.getElementById('inputMinutes');
	const submitMinutes = document.getElementById('submitMinutes');
	const txtError = document.getElementById('txtError');
	const gamecode = localStorage.getItem('GameCode');
	/* thanks to Silver Ringvee: https://stackoverflow.com/users/4769218/silver-ringvee */
	const playerCode = Math.random().toString(36).substr(2, 5);
	localStorage.setItem('playerCode', playerCode);

	// function to put chosen timer in local storage
	function minutesStorage() {
		const minutes = inputMinutes.value;
		localStorage.setItem('Timer', minutes);
		App.firebase.getFirestore().collection('games').doc(gamecode).update({
			time: minutes,
		});
	}

	function setPlayer() {
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
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				};

				App.firebase.getFirestore().collection('games').doc(gamecode)
				.collection('players')
				.doc(playerCode)
				.set(player)
				.then(() => {
					localStorage.setItem('playerCode', playerCode);
				});
			});
		});
	}

	submitMinutes.addEventListener('click', () => {
		// error giving
		if (inputMinutes.value <= 0) {
			txtError.innerHTML = 'Gelieve het aantal minuten in te geven.';
		} else if (inputMinutes.value > 720) {
			txtError.innerHTML = 'Je kan maar maximum 12 uur spelen, gelieve de tijd in te korten.';
		} else {
			minutesStorage();
			setPlayer();
			App.router.navigate('/settingsmod');
		}
	});
};
