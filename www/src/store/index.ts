import { createApp } from 'vue'
import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      user: {},
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
  },
})
