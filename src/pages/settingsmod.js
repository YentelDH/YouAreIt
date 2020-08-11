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

	const deny2 = document.getElementById('deny2');
	const accept2 = document.getElementById('accept2');
	const popup3 = document.getElementById('popup-3');
	const overlayDelete = document.getElementById('overlayDelete');

	const gamecode = localStorage.getItem('GameCode');

	const playerList = document.getElementById('playerList');

	const notification = new Notify();

	// shows code of game in html
	gameCode.textContent = code;

	function renderPlayers(doc) {
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

		const playerDelete = document.createElement('button');
		playerDelete.classList.add('m-player-delete');
		playerDelete.setAttribute('id', 'deleteBtn');
		const deleteIcon = document.createElement('div');
		deleteIcon.style.fontFamily = 'FontAwesome';
		deleteIcon.innerHTML = '&#xf014;';
		deleteIcon.style.fontSize = '1.8rem';

		playerList.appendChild(listItem); // ul > li

		listItem.appendChild(playerFrame); // li > div 1
		playerFrame.appendChild(playerImage); // div 1 > img

		listItem.appendChild(playerInfo); // li > div 2
		playerInfo.appendChild(playerName); // div 1 > img

		listItem.appendChild(playerDelete); // li > button
		playerDelete.appendChild(deleteIcon); // button > i

		playerName.textContent = doc.data().name;

		if (doc.data().image) {
			playerImage.src = doc.data().image;
		} else {
			playerImage.src = 'https://pwco.com.sg/wp-content/uploads/2020/05/Generic-Profile-Placeholder-v3.png';
		}

		// hide delete button of moderator
		playerList.firstElementChild.getElementsByClassName('m-player-delete')[0].style.display = 'none';

		/*
		* DELETE PLAYER BUTTON
		*/
		playerDelete.addEventListener('click', (e) => {
			popup3.style.zIndex = '3';
			overlayDelete.style.display = 'flex';
			e.stopPropagation();
			const idParent = e.target.parentElement.parentElement.getAttribute('data-id');
			localStorage.setItem('Consider Delete', idParent);
		});

		// delete player if clicked on yes
		accept2.addEventListener('click', (e) => {
			e.stopPropagation();
			const id = localStorage.getItem('Consider Delete');
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
	.orderBy('timestamp')
	.onSnapshot((snapshot) => {
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
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});
	}

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
