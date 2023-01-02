import { HttpStatusCode } from './../@types';
import { APIError } from './../error';
import { Router, Request, Response, NextFunction } from 'express';
import passport = require('passport');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as Jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserRepository } from './users';
import { checkIsLoggedIn } from '../middlewares/jwtAuth';
import * as bcrypt from 'bcrypt';
import _ from 'lodash';

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

const router: Router = Router();

// use the jwt token
passport.use(
	new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
		console.log('jwt payload: ', jwt_payload);
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

passport.use(
	'local-signup',
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			try {
				// check if user exists
				const userExists = await UserRepository.findOneBy({ email: email });
				if (userExists) {
					return done(null, false);
				} // Create a new user with the user data provided
				bcrypt.hash(password, 10, async (err, hashedPassword) => {
					if (err) {
						done(err, false);
					}

					const user = await UserRepository.save({
						name: req.body.name,
						bio: '',
						email,
						photo: '',
						password: hashedPassword,
						provider: '',
						phoneNumber: '',
					});
					delete user.provider;
					delete user.password;

					return done(null, user);
				});
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	'local-login',
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (email, password, done) => {
			try {
				const user = await UserRepository.findOneBy({ email: email });
				if (!user) return done(null, false);
				const isValidPassword = bcrypt.compareSync(password, user.password);
				if (!isValidPassword) return done(null, false);
				return done(null, user); // if passwords match return user
			} catch (error) {
				console.log(error);
				return done(error, false);
			}
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

router.post('/login/failed', (req: Request, res: Response) => {
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

router.post(
	'/register',
	passport.authenticate('local-signup', { session: false }),
	async (req: Request, res: Response) => {
		const token = generateAccessToken(req.user);
		res.status(201).json({
			message: 'account created succesfully',
			success: true,
			user: req.user,
			token: token,
		});
		/*
	const { email, password, name } = req.body;

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
	});*/
	}
);

// router.post('/login', async (req: Request, res: Response) => {
// 	const { email, password } = req.body;
// 	let user = await UserRepository.findOneBy({ email });

// 	if (!user) {
// 		res.status(HttpStatusCode.NOT_FOUND);
// 		return res.json({
// 			date: Date.now(),
// 			message: 'account not found. please sign up',
// 			error: true,
// 		});
// 	}

// 	if (user.provider) {
// 		res.status(HttpStatusCode.BAD_REQUEST);
// 		return res.json({
// 			date: Date.now(),
// 			message: `user registered using ${user.provider} .please login to continue`,
// 			error: true,
// 		});
// 	}

// 	const isValidPassword = bcrypt.compareSync(password, user.password);
// 	if (!isValidPassword) {
// 		res.status(HttpStatusCode.BAD_REQUEST);
// 		return res.json({
// 			date: Date.now(),
// 			message: `invalid email or password`,
// 			error: true,
// 		});
// 	}

// 	delete user.provider;
// 	delete user.password;
// 	const token = generateAccessToken(user);

// 	res.status(201).json({
// 		message: 'loggin success',
// 		success: true,
// 		user,
// 		token: token,
// 	});
// });

router.post('/login', function (req, res, next) {
	passport.authenticate('local-login', { session: false }, (err, user, info) => {
		if (err || !user) {
			return res.status(400).json({
				message: 'Something is not right',
				user: user,
			});
		}
		req.login(user, { session: false }, (err) => {
			if (err) {
				res.send(err);
			}

			// generate a signed son web token with the contents of user object and return it in the response
			// const token = jwt.sign(user, 'your_jwt_secret');
			// return res.json({ user, token });
			res.send('user is logged in');
		});
	})(req, res);
});

export default { path: '/auth', router };
