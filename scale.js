const FFMPEG = require('fluent-ffmpeg');
const fs = require('fs');
const chalk = require('chalk');
var ProgramArgs = process.argv.slice(2);
fs.access("./" + ProgramArgs[0], fs.F_OK, (err) => {
    if (err) {
      if(err.code == "ENOENT"){
          return console.log(chalk.red(ProgramArgs[0] + " WAS NOT FOUND. EXITING."));
      }
    }
  console.log(chalk.green(ProgramArgs[0] + " WAS FOUND. BEGINNING PROCESS TO 1080P60... THIS MAY TAKE A WHILE..."));
    try {
        var video = new FFMPEG("./" + ProgramArgs[0])
        .outputOptions([
            '-tune animation',
            '-crf 22',
            '-filter:v minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=60\''
        ]);
        video.on('codecData', function(data) {
            console.log('[FFMPEG] Input is' + data.audio + ' audio ' +
              'with ' + data.video + ' video');
        });
        video.on('progress', function(progress) {
            console.log(chalk.green('[FFMPEG] Progress: ' + progress.percent + '% done'));
        });
        video.on('stderr', function(stderrLine) {
            printProgress(stderrLine);
        });
        video.on('end', function(stdout, stderr) {
            console.log(chalk.green("SUCCESFULLY UPSCALED!"));
        });
        video.save('./output.mp4');
    } catch (e) {
    return console.error(e);
}
});
//var ffmpegprocess = new ffmpeg("./" + ProgramArgs[0]);
    // ffmpegprocess.then(function (err, video) {
	// 	if (!err) {
    //         video.addCommand('-c:v', 'libx264');
    //         video.addCommand('-preset', 'slow');
    //         video.addCommand('-crf', '21');
    //         video.addCommand('-vf', "scale=1920:1080:flags=lanczos");
    //         video.addCommand('-filter:v', `"minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120'"`);
    //         video.save('./output.mp4', function(error, file){
    //             if(error) return console.error(chalk.red(error));
    //             return console.log(chalk.green("SUCCESS."));
    //         });
    //     } else {
	// 		return console.log('Error: ' + err);
	// 	}
    // });
function printProgress(progress){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(progress);
}