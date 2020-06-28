/**
 * The Settings Moderator Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */

import * as firebase from 'firebase/app';
import App from '../lib/App';

const settingsModTemplate = require('../templates/settingsmod.hbs');

export default () => {

  // render the template
	App.render(settingsModTemplate());

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	const gameCode = document.getElementById('gameCode');
	const code = localStorage.getItem('GameCode');
	const goBack = document.getElementById('goBack');

	// shows code of game in html
	gameCode.textContent = code;

	goBack.addEventListener('click', () => {
		// TODO: if player clicks, delete recent made game in firebase
		App.firebase.getFirestore().collection('games').doc(code).delete();
		localStorage.removeItem('Distance');
		localStorage.removeItem('Timer');
	});

	// when clicking on class, change color
	/* document.getElementsByClassName('o-container-player').forEach(element, i){
		element.addEvenListener('click', () => {
		document.getElementsByClassName('o-container-player')[i].style.backgroundColor = 'red';
	})} */
};
