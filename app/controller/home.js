const Controller = require('egg').Controller;
const mongo = require('mongodb');

class HomeController extends Controller {

  async index() {
    await this.ctx.render('home.tpl', {});
  }

  async list(ctx) {

    return this.app.mongooseDB.db.collection('project').find().toArray()
      .then(data => {
        ctx.body = {
          ret: 0, data };
      });


  }

  async create(ctx) {
    return this.app.mongooseDB.db.collection('project').insertOne({
      name: ctx.request.body.name,
      desc: ctx.request.body.desc,
      admin: ctx.request.body.admin,
      create_time: new Date() - 0,
    }).then(() => {
      ctx.body = { ret: 0 };
    });
  }

  async deleteProject(ctx) {
    return this.app.mongooseDB.db.collection('project').findOneAndDelete({
      _id: mongo.ObjectID(ctx.request.body.id),
    }).then(() => {
      ctx.body = { ret: 0 };
    });
  }
}


module.exports = HomeController;
