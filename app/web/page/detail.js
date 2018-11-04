import Vue from 'vue';
import Detail from './detail/detail.vue'

import util from '../../public/js/lib/util.js'

Vue.filter('formatDate' , util.formatDate);

new Vue({
    el: '#js-main',
    data: {
        message: 'Hello Vue!'
    },
    template: '<Detail/>',
    components: { Detail }
});
