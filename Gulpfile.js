var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');
const dirname = __dirname;

//需要处理的文件夹名称，名字为/src/img/spritesrc的下一层文件夹目录名
var taskFolders=[
"1",
"2"
]
 
function loadTask(lastFolder){
	var stream = gulp.src(__dirname+'/src/img/spritesrc/'+lastFolder+'/*.*').pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.css',
		padding:5,
		spritestamp: true,//css时间戳
		cssTemplate:"src/img/spritesrc/handlebarsStr.css"//css模板
		
	})).pipe(gulp.dest(__dirname+'/src/img/spritelib/'+lastFolder));
	return stream;
} 

function loadTasks(_taskFolders) {
	var streams=[];
	for(var i=0;i<_taskFolders.length;i++){
		streams.push(loadTask(_taskFolders[i]))
	}
	return streams;
}
gulp.task('sprite', function () {
   loadTasks(taskFolders);
});