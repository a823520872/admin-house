<template>
    <div>
        <div class="search el-row--flex is-justify-space-between">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="params.name" placeholder="房东姓名"></el-input>
                </el-form-item>
                <el-form-item v-if="addr">
                    <el-cascader placeholder="房源区域" expand-trigger="hover" separator=" " :options="addr" v-model="selectedOptions" @change="handleChange"></el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="params.status" placeholder="状态">
                        <el-option label="上架" :value="1"></el-option>
                        <el-option label="下架" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="timerange" @change="timePicker" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="params.is_rented" placeholder="租房状态">
                        <el-option label="已租" :value="1"></el-option>
                        <el-option label="未租" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <el-table :data="data" stripe>
                <el-table-column prop="id" label="序号" width="50"></el-table-column>
                <el-table-column prop="nickname" label="房东" width="80"></el-table-column>
                <el-table-column prop="contact_mobile" label="手机号" width="120"></el-table-column>
                <el-table-column prop="house_type" label="房型" width="120"></el-table-column>
                <el-table-column prop="rental" label="租金" width="80"></el-table-column>
                <el-table-column label="房源区域" width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.address_street}}</span>
                        <!-- <span>{{scope.row.address_flag}}</span>
                        <span>{{scope.row.address_detail}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column prop="address_detail" label="具体位置"></el-table-column>
                <el-table-column prop="create_t" label="发布时间" width="80"></el-table-column>
                <el-table-column prop="real_number" label="真实阅读量" width="80"></el-table-column>
                <el-table-column prop="getphone_number" label="获取联系方式" width="120"></el-table-column>
                <el-table-column label="租房状态" width="120">
                    <template slot-scope="scope">
                        <span>{{ getRentStatus(scope.row.rent_type) }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="280">
                    <template slot-scope="scope">
                        <!-- <el-button size="small" type="warning" @click="handleCheck(scope.row)">审核</el-button> -->
                        <el-button size="small" v-link="`/house/${scope.row.id}`">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDel(scope.row)">删除</el-button>
                        <el-button size="small" type="primary" @click="handleProd(scope.row)">生成二维码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="pageChange" :page-size="pageParams.pageSize" :total="pageParams.count" :current-page.sync="pageParams.page"></el-pagination>
            </div>
        </div>
        <el-dialog title="海报" :visible.sync="qr" width="480px">
            <div>
                <img :src="qr" alt="" width="100%">
            </div>
            <div class="dialog-footer" slot="footer">
                <el-button @click="qr = false">取 消</el-button>
                <el-button type="primary" @click="download">下 载</el-button>
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
                name: '',
                status: ''
            },
            pageParams: {
                page: 1,
                pageSize: 10,
                count: 0
            },
            data: null,
            qr: false
        };
    },
    watch: {
        $route() {
            this.getData();
        }
    },
    mounted() {
        this.$nextTick(this.getData);
    },
    methods: {
        getData() {
            if (this.$route.query && this.$route.query.p) {
                this.pageParams.page = +this.$route.query.p;
            }
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
            this.getArea();
        },
        handleSubmit() {
            this.getData(1);
        },
        handleCheck(item) {
            console.log(item);
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
        handleEdit(item) {
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
            this.params.indate_begin = dayjs(e[0].$d).format('YYYY-MM-DD');
            this.params.indate_end = dayjs(e[1].$d).format('YYYY-MM-DD');
        },
        getRentStatus(i) {
            switch (i) {
                case 1:
                    return '平台租';
                case 2:
                    return '自己租';
                default:
                    return '未租';
            }
        },
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
        }
    }
};
</script>
