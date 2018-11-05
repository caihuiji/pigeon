<template>
    <div id="js-app">
        <div class="operate-bar">
            <a class="btn btn-default btn-sm btn-outline-primary" href="#" role="button">添加</a>
        </div>
        <table class="table table-hover">
            <thead>
            <tr >
                <th style="width:80px;">#</th>
                <th >名称</th>
                <th style="width:120px;">负责人</th>
                <th style="width:120px;">创建时间</th>
                <th style="width:200px;">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in list">
                <th scope="row">{{index+1}}</th>
                <td>{{item.name}}</td>
                <td>{{item.admin}}</td>
                <td>{{item.create_time | formatDate('yyyy-MM-dd') }}</td>
                <td>
                    <a href="/detail?id=item.id">查看</a> | <a href="javascript:;">编辑</a>
                </td>
            </tr>
            </tbody>
        </table>
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
              return axios.get('/home/list')
                .then(data => {
                  const list = data.data.data;
                  this.list = list;
                })
            }
        }
    }
</script>

