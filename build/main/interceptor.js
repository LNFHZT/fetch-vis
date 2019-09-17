"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var voidFunc = function (data) {
    return data;
};
var Interceptor = /** @class */ (function () {
    function Interceptor() {
        this.success = voidFunc;
        this.fail = voidFunc;
    }
    Interceptor.prototype.use = function () {
        var _this = this;
        var func = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            func[_i] = arguments[_i];
        }
        func.forEach(function (item, index) {
            if (index == 0) {
                _this.success = item;
            }
            if (index == 1) {
                _this.fail = item;
            }
        });
    };
    Interceptor.prototype.emit = function (type, params) {
        // @ts-ignore
        if (this[type]) {
            var data = void 0;
            try {
                // @ts-ignore
                data = this[type](params);
            }
            catch (error) {
                console.error(error);
                data = {};
                // @ts-ignore
                return Promise.reject({ data: data, error: error });
            }
            // 判断是否是Promise对象
            if (Object.prototype.toString.call(data) != '[object Promise]') {
                // @ts-ignore
                return Promise.resolve(data);
            }
            else {
                return data;
            }
        }
        else {
            console.error(this);
            console.error(type);
            throw "emit触发失败";
        }
    };
    return Interceptor;
}());
exports.default = Interceptor;
