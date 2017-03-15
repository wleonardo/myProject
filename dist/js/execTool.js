'use strict';
const exec = require('child_process').exec;

console.log(exec);

exports.openNewTerminal = function(path, cmd) {
  exec(`osascript <<END 
        tell application "Terminal"
          do script "cd ${path}&&${cmd}"
        end tell
        END`, {}, function(errCode, output) {
    console.log(output);
  })
}

exports.runCmd = function(path, cmd, callback) {
  return new Promise((resolve, reject) => {
    exec(cmd, {}, (errCode, output) => {
      if (errCode) {
        reject(errCode);
      }else{
        resolve(output);
      }
    });
  })

}

exports.openFolder = function(path) {
  exec('open ./', { cwd: path }, function(errCode, output) {
    //任务完成或者任务出错
    console.log(output);
  });
}

exports.openProjectInIDE = function(path) {
  exec(`/Applications/Sublime\\ Text\\ 2.app/Contents/SharedSupport/bin/subl ${path}`, {}, function(errCode, output) {
    console.log(output);
  })
}
