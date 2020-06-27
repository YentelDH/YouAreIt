/**
 * The Profile Page
*/

/* eslint-disable no-tabs */
/* eslint-disable indent */

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import * as consts from '../consts';
import 'firebase/storage';
import 'firebase/firestore';

import App from '../lib/App';

const profileTemplate = require('../templates/profile.hbs');

export default () => {
	const games = [
		{
			name: 'Yentel De Hauwere',
			location: 'Dendermonde',
		},
		{
			name: 'Marina Tafel',
			location: 'Leuven',
		},
		{
			name: 'Monique Verslagen',
			location: 'Gent',
		},
		{
			name: 'Xavier Bier',
			location: 'Brussel',
		},
		{
			name: 'Kimbel Baby',
			location: 'Tilburg',
		},
	];

	// render the template
	App.render(profileTemplate({ games }));

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});

	// Initialize Firebase
	if (!firebase.apps.length) {
		firebase.initializeApp(consts.firebaseConfig);
	}

	// Constanten
	const newName = document.getElementById('newName');
	const newImg = document.getElementById('newImg');

	// const btnImageUpload = document.getElementById('btnImgUpload');

	/**
	 * upload image when clicking on button
	 */
	/* const uploadFile = () => {
		firebase.auth().onAuthStateChanged((user) => {
			const filesList = btnImageUpload.files;
			const storageRef = firebase.storage().ref();

			const file = filesList.item(0);

			const myImageStorage = storageRef.child('images');
			// eslint-disable-next-line prefer-template
			const myImage = myImageStorage.child(user.uid + '/profilePicture');

			const task = myImage.put(file);
			console.log(user);

			// eslint-disable-next-line arrow-body-style
			task.then((snapshot) => {
					return snapshot.ref.getDownloadURL();
				})
				.then((downloadURL) => {
					console.log(downloadURL);
					return downloadURL;
				})
				.catch((error) => {
					console.log(error);
				});
		});
	};

	btnImageUpload.addEventListener('change', uploadFile, false); */

		// Add a realtime listener
		firebase.auth().onAuthStateChanged((user) => {
			if (user.photoURL + user.displayName) {
				newImg.src = user.photoURL;
				newName.innerHTML = user.displayName;
			} else {
				newImg.src = '../../public/images/example.efe0dbc.jpg';
				newName.innerHTML = 'Speler';
			}
		});
};
