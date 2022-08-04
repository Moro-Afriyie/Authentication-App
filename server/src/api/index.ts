import { IEndpoint } from '../@types';
import { Express } from 'express';
import users from './users';

const endpoints: IEndpoint[] = [users];

export function createAPI(app: Express) {
	endpoints.forEach(({ path, router }) => {
		app.use(path, router);
	});
}
