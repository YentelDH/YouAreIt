/**
 * The Options Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */

import * as firebase from 'firebase/app';
import App from '../lib/App';

const firebaseTemplate = require('../templates/options.hbs');

export default () => {
  // render the template
	App.render(firebaseTemplate());

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	const endGameCard = document.getElementById('endGameCard');
	const overlay = document.getElementById('overlay');
	const deny = document.getElementById('deny');
	const popup = document.getElementById('popup');

	// show popup when clicking on the card
	endGameCard.addEventListener('click', () => {
		overlay.style.display = 'flex';
		popup.style.top = '200px';
	});

	// hide popup when clicking on the cancel button
	deny.addEventListener('click', () => {
		overlay.style.display = 'none';
		popup.style.top = '1000px';
	});
};
