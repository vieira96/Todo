<template>
    <div class="w-full grid grid-cols-5 border border-gray-700 shadow-lg rounded" style="height: 485px">
        <div class="border-r border-gray-700 flex justify-center items-center p-2">
            <h1 class="break-words text-2xl text-gray-300">{{todo.label}}</h1>
        </div>
        <div class="col-span-4 overflow-y-auto overflow-x-hidden flex flex-col">
            <h1 class="p-4 text-xl text-gray-400 border-b border-gray-700">Subtarefas</h1>

            <div v-if="loading" class="w-full h-full flex justify-center items-center">
                <img class="w-20" src="@/assets/img/spinner.svg" alt="">
            </div>

            <div v-else>
                <div v-if="!tasks.length" class="p-4">
                    <span class="text-gray-400 text-lg">Você não possuí nenhuma subetarefa na tarefa selecionada!</span>
                </div>
                <TaskCard
                    v-for="task in tasks" :key="task.id" 
                    :task="task" 
                    @doneToggle="update($event)" 
                    @delete="destroy(task)"
                    @edit="toggle()" 
                /> 
            </div>
        </div>
        <Modal v-if="isOpen" @cancel="toggle()" @create="create($event)" @update="update($event)" />
        <img
            @click.stop.prevent="toggle()"
            class="fixed bottom-3 right-3 w-12 h-12 cursor-pointer"
            src="@/assets/img/new.svg" 
        >

        <div v-if="response.message" class="absolute w-1/3 h-20 top-10 left-1/3 bg-green-100 border border-green-200 rounded-lg flex justify-center items-center">
            <span class="text-lg text-gray-600">{{response.message}}</span>
        </div>

    </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex';
const { mapState, mapMutations } = createNamespacedHelpers('task');

import Modal from '@/components/Tasks/Modal';
import TaskCard from '@/components/Tasks/TaskCard';
import axios from 'axios';

export default {
    data() {
        return {
            todo: {},
            tasks: [],
            isOpen: false,
            response: {
                message: '',
            },
            todoId: this.$route.params.todoId,
            loading: true
        }
    },
    components: {
        Modal,
        TaskCard
    },

    computed: {
        ...mapState({
            selectedTask: state => state.selectedTask
        }),
    },

    beforeRouteEnter(to, from, next) {
        axios.get(`/v1/todos/${to.params.todoId}`).then((response) => {
            next(vm => {
                vm.todo = response.data.data;
                vm.getTasks(vm.todo.id);
            });
        }).catch(() => {
            next({name: '404'});
        })
    },
    
    methods: {
        ...mapMutations([
            'selectTask'
        ]),

        getTasks(todoId) {
            this.$axios.get(`/v1/todo/${todoId}/tasks`).then((response) => {
                this.tasks = response.data.data;
                this.sortTasks();
                this.loading = false;
            }).catch(() => {
                alert('err0')
            })
        },

        update(task) {
            this.$axios.put(`/v1/todo/${this.todoId}/tasks/${task.id}`, task).then(() => {
                const indice = this.tasks.findIndex(t => t.id === task.id);
                this.tasks.splice(indice, 1, task);
                if(this.selectedTask.label) {
                    this.selectTask({})
                    this.toggle()
                    this.response.message = 'Subtarefa atualizada com sucesso!';
                    setTimeout(() => {
                        this.response.message = '';
                    }, 2000)
                } else {
                    this.sortTasks();
                }
            }).catch(() => {
                alert('erro');
            })
        },

        toggle() {
            this.isOpen = !this.isOpen;
        },

        create(task) {
            let payload = {
                label: task.label
            }
            this.$axios.post(`/v1/todo/${this.todoId}/tasks`, payload).then((response) => {
                this.tasks.unshift(response.data.data);
                this.toggle();
                this.response.message = 'Nova subtarefa criada com sucesso!';
                setTimeout(() => {
                    this.response.message = '';
                }, 2000)
            });
        },

        destroy(task) {
            this.$axios.delete(`/v1/todo/${this.todoId}/tasks/${task.id}`).then(() => {
                const indice = this.tasks.findIndex(t => t.id === task.id);
                this.tasks.splice(indice, 1);
            })
        },

        sortTasks() {
            //organizo para que as tarefas que ja foram concluídas fiquem no final.
            this.tasks.sort(function(a, b) {
                return b.is_complete < a.is_complete;
            });
        }
    },

}
</script>