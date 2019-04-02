import api from '../api';

const mixin = {
    data() {
        return {
            addr: null,
            addrList: null,
            uploadUrl: 'http://house.zhiqiang.ink/api/upload/uploadImage'
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        },
        getArea() {
            api.addr.area().then(res => {
                if (res.data) {
                    this.addrList = {};
                    this.addr = res.data ? getItem(res.data) : [];
                }
            });
        },
        pageChange(e) {
            this.data = [];
            this.$router.push(`${this.$route.path}?p=${e}`);
        }
    }
};
function getItem(list) {
    if (typeof list === 'object') {
        if (Array.isArray(list)) {
            return list.map(item => {
                return getItem(item);
            });
        } else {
            if (list.children && list.children.length) {
                list.children = list.children.map(item => {
                    return getItem(item);
                });
                return {
                    value: list.id,
                    label: list.name,
                    children: list.children
                };
            } else {
                return {
                    value: list.id,
                    label: list.name
                };
            }
        }
    }
}
export default mixin;
