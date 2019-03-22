module.exports = {
    // outputDir: 'build',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://house.zhiqiang.ink',
                changeOrigin: true
            }
        }
    }
};
