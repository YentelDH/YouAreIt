/**
 * The Settings Moderator Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */

import * as firebase from 'firebase/app';
import App from '../lib/App';

const settingsMod2Template = require('../templates/settingsmod2.hbs');

export default () => {
	// render the template
	App.render(settingsMod2Template());

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	const inputMinutes = document.getElementById('inputMinutes');
	const submitMinutes = document.getElementById('submitMinutes');

	// function to put chosen timer in local storage
	function minutesStorage() {
		const minutes = inputMinutes.value;
		localStorage.setItem('Timer', minutes);
	}

	submitMinutes.addEventListener('click', () => {
		minutesStorage();
	});
};
