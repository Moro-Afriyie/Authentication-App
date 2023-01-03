import { APIError } from './error';
import handleErrors from './middlewares/error';
import * as express from 'express';
import helmet from 'helmet';
import cors = require('cors');
import { createAPI } from './api';
import { HttpStatusCode } from './@types';
import passport = require('passport');

// create express app
const app = express();

// setup security headers
app.use(helmet());

// setup cross-origin resource header sharing
app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	})
);

// parse JSON and url-encoded bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// setup passport with sets up the passport session
app.use(passport.initialize());

// initialize api routes
createAPI(app);

app.get('/', (req: express.Request, res: express.Response) => {
	res.json({ user: req.user });
});

// handle all routes which aren't part of the application
app.use('*', (req: express.Request, _res) => {
	throw new APIError(
		'NOT FOUND',
		HttpStatusCode.NOT_FOUND,
		true,
		`Requested URL ${req.originalUrl} not found`
	);
});

// error middleware
app.use(handleErrors);

export default app;
