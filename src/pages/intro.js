/**
 * The Intro Page
*/

/* eslint-disable no-tabs */
/* eslint-disable indent */

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import * as consts from '../consts';

import App from '../lib/App';

const introTemplate = require('../templates/intro.hbs');

export default () => {
  // render the template
	App.render(introTemplate());

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
	const newFname = document.getElementById('newFname');

	// Add a realtime listener
	firebase.auth().onAuthStateChanged((user) => {
		const name = user.email.substring(0, user.email.lastIndexOf('@'));
		if (!user.displayName) {
			user.updateProfile({
				displayName: name,
				photoURL: 'https://pwco.com.sg/wp-content/uploads/Generic-Profile-Placeholder-v3.png',
			});
		}
		// spit user's name to get only first name
		if (user) {
			// eslint-disable-next-line one-var
			const fullName = user.displayName.split(' '),
			firstName = fullName[0];
			newFname.innerHTML = `Welkom ${firstName}`;
		} else {
			newFname.innerHTML = 'Welkom speler';
		}
	});
};
