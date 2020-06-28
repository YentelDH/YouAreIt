/**
 * The Profile Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */

import * as firebase from 'firebase/app';
import App from '../lib/App';

const settingsPlayer2Template = require('../templates/settingsplayer2.hbs');

export default () => {

	const gamecode = localStorage.getItem('GameCode');

	// Give name of moderator to html
	App.firebase.getFirestore().collection('games').doc(gamecode).get().then(function(doc) {
		const moderator = doc.data().moderator;

		// render the template
		App.render(settingsPlayer2Template({ moderator }));
	}) 
	
	function renderPlayers(doc) {
		const playerList = document.getElementById('player-list');

		const listItem = document.createElement('li');
		listItem.classList.add('o-container-player');

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
		playerImage.src = doc.data().image;
	}
	
	App.firebase.getFirestore().collection('games').doc(gamecode)
	.collection('players').get().then((snapshot) => {
		snapshot.docs.forEach(doc => {
			renderPlayers(doc);
		})
	})

	// Function when game has started, go to map

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});
};
