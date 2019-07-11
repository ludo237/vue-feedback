'use strict';

export default {
    store: payload => window.Axios.post('https://my-json-server.typicode.com/ludo237/vue-feedback/feedback', payload),
};
