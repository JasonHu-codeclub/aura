/*
* 重复会议详情 
*/
<template>
  <div class="app-wrap repeat-wrap">
    <!-- 搜索 -->
    <div class="filter">
      <div class="filter-item">
        <!-- 参会人员 -->
        <!-- <div class="filter-item-box">
          <el-input type="text" 
          v-model="searchForm.member" 
          size="mini" 
          :placeholder="$t('placeholder.participants')" 
          @clear="getMeetingRepet" 
          clearable></el-input>
        </div> -->
        <!-- 日期 -->
        <div class="filter-item-box">
          <span>{{$t('labe.date')}}：</span>
          <el-date-picker
            v-model="chooseDate"
            type="daterange"
            class="choose-date"
            :placeholder="$t('placeholder.date')"
            value-format="yyyy-MM-dd"
            :editable="false"
            :picker-options="pickerOptions"
            :start-placeholder="$t('message.startDates')"
            :end-placeholder="$t('message.endDates')"
            range-separator="-"
            @change="getMeetingRepet"
            >></el-date-picker>
        </div>
        <div class="filter-item-box">
          <!-- 查询 -->
          <el-button
            type="primary"
            class="search"
            @click="getMeetingRepet"
            :loading="searchBtnStatus"
            >{{$t('button.search')}}</el-button
          >
        </div>
      </div>
    </div>
    <!-- /搜索 -->

    <!-- 表格 -->
    <div class="repeat-table">
        <el-table
          ref="table"
          :data="myMeetingInfo"
          :height="tableHeight-210"
          tooltip-effect="light"
          style="width: 100%"
          header-row-class-name="table-header"
          v-loading="dataLoading"
        >
          <!-- 序号 -->
          <el-table-column
            :label="$t('message.serial')"
            type="index"
            width="80"
            align="center"
          >
          </el-table-column>
          <!-- 主题 -->
          <el-table-column
            prop="title"
            :label="$t('message.theme')"
            align="center"
            min-width="140"
            show-overflow-tooltip
          ></el-table-column>
          <!-- 会议时间 -->
          <el-table-column
            prop="start"
            :label="$t('message.meetingTime')"
            align="center"
            width="280"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span >{{scope.row.start}}</span><br><span>{{scope.row.end}}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            prop="status"
            :label="$t('message.status')"
            align="center"
          >
           <template slot-scope="scope">{{statusList[scope.row.status]}}</template>
          </el-table-column>
          <!-- 参会人员 -->
          <el-table-column
            prop="personnel"
            :label="$t('placeholder.participants')"
            align="center"
            show-overflow-tooltip
          >
           <template slot-scope="scope">
             <span class="people-num">{{scope.row.participant}}{{$t('message.people')}}</span>
             </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            width="140"
            :label="$t('message.operation')"
            align="center"
          >
            <template slot-scope="scope">
              <el-button 
                v-if="!isInvitation"
                type="text" 
                :disabled="scope.row.status == 1"
                @click="deleteMeeting(scope.row)"
                >
                {{$t('button.cancel')}}
              </el-button>
              <!-- <el-button type="text"  @click="detailsMeeting(scope.row)">{{$t('button.details')}}</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 数据统计 -->
        <div class="repeat-statistics" >
           <div class="repeat-box">
             <span class="repeat-box-value">{{$t('message.total')}}<i class="blue"> {{repeInfo.total}} </i>{{repeInfo.meetTotal}}</span>
           </div>
           <div class="repeat-box">
             <span class="repeat-box-label">{{$t('message.DateRange')}}：</span>
             <span class="repeat-box-value blue">{{repeInfo.DateRange||'--'}}</span>
           </div>
           <div class="repeat-box">
             <span class="repeat-box-label">{{$t('message.AppointmentType')}}：</span>
             <span class="repeat-box-value blue">{{repeInfo.categoryStr||'--'}}</span>
           </div>
           <div class="repeat-box">
             <span class="repeat-box-label">{{$t('message.sender')}}：</span>
             <span class="repeat-box-value blue">{{repeInfo.user_name||'--'}}</span>
           </div>
        </div>

        <pagination
          :total="total"
          :background='false'
          :page.sync="paginationQuery.page"
          :limit.sync="paginationQuery.limit"
          @change="getMeetingRepet"
        />
    </div>

    <!-- 取消弹框 -->
    <dialog-cancel ref="cancel" :content="cancelContent" :title="cancelTitle" :btnLoading="deleteBtnLoading"  @hanldConfirm="hanldDeleteMeeting"></dialog-cancel>
  </div>
</template>

 <script>
import {
  getRepeatDetailApi,
  meetCancelApi
} from '@/api/currentMeet'
 import Pagination from '@/components/Pagination'
 import dialogCancel from './components/dialogCancel'
 import qs from 'querystring' 
