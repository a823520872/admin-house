
import dayjs from 'dayjs';
const mixin = {
    data() {
        return {
            uploadUrl: 'http://house.zhiqiang.ink/api/upload/uploadImage'
        };
    },
    methods: {
        back() {
            this.$router.go(-1);
        }
    },
    filters: {
        timeFilter(v) {
            return v ? dayjs(new Date(v * 1000)).format('YYYY-MM-DD HH:mm:ss') : '/';
        },
    },
};

export default mixin;
