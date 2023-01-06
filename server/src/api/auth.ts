import { HttpStatusCode } from './../@types';
import { APIError } from './../error';
import { Router, Request, Response, NextFunction } from 'express';
import passport = require('passport');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as Jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { UserRepository } from './users';
import { checkIsLoggedIn } from '../middlewares/jwtAuth';
import * as bcrypt from 'bcrypt';
import Joi = require('joi');

const RegisterationSchema = Joi.object({
	name: Joi.string().min(3).max(30).required(),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
		.required(),
	password: Joi.string().min(5).max(20).required(),
});

const loginSchema = Joi.object({
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
		.required(),
	password: Joi.string().min(5).max(20).required(),
});

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

const router: Router = Router();

// use the jwt token
passport.use(
	new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
		// get the user from the database and verify
		const user = await UserRepository.findOneBy({ id: jwt_payload.id });

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

// google
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
			passReqToCallback: true,
		},
		async (req, accessToken, refreshToken, profile, cb: any) => {
			let user = await UserRepository.findOneBy({ email: profile.emails[0].value });

			if (user && user.provider !== profile.provider)
				return cb(null, false, {
					message:
						'Google Account is not registered with this email. Please sign in using other methods',
				});

			if (!user) {
				user = await UserRepository.save({
					name: `${profile.name.givenName} ${profile.name.familyName}`,
					bio: '',
					email: profile.emails[0].value,
					photo: profile.photos[0].value,
					password: '',
					provider: profile.provider,
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
		const token = generateAccessToken(req.user, '2m'); // used to allow the user to login again and get a new token since it's exposed in the url
		res.redirect(`${process.env.CLIENT_HOME_PAGE_URL}/?code=${token}`);
	}
);
// end google

//begin github
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: '/auth/github/callback',
		},
		async function (accessToken, refreshToken, profile, done) {
			let user = await UserRepository.findOneBy({ email: profile.emails[0].value });

			if (user && user.provider !== profile.provider)
				return done(null, false, {
					message:
						'Github Account is not registered with this email. Please sign in using other methods',
				});

			if (!user) {
				user = await UserRepository.save({
					name: `${profile.name.displayName}`,
					bio: profile.bio || '',
					email: profile.emails[0].value || '',
					photo: profile.photos[0].value,
					password: '',
					provider: profile.provider,
					phoneNumber: '',
				});
			}

			return done(null, user);
		}
	)
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));

router.get('/github/callback', (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		'github',
		{
			scope: ['user:email'],
			session: false,
			passReqToCallback: true,
		},
		(err, user, info) => {
			if (err || !user) {
				return res.redirect(process.env.CLIENT_HOME_PAGE_URL + '?error=' + info?.message);
			}
			const token = generateAccessToken(req.user, '2m');
			res.redirect(`${process.env.CLIENT_HOME_PAGE_URL}/?code=${token}`);
		}
	)(req, res, next);
});
// end github

// begin twitter
passport.use(
	new TwitterStrategy(
		{
			consumerKey: process.env.TWITTER_API_KEY,
			consumerSecret: process.env.TWITTER_API_KEY_SECRET,
			callbackURL: '/auth/twitter/callback',
		},
		async function (accessToken, refreshToken, profile, done) {
			// let user = await UserRepository.findOneBy({ email: profile.emails[0].value });

			// if (user && user.provider !== profile.provider)
			// 	return done(null, false, {
			// 		message:
			// 			'Twitter Account is not registered with this email. Please sign in using other methods',
			// 	});

			// if (!user) {
			// 	user = await UserRepository.save({
			// 		name: `${profile.name.displayName}`,
			// 		bio: profile.bio || '',
			// 		email: profile.emails[0].value || '',
			// 		photo: profile.photos[0].value,
			// 		password: '',
			// 		provider: profile.provider,
			// 		phoneNumber: '',
			// 	});
			// }

			// return done(null, user);
			console.log('profile: ', profile);
			return done(null, profile);
		}
	)
);

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		'twitter',
		{
			session: false,
			passReqToCallback: true,
		},
		(err, user, info) => {
			console.log('user: ', user);
			console.log('error: ', err);
			console.log('info: ', info);
			if (err || !user) {
				return res.redirect(process.env.CLIENT_HOME_PAGE_URL + '?error=' + info?.message);
			}
			const token = generateAccessToken(req.user, '2m');
			res.redirect(`${process.env.CLIENT_HOME_PAGE_URL}/?code=${token}`);
		}
	)(req, res, next);
});
// end twitter

