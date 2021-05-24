<template>
    <div style="height: 300px;">
        <LoginMenu />

        <div v-if="response.message" :class="`rounded-sm bg-${response.color}-100 p-4 mb-4`">
            <h3 :class="`text-sm leading-5 font-medium text-${response.color}-800`">
                {{ response.message }}
            </h3>
        </div>

        <ValidationObserver
            ref="loginForm"
            tag="form"
            @submit.stop.prevent="login"
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

            <ValidationProvider v-slot="{ errors }" rules="required" name="Senha">
                <input
                    v-model="password"
                    type="password"
                    placeholder="Digite sua senha"
                    class="bg-gray-900 mt-2 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                <Error :error="errors[0]" :validator="validator" />
            </ValidationProvider>

            <button
                :disabled="spinner.login"
                type="submit"
                class="mt-2 flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 w-full appearance-none leading-normal"
            >
                <img
                    v-if="spinner.login" 
                    src="@/assets/img/spinner.svg" 
                    alt="spinner" 
                    class="w-5 h-5 mr-2"
                >
                ENTRAR
            </button>
        </ValidationObserver>

      
        <div class="my-4 text-center">
            <router-link
                :to="{ name: 'forgotPassword' }"
                class="text-sm font-light text-white"
            >
                Esqueci minha senha
            </router-link>
        </div>

    </div>
</template>

<script>
    import LoginMenu from '@/components/Auth/LoginMenu';
    import Cookie from '@/service/cookie';
    import { ValidationObserver, ValidationProvider } from 'vee-validate';
    import Error from '@/components/Error';

    export default {
        name: 'Login',

        components: {
            LoginMenu,
            ValidationObserver,
            ValidationProvider,
            Error,
        },

        data() {
            return {
                email: '',
                password: '',
                validator: true,
                response: {
                    message: '',
                    color: '',
                },
                spinner: {
                    login: false,
                }
            };
        },

        methods: {
            async login() {
                this.validator = await this.$refs.loginForm.validate();
                if(! this.validator) {
                    return;
                }
                
                const payload = {
                    email: this.email,
                    password: this.password
                };

                this.resetResponse();
                this.spinner.login = true;

                this.$axios.post('/v1/login', payload).then((response) => {
                    const token = `${response.data.token_type} ${response.data.access_token}`
                    Cookie.setToken(token);
                    this.$store.commit('user/STORE_USER', response.data.user);
                    this.$router.push({name: 'home'})
                }).catch(() => {
                    this.response.message = "Ops, e-mail e/ou senha inválidos.";
                    this.response.color = "red";
                }).finally(() => {
                    this.spinner.login = false;
                });
            },

            resetResponse() {
                this.response.color = '';
                this.response.message = '';
            }
        },
    };
</script>
