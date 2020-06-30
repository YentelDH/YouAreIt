/**
 * The Settings Moderator Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable eqeqeq */

import * as firebase from 'firebase/app';
import App from '../lib/App';
import Notify from '../classes/Notifications';

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

	// Constants
	const gameCode = document.getElementById('gameCode');
	const code = localStorage.getItem('GameCode');

	const nextBtn = document.getElementById('nextBtn');
	const deny = document.getElementById('deny');
	const accept = document.getElementById('accept');
	const popup2 = document.getElementById('popup-2');
	const overlay = document.getElementById('overlayLogOut');

	const deleteBtn = document.getElementById('deleteBtn');
	const deny2 = document.getElementById('deny2');
	const accept2 = document.getElementById('accept2');
	const popup3 = document.getElementById('popup-3');
	const overlayDelete = document.getElementById('overlayDelete');

	const gamecode = localStorage.getItem('GameCode');

	const notification = new Notify();

	// shows code of game in html
	gameCode.textContent = code;

	function renderPlayers(doc) {
		const listItem = document.getElementById('listItem');
		listItem.setAttribute('data-id', doc.id);
		const name = document.getElementById('listItemName');
		const image = document.getElementById('listItemImg');

		name.textContent = doc.data().name;

		if (doc.data().image) {
			image.src = doc.data().image;
		} else {
			image.src = 'https://pwco.com.sg/wp-content/uploads/2020/05/Generic-Profile-Placeholder-v3.png';
		}

		accept2.addEventListener('click', (e) => {
			e.stopPropagation();
			const id = listItem.getAttribute('data-id');
			App.firebase.getFirestore().collection('games')
			.doc(code).collection('players')
			.doc(id)
			.delete();

			overlayDelete.style.display = 'none';
			popup3.style.zIndex = '-3';
		});
	}

	// Real time listener
	App.firebase.getFirestore().collection('games')
	.doc(gamecode).collection('players')
	.onSnapshot((snapshot) => {
		const playerList = document.getElementById('player-list');
		const changes = snapshot.docChanges();
		changes.forEach((change) => {
			// when a player has been added, show it in html
			if (change.type == 'added') {
				renderPlayers(change.doc);
			// when a player has been removed, delete it from html
			} else if (change.type == 'removed') {
				const listItem = playerList.querySelector(`[data-id=${change.doc.id}]`);
				playerList.removeChild(listItem);
			}
		});
	});

	function activeGame() {
		App.firebase.getFirestore().collection('games').doc(gamecode).update({
			started: true,
			status: false,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});
	}

	/*
	* DELETE PLAYER BUTTON
	*/
	// If you click the delete button
	deleteBtn.addEventListener('click', () => {
		popup3.style.zIndex = '3';
		overlayDelete.style.display = 'flex';
	});

	// Hide popup when clicking on the cancel button
	deny2.addEventListener('click', () => {
		popup3.style.zIndex = '-3';
		overlayDelete.style.display = 'none';
	});

	/*
	* GO NEXT BUTTON
	*/

	// If you click the next button
	nextBtn.addEventListener('click', () => {
			popup2.style.zIndex = '3';
			overlay.style.display = 'flex';
	});

	// Hide popup when clicking on the cancel button
	deny.addEventListener('click', () => {
		popup2.style.zIndex = '-3';
		overlay.style.display = 'none';
	});

	// When clicking on yes of pop up
	accept.addEventListener('click', () => {
		notification.notifyModerator();
		activeGame();
		localStorage.setItem('start game', 'ready');
		App.router.navigate('/mapmoderator');
	});
};
