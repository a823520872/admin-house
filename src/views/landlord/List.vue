<template>
    <div>
        <div class="search el-row--flex is-justify-space-between">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="params.name" placeholder="房东姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="params.mobile" placeholder="房东手机号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="params.landlord_nickname" placeholder="房东昵称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="params.referrer_user_mobile" placeholder="推荐人手机号"></el-input>
                </el-form-item>
                <el-form-item v-if="addr">
                    <el-cascader placeholder="房源位置" expand-trigger="hover" separator=" " :options="addr" v-model="selectedOptions" @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="params.status" placeholder="状态">
                        <el-option label="未开通" :value="1"></el-option>
                        <el-option label="已开通" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">搜索</el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" v-link="`/landlord/add`">添加房东</el-button>
            </div>
        </div>
        <div class="table" v-if="data">
            <el-table :data="data" stripe>
                <el-table-column prop="id" label="序号" width="50"></el-table-column>
                <el-table-column prop="name" label="姓名" width="80"></el-table-column>
                <el-table-column prop="nickname" label="昵称" width="80"></el-table-column>
                <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
                <el-table-column prop="referrer_user_mobile" label="推荐人" width="120"></el-table-column>
                <el-table-column prop="house_num" label="房源数量" width="80"></el-table-column>
                <el-table-column prop="public_num" label="发布数量" width="80"></el-table-column>
                <el-table-column prop="getphone_number" label="获取联系方式数量" width="80"></el-table-column>
                <el-table-column label="房源位置">
                    <template slot-scope="scope">
                        <!-- <span>{{scope.row.position_province}}</span> -->
                        <span>{{scope.row.position_city}}</span>
                        <span>{{scope.row.postion_district}}</span>
                        <span>{{scope.row.postion_street}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status_remain_days" label="状态" width="80"></el-table-column>
                <el-table-column prop="open_number" label="开通总时长" width="80"></el-table-column>
                <el-table-column prop="remarks" label="备注" width="80"></el-table-column>
                <el-table-column prop="create_t" label="申请时间" width="120"></el-table-column>
                <el-table-column width="320">
                    <template slot-scope="scope">
                        <el-button size="small" type="warning" @click="handleCheck(scope.row)">审核</el-button>
                        <el-button size="small" @click="handleLink(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDel(scope.row)">删除</el-button>
                        <el-button size="small" type="primary" @click="handleProd(scope.row)">生成二维码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="pageChange" :page-size="pageParams.pageSize" :total="pageParams.count" :current-page.sync="pageParams.page"></el-pagination>
            </div>
        </div>
        <el-dialog title="审核" :visible.sync="dialogCheckVisible" width="480px">
            <el-form :model="form" :rule="ruleForm" ref="form" label-width="80px">
                <el-form-item label="审核">
                    <el-radio-group v-model="form.is_audit">
                        <el-radio :label="1">开通</el-radio>
                        <el-radio :label="2">停止</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="生效时间" prop="indate_begin">
                    <el-date-picker v-model="timerange" @change="timePicker" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="form.remarks" type="textarea" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="cancelCheck('form')">取 消</el-button>
                <el-button type="primary" @click="check('form')" :loading="loading">确 定</el-button>
            </div>
        </el-dialog>
        <dialog-qr :qr="qr" title="二维码"></dialog-qr>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import dayjs from 'dayjs';
import qs from 'querystring';
import dialogQr from '../../components/DialogQR';
export default {
    computed: {
        ...mapState(['loading'])
    },
    components: {
        dialogQr
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
            selectedOptions: [],
            params: {
                name: '',
                postion_street_id: '',
                referrer_user_mobile: '',
                status: ''
            },
            pageParams: {
                page: 1,
                pageSize: 10,
                count: 0
            },
            data: null,
            dialogCheckVisible: false,
            ruleForm: {},
            form: {
                id: '',
                indate_begin: '',
                indate_end: '',
                is_audit: 1,
                remarks: ''
            },
            timerange: [],
            qr: false
        };
    },
    watch: {
        $route() {
            const query = this.$route.query;
            for (const key in query) {
                if (query.hasOwnProperty(key)) {
                    const element = query[key];
                    if (element) {
                        if (key === 'p' && +element) {
                            this.pageParams.page = +element;
                        } else {
                            this.params[key] = decodeURIComponent(element);
                        }
                    }
                }
            }
            this.getData();
        }
    },
    mounted() {
        this.$nextTick(this.getData);
    },
    methods: {
        getData() {
            this.$request.landlord
                .list({
                    page: this.pageParams.page,
                    page_size: this.pageParams.pageSize,
                    ...this.params
                })
                .then(res => {
                    const {
                        data: { count, data, page }
                    } = res;
                    this.pageParams.page = +page;
                    this.pageParams.count = +count;
                    this.data = data.map(item => {
                        item.create_t = dayjs(new Date(item.createtime * 1000)).format('YYYY-MM-DD HH:mm:ss');
                        return item;
                    });
                });
            this.addr || this.getArea();
        },
        handleSubmit() {
            this.data = [];
            const params = {
                p: 1
            };
            for (let [k, v] of Object.entries(this.params)) {
                if (v) {
                    params[k] = encodeURIComponent(v);
                }
            }
            this.$router.push(`${this.$route.path}?p=1&${qs.stringify(params)}`);
        },
        handleCheck(item) {
            this.form = {
                id: item.id,
                indate_begin: '',
                indate_end: '',
                is_audit: 1,
                remarks: ''
            };
            this.dialogCheckVisible = true;
        },
        cancelCheck(name) {
            this.dialogCheckVisible = false;
            this.form = {
                id: '',
                indate_begin: '',
                indate_end: '',
                is_audit: 1,
                remarks: ''
            };
        },
        check(name) {
            this.$refs[name].validate(valid => {
                if (!valid) return;
                const data = { ...this.form };
                this.$request.landlord.check(data).then(res => {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.cancelCheck(name);
                    this.data = [];
                    this.getData();
                });
            });
        },
        handleChange(e) {
            this.params.postion_street_id = e[2];
        },
        timePicker(e) {
            this.form.indate_begin = dayjs(this.timerange[0]).format('YYYY-MM-DD HH:mm:ss');
            this.form.indate_end = dayjs(this.timerange[1]).format('YYYY-MM-DD HH:mm:ss');
        },
        handleLink(item) {
            this.$router.push(`/landlord/${item.id}`);
        },
        handleDel(item) {
            this.$confirm('确认删除该条信息？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$request.landlord
                    .del({
                        id: item.id
                    })
                    .then(() => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                    });
            });
        },
        handleProd(item) {
            this.$request.landlord
                .getQRCode({
                    user_id: item.user_id
                })
                .then(res => {
                    if (res && res.data) {
                        this.qr = res.data;
                    }
                });
        }
    }
};
</script>
