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
        <div class="table">
            <el-table :data="data" stripe>
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="name" label="姓名" width="80"></el-table-column>
                <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
                <el-table-column prop="name" label="推荐人" width="120"></el-table-column>
                <el-table-column prop="name" label="房源数量" width="80"></el-table-column>
                <el-table-column prop="name" label="发布数量" width="80"></el-table-column>
                <el-table-column prop="name" label="房源位置"></el-table-column>
                <el-table-column prop="name" label="状态" width="80"></el-table-column>
                <el-table-column prop="name" label="状态" width="80"></el-table-column>
                <el-table-column prop="name" label="申请时间" width="120"></el-table-column>
                <el-table-column width="240">
                    <template slot-scope="scope">
                        <el-button size="small" type="warning" @click="handleCheck(scope.row)">审核</el-button>
                        <el-button size="small" v-link="`/landlord/${scope.row.id}`">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDel(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
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
            data: [
                {
                    name: '江建华',
                    phone: '13123456789'
                },
                {
                    name: '娇娇',
                    phone: '13123456789'
                },
                {
                    name: '依然',
                    phone: '13123456789'
                }
            ]
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
                    pageSize: this.pageParams.pageSize,
                    ...this.form
                })
                .then(() => {});
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

<style></style>
