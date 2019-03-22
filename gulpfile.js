const gulp = require('gulp');
const sftp = require('gulp-sftp');

gulp.task('default', function() {
    return gulp.src('./dist/**/*').pipe(
        sftp({
            host: '120.79.227.58',
            port: 22,
            user: 'root',
            pass: 'Aa159168',
            remotePath: '/home/wwwroot/housemanager.zhiqiang.ink/'
        })
    );
});
