import { APIError } from '../error';
import * as express from 'express';

export default function handleErrors(
	err: APIError,
	_req: express.Request,
	res: express.Response,
	_next: express.NextFunction
) {
	res.status(err.httpCode || 500);
	res.json({
		date: Date.now(),
		message: err.message,
		error: true,
	});
}
