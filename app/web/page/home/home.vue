<template>
    <div id="js-app">
        <table class="table table-hover">
            <thead>
            <tr >
                <th style="width:80px;">#</th>
                <th >项目</th>
                <th style="width:120px;">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th scope="row">1</th>
                <td>运营活动A</td>
                <td>
                    <a href="javascript:;">查看</a> | <a href="javascript:;">编辑</a>
                </td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>运营活动A</td>
                <td>
                    <a href="javascript:;">查看</a> | <a href="javascript:;">编辑</a>
                </td>
            </tr>
            <tr>
                <th scope="row">3</th>
                <td>运营活动A</td>
                <td>
                    <a href="javascript:;">查看</a> | <a href="javascript:;">编辑</a>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

  import axios from 'axios';

  axios.defaults.baseURL = '/';
  axios.defaults.timeout = 3000;
  axios.defaults.xsrfHeaderName = 'x-csrf-token';
  axios.defaults.xsrfCookieName = 'csrfToken';

    export default {
        name: 'js-app',
        data () {
            return {
                msg: 'Welcome to Your Vue.js'
            }
        },

        created () {
          this.fetchData();
        },
        methods: {
            async fetchData() {
                const data = await getData();
                this.msg = data;
            }
        }
    }
</script>

