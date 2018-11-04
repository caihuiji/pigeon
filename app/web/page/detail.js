import Vue from 'vue';
import Detail from './detail/detail.vue'


new Vue({
    el: '#js-main',
    data: {
        message: 'Hello Vue!'
    },
    template: '<Detail/>',
    components: { Detail }
});
