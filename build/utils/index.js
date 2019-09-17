"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function deepCopy(obj) {
    if (obj == null) {
        return null;
    }
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]); // 如果是对象，再次调用该方法自身 
            }
            else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}
exports.deepCopy = deepCopy;
var emits;
(function (emits) {
    emits["success"] = "success";
    emits["fail"] = "fail";
})(emits = exports.emits || (exports.emits = {}));
function parseUrl(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        protocol: a.protocol.replace(':', ''),
        hostname: a.hostname,
        port: a.port,
        path: a.pathname,
        query: (function () {
            var query = a.search.substr(1);
            var queryArr = query.split('&');
            var queryObj = {};
            queryArr.forEach(function (item, index) {
                var item = item.split('=');
                var key = item[0];
                // @ts-ignore
                queryObj[key] = item[1];
            });
            return queryObj;
        })(),
        params: (function () {
            var params = a.hash.substr(1);
            var paramsArr = params.split('#');
            return paramsArr;
        })(),
    };
}
exports.parseUrl = parseUrl;
// 是否是formdata
exports.isFormData = function (v) {
    return Object.prototype.toString.call(v) === '[object FormData]';
};
// 是否是object 
exports.isObject = function (v) {
    return Object.prototype.toString.call(v) === '[object Object]';
};
// json 转formData
exports.tranFormData = function (params) {
    var formData = new FormData();
    Object.keys(params).forEach(function (key) {
        formData.append(key, params[key]);
    });
    return formData;
};
// fromData 转 json
exports.tranJson = function (formData) {
    var jsonData = {};
    // @ts-ignore
    formData.forEach(function (value, key) { return jsonData[key] = value; });
    return jsonData;
};
