// import ajax from '../utils/fetch.js';

import ajax from '../utils/ajax.js';

export default {
    user: {
        login(params) {
            return ajax('/api/admin/User/login', params, { type: 'post' });
        }
    },
    landlord: {
        list(params) {
            return ajax('/api/admin/landlord/getList', params, { type: 'get' });
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
        },
        check(params) {
            return ajax('/api/admin/landlord/audit', params, { type: 'post' });
        },
        getQRCode(params) {
            return ajax('/api/admin/landlord/getQrcode', params, { type: 'post' });
        }
    },
    house: {
        list(params) {
            return ajax('/api/admin/house_resource/getList', params, { type: 'get' });
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
        },
        getQRCode(params) {
            return ajax('/api/admin/house_resource/getPoster', params, { type: 'post' });
        }
    },
    addr: {
        area(params = {}) {
            return ajax('/api/admin/area/getAllList', params, { type: 'get' });
        },
        flag(params) {
            return ajax('/api/admin/area_flag/getAllList', params, { type: 'get' });
        }
    },
    statistics: {
        list(params = {}) {
            return ajax('/api/admin/statistics/style1', params, { type: 'get' });
        }
    },
    config(params) {
        return ajax('/api/admin/keyvalue/getAllList', params, { type: 'get' });
    },
    upload(params) {
        return ajax('/api/upload/uploadImage', params, { type: 'post', upload: true });
    }
};
