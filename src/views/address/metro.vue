<template>
    <div>
        <div class="search el-row--flex is-justify-space-between">
            <el-form :inline="true">
                <el-form-item>
                    <el-select v-model="params.parent_id" placeholder="线路">
                        <!-- <el-option label="全部" value=""></el-option> -->
                        <el-option v-for="li in line" :key="li.id" :label="li.name" :value="li.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="params.status" placeholder="状态">
                        <!-- <el-option label="全部" value=""></el-option> -->
                        <el-option label="显示" value="1"></el-option>
                        <el-option label="隐藏" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">搜索</el-button>
                </el-form-item>
            </el-form>
            <div>
                <!-- <el-button type="primary" @click="addStreet()">添加村</el-button> -->
            </div>
        </div>
        <div class="table">
            <el-table :data="data" stripe v-loading="loading">
                <el-table-column prop="id" label="序号" width="60"></el-table-column>
                <el-table-column label="线路" min-width="80">
                    <template slot-scope="scope">
                        {{ scope.row.remark | lineFilter }}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="name" label="线路" min-width="80"></el-table-column> -->
                <el-table-column prop="name" label="地铁站" min-width="80"></el-table-column>
                <el-table-column prop="num_house_resource" label="房源数量" width="80"></el-table-column>
                <el-table-column prop="status" label="状态" width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1">显示</span>
                        <span class="danger" v-if="scope.row.status === 2">隐藏</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="110">
                    <template slot-scope="scope">
                        {{ scope.row.createtime | timeFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button size="small" :type="scope.row.status === 1 ? 'danger' : 'primary'" @click="handleUpdate(scope.row)">{{scope.row.status === 1 ? '隐藏' : '显示'}}</el-button>
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
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    computed: {
        ...mapState(['loading']),
    },
    data() {
        return {
            params: {
                parent_id: '',
                level: 2,
                status: '',
            },
            pageParams: {
                page: 1,
                pageSize: 10,
                count: 0
            },
            line: [],
            data: null,
            form: {
                pid_area_district: '',
                name: '',
                level: 4
            },
            dialogAddStreetVisible: false,
            ruleForm: {
                pid_area_district: [{ required: true, message: '请选择区域', trigger: 'change' }],
                name: [{ required: true, message: '请输入村名', trigger: 'blur' }]
            }
        };
    },
    activated() {
        this.getLine()
        this.$nextTick(this.getData);
    },
    methods: {
        getData() {
            this.$request.addr.metro({
                    page: this.pageParams.page,
                    page_size: this.pageParams.pageSize,
                    ...this.params
                }).then(res => {
                    const {
                        data: { count, data, page }
                    } = res;
                    this.pageParams.page = +page;
                    this.pageParams.count = +count;
                    this.data = data
                })
        },
        getLine() {
            this.$request.addr.metro({
                    page: 1,
                    page_size: 100,
                    level: 1,
                }).then(res => {
                    const {
                        data: { count, data, page }
                    } = res;
                    this.pageParams.page = +page;
                    this.pageParams.count = +count;
                    this.line = data || []
                })
        },
        handleSubmit() {
            this.pageParams.page = 1;
            this.getData();
        },
        pageChange(e) {
            this.pageParams.page = e;
            this.getData();
        },
        handleUpdate(item) {
            this.$confirm(`确认${item.status === 1 ? '隐藏' : '显示'}该条信息？`, '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$request.addr
                    .editMetro({
                        ...item,
                        status: item.status === 1 ? 2 : 1
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
    },
    filters: {
        lineFilter(v) {
            let [, s] = v.split('?')
            return s || '/'
        },
    }
}
</script>

<style lang="scss" scoped>

</style>