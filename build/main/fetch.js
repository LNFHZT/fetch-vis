"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var example_1 = require("./example");
var qs_1 = __importDefault(require("qs"));
var index_1 = require("../utils/index");
var instance;
var FetchInside = /** @class */ (function () {
    function FetchInside() {
        this.defaults = {
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
            requestType: 'json',
            responseType: 'json',
            withCredentials: false,
            validateStatus: function (status) {
                return status == 200;
            },
            transformRequest: function () {
                var data = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    data[_i] = arguments[_i];
                }
                example_1.request.use.apply(example_1.request, data);
            },
            transformResponse: function () {
                var data = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    data[_i] = arguments[_i];
                }
                example_1.response.use.apply(example_1.response, data);
            },
        };
        if (instance) {
            return instance; //防止被篡改
        }
        else {
            instance = this;
        }
    }
    FetchInside.prototype.handleAjax = function (url, method, data, config) {
        var body = {}, requestType;
        if (utils_1.isFormData(data)) {
            body = utils_1.tranJson(data);
            requestType = 'form';
        }
        else if (index_1.isObject(body)) {
            body = utils_1.deepCopy(data);
        }
        else {
            // 不是对象情况，传什么，给什么
            body = data;
        }
        var obj = __assign({}, this.defaults, config, { url: url,
            method: method });
        if (index_1.isObject(body)) {
            obj.data = __assign({}, obj.data, body);
        }
        else {
            obj.data = body;
        }
        requestType && (obj.requestType = requestType);
        return utils_1.deepCopy(obj);
    };
    FetchInside.prototype.ajax = function (data) {
        return this._ajax(utils_1.deepCopy(data));
    };
    /**
     *
     * @param params
     * @description  内容实现描述：
     *                  1. _handleData 整合 data 和 params 数据 ，url 格式化
     *                  2. 触发 transformRequest 钩子，修改data 值或者格式  去除
     *                  3. 避免 transformRequest 钩子中 修改了 data params url 所以重新调用一次_handleData，重新整合数据
     *                  4. 格式化 url
     */
    FetchInside.prototype._ajax = function (params) {
        var _this = this;
        try {
            params = this._handleData(utils_1.deepCopy(params));
        }
        catch (error) {
            console.error("_handleData:before:Error");
            console.error(error);
        }
        return example_1.request.emit(utils_1.emits.success, params)
            .then(function (result) {
            params = result;
            try {
                params = _this._handleData(utils_1.deepCopy(params));
            }
            catch (error) {
                console.error("_handleData:after:Error");
                console.error(error);
            }
            try {
                params = _this._handleUrl(utils_1.deepCopy(params));
            }
            catch (error) {
                console.error("_handleUrl:Error");
                console.error(error);
            }
            return _this._requestData(params);
        });
        // .catch((err: any) => {
        //     console.error(`request:Error`);
        //     console.log(err);
        //     console.error(err);
        //     request.emit(emits.fail, err);
        // });
    };
    /**
     *
     * @param data
     * @description method 转为大写，如果为空则设置 默认
     *              url 清除 url链接上的参数整合进params
     *              params 特殊情况，如果method等于GET的情况，params置空，params的数据，整合进data对象中
     */
    FetchInside.prototype._handleData = function (data) {
        if (typeof data != 'object') {
            throw new Error('请求参数有误,参数不是一个对象');
        }
        // method
        (!data.method) && (data.method = this.defaults.method);
        data.method = data.method.toUpperCase();
        // url
        var _a = data.url.split('?'), url = _a[0], params = _a[1];
        data.url = url;
        data.params = __assign({}, qs_1.default.parse(params), data.params);
        if (data.method == 'GET') {
            try {
                var d = utils_1.deepCopy(data.data);
                data.params = __assign({}, data.params, d);
                data.data = undefined;
            }
            catch (error) {
                console.error('data-params整合:Error');
                console.error(error);
            }
        }
        return data;
    };
    /**
     *
     * @param data
     * @description url 格式化
     */
    FetchInside.prototype._handleUrl = function (data) {
        if (!(data.url.includes('http://') || data.url.includes('https://'))) {
            // data.url = this.defaults.baseURL + data.url;
            data.url = "" + this.defaults.baseURL + data.url;
        }
        data.url = data.url.replace(/^\/\//, '/');
        var _a = data.url.split('?'), url = _a[0], params = _a[1];
        // 正则格式化 开头 // 斜杠 的链接
        url = url.replace(/^\/\//, '/');
        if (JSON.stringify(data.params) != '{}')
            data.url = url + "?" + qs_1.default.stringify(data.params);
        return data;
    };
    /**
    *
    * @param params
    */
    FetchInside.prototype._requestData = function (params) {
        var _this = this;
        // @ts-ignore
        return new Promise(function (resolve, reject) {
            _this._requestStatus(params)
                .then(function (result) {
                // , ajax: params 
                example_1.response.emit(utils_1.emits.success, result)
                    .then(function (data) {
                    resolve(data);
                }).catch(function (error) {
                    reject(error);
                });
            })
                .catch(function (err) {
                // , ajax: params 
                example_1.response.emit(utils_1.emits.fail, err)
                    .then(function (data) {
                    reject(data);
                }).catch(function (error) {
                    reject(error);
                });
            });
        });
    };
    /**
     *
     * @param params
     * 请求层 中间状态处理
     */
    FetchInside.prototype._requestStatus = function (params) {
        var _this = this;
        console.log('_requestStatus:debug');
        console.log(params, params.body);
        // @ts-ignore
        return new Promise(function (resolve, reject) {
            _this._request(params)
                .then(function (result) {
                resolve(result);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    FetchInside.prototype._request = function (params) {
        var _this = this;
        // 请求头设置 'multipart/form-data', 'application/x-www-form-urlencode'  其中一种  会将data 内容自动转成formData
        var formData = ['multipart/form-data', 'application/x-www-form-urlencode'];
        Object.keys(params.headers).forEach(function (key, index) {
            if (key.toLowerCase() == 'content-type') {
                // @ts-ignore
                if (formData.includes(params.headers[key].toLowerCase())) {
                    params.requestType = 'form';
                }
            }
        });
        // 是否是formData
        if (params.requestType == 'form') {
            index_1.isObject(params.data) && (params.body = utils_1.tranFormData(params.data));
        }
        else {
            index_1.isObject(params.data) && (params.body = JSON.stringify(params.data));
        }
        // @ts-ignore
        return new Promise(function (resolve, reject) {
            fetch(params.url, {
                headers: new Headers(params.headers),
                method: params.method,
                body: params.body,
                // body:'',
                credentials: _this.defaults.withCredentials ? 'include' : undefined
            })
                .then(function (response) {
                if (_this.defaults.validateStatus(response.status)) {
                    try {
                        if (response.status == 200) {
                            if (_this.defaults.responseType == 'text/html') {
                                console.log('text/html');
                                return response.text();
                            }
                            else if (_this.defaults.responseType == 'blob') {
                                console.log('blob');
                                return response.blob();
                            }
                            else {
                                return response.json();
                            }
                        }
                        else {
                            return response;
                        }
                    }
                    catch (err) {
                        return response;
                    }
                }
                else {
                    console.error('validateStatus:校验失败');
                    throw { status: 'error', message: "validateStatus:校验失败" };
                    // reject(response)
                }
            })
                .then(function (result) {
                resolve(result);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    return FetchInside;
}());
exports.default = FetchInside;
