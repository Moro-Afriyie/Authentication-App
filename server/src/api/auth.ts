import { Router } from 'express';

const router: Router = Router();

router.get('/google', (req, res) => {
	res.send('google endpoint');
});

router.get('/google/callback', (req, res) => {
	res.send('google callback endpoint');
});

router.get('/logout', (req, res) => {
	res.send('logout');
});

export default { path: '/auth', router };
