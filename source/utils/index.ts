export function deepCopy(obj: any) {
    if (obj == null) { return null }
    let result: any = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]); // 如果是对象，再次调用该方法自身 
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

export enum emits {
    success = 'success',
    fail = 'fail'
}

export function parseUrl(url: any) {
    var a = document.createElement('a');
    a.href = url;
    return {
        protocol: a.protocol.replace(':', ''),
        hostname: a.hostname,
        port: a.port,
        path: a.pathname,
        query: (() => {
            var query = a.search.substr(1);
            var queryArr = query.split('&');
            var queryObj = {};
            queryArr.forEach((item: any, index) => {
                var item = item.split('=');
                var key = item[0];
                // @ts-ignore
                queryObj[key] = item[1];
            })
            return queryObj;
        })(),
        params: (() => {
            var params = a.hash.substr(1);
            var paramsArr = params.split('#');
            return paramsArr;

        })(),

    }
}
// 是否是formdata
export const isFormData = (v: any) => {
    return Object.prototype.toString.call(v) === '[object FormData]';
}
// 是否是object 
export const isObject = (v: any) => {
    return Object.prototype.toString.call(v) === '[object Object]';
}
// json 转formData
export const tranFormData = (params: any) => {
    let formData = new FormData();
    Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
    });
    return formData;
}

// fromData 转 json
export const tranJson = (formData: any) => {
    var jsonData = {};
    // @ts-ignore
    formData.forEach((value: any, key: any) => jsonData[key] = value);
    return jsonData;
}
