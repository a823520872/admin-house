<template>
    <div>
        <div class="search el-row--flex is-justify-space-between">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="params.area_district" placeholder="区"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="params.area_street" placeholder="村名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="params.shortname" placeholder="标志建筑"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="params.status" placeholder="状态">
                        <!-- <el-option label="全部" value=""></el-option> -->
                        <el-option label="正在使用" value="1"></el-option>
                        <el-option label="已删除" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item v-if="addr">
                    <el-cascader
                        placeholder="所属区域"
                        expand-trigger="hover"
                        separator=" "
                        :options="district"
                        v-model="selectedOptions"
                        @change="handleChange"
                    ></el-cascader>
                </el-form-item> -->
                <!-- <el-form-item>
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
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">搜索</el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" @click="addFlag()">添加建筑</el-button>
            </div>
        </div>
        <div class="table">
            <el-table :data="data" stripe v-loading="loading">
                <el-table-column prop="id" label="序号" width="60"></el-table-column>
                <el-table-column label="区" width="80">
                    <template slot-scope="scope">
                        {{ getCity(scope.row.pid_area_district) }}
                    </template>
                </el-table-column>
                <el-table-column label="村名" width="80">
                    <template slot-scope="scope">
                        {{ getCity(scope.row.pid_area_street) }}
                    </template>
                </el-table-column>
                <el-table-column prop="shortname" label="标志建筑" min-width="80"></el-table-column>
                <el-table-column prop="status" label="状态" width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1">正在使用</span>
                        <span class="danger" v-if="scope.row.status === 2">已删除</span>
                    </template>
                </el-table-column>
                <el-table-column prop="num_house_resource" label="房源数量" width="80"></el-table-column>
                <el-table-column prop="num_getphone_number" label="获得电话次数" width="110"></el-table-column>
                <el-table-column prop="num_getphone_people" label="获得电话人数" width="110"></el-table-column>
                <el-table-column label="创建时间" width="110">
                    <template slot-scope="scope">
                        {{ scope.row.createtime | timeFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleLink(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDel(scope.row)" v-if="scope.row.status === 1">删除</el-button>
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
        <el-dialog :title="form && form.id ? '编辑建筑' : '添加建筑'" :visible.sync="dialogAddFlagVisible" width="320px">
            <el-form :model="form" :rules="ruleForm" ref="form" label-width="80px">
                <el-form-item v-if="addr" label="所属区域" prop="pid_area_district">
                    <el-cascader
                        placeholder="所属区域"
                        expand-trigger="hover"
                        separator=" "
                        :options="addr"
                        v-model="selectedOptions2"
                        @change="handleChange2"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="建筑名称" prop="shortname">
                    <el-input v-model.trim="form.shortname" placeholder="请输入建筑名称"></el-input>
                </el-form-item>
                <el-form-item label="建筑经度" prop="lng">
                    <el-input v-model.trim="form.lng" placeholder="请输入建筑经度"></el-input>
                </el-form-item>
                <el-form-item label="建筑纬度" prop="lat">
                    <el-input v-model.trim="form.lat" placeholder="请输入建筑纬度"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="cancelAdd('form')">取 消</el-button>
                <el-button type="primary" @click="add('form')" :loading="loading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
    computed: {
        ...mapState(['loading', 'addr', 'addrList'])
    },
    data() {
        return {
            params: {
                area_district: '',
                area_street: '',
                shortname: '',
                status: '',
            },
            pageParams: {
                page: 1,
                pageSize: 10,
                count: 0
            },
            selectedOptions: [],
            selectedOptions2: [],
            data: null,
            form: {
                id: '',
                pid_area_district: '',
                pid_area_street: '',
                shortname: '',
                lng: '',
                lat: '',
                level: 5
            },
            dialogAddFlagVisible: false,
            ruleForm: {
                pid_area_district: [{ required: true, message: '请选择区域', trigger: 'change' }],
                shortname: [{ required: true, message: '请输入建筑名称', trigger: 'blur' }],
                lng: [{ required: true, message: '请输入建筑经度', trigger: 'blur' }],
                lat: [{ required: true, message: '请输入建筑纬度', trigger: 'blur' }]
            }
        };
    },
    activated() {
        this.getArea();
        this.$nextTick(this.getData);
    },
    methods: {
        ...mapActions(['getArea']),
        getData() {
            this.$request.addr
                .flag({
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
        handleChange(e) {
            this.params.pid_area_district = e[1];
        },
        handleChange2(e) {
            this.form.pid_area_district = e[1];
            this.form.pid_area_street = e[2];
        },
        handleLink(item) {
            this.form = {
                id: item.id,
                pid_area_district: item.pid_area_district,
                pid_area_street: item.pid_area_street,
                shortname: item.shortname,
                lng: item.lng,
                lat: item.lat
            };
            if (item.pid_area_street) {
                this.selectedOptions2 = [this.addrList[item.pid_area_district].pid, item.pid_area_district, item.pid_area_street];
            }
            this.dialogAddFlagVisible = true;
        },
        handleDel(item) {
            this.$confirm('确认删除该条信息？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$request.addr
                    .delFlag({
                        id: item.id
                    })
                    .then(() => {
                        this.getArea(true)
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        this.getData();
                    });
            });
        },
        addFlag() {
            this.form = {
                id: '',
                pid_area_district: '',
                pid_area_street: '',
                shortname: '',
                lng: '',
                lat: '',
                level: 5
            };
            this.selectedOptions2 = [];
            this.dialogAddFlagVisible = true;
        },
        cancelAdd() {
            this.dialogAddFlagVisible = false;
            this.form = {
                id: '',
                pid_area_district: '',
                pid_area_street: '',
                shortname: '',
                lng: '',
                lat: '',
                level: 5
                // status: 1
            };
        },
        add() {
            this.$refs.form.validate(valid => {
                if (!valid) return;
                let url = this.form.id ? 'editFlag' : 'addFlag';
                this.$request.addr[url]({ ...this.form }).then(() => {
                    this.getArea(true)
                    this.cancelAdd();
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.getData();
                });
            });
        },
        getCity(id) {
            if (this.addrList) {
                return this.addrList[id] ? this.addrList[id].name : '/';
            }
            return '/';
        }
    }
};
</script>

<style lang="less"></style>
