"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageMiddleware = void 0;
var multer_1 = __importDefault(require("multer"));
var cloudinary_1 = require("cloudinary");
var multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
cloudinary_1.v2.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});
var storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resource_type: 'auto',
        folder: 'authentication-app',
    },
});
exports.storageMiddleware = (0, multer_1.default)({ storage: storage });
//# sourceMappingURL=storageMiddleware.js.map