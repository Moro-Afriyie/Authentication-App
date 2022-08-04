import { IEndpoint } from '../@types';
import { Express } from 'express';
import photos from './photos';

const endpoints: IEndpoint[] = [photos];

export function createAPI(app: Express) {
	endpoints.forEach(({ path, router }) => {
		app.use(path, router);
	});
}
