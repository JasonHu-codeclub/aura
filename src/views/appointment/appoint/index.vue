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
            clearable
          >
            <el-option
              v-for="item in equipmentList"
              :key="item.guid"
              :label="item.name"
              :value="item.guid"
            ></el-option>
          </el-select>
        </div>
        <!-- 选择时间 -->
        <div class="filter-item-box">
           {{$t('labe.date')}}：
          <el-date-picker
            v-model="searchData.chooseDate"
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
          <!-- 查询 -->
          <el-button
            type="default"
            class="search"
            @click="resetMeetingRoom"
            :loading="resetBtnStatus"
            >{{$t('button.reset')}}</el-button
          >
        </div>
      </div>

      <!-- 预约 -->
      <div class="filter-item">
        <div class="filter-item-box">
           <!-- 单次预约 -->
          <el-button
            type="primary"
            class="item-right-btn"
            :loading="btnLoading"
            @click="addReservation('single')"
            :disabled="
              !selectRowTime.time.endIndex &&
              selectRowTime.time.endIndex !== 0
            "
            >{{$t('button.BookMeeting')}}</el-button>
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
            <div class="floor-number">
              <span class="floor-number-dec">{{ scope.row.floor_num }}F</span>
              <i class="floor-number-icon"></i>
            </div>
            <div class="floor-number-people overhid">
              <i class="floor-people-icon"></i>
              <span class="floor-people-dec">{{scope.row.people_num}}</span>
            </div>
            <div class="floor-content">
              <div>
                <div class="floor-name">{{ scope.row.name }}</div>
                <div class="floor-device">
                    <span 
                      v-for="(item, index) in scope.row.functionals" 
                      :key="index" 
                      class="floor-device-list">
                      {{item.name}}
                    </span>
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
            {{$t('message.times')}}
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
    </div>
    <!-- /表格 -->
  </div>
