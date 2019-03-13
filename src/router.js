import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

const routes = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: Home,
            beforeEnter(to, from, next) {
                if (localStorage.getItem('tk')) {
                    next();
                } else {
                    next('/login');
                }
            },
            children: [
                {
                    path: 'landlord',
                    name: 'lanlord-list',
                    component: () => import(/* webpackChunkName: "landlords" */ './views/landlord/List.vue')
                },
                {
                    path: 'landlord/add',
                    name: 'lanlord-add',
                    component: () => import(/* webpackChunkName: "landlord" */ './views/landlord/Item.vue')
                },
                {
                    path: 'landlord/:id',
                    name: 'lanlord-edit',
                    component: () => import(/* webpackChunkName: "landlord" */ './views/landlord/Item.vue')
                },
                {
                    path: '/house',
                    name: 'house-list',
                    component: () => import(/* webpackChunkName: "houses" */ './views/house/List.vue')
                },
                {
                    path: '/house/add',
                    name: 'house-add',
                    component: () => import(/* webpackChunkName: "house" */ './views/house/Item.vue')
                },
                {
                    path: '/house/:id',
                    name: 'house-edit',
                    component: () => import(/* webpackChunkName: "house" */ './views/house/Item.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
            beforeEnter(to, from, next) {
                if (localStorage.getItem('tk')) {
                    next('/');
                } else {
                    next();
                }
            }
        }
    ]
});

export default routes;
