"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAPI = void 0;
var users_1 = __importDefault(require("./users"));
var auth_1 = __importDefault(require("./auth"));
var endpoints = [users_1.default, auth_1.default];
function createAPI(app) {
    endpoints.forEach(function (_a) {
        var path = _a.path, router = _a.router;
        app.use(path, router);
    });
}
exports.createAPI = createAPI;
//# sourceMappingURL=index.js.map