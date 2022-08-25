import { HttpStatusCode } from './../@types';
import { APIError } from './../error';
import { Router } from 'express';
import passport = require('passport');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const router: Router = Router();

function verifyCallback(accessToken, refreshToken, profile, done) {
	console.log('profile: ', profile);

	//TODO: save the user details into the database
	done(null, profile);
}

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		verifyCallback
	)
);

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/auth/login/failed',
		successRedirect: process.env.CLIENT_HOME_PAGE_URL,
		session: false,
	}),
	(req, res) => {
		console.log('google called us back');
	}
);

router.get('/logout', (req, res) => {
	res.send('logout');
});

router.get('/login/failed', (req, res) => {
	throw new APIError(
		'UNAUTHORIZED',
		HttpStatusCode.UNAUTHORISED,
		true,
		'failed to authenticate user'
	);
});

router.get('/login/success', (req, res) => {
	console.log('login success');
});

export default { path: '/auth', router };
