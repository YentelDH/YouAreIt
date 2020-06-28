/**
 * The Settings Moderator Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */

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

	const inputMinutes = document.getElementById('inputMinutes');
	const submitMinutes = document.getElementById('submitMinutes');
	const txtError = document.getElementById('txtError');

	// function to put chosen timer in local storage
	function minutesStorage() {
		const minutes = inputMinutes.value;
		localStorage.setItem('Timer', minutes);
	}

	submitMinutes.addEventListener('click', () => {
		// error giving
		if (inputMinutes.value === 0) {
			txtError.innerHTML = 'Gelieve het aantal minuten in te geven.';
		} else if (inputMinutes.value > 720) {
			txtError.innerHTML = 'Je kan maar maximum 12 uur spelen, gelieve de tijd in te korten.';
		} else {
			minutesStorage();
			App.router.navigate('/settingsmod3');
		}	
	});
};
