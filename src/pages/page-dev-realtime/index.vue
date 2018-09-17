<template>
  <d2-container>
    <el-table
    :data="dat.slice((currentPage-1)*pageSize,currentPage*pageSize)"
    style="width: 100%"
    :default-sort = "{prop: 'sn', order: 'ascending'}">
    :default
    <el-table-column
      prop="sn"
      label="序列号"
      sortable>
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
          time: '2016-05-02',
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
          sn: 'E529A17010002',
          num: '0000002',
          time: '2016-05-04',
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
          sn: 'E529A17010003',
          num: '0000003',
          time: '2016-05-01',
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
          sn: 'E529A17010004',
          num: '0000004',
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
          sn: 'E529A17010005',
          num: '0000005',
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
          sn: 'E529A17010006',
          num: '0000006',
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
          sn: 'E529A17010007',
          num: '0000007',
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
          sn: 'E529A17010008',
          num: '0000008',
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
          sn: 'E529A17010009',
          num: '0000009',
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
          sn: 'E529A17010010',
          num: '0000010',
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
          sn: 'E529A17010011',
          num: '0000011',
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
          sn: 'E529A17010012',
          num: '0000012',
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
          sn: 'E529A17010013',
          num: '0000013',
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
          sn: 'E529A17010014',
          num: '0000014',
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
          sn: 'E529A17010015',
          num: '0000015',
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
          sn: 'E529A17010016',
          num: '0000016',
          time: '2016-05-03',
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
      totalItem: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  created: function () {
    this.initPage()
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
    }
  }
}
</script>
