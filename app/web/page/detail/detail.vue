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
                <th style="width:80px;">#</th>
                <th style="width:300px;">离线包-version</th>
                <th style="width:280px;">创建时间</th>
                <th style="width:280px;">变更时间</th>
                <th style="width:120px;">状态</th>
                <th >操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in list">
                <td>{{index+1}}</td>
                <td>{{item.version}}</td>
                <td>{{item.create_time | formatDate('yyyy-MM-dd')}}</td>
                <td>{{item.update_time | formatDate('yyyy-MM-dd')}}</td>
                <td>
                    {{item.status}}
                </td>
                <td></td>

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

    export default {
        name: 'js-app',
        data () {
            return {
                list : []
            }
        },

        created () {
            this.fetchData();
        },
        methods: {
            async fetchData() {
                return axios.get('/detail/list')
                    .then(data => {
                        const list = data.data.data;
                        this.list = list;
                    })
            },
            async uploadFile (file){

                let formData = new FormData();
                formData.append('name', file.name);
                formData.append('file', file);

                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }

                return axios.post('/detail/create', formData , config)
                    .then(data => {
                        const list = data.data.data;
                        this.list = list;
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
            }
        }
    }
</script>

