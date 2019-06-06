import 'whatwg-fetch';
import { MessageBox } from 'element-ui';

import router from '../router.js';
import store from '../store.js';

const isPro = process.env.NODE_ENV === 'production';
const baseURL = isPro ? 'http://house.zhiqiang.ink' : '';
import qs from 'querystring';

function Ajax(url, params, cfg) {
    const obj = {
        method: cfg.type,
        credentials: 'include',
        mode: 'cors',
        headers: {}
    };
    const token = sessionStorage.getItem('tk');
    let uri = baseURL + url;
    cfg = {
        ...{
            type: 'get'
        },
        ...cfg
    };
    if (cfg.type === 'get') {
        uri += '?' + qs.stringify(params);
    } else if (cfg.type === 'post') {
        if (cfg.upload) {
            obj.body = params;
        } else {
            obj.headers['Content-Type'] = 'application/json';
            obj.body = JSON.stringify(params);
        }
    }
    if (token) {
        obj.headers.token = token;
    }
    return new Promise((resolve, reject) => {
        store.commit('setLoading', true);
        fetch(uri, obj)
            .then(res => {
                store.commit('setLoading', false);
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error({
                        message: '网络异常'
                    });
                }
            })
            .then(res => {
                // console.log('请求成功', url, res);
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
                // console.log('网络异常', url, e);
                MessageBox(e.message, '网络异常', 'error');
                reject({ msg: '网络异常' });
            });
    });
}

export default Ajax;
