/*
 * Created: 2021-03-02 09:11:27
 * Author : Jan
 * Last Modified: 2021-03-15 12:03:51
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

<template>
  <div class="app-container">
    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="chart-wrapper"><bar-chart /></div>
      </el-col>
      <el-col :span="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import LineChart from '@/components/LineChart'
import BarChart from '@/components/BarChart'
import PieChart from '@/components/PieChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  components: { LineChart, BarChart, PieChart },
  data () {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  computed: {},
  watch: {},
  methods: {

  },
  created () {

  },
  mounted () {

  },
  beforeCreate () { },
  beforeMount () { },
  beforeUpdate () { },
  updated () { },
  beforeDestroy () { }
}
</script>
<style lang='less' scoped>
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
</style>