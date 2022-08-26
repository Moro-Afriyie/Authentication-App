import { APIError } from './error';
import handleErrors from './middlewares/error';
import * as express from 'express';
import helmet from 'helmet';
import cors = require('cors');
import { createAPI } from './api';
import { HttpStatusCode } from './@types';
import passport = require('passport');
import cookieSession = require('cookie-session');

// create express app
const app = express();

// setup security headers
app.use(helmet());
app.use(
	cookieSession({
		name: 'session',
		maxAge: 24 * 60 * 60 * 1000,
		keys: [process.env.CLIENT_KEY_1, process.env.CLIENT_KEY_2],
	})
);

// save the session to the cookie
passport.serializeUser((user, done) => {
	done(null, user);
});

// read the session from the cookie
passport.deserializeUser((obj, done) => {
	// 	User.findBy(id).then(user=>{
	// done(null, user);
	// 	})
	done(null, obj);
});

// setup passport with sets up the passport session
app.use(passport.initialize());
app.use(passport.session());

// setup cross-origin resource header sharing
app.use(
	cors({
		origin: '*',
		credentials: true,
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