// begin facebook
passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL: '/auth/facebook/callback',
		},
		async function (accessToken, refreshToken, profile, done) {
			let user = await UserRepository.findOneBy({ email: profile.emails[0].value });

			if (user && user.provider !== profile.provider)
				return done(null, false, {
					message:
						'Facebook Account is not registered with this email. Please sign in using other methods',
				});

			if (!user) {
				user = await UserRepository.save({
					name: `${profile.name.displayName}`,
					bio: profile.bio || '',
					email: profile.emails[0].value || '',
					photo: profile.photos[0].value,
					password: '',
					provider: profile.provider,
					phoneNumber: '',
				});
			}

			return done(null, user);
		}
	)
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));

router.get('/facebook/callback', (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		'facebook',
		{
			scope: ['email'],
			session: false,
			passReqToCallback: true,
		},
		(err, user, info) => {
			if (err || !user) {
				return res.redirect(process.env.CLIENT_HOME_PAGE_URL + '?error=' + info?.message);
			}
			const token = generateAccessToken(req.user, '2m');
			res.redirect(`${process.env.CLIENT_HOME_PAGE_URL}/?code=${token}`);
		}
	)(req, res, next);
});
// end facebook

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

router.post('/register', async (req, res) => {
	const { email, password, name } = req.body;
	const { error } = RegisterationSchema.validate(req.body);
	if (error) {
		res.status(HttpStatusCode.BAD_REQUEST);
		return res.json({
			date: Date.now(),
			message: error.message.replace(/\"/g, ''),
			error: true,
		});
	}

	let user = await UserRepository.findOneBy({ email });

	if (user) {
		res.status(HttpStatusCode.BAD_REQUEST);
		return res.json({
			date: Date.now(),
			message: `user already exitsts ${
				user.provider ? `and registered using ${user.provider}` : ''
			}.please login to continue`,
			error: true,
		});
	}

	bcrypt.hash(password, 10, async (err, hashedPassword) => {
		if (err) {
			res.status(HttpStatusCode.INTERNAL_SERVER);
			return res.json({
				date: Date.now(),
				message: err.message,
				error: true,
			});
		}

		user = await UserRepository.save({
			name,
			bio: '',
			email,
			photo: '',
			password: hashedPassword,
			provider: '',
			phoneNumber: '',
		});
		delete user.provider;
		delete user.password;

		const token = generateAccessToken(user);
		res.status(201).json({
			message: 'account created succesfully',
			success: true,
			user,
			token: token,
		});
	});
});

router.post('/login', async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const { error } = loginSchema.validate(req.body);
	if (error) {
		res.status(HttpStatusCode.BAD_REQUEST);
		return res.json({
			date: Date.now(),
			message: error.message.replace(/\"/g, ''),
			error: true,
		});
	}
	let user = await UserRepository.findOneBy({ email });

	if (!user) {
		res.status(HttpStatusCode.NOT_FOUND);
		return res.json({
			date: Date.now(),
			message: 'account not found. please sign up',
			error: true,
		});
	}

	if (user.provider && !user.password) {
		res.status(HttpStatusCode.BAD_REQUEST);
		return res.json({
			date: Date.now(),
			message: `user registered using ${user.provider} .please login to continue`,
			error: true,
		});
	}

	const isValidPassword = bcrypt.compareSync(password, user.password);
	if (!isValidPassword) {
		res.status(HttpStatusCode.BAD_REQUEST);
		return res.json({
			date: Date.now(),
			message: `invalid email or password`,
			error: true,
		});
	}

	delete user.provider;
	delete user.password;
	const token = generateAccessToken(user);

	res.status(200).json({
		message: 'loggin success',
		success: true,
		user,
		token: token,
	});
});

export default { path: '/auth', router };
