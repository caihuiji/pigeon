const Controller = require('egg').Controller;

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
}


module.exports = HomeController;
