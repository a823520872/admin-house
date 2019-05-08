<template>
    <el-card class="login">
        <div slot="header">村里租房管理系统</div>
        <el-form :model="form" :rules="rules" ref="loginForm" label-width="80px" @keydown.enter.native="handleClick('loginForm')">
            <el-form-item label="用户名">
                <el-input v-model="form.account"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="btn_login" @click.native="handleClick('loginForm')">登录</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
    data() {
        return {
            form: {
                account: '',
                password: ''
            },
            rules: {
                account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        ...mapMutations(['setUserInfo']),
        handleClick(name) {
            this.$refs[name].validate(valid => {
                if (!valid) return;
                this.$request.user.login(this.form).then(res => {
                    if (res && res.data && res.data.userinfo) {
                        sessionStorage.setItem('tk', res.data.userinfo.token);
                        this.setUserInfo(res.data.userinfo);
                        this.$router.replace('/');
                    }
                });
            });
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
    transform: translate(-50%, -100%);
    background-color: #fff;

    .el-card__header {
        text-align: center;
        font-size: 16px;
        font-weight: 500;
    }
}
</style>
