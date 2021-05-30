<template>
    <div class="w-full sm:w-1/2 lg:w-1/3 mx-auto">

        <form
            class="flex items-center px-4 bg-gray-300 h-14 rounded-sm mb-6"
            @submit.stop.prevent="createTodo()"
        >
            <input
                v-model="label"
                placeholder="Digite o nome da sua lista ..."
                type="text"
                class="bg-gray-300 placeholder-gray-500 text-gray-700 font-light focus:outline-none block w-full appearance-none leading-normal pr-3"
            >

            <img
                v-if="spinner.createTodo"
                src="@/assets/img/spinner.svg"
                alt=""
                class="inline-block w-10 h-10"
            >
            <button
                v-else 
                type="submit"
                class="text-blue-700 text-xs font-semibold focus:outline-none"
            >
                ADICIONAR
            </button>
        </form>

        <div v-if="response.message" :class="`rounded-sm bg-${response.color}-100 p-4 mb-4`">
            <h3 :class="`text-sm leading-5 font-medium text-${response.color}-800`">
                {{ response.message }}
            </h3>
        </div>

        <div class="flex items-center justify-between mb-4">
            <div class="text-gray-500 font-medium text-xl">
                Lista de tarefas
            </div>
        </div>

        <div
            v-if="spinner.getTodo"
            class="text-center"
        >
            <img
                src="@/assets/img/spinner.svg"
                alt=""
                class="inline-block w-10 h-10"
            >
        </div>

        <div
            v-else 
            v-for="todo in todos" :key="todo.id" 
            class="flex items-center justify-between bg-gray-300 rounded-sm px-4 h-12 mb-2"
        >
            <TodoCard :todo="todo" @delete="destroy($event)" />
        </div>

        <Modal v-if="Object.values(selectedTodo).length" @save="save($event)" />

        <!-- Suspende a tela enquanto está deletand a tarefa. -->
        <div v-if="deleting" class="fixed top-0 left-0 w-screen h-screen bg-gray-900 opacity-95 flex flex-col justify-center items-center">
            <span class="text-gray-200 text-4xl mb-4">Deletando</span>
            <img
                src="@/assets/img/spinner.svg"
                alt=""
                class="inline-block w-20 h-20"
            >
        </div>
    </div>
</template>


<script>

    import TodoCard from '@/components/Todos/TodoCard';
    import Modal from '@/components/Todos/Modal';
    import { createNamespacedHelpers } from 'vuex';
    const { mapState, mapMutations } = createNamespacedHelpers('todo');

    export default {
        name: 'Home',
        components: {
            TodoCard,
            Modal
        },
        data() {
            return {
                todos: [],
                spinner: {
                    getTodo: false,
                    createTodo: false
                },
                label: '',
                response: {
                    message: '',
                    color: ''
                },
                deleting: false
            }
        },

        computed: {
            ...mapState({
                selectedTodo: state => state.selectedTodo
            }),
        },

        methods: {
            getTodos() {
                this.spinner.getTodo = true;

                this.$axios.get('/v1/todos').then((response) => {
                    this.todos = response.data.data;
                }).finally(() => {
                    this.spinner.getTodo = false;
                })

            },

            createTodo() {
                if(! this.label) {
                    return;
                }
                this.spinner.createTodo = true;
                const payload = {
                    label: this.label
                }

                this.$axios.post('/v1/todos', payload).then((response) => {
                    this.todos.unshift(response.data.data);
                    this.response.message = "Nova tarefa criada com sucesso!";
                    this.response.color = "green";
                    setTimeout(() => {
                        this.response.message = '';
                        this.response.color = '';
                    }, 2000);
                    this.label = '';
                }).catch(() => { 
                    this.response.message = "Alguma coisa deu errado, tente novamente, por favor.";
                    this.response.color = "red";
                    setTimeout(() => {
                        this.response.message = '';
                        this.response.color = '';
                    }, 2000);
                }).finally(() => {
                    this.spinner.createTodo = false;
                })
            },

            save(todo) {
                this.$axios.put(`/v1/todos/${todo.id}`, todo).then(() => {
                    const indice = this.todos.findIndex(t => t.id === todo.id);
                    this.todos.splice(indice, 1, todo);
                    this.selectTodo({});
                }).catch(() => {
                    alert('erro');
                })

            },

            destroy(todo) {
                this.deleting = true;

                this.$axios.delete(`/v1/todos/${todo.id}`).then(() => {
                    const indice = this.todos.findIndex(t => t.id === todo.id);
                    this.todos.splice(indice, 1);
                }).catch(() => {
                    alert('erro');
                }).finally(() => {
                    this.deleting = false;
                })
            },

            ...mapMutations([
                'selectTodo',
            ])
        },

        created() {
            this.getTodos();
        }
    };
</script>