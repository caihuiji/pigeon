'use strict';

module.exports = appInfo => {
  const config = exports = {
    security: {
      csrf: {
        enable: false,
      },
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1540901059996_4574';

  // add your config here
  config.middleware = [];

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };


  config.mongoose = {
    url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1:27017/pigeon',
    options: {
      server: {
        poolSize: 20,
      },
    },
  };

  return config;
};
