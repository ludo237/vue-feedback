import Vue from 'vue';
import Axios from 'axios';
import './assets/tailwind.scss';

window.Axios = Axios;
window.Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

Vue.config.productionTip = false;

const app = new Vue({
    components: {
        Feedback: () => import('./components/Feedback.vue'),
    }
}).$mount('#app');
