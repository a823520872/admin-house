import ajax from '../utils/ajax.js';

export default {
    user: {
        login(params) {
            return ajax('/api/admin/User/login', params, { type: 'post' });
        }
    },
    landlord: {
        list(params) {
            return ajax('/api/admin/Landlord/getList', params, { type: 'get' });
        },
        detail(params) {
            return ajax('/api/admin/landlord/getDetail', params, { type: 'get' });
        },
        add(params) {
            return ajax('/api/admin/landlord/add', params, { type: 'post' });
        },
        edit(params) {
            return ajax('/api/admin/landlord/edit', params, { type: 'post' });
        },
        del(params) {
            return ajax('/api/admin/landlord/del', params, { type: 'post' });
        }
    },
    house: {
        list(params) {
            return ajax('/api/admin/House_Resource/getList', params, { type: 'get' });
        },
        detail(params) {
            return ajax('/api/admin/house_resource/getDetail', params, { type: 'get' });
        },
        add(params) {
            return ajax('/api/admin/house_resource/add', params, { type: 'post' });
        },
        edit(params) {
            return ajax('/api/admin/house_resource/edit', params, { type: 'post' });
        },
        del(params) {
            return ajax('/api/admin/house_resource/del', params, { type: 'post' });
        }
    }
};
