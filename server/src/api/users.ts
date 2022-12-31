import { HttpStatusCode } from './../@types';
import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { APIError } from '../error';

const router: Router = Router();

export const UserRepository = AppDataSource.getRepository(User);

router.get('/', async (req, res) => {
	const users = await UserRepository.find();
	res.status(200).json({ success: true, data: users });
});

router.put('/', async (req, res) => {
	const user = await UserRepository.findBy({ id: req.user.id });

	if (!user) {
		throw new APIError('NOT FOUND', HttpStatusCode.NOT_FOUND, true, 'User not found');
	}
	Object.assign(user, req.params);
	const updatedUser = await UserRepository.save(user);
	res.json({ succes: true, user: updatedUser });
});

router.get('/delete', async (req, res) => {
	await UserRepository.clear();
});

export default { path: '/users', router };
