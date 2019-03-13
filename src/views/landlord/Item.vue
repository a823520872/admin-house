<template>
    <div class="action-box">
        <el-form ref="form" :rules="rules" label-width="80px">
            <el-form-item label="姓名">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="房源数量">
                <el-input v-model.number="form.num"></el-input>
            </el-form-item>
            <el-form-item label="房源位置">
                <el-cascader expand-trigger="hover" :options="options" v-model="selectedOptions2" @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="到期时间">
                <el-date-picker type="date" v-model="form.timeline"></el-date-picker>
            </el-form-item>
            <el-form-item label="推荐人">
                <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="推荐人">
                <el-input v-model="form.recommender"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="back">返回</el-button>
                <el-button type="primary" @click="submitForm('form')">开通</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            rules: {
                name: [{ required: true, message: '请输入房东姓名', trigger: 'blur' }],
                mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
                num: [{ required: true, message: '请输入房源数量', trigger: 'blur' }],
                address: [{ required: true, message: '请选择房源地址', trigger: 'change' }],
                timeline: [{ required: true, message: '请选择到期时间', trigger: 'change' }],
                mode: [{ required: true, message: '请选择入驻模式', trigger: 'change' }]
            },
            form: {
                name: '',
                mobile: '',
                num: '',
                address: '',
                recommender: '',
                timeline: '',
                mode: ''
            }
        };
    },
    mounted() {
        if (this.$route.params.id) {
            this.form.id = this.$route.params.id;
            this.$nextTick(this.getData);
        }
    },
    methods: {
        getData() { },
        back() {
            this.$router.go(-1);
        },
        submitForm(name) {
            this.$refs[name].validate(valid => {
                if (!valid) return;
                this.$message({ showClose: true, message: '操作成功', type: 'success', duration: 5000 });
                this.back();
            });
        }
    }
};
</script>
