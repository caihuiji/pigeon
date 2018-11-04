const Controller = require('egg').Controller;

class HomeController extends Controller {

  async index() {
    await this.ctx.render('detail.tpl', {});
  }
}


module.exports = HomeController;
