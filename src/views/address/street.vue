<template>
    <div>
        <div class="search el-row--flex is-justify-space-between">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="params.area_street" placeholder="村名"></el-input>
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
                <el-button type="primary" @click="addStreet()">添加村</el-button>
            </div>
        </div>
        <div class="table">
            <el-table :data="data" stripe v-loading="loading">
                <el-table-column prop="id" label="序号" width="60"></el-table-column>
                <el-table-column label="区" min-width="80">
                    <template slot-scope="scope">
                        {{ getCity(scope.row.pid_area_district) }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="村名" min-width="80"></el-table-column>
                <el-table-column prop="num_landlord" label="房东数量" width="80"></el-table-column>
                <el-table-column prop="num_house_resource" label="房源数量" width="80"></el-table-column>
                <el-table-column prop="num_getphone_number" label="获得电话次数" width="110"></el-table-column>
                <el-table-column prop="num_getphone_people" label="获得电话人数" width="110"></el-table-column>
                <el-table-column prop="create_t" label="创建时间" width="110"></el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleLink(scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDel(scope.row)">删除</el-button>
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
        <el-dialog :title="form && form.id ? '编辑村' : '添加村'" :visible.sync="dialogAddStreetVisible" width="320px">
            <el-form :model="form" :rules="ruleForm" ref="form" label-width="80px">
                <el-form-item v-if="addr" label="所属区域" prop="pid_area_district">
                    <el-cascader
                        placeholder="所属区域"
                        expand-trigger="hover"
                        separator=" "
                        :options="district"
                        v-model="selectedOptions2"
                        @change="handleChange2"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="村名称" prop="name">
                    <el-input v-model.trim="form.name" placeholder="请输入村名"></el-input>
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
import dayjs from 'dayjs';
export default {
    computed: {
        ...mapState(['loading', 'addr', 'addrList']),
        district() {
            return this.addr.reduce((arr, city) => {
                let cityTemp = { ...city };
                cityTemp.children = cityTemp.children.map(district => {
                    let { children, ...districtTemp } = district;
                    return districtTemp;
                });
                arr.push(cityTemp);
                return arr;
            }, []);
        }
    },
    data() {
        return {
            params: {
                area_street: ''
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
        this.getArea();
        this.$nextTick(this.getData);
    },
    methods: {
        ...mapActions(['getArea']),
        getData() {
            this.$request.addr
                .street({
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
                        item.create_t = item.createtime ? dayjs(new Date(item.createtime * 1000)).format('YYYY-MM-DD HH:mm:ss') : '/';
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
        handleChange(e) {
            this.params.pid_area_district = e[1];
        },
        handleChange2(e) {
            this.form.pid_area_district = e[1];
        },
        handleLink(item) {
            this.form = {
                id: item.id,
                pid_area_district: item.pid_area_district,
                name: item.name
            };
            if (item.pid_area_district) {
                this.selectedOptions2 = [this.addrList[item.pid_area_district].pid, item.pid_area_district];
            }
            this.dialogAddStreetVisible = true;
        },
        handleDel(item) {
            this.$confirm('确认删除该条信息？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$request.addr
                    .delStreet({
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
        addStreet() {
            this.form = {
                pid_area_district: '',
                name: '',
                level: 4
            };
            this.dialogAddStreetVisible = true;
        },
        cancelAdd() {
            this.dialogAddStreetVisible = false;
            this.form = {
                pid_area_district: '',
                name: '',
                level: 4
                // status: 1
            };
        },
        add() {
            this.$refs.form.validate(valid => {
                if (!valid) return;
                let url = this.form.id ? 'editStreet' : 'addStreet';
                this.$request.addr[url]({ ...this.form }).then(() => {
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
