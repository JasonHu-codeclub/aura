/*
数据概览
*/ 
<template>
  <div class="app-wrap overview">
     <div class="overview-top">
       <div class="overview-top-left">
        <div class="overview-top-statis">{{$t('message.statistics')}}</div>
        <el-radio-group v-model="tabPosition" >
          <el-radio-button :label="1">{{$t('message.week')}}</el-radio-button>
          <el-radio-button :label="2">{{$t('message.month')}}</el-radio-button>
          <el-radio-button :label="3">{{$t('message.year')}}</el-radio-button>
        </el-radio-group>
       </div>
       <div class="overview-top-right">
         <div class="overview-top-rigth_item">
           <div class="top-rigth_item-dec">
             <span class="top-rigth_item-label">{{$t('message.CumulativeDuration')}}</span>
             <span class="top-rigth_item-value">{{statisticsData.total_time}}</span>
           </div>
           <div class="top-rigth_item-icon icon-dur"></div>
         </div>
         <div class="overview-top-rigth_item">
           <div class="top-rigth_item-dec">
             <span class="top-rigth_item-label">{{$t('message.CumulativeNumber')}}</span>
             <span class="top-rigth_item-value">{{statisticsData.total_count}}</span>
           </div>
           <div class="top-rigth_item-icon icon-num"></div>
         </div>
         <div class="overview-top-rigth_item">
           <div class="top-rigth_item-dec">
             <span class="top-rigth_item-label">{{$t('message.meeting')}}</span>
             <span class="top-rigth_item-value">{{statisticsData.my_count}}</span>
           </div>
           <div class="top-rigth_item-icon icon-meet"></div>
         </div>
         <div class="overview-top-rigth_item">
           <div class="top-rigth_item-dec">
             <span class="top-rigth_item-label">{{$t('message.invited')}}</span>
             <span class="top-rigth_item-value">{{statisticsData.other_count}}</span>
           </div>
           <div class="top-rigth_item-icon icon-invite"></div>
         </div>
       </div>
     </div>
     <div class="overview-bottom">
        <bar-chart ref="chartRef" :dataJson="chartData"/>
     </div>
  </div>
</template>

<script>
import { getStatisticsApi } from '@/api/appoint'
import LineChart from '@/components/LineChart'
import BarChart from '@/components/BarChart'
import PieChart from '@/components/PieChart'
import zh from '@/lang/zh'
const lineChartData = {
  weeks: {
    title: [],
    duration: ['', '', '', '', '', '', ''],
    frequency: ['', '', '', '', '', '', '']
  },
  months: {
    title: [],
    duration: [],
    frequency: []
  },
  years: {
    title: [],
    duration: [],
    frequency: []
  }
}
export default {
  components: { LineChart, BarChart, PieChart },
  data() {
    return {
      tabPosition: '1',
      chartData: lineChartData.weeks,
      statisticsData: {},
      getType: [0,1,2,3],
    }
  },
  watch: {
    tabPosition(news, old) {
       this.getStatistics(news, 'change')
    }
  },
  mounted(){
     this.getStatistics()
  },
  methods: {
    // 获取数据
    getStatistics(types=1, nav){
      let params = {type: types ? this.getType[types]: 1}
      getStatisticsApi(params).then(res=>{
        if(res.meta.code=="RESP_OKAY"){
            this.statisticsData = res.data
            let typeStr = 'weeks'
            switch(types){
              case 1:
                typeStr = 'weeks'
                break;
              case 2:
                typeStr = 'months'
                break; 
              case 3:
                typeStr = 'years'
                break; 
            }
          this.resetData(typeStr, res.data, nav)
        }
      })
    },
    // 重组数据
    resetData(types, data, nav) {
      let dataObj = this.handelArr(data[types])
      lineChartData[types]['duration'] = dataObj.arr_hours // 总小时数
      lineChartData[types]['frequency'] = dataObj.arr_count // 总场数
      if(types == 'weeks'||types == 'years'){
        lineChartData[types]['title'] = []
        for(let key in zh[types]){
          lineChartData[types]['title'].push(this.$t(types+'.'+key))
        }
      }
      if(types == 'months'){
        lineChartData[types]['title'] = []
        let monthsStr = []
        for(let key in zh[types]){
          monthsStr.push(this.$t(types+'.' + key))
        }
        data[types].map((res, index)=>{
          lineChartData[types]['title'].push(monthsStr[index])
        })
      }
      
      this.chartData = lineChartData[types]
        this.$refs.chartRef.refreshData(this.chartData)
    },
    // 分离小时数和场次
    handelArr(arr){
      let obj = {
        arr_hours: [],// 总小时数
        arr_count: [] // 总场数
      }
      arr.map(res=>{
        obj.arr_hours.push(res.total_hours)
        obj.arr_count.push(res.total_count)
      })
      return obj
    },
    
  }
}
</script>

<style lang="less" scoped>
 .overview{
   background: none;
    .overview-top {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      height: 160px;
      background: #fff;
      padding: 0 20px;
      align-items: center;
      justify-content: space-between;
      overflow-x: auto;
      .overview-top-left {
        flex: 1;
        min-width: 240px;
        .overview-top-statis{
          min-width: 167px;
          font-size: 14px;
          padding: 0 0 22px;
          
        }
      }
      .overview-top-right{
        display: flex;
        text-align: right;
        .overview-top-rigth_item{
          display: inline-flex;
          width: 188px;
          height: 90px;
          align-items: center;
          padding: 20px;
          justify-content: space-between;
          border: 1px #EAEDF6 solid;
          border-radius: 4px;
          margin-left: 26px;
          .top-rigth_item-dec {
            text-align: center;
            .top-rigth_item-label {
              display: block;
              font-size: 12px;
              color: #778CA2;
              margin-bottom: 6px;
            }
            span.top-rigth_item-value {
              color: #252631;
              font-size: 19.5px;
            }
          }
          .top-rigth_item-icon{
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #eee;
            margin-left: 10px;
            background-size: 100% 100%;
          }
          .icon-dur{
            background: url('../../../assets/icon/icon-dur.png') no-repeat;
          }
          .icon-num{
            background: url('../../../assets/icon/icon-num.png') no-repeat;
          }
          .icon-meet{
            background: url('../../../assets/icon/icon-meet.png') no-repeat;
          }
          .icon-invite{
            background: url('../../../assets/icon/icon-invite.png') no-repeat;
          }
        }
      }
    }
    .overview-bottom {
      position: absolute;
      top: 180px;
      left: 0;
      right: 0;
      bottom: 20px;
      background: #fff;
      padding: 16px 16px 0; 
    }
 }
 /deep/.el-radio-button--medium .el-radio-button__inner{
  padding: 12px 32px;
  border: none;
 }
 /deep/.el-radio-button__inner{
  background: #F3F6FC;
 }
</style>