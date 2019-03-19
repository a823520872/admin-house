import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loading: false,
        userinfo: null,
    },
    mutations: {
        setLoading(state, loading) {
            state.loading = loading;
        },
        setUserInfo(state, userinfo) {
            state.userinfo = userinfo
        }
    },
    actions: {}
});
