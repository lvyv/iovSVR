<template>
  <d2container>
    <div :is="currentView">
    </div>
  </d2container>
</template>
<script>
const devlist = (resolve) => require.ensure([], () => resolve(require('./devlist')), 'devlist')
const webssh = (resolve) => require.ensure([], () => resolve(require('./webssh')), 'webssh')

export default {
  name: 'page-ssh',
  // components: [devlist, webssh],
  data: function () {
    return {
      devlist: 'devlist',
      webssh: 'webssh',
      currentView: 'devlist'
    }
  },
  created: function () {
    this.currentView = devlist
  },
  sockets: {
    connect: function () {
      console.log(this.$socket.connected)
    }
  },
  methods: {
    ToggleWebssh: function (url) {
      this.currentView = webssh
    }
  }
}
</script>
