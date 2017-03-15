const fs = require('fs');
const _ = require('../base/lodash.core.min.js');
var tool = require('./execTool.js');
const {desktopCapturer} = require('electron');

new Vue({
  el: '#main',
  data: {
    projectInfo: [],
    addInfo: {}
  },
  methods: {
    showProjectInfo: function(detail){
      this.addInfo = detail;
      $('#myModal').modal();
    },
    getNodeVersion: function() {
      tool.runCmd('~/Desktop', 'node --version', function(err, output){
        console.log(err);
        console.log(output);
      });
    },
    getProjectInfo: function() {
      var projectInfo = JSON.parse(window.localStorage.projectInfo || '[]');
      this.projectInfo = projectInfo;
      console.log(this.projectInfo);
      return projectInfo;
    },
    startProject: function(d) {
     tool.openNewTerminal('~/Desktop' + d.path, `nvm use ${d.nodeVersion} && ${d.startCmd}`);
    },
    buildProject: function(d) {
      tool.openNewTerminal('~/Desktop' + d.path, d.buildCmd);
    },
    openProject: function(d) {
      tool.openFolder('~/Desktop' + d.path);
    },
    openProjectInIDE: function(d) {
      tool.openProjectInIDE('~/Desktop' + d.path);
    },
    saveProjectInfo: function() {
      if (this.addInfo.id) {
        _.find(this.projectInfo, function(d) {
          if (d.id == this.addInfo.id) {
            _.extend(d, this.addInfo);
            return true;
          } else {
            return false;
          }
        }.bind(this));
      } else {
        this.addInfo.id = new Date().getTime();
        this.projectInfo.push(this.addInfo);
      }
      this.projectInfo = JSON.parse(JSON.stringify(this.projectInfo));
    }
  },
  watch: {
    projectInfo: function(newValue) {
      window.localStorage.projectInfo = JSON.stringify(newValue);
    }
  },
  ready: function() {
    console.log(this.getProjectInfo());
  }
});
