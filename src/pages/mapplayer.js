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

const mapTemplate = require('../templates/mapplayer.hbs');

export default () => {
	// render the template
	App.render(mapTemplate());

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	/* ********************** GOOGLE *********************** */

	// Initialize Firebase
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
	}

	// Add a realtime listener
	firebase.auth().onAuthStateChanged((user) => {
		if (user.photoURL) {
			newImg.src = user.photoURL;
		} else {
			newImg.src = 'https://pwco.com.sg/wp-content/uploads/2020/05/Generic-Profile-Placeholder-v3.png';
		}
	});

	// Constanten
	const newImg = document.getElementById('newImg');

	// taking everything out of local storage
	const userLat = localStorage.getItem('Latitude');
	const userLon = localStorage.getItem('Longitude');
	const distance = localStorage.getItem('Distance');
	const gamecode = localStorage.getItem('GameCode');
	const playercode = localStorage.getItem('playerCode');

	/* ********************** TIMER *********************** */

	// Putting data in localstorage
	App.firebase.getFirestore().collection('games').doc(gamecode).get()
	.then((doc) => {
		localStorage.setItem('Timer', doc.data().time);
		localStorage.setItem('Distance', doc.data().distance);
	});

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
			}
		}, 1000);
		// function to show progress bar
		startBar();
	}

	// When the moderator starts the game, start timer
	App.firebase.getFirestore().collection('games')
	.onSnapshot((snapshot) => {
		const changes = snapshot.docChanges();
		changes.forEach((change) => {
			if (change.type == 'modified') {

				if(change.doc.id == gamecode) {

					App.firebase.getFirestore().collection('games').doc(gamecode).get()
					.then((snapshot) => {
						if (snapshot.data().status == false) {
							startTimer()
						}
					});
				}
			}
		});
	});


/* ********************** MAPBOX *********************** */

/* ****** GEOLOCATION ****** */

setInterval(() => { 
	if ('geolocation' in navigator) {
		navigator.geolocation.getCurrentPosition((position) => {
			const lat = position.coords.latitude;
			const lon = position.coords.longitude;

			App.firebase.getFirestore().collection('games').doc(gamecode)
			.collection('players').doc(playercode).update({
				location: {
					latitude: lat,
					longitude: lon,
				},
			});

			// putting it in local storage
			localStorage.setItem('Latitude', lat);
			localStorage.setItem('Longitude', lon);
	});
	} else {
		console.log('Geolocation not available');
	}
}, 5000)


mapboxgl.accessToken = MAPBOX_API_KEY;
  // create the MapBox options
	const map = new mapboxgl.Map({
		container: 'mapbox', // container id
		style: 'mapbox://styles/mapbox/light-v10',
		center: [userLon, userLat], // starting position
		zoom: 16, // starting zoom
	});

	// Add geolocate control to the map.
	map.addControl(
		new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			trackUserLocation: true,
		}),
	);

	// show marker of the player
	new mapboxgl.Marker({ 
		"color": "green"
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
				"color": "grey" 
			})
				.setLngLat([change.doc.data().location.longitude,
							change.doc.data().location.latitude])
				.addTo(map);
		});
	});

	// Where the circle has to be
    map.on('load', () => {
		map.addSource('source_circle_500', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: [{
					type: 'Feature',
					geometry: {
					type: 'Point',
					coordinates: [userLon, userLat],
					},
				}],
			},
		});

      // How big, color the circle has to be
      map.addLayer({
        id: 'circle500',
        type: 'circle',
        source: 'source_circle_500',
        paint: {
          'circle-radius': {
            stops: [
				[0, 0],
				// eslint-disable-next-line no-mixed-operators
              [20, (distance, (distance / 0.075 / Math.cos(userLat * Math.PI / 180)))],
            ],
            base: 2,
          },
          'circle-color': 'purple',
					'circle-opacity': 0.1,
        },
      });
	});
};
