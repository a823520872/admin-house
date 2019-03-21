import axios from 'axios';
import router from '../router.js';
import store from '../store.js';
import { MessageBox } from 'element-ui';
const isPro = process.env.NODE_ENV === 'production';
const baseURL = isPro ? 'http://house.zhiqiang.ink' : '';

function Ajax(url, params, cfg) {
    const instance = axios.create({
        baseURL,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true,
        timeout: cfg.time || 10000
    });
    const obj = {
        method: cfg.type || 'get',
        url
    };
    const data = obj.method === 'get' ? 'params' : 'data';
    obj[data] = params;
    instance.interceptors.request.use(config => config, e => e);
    instance.interceptors.response.use(res => res.data, e => e);
    return new Promise((resolve, reject) => {
        store.commit('setLoading', true);
        instance(obj).then(
            res => {
                store.commit('setLoading', true);
                console.log('请求成功', url, res);
                if (res.code && res.code === 1) {
                    resolve(res);
                } else {
                    if (res.code === 401) {
                        localStorage.clear();
                        router.replace('/login');
                    } else {
                        MessageBox(res.msg, '服务异常', 'warning');
                        reject({ msg: res.msg });
                    }
                }
            },
            e => {
                store.commit('setLoading', true);
                console.log('网络异常', url, e);
                MessageBox(e.message, '网络异常', 'error');
                reject({ msg: '网络异常' });
            }
        );
    });
}

export default Ajax;
