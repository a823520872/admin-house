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
                        keepAlive: true
                    },
                    component: () => import(/* webpackChunkName: "statistics.list" */ './views/statistics/List.vue')
                },
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
                        keepAlive: true
                    }
                },
                {
                    path: 'add',
                    component: () => import(/* webpackChunkName: "landlord.detail" */ './views/landlord/Item.vue'),
                },
                {
                    path: ':id',
                    component: () => import(/* webpackChunkName: "landlord.detail" */ './views/landlord/Item.vue'),
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
                        keepAlive: true
                    }
                },
                {
                    path: 'add',
                    component: () => import(/* webpackChunkName: "house.detail" */ './views/house/Item.vue'),
                },
                {
                    path: ':id',
                    component: () => import(/* webpackChunkName: "house.detail" */ './views/house/Item.vue'),
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
        }
    ]
});

routes.beforeEach((to, form, next) => {
    if (to.path === '/login') {
        next();
    } else {
        if (sessionStorage.getItem('tk')) {
            let pathArray = to.path.split('/')
            if (pathArray[1]) {
                store.commit('setMenu', '/'+pathArray[1]);
            }
            next();
        } else {
            next('/login');
        }
    }
})

export default routes;
