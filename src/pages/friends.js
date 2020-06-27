/**
 * The Profile Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */

import * as firebase from 'firebase/app';
import App from '../lib/App';

const friendsTemplate = require('../templates/friends.hbs');

export default () => {
	const players = [
		{
			img: 'example',
			name: 'Yentel De Hauwere',
			code: '04495',
		},
		{
			img: 'example',
			name: 'Marina Tafel',
			code: '49251',
		},
		{
			img: 'example',
			name: 'Monique Verslagen',
			code: '03955',
		},
		{
			img: 'example',
			name: 'Xavier Bier',
			code: '03245',
		},
		{
			img: 'example',
			name: 'Kimbel Baby',
			code: '93045',
		},
	];

	// render the template
	App.render(friendsTemplate({ players }));

	// If user not logged in, go to sign in
	firebase.auth().onAuthStateChanged((user) => {
		if (!user) {
			App.router.navigate('/signin');
		}
	});
};
