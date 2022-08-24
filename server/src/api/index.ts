import { IEndpoint } from '../@types';
import { Express } from 'express';
import users from './users';
import auth from './auth';

const endpoints: IEndpoint[] = [users, auth];

export function createAPI(app: Express) {
	endpoints.forEach(({ path, router }) => {
		app.use(path, router);
	});
}
