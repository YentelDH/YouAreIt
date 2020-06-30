/**
 * The Profile Page
*/

/* eslint-disable no-tabs */
/* eslint-disable indent */

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import * as consts from '../consts';

import App from '../lib/App';

const settingsTemplate = require('../templates/settings.hbs');

export default () => {
  // render the template
	App.render(settingsTemplate());

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	// Initialize Firebase
	if (!firebase.apps.length) {
		firebase.initializeApp(consts.firebaseConfig);
	}

	// Constanten
	const newName = document.getElementById('newName');
	const newImg = document.getElementById('newImg');

	const btnLogOut = document.getElementById('btnLogOut');
	const overlayLogOut = document.getElementById('overlayLogOut');
	const denyLogOut = document.getElementById('denyLogOut');
	const popupLogOut = document.getElementById('popupLogOut');
	const acceptLogOut = document.getElementById('acceptLogOut');
	const settings = document.getElementById('settings');

	// Add a realtime listener
	firebase.auth().onAuthStateChanged((user) => {
		const name = user.email.substring(0, user.email.lastIndexOf('@'));
		if (!user.displayName) {
			user.updateProfile({
				displayName: name,
			});
		} else if (user.displayName) {
			newName.innerHTML = user.displayName;
		}

		if (user.photoURL == null) {
			newImg.src = 'https://pwco.com.sg/wp-content/uploads/2020/05/Generic-Profile-Placeholder-v3.png';
		} else {
			newImg.src = user.photoURL;
		}
	});

	// show popup when trying to log out
	btnLogOut.addEventListener('click', () => {
		overlayLogOut.style.display = 'flex';
		popupLogOut.style.display = 'flex';
		settings.style.display = 'none';
	});

	// hide popup when clicking on deny button
	denyLogOut.addEventListener('click', () => {
		overlayLogOut.style.display = 'none';
		popupLogOut.style.display = 'none';
		settings.style.display = 'block';
	});

	// Log out event
	acceptLogOut.addEventListener('click', () => {
		firebase.auth().signOut()
			.then(() => {
				App.router.navigate('/signin');
			}).catch((e) => {
				console.log(e.message);
			});
	});
};
