<template>
  <d2container>
    <div
    :is="currentView"
    @sshLogin="ToggleWebssh">
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
  mounted: function () {
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
