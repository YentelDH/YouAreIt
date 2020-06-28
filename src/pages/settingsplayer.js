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

	function setPlayer() {
		firebase.auth().onAuthStateChanged((user) => {
			const username = user.displayName;
			const gamecode = inputGamecode.value;

			const player = {
				location: {
					latitude: "12.334",
					longitude: "3.3564"
				}
			}
		
			App.firebase.getFirestore().collection("games").doc(gamecode)
			.collection("players").doc(username).set(player).then(function() {
				alert("Je bent aan de game toegevoegd")
			});
		});
	}



	// Check if code from input exist in storage
	function codeChecker() {
		const gamecode = inputGamecode.value;
		if (gamecode == "") {
			error.innerHTML = 'Gelieve een gamecode in te geven';
		} else {
			App.firebase.getFirestore().collection('games').doc(gamecode).get().then(function(doc) {
				if (doc.exists) {
					localStorage.setItem('GameCode', gamecode);
					window.location.href = '/#!/settingsplayer2';
					setPlayer();
				} else {
					error.innerHTML = 'Deze code bestaat niet, probeer nog eens';
				}
			}) 
		}
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
