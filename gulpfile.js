
let project_folder = ".";
let sourse_folder = "app";

let path = {
   build:{
      html: project_folder + "/",
      css: project_folder + "/css/",
      js: project_folder + "/js/",
      img: project_folder +"/img/",
      icon: project_folder + "/iconsprite/",
      fonts: project_folder + "/fonts/",
   },
   src: {
      html: sourse_folder + "/*.pug",
      css: sourse_folder + "/scss/main.scss",
      js: sourse_folder + "/js/main.js",
      img: sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      icon: sourse_folder + "/iconsprite/**/*.svg",
      fonts: sourse_folder + "/fonts/*.ttf",
   },
   watch: {
      html: sourse_folder + "/**/*.pug",
      css: sourse_folder + "/scss/**/*.scss",
      js: sourse_folder + "/js/**/*.js",
      img: sourse_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      icon: sourse_folder + "/iconsprite/**/*.svg",
   },
   // clean: "./" + project_folder + "/"
}

let { src, dest } = require("gulp"),
   gulp = require("gulp"), 
   browsersync = require("browser-sync").create(), //синхронизирует изменения файлов и взаимодействия на многих устройствах
   del = require("del"), //Удаление файлов и каталогов
   scss = require("gulp-sass"), 
   autoprefixer = require("gulp-autoprefixer"),
   group_media = require("gulp-group-css-media-queries"), // оптимизирует css media запросы
   clean_css = require("gulp-clean-css"), //Удаление файлов и каталогов
   rename = require("gulp-rename"), // переименование файлов например .min.css
   uglify = require("gulp-uglify-es").default, // для минимизации js и для поддерки браузеров
   imagemin = require("gulp-imagemin"), // для зжатия картинок
   webp = require("gulp-webp"), // для перевода изображений в формат webp
   pug = require("gulp-pug"),
   webp_html = require("gulp-webp-html"), // для поддержки браузеров формата webp
   webpcss = require("gulp-webp-css"), // для поддержки браузеров формата webp в css
   // svg_sprite = require("gulp-svg-sprites"), // для переобразования всех svg в один файл
   ttf2woff = require("gulp-ttf2woff"),
   ttf2woff2 = require("gulp-ttf2woff2"),
   fonter = require("gulp-fonter");   



function browserSync(params) {
   browsersync.init({
      server:{
         // baseDir: "./" + project_folder + "/"
         baseDir: "../test/"
      },
      port: 3000,
      notify: false
   })
}

function html() {
   return src(path.src.html)
   .pipe(pug({
      // pretty: true
   }))
   .pipe(webp_html())
   .pipe(dest(path.build.html))
   .pipe(browsersync.stream())
}

function css() {
   return src(path.src.css)
      .pipe(
         scss({
            outputStyle: "expanded"
         })
      )
      .pipe(
         group_media()
      )
      .pipe(
         autoprefixer({
            overrideBrowserslist: [
               '> 0.1%',
               'iOS >=7',
               'last 3 version',
               'firefox >= 4',
               'safari 7',
               'safari 8',
               'safari 5',
               'ie 8',
               'ie 9',
               'IE 10',
               'IE 11',
               'opera 12.1',
               'ios 6',
               'android 4'
            ],
            cascade: true
         })
      )
      .pipe(webpcss())
      .pipe(dest(path.build.css))
      .pipe(clean_css())
      .pipe(
         rename({
            extname: ".min.css"
         })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
}

function js() {
   return src(path.src.js)
      .pipe(uglify())
      .pipe(
         rename({
            extname: ".min.js"
         })
      )
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
}

function images() {
   return src(path.src.img)
      .pipe(
         webp({
            quality: 70
         })
      )
      .pipe(dest(path.build.img))
      .pipe(src(path.src.img))
      .pipe(
         imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3 // 0 to 7
         })
      )
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
}

// function svgSprite() {
//    return src(path.src.icon)
//       .pipe(svg_sprite({
//          mode: {
//             stask: {
//                sprite: "../icons.svg",
//                example:true
//             },
//             css: { // Activate the «css» mode
//                render: {
//                   css: true // Activate CSS output (with default options)
//                }
//             },
            
//          },
//       }))
//       .pipe(dest(path.build.icon))
//       .pipe(browsersync.stream())
// }
// gulp.task('svgSprite', function (){
//    return gulp.src([sourse_folder + '/iconsprite/*.svg'])
//       .pipe(svg_sprite({
//          mode: {
//             css: { // Activate the «css» mode
//                render: {
//                   css: true // Activate CSS output (with default options)
//                }
//             },
//             stask: {
//                sprite: "../icons/icons.svg",
//                example:true
//             }
//          },
//       }
//       ))
//       .pipe(dest(path.build.img))
// })


function watchFiles(params) {
   gulp.watch([path.watch.html],html);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.img], images);
   // gulp.watch([path.watch.icon], svgSprite);
}

// function clean(params) {
//    return del(path.clean);
// }

let build = gulp.series(gulp.parallel(js, css, html, images ));
let watch = gulp.parallel(build, watchFiles, browserSync);

// exports.svgSprite = svgSprite;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;