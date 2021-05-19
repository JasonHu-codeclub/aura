/**
 * Copyright (c) 2019. 深圳市奥雅纳智能科技有限公司. All Rights Reserved.
 */

<template>
  <div>
  <div class="time-cell-time" v-if="startIndex">选中：{{scope.row.day}}&nbsp;{{chooseDate}}&nbsp;{{$data.startTime}}&nbsp;至&nbsp;{{$data.endTime}}</div>
  <div class="time-cell" v-if="scope.row.message">
    <div class="time-cell-list" :class="{fixed_wrap: scope.row.message.length == 48}">
      <div
        class="time-cell-content"
        v-for="(item, index) in scope.row.message"
        :key="index"
        @click="chooseTime(index)"
        :class="{ outDate: outDateNum && index <= outDateNum, fixed_width: scope.row.message.length == 48}"
      >
        <span class="time-cell-dec time-chil" v-if="item.is_hourly">{{ item.time }}</span>
        <span class="time-cell-box time-chil"></span>
        <span :class="['time-cell-active time-chil', 
        { active:startIndex === index || (endIndex !== null && index >= startIndex && index <= endIndex),
        startActive: (startIndex === index && endIndex !== index), 
        endActive: (endIndex === index && startIndex !== index)}]"></span>
        <!-- 提示框 -->
        <el-popover :disabled="scope.row.message[index].status === 0"  placement="bottom" effect="light" trigger="hover">
          <div >
            <div class="tip-list">
              <span class="tip-list-label">{{$t('message.theme')}}：</span>
              {{scope.row.message[index].title}}
            </div>
            <div class="tip-list">
              <span class="tip-list-label">{{$t('message.sender')}}：</span>
              {{scope.row.message[index].sender}}
            </div>
            <div class="tip-list">
              <span class="tip-list-label">{{$t('message.startTime')}}：</span>
              {{scope.row.message[index].start_time}}
            </div>
            <div class="tip-list">
              <span class="tip-list-label">{{$t('message.endTime')}}：</span>
              {{scope.row.message[index].end_time}}
            </div>
          </div>
          <span slot="reference" :class="['time-cell-status time-chil', 
                {meetings: scope.row.message[index].status === 1,
                startclass:  scope.row.message[index].start, 
                endclass: scope.row.message[index].end, 
                width_min: scope.row.message[index].widthMin
              }]"
          ></span>
        </el-popover>

      </div>
    </div>
  </div>
