<template>
    <div class="action-box">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <!-- <el-form-item label="姓名">
                <el-input v-model="landlord.name">
                    <el-button slot="append" @tap="looking('name')">查找房东</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="landlord.mobile">
                    <el-button slot="append" @tap="looking('mobile')">查找房东</el-button>
                </el-input>
            </el-form-item> -->
            <el-form-item label="房型">
                <el-select v-model="form.house_type" prop="house_type_id" @change="selectChange('house_type', $event)">
                    <el-option v-for="li in config.house_type" :key="li.value" :value="li.label" :label="li.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="租金">
                <el-input v-model.number="form.rental">
                    <span slot="append">元</span>
                </el-input>
            </el-form-item>
            <el-form-item label="房源位置">
                <el-cascader expand-trigger="hover" prop="postion_street" separator=" " :options="addr" v-model="selectedOptions" @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="具体位置">
                <el-input v-model="form.address_detail"></el-input>
            </el-form-item>
            <el-form-item label="路边距离">
                <el-select v-model="form.road_distance" prop="road_distance_id" @change="selectChange('road_distance', $event)">
                    <el-option v-for="li in config.road_distance" :key="li.value" :value="li.label" :label="li.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="基础设施">
                <el-checkbox-group v-model="form.config_base_ids">
                    <el-checkbox v-for="li in config.config_base" :key="li.value" :label="li.value">{{li.label}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="亮点">
                <el-checkbox-group v-model="form.config_lightspot_ids">
                    <el-checkbox v-for="li in config.config_lightspot" :key="li.value" :label="li.value">{{li.label}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="虚假阅读量">
                <el-input v-model.number="form.virtual_number"></el-input>
            </el-form-item>
            <el-form-item label="真实阅读量">
                <el-input v-model.number="form.real_number"></el-input>
            </el-form-item>
            <el-form-item label="发布状态">
                <el-radio-group v-model="form.is_public">
                    <el-radio :label="1">上架</el-radio>
                    <el-radio :label="2">下架</el-radio>
                </el-radio-group>
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
                id: '',
                images: [],
                // landlord_id: '',
                rental: '',
                address_street_id: 1969,
                address_street: '',
                address_flag_id: 3752,
                address_flag: '',
                road_distance_id: '',
                road_distance: '',
                address_detail: '',
                house_type_id: '',
                house_type: '',
                floor_number: '',
                contact_mobile: '',
                wechat_number: '',
                config_base_ids: '',
                // config_base: '',
                config_lightspot_ids: '',
                // config_lightspot: '',
                supplement: '',
                virtual_number: '',
                real_number: '',
                is_public: 2,
                remarks: ''
            },
            // landlord: {
            //     id: '',
            //     name: '',
            //     mobile: ''
            // },
            config: {
                floor: null,
                house_type: null,
                road_distance: null,
                config_base: null,
                config_lightspot: null
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
        this.getConfig();
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
                        this.selectedOptions = [1965, 1969, res.data.address_flag_id];
                        this.form.config_base_ids = res.data.config_base_ids ? res.data.config_base_ids.split(',').map(item => +item) : [];
                        this.form.config_lightspot_ids = res.data.config_lightspot_ids
                            ? res.data.config_lightspot_ids.split(',').map(item => +item)
                            : [];
                    }
                });
        },
        back() {
            this.$router.go(-1);
        },
        getConfig() {
            this.$request.config().then(res => {
                if (res.data) {
                    const config = res.data.reduce((obj, item) => {
                        if (!obj[item.type]) {
                            obj[item.type] = [];
                        }
                        item.active = false;
                        obj[item.type].push({
                            value: item.id,
                            label: item.value
                        });
                        return obj;
                    }, {});

                    this.config = { ...this.config, ...config };
                }
            });
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
            this.form.address_street_id = e[2];
            this.form.address_street = this.addrList && this.addrList[e[2]];
        },
        submitForm(name) {
            this.$refs[name].validate(valid => {
                if (!valid) return;
                let url = this.id ? 'edit' : 'add';
                const data = {
                    ...this.form,
                    config_base_ids: this.form.config_base_ids.join(','),
                    config_lightspot_ids: this.form.config_lightspot_ids.join(',')
                };
                this.$request.house[url](data).then(res => {
                    this.$message({ showClose: true, message: '操作成功', type: 'success', duration: 5000 });
                    this.back();
                });
            });
        },
        looking(key) {},
        selectChange(key, e) {
            this.form[`${key}_id`] = e;
        }
    }
};
</script>
