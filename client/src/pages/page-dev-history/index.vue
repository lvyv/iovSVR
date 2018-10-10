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
          <el-date-picker v-model="searchData.startTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择时间"  :picker-options="pickerOptions1"></el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="searchData.endTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择时间"  :picker-options="pickerOptions1"></el-date-picker>
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
      <el-table-column align="center" prop="fac" label="传感器厂家"></el-table-column>
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
            <span size="mini" style="color:#FF0000"> {{ curNum }} </span>
            <span size="mini">时间：</span>
            <span size="mini" style="color:#FF0000"> {{ searchData.startTime }} </span>
            <span size="mini">至</span>
            <span size="mini" style="color:#FF0000"> {{ searchData.endTime }} </span>
            <el-table
              border
              :data="sensor.slice((diacurrentPage-1)*diapageSize,diacurrentPage*diapageSize)"
              :default-sort = "{prop: 'time', order: 'ascending'}">
              :default
              <el-table-column align="center" prop="time" label="上传时间" sortable></el-table-column>
              <el-table-column align="center" prop="value" label="采集数值"></el-table-column>
            </el-table>
            <template slot="footer">
              <pagination
              :total="diatotalItem"
              @pageChange="diapageChange">
              </pagination>
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
            <span size="mini" style="color:#FF0000"> {{ curNum }} </span>
            <span size="mini">时间：</span>
            <span size="mini" style="color:#FF0000"> {{ searchData.startTime }} </span>
            <span size="mini">至</span>
            <span size="mini" style="color:#FF0000"> {{ searchData.endTime }} </span>
            <ve-line :data="chartData" :extend="extend"></ve-line>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>

    <template slot="footer">
      <pagination
        :total="totalItem"
        @pageChange="pageChange">
      </pagination>
    </template>
  </d2-container>
</template>

<script>
import api from '@/api/api'
import pagination from '@/components/pagination/pagination.vue'

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
      dat: [ ],
      sensorcfg: [ ],
      alldev: [ ],
      senid: [ ],
      // sensors: [ ],
      // {type: 'date', required: true, message: '请选择日期', trigger: 'change' },
      // 因为输入value-format不为date格式，如果rules中日期type为'date'则会报错，因此去掉
      rules: {
        sn: [
          { required: true, message: '请选择SN号', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      searchData: {
        sn: '',
        startTime: '',
        endTime: ''
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
  },
  components: {
    pagination: pagination
  },
  methods: {
    onSubmit (searchData) {
      this.$refs[searchData].validate((valid) => {
        if (valid) {
          if (new Date(this.searchData.endTime) < new Date(this.searchData.startTime)) {
            alert('错误：起始时间应早于结束时间')
            return
          }
          this.loading2 = true
          for (var id in this.alldev) {
            if (this.alldev[id].sn === this.searchData.sn) {
              this.getsensors(this.alldev[id].devid)
              break
            }
          }
          if (id === this.alldev.length - 1) {
            this.loading2 = false
          }
        } else {
          return false
        }
      })
    },
    pageChange (page) {
      this.pageSize = page.pageSize
      this.currentPage = page.currentPage
    },
    diapageChange (page) {
      this.diapageSize = page.pageSize
      this.diacurrentPage = page.currentPage
    },
    async initDev () {
      var devtmp = await api.getDevInfo('id={"$gt":0}')
      if (devtmp) {
        for (var i in devtmp) {
          var Dev = {
            'sn': devtmp[i].sn,
            'devid': devtmp[i].devid
          }
          this.alldev.push(Dev)
        }
      }
      var sencfgtmp = await api.getSensorCfg('id={"$gt":0}')
      if (sencfgtmp) {
        for (var j in sencfgtmp) {
          var sensorCFG = {
            'type': sencfgtmp[j].id,
            'name': sencfgtmp[j].name,
            'range': sencfgtmp[j].range,
            'unit': sencfgtmp[j].unit
          }
          this.sensorcfg.push(sensorCFG)
        }
      }
    },
    async getsensors (devId) {
      var Sensors = await api.getSensors('devid={"$eq":' + devId + '}')
      if (Sensors) {
        this.senid = []
        this.dat = []
        for (var idx in Sensors) {
          for (var jdx in this.sensorcfg) {
            if (this.sensorcfg[jdx].type === Sensors[idx].sensortype) {
              var sentmp = {
                'sn': this.searchData.sn,
                'num': parseInt(Sensors[idx].sensorid),
                'categories': this.sensorcfg[jdx].name,
                'position': Sensors[idx].position,
                'fac': Sensors[idx].sensorfac,
                'range': parseInt(this.sensorcfg[jdx].range),
                'unit': this.sensorcfg[jdx].unit,
                sensor: [ ]
              }
              this.senid.push(sentmp.num)
              this.dat.push(sentmp)
              break
            }
          }
        }
        this.totalItem = this.dat.length
        var Sendat = await api.getSensorData(this.senid, this.searchData.startTime, this.searchData.endTime)
        if (Sendat) {
          for (var s in Sendat) {
            for (var d in this.dat) {
              if (Sendat[s].sensorid === this.dat[d].num) {
                var sensorValue = {
                  'value': Sendat[s].value,
                  'time': Sendat[s].time.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
                }
                // var dateee = new Date("2017-07-09T09:46:49.667").toJSON()
                // var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
                this.dat[d].sensor.push(sensorValue)
                break
              }
            }
          }
        }
        this.loading2 = false
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
