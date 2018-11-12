import Vue from 'vue';
import grayRandomVue from './grayRandom.vue';


const grayRandom = Vue.extend(grayRandomVue);

var instance = false;
export default function(options){

  if (!instance){
    var  dialogComponent =  new grayRandom({el: document.createElement('div')});
    instance = dialogComponent;
  }

  instance.random = options.random || 0.1;

  if(options.callback){
    instance.callback = function (action , random){
      options.callback(action , random)
    }
  } else {
    instance.callback = null;
  }

  document.body.appendChild(instance.$el);

  Vue.nextTick(() => {
    instance.isShow = true;
  });


}
