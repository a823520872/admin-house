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
                    <el-cascader
                        placeholder="所属村"
                        expand-trigger="hover"
                        separator=" "
                        :options="addr"
                        v-model="selectedOptions"
                        @change="handleChange"
                    ></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="params.opening_status" placeholder="状态">
                        <!-- <el-option label="全部" value=""></el-option> -->
                        <el-option label="未开通" value="未开通"></el-option>
                        <el-option label="服务中" value="服务中"></el-option>
                        <el-option label="服务结束" value="服务结束"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="params.is_auth" placeholder="是否认证房东">
                        <!-- <el-option label="全部" value=""></el-option> -->
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="2"></el-option>
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
            <el-table :data="data" stripe v-loading="loading">
                <el-table-column prop="id" label="序号" width="50"></el-table-column>
                <el-table-column prop="name" label="姓名" width="80"></el-table-column>
                <el-table-column prop="nickname" label="昵称" width="80"></el-table-column>
                <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
                <el-table-column prop="referrer_user_mobile" label="推荐人" width="120"></el-table-column>
                <el-table-column prop="house_num" label="房源数量" width="80"></el-table-column>
                <el-table-column prop="public_num" label="发布数量" width="80"></el-table-column>
                <el-table-column prop="getphone_number" label="获取联系方式数量" width="80"></el-table-column>
                <el-table-column label="所属村">
                    <template slot-scope="scope">
                        <!-- <span>{{scope.row.position_province}}</span> -->
                        <span>{{ scope.row.position_city }}</span>
                        <span>{{ scope.row.postion_district }}</span>
                        <span>{{ scope.row.postion_street }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status_remain_days" label="状态" width="80"></el-table-column>
                <el-table-column prop="is_auth" label="认证房东" width="80">
                    <template slot-scope="scope">
                        {{ scope.row.is_auth === 1 ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column prop="indate_end" label="服务结束时间" width="110"></el-table-column>
                <el-table-column prop="last_opentime" label="上次开通时间" width="110"></el-table-column>
                <el-table-column prop="remarks" label="备注" width="80"></el-table-column>
                <el-table-column label="申请时间" width="110">
                    <template slot-scope="scope">
                        {{ scope.row.createtime | timeFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="400">
                    <template slot-scope="scope">
                        <el-button size="small" type="warning" @click="handleCheck(scope.row)">审核</el-button>
                        <el-button size="small" @click="handleLink(scope.row)">编辑</el-button>
                        <el-button size="small" type="warning" @click="handleOpen(scope.row)">开通记录</el-button>
                        <el-button size="small" type="danger" @click="handleDel(scope.row)">删除</el-button>
                        <el-button size="small" type="primary" @click="handleProd(scope.row)">生成二维码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @current-change="pageChange"
                    :page-size="pageParams.pageSize"
                    :total="pageParams.count"
                    :current-page.sync="pageParams.page"
                ></el-pagination>
            </div>
        </div>
        <el-dialog title="审核" :visible.sync="dialogCheckVisible" width="480px" v-if="form">
            <el-form :model="form" :rules="ruleForm" ref="form" label-width="80px">
                <el-form-item label="审核">
                    <el-radio-group v-model="form.is_audit">
                        <el-radio :label="1">开通</el-radio>
                        <el-radio :label="2">停止</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="认证房东">
                    <el-radio-group v-model="form.is_auth">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="本次支付" prop="pay_amount">
                    <el-input v-model.number="form.pay_amount" placeholder="支付金额"></el-input>
                </el-form-item>
                <el-form-item label="服务时间" prop="indate_begin">
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
                        :default-time="['00:00:00', '23:59:59']"
                    ></el-date-picker>
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
        <dialog-qr :qr="qr" title="二维码" @close="qr = false"></dialog-qr>
        <el-dialog title="开通记录" :visible.sync="dialogOpenVisible" v-if="openList" width="610px">
            <el-table :data="openList" stripe>
                <el-table-column prop="id" label="序号" width="50"></el-table-column>
                <el-table-column prop="indate_begin" label="开通时间" width="110"></el-table-column>
                <el-table-column prop="indate_end" label="结束时间" width="110"></el-table-column>
                <el-table-column prop="days" label="开通时长" width="110"></el-table-column>
                <el-table-column prop="pay_amount" label="支付金额" width="80"></el-table-column>
                <el-table-column prop="audit_time" label="审核时间" width="110"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import dayjs from 'dayjs';
import dialogQr from '../../components/DialogQR';
export default {
    computed: {
        ...mapState(['loading', 'addr'])
    },
    components: {
        dialogQr
    },
    data() {
        const start = dayjs();
        return {
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = start.add(1, 'months');
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = start.add(3, 'months');
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近半年',
                        onClick(picker) {
                            const end = start.add(6, 'months');
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一年',
                        onClick(picker) {
                            const end = start.add(1, 'years');
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
                opening_status: '',
                is_auth: ''
            },
            pageParams: {
                page: 1,
                pageSize: 10,
                count: 0
            },
            data: null,
            dialogCheckVisible: false,
            ruleForm: {},
            form: null,
            timerange: [],
            qr: false,
            openPageParams: {
                page: 1,
                pageSize: 10,
                count: 0
            },
            openList: null,
            dialogOpenVisible: false
        };
    },
    // watch: {
    //     $route() {
    //         this.$nextTick(this.getData);
    //     }
    // },
    activated() {
        this.getArea();
        this.$nextTick(this.getData);
    },
    methods: {
        ...mapActions(['getArea']),
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
                    this.data = data
                });
        },
        handleSubmit() {
            this.pageParams.page = 1;
            this.getData();
        },
        pageChange(e) {
            this.pageParams.page = e;
            this.getData();
        },
        handleCheck(item) {
            this.form = {
                id: item.id,
                indate_begin: item.indate_begin,
                indate_end: item.indate_end,
                pay_amount: item.pay_amount || '',
                is_audit: 1,
                is_auth: 1,
                remarks: item.remarks
            };
            this.timerange = [item.indate_begin, item.indate_end];
            this.dialogCheckVisible = true;
        },
        cancelCheck() {
            this.dialogCheckVisible = false;
            this.form = {
                id: '',
                indate_begin: '',
                indate_end: '',
                is_audit: 1,
                is_auth: 1,
                remarks: ''
            };
        },
        check(name) {
            this.$refs[name].validate(valid => {
                if (!valid) return;
                const data = { ...this.form };
                this.$request.landlord.check(data).then(() => {
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.cancelCheck(name);
                    this.getData();
                });
            });
        },
        handleOpen(item) {
            this.$request.landlord.getOpenList({ landlord_id: item.id }).then(res => {
                const {
                    data: { count, data, page }
                } = res;
                this.openPageParams.page = +page;
                this.openPageParams.count = +count;
                this.openList = data.map(item => {
                    item.create_t = dayjs(new Date(item.createtime * 1000)).format('YYYY-MM-DD HH:mm:ss');
                    return item;
                });
                this.dialogOpenVisible = true;
            });
        },
        handleChange(e) {
            this.params.postion_street_id = e[2];
        },
        timePicker(e) {
            if (e) {
                this.form.indate_begin = dayjs(this.timerange[0]).format('YYYY-MM-DD HH:mm:ss');
                this.form.indate_end = dayjs(this.timerange[1]).format('YYYY-MM-DD HH:mm:ss');
            } else {
                this.form.indate_begin = '';
                this.form.indate_end = '';
            }
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
                        this.getData();
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
