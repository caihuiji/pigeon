<template>
    <div id="js-app">
        <div class="operate-bar">
            <a class="btn btn-default btn-sm btn-outline-primary" href="javascript:;" v-on:click="showModalDialog" >添加</a>
        </div>
        <table class="table table-hover">
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
                <td>{{item.create_time | formatDate('yyyy-MM-dd') }}</td>
                <td>
                    <a href="/detail?id=item.id">查看</a> | <a href="javascript:;">编辑</a>
                </td>
            </tr>
            </tbody>
        </table>

        <div :class="['modal','fade' ]"  id="js_createProjectModal" tabindex="-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" v-on:click="closeModalDialog" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">添加项目</h4>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="project-name">项目名称</label>
                                <input type="text" class="form-control" id="project-name" placeholder="项目名称">
                            </div>
                            <div class="form-group">
                                <label for="project-desc">项目描述</label>
                                <textarea style="resize: none" type="text" class="form-control" id="project-desc" placeholder="项目描述"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="project-admin">项目负责人</label>
                                <input type="text" class="form-control" id="project-admin" placeholder="项目负责人">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal" v-on:click="closeModalDialog">取消</button>
                        <button type="button" class="btn btn-primary" v-on:click="addProject">添加</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade " id="js_modal" style="display: none"></div>
    </div>


</template>

<script>

    import axios from 'axios';

    export default {
        name: 'js-app',
        data () {
            return {
              list : [],
            }
        },

        created () {
          this.fetchData();
        },
        methods: {
            async fetchData() {
              return axios.get('/home/list')
                .then(data => {
                  const list = data.data.data;
                  this.list = list;
                })
            },

            async saveData(data) {
                return axios.get('/home/list')
                    .then(data => {
                        const list = data.data.data;
                        this.list = list;
                        this.closeModalDialog();
                    })
            },

            showModalDialog (){
                document.body.classList.add('modal-open');
                let dialog = document.querySelector('#js_createProjectModal');
                let modal = document.querySelector('#js_modal')
                dialog.style.display = "block";
                modal.style.display = "block";
                setTimeout( () => {
                    dialog.classList.add('in');
                    modal.classList.add('in');
                },300)
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

            addProject (){
                this.saveData();
            }

        }
    }
</script>

