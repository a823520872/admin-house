<template>
    <div class="action-box">
        <page-header></page-header>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="房源数量" prop="house_num">
                <el-input v-model.number="form.house_num"></el-input>
            </el-form-item>
            <el-form-item label="房源位置" v-if="addr" prop="postion_street">
                <el-cascader expand-trigger="hover" separator=" " :options="addr" v-model="selectedOptions" @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="推荐人" prop="referrer_user_mobile">
                <el-input v-model="form.referrer_user_mobile"></el-input>
            </el-form-item>
            <el-form-item label="审核" prop="is_audit">
                <el-radio-group v-model="form.is_audit">
                    <el-radio :label="1">开通</el-radio>
                    <el-radio :label="2">停止</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="认证房东" prop="is_auth">
                <el-radio-group v-model="form.is_auth">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="本次支付" prop="last_pay_amount">
                <el-input v-model.number="form.last_pay_amount" placeholder="支付金额"></el-input>
            </el-form-item>
            <el-form-item label="本次服务时间" prop="indate_end">
                <el-date-picker
                    v-model="timerange"
                    @change="timePicker"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
                <el-input v-model="form.remarks" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button v-back>返回</el-button>
                <el-button type="primary" @click="submitForm('form')" :loading="loading">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import dayjs from 'dayjs';
import PageHeader from '../../components/PageHeader';
export default {
    computed: {
        ...mapState(['loading', 'addr'])
    },
    components: {
        PageHeader
    },
    data() {
        return {
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const start = dayjs();
                            const end = dayjs().add(1, 'months');
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const start = dayjs();
                            const end = dayjs().add(3, 'months');
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近半年',
                        onClick(picker) {
                            const start = dayjs();
                            const end = dayjs().add(6, 'months');
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一年',
                        onClick(picker) {
                            const start = dayjs();
                            const end = dayjs().add(1, 'years');
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            rules: {
                name: [{ required: true, message: '请输入房东姓名', trigger: 'blur' }],
                mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
                house_num: [{ required: true, message: '请输入房源数量', trigger: 'blur' }],
                postion_street: [{ required: true, message: '请选择房源地址', trigger: 'change' }],
                indate_end: [{ required: true, message: '请选择到期时间', trigger: 'change' }],
                is_audit: [{ required: true, message: '请选择审核状态', trigger: 'change' }],
                is_auth: [{ required: true, message: '请选择认证房东状态', trigger: 'change' }],
                last_pay_amount: [{ required: true, message: '请选择本次支付金额', trigger: 'blur' }],
                indate_end: [{ required: true, message: '请选择本次服务时间', trigger: 'change' }]
            },
            form: {
                name: '',
                mobile: '',
                house_num: '',
                position_province_id: '',
                position_province: '',
                position_city_id: '',
                // position_city: '',
                postion_district_id: '',
                // postion_district: '',
                postion_street_id: '',
                // postion_street: '',
                indate_begin: '',
                indate_end: '',
                referrer_user_mobile: '',
                is_audit: 1,
                is_auth: 1,
                last_pay_amount: '',
                remarks: ''
            },
            id: '',
            selectedOptions: [],
            timerange: []
        };
    },
    mounted() {
        if (this.$route.params.id) {
            this.id = this.$route.params.id;
            this.$nextTick(this.getData);
        }
        this.getArea();
    },
    methods: {
        ...mapActions(['getArea']),
        getData() {
            this.$request.landlord
                .detail({
                    id: this.id
                })
                .then(res => {
                    if (res.data) {
                        let { indate_begin, indate_end, position_city_id, postion_district_id, postion_street_id } = res.data || {};
                        Object.keys(this.form).map(key => {
                            this.form[key] = res.data[key];
                        });
                        if (indate_begin && indate_end) {
                            this.timerange = [indate_begin, indate_end];
                        }
                        this.selectedOptions = [position_city_id, postion_district_id, postion_street_id];
                    }
                });
        },
        handleChange(e) {
            this.form.position_province_id = 1964;
            this.form.position_city_id = e[0];
            this.form.postion_district_id = e[1];
            this.form.postion_street_id = e[2];
        },
        submitForm(name) {
            this.$refs[name].validate(valid => {
                if (!valid) return;
                let url = this.id ? 'edit' : 'add';
                const data = this.id ? { ...this.form, id: this.id } : { ...this.form };
                this.$request.landlord[url](data).then(res => {
                    this.$message({ showClose: true, message: '操作成功', type: 'success', duration: 5000 });
                    this.back();
                });
            });
        },
        timePicker(e) {
            if (e) {
                this.form.indate_begin = dayjs(e[0]).format('YYYY-MM-DD');
                this.form.indate_end = dayjs(e[1]).format('YYYY-MM-DD');
            } else {
                this.form.indate_begin = '';
                this.form.indate_end = '';
            }
        }
    }
};
</script>
