const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write;
const awaitReadStream = require('await-stream-ready').read;
const sendToWormhole = require('stream-wormhole');
const mongo = require('mongodb');
const unzip = require('unzip');
const archiver = require('archiver');



const appendVersionFile = async (filePath, versionFileStr , ctx) => {
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

class DetailController extends Controller {

  async index(ctx) {
    await this.ctx.render('detail.tpl', { refer_id: ctx.request.query.id });
  }

  async list(ctx) {
    return this.app.mongooseDB.db.collection('package').find({ refer_id: ctx.request.query.refer_id }).toArray()
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
    const filename = stream.fields.refer_id + '_' + Date.now() + path.extname(stream.filename);

    const targetFolderPath = path.join(this.config.baseDir, uplaodBasePath, dirName);
    if (!fs.existsSync(targetFolderPath)) fs.mkdirSync(targetFolderPath);
    const targetPath = path.join(targetFolderPath, filename);
    const writeStream = fs.createWriteStream(targetPath);

    try {
      // 写入文件
      await awaitWriteStream(stream.pipe(writeStream));


      const count = await this.app.mongooseDB.db.collection('package').find().toArray().length || 0;
      const version = (count + 1) * 5 + 100;

      const appendResult = await appendVersionFile(targetPath, { version, create_time: nowDate - 0 } , ctx);

      if (!appendResult.filepath) {
        ctx.body = { ret: -2 };
        return;
      }

      // ctx.body = { ret: 0 };
      return this.app.mongooseDB.db.collection('package').insertOne({
        refer_id: stream.fields.refer_id,
        version: (count + 1) * 5 + 100,
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
    }).then(() => {
      ctx.body = { ret: 0 };
    });
  }

  async recallPackage(ctx) {
    const findOne = await this.app.mongooseDB.db.collection('package').findOne(
      { _id: mongo.ObjectID(ctx.request.body.id) }
    );

    if (findOne) {
      await this.app.mongooseDB.db.collection('package').findOneAndUpdate(
        { _id: mongo.ObjectID(ctx.request.body.id) },
        { $set: { status: 5, random: 0 } }
      );
      ctx.body = { ret: 1 };
    } else {
      ctx.body = { ret: -30001 };
    }
  }


  async testPublishPackage(ctx) {
    const findOne = await this.app.mongooseDB.db.collection('package').findOne(
      { _id: mongo.ObjectID(ctx.request.body.id) }
    );

    if (findOne) {
      await this.app.mongooseDB.db.collection('package').findOneAndUpdate(
        { _id: mongo.ObjectID(ctx.request.body.id) },
        { $set: { status: 2, random: 0 } }
      );
      ctx.body = { ret: 1 };
    } else {
      ctx.body = { ret: -30001 };
    }
  }

  async publishPackage(ctx) {
    const findOne = await this.app.mongooseDB.db.collection('package').findOne(
      { _id: mongo.ObjectID(ctx.request.body.id) }
    );

    if (findOne) {
      await this.app.mongooseDB.db.collection('package').findOneAndUpdate(
        { _id: mongo.ObjectID(ctx.request.body.id) },
        { $set: { status: ctx.request.body.random === 1 ? 4 : 3, random: ctx.request.body.random || 0 } }
      );
      ctx.body = { ret: 1 };
    } else {
      ctx.body = { ret: -30001 };
    }
  }
}

module.exports = DetailController;
