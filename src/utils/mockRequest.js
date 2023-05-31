//axios进行二次封装
import axios from 'axios';
//进度条
// import nprogress from 'nprogress';
// import "nprogress/nprogress.css"

//创建axios实例
let instance = axios.create({
    baseURL: "/mock",
    //设置请求时间（5S）
    timeout: 5000
});


instance.interceptors.request.use((config) => {
    //config 请求拦截器配置对象，里面有请求头
    //检测到程序发请求，请求拦截器可以检测到，进度条开始动
    // nprogress.start();
    return config;
});

instance.interceptors.response.use((res) => {
    //简化服务器返回的数据格式
    //服务器数据返回进度条结束
    // nprogress.done();
    return res.data;
}, (error) => {
    //终止promise链
    return Promise.reject(error);
});

//对外暴露二次封装的axios
export default instance;