export default {
  components: { Pagination, dialogCancel },
  data () {
    return {
      searchForm:{
        meetingTheme: '', // 查询主题
        meetRoom: '',// 会议室
        member: ''// 参会人员
      },
      chooseDate: null, // 日期
      paginationQuery: { 
        page: 1, // 当前页
        limit: 10, // 每页显示条目个数
      },
      total: 0,// 总页数
      searchBtnStatus: false,
      myMeetingInfo: [],
      selectCurrentRowData: {},
      deleting: false, // 取消按钮状态
      currentData: {},
      dataLoading: false,// 表格loading
      isInvitation: false,
      cancelTitle: '',// 取消提示
      dialogVisible: false,// 取消提示弹窗
      cancelContent: '', // 提示内容
      deleteBtnLoading: false, // 提示确认按钮loading
      repeInfo: '',
      statusList: ['审批中', '会议中', '未开始', '已结束', '已拒绝', '已取消', '过期未审批'], // 会议状态 0=>审批中 1=》会议中，2=》未开始，3=》已结束，4=》已拒绝,5=》已取消，6=》过期未审批
      category: ['', '单次预约', '重复预约', '跨日预约'],
      repetitionType: ['', '每日', '每周', '每月'],
      categoryStr: '', // 会议重复类型
      pickerOptions: {// 控制日期选择
        disabledDate (time) {
          // return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
    }
  },
  mounted () { 
    // 获取数据
    this.getMeetingRepet()
    this.resizeHeight(100)
    // 活动菜单
    let menu = this.$route.query.menu
    this.$route.meta.activeMenu = menu === 'current' ? '/current/current_list' : '/history/history_list'
    this.isInvitation =  menu === 'current' ? false : true
  },
  methods: {
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleCurrentChange (currentRow, oldRow) {
      // this.selectCurrentRowData = currentRow || {}
    },
    // 获取数据
    getMeetingRepet () {
      let id = this.$route.query.id
      let params = {
        type: 3, // 重复会议
        id: id,
        page: this.paginationQuery.page,
        size: this.paginationQuery.limit,
        start_date: this.chooseDate ? this.chooseDate[0] : '',
        end_date: this.chooseDate ? this.chooseDate[1] : '',
      }
      this.dataLoading = true
      getRepeatDetailApi(params).then(res=>{
        this.dataLoading = false
        let data = res.data.meeting
        this.myMeetingInfo = data.meetings     // 列表数据
        this.repeInfo = data // 列表底部数据总览
        this.total = data.total        // 总条数
        this.repeInfo.meetTotal = `${this.$t('message.Company')}，${data.is_finished}${this.$t('message.meetOver')}`
        this.repeInfo.DateRange = `${data.start} 至 ${data.end}`
        this.repeInfo.categoryStr = `${this.category[data.category]}（${this.repetitionType[data.repetition_type]}）`
        
      })
    },
    // 取消会议
    deleteMeeting (data) {
      // status: 0审批中 1会议中 2未开始 
      this.$refs.cancel.dialogVisible= true
      this.selectCurrentRowData = data
      this.cancelTitle = this.$t('message.cancelTips')
      this.cancelContent = `${this.$t('tip.cancelMeeting')}<br/>${this.$t('tip.confirmTips')}`
    },
    // 取消会议请求
    async hanldDeleteMeeting() {
      let data = this.selectCurrentRowData
      const param = {
        id: data.id,
        type: 1,
        date: data.date
      }
      this.deleteBtnLoading = true // 确认按钮loading
      meetCancelApi(param).then(res=>{
        this.deleteBtnLoading = false 
        if(res.meta.code == "RESP_OKAY"){
          this.$message({
            message: this.$t('tip.meetCancelled'),
            type: 'success'
          })
          this.getMeetingRepet()
          this.$refs.cancel.dialogVisible = false // 弹框
        }
      })
    },

    // 会议详情
    detailsMeeting(row) {
      this.$router.push({
        path: '/detailsMeet',
        query: {
          menu: this.$route.query.menu,
          guid: row.guid,
          outEventId : row.out_event_id
        }
      })
    }
  },
  beforeDestroy () {
    // 注销onresizes事件
    window.onresize = null;
  }
}
 </script>

<style lang='less' scoped>
.repeat-wrap {
    .filter {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      box-sizing: border-box;
      padding: 20px 0 0;
    .filter-item{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      /deep/.el-input{
        width: auto;
      }
    }
    .filter-item-box{
      display: flex;
      margin: 0 20px 20px 0;
      align-items: center;
      /deep/.el-input__inner{
        width: 180px;
        height: 36px;
      }
      .choose-date{
        width: 260px;
      }
      /deep/.el-button{
        width: 80px;
        font-size: 14px;
      }
    }
  }

  .repeat-table{
    overflow-y: hidden;
    overflow-x: hidden;
    margin-top: 20px;
    .meeting-time{
       display: block;
    }
    .people-num{
      display: inline-block;
      width: 40px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #F5F8FF;
      color: #56697D;
      border-radius: 20px;
      font-size: 12px;
    }
  }

  /deep/.table-header{
  th{
    background: #F6F7FC !important;
  }
}
/deep/.el-table--medium td, .el-table--medium th{
  padding: 6px 0;
  font-size: 14px;
  color: #56697D;
}
  /deep/.el-table {
    .el-table__header-wrapper {
      .el-table__header {
        tr {
          th {
            background-color: white;
            font-weight: normal;
            font-size: 14px;
            padding: 7px 0;
            color: #384677;
            // color: white;
            &.is-leaf {
              // border-bottom: 1px solid white;
            }
          }
        }
      }
    }

    .el-table__body-wrapper {
      .el-table__body {}
    }
  }

  .repeat-statistics{
    margin: 22px 0 0;
    .repeat-box {
      display: inline-block;
      margin: 0 48px 14px 0;
      font-size: 14px;
      color: #56697D;
      .blue{
        color: #5C7BEA;
      }
    }
  }

}
</style>