import * as express from 'express';

/**
 * @param fn: a function that handles the request without try catch block
 * @returns a function that handles the request with try catch block and also handles the error
 */
export function asyncMiddleware(fn: Function) {
	return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			await fn(req, res, next);
		} catch (error) {
			next(error);
		}
	};
}
