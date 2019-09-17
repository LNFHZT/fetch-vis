"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = __importDefault(require("./fetch"));
var example_1 = require("./example");
var arr = ['get', 'post', 'put', 'delete', 'head', 'trace', 'connect'];
var fetchInside = new fetch_1.default();
var Fetch = /** @class */ (function () {
    function Fetch() {
        this.defaults = fetchInside.defaults;
        this.request = fetchInside.ajax;
        this.interceptors = {
            request: example_1.request, response: example_1.response
        };
    }
    // 新增vue 方法，用于注册再vue 中
    Fetch.prototype.install = function (Vue) {
        Vue.prototype.$fetch = fetch;
    };
    return Fetch;
}());
arr.forEach(function (item) {
    // @ts-ignore
    Fetch.prototype[item] = function (url, data, config) {
        if (data === void 0) { data = {}; }
        if (config === void 0) { config = {}; }
        var obj = fetchInside.handleAjax(url, item, data, config);
        return fetchInside.ajax(obj);
    };
});
var fetch = new Fetch();
exports.default = fetch;
