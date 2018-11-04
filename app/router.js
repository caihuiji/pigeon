
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/home/list', controller.home.list);

  router.get('/detail', controller.detail.index);
  router.get('/detail/list', controller.detail.list);
};
