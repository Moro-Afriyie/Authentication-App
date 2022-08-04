import { AppDataSource } from './data-source';
import { User } from './entity/User';
import * as http from 'http';
import app from './app';

AppDataSource.initialize()
	.then(async () => {
		const server = http.createServer(app);

		const port = process.env.PORT || 3000;

		server.listen(port);

		server.on('listening', () => {
			console.log(`My unsplash API running in ${process.env.NODE_ENV} on port ${port} 🚀🚀🚀🚀`);
		});
	})
	.catch((error) => console.log(error));
