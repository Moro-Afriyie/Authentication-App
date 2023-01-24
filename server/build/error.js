"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIError = exports.BaseError = void 0;
var _types_1 = require("./@types");
var BaseError = /** @class */ (function (_super) {
    __extends(BaseError, _super);
    function BaseError(name, httpCode, description, isOperational) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, description) || this;
        Object.setPrototypeOf(_this, _newTarget.prototype);
        _this.name = name;
        _this.httpCode = httpCode;
        _this.isOperational = isOperational;
        Error.captureStackTrace(_this);
        return _this;
    }
    return BaseError;
}(Error));
exports.BaseError = BaseError;
//free to extend the BaseError
var APIError = /** @class */ (function (_super) {
    __extends(APIError, _super);
    function APIError(name, httpCode, isOperational, description) {
        if (httpCode === void 0) { httpCode = _types_1.HttpStatusCode.INTERNAL_SERVER; }
        if (isOperational === void 0) { isOperational = true; }
        if (description === void 0) { description = 'internal server error'; }
        return _super.call(this, name, httpCode, description, isOperational) || this;
    }
    return APIError;
}(BaseError));
exports.APIError = APIError;
//# sourceMappingURL=error.js.map