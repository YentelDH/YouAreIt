/**
 * The Profile Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */

import * as firebase from 'firebase/app';
import App from '../lib/App';

const settingsPlayer2Template = require('../templates/settingsplayer2.hbs');

export default () => {
	const players = [
		{
			img: 'example',
			name: 'André Spoor',
		},
		{
			img: 'example',
			name: 'Hubertus Wiel',
		},

	];

	const gamecode = localStorage.getItem('GameCode');

	// 
	App.firebase.getFirestore().collection('games').doc(gamecode).get().then(function(doc) {
		const moderator = doc.data().moderator;

		// render the template
		App.render(settingsPlayer2Template({ players, moderator }));
	}) 
	
	

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});
};
