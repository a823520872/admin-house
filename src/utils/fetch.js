import 'whatwg-fetch';
import router from '../router.js';
import store from '../store.js';
import { MessageBox } from 'element-ui';
const isPro = process.env.NODE_ENV === 'production';
const baseURL = isPro ? 'http://house.zhiqiang.ink' : '';
import qs from 'querystringify';

function Ajax(url, params, cfg) {
    cfg.type = cfg.type || 'get';
    const obj = {
        method: cfg.type,
        credentials: 'include',
        mode: 'cors'
    };
    let uri = baseURL + url;
    const token = localStorage.getItem('tk');
    if (cfg.type === 'get') {
        uri += qs.stringify(params, true);
    } else if (cfg.type === 'post') {
        if (cfg.upload) {
            obj.body = params;
        } else {
            obj.headers = {
                'Content-Type': 'application/json'
            };
            obj.body = JSON.stringify(params);
        }
    }
    obj.headers = obj.headers || {};
    if (token) {
        obj.headers.token = token;
    }
    return new Promise((resolve, reject) => {
        fetch(uri, obj)
            .then(res => {
                store.commit('setLoading', true);
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error({
                        message: '网络异常'
                    });
                }
            })
            .then(res => {
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
            })
            .catch(e => {
                console.log('网络异常', url, e);
                MessageBox(e.message, '网络异常', 'error');
                reject({ msg: '网络异常' });
            });
    });
}

export default Ajax;
