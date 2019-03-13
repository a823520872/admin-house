module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://house.zhiqiang.ink',
                changeOrigin: true
            }
        }
    }
};
