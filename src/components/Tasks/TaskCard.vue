<template>
    <div class="flex justify-between border-b border-gray-700 p-4">
        <span class="text-gray-400 text-lg flex-1">{{task.label}}</span>
        <div class="flex justify-between items-center w-28">
            <button @click.stop.prevent="doneToggle()">
                <img v-if="task.is_complete" class="w-6" src="@/assets/img/done.svg">
                <img v-else class="w-6" src="@/assets/img/undone.svg">
            </button>

            <button @click.stop.prevent="selectTaskToEdit(task)">
                <img class="w-6" src="@/assets/img/pencil.svg">
            </button>

            <button @click.stop.prevent="destroy(task)">
                <img class="w-6 h-5" src="@/assets/img/trash.svg">
            </button>
        </div>
    </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex';
const { mapMutations } = createNamespacedHelpers('task');

export default {
    props: {
        task: {
            type: Object
        }
    },

    methods: {
        doneToggle() {
            let task = Object.assign({}, this.task);
            task.is_complete = ! task.is_complete; 
            this.$emit('doneToggle', task)
        },

        selectTaskToEdit(task) {
            this.selectTask(task);
            this.$emit('edit');
        },
        destroy(task) {
            if(confirm(`Deletar a subtarefa (${this.task.label})?`)) {
                this.$emit('delete', task)
            }
        },

        ...mapMutations([
            'selectTask',
        ])
    }
}
</script>