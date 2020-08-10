/**
 * The Map Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable no-undef */

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import { MAPBOX_API_KEY, firebaseConfig } from '../consts';

import App from '../lib/App';

import Seed from '../classes/Dataseeder';

const mapTemplate = require('../templates/map.hbs');

export default () => {
	// render the template
	App.render(mapTemplate());

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	// Initialize Firebase
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
	}

	// Constanten
	const newImg = document.getElementById('newImg');

	// If user has picture, use that, else, take default
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

		localStorage.setItem('Latitude', lat);
		localStorage.setItem('Longitude', lon);
	});
} else {
	console.log('not avaibalabebebe');
}

/* ********************** MAPBOX *********************** */

const userLat = localStorage.getItem('Latitude');
const userLon = localStorage.getItem('Longitude');

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
};

/* ********************** DATASEEDER *********************** */

// make object
const user1 = new Seed();
// console.log(user1);

user1.startPlayer();

setTimeout(() => {
	// console.log('the player stopped moving');
	user1.stopPlayer();
}, 12000);