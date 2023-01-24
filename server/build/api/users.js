"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
var storageMiddleware_1 = require("./../middlewares/storageMiddleware");
var _types_1 = require("./../@types");
var express_1 = require("express");
var data_source_1 = require("../data-source");
var User_1 = require("../entity/User");
var error_1 = require("../error");
var jwtAuth_1 = require("../middlewares/jwtAuth");
var joi_1 = __importDefault(require("joi"));
var bcrypt = __importStar(require("bcrypt"));
var async_1 = require("../middlewares/async");
var router = (0, express_1.Router)();
var userSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(30).allow(''),
    bio: joi_1.default.string().max(500).allow(''),
    email: joi_1.default.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .allow(''),
    photo: joi_1.default.string()
        .uri({ scheme: ['http', 'https'] })
        .allow(''),
    phoneNumber: joi_1.default.string()
        .regex(/^\+\d{2}\d{9,}$/)
        .min(7)
        .max(15)
        .allow('')
        .messages({
        'string.pattern.base': 'phone number should start with a plus sign, followed by the country code and national number',
    }),
    password: joi_1.default.string().min(5).max(20).allow(''),
});
exports.UserRepository = data_source_1.AppDataSource.getRepository(User_1.User);
router.get('/', (0, async_1.asyncMiddleware)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.UserRepository.find()];
            case 1:
                users = _a.sent();
                res.status(200).json({ success: true, data: users });
                return [2 /*return*/];
        }
    });
}); }));
router.put('/', jwtAuth_1.checkIsLoggedIn, storageMiddleware_1.storageMiddleware.single('photo'), (0, async_1.asyncMiddleware)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error, user, user_1, file, hashedPassword, updatedUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                error = userSchema.validate(req.body).error;
                if (error) {
                    throw new error_1.APIError('BAD REQUEST', _types_1.HttpStatusCode.BAD_REQUEST, true, error.message.replace(/\"/g, ''));
                }
                return [4 /*yield*/, exports.UserRepository.findOneBy({ id: req.user.id })];
            case 1:
                user = _a.sent();
                if (!(req.body.email && req.body.email.toLowerCase() !== user.email.toLowerCase())) return [3 /*break*/, 3];
                return [4 /*yield*/, exports.UserRepository.findOneBy({ email: req.body.email })];
            case 2:
                user_1 = _a.sent();
                if (user_1) {
                    throw new error_1.APIError('BAD REQUEST', _types_1.HttpStatusCode.BAD_REQUEST, true, 'email already exits');
                }
                _a.label = 3;
            case 3:
                if (!user) {
                    throw new error_1.APIError('NOT FOUND', _types_1.HttpStatusCode.NOT_FOUND, true, 'User not found');
                }
                file = req.file;
                if (file) {
                    req.body['photo'] = file.path;
                }
                if (!req.body.password) return [3 /*break*/, 5];
                return [4 /*yield*/, bcrypt.hash(req.body.password, 10)];
            case 4:
                hashedPassword = _a.sent();
                req.body['password'] = hashedPassword;
                Object.assign(user, req.body);
                return [3 /*break*/, 6];
            case 5:
                delete req.body.password;
                Object.assign(user, req.body);
                _a.label = 6;
            case 6: return [4 /*yield*/, exports.UserRepository.save(user)];
            case 7:
                updatedUser = _a.sent();
                delete updatedUser.provider;
                delete updatedUser.password;
                delete updatedUser.providerId;
                res.json({ message: 'details updated successfully', succes: true, user: updatedUser });
                return [2 /*return*/];
        }
    });
}); }));
// just to verify the users will delete it later
router.get('/hello', jwtAuth_1.checkIsLoggedIn, function (req, res) {
    res.send(req.user);
});
router.get('/delete', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.UserRepository.clear()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.default = { path: '/users', router: router };
//# sourceMappingURL=users.js.map