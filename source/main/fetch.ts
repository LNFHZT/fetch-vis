import { deepCopy, emits, parseUrl, isFormData, tranJson, tranFormData } from "../utils";
import { request, response } from './example';
import qs from 'qs';
import { isObject } from "../utils/index";
let instance: FetchInside;
class FetchInside {
    defaults: any = {
        method: 'get',
        baseURL: '',
        async: true,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        params: {},
        data: {},
        timeout: 60000,
        source: 'SINGLE',
        requestType: 'json', // requestType  json / form
        responseType: 'json',
        withCredentials: false,
        validateStatus(status: any) {
            return status == 200;
        },
        transformRequest(...data: Array<Function>) {
            request.use(...data);
        },
        transformResponse(...data: Array<Function>) {
            response.use(...data);
        },
    };
    constructor() {
        if (instance) {
            return instance; //防止被篡改
        } else {
            instance = this;
        }
    }
    handleAjax(url: string, method: string, data: any, config: Object) {
        let body = {}, requestType;
        if (isFormData(data)) {
            body = tranJson(data);
            requestType = 'form';
        } else if (isObject(body)) {
            body = deepCopy(data);
        } else {
            // 不是对象情况，传什么，给什么
            body = data;
        }
        let obj = {
            ...this.defaults,
            ...config,
            url,
            method,
        }
        if (isObject(body)) {
            obj.data = {
                ...obj.data,
                ...body,
            }
        } else {
            obj.data = body;
        }
        requestType && (obj.requestType = requestType);
        return deepCopy(obj);
    }
    ajax(data: Object) {
        return this._ajax(deepCopy(data));
    }
    /**
     * 
     * @param params 
     * @description  内容实现描述：
     *                  1. _handleData 整合 data 和 params 数据 ，url 格式化 
     *                  2. 触发 transformRequest 钩子，修改data 值或者格式  去除
     *                  3. 避免 transformRequest 钩子中 修改了 data params url 所以重新调用一次_handleData，重新整合数据
     *                  4. 格式化 url
     */
    private _ajax(params: any) {
        try {
            params = this._handleData(deepCopy(params));
        } catch (error) {
            console.error(`_handleData:before:Error`);
            console.error(error);
        }
        return request.emit(emits.success, params)
            .then((result: any) => {
                params = result;
                try {
                    params = this._handleData(deepCopy(params));
                } catch (error) {
                    console.error(`_handleData:after:Error`);
                    console.error(error);
                }
                try {
                    params = this._handleUrl(deepCopy(params));
                } catch (error) {
                    console.error(`_handleUrl:Error`);
                    console.error(error);
                }

                return this._requestData(params);
            })
        // .catch((err: any) => {
        //     console.error(`request:Error`);
        //     console.log(err);
        //     console.error(err);
        //     request.emit(emits.fail, err);
        // });
    }
    /**
     * 
     * @param data 
     * @description method 转为大写，如果为空则设置 默认
     *              url 清除 url链接上的参数整合进params
     *              params 特殊情况，如果method等于GET的情况，params置空，params的数据，整合进data对象中
     */
    private _handleData(data: any): Object {
        if (typeof data != 'object') {
            throw new Error('请求参数有误,参数不是一个对象');
        }
        // method
        (!data.method) && (data.method = this.defaults.method);
        data.method = data.method.toUpperCase()
        // url
        let [url, params] = data.url.split('?');
        data.url = url;
        data.params = {
            ...qs.parse(params),
            ...data.params,
        }
        if (data.method == 'GET') {
            try {
                let d = deepCopy(data.data);
                data.params = {
                    ...data.params,
                    ...d,
                }
                data.data = undefined;
            } catch (error) {
                console.error('data-params整合:Error');
                console.error(error);
            }
        }
        return data
    }
    /**
     * 
     * @param data 
     * @description url 格式化
     */
    private _handleUrl(data: any): Object {
        if (!(data.url.includes('http://') || data.url.includes('https://'))) {
            // data.url = this.defaults.baseURL + data.url;
            data.url = `${this.defaults.baseURL}${data.url}`;
        }
        data.url = data.url.replace(/^\/\//, '/');
        let [url, params] = data.url.split('?');
        // 正则格式化 开头 // 斜杠 的链接
        url = url.replace(/^\/\//, '/');
        if (JSON.stringify(data.params) != '{}')
            data.url = `${url}?${qs.stringify(data.params)}`;
        return data;
    }
    /**
    * 
    * @param params 
    */
    private _requestData(params: any) {
        // @ts-ignore
        return new Promise((resolve, reject) => {
            this._requestStatus(params)
                .then((result: any) => {
                    // , ajax: params 
                    response.emit(emits.success, result)
                        .then((data: any) => {
                            resolve(data);
                        }).catch((error: any) => {
                            reject(error)
                        });
                })
                .catch((err: any) => {
                    // , ajax: params 
                    response.emit(emits.fail, err)
                        .then((data: any) => {
                            reject(data);
                        }).catch((error: any) => {
                            reject(error)
                        });
                });
        });
    }
    /**
     * 
     * @param params 
     * 请求层 中间状态处理
     */
    private _requestStatus(params: any) {
        console.log('_requestStatus:debug');
        console.log(params, params.body);
        // @ts-ignore
        return new Promise((resolve, reject) => {
            this._request(params)
                .then((result: any) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
    private _request(params: any) {
        // 请求头设置 'multipart/form-data', 'application/x-www-form-urlencode'  其中一种  会将data 内容自动转成formData
        let formData = ['multipart/form-data', 'application/x-www-form-urlencode'];
        Object.keys(params.headers).forEach((key: any, index: any) => {
            if (key.toLowerCase() == 'content-type') {
                // @ts-ignore
                if (formData.includes(params.headers[key].toLowerCase())) {
                    params.requestType = 'form';
                }
            }
        });
        // 是否是formData
        if (params.requestType == 'form') {
            isObject(params.data) && (params.body = tranFormData(params.data));
        } else {
            isObject(params.data) && (params.body = JSON.stringify(params.data));
        }
        // @ts-ignore
        return new Promise((resolve, reject) => {
            fetch(params.url, {
                headers: new Headers(params.headers),
                method: params.method,
                body: params.body,
                // body:'',
                credentials: this.defaults.withCredentials ? 'include' : undefined
            })
                .then(response => {
                    if (this.defaults.validateStatus(response.status)) {
                        try {
                            if (response.status == 200) {
                                if (this.defaults.responseType == 'text/html') {
                                    console.log('text/html');
                                    return response.text();
                                } else if (this.defaults.responseType == 'blob') {
                                    console.log('blob');
                                    return response.blob();
                                } else {

                                    return response.json();
                                }
                            } else {
                                return response
                            }
                        } catch (err) {
                            return response
                        }
                    } else {
                        console.error('validateStatus:校验失败');
                        throw { status: 'error', message: "validateStatus:校验失败" };
                        // reject(response)
                    }
                })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }
}

export default FetchInside