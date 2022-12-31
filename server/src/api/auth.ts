import { HttpStatusCode } from './../@types';
import { APIError } from './../error';
import { Router, Request, Response, NextFunction } from 'express';
import passport = require('passport');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as Jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from './users';
import { checkIsLoggedIn } from '../middlewares/jwtAuth';

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

const router: Router = Router();

// use the jwt token
passport.use(
	new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
		// get the user from the database and verify
		const user = await UserRepository.findOneBy({ id: jwt_payload.sub });

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

	const token = Jwt.sign({ id: user.id }, secret, expiration);

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
		async (req, accessToken, refreshToken, profile, cb) => {
			let user = await UserRepository.findOneBy({ email: profile.emails[0].value });

			if (!user) {
				user = await UserRepository.save({
					name: `${profile.name.givenName} ${profile.name.familyName}`,
					bio: '',
					email: profile.emails[0].value,
					photo: profile.photos[0].value,
					password: '',
					provider: 'google',
					phoneNumber: '',
				});
			}

			return cb(null, user);
		}
	)
);

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/auth/login/failed',
		session: false,
		passReqToCallback: true,
	}),
	(req: Request, res: Response) => {
		const token = generateAccessToken(req.user, '5m'); // used to allow the user to login again and get a new token since it's exposed in the url
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

router.get('/login/success', checkIsLoggedIn, (req: Request, res: Response) => {
	const token = generateAccessToken(req.user);
	res.json({ message: 'login success', success: true, user: req.user, token });
});

export default { path: '/auth', router };
