<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" :model="sn" :rules="rules" ref="sn" size="mini" align="right" style="margin-bottom: -18px;">
        <el-form-item label="序列号选择" prop="sn">
          <el-select v-model="sn" placeholder="选择SN">
            <el-option
            v-for="item in dat"
            :key="item.sn"
            :value="item.sn">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('searchData')">查询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-table
    :data="dat.slice((currentPage-1)*pageSize,currentPage*pageSize)"
    style="width: 100%"
    :default-sort = "{prop: 'sn', order: 'ascending'}">
    :default
    <el-table-column width="140" prop="sn" label="序列号" sortable></el-table-column>
    <el-table-column width="120" prop="num" label="设备自编号" sortable></el-table-column>
    <el-table-column prop="position" label="盒子安装位置"></el-table-column>

    <el-table-column label="管理员" align="center">
      <el-table-column width="50" prop="name" label="姓名"></el-table-column>
      <el-table-column width="120" prop="phone" label="电话"></el-table-column>
    </el-table-column>

    <el-table-column width="80" prop="status" label="在线状态" :formatter="statusFormat"></el-table-column>
    <el-table-column prop="time" label="上传时间" sortable></el-table-column>
    <el-table-column prop="address" label="实时位置"></el-table-column>

    <el-table-column label="传感器数据" align="center">
      <el-table-column width="120" prop="sensor.sensorNum" label="传感器编号" sortable></el-table-column>
      <el-table-column prop="sensor.sensorPos" label="传感器位置"></el-table-column>
      <el-table-column prop="sensor.sensorType" label="传感器类型"></el-table-column>
      <el-table-column prop="sensor.sensorData" label="传感器采集值"></el-table-column>
    </el-table-column>
    </el-table>

    <template slot="footer" align="center">
      <el-pagination
        align="center"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="prev, pager, next, jumper, sizes"
        :total="totalItem">
      </el-pagination>
    </template>
  </d2-container>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      dat: [
        {
          sn: 'E529A17010045',
          num: 'T000001',
          position: '南门大桥12号桥墩',
          name: '老张',
          phone: '13211001103',
          status: 0,
          time: '1570000000',
          address: '南大街',
          sensor: {
            sensorNum: 'S0000001',
            sensorPos: '17号桥墩',
            sensorType: '压电传感器',
            sensorData: 32
          }
        },
        {
          sn: 'E529A17010045',
          num: 'T000001',
          position: '南门大桥12号桥墩',
          name: '老张',
          phone: '13211001103',
          status: 0,
          time: '1570000000',
          address: '南大街',
          sensor: {
            sensorNum: 'S0000002',
            sensorPos: '17号桥墩',
            sensorType: '压电传感器',
            sensorData: 32
          }
        }
      ],
      sn: [ ],
      rules: {
        sn: [
          { required: true, message: '请选择SN号', trigger: 'blur' }
        ]
      },
      totalItem: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  created: function () {
    this.initPage()
    // this.initData()
  },
  methods: {
    handleSizeChange (pSize) {
      this.pageSize = pSize
      // alert('每页条数:' + pSize)
    },
    handleCurrentChange (curPage) {
      this.currentPage = curPage
      // alert('当前页：' + curPage)
    },
    initPage: function () {
      this.totalItem = this.dat.length
      // alert('总条数：' + this.totalItem)
    },
    statusFormat (row, column) {
      if (row.status === 0) {
        return '离线'
      } else {
        return '在线'
      }
    },
    onSubmit (sn) {
      this.$refs[sn].validate((valid) => {
        if (valid) {
          alert(this.sn)
        } else {
          return false
        }
      })
    }
    // ,
    // initData: function () {
    //   axios.get('/api/devInfo').then((res) => {
    //     if (Array.isArray(this.dat)) {
    //       this.dat.splice(0, this.dat.length)
    //     }
    //     var data = res.data
    //     alert(data[0].sn)
    //     for (var i in data) {
    //       var tabledata = {
    //         'sn': data[i].sn,
    //         'num': data[i].num,
    //         'time': data[i].time,
    //         'position': data[i].position,
    //         'status': data[i].status,
    //         'address': data[i].address,
    //         'sensor': {
    //           'sensorNum': data[i].sensor.sensorNum,
    //           'sensorPos': data[i].sensor.sensorPos,
    //           'sensorType': data[i].sensor.sensorType,
    //           'sensorData': data[i].sensor.sensorData
    //         },
    //         'name': data[i].name,
    //         'phone': data[i].phone
    //       }
    //       this.dat.push(tabledata)
    //     }
    //   })
    // }
  }
}
</script>
