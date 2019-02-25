import ajax from '../utils/ajax.js';

export default {
    landlord: {
        list(params) {
            return ajax('/landlord/list', params, { type: 'get' });
        },
        add(params) {
            return ajax('/landlord/add', params, { type: 'post' });
        },
        edit(params) {
            return ajax('/landlord/edit', params, { type: 'post' });
        },
        del(params) {
            return ajax('/landlord/del', params, { type: 'post' });
        }
    },
    house: {
        list(params) {
            return ajax('/house/list', params, { type: 'get' });
        },
        add(params) {
            return ajax('/house/add', params, { type: 'post' });
        },
        edit(params) {
            return ajax('/house/edit', params, { type: 'post' });
        },
        del(params) {
            return ajax('/house/del', params, { type: 'post' });
        }
    }
};
