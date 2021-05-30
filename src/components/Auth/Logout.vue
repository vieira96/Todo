<template>
    <div class="min-h-screen w-full flex justify-center items-center">
        <img
            v-if="spinner.logout"
            src="@/assets/img/spinner.svg"
            alt=""
            class="w-32 h-32"
        >
    </div>
</template>
<script>
    import Cookie from '@/service/cookie';
    
    export default {
        data() {
            return {
                spinner: {
                    logout: true
                }
            }
        },
        methods: {
            logout() {
                this.$axios.get('/v1/logout').then(() => {
                    Cookie.deleteToken();
                }).finally(() => {
                    this.$router.push({name: 'login'});
                })
            }
        },
        created() {
            this.logout();
        }    
    }
</script>