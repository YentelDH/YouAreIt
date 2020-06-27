/**
 * The Profile Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */

import * as firebase from 'firebase/app';
import App from '../lib/App';

const settingsPlayerTemplate = require('../templates/settingsplayer.hbs');

export default () => {
	const players = [
		{
			name: 'André Spoor',
		},
		{
			name: 'Hubertus Wiel',
		},
		{
			name: 'Monique Verslagen',
		},
		{
			name: 'Yvonne Stoom',
		},
		{
			name: 'Julius Patron',
		},
	];

	// render the template
	App.render(settingsPlayerTemplate({ players }));

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	// Constants
	const inputGamecode = document.getElementById('inputGamecode');
	const nextBtn = document.getElementById('next');
	const error = document.getElementById('txtError');


	// Check if code from input exist in storage
	function codeChecker() {
		const gamecode = inputGamecode.value;
		App.firebase.getFirestore().collection('games').doc(gamecode).get().then(function(doc) {
			if (doc.exists) {
				console.log(doc.data())
				localStorage.setItem('GameCode', gamecode);
				window.location.href = '/#!/settingsplayer2';
			} else {
				error.innerHTML = 'Deze code bestaat niet, probeer nog eens';
			}
		}) 
	}

	// When clicking on next button, run the function
	nextBtn.addEventListener('click', () => {
		codeChecker();
	});

	// Set players in the game
	/* const gamecode = localStorage.getItem('GameCode');

	App.firebase.getFirestore().collection('games').get().then((snapshot) => {
		snapshot.docs.forEach(doc => {
			console.log(doc.data());
		})
	}); */

	


	/* App.firebase.getFirestore().collection('games').get().then((games) => {
		games.forEach((game) => {
			if (game.id === gamecode) {
				// loop players
				game.data().players.forEach((player, i) => {
					// getting location of a player
					if(currentUser.uid === player.uid) {
						if (navigator.geolocation) {
							navigator.geolocation.getCurrentPosition((pos) => {
								const lat = pos.coords.latitude;
								const lon = pos.coords.longitude;
								const object = {
									latitude: lat,
									longitude: lon,
									playerid: player.uid,
								};

								App.firebase.getFirestore().collection('games').doc(gamecode).update({
									positions: App.firebase.getFirestoreWithoutBraces().FieldValue.arrayUnion(object),
								});
							});
						} else {
							console.log('Geolocation doesnt work');
						}
					}
				});
			}
		});
	}); */
};
