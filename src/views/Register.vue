<template>
    <div>
        <LoginMenu />

        <div v-if="response.message" :class="`rounded-sm bg-${response.color}-100 p-4 mb-4`">
            <h3 :class="`text-sm leading-5 font-medium text-${response.color}-800`">
                {{ response.message }}
            </h3>
        </div>

        <ValidationObserver
            ref="registerForm"
            tag="form"
            @submit.stop.prevent="register()"
        >
            
            <div class="flex">
                <ValidationProvider v-slot="{ errors }" rules="required" name="Primeiro nome" class="w-1/2 mr-2">
                    <input
                        v-model="firstName"
                        type="text"
                        class="bg-gray-900 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal mb-2 placeholder-gray-700"
                        placeholder="Informe seu nome"
                    >

                    <Error :error="errors[0]" :validator="validator" />
                </ValidationProvider>
                
                <div class="w-1/2">
                    <input
                        v-model="lastName"
                        type="text"
                        class="bg-gray-900 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal mb-2 placeholder-gray-700"
                        placeholder="Sobrenome"
                    >
                </div>
            </div>
            <ValidationProvider v-slot="{ errors }" rules="required|email" name="E-mail">
                <input
                    v-model="email"
                    type="text"
                    class="bg-gray-900 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal  placeholder-gray-700"
                    placeholder="Informe seu e-mail"
                >
                <Error :error="errors[0]" :validator="validator" />
            </ValidationProvider>

            <ValidationProvider v-slot="{ errors }" rules="required" name="Password">
                <input
                    v-model="password"
                    type="password"
                    class="bg-gray-900 mt-2 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal placeholder-gray-700"
                    placeholder="Escolha uma senha"
                >
                <Error :error="errors[0]" :validator="validator" />
            </ValidationProvider>

            <button
                :disabled="spinner.login"
                type="submit"
                class="mt-2 flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 w-full appearance-none leading-normal"
            >
                <img
                    v-if="spinner.register" 
                    src="@/assets/img/spinner.svg" 
                    alt="spinner" 
                    class="w-5 h-5 mr-2"
                >
                CADASTRAR
            </button>
        </ValidationObserver>

    </div>
</template>

<script>
    import LoginMenu from '@/components/Auth/LoginMenu';
    import { ValidationObserver, ValidationProvider } from 'vee-validate';
    import Error from '@/components/Error';

    export default {
        name: 'Register',

        components: {
            LoginMenu,
            ValidationObserver,
            ValidationProvider,
            Error,
        },

        data() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                validator: true,
                response: {
                    message: '',
                    color: '',
                },
                spinner: {
                    register: false,
                }
            };
        },

        methods: {
            async register() {
                this.validator = await this.$refs.registerForm.validate();
                if(! this.validator) {
                    return;
                }

                const payload = {
                    first_name: this.firstName,
                    last_name: this.lastName,
                    email: this.email,
                    password: this.password
                };

                this.resetResponse();
                this.spinner.register = true;

                this.$axios.post('/v1/register', payload).then(() => {
                    this.response.message = "Usuário registrado com sucesso.";
                    this.response.color = "green";
                    this.resetForm();
                }).catch((e) => {
                    this.spinner.register = false;
                    const errorMessage = e.response.data.errors.email[0];
                    this.response.message = errorMessage;
                    this.response.color = "red";
                }).finally(() => {
                    this.spinner.register = false;
                });
            },

            resetResponse() {
                this.response.color = '';
                this.response.message = '';
            },

            resetForm() {
                this.$refs.registerForm.reset();
                this.firstName = '';
                this.lastName = '';
                this.email = '';
                this.password = '';
            }
        },
    };
</script>
