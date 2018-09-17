// polyfill
import 'babel-polyfill'
// Vue
import Vue from 'vue'
import App from './App'
// store
import store from '@/store/index'
// 模拟数据
import '@/mock'
// 多国语
import i18n from './i18n'
// 核心插件
import d2Admin from '@/plugin/d2admin'

// 菜单和路由设置
import router from './router'
import menuHeader from '@/menu/header'
import menuAside from '@/menu/aside'
// import menuAside from '@/config/menu-config.js'
import { frameInRoutes } from '@/router/routes'

import VueSocketio from 'vue-socket.io'
import io from 'socket.io-client'
let iourl = 'http://192.168.1.216:8080/webagent'
Vue.use(VueSocketio, io(iourl)) // 注意和本地服务器地址及端口一致

// 核心插件
Vue.use(d2Admin)
// 通信总线
var eventBus = {
  install (Vue, options) {
    Vue.prototype.$bus = new Vue()
  }
}
Vue.use(eventBus)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  i18n,
  created () {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    // 设置顶栏菜单
    this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // 设置侧边栏菜单
    this.$store.commit('d2admin/menu/asideSet', menuAside)
    // this.$store.commit('d2admin/menu/asideSet', menuABC)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 检查最新版本
    this.$store.dispatch('d2admin/releases/checkUpdate')
    // 用户登陆后从数据库加载一系列的设置
    this.$store.commit('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.commit('d2admin/fullscreen/listen')
  }
})
