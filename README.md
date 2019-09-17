## fetch-vis
    fetch请求封装 兼容浏览器，当前浏览器不支持fetch 请求类型则会使用xhr，即原ajax 请求

## 安装
```
npm install fetch-vis --save
cnpm install fetch-vis --save
```
## 引用
```
import fetch from 'fetch-vis';
const fetch = require("fetch-vis").default;
```

## 示例
```
fetch.get(url[,data,config])
fetch.post(url[,data,config])
fetch.put(url[,data,config])
fetch.delete(url[,data,config])
fetch.head(url[,data,config])
fetch.trace(url[,data,config]) 
fetch.connect(url[,data,config])
```
以上方法名对应着相对的请求方式 
```
fetch.request({url[,method,data,params,headers]})
```

------------------------------------------
```
<!-- get 请求： /get/user/info?urlparams=1&id=1&params=2  -->
fetch.get('/get/user/info?urlparams=1',{id:1},{params:  {params=2}})
    .then( response=> {
        console.log(response); 
    })
    .catch( error=> {
        console.log(error); 
    });
<!-- post 请求：  -->
fetch.post('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
    .then( response=> {
        console.log(response); 
    })
    .catch( error=> {
        console.log(error); 
    });
<!-- put 请求：  -->
fetch.put('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
    .then( response=> {
        console.log(response); 
    })
    .catch( error=> {
        console.log(error); 
    });
<!-- head 请求：  -->
fetch.head('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
    .then( response=> {
        console.log(response); 
    })
    .catch( error=> {
        console.log(error); 
    });
<!-- trace 请求：  -->
fetch.trace('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
    .then( response=> {
        console.log(response); 
    })
    .catch( error=> {
        console.log(error); 
    });
<!-- delete 请求：  -->
fetch.delete('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
    .then( response=> {
        console.log(response); 
    })
    .catch( error=> {
        console.log(error); 
    });
<!-- connect 请求：  -->
fetch.connect('/get/user/info?urlparams=1',{id:1},{params:{params=2}})
    .then( response=> {
        console.log(response); 
    })
    .catch( error=> {
        console.log(error); 
    });
```

## 简介
fetch-vis 支持在vue 环境下直接use 挂载在全局上。

## api  
```
{
  method:"", // 默认请求方式 默认是get
  baseURL:"", // 默认 请求域名
  headers:{}, // 发送的自定义请求头
  params:{}, // 是与请求一起发送的 URL 参数 params 现只支持对象形式
  data: {},  // 是与请求一起发送的 body 里面的内容
  /**
    * 注册请求前预处理
    * 还可以通过  fetch.interceptors.request.use(config=>{}) 实现注册
    */
  transformRequest(config=>{
     // 实现内容
  }) , 
  /**
    * 注册请求拦截器
    * 还可以通过  fetch.interceptors.response.use(config=>{},error=>{}) 实现注册
    */
  transformResponse(data=>{
     // 实现内容
  },error=>{
    // 请求错误/失败 实现内容
  }) , 
   
}
```

## 版本
* alpha v0.0.1
  > 使用ts 编写整体架构。<br>
  > 实现简单请求，拦截器等功能。<br>
  > 兼容不支持fetch请求的浏览器。<br>