const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');

class HomeController extends Controller {

  async index() {
    await this.ctx.render('detail.tpl', {});
  }

  async list() {
    this.ctx.body = {
      ret: 0, data: [
        { id: 1, create_time: new Date() - 0, update_time: new Date() - 0, version: 'sdfsdfsdf', status: 1 },
        { id: 2, create_time: new Date() - 0, update_time: new Date() - 0, version: 'sdfsdfsdf', status: 2 },
        { id: 3, create_time: new Date() - 0, update_time: new Date() - 0, version: 'sdfsdfsdf', status: 3 },
        { id: 4, create_time: new Date() - 0, update_time: new Date() - 0, version: 'sdfsdfsdf', status: 4 },
        { id: 5, create_time: new Date() - 0, update_time: new Date() - 0, version: 'sdfsdfsdf', status: 5 },
      ] };
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
    } catch (err) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      throw err;
    }
    ctx.body = stream.fields;
  }
}

module.exports = HomeController;
