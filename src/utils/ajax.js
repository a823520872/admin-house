import axios from 'axios';
import { MessageBox } from 'element-ui';
const isPro = process.env.NODE_ENV === 'production';
const baseURL = isPro ? 'http://api.zhiqiang.ink' : '/api';

function Ajax(url, params, cfg) {
    let instance = axios.create({
        baseURL,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
        timeout: cfg.time || 10000
    });
    let obj = {
        method: cfg.type || 'get',
        url
    };
    if (obj.method === 'get') {
        obj.params = params;
    } else {
        obj.data = params;
    }
    instance.interceptors.request.use(config => config, e => e);
    instance.interceptors.response.use(res => res.data, e => e);
    return instance(obj).then(
        res => {
            console.log('请求成功', res);
        },
        e => {
            console.log('请求失败', e);
            MessageBox(e.message, '请求失败', 'error');
        }
    );
}

export default Ajax;
