<template>
    <div>
        <div class="search el-row--flex is-justify-space-between">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="params.landlord_name" placeholder="房东姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="params.landlord_nickname" placeholder="房东昵称"></el-input>
                </el-form-item>
                <!-- <el-form-item>
                    <el-input v-model="params.landlord_mobile" placeholder="房东电话"></el-input>
                </el-form-item> -->
                <!-- <el-form-item v-if="addr">
                    <el-cascader
                        placeholder="所属村"
                        expand-trigger="hover"
                        separator=" "
                        :options="addr"
                        v-model="selectedOptions"
                        @change="handleChange"
                    ></el-cascader>
                </el-form-item> -->
                <el-form-item>
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
                <el-form-item>
                    <el-select v-model="params.rent_status" placeholder="租房状态">
                        <!-- <el-option label="全部" value=""></el-option> -->
                        <el-option label="未租" value="未租"></el-option>
                        <el-option label="已租" value="已租"></el-option>
                        <el-option label="平台租" value="平台租"></el-option>
                        <el-option label="平台下架" value="平台下架"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="params.is_public" placeholder="房源状态">
                        <!-- <el-option label="全部" value=""></el-option> -->
                        <el-option label="已经发布" :value="1"></el-option>
                        <el-option label="未发布" :value="2"></el-option>
                        <el-option label="前端删除" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">搜索</el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" @click="updateRentStatus()">修改租房状态</el-button>
            </div>
        </div>
        <div class="table">
            <el-table :data="data" stripe v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="30"></el-table-column>
                <el-table-column prop="id" label="序号" width="60"></el-table-column>
                <el-table-column prop="landlord_name" label="房东姓名" width="80"></el-table-column>
                <el-table-column prop="nickname" label="房东昵称" width="80"></el-table-column>
                <el-table-column prop="contact_mobile" label="手机号" width="120"></el-table-column>
                <el-table-column prop="house_type" label="房型" width="120"></el-table-column>
                <el-table-column prop="rental" label="租金" width="80"></el-table-column>
                <el-table-column label="所属村" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.address_street }}</span>
                        <!-- <span>{{scope.row.address_flag}}</span>
                        <span>{{scope.row.address_detail}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column prop="address_detail" label="具体位置" min-width="80"></el-table-column>
                <el-table-column prop="create_t" label="发布时间" width="110"></el-table-column>
                <el-table-column prop="real_number" label="真实阅读量" width="80"></el-table-column>
                <el-table-column prop="getphone_number" label="获取联系方式" width="120"></el-table-column>
                <el-table-column prop="refresh_number" label="刷新次数" width="80"></el-table-column>
                <el-table-column label="房源状态" width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.is_public | getPublishStatus }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="rent_status" label="租房状态" width="80"></el-table-column>
                <el-table-column label="操作" width="250">
                    <template slot-scope="scope">
                        <!-- <el-button size="small" type="warning" @click="handleCheck(scope.row)">审核</el-button> -->
                        <!-- v-link="`/house/${scope.row.id}`" -->
                        <el-button size="small" @click="handleLink(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="updateRentStatus(scope.row)">租房状态</el-button>
                        <!-- <el-button size="small" type="danger" @click="handleDel(scope.row)">删除</el-button>
                        <el-button size="small" type="primary" @click="handleProd(scope.row)">生成二维码</el-button> -->
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
        <dialog-qr :qr="qr" title="海报" @close="qr = false"></dialog-qr>
        <el-dialog title="租房状态" :visible.sync="dialogRentVisible" v-if="form.ids">
            <el-form :model="form" :rules="ruleForm" ref="form" label-width="80px">
                <el-radio-group v-model="form.rent_status" prop="rent_status">
                    <el-radio label="未租">未租</el-radio>
                    <el-radio label="平台租">平台租</el-radio>
                    <el-radio label="自己租">自己租</el-radio>
                    <el-radio label="平台下架">平台下架</el-radio>
                </el-radio-group>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="dialogRentVisible = false">取 消</el-button>
                <el-button type="primary" @click="edit" :loading="loading">确 定</el-button>
            </div>
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
        return {
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = dayjs();
                            const start = dayjs().subtract(7, 'days');
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = dayjs();
                            const start = dayjs().subtract(1, 'months');
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = dayjs();
                            const start = dayjs().subtract(3, 'months');
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            selectedOptions: [],
            timerange: [],
            params: {
                landlord_name: '',
                landlord_nickname: '',
                landlord_mobile: '',
                postion_street_id: '',
                // name: '',
                is_public: '',
                rent_status: ''
            },
            pageParams: {
                page: 1,
                pageSize: 10,
                count: 0
            },
            data: null,
            qr: false,
            selection: [],
            dialogRentVisible: false,
            form: {
                ids: '',
                rent_status: '平台下架'
            },
            ruleForm: {
                ids: [{ required: true, message: '请选择房源', trigger: 'blur' }],
                rent_status: [{ required: true, message: '请选择租房状态', trigger: 'change' }]
            }
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
            this.$request.house
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
        },
        handleSubmit() {
            this.pageParams.page = 1;
            this.getData();
        },
        pageChange(e) {
            this.pageParams.page = e;
            this.getData();
        },
        handleCheck() {
            this.$confirm('确认审核通过该条信息？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });
            });
        },
        handleLink(item) {
            this.$router.push(`/house/${item.id}`);
        },
        handleDel(item) {
            this.$confirm('确认删除该条信息？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$request.house
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
        handleChange(e) {
            this.params.postion_street_id = e[2];
        },
        timePicker(e) {
            if (e) {
                this.params.indate_begin = dayjs(e[0]).format('YYYY-MM-DD');
                this.params.indate_end = dayjs(e[1]).format('YYYY-MM-DD');
            } else {
                this.params.indate_begin = '';
                this.params.indate_end = '';
            }
        },
        // getRentedStatus(i) {
        //     const mapping = {
        //         '1': '已租',
        //         '2': '未租'
        //     };
        //     return mapping[i] || '未租';
        // },
        // getRentStatus(i) {
        //     const mapping = {
        //         '1': '平台租',
        //         '2': '自己租'
        //     };
        //     return mapping[i] || '未租';
        // },
        handleProd(item) {
            this.$request.house
                .getQRCode({
                    house_id: item.id
                })
                .then(res => {
                    if (res && res.data) {
                        this.qr = res.data;
                    }
                });
        },
        download() {
            window.open(this.qr);
            // alert('暂不支持下载');
        },
        handleSelectionChange(list) {
            this.selection = list.map(v => v.id);
        },
        updateRentStatus(item) {
            if (item) {
                this.form.ids = item.id + '';
            } else {
                this.form.ids = this.selection.join('');
            }
            this.form.rent_status = '平台下架';
            if (!this.form.ids) {
                return this.$message({
                    type: 'warning',
                    message: '请选择房源'
                });
            }
            this.dialogRentVisible = true;
        },
        edit() {
            this.$refs.form.validate(valid => {
                if (!valid) return;
                this.$request.house.updateRentStatus({ ...this.form }).then(res => {
                    this.dialogRentVisible = false;
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getData();
                });
            });
        }
    },
    filters: {
        getPublishStatus(v) {
            const mapping = {
                1: '发布中',
                2: '未发布',
                3: '已删除'
            };
            return mapping[v] || '/';
        }
    }
};
</script>
