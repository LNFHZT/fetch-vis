"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var es6_promise_1 = __importDefault(require("es6-promise"));
// fetch 不支持兼容
require("whatwg-fetch");
// Promise兼容
// @ts-ignore
if (!window.Promise) {
    console.log(es6_promise_1.default);
    es6_promise_1.default.polyfill();
}
var main_1 = __importDefault(require("./main/main"));
exports.default = main_1.default;
