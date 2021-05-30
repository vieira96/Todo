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
import Profile from '@/views/Profile';
import NotFound from '@/views/404';
import Todo from '@/views/Todo'
import Guard from '@/service/middleware';
import Logout from '@/components/Auth/Logout';

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
        beforeEnter: Guard.redirectIfAuthenticated,
        children: [
            { path: '', name: 'register', component: Register },
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
        beforeEnter: Guard.redirectIfAuthenticated,
        children: [
            { path: '', name: 'forgotPassword', component: ForgotPassword }
        ]
    },
    {
        path: '/reset-password', component: LayoutAuth,
        children: [
            { path: '', name: 'resetPassword', component: ResetPassword }
        ]
    },
    {
        path: '/profile', component: layoutDefault,
        beforeEnter: Guard.redirectIfNotAuthenticated,
        children: [
            { 
                path: '', name: 'profile', component: Profile,
            }
        ]
    },
    {
        path: '/logout', name: 'logout', component: Logout,
        beforeEnter: Guard.redirectIfNotAuthenticated,
    },

    {
        path: '/todo/:todoId', component: layoutDefault,
        beforeEnter: Guard.redirectIfNotAuthenticated,
        children: [
            { path: '', name: 'todo', component: Todo }
        ]
    },
    {
        path: '*', component: layoutDefault,
        beforeEnter: Guard.redirectIfNotAuthenticated,
        children: [
            { path: '', name: '404', component: NotFound}
        ]
    }

];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;