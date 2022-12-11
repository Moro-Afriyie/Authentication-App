import { HttpStatusCode } from './../@types';
import { APIError } from './../error';
import { Router, Request, Response, NextFunction } from 'express';
import passport = require('passport');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as Jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

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

		const user = userProfile.filter((item) => item.id.toString() === jwt_payload.id.toString())[0];
		if (!user) return done(null, false);
		return done(null, user);
	})
);

// Generate an Access Token for the given User ID
function generateAccessToken(user, expiresIn?: string) {
	const secret = process.env.JWT_SECRET;
	const expiration = expiresIn
		? {
				expiresIn,
		  }
		: {};

	const token = Jwt.sign({ id: user.id.toString() }, secret, expiration);

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
			userProfile.push(defaultUser);

			return cb(null, defaultUser);
		}
	)
);

function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
	const isLoggedIn = req.isAuthenticated() && req.user;
	if (!isLoggedIn) {
		throw new APIError('UNAUTHORIZED', HttpStatusCode.UNAUTHORISED, true, 'Not Authorised');
	}
	next();
}

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/auth/login/failed',
		session: false,
		passReqToCallback: true,
	}),
	(req: Request, res: Response) => {
		const token = generateAccessToken(req.user, '1h'); // used to allow the user to login again and get a new token since it's exposed in the url
		res.redirect(`${process.env.CLIENT_HOME_PAGE_URL}/?code=${token}`);
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
	passport.authenticate('jwt', { session: false }),
	(req: Request, res: Response) => {
		const token = generateAccessToken(req.user);
		res.json({ message: 'login success', success: true, user: req.user, token });
	}
);

export default { path: '/auth', router };
