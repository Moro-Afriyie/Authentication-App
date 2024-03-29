import { storageMiddleware } from './../middlewares/storageMiddleware';
import { HttpStatusCode } from './../@types';
import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { APIError } from '../error';
import { checkIsLoggedIn } from '../middlewares/jwtAuth';
import Joi from 'joi';
import * as bcrypt from 'bcrypt';
import { asyncMiddleware } from '../middlewares/async';

const router: Router = Router();

const userSchema = Joi.object({
	name: Joi.string().min(3).max(30).allow(''),
	bio: Joi.string().max(500).allow(''),
	email: Joi.string()
		.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
		.allow(''),
	photo: Joi.string()
		.uri({ scheme: ['http', 'https'] })
		.allow(''),
	phoneNumber: Joi.string()
		.regex(/^\+\d{2}\d{9,}$/)
		.min(7)
		.max(15)
		.allow('')
		.messages({
			'string.pattern.base':
				'phone number should start with a plus sign, followed by the country code and national number',
		}),
	password: Joi.string().min(5).max(20).allow(''),
});

export const UserRepository = AppDataSource.getRepository(User);

router.get(
	'/',
	asyncMiddleware(async (req, res) => {
		const users = await UserRepository.find();
		res.status(200).json({ success: true, data: users });
	})
);

router.put(
	'/',
	checkIsLoggedIn,
	storageMiddleware.single('photo'),
	asyncMiddleware(async (req, res) => {
		const { error } = userSchema.validate(req.body);

		if (error) {
			throw new APIError(
				'BAD REQUEST',
				HttpStatusCode.BAD_REQUEST,
				true,
				error.message.replace(/\"/g, '')
			);
		}

		const user = await UserRepository.findOneBy({ id: req.user.id });

		if (req.body.email && req.body.email.toLowerCase() !== user.email.toLowerCase()) {
			const user = await UserRepository.findOneBy({ email: req.body.email });
			if (user) {
				throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'email already exits');
			}
		}

		if (!user) {
			throw new APIError('NOT FOUND', HttpStatusCode.NOT_FOUND, true, 'User not found');
		}

		const file = req.file;
		if (file) {
			req.body['photo'] = file.path;
		}

		if (req.body.password) {
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			req.body['password'] = hashedPassword;
			Object.assign(user, req.body);
		} else {
			delete req.body.password;
			Object.assign(user, req.body);
		}

		const updatedUser = await UserRepository.save(user);

		delete updatedUser.provider;
		delete updatedUser.password;
		delete updatedUser.providerId;
		res.json({ message: 'details updated successfully', succes: true, user: updatedUser });
	})
);

// just to verify the users will delete it later
// router.get('/hello', checkIsLoggedIn, (req, res) => {
// 	res.send(req.user);
// });

// router.get('/delete', async (req, res) => {
// 	await UserRepository.clear();
// });

export default { path: '/users', router };
