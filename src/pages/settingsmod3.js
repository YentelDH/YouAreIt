/**
 * The Settings Moderator Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */

import * as firebase from 'firebase/app';
import App from '../lib/App';
import Notify from '../classes/Notifications';

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

		// Constanten
		const buttonMod = document.getElementById('btnModerator');
		const inputDistance = document.getElementById('inputDistance');

		const txtError = document.getElementById('txtError');

		const deny = document.getElementById('deny');
		const accept = document.getElementById('accept');
		const popup2 = document.getElementById('popup-2');
		const notification = new Notify();

		// function to put chosen distance in local storage
		function distanceStorage() {
			const distance = inputDistance.value;
			localStorage.setItem('Distance', distance);
		}

		function changeGameStatus() {
			const gamecode = localStorage.getItem('GameCode');
			App.firebase.getFirestore().collection('games').doc(gamecode).update({
				status: false
			});
		}

		// If you click the next button
		buttonMod.addEventListener('click', () => {
			// Error giving
			if (inputDistance.value == 0) {
				txtError.innerHTML = 'Gelieve in te geven hoelang de straal moet zijn.';
			} else if (inputDistance.value > 2000) { 
				txtError.innerHTML = 'Je kan de straal maximum 2 km zetten, gelieve de straal in te korten.';
			} else {
				popup2.style.zIndex = '3';
				distanceStorage();
			}
		});

		// hide popup when clicking on the cancel button
		deny.addEventListener('click', () => {
			popup2.style.zIndex = '-3';
		});

		// when clicking on "ja": notificatie, game niet toegankelijk maken, naar map gaan
		accept.addEventListener('click', () => {
			notification.notifyModerator();
			changeGameStatus();
			localStorage.setItem('start game', 'ready');
			App.router.navigate('/mapmoderator');
		});
};
