<template>
  <el-table :data="devtable" border style="width: 100%">
    <el-table-column
      prop="DEVSN"
      label="设备号"
      min-width="30%">
    </el-table-column>
    <el-table-column
        prop="CARNO"
        label="车牌号"
        min-width="30%">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <div v-if="scope.row.STATUS==0">
          <!--no connect-->
          <el-button type="text" icon="el-icon-warning">不在线</el-button>
        </div>
        <div v-else-if="scope.row.STATUS==1">
          <!-- connected but no ssh link -->
          <el-tooltip class="item" effect="dark" content="创建SSH通道" placement="bottom-end">
            <el-button @click="tryssh(scope.row)" type="primary" plain icon="el-icon-info">在线</el-button>
          </el-tooltip>
        </div>
        <div v-else>
          <!-- connected and ssh linked -->
          <el-tooltip class="item" effect="dark" placement="bottom-end">
            <div slot="content"> 登录端口:{{ scope.row.SSHADDR }}</div>
            <el-button @click="go2ssh(scope.row)" type="primary" icon="el-icon-info">WEB登录</el-button>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  name: 'devlist',
  data: function () {
    return {
      devtable: []
    }
  },
  created: function () {
    this.initData()
  },
  computed: {
  },
  watch: {
  },
  sockets: {
    connect: function () {
      // console.log(this.$socket.connected)
    },
    devlist: function (data) {
      if (Array.isArray(this.devtable)) {
        this.devtable.splice(0, this.devtable.length)
      }
      for (var i in data) {
        // console.log(data[i])
        var tabledata = {
          'DEVSN': data[i].SN,
          'CARNO': data[i].NO,
          'STATUS': (data[i].ONLINE ? data[i].ONLINE + data[i].LINK : data[i].ONLINE),
          'SSHADDR': data[i].LPORT
        }
        this.devtable.push(tabledata)
      }
    }

  },
  methods: {
    ...mapMutations([
      'changeHost',
      'changeUser'
    ]),
    initData: function () {
      var tabledata = {
        'DEVSN': 'E529TESTSN',
        'CARNO': 'TESTCARNO',
        'STATUS': 2,
        'SSHADDR': 50
      }
      this.devtable.push(tabledata)
    },
    fetchData: function () {
      this.$socket.emit('dev')
    },
    go2ssh: function (row) {
      this.changeHost({
        host: '192.168.100.250',
        port: row.SSHADDR
      })
      this.changeUser({
        username: 'root',
        password: 'beidouapp.com'
      })
      // emit father event
      this.emit('sshLogin')
    },
    tryssh: function (row) {
      // console.log(row.DEVSN)
      this.$socket.emit('link', row.DEVSN)
    }
  }
}
</script>
