import Vue from 'vue';
import Router from 'vue-router';
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
            beforeEnter(to, from, next) {
                store.commit('setMenu', to.path);
                if (sessionStorage.getItem('tk')) {
                    next();
                } else {
                    next('/login');
                }
            },
            children: [
                {
                    path: 'landlord',
                    name: 'lanlord-list',
                    component: () => import(/* webpackChunkName: "landlords.list" */ './views/landlord/List.vue'),
                    beforeEnter(to, form, next) {
                        store.commit('setMenu', to.path);
                        next();
                    }
                },
                {
                    path: 'landlord/add',
                    name: 'lanlord-add',
                    component: () => import(/* webpackChunkName: "landlord.detail" */ './views/landlord/Item.vue'),
                    beforeEnter(to, form, next) {
                        store.commit('setMenu', '/landlord');
                        next();
                    }
                },
                {
                    path: 'landlord/:id',
                    name: 'lanlord-edit',
                    component: () => import(/* webpackChunkName: "landlord.detail" */ './views/landlord/Item.vue'),
                    beforeEnter(to, form, next) {
                        store.commit('setMenu', '/landlord');
                        next();
                    }
                },
                {
                    path: 'house',
                    name: 'house-list',
                    component: () => import(/* webpackChunkName: "houses.list" */ './views/house/List.vue'),
                    beforeEnter(to, form, next) {
                        store.commit('setMenu', to.path);
                        next();
                    }
                },
                {
                    path: 'house/add',
                    name: 'house-add',
                    component: () => import(/* webpackChunkName: "house.detail" */ './views/house/Item.vue'),
                    beforeEnter(to, form, next) {
                        store.commit('setMenu', '/house');
                        next();
                    }
                },
                {
                    path: 'house/:id',
                    name: 'house-edit',
                    component: () => import(/* webpackChunkName: "house.detail" */ './views/house/Item.vue'),
                    beforeEnter(to, form, next) {
                        store.commit('setMenu', '/house');
                        next();
                    }
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
            beforeEnter(to, from, next) {
                store.commit('setMenu', to.path);
                if (sessionStorage.getItem('tk')) {
                    next('/');
                } else {
                    next();
                }
            }
        }
    ]
});

export default routes;
