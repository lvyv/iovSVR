import Vue from 'vue'
import Vuex from 'vuex'

import d2admin from './modules/d2admin'
import webssh from  './modules/webssh'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    d2admin,
    webssh
  }
})
