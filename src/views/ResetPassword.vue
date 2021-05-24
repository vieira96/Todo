<template>
    <div style="height: 300px;">

        <div v-if="response.message" :class="`rounded-sm bg-${response.color}-100 p-4 mb-4`">
            <h3 :class="`text-sm leading-5 font-medium text-${response.color}-800`">
                {{ response.message }}
            </h3>
        </div>
        <ValidationObserver
            ref="resetPasswordForm"
            tag="form"
            @submit.stop.prevent="sendResetPassword()"
        >
            <ValidationProvider v-slot="{ errors }" rules="required" vid="password" name="Senha">
                <input
                    v-model="password"
                    type="password"
                    placeholder="Escolha sua nova senha."
                    class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                <Error :error="errors[0]" :validator="validator" />
            </ValidationProvider>

            <ValidationProvider v-slot="{ errors }" rules="confirmed:password" name="Confirmar senha">
                <input
                    v-model="confirm_password"
                    type="password"
                    placeholder="Confirme sua senha."
                    class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal mt-2"
                >
                <Error :error="errors[0]" :validator="validator" />
            </ValidationProvider>

            <button
                :disabled="spinner.resetPassword"
                type="submit"
                class="mt-2 flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 w-full appearance-none leading-normal"
            >
                <img
                    v-if="spinner.resetPassword" 
                    src="@/assets/img/spinner.svg" 
                    alt="spinner" 
                    class="w-5 h-5 mr-2"
                >
                REDEFINIR SENHA.
            </button>
        </ValidationObserver>

      
        <div class="my-4 text-center">
            <router-link
                :to="{ name: 'login' }"
                class="text-sm font-light text-white"
            >
                Login
            </router-link>
        </div>

    </div>
</template>

<script>
    import Error from '@/components/Error';
    import { ValidationObserver, ValidationProvider } from 'vee-validate';
    export default {
        beforeRouteEnter(to, from, next) {
            if(! to.query.token) {
                next({name: 'login'})
            }
            next();
        },

        created() {
            this.token = this.$route.query.token;
        },

        data() {
            return {
                response: {
                    message: '',
                    color: '',
                },
                spinner: {
                    resetPassword: false
                },
                validator: true,
                password: '',
                confirm_password: '',
                token: '',
            }
        },
        components: {
            Error,
            ValidationObserver,
            ValidationProvider
        },
        
        methods: {
            async sendResetPassword() {
                this.validator = await this.$refs.resetPasswordForm.validate();
                if(!this.validator) {
                    return;
                }
                const payload = {
                    password: this.password,
                    confirm_password: this.confirm_password,
                    token: this.token,
                }
                this.resetResponse()
                this.spinner.resetPassword = true;
                this.$axios.post('/v1/reset-password', payload).then(()=> {
                    this.response.message = "Senha alterada com sucesso.";
                    this.response.color = "green";
                    this.resetForm()
                }).catch((e) => {
                    this.response.message = e.response.data.message;
                    this.response.color = "red";
                }).finally(() => {
                    this.spinner.resetPassword = false;
                });
            },

            resetForm() {
                this.$refs.resetPasswordForm.reset();
                this.password = '';
                this.confirm_password = '';
            },

            resetResponse() {
                this.response.message = '';
                this.response.color = '';
            }
        },
    }
</script>