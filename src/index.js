import Vue from "vue";
import Axios from 'axios';

window.Axios = Axios;
window.Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.Vue = Vue;
window.Vue.config.productionTip = false;

/**
 * Automagically register vue components that lives inside the ./components directory
 */
const files = require.context('./components/', true, /\.vue$/i);
files.keys().map(key => window.Vue.component(key.split('/').pop().split('.')[0], files(key).default));

const feedback = new window.Vue({
    el: "#app",
});