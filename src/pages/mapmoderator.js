/**
 * The Map Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable no-undef */
/* eslint-disable prefer-template */

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import { MAPBOX_API_KEY, firebaseConfig } from '../consts';

import App from '../lib/App';

const mapTemplate = require('../templates/mapmoderator.hbs');

export default () => {
	// render the template
	App.render(mapTemplate());

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	// Constanten
	const closeBtn = document.getElementById('closeBtn');
	const optionsBtn = document.getElementById('optionsBtn');
	const popup = document.getElementById('popup-1');

	const endGameCard = document.getElementById('endGameCard');
	const deny = document.getElementById('deny');
	const accept = document.getElementById('accept');
	const popup2 = document.getElementById('popup-2');
	const overlay = document.getElementById('overlayLogOut');

	const gamecode = localStorage.getItem('GameCode');

	/* ********************** TIMER *********************** */

	/**
	 * function to let the progressbar run with the given seconds
	 */
	function startBar() {
		const barSeconds = localStorage.getItem('Timer') * 60000;
		// eslint-disable-next-line global-require
		const ProgressBar = require('progressbar.js');

		// implement progressbar in the div "progressbar"
		const bar = new ProgressBar.Line(progressbar, {
			easing: 'linear',
			duration: barSeconds,
			color: '#6441aa',
			svgStyle: { width: '100%', height: '100%', margin: '0 0 100px 0' },
		});
		bar.animate(1.0);
	}

	function deleteTimer() {
		localStorage.setItem('TimerMinutes', '00');
		localStorage.setItem('TimerSeconds', '00');
	}

	/**
	 * create countdown timer en puts it in html
	 */
	function startTimer() {
		let timer = localStorage.getItem('Timer') * 60; // turn minutes into seconds
		let minutes;
		let seconds;
		const countdown = document.getElementById('timer');
		const overlayEnd = document.getElementById('endgame-overlay');

		setInterval(() => {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? `0${minutes}` : minutes;
			seconds = seconds < 10 ? `0${seconds}` : seconds;

			localStorage.setItem('TimerMinutes', minutes);
			localStorage.setItem('TimerSeconds', seconds);

			const xminutes = localStorage.getItem('TimerMinutes');
			const xseconds = localStorage.getItem('TimerSeconds');

			if (xminutes && xseconds) {
				// putting timer in html
				// eslint-disable-next-line no-param-reassign
				countdown.textContent = `${xminutes}:${xseconds}`;
			} else {
				countdown.textContent = '00:00';
			}

			// when the timer has stopped
			if (--timer < 0) {
				countdown.textContent = 'Game over';
				overlayEnd.style.display = 'flex';
				deleteTimer();
			}
		}, 1000);
		// function to show progress bar
		startBar();
	}

	/* ********************** START GAME *********************** */
	const overlayStart = document.getElementById('startgame-overlay');

	// if clicked on the "start game" popup then hide popup and tell the game has started
	overlayStart.addEventListener('click', () => {
		overlayStart.style.display = 'none';
		App.firebase.getFirestore().collection('games').doc(gamecode).update({
			status: false,
		});
		// the timer starts when clicking on overlay
		startTimer();
	});

	const startGame = localStorage.getItem('start game');
	// if the game has already started then doesnt show the "start game" popup
	if (startGame === 'ready') {
		overlayStart.style.display = 'flex';
	} else {
		overlayStart.style.display = 'none';
	}

	/* ********************** OPTIONS GAME *********************** */

	// show popup when clicking on the card
	optionsBtn.addEventListener('click', () => {
		popup.style.zIndex = '2';
	});

	// hide popup when clicking on the cancel button
	closeBtn.addEventListener('click', () => {
		popup.style.zIndex = '-2';
	});

	// show popup when clicking on the card
	endGameCard.addEventListener('click', () => {
		popup2.style.zIndex = '3';
		overlay.style.display = 'flex';
	});

	// hide popup when clicking on the cancel button
	deny.addEventListener('click', () => {
		popup2.style.zIndex = '-3';
		overlay.style.display = 'none';
	});

	// end game and go to map
	accept.addEventListener('click', () => {
		deleteTimer();
		App.router.navigate('/map');
		App.firebase.getFirestore().collection('games').doc(gamecode).update({
			status: true,
		});
	});

  /* ********************** GOOGLE *********************** */

	// Initialize Firebase
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
	}

	// Constanten
	const newImg = document.getElementById('newImg');

	// Add a realtime listener
	firebase.auth().onAuthStateChanged((user) => {
		if (user.photoURL) {
			newImg.src = user.photoURL;
		} else {
			newImg.src = 'https://pwco.com.sg/wp-content/uploads/2020/05/Generic-Profile-Placeholder-v3.png';
		}
	});

/* ********************** GEOLOCATION *********************** */

if ('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition((position) => {
		const lat = position.coords.latitude;
		const lon = position.coords.longitude;

		// putting it in local storage
		localStorage.setItem('Latitude', lat);
		localStorage.setItem('Longitude', lon);
	});
} else {
	console.log('Geolocation not available');
}

/* ********************** MAPBOX *********************** */
// taking everything out of local storage
const userLat = localStorage.getItem('Latitude');
const userLon = localStorage.getItem('Longitude');
// const distance = localStorage.getItem('Distance');

mapboxgl.accessToken = MAPBOX_API_KEY;
  // create the MapBox options
	const map = new mapboxgl.Map({
		container: 'mapbox', // container id
		style: 'mapbox://styles/mapbox/light-v10',
		center: [userLon, userLat], // starting position
		zoom: 16, // starting zoom
	});

	// show marker of the moderator
	new mapboxgl.Marker({
		color: 'green',
	})
		.setLngLat([userLon, userLat])
		.addTo(map);

	// Loops through all the players
	App.firebase.getFirestore().collection('games')
	.doc(gamecode).collection('players')
	.onSnapshot((snapshot) => {
		const changes = snapshot.docChanges();
		changes.forEach((change) => {
			new mapboxgl.Marker({
				color: 'red',
			})
				.setLngLat([change.doc.data().location.longitude,
							change.doc.data().location.latitude])
				.addTo(map);
		});
	});
};
