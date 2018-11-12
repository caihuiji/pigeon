
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/home/list', controller.home.list);
  router.post('/home/save', controller.home.save);
  router.post('/home/delete', controller.home.deleteProject);
  router.get('/detail', controller.detail.index);

  router.get('/detail/list', controller.detail.list);
  router.post('/detail/create', controller.detail.create);

  router.post('/detail/deletePackage', controller.detail.deletePackage);
  router.post('/detail/testPublishPackage', controller.detail.testPublishPackage);
  router.post('/detail/publishPackage', controller.detail.publishPackage);
  router.post('/detail/recallPackage', controller.detail.recallPackage);


};
