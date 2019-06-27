import qs from 'querystring';
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
            api.addr.area({}).then(res => {
                if (res.data) {
                    const list = res.data;
                    this.addrList = {};
                    const addr = list.reduce((obj, item) => {
                        if (!item.pid) return obj;
                        this.addrList[item.id] = item;
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
                                        label: l.name
                                    }));
                                }
                                return {
                                    value: li.id,
                                    label: li.name,
                                    children: li.children
                                };
                            });
                            item.children = children;
                        }
                        return {
                            value: item.id,
                            label: item.name,
                            children: item.children
                        };
                    });
                    this.addr = area;
                }
            });
        },
        pageChange(e) {
            const query = {
                ...this.$route.query,
                p: e
            };
            this.data = [];
            this.$router.push(`${this.$route.path}?${qs.stringify(query)}`);
        }
    }
};

function filterCity(item) {
    return item.level === 2;
}

export default mixin;
