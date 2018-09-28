<template>
<div id="tableContainer">
<table class="scrollTable">
    <thead class="fixedHeader">
      <tr>
        <th v-for="key in columns" v-bind:key="key"
          @click="sortBy(key)"
          :class="{ active: sortKey == key }">
          {{ key | capitalize }}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
        <th>
          oper
        </th>
      </tr>
    </thead>
    <tbody class="scrollContent">
      <tr v-for="entry in filteredData" v-bind:key="entry.index">
        <td v-for="key in columns" v-bind:key="key">{{entry[key]}}</td>
        <td>
        <el-button v-on:click="startup(entry)">
          start
        </el-button>
        </td>
      </tr>
      <tr v-show="isShow" v-for="trip in dbTrips" v-bind:key="trip.id">
        <td>{{trip.car}}</td>
        <td>{{trip.data}}</td>
        <td>
          <el-button v-on:click="startup(trip)">
          start
          </el-button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import api from '@/api/api'

export default {
  props: {
    trips: Array,
    columns: Array,
    filterKey: String
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
      isShow: false,
      dbTrips: [ { 'car': 'CAR', 'data': 'DATA' } ]
    }
  },
  mounted () {
    this.refreshTrips()
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.dbTrips
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    startup: function (entry) {
      // console.log('child component:', entry)
      this.$emit('trajactory-startup', entry)
    },
    // initData: function (criteria) {
    //   console.log(criteria)
    // },
    async refreshTrips () {
      // this.loading = true
      var tmp = await api.getTrips('id={"$gt":0}')
      if (tmp) {
        this.dbTrips = tmp
        this.isShow = true
      }
    }
  }
}
</script>

<style scoped>
@import "tb-style.css";
</style>
