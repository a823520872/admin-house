<template>
             <!-- default-active="1" -->
    <el-menu mode="vertical"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b">
        <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <router-link slot="title"
                         to="/landlord">房东管理</router-link>
        </el-menu-item>
        <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <router-link slot="title"
                         to="/house">房源管理</router-link>
        </el-menu-item>
    </el-menu>
</template>

<script>
    export default {

    }
</script>

<style lang="less">
</style>
