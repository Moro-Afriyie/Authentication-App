import { storageMiddleware } from './../middlewares/storageMiddleware';
import { HttpStatusCode } from './../@types';
import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { APIError } from '../error';
import { checkIsLoggedIn } from '../middlewares/jwtAuth';
import Joi from 'joi';

const router: Router = Router();

const userSchema = Joi.object({
	name: Joi.string().min(3).max(30),
	bio: Joi.string().max(500),
	email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
	photo: Joi.string()
		.uri({ scheme: ['http', 'https'] })
		.allow(''),
	password: Joi.string().min(5).max(20),
});

export const UserRepository = AppDataSource.getRepository(User);

router.get('/', async (req, res) => {
	const users = await UserRepository.find();
	res.status(200).json({ success: true, data: users });
});

router.put('/', checkIsLoggedIn, storageMiddleware.single('photo'), async (req, res) => {
	console.log('req.body: ', req.body);
	// const { error } = userSchema.validate(req.body);
	// if (error) {
	// 	res.status(HttpStatusCode.BAD_REQUEST);
	// 	return res.json({
	// 		date: Date.now(),
	// 		message: error.message.replace(/\"/g, ''),
	// 		error: true,
	// 	});
	// }

	// const user = await UserRepository.findOneBy({ id: req.user.id });

	// if (!user) {
	// 	throw new APIError('NOT FOUND', HttpStatusCode.NOT_FOUND, true, 'User not found');
	// }

	// const file = req.file;
	// if (file) {
	// 	user['photo'] = file.path;
	// }

	// Object.assign(user, req.body);
	// const updatedUser = await UserRepository.save(user);
	// res.json({ message: 'details updated successfully', succes: true, user: updatedUser });
});

// just to verify the users will delete it later
router.get('/hello', checkIsLoggedIn, (req, res) => {
	res.send(req.user);
});

// router.get('/delete', async (req, res) => {
// 	await UserRepository.clear();
// });

export default { path: '/users', router };
