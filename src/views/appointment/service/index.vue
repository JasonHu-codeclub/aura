/**
  会议服务
 */
 <template>
  <div class="app-wrap invitation-wrap">
    <!-- 搜索 -->
    <div class="filter">
      <div class="filter-item">
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
            @change="getApproveInfo"
            >></el-date-picker>
        </div>
        <!-- 大厦楼层 -->
        <div class="filter-item-box">
          {{$t('labe.floor')}}：
          <el-cascader 
          class="filter-cascader" 
          v-model="searchForm.floor" 
          :options="optionsFloor"
          :props="props" 
          :placeholder="$t('placeholder.MeetingFloor')"
          :show-all-levels="true"
          @change="getApproveInfo"
          clearable
          ></el-cascader>
        </div>
        <!-- 状态 -->
        <div class="filter-item-box">
          <span>{{$t('labe.status')}}：</span>
          <el-select
            v-model="searchForm.status"
            :placeholder="$t('message.status')"
            @change="getApproveInfo"
            @clear="getApproveInfo"
            clearable
          >
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </div>
        <!-- 会议室 -->
        <div class="filter-item-box">
          <span>{{$t('message.room')}}：</span>
          <el-select
            v-model="searchForm.meeting_room_id"
            :placeholder="$t('message.room')"
            @change="getApproveInfo"
            @clear="getApproveInfo"
            clearable
          >
            <el-option
              v-for="item in roomList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="filter-item-box">
          <!-- 查询 -->
          <el-button
            type="primary"
            class="search"
            @click="getApproveInfo"
            :loading="searchBtnStatus"
            >{{$t('button.search')}}</el-button
          >
          <!-- 重置 -->
          <el-button
            type="info"
            class="search"
            @click="resetMeetingInfo"
            >{{$t('button.reset')}}</el-button
          >
        </div>
      </div>
    </div>
    <!-- /搜索 -->

    <div class="current-table">
        <el-table
          ref="table"
          :data="myMeetingInfo"
          :height="tableHeight-150"
          tooltip-effect="light"
          style="width: 100%"
          header-row-class-name="table-header"
          v-loading="dataLoading"
        >
         <!-- 序号 -->
          <el-table-column
            :label="$t('message.serial')"
            type="index"
            width="60"
            align="center"
          >
          </el-table-column>
          <!-- 主题 -->
          <el-table-column
            prop="title"
            :label="$t('message.theme')"
            align="center"
            width="160"
            show-overflow-tooltip
          >
           <template slot-scope="scope">
             {{scope.row.title}}
           </template>
          </el-table-column>
          <!-- 会议时间 -->
          <el-table-column
            prop="start_time"
            :label="$t('message.meetingTime')"
            align="center"
            width="160"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span :class="{color_tips: scope.row.colorRed}">{{scope.row.satrtTime}}<br>{{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <!-- 会议室 -->
          <el-table-column
            prop="meeting_room_name"
            :label="$t('message.room')"
            align="center"
          ></el-table-column>
          <!-- 状态 -->
          <el-table-column
            prop="status"
            :label="$t('message.meetingStatus')"
            align="center"
          >
            <template slot-scope="scope">
              <span >{{statusStr[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <!-- 参会人数 -->
          <el-table-column
            prop="attendence_number"
            :label="$t('message.participantsNum')"
            align="center"
          >
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.conflict_dec">{{scope.row.conflict_dec}}</span> -->
            <el-tooltip 
            :disabled="!scope.row.attendence_number" 
            placement="top" 
            effect="light" 
            :open-delay="350"
            popper-class="tooltip-per"
            >
              <div slot="content">{{scope.row.is_secret ? '*' : scope.row.participant_users}}</div>
              <span :class="{'part_num':scope.row.attendence_number>0}">{{scope.row.attendence_number||'/'}}</span>
            </el-tooltip>
          </template>
          </el-table-column>
          <!-- 发起人 -->
          <el-table-column
            prop="user_name"
            :label="$t('message.sender')"
            align="center"
          >
            <template slot-scope="scope">
              {{scope.row.conflict_dec ? scope.row.conflict_dec : scope.row.user_name}}
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            :label="$t('message.operation')"
            width="140"
            align="center"
          >
            <template slot-scope="scope">
              <!-- 会服状态 1:服务中 2:待确认 3:已完成 4:已取消 5:过期未服务-->
              <el-button
                type="text"
                @click="detailsMeet(scope.row)">
                {{ $t("button.details") }}
              </el-button>
              <!-- 确认服务 -->
              <el-button
                type="text"
                v-if="scope.row.status==2"
                @click="serviceHandle(scope.row, 1)">
                {{ $t("button.confirmationService") }}
              </el-button>
              <!-- 完成服务 -->
              <el-button 
                type="text" 
                v-if="scope.row.status==1"
                @click="serviceHandle(scope.row, 2)">
                {{ $t("button.completeService") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="total"
          :background='false'
          :page.sync="paginationQuery.page"
          :limit.sync="paginationQuery.limit"
          @change="getApproveInfo"
        />
    </div>
    <!-- 审批会议 -->
    <dialog-cancel 
    ref="cancel"
    :showInput="isShowInput" 
    :content="cancelContent" 
    :title="cancelTitle" 
    :btnLoading="deleteBtnLoading"
    :iconUrl="iconUrl"
    :confirmColor="'#5C7BEA'"
    @handleClose="handleClose" 
    @hanldConfirm="hanldDeleteMeeting"
    ></dialog-cancel>
  </div>
</template>
 <script>
 import { 
   roomListApi,
  getMansionFloorApi,
} from '@api/appoint'
 import {serviceListApi, serviceConfirmApi, serviceFinishApi} from '@/api/service'
 import Pagination from '@/components/Pagination'
 import dialogCancel from '@/views/appointment/current-meet/components/dialogCancel'
export default {
  components: { Pagination , dialogCancel},// 分页
  data () {
    return {
      isCurrent: 1,
      searchForm:{
        status: '',	// 状态
        floor: [], // 会议名称
        meeting_room_id: ''
      },
      optionsFloor: [], // 大厦楼层
      props: { // 楼层级联配置
        value: 'id',
        label: 'name',
        children: 'floor'
      }, 
      chooseDate: null, // 日期
      roomList: [], // 会议室下拉
      statusList: [ // 会服状态 1:服务中 2:待确认 3:已完成 4:已取消 5:过期未服务
        {key: 1, name: '服务中'},
        {key: 2, name: '待确认'},
        {key: 3, name: '已完成'},
        {key: 4, name: '已取消'},
        {key: 5, name: '过期未服务'},
      ],
      statusStr:{
         1: '服务中',
         2: '待确认',
         3: '已完成',
         4: '已取消',
         5: '过期未服务'
      },
      userList: [
        {key: 1, name: '发起人'},
        {key: 2, name: '参会人'}
      ],
      paginationQuery: { 
        page: 1, // 当前页
        limit: 10, // 每页显示条目个数
      },
      // pickerOptions: {// 控制日期选择
      //   disabledDate (time) {
      //     // return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
      //   }
      // },
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      categoryList: {
        1: '单次预约',
        2: '重复预约',
        3: '跨日预约',
      },
      repetitionType: {
        1: '每日',
        2: '每周',
        3: '每月',
      },
      total: 0,// 总页数
      searchBtnStatus: false,// 查询loading
      myMeetingInfo: [],// 列表数据
      selectCurrentRowData: {},// 会议状态
      deleting: false, // 取消按钮状态
      dataLoading: false,// 列表loading
      cancelTitle: '',// 弹窗title
      cancelContent: '',// 弹窗内容
      deleteBtnLoading: false,// 弹窗确认loading
      isShowInput: false, // 拒绝理由
      operationType: null,
      iconUrl: require('../../../assets/icon/service-active.png')// 弹窗icon
    }
  },
  props: {
    dataType: {
      require: true,
      type: Number
    }
  },
  mounted () { 
    // 大厦楼层
    this.getFloorList()
    // 获取会议
    this.getRoomList()
    // 获取数据
    this.getApproveInfo()
    this.resizeHeight(100)
    const fn = function () {
      that.setTimeSatus()
    }
    // fn()
    // this.timer = setInterval(fn, 1000 * 60, true)
  },
  methods: {
    // 更新状态
    setTimeSatus() {
       
    },
    // 大厦信息，楼层
    async getFloorList () {
      const result = await getMansionFloorApi()
        let data = result.data.mansion
        if(data.length > 1){
          data.unshift({id: '', name: '全部'})
        }
        this.optionsFloor = data
    },
     // 选择日期
    getRoomList() {
      roomListApi({}).then(res=> {
        this.roomList = res.data.rooms
      })
    },
    // 获取列表数据
    getApproveInfo () {
      let params = { 
        page: this.paginationQuery.page,	// 当前页
        size: this.paginationQuery.limit,// 每页显示条数
        status: this.searchForm.status, // 状态
        start_date: this.chooseDate ? this.chooseDate[0] : '',// 开始时间
        end_date: this.chooseDate ? this.chooseDate[1] : '',// 结束时间
        mansion: this.searchForm.floor[0],// 大厦id
        floor: this.searchForm.floor[1],// 楼层id
        meeting_room_id: this.searchForm.meeting_room_id,// 会议室id
      }
      this.dataLoading = true
      serviceListApi(params).then(res=>{
        let meetings = res.data.services
        if(res.meta.code=='RESP_OKAY'){
           meetings&&meetings.map( v => {
            v.satrtTime = `${v.date} ${v.start}`
            v.endTime = `${v.end_date} ${v.end}`
            v.conflict_dec = v.conflict_number > 1 ? this.$t('tip.conflictDec') : ''
            v.categoryStr= v.category == 2 ? `${this.categoryList[v.category]}（${this.repetitionType[v.repetition_type]}）` : this.categoryList[v.category]
            // v.participant_users.map( item => {
            //   v.personnel = v.personnel ?  v.personnel + ',' + item.nickname : item.nickname
            // })
          })
          this.myMeetingInfo = meetings
          this.total = res.data.total// 总条数 
        }
        this.dataLoading = false
      })
    },
    // 重置
    resetMeetingInfo() {
      this.paginationQuery = { 
        page: 1, // 当前页
        limit: 10, // 每页显示条目个数
      }
      this.searchForm= {
        status: '',	// 状态
        floor: [], // 会议名称
        meeting_room_id: '' // 会议室名称
      }
      this.chooseDate= null, // 日期
      this.getApproveInfo()
    },
    // 详情
    detailsMeet(row) {
      // 判断是否冲突row.conflict_number>1冲突
      this.$router.push({
        path: '/details',
        query: {
          menu: 'services',
          id: row.meeting_id
        }
      })
    },
    // 同意/拒绝会议
    serviceHandle (data, type) {
      // type 1同意 2拒绝 
      this.$refs.cancel.dialogVisible= true
      this.selectCurrentRowData = data
      this.operationType = type
      this.cancelTitle = this.$t('route.service')
      let content = ''
      if(type == 1){
        content= `${this.$t('tip.confirmService')}<br/>${this.$t('tip.continue')}`
      }else{
        content = this.$t('tip.completed')
      }
      this.cancelContent = content
    },
    // 同意/拒绝会议请求
    hanldDeleteMeeting(value) {
        let data = this.selectCurrentRowData
        let ajaxName = this.operationType && this.operationType == 1 ? serviceConfirmApi : serviceFinishApi
        this.deleteBtnLoading = true // 确认按钮loading
        ajaxName({id: data.id}).then(res=>{
          this.deleteBtnLoading = false // 确认按钮loading
          if(res.meta.code=='RESP_OKAY'){
            this.$message({
              message: this.$t('tip.successful'),
              type: 'success'
            })
            this.getApproveInfo()
            this.$refs.cancel.dialogVisible = false // 弹框
          }
        })
    },
    // 弹窗关闭回调
    handleClose() {
      this.cancelTitle = ''
      this.cancelContent = ''
      this.isShowInput = false
    }
  },
  created () { },
  beforeCreate () { },
  beforeMount () { },
  beforeUpdate () { },
  updated () { },
  beforeDestroy () { }
}
 </script>
<style lang='less' scoped>

.invitation-wrap {
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

  .current-table{
    overflow-y: hidden;
    overflow-x: hidden;
    .meeting-time{
       display: block;
    }
    .part_num{
      display: inline-block;
      width: 50px;
      height: 24px;
      line-height: 24px;
      border-radius: 20px;
      cursor: pointer;
      background-color: #F5F8FF;
    }
    /deep/.el-tooltip__popper.is-light{
      width: 220px;
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
  /deep/.el-dialog__header{
    padding: 0;
  }
  /dedp/.el-dialog__headerbtn{
    top: 25px;
  }
  /deep/.el-dialog__header{
    border: none !important;
  }
  /deep/.el-dialog__body{
    padding: 25px 10px 12px 33px;
    .cancel-tips{
      font-size: 16px;
      color: #43434D;
      .ancel-title-icon{
        display: inline-block;
        width: 24px;
        height: 18px;
        // background: url('../../../../assets/icon/warning.png') no-repeat;
        background-size: 100% 100%;
      }
      .cancel-title{
        color: #43434D;
        font-size: 16px;
        display: flex;
        align-items: center;
        .ancel-title-text {
            margin-left: 11px;
        }
      }
      .cancel-content {
        padding-left: 36px;
        margin-top: 12px;
        line-height: 30px;
      }
    }
  }
  /deep/.el-dialog__footer{
     .el-button--medium {
      padding: 12px 23px !important;
    }

    .el-button+.el-button {
      margin-left: 20px;
    }
    .el-button--primary {
      background-color: #FF5B5B;
      border-color: #FF5B5B;
    }

    .el-button--primary:focus, .el-button--primary:hover {
      background: #cc2121;
      border-color: #cc2121;
      color: #FFF;
    }
  }
}
.color_tips{
  color: red;
}
</style>
<style lang="less">
.tooltip-per{
  max-width: 340px;
  div:first-child{
    font-size: 12px;
    max-height: 80px;
    overflow-y: auto;
    line-height: 20px;
  }
}
</style>