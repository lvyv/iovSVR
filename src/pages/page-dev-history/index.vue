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
      :data="dat.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      :default-sort = "{prop: 'time', order: 'descending'}"
      :rowHandle="rowHandle"
      @custom-emit-1="handleCustomEvent">
      <el-table-column align="center" prop="sn" label="序列号" sortable></el-table-column>
      <el-table-column align="center" prop="num" label="设备自编号" sortable></el-table-column>
      <el-table-column prop="position" align="center" label="安装点位"></el-table-column>

      <el-table-column label="管理员" align="center">
        <el-table-column align="center" prop="name" label="姓名"></el-table-column>
        <el-table-column align="center" prop="phone" label="电话"></el-table-column>
      </el-table-column>

      <el-table-column align="center" prop="status" label="在线状态" :formatter="statusFormat"></el-table-column>
      <el-table-column align="center" prop="time" label="上传时间" sortable></el-table-column>
      <el-table-column align="center" prop="address" label="上传地址"></el-table-column>

      <el-table-column label="传感器数据" align="center"></el-table-column>
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
    return {
      dat: [
        {
          sn: 'E529A17010001',
          num: '0000001',
          time: '2016-05-16',
          position: '东门大桥1号桥墩西',
          status: 0,
          address: '成都市东门大街12',
          press: '12Mpa',
          move: 0.1,
          quake: 1,
          name: '张三',
          phone: '13332112345'
        },
        {
          sn: 'E529A17010001',
          num: '0000001',
          time: '2016-05-15',
          position: '东门大桥2号桥墩',
          status: 0,
          address: '成都市东门大街12',
          press: '12Mpa',
          move: 0.1,
          quake: 1,
          name: '张三',
          phone: '13332112345'
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
        endTime: ''
      },
      totalItem: 0,
      pageSize: 10,
      currentPage: 1,
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
          alert(this.searchData.startTime)
          alert(this.searchData.endTime)
          var search = {
            sn: this.searchData.sn,
            startStamp: this.searchData.startTime.getTime(),
            endStamp: this.searchData.endTime.getTime()
          }
          alert(search.sn + search.startStamp + search.endStamp)
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
    }
  }
}
</script>
