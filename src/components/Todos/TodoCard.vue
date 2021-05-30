<template>
    <div class="w-full flex justify-between relative">
        <router-link
                :to="{ name: 'todo', params: {todoId: todo.id} }"
                class="text-sm font-light hover:underline"
            >
                {{todo.label}}
            </router-link>
        <div>
            <div @click.stop.prevent="toggle()" class="cursor-pointer">
                <img v-if="isOpen" class="w-6" src="@/assets/img/arrow-up.svg">
                <img v-else class="w-6" src="@/assets/img/arrow.svg">
            </div>
            <div v-show="isOpen" class="absolute flex justify-center items-center bg-red-900 origin-top-right right-0 z-50 flex-col w-36">
                <div @click.stop.prevent="selectTodoToEdit(todo)" class="bg-gray-200 p-3 flex justify-between cursor-pointer w-full border-b hover:border-gray-300">
                    <div class="text-gray-600">Editar</div>
                    <img class="w-5" src="@/assets/img/pencil.svg">
                </div>
                <div @click.stop.prevent="destroy(todo), toggle()" class="bg-gray-200 p-3 flex justify-between cursor-pointer w-full border-b hover:border-gray-300">
                    <div class="text-gray-600">Excluir</div>
                    <img class="w-6 h-6"  src="@/assets/img/trash.svg">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapMutations }  = createNamespacedHelpers('todo');

    export default {
        name: 'TodoCard',

        props: {
            todo: {
                type: Object,
                default: () => ({}),
            },
        },

        data() {
            return {
                isOpen: false,
            };
        },

        methods: {
            selectTodoToEdit(todo) {
                this.selectTodo(todo)
                this.isOpen = false;
            },
            
            ...mapMutations([
                'selectTodo',
            ]),

            toggle() {
                this.isOpen = !this.isOpen;
            },

            destroy(todo) {
                if(confirm(`Deletar a tarefa (${todo.label}) e todas as suas subtarefas?`))
                this.$emit('delete', todo)
            }
        },
    };
</script>
