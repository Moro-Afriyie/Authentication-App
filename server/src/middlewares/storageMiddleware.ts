import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		resource_type: 'auto',
		folder: 'authentication-app',
	},
});

export const storageMiddleware = multer({ storage: storage });
