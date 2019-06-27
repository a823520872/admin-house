<template>
    <div>
        <div class="search el-row--flex is-justify-space-between">
            <el-form :inline="true">
                <el-form-item>
                    <el-date-picker v-model="timerange" @change="timePicker" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table">
            <el-table :data="data" stripe>
                <el-table-column type="index" label="序号" width="50"></el-table-column>
                <el-table-column prop="address_street" label="村名" width=""></el-table-column>
                <el-table-column prop="house_finder_nummber" label="找房人数" width="120"></el-table-column>
                <el-table-column prop="landlord_nummber" label="房东人数" width="120"></el-table-column>
                <el-table-column prop="landlord_nopublic_nummber" label="未发布房东人数" width="120"></el-table-column>
                <el-table-column prop="house_nummber" label="房源数量" width="120"></el-table-column>
                <el-table-column prop="house_getphone10_nummber" label="获取联系方式>10房东数" width="120"></el-table-column>
                <el-table-column prop="house_getphone20_nummber" label="获取联系方式>20房东数" width="120"></el-table-column>
                <el-table-column prop="house_refresh_people_nummber" label="刷新人数" width="120"></el-table-column>
                <el-table-column prop="house_refresh_nummber" label="刷新次数" width="120"></el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination @current-change="pageChange" :page-size="pageParams.pageSize" :total="pageParams.count" :current-page.sync="pageParams.page"></el-pagination>
            </div> -->
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import qs from 'querystring';
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
                begin_date: '',
                end_date: ''
            },
            // pageParams: {
            //     page: 1,
            //     pageSize: 10,
            //     count: 0
            // },
            data: null
        };
    },
    watch: {
        $route() {
            this.getParams();
            this.getData();
        }
    },
    mounted() {
        this.getParams();
        if (this.params.begin_date && this.params.end_date) {
            this.$nextTick(this.getData);
        }
    },
    methods: {
        getParams() {
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
        },
        getData() {
            this.$request.statistics
                .list({
                    // page: this.pageParams.page,
                    // page_size: this.pageParams.pageSize,
                    ...this.params
                })
                .then(res => {
                    const {
                        data
                        // data: { count, data, page }
                    } = res;
                    // this.pageParams.page = +page;
                    // this.pageParams.count = +count;
                    this.data = data[0];
                });
        },
        handleSubmit() {
            this.data = [];
            const params = {
                // p: 1
            };
            for (let [k, v] of Object.entries(this.params)) {
                if (v) {
                    params[k] = encodeURIComponent(v);
                }
            }

            this.$router.push(`${this.$route.path}?${qs.stringify(params)}`);
        },
        timePicker(e) {
            if (e) {
                this.params.begin_date = dayjs(e[0]).format('YYYY-MM-DD');
                this.params.end_date = dayjs(e[1]).format('YYYY-MM-DD');
            } else {
                this.params.begin_date = '';
                this.params.end_date = '';
            }
        }
    }
};
</script>
