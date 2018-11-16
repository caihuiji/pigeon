const request = require('request');
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), '32423dfwert3434.zip');


 request.post({
  url: 'http://ops.itil.rdgz.org/change_mgr/cgi-bin/cdn_upload_cgi',
  method: 'POST',
  json: true,
  timeout: 10000, // 10s
  formData: {
    file_data: fs.createReadStream(filePath),
    action: 'upload_file',
    product: '2',
    path: '/home/qspace/QQMail/nodejslogic/htdocs/wework/offline_package',
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    cookie: 'account=chriscai',
  },
}, function(err, res, body) {
  if (err) {
    console.error('upload failed:', err  );
    // errorCb(err);
  } else if (body.header.error_code !== 0) { // 后台接口设计不规范
    console.log('upload wrong:', body);
    // errorCb('上传不成功，请确保你的配置项是准确的');
  } else {
    // console.log('upload success:', res)
    console.log('upload success:', body);
    // successCb(body.data);
  }
});
return ;
/*
const formData = new FormData();
formData.append('action', 'upload_file');
formData.append('product', '2');
formData.append('path', '/home/qspace/QQMail/nodejslogic/htdocs/wework/offline_package');
formData.append('file_data', fs.createReadStream(filePath));
axios(
  {
    url: 'http://ops.itil.rdgz.org/change_mgr/cgi-bin/cdn_upload_cgi',
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
      cookie: 'account=chriscai',
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: formData,
  }).then(function(response) {
  console.log(response);
})
  .catch(function(error) {
    console.log(error);
  });
*/
