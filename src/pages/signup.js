/**
 * The Sign Up Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable no-undef */

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import * as consts from '../consts';

import App from '../lib/App';

const signupTemplate = require('../templates/signup.hbs');

export default () => {
    // render the template
    App.render(signupTemplate());

    // Initialize Firebase
    if (!firebase.apps.length) {
			firebase.initializeApp(consts.firebaseConfig);
		}

		// Constanten
		const auth = firebase.auth();

		const btnGoogle = document.getElementById('btnGoogle');
		const btnSignUp = document.getElementById('btnSignUp');
		const txtError = document.getElementById('txtError');

		// if already logged in, go to map
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				App.router.navigate('/map');
			}
		});

    // Sign up event
    btnSignUp.addEventListener('click', (e) => {
        // Get email and password
        // TODO: Check for real email
        const email = txtEmail.value;
        const password = txtPassword.value;

        // Sign up
        firebase.auth().createUserWithEmailAndPassword(email, password)
					.then(() => {
						App.router.navigate('/intro');
					})
					.catch(() => {
						if (e.code === 'auth/email-already-in-use') {
							txtError.innerHTML = 'Dit email adres is al in gebruik.';
						} else if (e.code === 'auth/weak-password') {
							txtError.innerHTML = 'Het wachtwoord moet minstens 6 karakters lang zijn.';
						} else if (e.code === 'auth/invalid-email') {
							txtError.innerHTML = 'Ongeldig email adres.';
						} else if (e.code === 'auth/too-many-requests') {
							txtError.innerHTML = 'Er is een fout opgetreden, probeer later opnieuw.';
						} else {
							txtError.innerHTML = 'Er is een fout opgetreden, probeer nog eens.';
						}
					});
		});

		// Google login event
    btnGoogle.addEventListener('click', () => {
			const provider = new firebase.auth.GoogleAuthProvider();
			auth.signInWithPopup(provider)
					.then(() => {
							App.router.navigate('/intro');
					}).catch((error) => {
							console.log(error.message);
					});
		});
};
