/*
 * Created: 2021-03-24 09:40:27
 * Author : Jan
 * Last Modified: 2021-03-24 10:38:51
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */
/**
  预约会议页面
 */

<template>
  <div class="app-wrap res-wrap">
    <!-- 搜索 -->
    <div class="filter">
      <div class="filter-item">
        <!-- 楼层 -->
        <div class="filter-item-box">
          {{$t('labe.floor')}}：
          <el-cascader 
          class="filter-cascader" 
          v-model="searchData.floor" 
          :options="optionsFloor"
          :props="props" 
          :placeholder="$t('placeholder.MeetingFloor')"
          :show-all-levels="true"
          @change="searchMeetingRoom"
          @clear="searchMeetingRoom"
          clearable
          ></el-cascader>
        </div>
        <!-- 容纳人数 -->
        <div class="filter-item-box">
           {{$t('labe.numberPeople')}}：
          <el-select
            v-model="searchData.peopleNum"
            :placeholder="$t('placeholder.capacity')"
            @change="searchMeetingRoom"
            @clear="searchMeetingRoom"
            clearable
          >
            <el-option
              v-for="item in peopleNumList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </div>
        <!-- 设备 -->
        <div class="filter-item-box">
          {{$t('labe.equipment')}}：
          <el-select
            v-model="searchData.equipment"
            :placeholder="$t('placeholder.equipment')"
            @change="searchMeetingRoom"
            @clear="searchMeetingRoom"
            multiple
            clearable
          >
            <el-option
              v-for="item in equipmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <!-- 选择时间 -->
        <div class="filter-item-box">
           {{$t('labe.date')}}：
          <el-date-picker
            v-model="searchData.date"
            type="date"
            :placeholder="$t('placeholder.date')"
            value-format="yyyy-MM-dd"
            :editable="false"
            :picker-options="pickerOptions"
            @change="dateChange"
            clearable
            >></el-date-picker>
        </div>

        <!-- 按钮 -->
        <div class="filter-item-box">
          <!-- 查询 -->
          <el-button
            type="primary"
            class="search"
            @click="searchMeetingRoom"
            :loading="searchBtnStatus"
            >{{$t('button.search')}}</el-button
          >
        </div>
        <div class="filter-item-box">
          <!-- 重置 -->
          <el-button
            type="info"
            class="search"
            @click="resetMeetingRoom"
            :loading="resetBtnStatus"
            >{{$t('button.reset')}}</el-button
          >
        </div>
      </div>
        <!-- 预约 -->
        <div class="filter-item">
        <!-- 添加预约 -->
        <div class="filter-item-box">
            <el-dropdown size="medium" 
            split-button type="primary" 
            @click="handleClick(1)"
            v-loading="addLoading"
            element-loading-spinner="el-icon-loading"
            class="add-dropdown"
            disabled='true'
            >
              {{$t('button.reservationSingle')}}
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleClick(2)">{{$t('button.reservationRepeat')}}</el-dropdown-item>
                <el-dropdown-item @click.native="handleClick(3)">{{$t('button.reservationNext')}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
        </div>
        </div> 
      <!-- /预约 -->
      </div>
    <!-- /搜索 -->

    <!-- 表格 -->
    <div class="res-table">
      <div class="res-table-centent">
        <el-table
        ref="table"
        v-loading="tableLoading"
        :data="meetingRoomsFillter"
        style="width: 100%;"
        @cell-click="clickTableCell"
        :height="tableHeight-150"
        border
      >
        <el-table-column
          prop="name,floor_num"
          :label="$t('message.roomInfo')"
          width="240"
          align="center"
        >
          <template slot-scope="scope" >
            <!-- 楼层 -->
            <div class="floor-number">
              <span class="floor-number-dec">{{ scope.row.num }}F</span>
              <i class="floor-number-icon"></i>
            </div>
            <div class="floor-content">
              <div>
                <!-- 会议室名字 -->
                <div class="floor-name">{{ scope.row.name }}</div>
                <!-- 支持的会议类型 -->
                <div class="floor-device">
                    <span 
                      v-for="(item, index) in scope.row.equipment" 
                      :key="index" 
                      class="floor-device-list">
                      {{item.name}}
                    </span>
                </div>
                <!-- 会议室图片 -->
                <div class="floor-info">
                  <div class="floor-info-img" @click="roomInfo(scope.row)">
                    <i class="el-icon-circle-plus-outline plus" ></i>
                    <img ref="floorImg" class="floor-info-image" :src="Host + scope.row.image" alt="">
                  </div>
                  <div class="floor-info-box">
                    <div class="floor-info-approve">{{approveLevel[scope.row.approve_level]}}</div>
                    <div class="floor-info-address">
                      <i class="el-icon-caret-bottom address-icon"></i>
                      <span class="address-text overhidden">{{scope.row.mansion.name}}</span>
                    </div>
                  </div>
                  <div class="floor-number-people overhid">
                    <i class="floor-people-icon"></i>
                    <span class="floor-people-dec">{{scope.row.reservable}}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="message"
          header-align="center"
        >
          <template slot="header" >
            <div class="res-bottomt">
              <span class="res-bottomt-box">
                <i class="res-bottomt-label available"></i>
                {{$t('message.Bookable')}}
              </span>
              <span class="res-bottomt-box">
                <i class="res-bottomt-label expired"></i>
                {{$t('message.Expired')}}
              </span>
              <span class="res-bottomt-box">
                <i class="res-bottomt-label reserved"></i>
                {{$t('message.Reserved')}}
              </span>
              <span class="res-bottomt-box">
                <i class="res-bottomt-label selected"></i>
                {{$t('message.Selected')}}
              </span>
            </div>
          </template>
          <template slot-scope="scope">
            <time-table-cell
              :recordSelectTime="recordSelectTime"
              :scope="scope"
            />
          </template>
        </el-table-column>
      </el-table>
      </div>
      <div class="res-select-time" v-if="selectRowTime.time.startTime">选中：{{searchData.date}}&nbsp;{{selectRowTime.time.startTime}}&nbsp;至&nbsp;{{selectRowTime.time.endTime}}</div>
    </div>
    <!-- /表格 -->
    
    <!-- 会议详情 -->
    <el-dialog
      :title="$t('message.roomInfo')"
      :visible.sync="dialogVisible"
      width="700px"
      @closed="handleClose">
      <div class="room-content">
        
        <div class="room-content-l">
          <div class="room-list">
            <span class="room-list-labe">{{$t('labe.roomName')}}：</span>
            <span class="room-list-value">{{roomforms.name}}</span>
          </div>
          <div class="room-list">
            <span class="room-list-labe">{{$t('labe.numberPeople')}}：</span>
            <span class="room-list-value">{{roomforms.reservable}}</span>
            
          </div>
          <div class="room-list">
            <span class="room-list-labe">{{$t('labe.approvalCriteria')}}：</span>
            <span class="room-list-value">{{approveLevel[roomforms.approve_level]}}</span>
          </div>
          <div class="room-list">
            <span class="room-list-labe">{{$t('labe.equipmentOfroom')}}：</span>
            <span class="room-list-value">
              <i 
                v-for="(item, index) in roomforms.equipment" 
                :key="index" 
                class="floor-device-list">
                {{item.name}}
              </i>
            </span>
          </div>
        </div>
        
        <div class="room-content-r" :style="{backgroundImage: 'url('+ roomforms.image +')'}"></div>
      </div>
    </el-dialog>

    <!-- 重复预约，跨日预约 -->
    <el-dialog
      :title="appointmentTitle"
      :visible.sync="repeatNexdayDialog"
      width="520px"
      @closed="handleCloseAppointment">
      <div class="appointment-box">
        <div class="appointment-repeat" v-if="reservationType == 2" >
          <div class="appointment-box-item">
            <span><i class="appo-labe-Symbol">*</i>{{$t('labe.repeatType')}}：</span>
            <el-select 
              v-model="repeatForm.repeatType" 
              class="edit-box-input" 
              @change="setStatus(repeatForm.repeatType,'repeatType')"  
              clearable
            >
              <el-option
                v-for="item in repeatTypeList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="appointment-err" v-if="error.repeatType.isFocus">{{$t('placeholder.selectType')}}</span>
          </div>
          <div class="appointment-box-item">
            <span><i class="appo-labe-Symbol">*</i>{{$t('labe.repeatTime')}}：</span>
            <el-date-picker
              v-model="repeatForm.repeatDate"
              type="date"
              class="edit-box-input"
              value-format="yyyy-MM-dd"
              :picker-options="repetPickerOptions"
              @change="setStatus(repeatForm.repeatDate, 'repeatDate')"
              clearable
            >></el-date-picker>
            <span class="appointment-err" v-if="error.repeatDate.isFocus">{{$t('tip.validateRepeatTime')}}</span>
          </div>
        </div>
        <!-- 跨日时间设置 -->
        <div class="appointment-next" v-if="reservationType == 3">
           <div class="appointment-box-item">
            <span class="appointment-next-labe"><i class="appo-labe-Symbol">*</i>{{$t('message.startTime')}}：</span>
              <el-date-picker
                v-model="nextDateForm.nextStartDate"
                type="date"
                class="edit-nex-input"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                @change="selectNextStartDate(nextDateForm.nextStartDate, 'nextStartDate')"
                >></el-date-picker>
              <el-time-select
                class="edit-nex-select"
                :placeholder="$t('message.startTime')"
                v-model="nextDateForm.nextStartTime"
                :picker-options="startTimesOptions"
                @change="selectNextTimes(nextDateForm.nextStartTime, 'nextStartTime')"
                >
              </el-time-select>
              <span class="appointment-err start-date" v-if="error.nextStartDate.isFocus">{{$t('message.selsectDate')}}</span>
              <span class="appointment-err start-time" v-if="error.nextStartTime.isFocus">{{$t('message.selectStartTime')}}</span>
          </div>
          <div class="appointment-box-item">
            <span class="appointment-next-labe"><i class="appo-labe-Symbol">*</i>{{$t('message.endTime')}}：</span>
            <el-date-picker
              v-model="nextDateForm.nextEndDate"
              type="date"
              class="edit-nex-input"
              value-format="yyyy-MM-dd"
              :picker-options="repetPickerOptions"
              @change="selectNextEndDate(nextDateForm.nextEndDate, 'nextEndDate')"
              clearable
              >></el-date-picker>
              <el-time-select
                class="edit-nex-select"
                :placeholder="$t('message.endTime')"
                v-model="nextDateForm.nextEndTime"
                :picker-options="endTimesOptions"
                @change="selectNextEndTime(nextDateForm.nextEndTime, 'nextEndTime')"
                clearable
                >
              </el-time-select>
              <span class="appointment-err end-date" v-if="error.nextEndDate.isFocus">{{$t('message.selsectDate')}}</span>
              <span class="appointment-err end-time" v-if="error.nextEndTime.isFocus">{{$t('message.selectEndTime')}}</span>
          </div>
        </div>
      </div>
      <div class="dialog-bottom">
         <el-button @click="repeatNexdayDialog = false">{{$t('button.cancel')}}</el-button>
         <el-button type="primary" @click="confirmReservation">{{$t('button.confirm')}}</el-button>
      </div>
    </el-dialog>



    <!-- 冲突预约提示 -->
    <dialog-cancel ref="conflict" :content="approveContent" :title="approveTitle" :btnLoading="approveBtnLoading" @handleClose="handleApproveClose" @hanldConfirm="hanldApproveMeeting"></dialog-cancel>
  </div>
</template>
<script>
 import dialogCancel from './components/dialogCancel'
import dayjs from 'dayjs'
import TimeTableCell from './components/time-table-cell'
import qs from 'querystring'
import { mapGetters } from 'vuex'
import { 
  getStatusApi,
  getAppointmentApi,
  getEquipmentApi,
  getMansionFloorApi,
  getReservableApi,
  appointmentApi,
  conflictValidatorApi
} from '@api/appoint'
export default {
  components: {
    TimeTableCell, 
    dialogCancel
  },
  data () {
    return {
      dialogVisible: false, // 会议室信息弹窗
      repeatNexdayDialog: false, // 重复,跨日预约弹窗
      approveDialog: false, // 冲突预约提示
      approveTitle: '', // 冲突预约标题
      approveContent: '',// 冲突提示内容
      approveBtnLoading: false, // 冲突预按钮loading
      appointmentTitle: '', // 预约冲突弹窗,
      cancelContent: '',// 预约冲突弹窗内容
      reservationType: '', // 预约类型
      repeatForm: { // 重复预约
        repeatType: '', // 重复类型
        repeatDate: ''// 重复截止日
      },
      nextDateForm: {  // 跨日预约
        nextStartDate: '',
        nextEndDate: '',
        nextStartTime: '', // 开始时间
        nextEndTime: ''// 结束时间
      },
      // 重复，跨日预约日期控制
      repetPickerOptions: {
        disabledDate: this.disabledDateRepet
      },
      startTimesOptions: { // 会议时间 开始时间配置
        start: '08:00',
        step: '00:30',
        end: '19:30:00',
        minTime: '',
        maxTime: ''
      },
      endTimesOptions: { // 会议时间 结束时间配置
        start: '08:30',
        step: '00:30',
        end: '20:00:00',
        minTime: ''
      },
      // 重复预约类型
      repeatTypeList: [
        {name: '每日', value: 1},
        {name: '每周', value: 2},
        {name: '每月', value: 3},
      ],
      roomforms: '', // 会议室信息
      Host: process.env.NODE_ENV === 'development' ? 'https://alc01.aa-iot.com' : getHost(),
      tableLoading: false,
      btnLoading: false,
      searchData: {
        floor: [],// 楼层
        peopleNum: '',// 人数
        equipment: '',// 设备
        date: dayjs().format('YYYY-MM-DD'), // 选择时间
      },
      optionsFloor: [], // 大厦楼层
      peopleNumList: [], // 容纳人数
      // tableHeight: 50,
      citys: [], // 已选择城市
      chooseCity: '',
      building: [], // 获取的大厦数组
      chooseBuilding: '',
      category: [], // 获取的分类数组
      chooseCategory: '', // 选择容纳人数
      status: [], // 获取状态数组
      equipmentList: [], // 设备
      chooseStatus: '', // 选择状态
      chooseDate: dayjs().format('YYYY-MM-DD'), // 选择时间
      meetingRooms: [], // 获取的会议室信息,
      props: { // 楼层级联配置
        value: 'id',
        label: 'name',
        children: 'floor'
      }, 
      approveLevel: ['无需审批', '一级审批 ', '二级审批'],
      currentPage4: 4,
      selectTimes: [],
      selectRowTime: {
        id: null,
        time: {}
      },
      selectRoomData: {}, // 选择会议室进行预约,
      searchBtnStatus: false, // 搜索按钮状态
      resetBtnStatus: false,// 重置按钮状态
      pollingParams: {
        schedule_info: '1',
        city_guid: '',
        mansion_guid: '',
        number_groups: '',
        status_groups: '',
        day: '',
        meeting_room_schedule: '',
        functional_display: '',
        virtual_: 'all'
      },
      pickerOptions: {
        // 控制日期选择
        disabledDate (time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      error: { // 验证提示
        repeatType: {isFocus: false},// 重复类型
        repeatDate: { isFocus: false },// 重复截止日
        nextStartDate: { isFocus: false },// 跨日开始日期
        nextStartTime: { isFocus: false }, // 跨日开始时间
        nextEndDate: { isFocus: false },// 跨日结束日期
        nextEndTime: { isFocus: false },// 跨日结束时间
      },
      isPass: false,
      addLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
    meetingRoomsFillter () {
      let meetingArr = [] // 二维数组-记录每个会议室预定的会议
      let continuity = true // 会议的边界
      let count = 0 // 记录一个会议室的场次

      // this.meetingRooms = testData.data.meeting_rooms
      this.meetingRooms.map((res, idx) => {
        res.day = this.searchData.date
        // 筛选出每个预约会议
        res.message.map((value, index) => {
          if( value.status === 1 ){
            let chils = []
            chils.push(idx)
            chils.push(value.meeting[0]['id'])
            chils.push(index)
            if(meetingArr[count] && meetingArr[count][1] === value.meeting[0]['id']){
              meetingArr[count].push(index)
            } else  {
              if (meetingArr.length > 0) {
                count++
              }
              meetingArr[count] = chils
            }
            // 会议时长单位
            value.long = `${value.long}h`
          }
        })

        meetingArr.map((val) => {
          if (val.length > 4) {
            val.splice(3, val.length - 3, val[val.length - 1])
          }
        })
      })
      /**
       * 后台给出的数据没有场次边界
       *
       */
      // 给每场会议标注开始和结束位置
      this.meetingRooms.map((v, i) => {
        meetingArr.map(m => {
          if (i === m[0]) {
            v.message[m[2]].start = true
            if (m.length === 4) {
              v.message[m[3]].end = true
            } else {
              // v.message[m[1]].end = true
              v.message[m[2]].widthMin = true
            }
          }
        })
      })
      return this.meetingRooms
    },
    
  },
  watch: {
  },
  mounted () {
    // 大厦楼层
    this.getFloorList()
    // 获取容纳人数
    this.getReservableList()
    // 获取设备列表
    this.getEquipmentList()
    const that = this
    const fn = function () {
      that.pollingSearchRoom()
    }
    fn()
    this.timer = setInterval(fn, 1000 * 60, true)
    this.resizeHeight(100)
  },
  methods: {
    // 冲突弹窗关闭
    handleApproveClose() {
      this.cancelTitle = ''
      this.cancelContent = ''
    },
    
    // 跨日开始日期
    selectNextStartDate(dates, names) {
      this.setStatus(dates, names)
    },
    // 跨日开始时间
    selectNextTimes(dates, names){
      this.setStatus(dates, names)
    },
    // 跨日结束日期
    selectNextEndDate(dates, names) {
      this.setStatus(dates, names) 
    },
    // 跨日结束时间
    selectNextEndTime(times, names) {
      this.setStatus(times, names) 
    },
    // 选择重复预约截止日期
    selectRepeatEndTime(value) {
      this.setStatus(this.repeatForm.repeatType, strType) 
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
    // 获取设备
    async getEquipmentList() {
       const result = await getEquipmentApi()
       this.equipmentList= result.data.equipments
    },
    // 点击表格
    clickTableCell (row, column, cell, event) {
    },
    // 记录选择的时间
    recordSelectTime (obj, scope) {
      if (this.selectRowTime.id !== '' && (this.selectRowTime.id !== scope.row.id)) {
        this.selectRowTime.time.startIndex = null
        this.selectRowTime.time.endIndex = null
        // TODO 清空其他行时间
      }
      this.selectRowTime.time = obj
      this.selectRowTime.id = scope.row.id
      this.selectRoomData = scope.row
    },
    // 预约
    handleClick(num) {
      this.reservationType = num
      if(num === 1){
        this.conflictValidator()
      } else if(num === 2){
        this.repeatNexdayDialog = true
        this.appointmentTitle = '重复预约时间设置'
      } else {
        this.repeatNexdayDialog = true
        this.appointmentTitle = '跨日预约时间设置'
        this.nextDateForm.nextStartDate = this.selectRoomData.day || ''
        this.nextDateForm.nextStartTime = this.selectRowTime.time.startTime || ''
        this.nextDateForm.nextEndDate = this.selectRoomData.day || ''
        this.nextDateForm.nextEndTime = this.selectRowTime.time.endTime || ''
      }
    },
    // 重复，跨日时间设置弹框确认预约
    confirmReservation() {
      let num = this.reservationType
      this.isPass = true
      if(num == 2){
        this.setStatus(this.repeatForm.repeatType, 'repeatType')
        this.setStatus(this.repeatForm.repeatDate, 'repeatDate')
      }else if(num == 3) {
        this.setStatus(this.nextDateForm.nextStartDate, 'nextStartDate')
        this.setStatus(this.nextDateForm.nextStartTime, 'nextStartTime')
        this.setStatus(this.nextDateForm.nextEndDate, 'nextEndDate')
        this.setStatus(this.nextDateForm.nextEndTime, 'nextEndTime')
      }
      if(!this.isPass){
        return
      }
      this.conflictValidator()
    },
    
    // 输入框校验
    setStatus (value, name, index) {
      if (!value) {
        this.isPass = false
        this.error[name].isFocus = true
      } else {
        this.error[name].isFocus = false
      }
      this.error = { ...this.error }
    },
    // 预约冲突判断
    async conflictValidator(){
      
      if(!this.selectRoomData.day || !this.selectRowTime.time.startTime){
        this.$message({
          message: '请选择会议室',
          type: 'warning'
        });
        return
      }
      let repeType = ''
      let endDate = ''
      this.approveCount = 0
      let startTime = `${this.selectRoomData.day} ${this.selectRowTime.time.startTime}:00`
      let endTime = `${this.selectRoomData.day} ${this.selectRowTime.time.endTime}:00`
      this.approveTitle = this.$t('message.conflictTips')// 冲突弹窗title
      if(this.reservationType === 2){// 重复预约
        repeType = this.repeatForm.repeatType
        endDate = this.repeatForm.repeatDate
      }
      
      if(this.reservationType === 3) {// 跨日预约
        startTime = `${this.nextDateForm.nextStartDate} ${this.nextDateForm.nextDateForm}:00`
        endTime = `${this.nextDateForm.nextEndDate} ${this.nextDateForm.nextEndTime}:00`
      }
      let dataJson = {
        start: startTime,	// date	预约最近一场开始时间
        end: endTime,	// date	预约最近一场结束时间
        meeting_room_id: this.selectRoomData.id,	// number	会议室
        category: this.reservationType,	// number	预约类型 1单次预约 2重复预约 3跨日预约
        repetition_type: repeType || null,	// number	重复类型 1=》每日，2=》每周，3=》每月
        repetition_end_date: endDate || null,	// date	重复会议截止日期
      }

      if(this.selectRoomData.approve_level != 0) {// 会议需要审批时调用判断冲突接口
        this.addLoading = true
        const result = await conflictValidatorApi(dataJson)
        this.addLoading = false
        this.approveCount = result.data.count// 冲突场次
        this.approveMessage = '您的会议已预约完成，正在等待审批'
        if(result.data.count){
          this.$refs.conflict.dialogVisible = true
          this.approveContent = `${this.selectRoomData.name}会议室，此时间段已有${result.data.count}场申请，未审批，请确定是否继续预约`
        }else{
          this.addReservation()
        }
      } else {
        this.approveMessage = '成功预定！'
        this.addReservation()
        // this.approveContent = `${this.selectRoomData.name}会议室，此时间段已有${result.data.count}场会议，请重新选择`
      }
    },
    // 冲突弹窗确认按钮
    hanldApproveMeeting() {
      this.addReservation()
    },
    // 添加预约
    addReservation () {
      let repeType = ''
      let endDate = ''
      let startTime = `${this.selectRoomData.day} ${this.selectRowTime.time.startTime}:00`
      let endTime = `${this.selectRoomData.day} ${this.selectRowTime.time.endTime}:00`
      if(this.reservationType === 2){
        repeType = this.repeatForm.repeatType
        endDate = this.repeatForm.repeatDate
      }
      if(this.reservationType === 3) {
        startTime = `${this.nextDateForm.nextStartDate} ${this.nextDateForm.nextStartTime}:00`
        endTime = `${this.nextDateForm.nextEndDate} ${this.nextDateForm.nextEndTime}:00`
      }
      const data = {
        meeting_room_id: this.selectRoomData.id,	//是	number	会议室id
        category: this.reservationType,	//是	number	1 单次预约 2重复预约 3跨日预约
        start: startTime,	//是	string	会议预约开始时间
        end: endTime,	//是	string	会议预约结束时间（category=2时结束时间只传当天截止））
        is_conflict: this.approveCount ? 1 : 0,	//是	number	是否冲突 0否 1是
      }
      if( repeType && endDate ){
        data.repetition_type = repeType // 当category=2时才需要传 会议重复类型 1=》每日，2=》每周，3=》每月
        data.repetition_end_date = endDate // 当category=2时才需要传 会议重复截止时间
      }
      this.addLoading = true
      // 确定预约
      appointmentApi(data).then(res=>{
        this.addLoading = false
        this.approveBtnLoading = false
        if(res.meta.code=='RESP_OKAY'){
          this.$message({
            message: this.approveMessage,
            type: 'success'
          });
          // 更新会议列表
          this.searchMeetingRoom()
          this.resetData()
        }
      }).catch(() => {
      })
    },
    // 重置已选择时间数据
    resetData() {
      this.selectRowTime.time.startIndex = null
      this.selectRowTime.time.endIndex = null
      this.selectRowTime={
        id: null,
        time: {}
      }
      this.selectRoomData = {}
      this.repeatNexdayDialog = false // 重复跨日弹窗
      this.$refs.conflict.dialogVisible = false //  冲突弹窗
      this.handleCloseAppointment()
    },
    // 获取容纳人数数据
    async getReservableList () {
      const result = await getReservableApi()
      this.peopleNumList = [{ name: this.$t('message.all'), guid: null }, ...result.data.reservable]
    },
    // 获取状态数据
    async getStatusData () {
      const result = await getStatusApi()
      if (result.ret === '0') {
        const i18nStatus = result.data.map(element => {
          if (element.guid === 0) {
            // 空闲中
            return {
              guid: element.guid,
              name: this.$t('message.inAvailable')
            }
          } else if (element.guid === 1) {
            // 准备中
            return {
              guid: element.guid,
              name: this.$t('message.inPreparing')
            }
          } else if (element.guid === 2) {
            // 使用中
            return {
              guid: element.guid,
              name: this.$t('message.inUse')
            }
          } else if (element.guid === 3) {
            // 维护中
            return {
              guid: element.guid,
              name: this.$t('message.inMaintenance')
            }
          }
        })
        this.status = [{ name: this.$t('message.all'), guid: null }, ...i18nStatus]
      }
    },
    // 搜索会议室
    async searchMeetingRoom (type) {
      let params= {
        date: this.searchData.date, // 日期
        mansion_id: this.searchData.floor[0], // 大厦id
        floor_id: this.searchData.floor[1], //楼层id
        reservable: this.searchData.peopleNum, // 人数
        equipment: this.searchData.equipment, // 设备id
      }
      this.tableLoading = true
      this.searchBtnStatus = true
      const result = await getAppointmentApi(params)
      this.meetingRooms = result.data.meeting_rooms
      // this.meetingRooms.map(res=>{
      //   res.equipment = ['电子屏','投影仪','投影仪']
      // })
      // 清除选择的时间印记
      this.selectRowTime.time.startIndex = null
      this.selectRowTime.time.endIndex = null
      this.tableLoading = false
      this.searchBtnStatus = false
    },
    
    // 轮询会议室
    async pollingSearchRoom (type) {
      let params= {
        date: this.searchData.date, // 日期
        mansion_id: this.searchData.floor[0], // 大厦id
        floor_id: this.searchData.floor[1], //楼层id
        reservable: this.searchData.peopleNum, // 人数
        equipment: this.searchData.equipment, // 设备id
      }
      this.tableLoading = true
      const result = await getAppointmentApi(params)
        this.meetingRooms = result.data.meeting_rooms
      //   this.meetingRooms.map(res=>{
      //   res.equipment = ['电子屏','投影仪','投影仪']
      // })
      // 如果是预约成功后的刷新
      if (type === 'reserveSuccess') {
        // 清除选择的时间印记
        this.selectRowTime.time.startIndex = null
        this.selectRowTime.time.endIndex = null
      }
      this.tableLoading = false
    },
    // 重置搜索关键字
    resetMeetingRoom() {
       this.searchData= {
        floor: [],// 楼层
        peopleNum: '',// 人数
        equipment: '',// 设备
        date: dayjs().format('YYYY-MM-DD'), // 选择时间
      }
      this.searchMeetingRoom()
    },
    // 选择日期
    dateChange (value) {
      let that = this
      setTimeout(() => {
        that.searchData.date = value || dayjs().format('YYYY-MM-DD')
        that.searchMeetingRoom()
      }, 100);
    },
    // 分钟小时转换
    handleNum(num) {
      let str = Number(num) / 60 > 1 ? `${Number(num) / 60}h`:`${num}分钟`
      return str
    },
    // 会议室详情
    roomInfo(row) {
      this.dialogVisible = true
      this.roomforms = JSON.parse(JSON.stringify(row))
      this.roomforms.image = this.Host + this.roomforms.image
    },
    handleClose() {
    },
    handleCloseAppointment() {
      this.repeatForm = { // 重复预约
        repeatType: '', // 重复类型
        repeatDate: ''// 重复截止日
      }
      this.nextDateForm = {  // 跨日预约
        nextStartDate: '',
        nextEndDate: '',
        nextStartTime: '', // 开始时间
        nextEndTime: ''// 结束时间
      }
      this.error = { // 验证提示
        repeatType: {isFocus: false},// 重复类型
        repeatDate: { isFocus: false },// 重复截止日
        nextStartDate: { isFocus: false },// 跨日开始日期
        nextStartTime: { isFocus: false }, // 跨日开始时间
        nextEndDate: { isFocus: false },// 跨日结束日期
        nextEndTime: { isFocus: false },// 跨日结束时间
      }
    },
    // 最长重复时间段为180天 ，禁用开始日期之前的日期
    disabledDateRepet(time) {
      let startDate = dayjs(this.selectRoomData.day).valueOf()//dayjs(this.ruleForm.start_time.split(' ')[0]).valueOf() // 180天
      return time.getTime() > startDate + 24 * 60 * 60 * 1000 * 180 || time.getTime() < startDate 
    }
  },
  // 销毁定时器
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="less" scoped>
@import '../../../styles/variables.less';
.filter {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 20px 0 0;
    .filter-item{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      /deep/.filter-cascader{
        width: 220px;
        .el-input{
          width: 220px;
          .el-input__inner{
              width: 220px;
          }
        }
      }
    }
    .filter-item-box{
      display: flex;
      margin: 0 20px 20px 0;
      align-items: center;
      font-size: 14px;
      /deep/.el-input__inner{
         width: 180px;
      }
      /deep/.el-button{
        width: auto;
        font-size: 14px;
      }
      .item-right-btn{
        width: auto;
      }
      /deep/.el-input, .el-input__inner{
        width: 180px;
      }
    }
  }
  .res-table{
    overflow-y: hidden;
    overflow-x: hidden;
    margin-bottom: 40px;
    .res-table-centent{
      overflow-x: auto;
      /deep/.el-table{
        min-width: 800px;
      }
      /deep/.el-table--medium th{
        padding: 0;
      }
    }
    /deep/.el-table--medium td{
      padding: 0;
    }
    /deep/.el-table .cell{
      padding: 0;
      font-weight: normal;
    }
    .res-select-time{
      color: #5473E8;
      font-size: 14px;
      text-align: center;
      margin: 30px 0 0;
    }
  }
  // .floor-name {
  //   margin: 18px 0 4px;
  // }
  .floor-number{
      position: absolute;
      top: 0;
      right: 0;
      width: 38px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      font-size: 14px;
      color: #333;
      .floor-number-dec{
        position: absolute;
        top: 2px;
        right: 3px;
        z-index: 100;
        color: #fff;
        transform: rotate(45deg);
        font-size: 12px;
      }
      .floor-number-icon {
        content: '';
        position: absolute;
        top: -4px;
        right: -17px;
        width: 0;
        height: 0;
        border-left: 26px solid transparent;
        border-right: 26px solid transparent;
        border-bottom: 26px solid #5c7bea;
        border-top: transparent;
        transform: rotate(45deg);
      }
  }

  .floor-number-people{
    position: absolute;
    top: 6px;
    right: 10px;
    max-width: 80px;
    font-size: 12px;
    overflow: hidden;
    height: 22px;
    .floor-people-icon{
      display: inline-block;
      width: 10px;
      height: 10px;
      background: url('../../../assets/icon/number.png') no-repeat;
      background-size: contain;
      margin-right: 4px;
    }
  }
  
  .floor-content{
    min-height: 72px;
    .floor-name{
      font-size: 16px;
      color: #43434D;
      font-weight: bold;
      text-align: left;
      padding: 14px 10px 4px;
    }
    img.floor-image-item {
      display: block;
      width: 40px;
      height: 40px;
      background: #ececec;
      margin: 0 auto;
    }
  }
  .floor-device{
    width: auto;
    text-align: left;
    padding: 10px 10px 14px;
    .floor-device-list{
      width: auto;
      height: 20px;
      line-height: 20px;
      display: inline-block;
      padding: 0 10px;
      margin:0 10px 6px 0;
      border-radius: 16px;
      color: #9AABBE;
      font-size: 12px;
      background-color: #FBFCFF;
      border: 1px #E2E4EA solid;
    }
  }
  .floor-info{
    position: relative;
    width: 100%;
    padding: 2px 0 2px 50px;
    .floor-info-img{
      position: absolute;
      top: 50%;
      left: 0;
      width: 50px;
      height: 50px;
      transform: translateY(-50%);
      .floor-info-image{
        width: 50px;
        height: 50px;
        background: #eee;
        cursor: pointer;
      }
      .plus{
        position: absolute;
        left: 2px;
        bottom: 2px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
      }
    }
    
    .floor-info-box{
      height: 50px;
      font-size: 12px;
      text-align: left;
      padding: 3px 0 2px 10px;
      .floor-info-approve{
        display: inline-block;
        height: 20px;
        line-height: 20px;
        color: @btnActiveBg;
        padding: 0 16px;
        background: #EEF1FC;
        border-radius: 24px;
        margin-bottom: 4px;
      }
      .floor-info-address{
        display: flex;
        justify-content: left;
        align-items: center;
        .address-icon{
          color: #5473E8;
          font-size: 16px;
        }
        .address-text {
            color: #7F93A8;
            display: inline-block;
            margin-left: 4px;
        }
      }
      
    }
  }
.res-bottomt{
     text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    padding: 0 20px;
    .res-bottomt-box {
      display: flex;
      line-height: 35px;
      align-items: center;
      margin-right: 20px;
      font-size: 12px;
      color: #7F93A8;
      .res-bottomt-label {
          display: inline-block;
          width: 12px;
          height: 12px;
          margin-right: 4px;
          border: 1px #ddd solid;
      }
      .available{
        background-color: #ffffff;
      }
      .expired{
        background-color: #E7E9EE;
        border-color: #E7E9EE;
      }
      .reserved{
        background-color: #A5B7F4;
        border-color: #A5B7F4;
      }
      .selected{
        background-color: #5473E8;
        border-color: #5473E8;
      }
    }

    
}

.room-content{
      display: flex;
      justify-content: center;
      .room-content-l{
        position: relative;
        margin-right: 20px;
        padding-right: 20px;
        .room-list {
            margin-bottom: 14px;
            color: #58585D;
            font-size: 14px;
            display: flex;
            .room-list-labe {
                display: inline-block;
                flex-basis: 100px;
                width: 100px;
                text-align: right;
            }
            .room-list-value {
                width: 260px;
            }
        }
        &:after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            border-radius: 12px;
            height: 160px;
            background: #F5F8FF;
        }
      }
      .room-content-r{
        width: 230px;
        height: 230px;
        background-size: 100% 100%; 
        background-repeat: no-repeat;
      }
    }

.appointment-box{
  padding: 0;
  text-align: center;
  .appointment-repeat{
    .appointment-box-item {
      position: relative;
      margin-bottom: 30px;
      .el-select--medium {
          width: 340px;
      }
      .el-date-editor.el-input {
          width: 340px;
      }
      .appointment-err{
        position: absolute;
        color: #FF5050;
        top: 39px;
        right: 15px;
        transition: inherit;
      }
      
    }
  }
}
.appointment-next{
  .appointment-box-item{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    .appointment-next-labe{
      display: inline-block;
      width: 100px;
    }
    .edit-nex-input{
      margin-right: 10px;
    }
    .appointment-err{
        position: absolute;
        color: #FF5050;
        top: 39px;
        transition: inherit;
      }
      .start-date{
        left: 209px;
      }
      .start-time{
        right: 0;
      }
      .end-date{
        left: 209px;
      }
      .end-time{
        right: 0;
      }
  } 
}

.appo-labe-Symbol{
  display: inline-block;
  color: #FF5050;
  font-size: 20px;
  margin-right: 4px;
  vertical-align: middle;
}

.dialog-bottom {
    padding-top: 28px;
    text-align: right;
}

/deep/.add-dropdown{
  .el-loading-spinner{
    margin-top: 0;
    transform: translateY(-50%);
    font-size: 18px;
  }
}

</style>
