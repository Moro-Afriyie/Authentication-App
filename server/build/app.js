"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = require("./error");
var error_2 = __importDefault(require("./middlewares/error"));
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var cors = require("cors");
var api_1 = require("./api");
var _types_1 = require("./@types");
var passport = require("passport");
// create express app
var app = (0, express_1.default)();
// setup security headers
app.use((0, helmet_1.default)());
// setup cross-origin resource header sharing
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
// parse JSON and url-encoded bodies
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
// setup passport with sets up the passport session
app.use(passport.initialize());
// initialize api routes
(0, api_1.createAPI)(app);
app.get('/', function (req, res) {
    res.json({ user: req.user });
});
// handle all routes which aren't part of the application
app.use('*', function (req, _res) {
    throw new error_1.APIError('NOT FOUND', _types_1.HttpStatusCode.NOT_FOUND, true, "Requested URL ".concat(req.originalUrl, " not found"));
});
// error middleware
app.use(error_2.default);
exports.default = app;
//# sourceMappingURL=app.js.map