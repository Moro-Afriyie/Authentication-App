import { User } from './entity/User';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config as configDotenv } from 'dotenv';

configDotenv();
export const AppDataSource = new DataSource({
	type: 'mysql',
	host: process.env.DB_HOST || 'localhost',
	port: +(process.env.DB_PORT || '3306'),
	database: process.env.DB_NAME,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	synchronize: process.env.NODE_ENV !== 'production',
	logging: process.env.NODE_ENV === 'development',
	entities: [User],
	migrations: [],
	subscribers: [],
});
