"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
var User_1 = require("./entity/User");
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    entities: [User_1.User],
    migrations: ['src/migration/**/*.ts'],
    migrationsTableName: 'migrations',
    subscribers: [],
});
/**
 * create migration
 1. npx typeorm-ts-node-esm migration:generate ./src/migrations/update-user-table  -d ./src/data-source.ts
 run migration
 2. npx typeorm-ts-node-commonjs migration:run  -d ./src/data-source.ts
 */
//# sourceMappingURL=data-source.js.map