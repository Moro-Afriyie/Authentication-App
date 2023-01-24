"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsLoggedIn = void 0;
var passport = require("passport");
var error_1 = require("../error");
var _types_1 = require("../@types");
function checkIsLoggedIn(req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
        try {
            if (err || !user) {
                throw new error_1.APIError('UNAUTHORIZED', _types_1.HttpStatusCode.UNAUTHORISED, true, 'Not Authorised');
            }
            req.user = user;
            return next();
        }
        catch (error) {
            next(error);
        }
    })(req, res, next);
}
exports.checkIsLoggedIn = checkIsLoggedIn;
//# sourceMappingURL=jwtAuth.js.map