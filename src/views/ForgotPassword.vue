<template>
    <div style="height: 300px;">

        <div v-if="response.message" :class="`rounded-sm bg-${response.color}-100 p-4 mb-4`">
            <h3 :class="`text-sm leading-5 font-medium text-${response.color}-800`">
                {{ response.message }}
            </h3>
        </div>

        <ValidationObserver
            ref="forgotPasswordForm"
            tag="form"
            @submit.stop.prevent="sendForgotPassword()"
        >
            <ValidationProvider v-slot="{ errors }" rules="required|email" name="E-mail">
                <input
                    v-model="email"
                    type="text"
                    placeholder="Digite seu e-mail"
                    class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                <Error :error="errors[0]" :validator="validator" />
            </ValidationProvider>

            <button
                :disabled="spinner.forgotPassword"
                type="submit"
                class="mt-2 flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 w-full appearance-none leading-normal"
            >
                <img
                    v-if="spinner.forgotPassword" 
                    src="@/assets/img/spinner.svg" 
                    alt="spinner" 
                    class="w-5 h-5 mr-2"
                >
                SOLICITAR REDEFINIÇÃO DE SENHA.
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

        components: {
            Error,
            ValidationObserver, 
            ValidationProvider, 
        },

        data() {
            return {
                spinner: {
                    forgotPassword: false
                },
                response: {
                    message: '',
                    color: ''
                },
                email: '',
                validator: true
            }
        },
        methods: {
            async sendForgotPassword(){
                this.validator = await this.$refs.forgotPasswordForm.validate();
                if(!this.validator) {
                    return;
                }
                const payload = {
                    email: this.email
                }
                this.spinner.forgotPassword = true;
                this.resetResponse();
                this.$axios.post('/v1/forgot-password', payload).then(() => {
                    this.response.message = "Solicitação de redefinição de senha enviada com sucesso, por favor, verifique seu e-mail.";
                    this.response.color = "green";
                }).catch((e) => {
                    if( e.response.data.errors) {
                        this.response.message = e.response.data.errors.email[0];
                    } else {
                        this.response.message = e.response.data.message;
                    }
                    this.response.color = "red";
                }).finally(() => {
                    this.spinner.forgotPassword = false;
                })
            },

            resetResponse() {
                this.response.message = '';
                this.response.color = '';
            },

            resetForm() {
                this.$refs.forgotPasswordForm.reset();
                this.email = '';
            }
        }
    }
</script>