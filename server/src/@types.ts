import { User as UserEntity } from './entity/User';
import { Router } from 'express';

export interface IEndpoint {
	path: string;
	router: Router;
}
export enum HttpStatusCode {
	OK = 200,
	BAD_REQUEST = 400,
	NOT_FOUND = 404,
	INTERNAL_SERVER = 500,
	UNAUTHORISED = 401,
}

declare global {
	namespace Express {
		interface User extends UserEntity {}
	}
}
