const helper = require('../app/controller/common/helper');
const path = require('path');

const log = {
  logger: {
    debug: function(str) {

    },
    info: function(str) {
      console.log(str);
    },
    error: function() {
      console.error.apply(console, arguments);
    }
  }
};

helper.genVerify(log , path.join('C:/Users/chriscai/Desktop/offline/true/22889/') , function (err , json){
    console.log('==== end ')
    console.log(json);
})
