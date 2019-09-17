import FetchInside from './fetch';
import { request, response } from './example';
const arr: Array<string> = ['get', 'post', 'put', 'delete', 'head', 'trace', 'connect'];
const fetchInside = new FetchInside();
class Fetch {
    defaults = fetchInside.defaults
    interceptors: any
    constructor() {
        this.interceptors = {
            request, response
        }
    }
    request = fetchInside.ajax
    // 新增vue 方法，用于注册再vue 中
    install(Vue: any) {
        Vue.prototype.$fetch = fetch;
    }
}
arr.forEach(item => {
    // @ts-ignore
    Fetch.prototype[item] = function (url, data = {}, config = {}) {
        let obj = fetchInside.handleAjax(url, item, data, config);
        return fetchInside.ajax(obj);
    }
})
let fetch = new Fetch();
export default fetch