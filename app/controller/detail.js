const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const mongo = require('mongodb');

class HomeController extends Controller {

  async index(ctx) {
    await this.ctx.render('detail.tpl', { refer_id: ctx.request.query.id });
  }

  async list(ctx) {
    return this.app.mongooseDB.db.collection('offline_package').find({ refer_id: ctx.request.query.refer_id }).toArray()
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
    const filename = Date.now() + '' + Number.parseInt(Math.random() * 10000) + path.extname(stream.filename);

    const targetPath = path.join(this.config.baseDir, uplaodBasePath, dirName);
    if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
    const target = path.join(targetPath, filename);
    const writeStream = fs.createWriteStream(target);

    try {
      // 写入文件
      await awaitWriteStream(stream.pipe(writeStream));

      const count = await this.app.mongooseDB.db.collection('offline_package').find().toArray().length || 0;

      // ctx.body = { ret: 0 };
      return this.app.mongooseDB.db.collection('offline_package').insertOne({
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
    return this.app.mongooseDB.db.collection('offline_package').findOneAndDelete({
      _id: mongo.ObjectID(ctx.request.body.id),
    }).then(() => {
      ctx.body = { ret: 0 };
    });
  }

  async recallPackage(ctx) {
    const findOne = await this.app.mongooseDB.db.collection('offline_package').findOne(
      { _id: mongo.ObjectID(ctx.request.body.id) }
    );

    if (findOne) {
      await this.app.mongooseDB.db.collection('offline_package').findOneAndUpdate(
        { _id: mongo.ObjectID(ctx.request.body.id) },
        { $set: { status: 5, random: 0 } }
      );
      ctx.body = { ret: 1 };
    } else {
      ctx.body = { ret: -30001 };
    }
  }


  async testPublishPackage(ctx) {
    const findOne = await this.app.mongooseDB.db.collection('offline_package').findOne(
      { _id: mongo.ObjectID(ctx.request.body.id) }
    );

    if (findOne) {
      await this.app.mongooseDB.db.collection('offline_package').findOneAndUpdate(
        { _id: mongo.ObjectID(ctx.request.body.id) },
        { $set: { status: 2 , random: 0 } }
      );
      ctx.body = { ret: 1 };
    } else {
      ctx.body = { ret: -30001 };
    }
  }

  async publishPackage(ctx) {
    const findOne = await this.app.mongooseDB.db.collection('offline_package').findOne(
      { _id: mongo.ObjectID(ctx.request.body.id) }
    );

    if (findOne) {
      await this.app.mongooseDB.db.collection('offline_package').findOneAndUpdate(
        { _id: mongo.ObjectID(ctx.request.body.id) },
        { $set: { status: ctx.request.body.random === 1 ? 4 : 3, random: ctx.request.body.random || 0 } }
      );
      ctx.body = { ret: 1 };
    } else {
      ctx.body = { ret: -30001 };
    }
  }
}

module.exports = HomeController;
