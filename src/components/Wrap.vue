<template>
    <el-container class="App">
        <el-aside>
            <div class="logo">
                <router-link to="/">村里租房</router-link>
            </div>
            <aside-menu></aside-menu>
        </el-aside>
        <el-container direction="vertical">
            <top-header></top-header>
            <el-main>
                <slot></slot>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import AsideMenu from './Menu.vue';
import TopHeader from './Hd.vue';
export default {
    components: {
        AsideMenu,
        TopHeader
    }
};
</script>

<style lang="less">
.App {
    height: 100%;
    .el-container {
        background-color: #f2f2f2;
    }
    .el-aside {
        // padding-top: 60px;
        background-color: #545c64;
    }
    .logo {
        width: 280px;
        height: 60px;
        padding-left: 20px;
        line-height: 60px;
        // text-align: center;
        font-size: 32px;
        color: #fff;
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