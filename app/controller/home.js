const Controller = require('egg').Controller;

class HomeController extends Controller {

  async index() {
    await this.ctx.render('home/home.tpl', {});
  }
}


module.exports = HomeController;
