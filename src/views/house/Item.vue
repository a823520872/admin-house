<template>
    <div class="action-box">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="姓名">
                <el-input v-model="form.name" prop="name"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="form.mobile" prop="mobile"></el-input>
            </el-form-item>
            <!-- <el-form-item label="房源数量">
                <el-input v-model.number="form.num" prop="num"></el-input>
            </el-form-item> -->
            <el-form-item label="房源位置">
                <el-cascader expand-trigger="hover" prop="postion_street" separator=" " :options="addr" v-model="selectedOptions" @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="到期时间">
                <el-date-picker v-model="timerange" prop="indate_end" @change="timePicker" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
            <el-form-item label="推荐人">
                <el-input v-model="form.referrer_user_mobile"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button v-back>返回</el-button>
                <el-button type="primary" @click="submitForm('form')">确定</el-button>
            </el-form-item>
        </el-form>
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
            rules: {
                name: [{ required: true, message: '请输入房东姓名', trigger: 'blur' }],
                mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
                num: [{ required: true, message: '请输入房源数量', trigger: 'blur' }],
                postion_street: [{ required: true, message: '请选择房源地址', trigger: 'change' }],
                indate_end: [{ required: true, message: '请选择到期时间', trigger: 'change' }]
            },
            form: {
                images: [],
                landlord_id: '',
                rental: '',
                address_street_id: 1969,
                address_street: '',
                address_flag_id: 3752,
                address_flag: '',
                road_distance_id: 1,
                road_distance: '',
                address_detail: '',
                house_type_id: '',
                house_type: '',
                floor_number: '',
                contact_mobile: '',
                wechat_number: '',
                config_base_ids: '',
                config_base: '',
                config_lightspot_ids: '',
                config_lightspot: '',
                remarks: ''
            },
            id: '',
            addr: [],
            selectedOptions: [],
            addrList: null,
            timerange: []
        };
    },
    mounted() {
        if (this.$route.params.id) {
            this.id = this.$route.params.id;
            this.$nextTick(this.getData);
        }
        this.getArea();
    },
    methods: {
        getData() {
            this.$request.house
                .detail({
                    id: this.id
                })
                .then(res => {
                    if (res.data) {
                        Object.keys(this.form).map(key => {
                            this.form[key] = res.data[key];
                        });
                        this.timerange = [res.data.indate_begin, res.data.indate_end];
                    }
                });
        },
        back() {
            this.$router.go(-1);
        },
        getArea() {
            this.$request.addr.area().then(res => {
                if (res.data) {
                    this.addrList = {};
                    this.addr = res.data
                        ? res.data.map(item => {
                              this.addrList[item.id] = item.name;
                              if (item.children) {
                                  const ichildren = item.children.map(it => {
                                      this.addrList[it.id] = it.name;
                                      if (it.children) {
                                          const jchildren = it.children.map(i => {
                                              this.addrList[i.id] = i.name;
                                              return {
                                                  value: i.id,
                                                  label: i.name
                                              };
                                          });
                                          return {
                                              value: it.id,
                                              label: it.name,
                                              children: jchildren
                                          };
                                      }
                                      return {
                                          value: it.id,
                                          label: it.name
                                      };
                                  });
                                  return {
                                      value: item.id,
                                      label: item.name,
                                      children: ichildren
                                  };
                              }
                              return {
                                  value: item.id,
                                  label: item.name
                              };
                          })
                        : [];
                }
            });
        },
        handleChange(e) {
            this.form.position_province_id = 1964;
            this.form.position_province = '广东省';
            this.form.position_city_id = e[0];
            this.form.position_city = this.addrList && this.addrList[e[0]];
            this.form.postion_district_id = e[1];
            this.form.postion_district = this.addrList && this.addrList[e[1]];
            this.form.postion_street_id = e[2];
            this.form.postion_street = this.addrList && this.addrList[e[2]];
        },
        submitForm(name) {
            this.$refs[name].validate(valid => {
                if (!valid) return;
                let url = this.id ? 'edit' : 'add';
                const data = this.id ? { ...this.form, id: this.id } : { ...this.form };
                this.$request.landlord[url](data).then(res => {
                    this.$message({ showClose: true, message: '操作成功', type: 'success', duration: 5000 });
                    this.back();
                });
            });
        },
        timePicker(e) {
            this.form.indate_begin = dayjs(e[0].$d).format('YYYY-MM-DD');
            this.form.indate_end = dayjs(e[1].$d).format('YYYY-MM-DD');
        }
    }
};
</script>
