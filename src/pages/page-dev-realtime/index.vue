<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" :model="searchData" :rules="rules" ref="searchData" size="mini" align="right" style="margin-bottom: -18px;">
        <el-form-item align="center" label="序列号选择" prop="sn">
          <el-select v-model="searchData.sn" placeholder="选择SN">
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
    <el-table-column align="center" prop="sn" label="序列号" sortable></el-table-column>
    <el-table-column  align="center" prop="num" label="设备自编号" sortable></el-table-column>
    <el-table-column prop="position" label="盒子安装位置"></el-table-column>

    <el-table-column label="管理员" align="center">
      <el-table-column align="center" prop="name" label="姓名"></el-table-column>
      <el-table-column align="center" prop="phone" label="电话"></el-table-column>
    </el-table-column>

    <el-table-column align="center" prop="status" label="在线状态" :formatter="statusFormat"></el-table-column>
    <el-table-column align="center" prop="address" label="实时位置"></el-table-column>

    <el-table-column label="传感器数据" align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">查看实时数据</el-button>
        <el-dialog title="传感器数据表" :visible.sync="dialogTableVisible">
          <span size="mini">序列号:</span>
          <span size="mini" style="color:#FF0000"> {{ searchData.sn }} </span>
          <el-table
            border
            :data="sensor.slice((diacurrentPage-1)*diapageSize,diacurrentPage*diapageSize)"
            :default-sort = "{prop: 'sensorNum', order: 'ascending'}">
            :default
            <el-table-column align="center" width="100" prop="sensorNum" label="编号" sortable></el-table-column>
            <el-table-column align="center" width="150" prop="sensorType" label="类型"></el-table-column>
            <el-table-column align="center" prop="sensorPos" label="安装位置"></el-table-column>
            <el-table-column align="center" width="180" prop="sensorTime" label="上传时间" sortable></el-table-column>
            <el-table-column align="center" width="120" prop="sensorrange" label="量程"></el-table-column>
            <el-table-column align="center" width="100" prop="sensorUnit" label="单位"></el-table-column>
            <el-table-column align="center" prop="sensorValue" label="采集数值"></el-table-column>
          </el-table>
          <template slot="footer">
            <el-pagination
              align="center"
              background
              @size-change="diahandleSizeChange"
              @current-change="diahandleCurrentChange"
              :current-page="diacurrentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="diapageSize"
              layout="prev, pager, next, jumper, sizes"
              :total="diatotalItem">
            </el-pagination>
            </template>
        </el-dialog>
        </template>
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
          sn: 'E529A17010042',
          num: 'T000001',
          position: '南门大桥12号桥墩',
          name: '老张',
          phone: '13211001103',
          status: 0,
          address: '南大街',
          sensor: [
            {
              sensorNum: 'S0000001',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000001',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000002',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000003',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000004',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000005',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000006',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000007',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000008',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000009',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000010',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000011',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            }
          ]
        },
        {
          sn: 'E529A17010045',
          num: 'T000001',
          position: '南门大桥12号桥墩',
          name: '老张',
          phone: '13211001103',
          status: 0,
          address: '南大街',
          sensor: [
            {
              sensorNum: 'S0000001',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000001',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000002',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            },
            {
              sensorNum: 'S0000003',
              sensorPos: '17号桥墩',
              sensorType: '压电传感器',
              sensorNAME: '压电传感器1号',
              sensorTime: '2018-09-12 12:01:20',
              sensorrange: 20,
              sensorUnit: 'MPa',
              sensorValue: 10
            }
          ]
        }
      ],
      searchData: {
        sn: ''
      },
      sensor: [ ],
      rules: {
        sn: [
          { required: true, message: '请选择SN号', trigger: 'blur' }
        ]
      },
      totalItem: 0,
      pageSize: 10,
      currentPage: 1,
      diatotalItem: 0,
      diapageSize: 10,
      diacurrentPage: 1,
      dialogTableVisible: false
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
    diahandleSizeChange (pSize) {
      this.diapageSize = pSize
      // alert('每页条数:' + pSize)
    },
    diahandleCurrentChange (curPage) {
      this.diacurrentPage = curPage
      // alert('当前页：' + curPage)
    },
    handleEdit (index, row) {
      this.dialogTableVisible = true
      for (var i = 0; i < this.dat.length; i++) {
        if (this.dat[i].sn === row.sn) {
          this.sensor = this.dat[i].sensor
          this.diatotalItem = this.sensor.length
          return
        }
      }
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
    onSubmit (searchData) {
      this.$refs[searchData].validate((valid) => {
        if (valid) {
          alert(this.searchData.sn)
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
