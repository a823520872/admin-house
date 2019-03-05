<template>
    <el-card class="login">
        <div slot="header">后台管理系统</div>
        <el-form :model="form">
            <el-form-item label="用户名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="form.pass" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleClick">登录</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
            form: {
                name: '',
                pass: ''
            }
        };
    },
    methods: {
        handleClick() {
            this.$router.replace('/');
        }
    }
};
</script>

<style lang="less">
.login {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    transform: translate(-50%, -50%);
    background-color: #fff;

    .el-card__header {
        text-align: center;
        font-size: 16px;
        font-weight: 500;
    }
}
</style>
