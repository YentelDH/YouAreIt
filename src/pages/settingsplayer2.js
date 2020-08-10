/**
 * The Profile Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable eqeqeq */

import * as firebase from 'firebase/app';
import App from '../lib/App';
import Notify from '../classes/Notifications';

const settingsPlayer2Template = require('../templates/settingsplayer2.hbs');

const notification = new Notify();

export default () => {
	const gamecode = localStorage.getItem('GameCode');
	const playercode = localStorage.getItem('playerCode');

	// Give name of moderator to html
	App.firebase.getFirestore().collection('games').doc(gamecode).get()
	.then((doc) => {
		const moderatorName = doc.data().moderator.name;
		localStorage.setItem('Timer', doc.data().time);
		localStorage.setItem('Distance', doc.data().distance);

		// render the template
		App.render(settingsPlayer2Template({ moderatorName }));
	});

	function renderPlayers(doc) {
		const playerList = document.getElementById('playerListPlayer');

		const listItem = document.createElement('li');
		listItem.classList.add('o-container-player');
		listItem.setAttribute('data-id', doc.id);

		const playerFrame = document.createElement('div');
		playerFrame.classList.add('m-player-frame');

		const playerImage = document.createElement('img');
		playerImage.classList.add('a-player-picture');

		const playerInfo = document.createElement('div');
		playerInfo.classList.add('m-player-info');

		const playerName = document.createElement('p');
		playerName.classList.add('a-player-name');

		playerList.appendChild(listItem); // ul > li

		listItem.appendChild(playerFrame); // li > div 1
		playerFrame.appendChild(playerImage); // div 1 > img

		listItem.appendChild(playerInfo); // li > div 2
		playerInfo.appendChild(playerName); // div 1 > img

		playerName.textContent = doc.data().name;

		if (doc.data().image) {
			playerImage.src = doc.data().image;
		} else {
			playerImage.src = 'https://pwco.com.sg/wp-content/uploads/2020/05/Generic-Profile-Placeholder-v3.png';
		}
	}

	// Function to render real time players in html
	App.firebase.getFirestore().collection('games')
	.doc(gamecode).collection('players')
	.onSnapshot((snapshot) => {
		const changes = snapshot.docChanges();
		changes.forEach((change) => {
			// when a player has been added, show it in html
			if (change.type == 'added') {
				renderPlayers(change.doc);
			// when a player has been removed, delete it from html
			} else if (change.type == 'removed') {
				if (change.doc.id == playercode) {
					console.log('u just got deleted');
					App.router.navigate('/map');
					notification.notifyKickPlayer();
				}
			}
		});
	});

	// When the moderator started the game, go to map
	App.firebase.getFirestore().collection('games')
	.onSnapshot((snapshot) => {
		const changes = snapshot.docChanges();
		changes.forEach((change) => {
			if (change.type == 'modified') {
				if (change.doc.id == gamecode) {
					App.firebase.getFirestore().collection('games').doc(gamecode).get()
					// eslint-disable-next-line no-shadow
					.then((snapshot) => {
						if (snapshot.data().started == true) {
							App.router.navigate('/mapplayer');
							notification.notifyPlayer();
						}
					});
				}
			}
		});
	});

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});
};
