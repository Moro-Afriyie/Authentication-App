import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

const router: Router = Router();

export const UserRepository = AppDataSource.getRepository(User);

router.get('/', async (req, res) => {
	const users = await UserRepository.find();
	res.status(200).json({ success: true, data: users });
});

router.get('/delete', async (req, res) => {
	await UserRepository.clear();
});

export default { path: '/users', router };
