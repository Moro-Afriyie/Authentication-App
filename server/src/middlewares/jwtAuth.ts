import passport = require('passport');
import { APIError } from '../error';
import { NextFunction } from 'express';
import { HttpStatusCode } from '../@types';

export function checkIsLoggedIn(req: Express.Request, res: Express.Response, next: NextFunction) {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		try {
			if (err || !user) {
				throw new APIError('UNAUTHORIZED', HttpStatusCode.UNAUTHORISED, true, 'Not Authorised');
			}
			req.user = user;
			return next();
		} catch (error) {
			next(error);
		}
	})(req, res, next);
}
