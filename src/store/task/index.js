export default {
    namespaced: true,

    state: () => ({
        selectedTask: {}
    }),

    mutations: {
        selectTask(state, task) {
            state.selectedTask = task;
        },
    },
}