<template>
    <div 
        class="fixed w-screen h-screen bg-gray-800 opacity-95 top-0 left-0 z-50 flex justify-center items-center"
    >
        <div class="h-68 w-full sm:w-3/5 md:w-3/5 lg:w-2/5 bg-gray-300 opacity-100 flex flex-col p-5 relative shadow-sm">
            <h1 v-if="selectedTask.label" class="mb-5">Editando a subtarefa: {{selectedTask.label}}</h1>
            <h1 v-else class="mb-5">Nova subtarefa</h1>
            <form
                class="flex items-center px-4 bg-gray-200 h-14 rounded-3xl mb-6 p-3 border border-gray-300 shadow-md"
                @submit.stop.prevent="save(task)"
            >
                <input
                    v-model="task.label"
                    placeholder="Digite o nome da sua tarefa..."
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
                    <span v-if="selectedTask.label">Salvar</span>
                    <span v-else>Criar</span>
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
    const { mapState, mapMutations } = createNamespacedHelpers('task');

    export default {
        name: 'Modal',
        data() {
            return {
                task: {
                    label: '',
                },
                spinner: {
                    saving: false,
                }
            }
        },
        computed: {
            ...mapState({
                selectedTask: state => state.selectedTask
            })
        },
        methods: {
            ...mapMutations([
                'selectTask'
            ]),
            cancel() {
                this.task.label = '';
                if(this.selectedTask) {
                    this.selectTask({});
                }
                this.$emit('cancel');
            },
            save(task) {
                if(task.label) {
                    this.spinner.saving = true;
                    if(this.selectedTask.label) {
                        this.$emit('update', task)
                    } else {
                        this.$emit('create', task)
                    }
                }
            }
        },

        created() {
            if(this.selectedTask) {
                this.task = Object.assign({}, this.selectedTask);
            }
        }
    }
</script>