const gulp = require('gulp');
const ftp = require('gulp-ftp');

gulp.task('default', function() {
    return gulp.src('./dist/**/*').pipe(
        ftp({
            host: '120.79.227.58',
            port: 21,
            user: 'root',
            pass: 'Aa159168',
            // remotePath: '/home/wwwroot/housemanager.zhiqiang.ink/'
            remotePath: '/home/wwwroot/housemanager/'
        })
    );
});
