import Vue from 'vue';
import dialogVue from './dialog.vue';


const dialog = Vue.extend(dialogVue);

var instance = false;
export default function(options){

  if (!instance){
    var  dialogComponent =  new dialog({el: document.createElement('div')});
    instance = dialogComponent;
  }

  instance.title = options.title;
  instance.text = options.text;
  instance.type = options.type;
  if(options.cancelButtonText){
    instance.cancelButtonText = options.cancelButtonText;
  }

  if(options.confirmButtonText){
    instance.confirmButtonText = options.confirmButtonText;
  }


  if(options.callback){
    instance.callback = function (action){
      options.callback(action)
    }
  } else {
    instance.callback = null;
  }

  document.body.appendChild(instance.$el);

  Vue.nextTick(() => {
    instance.isShow = true;
  });


}
