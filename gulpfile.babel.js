import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import pug from 'gulp-pug';
import webserver from 'browser-sync';
import del from 'del';

const build = 'build/';
const source = 'src/';
const paths = {
  styles: {
    src: source + 'styles/master.scss',
    dest: build + 'assets/css/',
    watch: source + 'styles/**/*'
  },
  templates: {
    src: source + 'templates/pages/**/*',
    dest: build,
    watch: source + 'templates/**/*'
  },
  assets: {
    src: source + 'assets/**/*',
    dest: build,
    watch: source + 'assets/**/*'
  }
}
/*
  Stylesheet
*/
gulp.task('styles', function() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({
      "outputStyle": "expanded"
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(webserver.stream());
});

/*
  Template
*/
gulp.task('templates', function() {
  return gulp.src(paths.templates.src)
    .pipe(pug({
      "pretty": " ",
      "basedir": "./"
    }))
    .pipe(gulp.dest(paths.templates.dest));
});

/*
  Copy
*/
gulp.task('copy', function() {
  return gulp.src(paths.assets.src, { base: 'src/' })
    .pipe(gulp.dest(paths.assets.dest));
});

/*
  browser sync
*/

function reloadServer(done) {
  webserver.reload();
  done();
}

function startServer(done) {
  webserver.create();
  webserver.init({
    server: {
      baseDir: './build/'
    }
  });

  done();
};

/*
  Clean
*/
gulp.task('clean', function (done) {
  return del([build], done);
});

/*
  Watch
*/
gulp.task('watch', function() {
  gulp.watch(paths.assets.watch, gulp.series('copy', reloadServer));

  gulp.watch(paths.styles.watch, gulp.series('styles'));

  gulp.watch(paths.templates.watch, gulp.series('templates', reloadServer));
});

/*
  Dev build
*/
gulp.task('build', gulp.series('clean', 'copy', gulp.parallel('styles', 'templates')));

/*
  Start Gulp
  Compile files
  Copy necessary external files
*/
gulp.task('default', gulp.series('build', startServer, 'watch'));