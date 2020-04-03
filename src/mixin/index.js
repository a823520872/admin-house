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
    }
};

export default mixin;
