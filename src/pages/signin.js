/**
 * The Sign In Page
 */

/* eslint-disable no-tabs */
/* eslint-disable indent */
/* eslint-disable no-undef */

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';

import App from '../lib/App';

const signInTemplate = require('../templates/signin.hbs');

export default () => {
    // render the template
    App.render(signInTemplate());

    // Constanten
    const auth = firebase.auth();

    const btnGoogle = document.getElementById('btnGoogle');
		const btnLogin = document.getElementById('btnLogin');
		const txtError = document.getElementById('txtError');

		// if already logged in, go to map
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				App.router.navigate('/map');
			}
		});

    // Login event
    btnLogin.addEventListener('click', () => {
			// Get email and password
			const email = txtEmail.value;
			const password = txtPassword.value;
			//  Sign in
			auth.signInWithEmailAndPassword(email, password)
				.then(() => {
					App.router.navigate('/map');
				})
				.catch((e) => {
					if (e.code === 'auth/wrong-password') {
						txtError.innerHTML = 'Dit wachtwoord is onjuist, probeer nog eens.';
					} else if (password === '' || email === '') {
						txtError.innerHTML = 'Gelieve alle velden in te vullen.';
					} else {
						txtError.innerHTML = 'De velden zijn onjuist ingevuld, probeer nog eens.';
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
