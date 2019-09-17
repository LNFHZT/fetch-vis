import ES6Promise from "es6-promise";
// fetch 不支持兼容
import 'whatwg-fetch'
// Promise兼容
// @ts-ignore
if (!window.Promise) {
    console.log(ES6Promise)
    ES6Promise.polyfill();
}
import fetch from './main/main';
export default fetch;