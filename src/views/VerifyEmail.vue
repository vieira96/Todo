<template>
    <div class="flex justify-center items-center">
        <img v-if="spinner" src="@/assets/img/spinner.svg" alt="">
        <div v-else :class="`p-4 w-full border border-${response.color}-700 bg-${response.color}-200 flex `">
            <span :class="`text-${response.color}-900 flex-1`">{{response.message}}</span>
            <span v-if="!error" :class="`text-${response.color}-900 `">{{timer}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'VerifyEmail',

    data() {
        return {
            token: '',
            response: {
                message: '',
                color: '',
            },
            spinner: true,
            error: false
        }
    },

    created() {
        this.token = this.$route.query.token;
        this.verifyEmail();
    },

    beforeRouteEnter(to, from, next) {
        if(! to.query.token) {
            next({name: 'login'})
        }
        next();
    },

    methods: {
        verifyEmail(){ 
            this.$axios.post('/v1/verify-email', {token: this.token}).then(() => {
                this.spinner = false;
                this.response.color = 'green';
                this.response.message = "E-mail verificado com sucesso";
            }).catch((e) => {
                this.spinner = false;
                this.response.message = e.response.data.message;
                this.response.color = 'red';
                this.error = true
            })
        },
    }
}
</script>

<style>

</style>