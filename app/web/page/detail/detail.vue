<template>
    <div id="js-app">
        <div class="operate-bar" >
            <div style="position: relative;overflow: hidden;pointer:cur">
                <a class="btn btn-default btn-sm btn-outline-primary">上传离线包 (*.zip) </a>
                <input class="qui_btn ww_btn ww_fileInputWrap" v-on:change="handleFileChange" href="javascript:;" id="js_upload_file_input" type="file" name="file" value="上传文件"  style="position: absolute;height: 640%;width: 500%;top: 0;right: 0;filter: alpha(opacity=0);padding: 0;margin: 0;opacity: 0;cursor: pointer;">
            </div>
        </div>
        <table v-if="list.length" class="table table-hover">
            <thead>
            <tr >
                <th style="width:50px;">#</th>
                <th style="width:200px;">离线包-version</th>
                <th style="width:200px;">创建时间</th>
                <th style="width:200px;">变更时间</th>
                <th style="width:200px;">状态</th>
                <th >操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in list">
                <td>{{index+1}}</td>
                <td>{{item.version}}</td>
                <td>{{item.create_time | formatDate('yyyy-MM-dd hh:mm')}}</td>
                <td>{{item.update_time | formatDate('yyyy-MM-dd hh:mm')}}</td>
                <td>
                    <span v-if="item.status == 2">测试发布中</span>
                    <span v-else-if="item.status == 3"> 灰度发布中</span>
                    <span v-else-if="item.status == 4">已发布</span>
                    <span v-else-if="item.status == 5">撤回</span>
                    <span v-else >未发布</span>
                </td>
                <td class="operate-td">
                    <span v-if=" current_version && current_version!= 0 && item.version != current_version" style="color: #8d8d8d;">
                        &nbsp;version：{{current_version}} 发布中
                    </span>
                    <span v-else-if="item.status == 2">
                        <a @click="grayPublishPackage" :data-id="item._id" href="javascript:;">灰度发布</a>| <a @click="deletePackage" :data-id="item._id" href="javascript:;">撤回</a> | <a :href="item.cdn_url">下载</a>
                    </span>
                    <span v-else-if="item.status == 3">
                           <a @click="grayPublishPackage($event, item.random)" :data-id="item._id" href="javascript:;">继续灰度发布</a> | <a @click="publishPackage" :data-id="item._id" href="javascript:;">正式发布</a> | <a @click="recallPackage"  :data-id="item._id" href="javascript:;">撤回</a> | <a :href="item.cdn_url">下载</a>
                    </span>
                    <span v-else-if="item.status == 4">
                          <a @click="recallPackage" :data-id="item._id" href="javascript:;">撤回</a> | <a :href="item.cdn_url">下载</a>
                    </span>
                    <span v-else >
                         <a @click="testPublishPackage" :data-id="item._id" href="javascript:;">测试发布</a> | <a @click="deletePackage" :data-id="item._id" href="javascript:;">删除</a> |<a :href="item.cdn_url">下载</a>
                    </span>
                </td>

            </tr>
            </tbody>
        </table>
        <div v-else>
            <div style="text-align: center;padding-top:50px;">
                尚未添加过离线包，请点击右上角上传离线包
            </div>
        </div>

    </div>
</template>

<script>

    import axios from 'axios';
    import dialog from './../../component/dialog.js'
    import grayRandom from './../../component/grayRandom.js'

    export default {
        name: 'js-app',
        data () {
            return {
                list : [],
                current_version : 0
            }
        },

        created () {
            this.fetchData();
        },
        methods: {
            async fetchData() {
                return axios.get('/detail/list?refer_id=' + window.refer_id )
                    .then(data => {
                        const list = data.data.data.list;
                        this.current_version = data.data.data.current_version;
                        this.list = list;
                    })
            },
            async uploadFile (file){

                let formData = new FormData();
                formData.append('name', file.name);
                formData.append('file', file);
                formData.append('refer_id', window.refer_id);
                formData.append('file_size', file.size);

                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }

                return axios.post('/detail/create', formData , config)
                    .then(data => {
                        this.fetchData();
                    }).catch((e)=>{
                        dialog({
                            type : "alert",
                            title : "提示",
                            text : "上传失败，请重试！",
                            callback (confirm){
                            }
                        });
                    })

            },
            handleFileChange (e){
                let input = e.target;
                let file = input.files[0];

                let clearFileValue = () =>{
                    setTimeout(function () {
                        input.value = '';
                    }, 500);
                }

                if (!/\.zip$/gi.test(file.name)) {
                    clearFileValue();
                    return ;
                }

                this.uploadFile(file)
                    .then(()=> {
                        clearFileValue();
                    })
            },
            grayPublishPackage (event , random){
              var self = this;
              grayRandom({
                random : random,
                callback (confirm , random){
                  if(confirm){
                    return axios.post('/detail/publishPackage' , {id : event.target.getAttribute('data-id') ,random : random })
                      .then(res => {
                        if(res.data.ret == 1){
                            self.fetchData();
                        } else {
                          dialog({
                            type : "alert",
                            title : "警告",
                            text : "灰度发布失败，请重新发布",
                          });
                        }
                      })
                  }
                }
              });

            },
            publishPackage (event){
              var self = this;
              dialog({
                type : "confirm",
                title : "正式发布",
                text : "确定要正式发布离线包吗？",
                callback (confirm){
                  if(confirm){
                    return axios.post('/detail/publishPackage' , {id : event.target.getAttribute('data-id') ,random : 1 })
                      .then(res => {
                        if(res.data.ret == 1){
                          self.fetchData();
                        } else {
                          dialog({
                            type : "alert",
                            title : "警告",
                            text : "正式发布失败，请重新发布",
                          });
                        }
                      })
                  }
                }
              });
            },
            recallPackage(event){
              var self = this;
              dialog({
                type : "confirm",
                title : "撤回",
                text : "确定要撤回离线包吗？",
                callback (confirm){
                  if(confirm){
                    return axios.post('/detail/recallPackage' , {id : event.target.getAttribute('data-id') ,random : 1 })
                      .then(res => {
                        if(res.data.ret == 1){
                          self.fetchData();
                        } else {
                          dialog({
                            type : "alert",
                            title : "警告",
                            text : "撤回失败，请重新撤回",
                          });
                        }
                      })
                  }
                }
              });
            },
            testPublishPackage(event){
              var self = this;
              dialog({
                type : "confirm",
                title : "测试发布",
                text : "确定要测试发布离线包吗？",
                callback (confirm){
                  if(confirm){
                    return axios.post('/detail/testPublishPackage' , {id : event.target.getAttribute('data-id')  })
                      .then(res => {
                        if(res.data.ret == 1){
                          self.fetchData();
                        } else {
                          dialog({
                            type : "alert",
                            title : "警告",
                            text : "测试发布失败，请重新发布",
                          });
                        }
                      })
                  }
                }
              });

            },
            deletePackage(event){
              var self = this;
              dialog({
                type : "confirm",
                title : "提示",
                text : "确定删除这个离线包吗？",
                callback (confirm){
                  if(confirm){
                    return axios.post('/detail/deletePackage' , {id : event.target.getAttribute('data-id') })
                      .then(data => {
                        self.fetchData();
                      })
                  }
                }
              });

            }
        }
    }
</script>

