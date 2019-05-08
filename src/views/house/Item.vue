<template>
    <div class="action-box">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
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
            <el-form-item label="房源位置" v-if="addr">
                <el-cascader expand-trigger="hover" prop="postion_street" separator=" " :options="addr" v-model="selectedOptions" @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="标志建筑">
                <el-select v-model="form.address_flag" prop="address_flag_id" @change="selectChange('address_flag', $event)">
                    <el-option v-for="li in config.address_flag" :key="li.value" :value="li.label" :label="li.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="具体位置">
                <el-input v-model="form.address_detail"></el-input>
            </el-form-item>
            <el-form-item label="路边距离">
                <el-select v-model="form.road_distance" prop="road_distance_id" @change="selectChange('road_distance', $event)">
                    <el-option v-for="li in config.road_distance" :key="li.value" :value="li.label" :label="li.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="楼层">
                <el-select v-model="form.floor_number" prop="floor_number" @change="selectChange('floor', $event)">
                    <el-option v-for="li in config.floor" :key="li.value" :value="li.label" :label="li.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="房源图片">
                <el-row v-if="form.images && form.images.length" :gutter="10">
                    <el-col :span="7" v-for="(li, i) in form.images" :key="i">
                        <div class="avatar">
                            <a :href="li.url" target="_blank" rel="noopener noreferrer">
                                <img :src="li.url" alt="">
                            </a>
                            <el-button class="close" type="text" @click="delImg(i)"><span>&times;</span></el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-upload class="avatar-uploader" drag multiple :action="uploadUrl" :show-file-list="false" :before-upload="beforeImgUpload">
                    <!-- <img v-if="image" :src="imageUrl" class="avatar"> -->
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
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
            <el-form-item label="租房状态">
                <el-radio-group v-model="form.is_rented">
                    <el-radio :label="1">已租</el-radio>
                    <el-radio :label="2">未租</el-radio>
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
                rental: [{ required: true, message: '请输入租金', trigger: 'blur' }],
                address_street: [{ required: true, message: '请选择房源地址', trigger: 'change' }],
                address_flag: [{ required: true, message: '请选择标志建筑', trigger: 'blur' }],
                road_distance: [{ required: true, message: '请选择路边距离', trigger: 'blur' }],
                house_type: [{ required: true, message: '请选择房型', trigger: 'blur' }],
                floor_number: [{ required: true, message: '请输入楼层', trigger: 'blur' }],
                images: [{ type: 'array', message: '请上传图片', trigger: 'blur' }, { min: 2, message: '请至少上传2张图片', trigger: 'blur' }]
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
                is_rented: 1,
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
                address_flag: null,
                road_distance: null,
                config_base: null,
                config_lightspot: null
            },
            id: '',
            selectedOptions: [],
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
                        this.form.images = (res.data.image_urls ? res.data.image_urls.split(',') : []).map(item => ({ url: item }));
                        this.getAreaFlag();
                    }
                });
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
        getAreaFlag() {
            this.$request.addr.flag({ pid_area_street: this.form.address_street_id }).then(res => {
                if (res.data) {
                    this.config = {
                        ...this.config,
                        address_flag: res.data.map(item => {
                            return {
                                value: item.id,
                                label: item.shortname
                            };
                        })
                    };
                }
            });
        },
        handleChange(e) {
            this.form.address_street_id = e[2];
            this.form.address_street = this.addrList && this.addrList[e[2]];
            this.getAreaFlag();
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
                if (this.id) {
                    data.id = this.id;
                }
                this.$request.house[url](data).then(() => {
                    this.$message({ showClose: true, message: '操作成功', type: 'success', duration: 5000 });
                    // this.back();
                    this.getData();
                });
            });
        },
        delImg(i) {
            this.form.images.splice(i, 1);
        },
        beforeImgUpload(file) {
            if (this.form.images.length >= 9) {
                this.$message({ showClose: true, message: '最多上传9张图片', type: 'warning', duration: 5000 });
                return false;
            }
            const data = new FormData();
            data.append('file', file);
            this.$request.upload(data).then(res => {
                if (res.data && res.data.url) {
                    this.form.images.push(res.data);
                }
            });
            return false;
        },
        selectChange(key, e) {
            if (key !== 'floor') {
                this.form[`${key}_id`] = e;
            }
        }
    }
};
</script>

<style lang="less">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    position: relative;
    width: 178px;
    height: 178px;
    margin-bottom: 10px;

    img {
        width: 100%;
        height: 100%;
    }
}
</style>
