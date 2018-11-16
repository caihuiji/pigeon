const tof = require('koa-tof');

module.exports = function(options, app) {
  return tof.koaMiddleware({
    noCheckIp: true,
  });
};
