import Vue from 'vue';
import Home from './home/home.vue'

import util from '../../public/js/lib/util.js'

Vue.filter('formatDate' , util.formatDate);

new Vue({
    el: '#js-main',
    data: {
        message: 'Hello Vue!'
    },
    template: '<Home/>',
    components: { Home }
});
