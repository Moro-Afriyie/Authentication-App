import { HttpStatusCode } from './../@types';
import { APIError } from './../error';
import { Router, Request, Response, NextFunction } from 'express';
import passport = require('passport');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as Jwt from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { UserRepository } from './users';
import { checkIsLoggedIn } from '../middlewares/jwtAuth';
import * as bcrypt from 'bcrypt';

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
		async (req, accessToken, refreshToken, profile, cb) => {
			let user = await UserRepository.findOneBy({ email: profile.emails[0].value });

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

// github
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: '/auth/github/callback',
		},
		function (accessToken, refreshToken, profile, done) {
			// console.log('user: ', profile);
			//   if (!profile._json.email) {
			// 		return done(null, false, {
			// 			message:
			// 				'Google Account is not registered with email. Please sign in using other methods',
			// 		});
			// 	}
			//	return done(null, profile);
			return done(null, false, {
				message: 'Github Account is not registered with email. Please sign in using other methods',
			});
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
			const token = generateAccessToken(req.user, '5m'); // used to allow the user to login again and get a new token since it's exposed in the url
			res.redirect(`${process.env.CLIENT_HOME_PAGE_URL}/?code=${token}`);
		}
	)(req, res, next);
});

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
	console.log('req body: ', req.body);
	const { email, password } = req.body;
	let user = await UserRepository.findOneBy({ email });

	if (!user) {
		res.status(HttpStatusCode.NOT_FOUND);
		return res.json({
			date: Date.now(),
			message: 'account not found. please sign up',
			error: true,
		});
	}

	if (user.provider) {
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
