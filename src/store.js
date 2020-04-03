import Vue from 'vue';
import Vuex from 'vuex';

import api from './api';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loading: false,
        userinfo: null,
        menu: '/',
        addr: null,
        addrList: null
    },
    mutations: {
        setVal(state, obj) {
            state[obj.key] = obj.val;
        },
        setLoading(state, loading) {
            state.loading = loading;
        },
        setUserInfo(state, userinfo) {
            state.userinfo = userinfo;
        },
        setMenu(state, menu) {
            state.menu = menu;
        }
    },
    actions: {
        getArea(context) {
            if (context.state.addr) return Promise.resolve();
            return new Promise((resolve, reject) => {
                api.addr.area({}).then(res => {
                    if (res.data) {
                        const list = res.data;
                        let addrList = {};
                        const addr = list.reduce((obj, item) => {
                            if (!item.pid) return obj;
                            addrList[item.id] = item;
                            if (!obj[item.pid]) {
                                obj[item.pid] = [];
                            }
                            obj[item.pid].push(item);
                            return obj;
                        }, {});

                        const city = list.filter(filterCity);

                        const area = city.map(item => {
                            if (addr[item.id]) {
                                const children = addr[item.id].map(li => {
                                    if (addr[li.id]) {
                                        li.children = addr[li.id].map(l => ({
                                            value: l.id,
                                            label: l.name
                                        }));
                                    }
                                    return {
                                        value: li.id,
                                        label: li.name,
                                        children: li.children
                                    };
                                });
                                item.children = children;
                            }
                            return {
                                value: item.id,
                                label: item.name,
                                children: item.children
                            };
                        });
                        context.commit('setVal', { key: 'addr', val: area });
                        context.commit('setVal', { key: 'addrList', val: addrList });
                        resolve();
                    }
                }, reject);
            });
        }
    }
});

function filterCity(item) {
    return item.level === 2;
}
