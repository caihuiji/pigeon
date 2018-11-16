const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write;
const awaitReadStream = require('await-stream-ready').read;
const sendToWormhole = require('stream-wormhole');
const mongo = require('mongodb');
const unzip = require('unzip');
const archiver = require('archiver');
const request = require('request');


const appendVersionFile = async (filePath, versionFileStr, ctx) => {
  const archive = archiver('zip');
  ctx.logger.info('unzip file :' + filePath);
  const folderPath = filePath.replace('.zip', '/');
  await fs.createReadStream(filePath).pipe(unzip.Extract({ path: folderPath }));
  await awaitReadStream(fs.createReadStream(filePath).pipe(unzip.Parse()));

  const versionWrite = fs.createWriteStream(path.join(folderPath, 'config.json'));
  versionWrite.write(JSON.stringify(versionFileStr));
  versionWrite.end('');

  const versionWritePromise = new Promise((resolve, reject) => {
    versionWrite.on('finish', () => {
      resolve();
    });
    versionWrite.on('error', () => {
      reject({});
    });
  });

  await versionWritePromise;

  const verPath = filePath.replace('.zip', '_ver.zip');
  ctx.logger.info('archive file :' + verPath);
  const zipStream = fs.createWriteStream(verPath);
  archive.pipe(zipStream);
  archive.directory(folderPath);
  archive.finalize();

  const zipWritePromise = new Promise((resolve, reject) => {
    zipStream.on('finish', () => {
      resolve({ filepath: verPath });
    });
    zipStream.on('error', () => {
      reject();
    });
  });

  return zipWritePromise;

};

const publishToCdn = function(filePath, loginname, ctx) {
  ctx.logger.info('should publish filepath : ', filePath);
  return new Promise(function(resolve, reject) {
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
        cookie: `account=${loginname}`,
      },
    }, function(err, res, body) {
      if (err) {
        ctx.logger.error('upload failed:', err);
        reject({ error_code: -1 });
      } else if (body.header.error_code !== 0) {
        reject({ error_code: body.header.error_code });
      } else {
        resolve(body);
      }
    });
  });

};