</template>
<script>
import dayjs from 'dayjs'
import TimeTableCell from './components/time-table-cell'
import qs from 'querystring'
import { mapGetters } from 'vuex'
import { 
  getCategoryApi, 
  getStatusApi,
  reserveApi,
  getAppointmentApi,
  getEquipmentApi,
  getMansionFloorApi,
  getReservableApi,
  appointmentApi
} from '@api/appoint'
import { constants } from 'crypto'
export default {
  components: {
    TimeTableCell, 
  },
  data () {
    return {
      tableLoading: false,
      btnLoading: false,
      searchData: {
        floor: [],// 楼层
        peopleNum: '',// 人数
        equipment: '',// 设备
        date: dayjs().format('YYYY-MM-DD'), // 选择时间
      },
      optionsFloor: [], // 大厦楼层
      chooseFloor: [],
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
      currentData: {}
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
      this.meetingRooms.map((res, idx) => {
        res.day = this.searchData.chooseDate
        // 支持的会议类型
        // res.functionals.map(value => {
        //   switch(value.name) {
        //     case '有电视':
        //       value.className = 'local'
        //       break;
        //     case '有投影仪':
        //       value.className = 'sof'
        //       break;
        //     case '有空调':
        //       value.className = 'har'
        //       break;
        //     case '有会议屏':
        //       value.className = 'phone'
        //       break;
        //   }
        // })
        // 筛选出每个预约会议
        res.message.map((value, index) => {
          if( value.status === 1 ){
            let chils = []
            chils.push(idx)
            chils.push(value.guid)
            chils.push(index)
            if(meetingArr[count] && meetingArr[count][1] === value.guid){
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
      // console.log(meetingArr, 'meetingArr',this.meetingRooms)
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
      if (this.selectRowTime.id !== '' && (this.selectRowTime.id !== scope.row.guid)) {
        this.selectRowTime.time.startIndex = null
        this.selectRowTime.time.endIndex = null
        // TODO 清空其他行时间
      }
      this.selectRowTime.time = obj
      this.selectRowTime.id = scope.row.guid
      this.selectRoomData = scope.row
    },
    // 添加预约
    async addReservation () {
      const data = {
        title: this.userInfo.nickname + '预约的会议',
        start_time: `${this.selectRoomData.day} ${this.selectRowTime.time.startTime}:00`,
        stop_time: `${this.selectRoomData.day} ${this.selectRowTime.time.endTime}:00`,
        room_guid: this.selectRoomData.guid,

        // meeting_room_id	是	number	会议室id
        // category	是	number	1 单次预约 2重复预约 3跨日预约
        // repetition_type	否	number	当category=2时才需要传 会议重复类型 1=》每日，2=》每周，3=》每月
        // repetition_end_date	否	date	当category=2时才需要传 会议重复截止时间
        // start	是	string	会议预约开始时间
        // end	是	string	会议预约结束时间（category=2时结束时间只传当天截止））
        // is_conflict	是	number	是否冲突 0否 1是
      }
      this.btnLoading = true
      // 确定预约
      const result = await appointmentApi(qs.stringify(data))
      this.btnLoading = false
      if (result.ret === '0') {
        // 更新会议列表
        this.searchMeetingRoom()
        // 跳转到预约完善信息
        this.$router.push({
          path: '/reservation',
          query: {
            guid: result.guid,//result.guid, // 预约会议id
            outEventId: result.out_event_id // 重复会议的id
          }
        })
      }
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
        equipment: this.searchData.equipment, // 设备id
        reservable_start: '', // 容纳人数起始
        reservable_end: '', // 容纳人数结束
      }
      this.tableLoading = true
      this.searchBtnStatus = true
      const result = await getAppointmentApi(params)
      this.meetingRooms = result.data.meeting_rooms
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
        equipment: this.searchData.equipment, // 设备id
        reservable_start: '', // 容纳人数起始
        reservable_end: '', // 容纳人数结束
      }
      this.tableLoading = true
      const result = await getAppointmentApi(params)
        this.meetingRooms = result.data.meeting_rooms
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
        that.searchData.chooseDate = value || dayjs().format('YYYY-MM-DD')
        that.searchMeetingRoom()
      }, 100);
    },
    // 分钟小时转换
    handleNum(num) {
      let str = Number(num) / 60 > 1 ? `${Number(num) / 60}h`:`${num}分钟`
      return str
    }
  },
  // 销毁定时器
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="less" scoped>

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
      /deep/.el-input__inner{
         width: 180px;
        height: 32px;
      }
      /deep/.el-button{
        width: 80px;
        height: 32px;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
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
    }
  }
  .floor-name {
    margin: 18px 0 4px;
  }
  .floor-number{
      position: absolute;
      top: 0;
      left: 0;
      width: 38px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      font-size: 14px;
      color: #333;
      .floor-number-dec{
        position: absolute;
        top: 2px;
        left: 3px;
        z-index: 100;
        color: #fff;
        transform: rotate(-45deg);
        font-size: 12px;
      }
      .floor-number-icon {
        content: '';
        position: absolute;
        top: -4px;
        left: -17px;
        width: 0;
        height: 0;
        border-left: 26px solid transparent;
        border-right: 26px solid transparent;
        border-bottom: 26px solid #5c7bea;
        border-top: transparent;
        transform: rotate(-45deg);
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
    .floor-people-dec{
      
    }
  }
  
  .floor-content{
    min-height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    .floor-name{
      font-size: 12px;
      color: #384576;
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
    margin: 0 auto;
    .floor-device-list{
      width: auto;
      height: 20px;
      line-height: 18px;
      display: inline-block;
      padding: 0 10px;
      margin: 0 0 0 4px;
      border-radius: 16px;
      color: #9AABBE;
      font-size: 12px;
      background-color: #FBFCFF;
      border: 1px #E2E4EA solid;
    }
  }
.res-bottomt{
     text-align: center;
    margin-top: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
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
          border: 1px #ddd solid;
          margin-right: 4px;
      }
      .available{
        background-color: #ffffff;
      }
      .expired{
        background-color: #E7E9EE;
      }
      .reserved{
        background-color: #A5B7F4;
      }
      .selected{
        background-color: #5473E8;
      }
    }
}

</style>
