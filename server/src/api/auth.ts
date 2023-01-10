import { User } from './../entity/User';
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
import Joi from 'joi';
import { asyncMiddleware } from '../middlewares/async';

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
			let user: User = await UserRepository.findOneBy({ email: profile.emails[0].value });

			if (user && user.provider !== profile.provider)
				return cb(null, false, {
					message:
						'Google Account is not registered with this email. Please sign in using other methods',
				});

			if (!user) {
				user = await UserRepository.save({
					name: `${profile.name.givenName} ${profile.name.familyName}`,
					email: profile.emails[0].value,
					photo: profile.photos[0].value,
					provider: profile.provider,
					providerId: profile.id,
				});
			}

			return cb(null, user);
		}
	)
);

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback', (req: Request, res: Response, next: NextFunction) => {
	passport.authenticate(
		'google',
		{
			session: false,
			passReqToCallback: true,
		},
		(err, user, info) => {
			if (err || !user) {
				return res.redirect(process.env.CLIENT_HOME_PAGE_URL + '?error=' + info?.message);
			}
			const token = generateAccessToken(user, '2m');
			res.redirect(`${process.env.CLIENT_HOME_PAGE_URL}/?code=${token}`);
		}
	)(req, res, next);
});
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
			let user: User | null = null;

			if (profile.emails[0].value) {
				user = await UserRepository.findOneBy({ email: profile.emails[0].value });
			} else {
				user = await UserRepository.findOneBy({ providerId: profile.id });
			}

			if (user && user.provider !== profile.provider)
				return done(null, false, {
					message:
						'Github Account is not registered with this email. Please sign in using other methods',
				});

			if (!user) {
				user = await UserRepository.save({
					name: `${profile.displayName}`,
					email: profile.emails[0].value || '',
					photo: profile.photos[0].value,
					provider: profile.provider,
					providerId: profile.id,
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
			const token = generateAccessToken(user, '2m');
			res.redirect(`${process.env.CLIENT_HOME_PAGE_URL}/?code=${token}`);
		}
	)(req, res, next);
});
// end github

// begin facebook
passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
			callbackURL: '/auth/facebook/callback',
		},
		async function (accessToken, refreshToken, profile, done) {
			// facebook doesn't normally come with email so i will search by providerId
			let user = await UserRepository.findOneBy({ providerId: profile.id });

			if (!user) {
				user = await UserRepository.save({
					name: `${profile.displayName}`,
					photo: profile.profileUrl,
					provider: profile.provider,
					providerId: profile.id,
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
			const token = generateAccessToken(user, '2m');
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
	const user = req.user;
	delete user.provider;
	delete user.providerId;
	delete user.password;
	res.json({ message: 'login success', success: true, user: user, token });
});

router.post(
	'/register',
	asyncMiddleware(async (req, res) => {
		const { email, password, name } = req.body;
		const { error } = RegisterationSchema.validate(req.body);
		if (error) {
			throw new APIError(
				'BAD REQUEST',
				HttpStatusCode.BAD_REQUEST,
				true,
				error.message.replace(/\"/g, '')
			);
		}

		let user = await UserRepository.findOneBy({ email });

		if (user) {
			throw new APIError(
				'BAD REQUEST',
				HttpStatusCode.BAD_REQUEST,
				true,
				`user already exitsts ${
					user.provider ? `and registered using ${user.provider}` : ''
				}.please login to continue`
			);
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
				email,
				password: hashedPassword,
			});
			delete user.provider;
			delete user.password;
			delete user.providerId;

			const token = generateAccessToken(user);
			res.status(201).json({
				message: 'account created succesfully',
				success: true,
				user,
				token: token,
			});
		});
	})
);

router.post(
	'/login',
	asyncMiddleware(async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const { error } = loginSchema.validate(req.body);
		if (error) {
			throw new APIError(
				'BAD REQUEST',
				HttpStatusCode.BAD_REQUEST,
				true,
				error.message.replace(/\"/g, '')
			);
		}
		let user = await UserRepository.findOneBy({ email });

		if (!user) {
			throw new APIError(
				'NOT FOUND',
				HttpStatusCode.NOT_FOUND,
				true,
				'account not found. please sign up'
			);
		}

		if (user.provider && !user.password) {
			throw new APIError(
				'BAD REQUEST',
				HttpStatusCode.BAD_REQUEST,
				true,
				`user registered using ${user.provider} .please login to continue`
			);
		}

		const isValidPassword = bcrypt.compareSync(password, user.password);
		if (!isValidPassword) {
			throw new APIError(
				'BAD REQUEST',
				HttpStatusCode.BAD_REQUEST,
				true,
				`invalid email or password`
			);
		}

		delete user.provider;
		delete user.password;
		delete user.providerId;
		const token = generateAccessToken(user);

		res.status(200).json({
			message: 'loggin success',
			success: true,
			user,
			token: token,
		});
	})
);

export default { path: '/auth', router };
