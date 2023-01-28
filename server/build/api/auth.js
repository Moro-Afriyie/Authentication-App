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
var _types_1 = require("./../@types");
var error_1 = require("./../error");
var express_1 = require("express");
var passport = require("passport");
var passport_google_oauth20_1 = require("passport-google-oauth20");
var Jwt = __importStar(require("jsonwebtoken"));
var passport_jwt_1 = require("passport-jwt");
var passport_github2_1 = require("passport-github2");
var passport_facebook_1 = require("passport-facebook");
var users_1 = require("./users");
var jwtAuth_1 = require("../middlewares/jwtAuth");
var bcrypt = __importStar(require("bcrypt"));
var joi_1 = __importDefault(require("joi"));
var async_1 = require("../middlewares/async");
var RegisterationSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(30).required(),
    email: joi_1.default.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: joi_1.default.string().min(5).max(20).required(),
});
var loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: joi_1.default.string().min(5).max(20).required(),
});
var jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
var router = (0, express_1.Router)();
// use the jwt token
passport.use(new passport_jwt_1.Strategy(jwtOptions, function (jwt_payload, done) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, users_1.UserRepository.findOneBy({ id: jwt_payload.id })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, done(null, false)];
                    return [2 /*return*/, done(null, user)];
            }
        });
    });
}));
// Generate an Access Token for the given User ID
function generateAccessToken(user, expiresIn) {
    var secret = process.env.JWT_SECRET;
    var expiration = expiresIn
        ? {
            expiresIn: expiresIn,
        }
        : {};
    var token = Jwt.sign({ id: user.id }, secret, expiration);
    return token;
}
// google
passport.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true,
}, function (req, accessToken, refreshToken, profile, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, users_1.UserRepository.findOneBy({ email: profile.emails[0].value })];
            case 1:
                user = _a.sent();
                if (user && user.provider !== profile.provider)
                    return [2 /*return*/, cb(null, false, {
                            message: 'Google Account is not registered with this email. Please sign in using other methods',
                        })];
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, users_1.UserRepository.save({
                        name: "".concat(profile.name.givenName, " ").concat(profile.name.familyName),
                        email: profile.emails[0].value,
                        photo: profile.photos[0].value,
                        provider: profile.provider,
                        providerId: profile.id,
                    })];
            case 2:
                user = _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/, cb(null, user)];
        }
    });
}); }));
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/google/callback', function (req, res, next) {
    passport.authenticate('google', {
        session: false,
        passReqToCallback: true,
    }, function (err, user, info) {
        if (err || !user) {
            return res.redirect(process.env.CLIENT_HOME_PAGE_URL + '?error=' + (info === null || info === void 0 ? void 0 : info.message));
        }
        var token = generateAccessToken(user, '2m');
        res.redirect("".concat(process.env.CLIENT_HOME_PAGE_URL, "/?code=").concat(token));
    })(req, res, next);
});
// end google
//begin github
passport.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = null;
                    if (!profile.emails[0].value) return [3 /*break*/, 2];
                    return [4 /*yield*/, users_1.UserRepository.findOneBy({ email: profile.emails[0].value })];
                case 1:
                    user = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, users_1.UserRepository.findOneBy({ providerId: profile.id })];
                case 3:
                    user = _a.sent();
                    _a.label = 4;
                case 4:
                    if (user && user.provider !== profile.provider)
                        return [2 /*return*/, done(null, false, {
                                message: 'Github Account is not registered with this email. Please sign in using other methods',
                            })];
                    if (!!user) return [3 /*break*/, 6];
                    return [4 /*yield*/, users_1.UserRepository.save({
                            name: "".concat(profile.displayName),
                            email: profile.emails[0].value || '',
                            photo: profile.photos[0].value,
                            provider: profile.provider,
                            providerId: profile.id,
                        })];
                case 5:
                    user = _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/, done(null, user)];
            }
        });
    });
}));
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', function (req, res, next) {
    passport.authenticate('github', {
        scope: ['user:email'],
        session: false,
        passReqToCallback: true,
    }, function (err, user, info) {
        console.log('error: ', err);
        console.log('info: ', info);
        if (err || !user) {
            return res.redirect(process.env.CLIENT_HOME_PAGE_URL + '?error=' + (info === null || info === void 0 ? void 0 : info.message));
        }
        var token = generateAccessToken(user, '2m');
        res.redirect("".concat(process.env.CLIENT_HOME_PAGE_URL, "/?code=").concat(token));
    })(req, res, next);
});
// end github
// begin facebook
passport.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, users_1.UserRepository.findOneBy({ providerId: profile.id })];
                case 1:
                    user = _a.sent();
                    if (!!user) return [3 /*break*/, 3];
                    return [4 /*yield*/, users_1.UserRepository.save({
                            name: "".concat(profile.displayName),
                            photo: profile.profileUrl,
                            provider: profile.provider,
                            providerId: profile.id,
                        })];
                case 2:
                    user = _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, done(null, user)];
            }
        });
    });
}));
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'], session: false }));
router.get('/facebook/callback', function (req, res, next) {
    passport.authenticate('facebook', {
        scope: ['email'],
        session: false,
        passReqToCallback: true,
    }, function (err, user, info) {
        if (err || !user) {
            return res.redirect(process.env.CLIENT_HOME_PAGE_URL + '?error=' + (info === null || info === void 0 ? void 0 : info.message));
        }
        var token = generateAccessToken(user, '2m');
        res.redirect("".concat(process.env.CLIENT_HOME_PAGE_URL, "/?code=").concat(token));
    })(req, res, next);
});
// end facebook
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect(process.env.CLIENT_HOME_PAGE_URL);
    });
});
router.get('/login/failed', function (req, res) {
    throw new error_1.APIError('UNAUTHORIZED', _types_1.HttpStatusCode.UNAUTHORISED, true, 'failed to authenticate user');
});
router.get('/login/success', jwtAuth_1.checkIsLoggedIn, function (req, res) {
    var token = generateAccessToken(req.user);
    var user = req.user;
    delete user.provider;
    delete user.providerId;
    delete user.password;
    res.json({ message: 'login success', success: true, user: user, token: token });
});
router.post('/register', (0, async_1.asyncMiddleware)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, name, error, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, name = _a.name;
                error = RegisterationSchema.validate(req.body).error;
                if (error) {
                    throw new error_1.APIError('BAD REQUEST', _types_1.HttpStatusCode.BAD_REQUEST, true, error.message.replace(/\"/g, ''));
                }
                return [4 /*yield*/, users_1.UserRepository.findOneBy({ email: email })];
            case 1:
                user = _b.sent();
                if (user) {
                    throw new error_1.APIError('BAD REQUEST', _types_1.HttpStatusCode.BAD_REQUEST, true, "user already exitsts ".concat(user.provider ? "and registered using ".concat(user.provider) : '', ".please login to continue"));
                }
                bcrypt.hash(password, 10, function (err, hashedPassword) { return __awaiter(void 0, void 0, void 0, function () {
                    var token;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (err) {
                                    res.status(_types_1.HttpStatusCode.INTERNAL_SERVER);
                                    return [2 /*return*/, res.json({
                                            date: Date.now(),
                                            message: err.message,
                                            error: true,
                                        })];
                                }
                                return [4 /*yield*/, users_1.UserRepository.save({
                                        name: name,
                                        email: email,
                                        password: hashedPassword,
                                    })];
                            case 1:
                                user = _a.sent();
                                delete user.provider;
                                delete user.password;
                                delete user.providerId;
                                token = generateAccessToken(user);
                                res.status(201).json({
                                    message: 'account created succesfully',
                                    success: true,
                                    user: user,
                                    token: token,
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); }));
router.post('/login', (0, async_1.asyncMiddleware)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, error, user, isValidPassword, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                error = loginSchema.validate(req.body).error;
                if (error) {
                    throw new error_1.APIError('BAD REQUEST', _types_1.HttpStatusCode.BAD_REQUEST, true, error.message.replace(/\"/g, ''));
                }
                return [4 /*yield*/, users_1.UserRepository.findOneBy({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    throw new error_1.APIError('NOT FOUND', _types_1.HttpStatusCode.NOT_FOUND, true, 'account not found. please sign up');
                }
                if (user.provider && !user.password) {
                    throw new error_1.APIError('BAD REQUEST', _types_1.HttpStatusCode.BAD_REQUEST, true, "user registered using ".concat(user.provider, " .please login to continue"));
                }
                isValidPassword = bcrypt.compareSync(password, user.password);
                if (!isValidPassword) {
                    throw new error_1.APIError('BAD REQUEST', _types_1.HttpStatusCode.BAD_REQUEST, true, "invalid email or password");
                }
                delete user.provider;
                delete user.password;
                delete user.providerId;
                token = generateAccessToken(user);
                res.status(200).json({
                    message: 'loggin success',
                    success: true,
                    user: user,
                    token: token,
                });
                return [2 /*return*/];
        }
    });
}); }));
exports.default = { path: '/auth', router: router };
//# sourceMappingURL=auth.js.map