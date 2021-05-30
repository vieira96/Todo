import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/user'
import todo from '@/store/todo'
import task from '@/store/task'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    todo,
    task
  }
})
