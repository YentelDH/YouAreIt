/**
 * The Settings Moderator Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable eqeqeq */

import * as firebase from 'firebase/app';
import App from '../lib/App';

const settingsMod3Template = require('../templates/settingsmod3.hbs');

export default () => {
		const distancePlaceholder = localStorage.getItem('Distance');

		// render the template
		App.render(settingsMod3Template({ distancePlaceholder }));

		// If user not logged in, go to sign in
		firebase.auth().onAuthStateChanged((user) => {
			if (!user) {
				App.router.navigate('/signin');
			}
		});

		// Constants
		const backBtn = document.getElementById('backBtn');
		const nextBtn = document.getElementById('nextBtn');

		const inputDistance = document.getElementById('inputDistance');

		const code = localStorage.getItem('GameCode');

		const txtError = document.getElementById('txtError');

		// function to put chosen distance in local storage
		function distanceStorage() {
			const distance = inputDistance.value;
			localStorage.setItem('Distance', distance);
		}

		/*
		* GO BACK BUTTON
		*/
		// Delete game in firebase
		backBtn.addEventListener('click', () => {
			localStorage.removeItem('Distance');
			localStorage.removeItem('Timer');
			App.firebase.getFirestore().collection('games').doc(code).delete();
		});

		/*
		* GO NEXT BUTTON
		*/
		// If you click the next button
		nextBtn.addEventListener('click', () => {
			// Error giving
			if (inputDistance.value <= 0) {
				txtError.innerHTML = 'Gelieve in te geven hoelang de straal moet zijn.';
			} else if (inputDistance.value > 2000) {
				txtError.innerHTML = 'Je kan de straal maximum 2 km zetten, gelieve de straal in te korten.';
			} else {
				distanceStorage();
				App.router.navigate('/settingsmod2');
			}
		});
};
