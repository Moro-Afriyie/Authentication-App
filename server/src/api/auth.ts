import { HttpStatusCode } from './../@types';
import { APIError } from './../error';
import { Router, Request, Response, NextFunction } from 'express';
import passport = require('passport');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as Jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// express-session = server side session
// cookie-session = client side

const router: Router = Router();

function verifyCallback(accessToken: string, refreshToken: string, profile: any, done: any) {
	// console.log('profile: ', profile);

	//TODO: save the user details into the database
	return done(null, profile);
}

let userProfile: any = [];
// save the session to the cookie
/*passport.serializeUser((user: any, done) => {
	//console.log('serialzed user: ', user);
	userProfile = {
		id: user.id,
		userName: user.displayName,
		email: user.emails[0].value,
	};
	done(null, user.id);
});

// read the session from the cookie
passport.deserializeUser((obj, done) => {
	// 	User.findBy(id).then(user=>{
	// done(null, user);
	// 	})
	console.log('deserilize user function called....');
	console.log('user deserialize: ', obj);
	done(null, userProfile);
});



passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		verifyCallback
	)
);*/

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
		session: true,
		passReqToCallback: true,
	}),
	(req: Request, res: Response) => {
		// Successful authentication, redirect home.
		console.log('user: ', req.user);
		console.log('session: ', req.session);
		console.log('cookies: ', req.cookies);
		console.log('google called us back');
		//req.logIn(req.user);
		//res.redirect(process.env.CLIENT_HOME_PAGE_URL);
		req.login(req.user, function (err) {
			if (err) {
				throw new APIError(
					'UNAUTHORIZED',
					HttpStatusCode.UNAUTHORISED,
					true,
					'failed to authenticate user'
				);
			}
			res.redirect(process.env.CLIENT_HOME_PAGE_URL);
		});

		//res.send('Thank you for signing in!');
		//res.json({ message: 'login success', success: true, user: req.user, session: req.session });
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

router.get('/login/success', checkLoggedIn, (req: Request, res: Response) => {
	console.log('login success');
	console.log('request: ', req.session);
	console.log('user: ', req.user);
	console.log('cookies: ', req.cookies);

	res.json({ message: 'login success', success: true, user: userProfile, session: req.session });
});

export default { path: '/auth', router };
