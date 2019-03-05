<template>
    <el-container class="index">
        <el-aside>
            <aside-menu></aside-menu>
        </el-aside>
        <el-container direction="vertical">
            <top-header></top-header>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import AsideMenu from '../components/Menu.vue';
import TopHeader from '../components/Hd.vue';
export default {
    components: {
        AsideMenu,
        TopHeader
    }
};
</script>

<style lang="less">
.index {
    height: 100%;
    .el-container {
        background-color: #f2f2f2;
    }
    .el-aside {
        padding-top: 60px;
        background-color: #545c64;
    }
    .el-menu {
        border: none;

        a {
            text-decoration: none;
            color: inherit;
        }
    }
    .el-header {
        background-color: #fff;
    }
    .el-main {
        margin: 15px;
        background-color: #fff;
    }
}
</style>
