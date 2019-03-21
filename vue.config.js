module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://house.zhiqiang.ink',
                changeOrigin: true
            }
        }
    }
};
