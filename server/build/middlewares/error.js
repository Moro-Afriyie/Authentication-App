"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleErrors(err, _req, res, _next) {
    res.status(err.httpCode || 500);
    res.json({
        date: Date.now(),
        message: err.message,
        error: true,
    });
}
exports.default = handleErrors;
//# sourceMappingURL=error.js.map