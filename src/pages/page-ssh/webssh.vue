<template>
 <div class="box" id='webssh'>
    <link rel="stylesheet" href="/webssh.css" />
    <div id="header"></div>
    <div id="terminal-container" class="terminal"></div>
    <div id="bottomdiv">
      <div class="dropup" id="menu">
        <i class="fas fa-bars fa-fw"></i> Menu
        <div class="dropup-content">
          <a id="logBtn" class="btn-color" @click="togglelog()"><i class="fas fa-clipboard fa-fw"></i> Start Log</a>
          <a id="downloadLogBtn" class="btn-color" @click="downloadLog()"><i class="fas fa-download fa-fw"></i> Download Log</a>
          <a id="credentialsBtn" class="btn-color" @click="replayCredentials()"><i class="fas fa-key fa-fw"></i> Credentials</a>
        </div>
      </div>
      <div id="footer"></div>
      <div id="status"></div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as Terminal from 'xterm/dist/xterm'
import * as fit from 'xterm/dist/addons/fit/fit'
import fontawesome from '@fortawesome/fontawesome'
import faBars from '@fortawesome/fontawesome-free-solid/faBars'
// import faQuestion from '@fortawesome/fontawesome-free-solid/faQuestion'
import faClipboard from '@fortawesome/fontawesome-free-solid/faClipboard'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'
import faKey from '@fortawesome/fontawesome-free-solid/faKey'
import faCog from '@fortawesome/fontawesome-free-solid/faCog'
// import * as io from 'socket.io-client/dist/socket.io.js'
import axios from 'axios'
import {mapGetters} from 'vuex'