</div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  data () {
    return {
      times: ['08:00', '', '09:00', '', '10:00', '', '11:00', '', '12:00',
        '', '13:00', '', '14:00', '', '15:00', '', '16:00', '', '17:00',
        '', '18:00', '', '19:00', ''],
      startTime: null,
      endTime: null,
      startIndex: null,
      endIndex: null,
      // outDateNum: 0 // 过期时间个数
      errorStatus: true
    }
  },
  props: {
    recordSelectTime: Function,
    scope: Object,
    disabled: Boolean,
    chooseDate: String
  },
  computed: {
    forbidClick () {
      return {
        'pointerEvents': 'none'
      }
    },
    // 不可预约时间状态
    outDateNum () {
      const date = dayjs().format('YYYY-MM-DD HH-mm-ss')
      const time = date.split(' ')[1]
      const message = this.scope.row.message
      if (date.split(' ')[0] === this.scope.row.day) {
        const hour = parseFloat(time.split('-')[0])
        const minute = parseFloat(time.split('-')[1])
        if(message.length == 48){
          let num = hour * 2
          num += minute > 30 ? 1 : (minute == '00' && hour!= 0 ? -1 : 0)
          return String(num)
        }else{
          let num = (hour - 8) * 2
          num += minute > 30 ? 1 : (minute == '00' && hour!= 8 ? -1 : 0)
          return String(num)
        }
      } else {
        return false
      }
    }
  },
  methods: {
    showErrorStatus () {
      this.errorStatus = true
    },
    // 选择预约时间
    chooseTime (index) {
      console.log(index,'index')
      // 时间格列表
      const messages = this.scope.row.message
      const timeStatus = messages.map((item, index) => {
        return item.status
      })
      // 选择被预约的格子不作处理
      if(timeStatus[index]){
        return
      }
      // 首次点击
      const times = this.scope.row.message
      if (this.startIndex === null || this.startIndex !== this.endIndex) {
        this.startTime = times[index].time
        this.startIndex = index
        this.endTime = index === 23 ? '20:00' : times[index + 1].time
        this.endIndex = index
      } else {
        if (index > this.startIndex && index !== this.endIndex) {
          this.endTime = index === 23 ? '20:00' : times[index + 1].time
          this.endIndex = index
        } else if (index === this.startIndex && this.startIndex === this.endIndex) {
          this.startTime = null
          this.endTime = null
          this.startIndex = null
          this.endIndex = null
        } else if (index === this.startIndex) {
          this.endTime = index === 23 ? '20:00' : times[index + 1].time
          this.endIndex = index
        } else if (index === this.endIndex) {
          this.startTime = times[index].time
          this.startIndex = index
        } else if (index < this.startIndex) {
          if (this.endTime === null) {
            this.endTime = index === 23 ? '20:00' : times[index + 1].time
            this.startTime = times[index].time
            this.endIndex = this.startIndex
            this.startIndex = index
          } else {
            this.startTime = times[index].time
            this.startIndex = index
          }
        }
      }
      // 处理时间冲突逻辑
      const period = timeStatus.slice(this.startIndex, this.endIndex + 1)
      if (this.startIndex && this.endIndex && period.some((item, index) => item === 1)) {
        this.startTime = times[index].time
        this.startIndex = index
        this.endTime = index === 23 ? '20:00' : times[index + 1].time
        this.endIndex = index
      } else {
        this.recordSelectTime(this.$data, this.scope)
      }
    }
  },
  created() {
  },
  mounted () {
    
  }
}
</script>
<style lang='less' scoped>
// @import '../../../../styles/variable/variable.less';
.time-cell-time {
    position: absolute;
    top: 0;
    left: 50%;
    width: 100%;
    text-align: center;
    color: #5D5F6C;
    font-size: 12px;
    z-index: 999;
    transform: translateX(-50%);
}
.time-cell {
  font-size: 0;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 16px;
  .time-cell-list{
    display: flex;
    width: 100%;
  }
  .fixed_wrap{
    flex-wrap: wrap;
  }
  .time-cell-content {
    position: relative;
    flex: 1;
    height: 65px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    display: inline-block;
    border-right: none;
    
    &.outDate {
      pointer-events: none;
      .time-cell-active {
        background-color: #EEF1FC;
        pointer-events: none;
        margin: 0;
        transform: translateX(0);
        border-radius: 0;
        &.width_min{
          width: 56px !important;
        }
      }
      .meetings {
        background-color:#EEF1FC !important;
      }
    }
    .time-chil {
      display: inline-block;
      box-sizing: content-box;
      height: 22px;
      width: 100%;
      background-color: white;
      &.el-tooltip {
        height: 34px !important;
        display: inline-block;
      }
      &.time-cell-dec {
        width: 200%;
        vertical-align: middle;
        font-size: 12px;
        color: #778CA2;
        border: 1px #E7E9EE solid;
        box-sizing: content-box;
      }
      &.time-cell-box {
        position: absolute;
        top: 23px;
        left: 0;
        height: 40px;
        box-sizing: content-box;
        border: 1px #E7E9EE solid;
      }
      &.time-cell-active {
          position: absolute;
          left: 3px;
          right: 2px;
          top: 26px;
          height: 36px;
          width: auto;
          box-sizing: initial;
        &.active {
          // background-color: @themeColor;
          background-color: #5473E8;
          left: 0;
          right: 0;
          width: auto;
        }
        &.startActive{
          left: 3px;
        }
        &.endActive{
          width: auto;
          right: 2px;
        }
      }
      &.time-cell-status{
        position: absolute;
        left: 0;
        top: 26px;
        display: none;
        &.meetings {
          display: block;
          background-color: #A5B7F4;
          border: none;
          height: 36px !important;
          width: 100%;
        }
        &.other {
          background-color: #34c74f;
        }
        &.startclass{
          width: auto;
          right: 0;
          left: 3px;
        }
        &.endclass{
          width: auto;
          right: 2px;
        }
        &.width_min{
          width: auto;
          left: 3px;
          right: 2px;
          transform: translateX(0);
        }
      }
    }
  }
  .fixed_width{
    flex: auto;
    width: 4.15%;
  }
}
.tip-list{
  font-size: 12px;
  color: #8094A7;
  margin-bottom: 4px;
  span.tip-list-label {
    display: inline-block;
    width: 70px;
    text-align: right;
  }
}

</style>
<style lang="less">
.el-popover{
  padding: 12px 28px 10px 4px !important;
}
</style>