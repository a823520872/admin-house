<template>
    <!-- default-active="1" -->
    <el-menu mode="vertical" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :default-active="menu" :router="true">
        <el-menu-item index="/landlord">
            <i class="el-icon-menu"></i>房东管理
        </el-menu-item>
        <el-menu-item index="/house">
            <i class="el-icon-menu"></i>房源管理
        </el-menu-item>
    </el-menu>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState(['menu'])
    }
};
</script>

<style lang="less">
</style>
