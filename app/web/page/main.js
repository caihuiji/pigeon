import Vue from 'vue';
import Home from './home/home.vue'


new Vue({
    el: '#js-main',
    data: {
        message: 'Hello Vue!'
    },
    template: '<Home/>',
    components: { Home }
});
