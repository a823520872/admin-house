<template>
    <el-dialog :title="title" :visible.sync="qr" width="480px">
        <div>
            <img :src="qr" alt="" width="100%">
        </div>
        <div class="dialog-footer" slot="footer">
            <el-button @click="qr = false">取 消</el-button>
            <el-button type="primary" @click="download">下 载</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        title: String,
        qr: String
    },
    methods: {
        download() {
            window.open(this.qr);
            // alert('暂不支持下载');
        }
    }
};
</script>

<style>
</style>
