'use strict';
const fs = require('fs');
const _ = require('lodash');
module.exports = function(filepath) {
  var initFile = function(filepath) {
    try {
      fs.readFileSync(filepath);
    } catch (e) {
      fs.openSync(filepath, 'w+');
      fs.writeFileSync(filepath, JSON.stringify([], null, '   '), 'UTF-8');
    }
  };
  var getData = function(filepath) {
    try {
      var r = JSON.parse(fs.readFileSync(filepath));
    } catch (e) {
      console.log(e);
      fs.writeFileSync(filepath, JSON.stringify([], null, '   '), 'UTF-8');
      r = JSON.parse(fs.readFileSync(filepath));
    }
    return r;
  };

  initFile(filepath);
  return {
    getAll: function() {
      return getData(filepath);
    },
    replace: function(data){
      fs.writeFileSync(filepath, JSON.stringify(data, null, '   '), 'UTF-8');
      return data;
    },
    add: function(newData) {
      var data = getData(filepath);
      data.push(newData);
      fs.writeFileSync(filepath, JSON.stringify(data, null, '   '), 'UTF-8');
      return newData;
    },
    get: function(searchField) {
      var data = getData(filepath);
      var a = _.find(data, function(singelData, key) {
        var isSame = _.every(searchField, function(v, k) {
          return singelData[k] == v;
        });
        return isSame;
      });
      return a;
    },
    find: function(key, value) {
      var data = getData(filepath);
      var result = [];
      _.forEach(data, function(v, k) {
        _.includes(value, v[key]) && result.push(v);
      });
      return result;
    },
    update: function(searchField, newData) {
      var data = getData(filepath);
      var a = _.find(data, function(singelData, key) {
        var isSame = _.every(searchField, function(v, k) {
          return singelData[k] == v;
        });
        if (isSame) {
          singelData = _.extend(singelData, newData);
          fs.writeFileSync(filepath, JSON.stringify(data, null, '   '), 'UTF-8');
        }
        return isSame;
      });
      return a;
    },
    updateAndAdd: function(searchField, newData) {
      var result = this.update.apply(this, arguments);
      if (!result) {
        _.extend(searchField, newData);
        result = this.add(searchField);
      }
      return result;
    }
  };
};