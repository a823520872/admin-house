<template>
    <!-- default-active="1" -->
    <el-menu mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :default-active="menu" :router="true">
        <el-menu-item v-for="li in menuList" :key="li.path" :index="li.path">
            <i class="el-icon-menu"></i>{{li.name}}
        </el-menu-item>
    </el-menu>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState(['menu']),
        active() {}
    },
    data() {
        return {
            menuList: [
                {
                    path: '/landlord',
                    name: '房东管理'
                },
                {
                    path: '/house',
                    name: '房源管理'
                },
                {
                    path: '/statistics',
                    name: '数据统计'
                }
            ]
        };
    }
};
</script>

<style lang="less">
</style>
