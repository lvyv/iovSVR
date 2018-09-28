export default {
  namespaced: true,
  state: {
    host: null,
    port: 22,
    username: '',
    password: ''
  },
  getters: {
    loginInfo (state) {
      return {
        host: state.host,
        port: state.port,
        username: state.username,
        password: state.password
      }
    }
  },
  mutations: {
    SOCKET_CONNECT (state, vm) {
      console.log(vm.$socket)
    },
    SOCKET_LOGIN (state, vm) {
      vm.$socket.emit('sshready', this.getters.loginInfo)
    },
    changeHost (state, val) {
      state.host = val.host
      state.port = val.port
    },
    changeUser: (state, val) => {
      state.username = val.username
      state.password = val.password
    }
  },
  actions: {
    SOCKET_LOGIN: ({ commit }, val) => {
      commit('SOCKET_LOGIN', val)
    },
    changeHost: ({ commit }, val) => {
      commit('changeHost', val)
    },
    changeUser: ({ commit }, val) => {
      commit('changeUser', val)
    }
  }
}
