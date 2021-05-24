import Vue from 'vue';
import axios from "axios";
import Cookie from '@/service/cookie';

// Full config:  https://github.com/axios/axios#request-config
axios.defaults.baseURL = 'http://localhost/api';
axios.defaults.headers.common['Content-type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

axios.interceptors.request.use(function(config) {
    const token = Cookie.getToken();
    if(token) {
        config.headers.common['Authorization'] = token;
    }

    return config;
})

Vue.prototype.$axios = axios;
