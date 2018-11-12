<template>
    <div  v-show="isShow">
        <div class="modal fade "  tabindex="-1"  style="display: block">
            <div class="modal-dialog" >
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" v-on:click="handleAction(false)" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title"  style="font-size:12px;">选择灰度范围</h4>
                    </div>
                    <div class="modal-body" style="font-size:15px;">
                        <span>请选择灰度范围：</span><select v-model="random" >
                        <option value="0.1"> 10% </option>
                        <option value="0.2"> 20% </option>
                        <option value="0.3"> 30% </option>
                        <option value="0.4"> 40% </option>
                        <option value="0.5"> 50% </option>
                        <option value="0.6"> 60% </option>
                        <option value="0.7"> 70% </option>
                        <option value="0.8"> 80% </option>
                        <option value="0.9"> 90% </option>
                    </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" @click="handleAction(false)">取消</button>
                        <button type="button  "  class="btn btn-primary" @click="handleAction(true)">确定</button>
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
        isShow : false,
        random : 0.1
      }
    },
    methods: {
      handleAction (action){
        this.isShow = false;
        if(this.callback){
          this.callback(action , this.random - 0);
        }
      },

    }

  }
</script>

