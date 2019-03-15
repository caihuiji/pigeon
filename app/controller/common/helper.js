const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

module.exports = {
  md5(str) {
    return crypto.createHash('md5')
      .update(str, 'utf8')
      .digest('hex');
  },

  genVerify(ctx, rootFolderPath, callback) {
    const verifyJson = {};
    const self = this;
    let isMatchError = false;

    function fileDetect(folderPath, callback) {
      ctx.logger.debug(`detect folder ${folderPath}`);
      fs.readdir(folderPath, (err, files) => {
        if (err || isMatchError) {
          isMatchError = true;
          ctx.logger.error('detect folder error', err);
          return callback();
        }

        let fileLength = files.length;

        if (fileLength == 0) {
          callback();
        }

        const countDown = () => {
          fileLength--;
          if (fileLength <= 0) {
            callback();
          }
        };

        files.forEach((filename) => {

          let filePath = path.join(folderPath, filename);
          ctx.logger.debug(`  - forEach files ${filePath}`);

          fs.stat(filePath, function(err, stats) {
            if (err) {
              isMatchError = true;
              ctx.logger.error(' - forEach error', err);
              countDown();
            } else {
              let isFile = stats.isFile();
              let isDir = stats.isDirectory();


              if (isFile && /\.(png|jpg|jpeg|gif|html|css|js)$/i.test(filename)) {
                fs.readFile(filePath, (err, data) => {
                  let md5 = self.md5(data);
                  let md5Path = filePath.replace(rootFolderPath, '')
                    .replace(/\\/gi, '/');
                  ctx.logger.info(`md5:  ${md5Path} = ${md5}`);
                  verifyJson[ md5Path ] = md5;
                  countDown();
                });
              } else if (isDir && !/^\./i.test(filename)) {
                fileDetect(filePath, (err) => {
                  countDown();
                });
              }
            }
          });

        });

      });
    }

    new Promise((resolve, reject) => {
      fileDetect(rootFolderPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(verifyJson);
        }
      });
    });

  },


};
