import Vue from 'vue';
import App from './home/app.vue'


var app = new Vue({
    el: '#main',
    data: {
        message: 'Hello Vue!'
    },
    template: '<App/>',
});