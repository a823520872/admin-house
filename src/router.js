import Router from 'vue-router';
import Vue from 'vue';

import store from './store.js';

import Home from './views/Home.vue';

Vue.use(Router);

const routes = new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: Home,
            children: [
                {
                    path: 'statistics',
                    meta: {
                        keepAlive: true,
                        _menu: '/statistics'
                    },
                    component: () => import(/* webpackChunkName: "statistics.list" */ './views/statistics/List.vue')
                }
            ]
        },
        {
            path: '/landlord',
            component: Home,
            children: [
                {
                    path: '/',
                    component: () => import(/* webpackChunkName: "landlord.list" */ './views/landlord/List.vue'),
                    meta: {
                        keepAlive: true,
                        _menu: '/landlord'
                    }
                },
                {
                    path: 'add',
                    component: () => import(/* webpackChunkName: "landlord.detail" */ './views/landlord/Item.vue'),
                    meta: {
                        _title: '添加房东',
                        _menu: '/landlord'
                    }
                },
                {
                    path: ':id',
                    component: () => import(/* webpackChunkName: "landlord.detail" */ './views/landlord/Item.vue'),
                    meta: {
                        _title: '编辑房东',
                        _menu: '/landlord'
                    }
                }
            ]
        },
        {
            path: '/house',
            component: Home,
            children: [
                {
                    path: '/',
                    component: () => import(/* webpackChunkName: "house.list" */ './views/house/List.vue'),
                    meta: {
                        keepAlive: true,
                        _menu: '/house'
                    }
                },
                {
                    path: 'add',
                    component: () => import(/* webpackChunkName: "house.detail" */ './views/house/Item.vue'),
                    meta: {
                        _title: '添加房源',
                        _menu: '/house'
                    }
                },
                {
                    path: ':id',
                    component: () => import(/* webpackChunkName: "house.detail" */ './views/house/Item.vue'),
                    meta: {
                        _title: '编辑房源',
                        _menu: '/house'
                    }
                }
            ]
        },
        {
            path: '/address',
            component: Home,
            children: [
                // {
                //     path: '/',
                //     redirect: '/address/street'
                // },
                {
                    path: 'street',
                    component: () => import(/* webpackChunkName: "street" */ './views/address/street.vue'),
                    meta: {
                        keepAlive: true,
                        _menu: '/address/street'
                    }
                },
                {
                    path: 'flag',
                    component: () => import(/* webpackChunkName: "flag" */ './views/address/flag.vue'),
                    meta: {
                        keepAlive: true,
                        _menu: '/address/flag'
                    }
                },
                {
                    path: 'metro',
                    component: () => import(/* webpackChunkName: "metro" */ './views/address/metro.vue'),
                    meta: {
                        keepAlive: true,
                        _menu: '/address/metro'
                    }
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});

routes.beforeEach((to, form, next) => {
    if (to.path === '/login') {
        next();
    } else {
        if (sessionStorage.getItem('tk')) {
            store.commit('setMenu', `${to.meta._menu}`);
            next();
        } else {
            next('/login');
        }
    }
});

export default routes;
