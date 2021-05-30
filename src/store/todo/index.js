export default {
    namespaced: true,

    state: () => ({
        selectedTodo: {}
    }),

    mutations: {
        selectTodo(state, todo) {
            state.selectedTodo = todo;
        },
    },
}