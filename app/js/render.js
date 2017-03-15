const fs = require('fs');
const _ = require('../base/lodash.core.min.js');
var tool = require('./execTool.js');
const { desktopCapturer } = require('electron');

new Vue({
  el: '#main',
  data: {
    projectInfo: [],
    addInfo: {},
    envir: {

    }
  },
  methods: {
    showProjectInfo: function(detail) {
      this.addInfo = detail;
      $('#myModal').modal();
    },
    getNodeVersion: function() {
      tool.runCmd('~/Desktop', 'node --version').then((output) => {
        console.log('node version is ' + output);
        Vue.set(this.envir, 'nodeVersion', output);
      }).catch((errCode) => {
        console.error(errCode);
      });
      tool.runCmd('~/Desktop', 'npm --version').then((output) => {
        console.log('npm version is ' + output);
        Vue.set(this.envir, 'npmVersion', output);
      }).catch((errCode) => {
        console.error(errCode);
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
    },
    init: function(){
      this.getNodeVersion();
    }
  },
  watch: {
    projectInfo: function(newValue) {
      window.localStorage.projectInfo = JSON.stringify(newValue);
    }
  },
  ready: function() {
    this.init();
    console.log(this.getProjectInfo());
  }
});
