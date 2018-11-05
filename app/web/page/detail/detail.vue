<template>
    <div id="js-app">
        <div class="operate-bar">
            <a class="btn btn-default btn-sm btn-outline-primary" href="#" role="button">添加</a>
        </div>
        <table class="table table-hover">
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
            }
        }
    }
</script>

