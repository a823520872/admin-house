<template>
    <div>
        <div class="search el-row--flex is-justify-space-between">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="params.name" placeholder="房东姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="params.name" placeholder="推荐人"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="params.name" placeholder="房源位置"></el-input>
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
                <el-table-column prop="referrer_user_mobile" label="手机号" width="120"></el-table-column>
                <el-table-column prop="name" label="推荐人" width="120"></el-table-column>
                <el-table-column prop="house_num" label="房源数量" width="80"></el-table-column>
                <el-table-column prop="name" label="发布数量" width="80"></el-table-column>
                <el-table-column label="房源位置">
                    <template slot-scope="scope">
                        <span>{{scope.row.position_province}}</span>
                        <span>{{scope.row.position_city}}</span>
                        <span>{{scope.row.postion_district}}</span>
                        <span>{{scope.row.postion_street}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status_remain_days" label="状态" width="80"></el-table-column>
                <el-table-column prop="remarks" label="备注" width="80"></el-table-column>
                <el-table-column prop="create_t" label="申请时间" width="120"></el-table-column>
                <el-table-column width="240">
                    <template slot-scope="scope">
                        <el-button size="small" type="warning" @click="handleCheck(scope.row)">审核</el-button>
                        <el-button size="small" v-link="`/landlord/${scope.row.id}`">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="getData" :page-size="pageParams.pageSize" :total="pageParams.count" :current-page.sync="pageParams.page"></el-pagination>
            </div>
        </div>
        <el-dialog title="审核" :visible.sync="dialogVisible" width="480px">
            <el-form :model="form" :rule="ruleForm" ref="form" label-width="80px">
                <el-form-item label="审核状态">
                    <el-switch v-model="form.is_audit"></el-switch>
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
                <el-button type="primary" @click="check('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
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
            params: {
                name: '',
                status: ''
            },
            pageParams: {
                page: 1,
                pageSize: 10,
                count: 0
            },
            data: null,
            dialogVisible: false,
            ruleForm: {},
            form: {
                id: '',
                indate_begin: '',
                indate_end: '',
                is_audit: false,
                remarks: ''
            },
            timerange: []
        };
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
        },
        handleSubmit() {
            this.pageParams.page = 1;
            this.data = [];
            this.getData();
        },
        handleCheck(item) {
            this.form = {
                id: item.id,
                indate_begin: '',
                indate_end: '',
                is_audit: false,
                remarks: ''
            };
            this.dialogVisible = true;
        },
        cancelCheck(name) {
            this.$refs[name].resetFields();
            this.dialogVisible = false;
        },
        check(name) {
            this.$refs[name].validate(valid => {
                if (!valid) return;
                const data = { ...this.form, is_audit: this.form.is_audit ? 1 : 2 };
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
        timePicker(e) {
            this.form.indate_begin = dayjs(e[0].$d).format('YYYY-MM-DD');
            this.form.indate_end = dayjs(e[1].$d).format('YYYY-MM-DD');
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
        }
    }
};
</script>
