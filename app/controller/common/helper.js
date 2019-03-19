const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const privateKeyStr =
  '-----BEGIN PRIVATE KEY-----\n' +
  'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAJwkS0yMpRkpHKSP\n' +
  'XHzm8y3oViSD3mcAonINKgRFJ7j/JYedEB2mci2tjfcP3Pfj1rfhDKccKlTGsVRf\n' +
  'IHXU8/Cz0fzhwtVYtqnpPp22jYfSJ5NRBSu0eKuCGrzSMs2HWrnnihKlFNxr6O4Q\n' +
  'fyB6PRF+OBYf2LTorR4BDIrNpZo7AgMBAAECgYEAjVRss8U6SyPjQTBiTsvcoVkD\n' +
  'X9ncnO7+Gq2/sk3GPrTzi2SnCa92+dF2BoLdR6N63sVdZoUf68xNBkl0YDN4+JwK\n' +
  'dvATMTHe9aMtEcxhmEpzgEbXVrngpPndKDK7Nxf/jSaz8hDOkWxIeQZbzLIzn4KN\n' +
  'rHGSuuALK1XBhWCxJYECQQD3ogI4skxM8SsyNZrP851HLaTL36BpL3NVpWUYxFSf\n' +
  'JXCgV/qL6NP3w0u2L/sdnv+XbTT9ch8dukO0Sh4QbO8DAkEAoWrmWVaLt5C1fw8i\n' +
  'n2WXWwouWJO4/9o6TalucSgjRawQLpMsjQirkffU5t9gaFHmuBfFI174c793LPnS\n' +
  'v/SGaQJBANICl5e1vnfSYCvowi5yEIR49TXhpY0PLOUJq79hYdLGUcnqUxWsk3eg\n' +
  'LOmJr5Hjcifd+f6ndjQj759K7ExJ1jkCQEB4sgh8yNFIuzVElk+UBCAYsOowFnQa\n' +
  'da8PPU10+qGZV91Ca0jpbZ2fnymXjqocDEr7M4ItLI8OqksMfWCuCgECQCSb0MDj\n' +
  'N+ZZfULlXGAYK8XxD/SVIcWAi2s7bDiPmjyFTDfVPPu7tKgPbuQu5UArZJz1Bqoe\n' +
  'csgz655cEXrLqXs=\n' +
  '-----END PRIVATE KEY-----';

module.exports = {
  md5(str) {
    return crypto.createHash('md5')
      .update(str, 'utf8')
      .digest('hex');
  },

  genVerify(ctx, rootFolderPath) {
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

        if (fileLength === 0) {
          callback();
        }

        const countDown = () => {
          fileLength--;
          if (fileLength <= 0) {
            callback();
          }
        };

        files.forEach(filename => {

          const filePath = path.join(folderPath, filename);
          ctx.logger.debug(`  - forEach files ${filePath}`);

          fs.stat(filePath, function(err, stats) {
            if (err) {
              isMatchError = true;
              ctx.logger.error(' - forEach error', err);
              countDown();
            } else {
              const isFile = stats.isFile();
              const isDir = stats.isDirectory();


              if (isFile && /\.(png|jpg|jpeg|gif|html|css|js)$/i.test(filename)) {
                fs.readFile(filePath, (err, data) => {
                  const md5 = self.md5(data);
                  const md5Path = filePath.replace(rootFolderPath, '')
                    .replace(/\\/gi, '/');
                  ctx.logger.info(`md5:  ${md5Path} = ${md5}`);
                  verifyJson[ md5Path ] = md5;
                  countDown();
                });
              } else if (isDir && !/^\./i.test(filename)) {
                fileDetect(filePath, err => {
                  countDown();
                });
              } else {
                countDown();
              }
            }
          });

        });

      });
    }

    return new Promise((resolve, reject) => {
      fileDetect(rootFolderPath, err => {
        if (err) {
          ctx.logger.info('md5 error');
          reject(err);
        } else {
          ctx.logger.info('md5 succ');
          resolve(verifyJson);
        }
      });
    });

  },

  genSignature(ctc, sourceStr) {
    const sign = crypto.createSign('SHA256');
    sign.update(sourceStr);
    return sign.sign(privateKeyStr, 'base64');
  },


};
