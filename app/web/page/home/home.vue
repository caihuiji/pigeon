<template>
    <div id="js-app">
        <div class="operate-bar" v-if="list.length">
            <a class="btn btn-default btn-sm btn-outline-primary" href="javascript:;" v-on:click="showModalDialog" >添加</a>
        </div>

        <table v-if="list.length" class="table table-hover">
            <thead>
            <tr >
                <th style="width:80px;">#</th>
                <th style="width:200px;">名称</th>
                <th >描述</th>
                <th style="width:160px;">负责人</th>
                <th style="width:120px;">创建时间</th>
                <th style="width:200px;">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in list">
                <th scope="row">{{index+1}}</th>
                <td>{{item.name}}</td>
                <td>{{item.desc}}</td>
                <td>{{item.admin}}</td>
                <td>{{item.create_time | formatDate('yyyy-MM-dd') }}  </td>
                <td>
                    <a :href="'/detail?id=' + item._id + '&prj_name=' + encodeURIComponent(item.name)">查看</a> | <a @click="showEditModalDialog(item._id)" href="javascript:;">编辑</a> | <a @click="deleteProject" :data-id="item._id" href="javascript:;">删除</a>
                </td>
            </tr>
            </tbody>
        </table>
        <div v-else>
            <div style="text-align: center;padding-top:50px;">
                尚未添加过项目，请 <a class="" href="javascript:;" v-on:click="showModalDialog" >添加项目</a>
            </div>
        </div>


        <div :class="['modal','fade' ]"  id="js_createProjectModal" tabindex="-1">
            <div class="modal-dialog" role="document">
                <form @submit.prevent="addProject">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" v-on:click="closeModalDialog" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title" id="myModalLabel">添加项目</h4>
                        </div>
                        <div class="modal-body">
                                <div :class="['form-group' , nameErr ? 'has-error' : '']" >
                                    <label class="control-label" for="project-name">项目名称</label>
                                    <input type="text" class="form-control" id="project-name" v-model="project.name" placeholder="项目名称">
                                    <span  class="help-block">请填写2~20个字符</span>
                                </div>
                                <div :class="['form-group' , descErr ? 'has-error' : '']">
                                    <label class="control-label" for="project-desc">项目描述</label>
                                    <textarea style="resize: none" type="text" class="form-control" v-model="project.desc" id="project-desc" placeholder="项目描述"></textarea>
                                    <span  class="help-block">最多填写50个字符</span>
                                </div>
                                <div :class="['form-group' , adminErr ? 'has-error' : '']">
                                    <label class="control-label" for="project-admin">项目负责人</label>
                                    <input type="text" class="form-control" id="project-admin" v-model="project.admin" placeholder="项目负责">
                                    <span  class="help-block">至少填写一个负责人</span>
                                </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal" v-on:click="closeModalDialog">取消</button>
                            <input  class="btn btn-primary" type="submit"  value="添加">
                        </div>
                    </div>
                    <input type="hidden"  v-model="project.id || ''" >
                </form>
            </div>
        </div>
        <div class="modal-backdrop fade " id="js_modal" style="display: none"></div>
    </div>


</template>

<script>

    import axios from 'axios';
    import dialog from './../../component/dialog.js'


    export default {
        name: 'js-app',
        data () {
            return {
              list : [],
              nameErr : false,
              descErr : false,
              adminErr : false,
              project : {
                  name : '',
                  desc : '',
                  admin : '',
                  id : null,
              },
              dialogOption: {},
            }
        },

        created () {
          this.fetchData();
        },
        methods: {
            async fetchData() {
              return axios.get('/home/list' )
                .then(data => {
                  const list = data.data.data;
                  this.list = list;
                })
            },

            async saveData(formData) {
                return axios.post('/home/save' , formData)
                    .then(data => {
                        this.closeModalDialog();
                        this.fetchData();
                    })
            },

            showModalDialog (){
                this.project.name = "";
                this.project.desc = "";
                this.project.id = null;
                this.project.admin = window.userName + ';';
                this.nameErr = false;
                this.descErr = false;
                this.adminErr = false;

                document.body.classList.add('modal-open');
                let dialog = document.querySelector('#js_createProjectModal');
                let modal = document.querySelector('#js_modal')
                dialog.style.display = "block";
                modal.style.display = "block";
                setTimeout( () => {
                    dialog.classList.add('in');
                    modal.classList.add('in');
                },100)
            },

            showEditModalDialog (itemId){
              var matchItem ;
              (this.list || []).forEach((item)=>{
                if(item._id == itemId){
                    matchItem = item;
                }
              });

              if(!matchItem){
                return;
              }

              this.project.name = matchItem.name;
              this.project.desc = matchItem.desc;
              this.project.admin = matchItem.admin;
              this.project.id = matchItem._id;

              this.nameErr = false;
              this.descErr = false;
              this.adminErr = false;

              document.body.classList.add('modal-open');
              let dialog = document.querySelector('#js_createProjectModal');
              let modal = document.querySelector('#js_modal')
              dialog.style.display = "block";
              modal.style.display = "block";
              setTimeout( () => {
                dialog.classList.add('in');
                modal.classList.add('in');
              },100)
            },

            closeModalDialog (){
                document.body.classList.add('modal-open');
                let dialog = document.querySelector('#js_createProjectModal');
                let modal = document.querySelector('#js_modal')
                dialog.classList.remove('in');
                modal.classList.remove('in');

                setTimeout( () => {
                    dialog.style.display = "none";
                    modal.style.display = "none";
                },300)
            },

            validateFormData (formData){
                if (formData.name.length <2 || formData.name.length >12){
                    this.nameErr = true;
                } else {
                    this.nameErr = false;
                }

                if (formData.desc.length > 50){
                    this.descErr = true;
                } else {
                    this.descErr = false;
                }

                if (formData.admin.length <= 0){
                    this.adminErr = true;
                } else {
                    this.adminErr = false;
                }

                return !(this.nameErr || this.descErr || this.adminErr);
            },

            addProject (event){
                if (this.validateFormData(this.project) ){
                    this.saveData(  this.project );
                }
            },

            deleteProject (event){
              var self = this;
              dialog({
                type : "confirm",
                title : "提示",
                text : "确认要删除这个项目吗？其下的离线包也会全部删除！！",
                callback (confirm){
                  if(confirm){
                    return axios.post('/home/delete' , {id : event.target.getAttribute('data-id') })
                      .then(data => {
                        self.fetchData();
                      })
                  }
                }
              });
            },


        }
    }
</script>

