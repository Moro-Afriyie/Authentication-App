import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

const router: Router = Router();

const UserRepository = AppDataSource.getRepository(User);

router.get('/', async (req, res) => {
	const users = await UserRepository.find();
	res.status(200).json({ success: true, data: users });
});

export default { path: '/users', router };
