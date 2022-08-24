import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { APIError } from './error';
import handleErrors from './middlewares/error';
import * as express from 'express';
import helmet from 'helmet';
import cors = require('cors');
import { createAPI } from './api';
import { HttpStatusCode } from './@types';
import passport = require('passport');

// create express app
const app = express();

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

// setup security headers
app.use(helmet());

// setup passport
app.use(passport.initialize());

// setup cross-origin resource header sharing
app.use(
	cors({
		origin: '*',
	})
);

// parse JSON and url-encoded bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// initialize api routes
createAPI(app);

// handle all routes which aren't part of the application
app.use('*', (req: express.Request, _res) => {
	throw new APIError(
		'NOT FOUND',
		HttpStatusCode.NOT_FOUND,
		true,
		`Requested URL ${req.originalUrl} not found`
	);
});

// error middleware
app.use(handleErrors);

export default app;
