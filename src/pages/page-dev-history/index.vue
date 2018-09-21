<template>
  <d2-container>
    <template slot="header">
      <el-form :inline="true" :model="searchData" :rules="rules" ref="searchData" size="mini" align="right" style="margin-bottom: -18px;">
        <el-form-item label="序列号选择" prop="sn">
          <el-select v-model="searchData.sn" placeholder="选择SN">
            <el-option
            v-for="item in alldev"
            :key="item.sn"
            :value="item.sn">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="searchData.startTime" type="datetime" placeholder="选择时间"  :picker-options="pickerOptions1"></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="searchData.endTime" type="datetime" placeholder="选择时间"  :picker-options="pickerOptions1"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit('searchData')">查询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-table
      border
      v-loading="loading2"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="dat.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      :default-sort = "{prop: 'num', order: 'ascending'}">
      :default
      <el-table-column align="center" prop="sn" label="序列号"></el-table-column>
      <el-table-column align="center" prop="num" label="传感器编号" sortable></el-table-column>
      <el-table-column align="center" prop="categories" label="传感器类型"></el-table-column>
      <el-table-column align="center" prop="name" label="传感器名称"></el-table-column>
      <el-table-column align="center" prop="range" label="量程"></el-table-column>
      <el-table-column align="center" prop="unit" label="单位"></el-table-column>
      <el-table-column align="center" prop="position" label="安装点位"></el-table-column>

      <el-table-column label="传感器数据表" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="clickCheck(scope.row,scope.$index)">查看数据</el-button>
          <el-dialog title="传感器数据表" :visible.sync="dialogTableVisible">
            <span size="mini">序列号:</span>
            <span size="mini" style="color:#FF0000"> {{ searchData.sn }} </span>
            <span size="mini">传感器编号:</span>
            <span size="mini" style="color:#FF0000"> {{ num }} </span>
            <span size="mini">时间：</span>
            <span size="mini" style="color:#FF0000"> {{ searchData.startDateTime }} </span>
            <span size="mini">至</span>
            <span size="mini" style="color:#FF0000"> {{ searchData.endDateTime }} </span>
            <el-table
              border
              :data="sensor.slice((diacurrentPage-1)*diapageSize,diacurrentPage*diapageSize)"
              :default-sort = "{prop: 'time', order: 'ascending'}">
              :default
              <el-table-column align="center" prop="time" label="上传时间" sortable></el-table-column>
              <el-table-column align="center" prop="value" label="采集数值"></el-table-column>
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
      <el-table-column label="传感器数据图表" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="clickgraph(scope.row,scope.$index)">查看图表</el-button>
          <el-dialog title="传感器数据曲线图" :visible.sync="graphvisible">
            <span size="mini">序列号:</span>
            <span size="mini" style="color:#FF0000"> {{ searchData.sn }} </span>
            <span size="mini">传感器编号:</span>
            <span size="mini" style="color:#FF0000"> {{ num }} </span>
            <span size="mini">时间：</span>
            <span size="mini" style="color:#FF0000"> {{ searchData.startDateTime }} </span>
            <span size="mini">至</span>
            <span size="mini" style="color:#FF0000"> {{ searchData.endDateTime }} </span>
            <ve-line :data="chartData" :extend="extend"></ve-line>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>

    <template slot="footer">
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
export default {
  data () {
    this.extend = {
      series: {
        label: {
          normal: {
            show: true
          }
        }
      }
    }
    return {
      dat: [
        {
          sn: 'E529A17010001',
          num: '0000001',
          categories: '压力传感器',
          position: '东门大桥1号桥墩西',
          name: '东门大桥1号桥墩西压力',
          range: '20',
          unit: 'MPa',
          sensor: [
            {
              time: '2018-9-10 12:01:01',
              value: 1
            },
            {
              time: '2018-9-10 12:02:01',
              value: 2
            },
            {
              time: '2018-9-10 12:03:01',
              value: 0
            },
            {
              time: '2018-9-10 12:04:01',
              value: -1
            },
            {
              time: '2018-9-10 12:05:01',
              value: 300
            },
            {
              time: '2018-9-10 12:06:01',
              value: 100
            },
            {
              time: '2018-9-10 12:07:01',
              value: 2
            },
            {
              time: '2018-9-10 12:08:01',
              value: 0
            },
            {
              time: '2018-9-10 12:09:01',
              value: -100
            },
            {
              time: '2018-9-10 12:10:01',
              value: 3
            },
            {
              time: '2018-9-10 12:11:01',
              value: 1
            },
            {
              time: '2018-9-10 12:12:01',
              value: 2
            },
            {
              time: '2018-9-10 12:13:01',
              value: 1
            },
            {
              time: '2018-9-10 12:18:01',
              value: 200
            },
            {
              time: '2018-9-10 12:19:01',
              value: 0
            },
            {
              time: '2018-9-10 12:25:01',
              value: -100
            },
            {
              time: '2018-9-10 12:29:01',
              value: 3
            },
            {
              time: '2018-9-10 13:01:01',
              value: 1
            },
            {
              time: '2018-9-15 12:07:01',
              value: 2
            },
            {
              time: '2018-9-19 12:08:01',
              value: 0
            },
            {
              time: '2018-9-22 12:09:01',
              value: -1
            },
            {
              time: '2018-9-30 12:10:01',
              value: 3
            },
            {
              time: '2018-9-30 13:11:01',
              value: 1
            },
            {
              time: '2018-9-30 14:12:01',
              value: 0
            },
            {
              time: '2018-9-30 14:15:01',
              value: -10
            },
            {
              time: '2018-9-30 14:19:01',
              value: 100
            },
            {
              time: '2018-9-30 14:20:01',
              value: 200
            },
            {
              time: '2018-9-30 15:12:01',
              value: -400
            },
            {
              time: '2018-9-30 16:12:01',
              value: -500
            },
            {
              time: '2018-9-30 17:12:01',
              value: 1000
            },
            {
              time: '2018-9-30 18:12:01',
              value: -800
            }
          ]
        },
        {
          sn: 'E529A17010001',
          num: '0000002',
          categories: '压力传感器',
          position: '东门大桥2号桥墩西',
          name: '东门大桥2号桥墩西压力',
          range: '20',
          unit: 'MPa',
          sensor: [
            {
              time: '2018-9-30 14:12:01',
              value: 0
            },
            {
              time: '2018-9-30 14:15:01',
              value: -10
            },
            {
              time: '2018-9-30 14:19:01',
              value: 100
            },
            {
              time: '2018-9-30 14:20:01',
              value: 200
            },
            {
              time: '2018-9-30 15:12:01',
              value: -400
            },
            {
              time: '2018-9-30 16:12:01',
              value: -500
            }
          ]
        },
        {
          sn: 'E529A17010001',
          num: '0000004',
          categories: '压力传感器',
          position: '东门大桥2号桥墩西',
          name: '东门大桥2号桥墩西压力',
          range: '20',
          unit: 'MPa',
          sensor: [
            {
              time: '2018-9-30 14:12:01',
              value: 0
            },
            {
              time: '2018-9-30 14:15:01',
              value: -10
            },
            {
              time: '2018-9-30 14:19:01',
              value: 100
            },
            {
              time: '2018-9-30 14:20:01',
              value: 200
            },
            {
              time: '2018-9-30 15:12:01',
              value: -400
            },
            {
              time: '2018-9-30 16:12:01',
              value: -500
            }
          ]
        },
        {
          sn: 'E529A17010001',
          num: '0000005',
          categories: '压力传感器',
          position: '东门大桥2号桥墩西',
          name: '东门大桥2号桥墩西压力',
          range: '20',
          unit: 'MPa',
          sensor: [
            {
              time: '2018-9-30 14:12:01',
              value: 0
            },
            {
              time: '2018-9-30 14:15:01',
              value: -10
            },
            {
              time: '2018-9-30 14:19:01',
              value: 100
            },
            {
              time: '2018-9-30 14:20:01',
              value: 200
            },
            {
              time: '2018-9-30 15:12:01',
              value: -400
            },
            {
              time: '2018-9-30 16:12:01',
              value: -500
            }
          ]
        },
        {
          sn: 'E529A17010001',
          num: '0000006',
          categories: '压力传感器',
          position: '东门大桥2号桥墩西',
          name: '东门大桥2号桥墩西压力',
          range: '20',
          unit: 'MPa',
          sensor: [
            {
              time: '2018-9-30 14:12:01',
              value: 0
            },
            {
              time: '2018-9-30 14:15:01',
              value: -10
            },
            {
              time: '2018-9-30 14:19:01',
              value: 100
            },
            {
              time: '2018-9-30 14:20:01',
              value: 200
            },
            {
              time: '2018-9-30 15:12:01',
              value: -400
            },
            {
              time: '2018-9-30 16:12:01',
              value: -500
            }
          ]
        },
        {
          sn: 'E529A17010001',
          num: '0000007',
          categories: '压力传感器',
          position: '东门大桥2号桥墩西',
          name: '东门大桥2号桥墩西压力',
          range: '20',
          unit: 'MPa',
          sensor: [
            {
              time: '2018-9-30 14:12:01',
              value: 0
            },
            {
              time: '2018-9-30 14:15:01',
              value: -10
            },
            {
              time: '2018-9-30 14:19:01',
              value: 100
            },
            {
              time: '2018-9-30 14:20:01',
              value: 200
            },
            {
              time: '2018-9-30 15:12:01',
              value: -400
            },
            {
              time: '2018-9-30 16:12:01',
              value: -500
            }
          ]
        }
      ],
      alldev: [
        {
          sn: 'E529A17010001',
          status: '0'
        },
        {
          sn: 'E529A17010002',
          status: '1'
        },
        {
          sn: 'E529A17010003',
          status: '1'
        },
        {
          sn: 'E529A17010004',
          status: '0'
        }
      ],
      rules: {
        sn: [
          { required: true, message: '请选择SN号', trigger: 'blur' }
        ],
        startTime: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        endTime: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      searchData: {
        sn: '',
        startTime: '',
        endTime: '',
        startDateTime: '',
        endDateTime: ''
      },
      chartData: {
        columns: ['time', 'value'],
        rows: [ ]
      },
      curNum: 0,
      sensor: [ ],
      totalItem: 0,
      pageSize: 10,
      currentPage: 1,
      diatotalItem: 0,
      diapageSize: 10,
      diacurrentPage: 1,
      loading2: false,
      dialogTableVisible: false,
      graphvisible: false,
      pickerOptions1: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        },
        {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        },
        {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  created: function () {
    this.initDev()
    this.initPage()
  },
  methods: {
    onSubmit (searchData) {
      this.$refs[searchData].validate((valid) => {
        if (valid) {
          // alert(this.searchData.startTime)
          // alert(this.searchData.endTime)
          var search = {
            sn: this.searchData.sn,
            startStamp: this.searchData.startTime.getTime(),
            endStamp: this.searchData.endTime.getTime()
          }
          this.searchData.startDateTime = this.formatDate(search.startStamp)
          this.searchData.endDateTime = this.formatDate(search.endStamp)
          // alert(search.sn + search.startStamp + search.endStamp)
          this.loading2 = true
          if (this.dat.length !== 0) {
            this.loading2 = false
          }
        } else {
          return false
        }
      })
    },
    handleSizeChange (pSize) {
      this.pageSize = pSize
      // alert('每页条数:' + pSize)
    },
    handleCurrentChange (curPage) {
      this.currentPage = curPage
      // alert('当前页：' + curPage)
    },
    diahandleSizeChange (diapSize) {
      this.diapageSize = diapSize
      // alert('dia每页条数:' + diapSize)
    },
    diahandleCurrentChange (diacurPage) {
      this.diacurrentPage = diacurPage
      // alert('dia当前页：' + diacurPage)
    },
    initPage: function () {
      this.totalItem = this.dat.length
      // alert('总条数：' + this.totalItem)
    },
    initDev: function () {
      // var allDev = []
      // this.alldev = allDev
    },
    statusFormat (row, column) {
      if (row.status === 0) {
        return '离线'
      } else {
        return '在线'
      }
    },
    clickCheck (row, index) {
      this.dialogTableVisible = true
      for (var i = 0; i < this.dat.length; i++) {
        if (this.dat[i].num === row.num) {
          this.sensor = this.dat[i].sensor
          this.diatotalItem = this.sensor.length
          this.curNum = row.num
          return
        }
      }
    },
    clickgraph (row, index) {
      this.graphvisible = true
      for (var i = 0; i < this.dat.length; i++) {
        if (this.dat[i].num === row.num) {
          this.curNum = row.num
          this.chartData.rows = this.dat[i].sensor
          return
        }
      }
    },
    formatDate (timestamp) {
      var date = new Date(timestamp)
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-'
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    }
  }
}
</script>

<style lang="scss" scoped>
.inner {
  position: absolute;
  top: 20px;
  right:  20px;
  bottom: 20px;
  left: 20px;
}
</style>