export default {
  name: 'webssh',
  props: ['sshcfg'],
  data: function () {
    return {
      id: null,
      sessionLogEnable: false,
      loggedData: false,
      sessionLog: null,
      sessionFooter: null,
      logDate: null,
      currentDate: null,
      myFile: null,
      errorExists: null,
      term: null
    }
  },
  created: function () {
  },
  mounted: function () {
    if(!this.getters.loginInfo) {
      this.$socket.emit('sshready',this.getters.loginInfo)
    }
    this.init()
  },
  computed: {
    ...mapGetters([
     'loginInfo'
    ])
  },
  watch: {
  },
  sockets: {
    sshagent_connect: function () {
      this.id = this.$socket.id
      this.$socket.emit('sshagent_geometry', this.term.cols, this.term.rows)
    },
    sshagent_setTerminalOpts: function (data) {
      this.term.setOption('cursorBlink', data.cursorBlink)
      this.term.setOption('scrollback', data.scrollback)
      this.term.setOption('tabStopWidth', data.tabStopWidth)
    },
    sshagent_title: function (data) {
      document.title = data
    },
    sshagent_status: function (data) {
      document.getElementById('status').innerHTML = data
    },
    sshagent_statusBackground: function (data) {
      document.getElementById('status').style.backgroundColor = data
    },
    sshagent_ssherror: function (data) {
      document.getElementById('status').innerHTML = data
      document.getElementById('status').style.backgroundColor = 'red'
      this.errorExists = true
    },
    sshagent_headerBackground: function (data) {
      document.getElementById('header').style.backgroundColor = data
    },
    sshagent_header: function (data) {
      if (data) {
        document.getElementById('header').innerHTML = data
        document.getElementById('header').style.display = 'block'
        // header is 19px and footer is 19px, recaculate new terminal-container and resize
        document.getElementById('terminal-container').style.height = 'calc(100% - 38px)'
        this.resizeScreen()
      }
    },
    sshagent_footer: function (data) {
      this.sessionFooter = data
      document.getElementById('footer').innerHTML = data
    },
    sshagent_allowreplay: function (data) {
      if (data === true) {
        console.log('allowreplay: ' + data)
        document.getElementById('credentialsBtn').style.color = '#000'
        document.getElementById('credentialsBtn').credentialsBtn.addEventListener('click', this.replayCredentials)
      } else {
        console.log('allowreplay: ' + data)
        document.getElementById('credentialsBtn').style.color = '#666'
      }
    },
    sshagent_data: function (data) {
      this.term.write(data)
      if (this.sessionLogEnable) {
        this.sessionLog = this.sessionLog + data
      }
    },
    sshagent_disconnect: function (err) {
      if (!this.errorExists) {
        document.getElementById('status').style.backgroundColor = 'red'
        document.getElementById('status').innerHTML =
          'WEBSOCKET SERVER DISCONNECTED: ' + err
      }
      this.$socket.io.reconnection(false)
    },
    sshagent_error: function (err) {
      if (!this.errorExists) {
        document.getElementById('status').style.backgroundColor = 'red'
        document.getElementById('status').innerHTML = 'ERROR: ' + err
      }
    }
  },
  methods: {
    init: function () {
      fontawesome.library.add(faBars, faClipboard, faDownload, faKey, faCog)
      fontawesome.config.searchPseudoElements = true
      fontawesome.dom.i2svg()
      require('xterm/dist/xterm.css')
      Terminal.applyAddon(fit)
      window.addEventListener('resize', this.resizeScreen, false)
      this.term = new Terminal()
      this.term.open(document.getElementById('terminal-container'))
      this.term.focus()
      this.term.fit()
      axios.get('/webssh/host/?host=192.168.100.250&port=22').then((res) => {
        console.log(res)
      })
      this.term.on('data', function (data) {
        this.$socket.emit('data', data)
      })
      this.$socket.emit('connect')
    },
    resizeScreen: function () {
      this.term.fit()
      this.$socket.emit('resize', { cols: this.term.cols, rows: this.term.rows })
    },
    replayCredentials: function  () { // eslint-disable-line
      this.$socket.emit('control', 'replayCredentials')
      console.log('replaying credentials')
      this.term.focus()
      return false
    },
    // Set variable to toggle log data from client/server to a varialble
    // for later download
    toggleLog: function () { // eslint-disable-line
      if (this.sessionLogEnable === true) {
        this.sessionLogEnable = false
        this.loggedData = true
        document.getElementById('logBtn').innerHTML = '<i class="fas fa-clipboard fa-fw"></i> Start Log'
        console.log('stopping log, ' + this.sessionLogEnable)
        this.currentDate = new Date()
        this.sessionLog = this.sessionLog + '\r\n\r\nLog End for ' + this.sessionFooter + ': ' +
          this.currentDate.getFullYear() + '/' + (this.currentDate.getMonth() + 1) + '/' +
          this.currentDate.getDate() + ' @ ' + this.currentDate.getHours() + ':' +
          this.currentDate.getMinutes() + ':' + this.currentDate.getSeconds() + '\r\n'
        this.logDate = this.currentDate
        this.term.focus()
        return false
      } else {
        this.sessionLogEnable = true
        this.loggedData = true
        document.getElementById('logBtn').innerHTML = '<i class="fas fa-cog fa-spin fa-fw"></i> Stop Log'
        document.getElementById('downloadLogBtn').style.color = '#000'
        console.log('starting log, ' + this.sessionLogEnable)
        this.currentDate = new Date()
        this.sessionLog = 'Log Start for ' + this.sessionFooter + ': ' +
          this.currentDate.getFullYear() + '/' + (this.currentDate.getMonth() + 1) + '/' +
          this.currentDate.getDate() + ' @ ' + this.currentDate.getHours() + ':' +
          this.currentDate.getMinutes() + ':' + this.currentDate.getSeconds() + '\r\n\r\n'
        this.logDate = this.currentDate
        this.term.focus()
        return false
      }
    },
    // cross browser method to "download" an element to the local system
    // used for our client-side logging feature
    downloadLog: function() { // eslint-disable-line
      if (this.loggedData === true) {
        this.myFile = 'WebSSH2-' + this.logDate.getFullYear() + (this.logDate.getMonth() + 1) +
          this.logDate.getDate() + '_' + this.logDate.getHours() + this.logDate.getMinutes() +
          this.logDate.getSeconds() + '.log'
        // regex should eliminate escape sequences from being logged.
        var blob = new Blob([this.sessionLog.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')], {
          type: 'text/plain'
        })
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob(blob, this.myFile)
        } else {
          var elem = window.document.createElement('a')
          elem.href = window.URL.createObjectURL(blob)
          elem.download = this.myFile
          document.body.appendChild(elem)
          elem.click()
          document.body.removeChild(elem)
        }
      }
      this.term.focus()
    }
  }
}
</script>
<style scoped>
body {background-color: #000;height: 100%;margin: 0;}.dropup-content {display: none;}
.btn-color {
  color:#000;
}
</style>