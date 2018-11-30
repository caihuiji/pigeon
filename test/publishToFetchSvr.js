const request = require('request');

request.post({
  url: 'http://127.0.0.1:13082/wework_admin/offline_1sync',

  method: 'POST',
  json: true,
  timeout: 10000, // 10s
  form: {
    data: {},
  },
  headers: {
    Host: 'work.weixin.qq.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Content-type': 'application/x-www-form-urlencoded',
    origin: 'https://work.weixin.qq.com',
    referer: 'https://work.weixin.qq.com',
  },
}, function(err, res, body) {

  if (err) {
    console.log('err:', err);
  } else {
    console.log(res.statusCode);
    console.log('suc:', body);
  }
});
