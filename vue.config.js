module.exports = {
    // outputDir: 'build',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://house.zhiqiang.ink',
                // target: 'http://127.0.0.1:7001',
                changeOrigin: true
            }
        }
    }
};
