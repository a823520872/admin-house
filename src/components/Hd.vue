<template>
    <el-header>
        <el-button type="text" class="btn_logout" @click.native="logout">退出登录</el-button>
    </el-header>
</template>

<script>
export default {
    methods: {
        logout() {
            localStorage.clear();
            this.$router.replace('/login');
        }
    }
};
</script>

<style lang="less" scoped>
.el-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .btn_logout {
        display: block;
        font-size: 12px;
        color: #1989fa;
        text-decoration: none;
    }
}
</style>
