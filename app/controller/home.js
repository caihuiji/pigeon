const Controller = require('egg').Controller;

class HomeController extends Controller {

  async index() {
    await this.ctx.render('home.tpl', {});
  }

  async list() {
    this.ctx.body = {
      ret: 0, data: [
      ] };
  }

  async create(ctx) {
    ctx.logger.info('request data: %j', ctx.request.body);
    ctx.body = { ret: 0 };
  }
}


module.exports = HomeController;
