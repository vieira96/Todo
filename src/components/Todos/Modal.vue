<template>
    <div 
        class="fixed w-screen h-screen bg-gray-800 opacity-95 top-0 left-0 z-50 flex justify-center items-center"
    >
        <div class="h-68 w-full sm:w-3/5 md:w-3/5 lg:w-2/5 bg-gray-300 opacity-100 flex flex-col p-5 relative">
            <h1 class="mb-5">Editando a tarefa: {{selectedTodo.label}}</h1>
            <form
                class="flex items-center px-4 bg-gray-200 h-14 rounded-3xl mb-6 p-3 border border-gray-300 shadow-md"
                @submit.stop.prevent="save(todo)"
            >
                <input
                    v-model="todo.label"
                    placeholder="Digite o nome da sua lista ..."
                    type="text"
                    class="bg-gray-200 placeholder-gray-500 text-gray-700 font-light focus:outline-none block w-full appearance-none leading-normal pr-3"
                >

                <img
                    v-if="spinner.saving"                    
                    src="@/assets/img/spinner.svg"
                    alt=""
                    class="inline-block w-10 h-10"
                >
                <button
                    v-else
                    type="submit"
                    class="text-blue-700 text-xs font-semibold focus:outline-none"
                >
                    SALVAR
                </button>
            </form>
            <div 
                class="h-6 w-6 bg-red-500 absolute top-0 right-0 rounded-full cursor-pointer flex justify-center items-center"
                @click.stop.prevent="cancel()"
            >
                <span class="text-white">x</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapState, mapMutations } = createNamespacedHelpers('todo'); 

    export default {
        name: 'Modal',
        data() {
            return {
                todo: {},
                spinner: {
                    saving: false,
                }
            }
        },
        computed: {
            ...mapState({
                selectedTodo: state => state.selectedTodo,
            }),
        },
        methods: {
            ...mapMutations([
                'selectTodo'
            ]),
            cancel() {
                this.selectTodo({});
            },

            save(todo) {
                this.spinner.saving = true;
                this.$emit('save', todo)
            }
        },

        created() {
            this.todo = Object.assign({}, this.selectedTodo)
        }
    }
</script>