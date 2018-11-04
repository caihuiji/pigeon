const Controller = require('egg').Controller;

class HomeController extends Controller {

  async index() {
    await this.ctx.render('home.tpl', {});
  }

  async list() {
    this.ctx.body = {
      ret: 0, data: [
        { id: 1, create_time: new Date() - 0, name: 'sdfsdfsdf' },
        { id: 2, create_time: new Date() - 0, name: 'sdfsdfsdf' },
        { id: 3, create_time: new Date() - 0, name: 'sdfsdfsdf' },
        { id: 4, create_time: new Date() - 0, name: 'sdfsdfsdf' },
      ] };
  }
}


module.exports = HomeController;