const publishToFetchSvr = async function(refer_id, ctx) {
  if (!refer_id) {
    return {};
  }


  let testOne = await this.app.mongooseDB.db.collection('package').findOne(
    { refer_id, status: 2 }
  );

  let grayOne = await this.app.mongooseDB.db.collection('package').findOne(
    { refer_id, status: 3 }
  );

  let publishedOne = await this.app.mongooseDB.db.collection('package').find(
    { refer_id, status: 4 }
  ).sort({ update_time: -1 })
    .toArray();


  testOne = testOne || {};
  grayOne = grayOne || {};
  publishedOne = publishedOne && publishedOne.length ? publishedOne[0] : {};

  const syncJson = {
    offid: refer_id,
    test: { version: testOne.version || 0, url: testOne.cdn_url || '' },
    gray: { version: grayOne.version || 0, url: grayOne.cdn_url || '', random: grayOne.random || 0 },
    official: { version: publishedOne.version || 0, url: publishedOne.cdn_url },
  };

  ctx.logger.info('sync info :', syncJson);

  return new Promise((resolve, reject) => {
    request.post({
      url: 'http://127.0.0.1:13082/wework_admin/offline_sync',
      method: 'POST',
      json: true,
      timeout: 10000, // 10s
      form: {
        data: syncJson,
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
        'Content-type': 'application/x-www-form-urlencoded',
        origin: 'https://work.weixin.qq.com',
        referer: 'https://work.weixin.qq.com',
      },
    }, function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });

};

class DetailController extends Controller {

  async index(ctx) {
    await this.ctx.render('detail.tpl', { refer_id: ctx.request.query.id, userInfo: ctx.session || {} });
  }

  async list(ctx) {
    return this.app.mongooseDB.db.collection('package').find({ refer_id: ctx.request.query.refer_id }).toArray()
      .then(data => {
        return this.app.mongooseDB.db.collection('project').findOne(
          {
            _id: mongo.ObjectID(ctx.request.query.refer_id),
          }).then(function(findOne) {
          return { list: data, current_version: findOne.current_version };
        });
      })
      .then(data => {

        ctx.body = {
          ret: 0, data,
        };
      });
  }

  async create(ctx) {
    const stream = await ctx.getFileStream();
    // 上传基础目录
    const uplaodBasePath = 'app/public/upload/';

    const nowDate = new Date();
    const dirName = nowDate.getFullYear() + '' + (nowDate.getMonth() + 1);
    const filename = Date.now() + '_' + Math.round(Math.random() * 10000) + path.extname(stream.filename);

    const targetFolderPath = path.join(this.config.baseDir, uplaodBasePath, dirName);
    if (!fs.existsSync(targetFolderPath)) fs.mkdirSync(targetFolderPath);
    const targetPath = path.join(targetFolderPath, filename);
    const writeStream = fs.createWriteStream(targetPath);

    try {
      // 写入文件
      await awaitWriteStream(stream.pipe(writeStream));

      this.ctx.logger.info(mongo.ObjectID(stream.fields.refer_id));

      const version = (stream.fields.refer_id || '').substr(-5) + (nowDate - 0);

      const appendResult = await appendVersionFile(targetPath, { version, create_time: nowDate - 0 }, ctx);


      if (!appendResult.filepath) {
        ctx.body = { ret: -2 };
        return;
      }

      const loginname = ctx.session && ctx.session.loginname ? ctx.session.loginname : 'chriscai';
      const publishResult = await publishToCdn(appendResult.filepath, loginname, this.ctx);

      if (!publishResult.data) {
        ctx.body = { ret: -401 };
        return;
      }

      // ctx.body = { ret: 0 };
      return this.app.mongooseDB.db.collection('package').insertOne({
        refer_id: stream.fields.refer_id,
        version,
        cdn_url: publishResult.data,
        file_size: stream.fields.file_size || 0,
        create_time: nowDate - 0,
        status: 1,
        update_time: nowDate - 0,
      }).then(() => {


        ctx.body = { ret: 0 };
      });

    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      throw err;
    }
  }

  async deletePackage(ctx) {
    return this.app.mongooseDB.db.collection('package').findOneAndDelete({
      _id: mongo.ObjectID(ctx.request.body.id),
    })
      .then(data => {
        return this.app.mongooseDB.db.collection('project').findOneAndUpdate(
          {
            _id: mongo.ObjectID(data.value.refer_id),
          }, {
            $set: {
              current_version: 0,
            } }
        );
      })
      .then(() => {
        ctx.body = { ret: 0 };
      });
  }

  async recallPackage(ctx) {
    let refer_id;
    const findOne = await this.app.mongooseDB.db.collection('package').findOne(
      { _id: mongo.ObjectID(ctx.request.body.id) }
    );

    if (findOne) {
      await this.app.mongooseDB.db.collection('package').findOneAndUpdate(
        { _id: mongo.ObjectID(ctx.request.body.id) },
        { $set: { status: 5, random: 0, update_time: new Date() - 0 } }
      ).then(data => {

        refer_id = data.value.refer_id;
        return this.app.mongooseDB.db.collection('project').findOneAndUpdate(
          {
            _id: mongo.ObjectID(data.value.refer_id),
          }, {
            $set: {
              current_version: 0,
            } }
        );
      });
      ctx.body = { ret: 1 };

      publishToFetchSvr.apply(this, [ refer_id, ctx ]);
    } else {
      ctx.body = { ret: -30001 };
    }
  }


  async testPublishPackage(ctx) {
    let refer_id;
    const findOne = await this.app.mongooseDB.db.collection('package').findOne(
      { _id: mongo.ObjectID(ctx.request.body.id) }
    );

    if (findOne) {
      await this.app.mongooseDB.db.collection('package').findOneAndUpdate(
        { _id: mongo.ObjectID(ctx.request.body.id) },
        { $set: { status: 2, random: 0, update_time: new Date() - 0 } }
      ).then(data => {
        refer_id = data.value.refer_id;
        return this.app.mongooseDB.db.collection('project').findOneAndUpdate(
          {
            _id: mongo.ObjectID(data.value.refer_id),
          }, {
            $set: {
              current_version: data.value.version,
            } }
        );
      });

      publishToFetchSvr.apply(this, [ refer_id, ctx ]);

      ctx.body = { ret: 1 };
    } else {
      ctx.body = { ret: -30001 };
    }
  }

  async publishPackage(ctx) {
    let refer_id;
    const findOne = await this.app.mongooseDB.db.collection('package').findOne(
      { _id: mongo.ObjectID(ctx.request.body.id) }
    );

    if (findOne) {
      await this.app.mongooseDB.db.collection('package').findOneAndUpdate(
        { _id: mongo.ObjectID(ctx.request.body.id) },
        { $set: { status: ctx.request.body.random === 1 ? 4 : 3, random: ctx.request.body.random || 0, update_time: new Date() - 0 } }
      ).then(data => {
        refer_id = data.value.refer_id;
        if (ctx.request.body.random === 1) {
          return this.app.mongooseDB.db.collection('project').findOneAndUpdate(
            {
              _id: mongo.ObjectID(data.value.refer_id),
            }, {
              $set: {
                current_version: 0,
              } }
          );
        }
        return {};

      });

      ctx.body = { ret: 1 };

      publishToFetchSvr.apply(this, [ refer_id, ctx ]);
    } else {
      ctx.body = { ret: -30001 };
    }
  }
}

module.exports = DetailController;
