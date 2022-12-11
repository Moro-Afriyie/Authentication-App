import { HttpStatusCode } from './../@types';
import { APIError } from './../error';
import { Router, Request, Response, NextFunction } from 'express';
import passport = require('passport');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as Jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// express-session = server side session
// cookie-session = client side

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

const router: Router = Router();

function verifyCallback(accessToken: string, refreshToken: string, profile: any, done: any) {
	// console.log('profile: ', profile);

	//TODO: save the user details into the database
	return done(null, profile);
}

let userProfile: any = [];

// use the jwt token
passport.use(
	new JwtStrategy(jwtOptions, function (jwt_payload, done) {
		// get the user from the database and verify
		// User.findOne({ id: jwt_payload.sub }, function (err, user) {
		// 	if (err) {
		// 		return done(err, false);
		// 	}
		// 	if (user) {
		// 		return done(null, user);
		// 	} else {
		// 		return done(null, false);
		// 		// or you could create a new account
		// 	}
		// });
	})
);

// Generate an Access Token for the given User ID
function generateAccessToken(user) {
	const expiresIn = '1 hour';
	const secret = process.env.JWT_SECRET;

	const token = Jwt.sign({}, secret, {
		expiresIn: expiresIn,
		subject: user.id.toString(),
	});

	return token;
}

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
			passReqToCallback: true,
		},
		(req, accessToken, refreshToken, profile, cb) => {
			let defaultUser = userProfile.filter((item) => item.googleId === profile.id)[0];
			if (!defaultUser) {
				defaultUser = {
					fullName: `${profile.name.givenName} ${profile.name.familyName}`,
					email: profile.emails[0].value,
					picture: profile.photos[0].value,
					googleId: profile.id,
					id: profile.id,
				};
			}
			userProfile.push([defaultUser]);

			return cb(null, defaultUser);
		}
	)
);

passport.serializeUser((user: any, cb) => {
	console.log('Serializing user:', user);
	cb(null, user.id);
});

function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
	const isLoggedIn = req.isAuthenticated();
	if (!isLoggedIn) {
		throw new APIError('UNAUTHORIZED', HttpStatusCode.UNAUTHORISED, true, 'Not Authorised');
	}
	next();
}

passport.deserializeUser((id, cb) => {
	console.log('DeSerialized user', userProfile);
	const user = userProfile.filter((item) => item.id === id)[0];
	if (!user) {
		cb('user not found', null);
	}
	cb(null, user);
});

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/auth/login/failed',
		//successRedirect: process.env.CLIENT_HOME_PAGE_URL,
		//successRedirect: '/auth/login/success',
		session: false,
		passReqToCallback: true,
	}),
	(req: Request, res: Response) => {
		const token = generateAccessToken(req.user);
		res.redirect(`${process.env.CLIENT_HOME_PAGE_URL}/?token=${token}`);
	}
);

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect(process.env.CLIENT_HOME_PAGE_URL);
	});
});

router.get('/login/failed', (req: Request, res: Response) => {
	throw new APIError(
		'UNAUTHORIZED',
		HttpStatusCode.UNAUTHORISED,
		true,
		'failed to authenticate user'
	);
});

router.get(
	'/login/success',
	passport.authenticate(['jwt'], { session: false }),
	(req: Request, res: Response) => {
		console.log('login success');
		console.log('request: ', req.session);
		console.log('user: ', req.user);
		console.log('cookies: ', req.cookies);

		res.json({ message: 'login success', success: true, user: userProfile, session: req.session });
	}
);

export default { path: '/auth', router };

// Got this from chat gtp3 will try it out
/**
 To create an authentication application with React and NodeJS, you can follow these steps:

In the NodeJS application, install the required packages: passport, passport-google-oauth20, and jsonwebtoken using npm install <package-name>.

Configure PassportJS to use the Google OAuth2 strategy by providing the client ID and client secret obtained from the Google Developers Console.

Implement the passport.authenticate middleware in the NodeJS application to handle the Google OAuth2 authentication process.

In the React application, create a login page that redirects the user to the NodeJS application's Google OAuth2 login page.

After successful authentication, the NodeJS application will return a JWT token to the React application. Save this token in the React application's local storage for subsequent requests.

In the React application, implement a higher-order component (HOC) that checks for the presence of the JWT token in the local storage and includes it in the Authorization header of all requests to the NodeJS application.

In the NodeJS application, use the passport.authenticate middleware with the JWT strategy to authenticate requests from the React application.

Here is an example of the NodeJS application:


const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

const app = express();

passport.use(
  new GoogleStrategy(
    {
      clientID: 'your-google-client-id',
      clientSecret: 'your-google-client-secret',
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Generate JWT token
      const token = jwt.sign({
        sub: profile.id,
        name: profile.displayName,
      });

      // Return the token
      return done(null, token);
    }
  )
);

app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    // Send the JWT token to the React application
    res.redirect(`http://localhost:3000/login?token=${req.user}`);
  }
);

// Verify the JWT token in subsequent requests
app.use(
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Handle the request
  }
);

app.listen(4000);

React 

import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    useEffect(() => {
      // Check if the token is present in the URL
      const token = props.location.search.split('token=')[1];
     

 */
