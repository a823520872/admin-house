<template>
    <div class="page_header">
        <el-page-header @back="goBack" :content="title"></el-page-header>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    computed: {
        title() {
            return this.$route.meta._title;
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="less">
.page_header {
    padding-bottom: 20px;
}
</style>
