<template>
    <div  v-show="isShow">
        <div class="modal fade "  tabindex="-1"  style="display: block">
            <div class="modal-dialog" >
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" v-on:click="handleAction(false)" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title"  style="font-size:12px;">{{ title }}</h4>
                        </div>
                        <div class="modal-body" style="font-size:15px;">
                            {{ text }}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" @click="handleAction(false)">{{ cancelButtonText  }}</button>
                            <button type="button  " v-show="type == 'confirm'" class="btn btn-primary" @click="handleAction(true)">{{ confirmButtonText }}</button>
                        </div>
                    </div>
            </div>
        </div>
        <div class="modal-backdrop fade "  style="display: block"></div>
    </div>
</template>

<script>
  export default {
    props: {
    },

    updated (){
      var self = this;
      setTimeout(()=>{
        if (self.isShow) {
            self.$el.querySelector('.modal').classList.add('in');
            self.$el.querySelector('.modal-backdrop').classList.add('in');
        } else {
            self.$el.querySelector('.modal').classList.remove('in');
            self.$el.querySelector('.modal-backdrop').classList.remove('in');
        }
      },100)
    },

    data() {
      return {
        title:  '提示',
        text: '这是dialog',
        cancelButtonText:  '取消',
        confirmButtonText:  '确定',
        isShow : false,
        type: 'alert'
      }
    },
    methods: {
      handleAction (action){
        this.isShow = false;
        if(this.callback){
            this.callback(action);
        }
      },

    }

  }
</script>

