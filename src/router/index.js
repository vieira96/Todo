import Vue from 'vue';
import VueRouter from 'vue-router';
import LayoutAuth from '@/layouts/Auth';
import layoutDefault from '@/layouts/Default';
import Home from '@/views/Home';
import Login from '@/views/Login';
import Register from '@/views/Register'
import VerifyEmail from '@/views/VerifyEmail'
import ForgotPassword from '@/views/ForgotPassword'
import ResetPassword from '@/views/ResetPassword'
import Guard from '@/service/middleware';
Vue.use(VueRouter);

const routes = [
    {
        path: '/', component: layoutDefault,
        beforeEnter: Guard.redirectIfNotAuthenticated,
        children: [
            { path: '', name: 'home', component: Home}
        ]
    },
    {
        path: '/login', component: LayoutAuth,
        beforeEnter: Guard.redirectIfAuthenticated,
        children: [
            { path: '', name: 'login', component: Login },
        ],
    },
    {
        path: '/register', component: LayoutAuth,
        children: [
            { path: '', name: 'register', component: Register }
        ],
    },
    {
        path: '/verify-email', component: LayoutAuth,
        children: [
            { path: '', name: 'verifyEmail', component: VerifyEmail }
        ]
    },
    {
        path: '/forgot-password', component: LayoutAuth,
        children: [
            { path: '', name: 'forgotPassword', component: ForgotPassword }
        ]
    },
    {
        path: '/reset-password', component: LayoutAuth,
        children: [
            { path: '', name: 'resetPassword', component: ResetPassword }
        ]
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;