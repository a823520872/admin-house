<template>
    <div>
        <div class="search el-row--flex is-justify-space-between">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="form.name" placeholder="房东姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form.name" placeholder="推荐人"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form.name" placeholder="房源位置"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="form.status" placeholder="状态">
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
                <el-table-column prop="status" label="状态" width="80"></el-table-column>
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
    </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
    data() {
        return {
            form: {
                name: '',
                status: ''
            },
            pageParams: {
                page: 1,
                pageSize: 20,
                count: 0
            },
            data: null
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
                    ...this.form
                })
                .then(res => {
                    const { data: { count, data, page } } = res
                    this.pageParams.page = +page
                    this.pageParams.count = +count
                    this.data = data.map(item => {
                        item.create_t = dayjs(new Date(item.createtime * 1000)).format('YYYY-MM-DD HH:mm:ss');
                        return item
                    })
                });
        },
        handleSubmit() {
            this.pageParams.page = 1;
            this.data = [];
            this.getData();
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
        handleDel(item) {
            console.log(item);
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
