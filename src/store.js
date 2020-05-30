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
        addrList: null,
        area: null
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
        getArea(context, flag) {
            if (!flag && context.state.addr) return Promise.resolve();
            return new Promise((resolve, reject) => {
                api.addr.area({}).then(res => {
                    if (res.data) {
                        const list = res.data;
                        let addrList = {};
                        let areaList = [];
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
                                            label: l.name,
                                            level: l.level
                                        }));
                                    }
                                    return {
                                        value: li.id,
                                        label: li.name,
                                        level: li.level,
                                        children: li.children
                                    };
                                });
                                item.children = children;
                            }
                            return {
                                value: item.id,
                                label: item.name,
                                level: item.level,
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
