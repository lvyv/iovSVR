<template>
  <d2-container>
    <template slot="header">
    <span class="demonstration">选择SN：</span>
      <el-select v-model="searchData.sn" placeholder="选择SN">
        <el-option
        v-for="item in alldev"
        :key="item.sn"
        :value="item.sn">
        </el-option>
      </el-select>
    <span class="demonstration">起始时间：</span>
    <el-date-picker v-model="searchData.startTime" type="datetime" placeholder="选择时间" align="right" :picker-options="pickerOptions1"></el-date-picker>
    <span class="demonstration">结束时间：</span>
    <el-date-picker v-model="searchData.endTime" type="datetime" placeholder="选择时间" align="right" :picker-options="pickerOptions1"></el-date-picker>
    <el-button type="primary" @click="onSubmit">查询</el-button>
    </template>
    <el-table
    :data="dat.slice((currentPage-1)*pageSize,currentPage*pageSize)"
    style="width: 100%"
    :default-sort = "{prop: 'time', order: 'descending'}">
    <el-table-column
      prop="sn"
      label="序列号">
    </el-table-column>
    <el-table-column
      prop="num"
      label="设备自编号">
    </el-table-column>
    <el-table-column
      prop="position"
      label="安装点位">
    </el-table-column>
    <el-table-column label="管理员" align="center">
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话">
      </el-table-column>
    </el-table-column>
    <el-table-column
      prop="status"
      label="在线状态">
    </el-table-column>
    <el-table-column
      prop="time"
      label="上传时间"
      sortable>
    </el-table-column>
      <el-table-column
      prop="address"
      label="上传地址">
    </el-table-column>
    <el-table-column label="传感器数据" align="center">
      <el-table-column
        prop="press"
        label="压力值">
      </el-table-column>
      <el-table-column
        prop="move"
        label="位移量">
      </el-table-column>
      <el-table-column
        prop="quake"
        label="震动">
      </el-table-column>
    </el-table-column>
  </el-table>
    <template slot="footer" alagn="center">
    <el-pagination
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
          position: '东门大桥1号桥墩',
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
        },
        {
          sn: 'E529A17010001',
          num: '0000001',
          time: '2016-05-14',
          position: '东门大桥3号桥墩',
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
          time: '2016-05-13',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-12',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-11',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-10',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-09',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-08',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-07',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-06',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-05',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-04',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-03',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-02',
          position: '东门大桥4号桥墩',
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
          time: '2016-05-01',
          position: '东门大桥4号桥墩',
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
        },
        {
          sn: 'E529A17010005',
          status: '0'
        },
        {
          sn: 'E529A17010006',
          status: '0'
        },
        {
          sn: 'E529A17010007',
          status: '0'
        },
        {
          sn: 'E529A17010008',
          status: '0'
        },
        {
          sn: 'E529A17010009',
          status: '0'
        },
        {
          sn: 'E529A17010010',
          status: '0'
        }
      ],
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
    onSubmit () {
      this.searchData.startTime = this.searchData.startTime.getTime()
      this.searchData.endTime = this.searchData.endTime.getTime()
      alert(this.searchData.sn + this.searchData.startTime + this.searchData.endTime)
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
    }
  }
}
</script>
