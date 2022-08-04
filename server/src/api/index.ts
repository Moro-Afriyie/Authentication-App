import { IEndpoint } from '../@types';
import { Express } from 'express';

const endpoints: IEndpoint[] = [];

export function createAPI(app: Express) {
	endpoints.forEach(({ path, router }) => {
		app.use(path, router);
	});
}
