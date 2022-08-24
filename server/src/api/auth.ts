import { Router } from 'express';
import passport = require('passport');

const router: Router = Router();

const config = {
	CLIENT_ID: process.env.CLIENT_ID,
	CLIENT_SECRET: process.env.CLIENT_SECRET,
};

router.get('/google', (req, res) => {
	res.send('google endpoint');
});

router.get('/google/callback', passport.authenticate('google'));

router.get('/logout', (req, res) => {
	res.send('logout');
});

export default { path: '/auth', router };
