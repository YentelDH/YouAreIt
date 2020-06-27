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
		// render the template
		App.render(settingsMod3Template());

		// If user not logged in, go to sign in
		firebase.auth().onAuthStateChanged((user) => {
			if (!user) {
				App.router.navigate('/signin');
			}
		});

		// Constanten
		const buttonMod = document.getElementById('btnModerator');
		const notification = new Notify();

		// function to put chosen distance in local storage
		function distanceStorage() {
			const distance = document.getElementById('inputDistance').value;
			localStorage.setItem('Distance', distance);
		}

		function setCollection() {
			firebase.auth().onAuthStateChanged((user) => {
				const gamecode = localStorage.getItem('GameCode');
				App.firebase.getFirestore().collection('games').doc(gamecode).set({
					moderator: user.displayName,
					lobby: false,
				});
			});
		}

		// Notify
		buttonMod.addEventListener('click', () => {
			setCollection();
			notification.notifyModerator();
			distanceStorage();

			localStorage.setItem('start game', 'ready');
		});
};
