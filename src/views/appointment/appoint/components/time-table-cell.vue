/** * Copyright (c) 2019. 深圳市奥雅纳智能科技有限公司. All Rights Reserved. */

<template>
  <div>
    <div class="time-cell" v-if="scope.row.message">
      <div
        ref="box"
        class="time-cell-list"
        :style="scope.row.message.length >= 48 ? ' height: 132px;' : 'height: 66px;'"
        :class="{ fixed_wrap: scope.row.message.length >= 48 }"
      >
        <div
          class="time-cell-content"
          v-for="(item, index) in scope.row.message"
          :key="index"
          @click="chooseTime(index)"
          :class="{
            outDate: outDateNum && index <= outDateNum,
            fixed_width: scope.row.message.length >= 48,
          }"
        >
          <span
            :style="schedule_time_lattice == 15 ? 'width: 400%;' : 'width: 200%;'"
            class="time-cell-dec time-chil"
            v-if="item.is_hourly"
            >{{ item.time }}
          </span>
          <span class="time-cell-box time-chil"></span>
          <span
            :class="[
              'time-cell-active time-chil',
              {
                active:
                  startIndex === index ||
                  (endIndex !== null && index >= startIndex && index <= endIndex),
                startActive: startIndex === index && endIndex !== index,
                endActive: endIndex === index && startIndex !== index,
              },
            ]"
          ></span>
          <!-- 提示框 -->
          <el-popover
            v-if="item.status === 1"
            width="220"
            placement="bottom"
            effect="light"
            trigger="hover"
            :open-delay="300"
            @show="showPopover(String(item.meeting[0]['id']) + String(index))"
            @hide="popoverIsShow = false"
          >
            <div
              v-loading="popoverLoading"
              :element-loading-text="$t('public.loading')"
              element-loading-spinner="el-icon-loading"
            >
              <!-- <div class="popover-head">
                <span>会议详情</span>
                <span 
                :class="['popover-initial-index',{initial_hide: item.meeting.length < 2}]"
                >{{initialVal}}/<i class="details-length">{{item.meeting.length}}</i></span>
              </div> -->
              <el-carousel
                height="84px"
                trigger="click"
                direction="vertical"
                :loop="false"
                :initial-index="0"
                :autoplay="false"
                :class="{ carousel_srol_hide: item.meeting.length < 2 }"
                :ref="String(item.meeting[0]['id']) + String(index)"
                @change="changeCarousel"
              >
                <el-carousel-item v-for="item in item.meeting" :key="item.guid">
                  <div class="popover-list">
                    <div class="tip-list overhid">
                      <span class="tip-list-label">{{ $t("message.theme") }}：</span>
                      <span class="tip-list-val">{{ item.title || "--" }}</span>
                    </div>
                    <div class="tip-list overhid">
                      <span class="tip-list-label">{{ $t("message.senderMan") }}：</span>
                      <span class="tip-list-val">{{ item.sender || "--" }}</span>
                    </div>
                    <div class="tip-list overhid">
                      <span class="tip-list-label">{{ $t("message.startTime") }}：</span>
                      <span class="tip-list-val">{{ item.start_time || "--" }}</span>
                    </div>
                    <div class="tip-list overhid">
                      <span class="tip-list-label">{{ $t("message.endTime") }}：</span>
                      <span class="tip-list-val">{{ item.end_time || "--" }}</span>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
            <span
              slot="reference"
              :class="[
                'time-cell-status time-chil',
                {
                  meetings: item.status === 1,
                  startclass: item.start,
                  endclass: item.end,
                  width_min: item.widthMin,
                },
              ]"
            >
            </span>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from "dayjs";

export default {
  data() {
    return {
      startTime: null, // 开始时间
      endTime: null, // 结束时间
      startIndex: null, // 开始时间下标
      endIndex: null, // 结束时间下标
      errorStatus: true, // 时间冲突
      popoverLoading: false,
      popoverIsShow: false,
      carouselDom: "",
      initialIndex: 0,
      maxIndex: 0,
      initialVal: 1,
      scope2: this.scope,
    };
  },
  watch: {
    scope(newVal, oldVal) {
      this.byScrollTop();
  
    },
  },
  props: {
    recordSelectTime: Function,
    scope: Object,
    disabled: Boolean,
    chooseDate: String,
    schedule_time_lattice: Number,
  },
  computed: {
    forbidClick() {
      return {
        pointerEvents: "none",
      };
    },
    // 不可预约时间状态
    outDateNum() {
      const date = dayjs().format("YYYY-MM-DD HH-mm-ss");
      const time = date.split(" ")[1];
      const message = this.scope.row.message;
      if (date.split(" ")[0] === this.scope.row.day) {
        const hour = parseFloat(time.split("-")[0]);
        const minute = parseFloat(time.split("-")[1]);
        let minHorr = parseFloat(message[0].time);

        let num = 0;
        if (this.schedule_time_lattice == 30) {
          num = (hour - minHorr) * 2;
          num += minute > 30 ? 1 : minute == "00" && hour != minHorr ? -1 : 0;
        } else {
          num = (hour - minHorr) * 4;
          let count=parseInt(minute/15) ;
          num += minute > 15 ? count: minute == "00" && hour != minHorr ? -1 : 0;
        }

     
        return String(num);
      } else {
        return false;
      }
    },
  },
  methods: {
    byScrollTop() {
      let hour = dayjs().hour();
      if (this.scope.row.message.length > 48 && hour > 11) {
        this.$refs.box.scrollTop = 150;
      }
    },

    // 鼠标滚动切换会议详情 判断滚动方向
    handleScroll(e) {
      if (!this.popoverIsShow) return;
      let direction = e.deltaY > 0 ? "down" : "up"; //deltaY为正则滚轮向下，为负滚轮向上
      if (direction == "down" && e.deltaY >= 0) {
        //125为用户一次滚动鼠标的wheelDelta的值
        if (this.initialIndex >= this.maxIndex) {
          this.initialIndex = this.maxIndex;
        } else {
          this.initialIndex += 1;
          this.setActiveItem(this.initialIndex);
        }
      }
      if (direction == "up" && e.deltaY <= 0) {
        if (this.initialIndex <= 0) {
          this.initialIndex = 0;
        } else {
          this.initialIndex -= 1;
          this.setActiveItem(this.initialIndex);
        }
      }
    },
    setActiveItem(index) {
      //index为走马灯当前页码
      let nextIndex = index++;
      this.carouselDom(nextIndex);
    },
    // 会议详情触发
    showPopover(refsNmae) {
      // 提示窗监听鼠标滚动事件
      window.addEventListener("mousewheel", this.handleScroll);
      this.popoverIsShow = true; // 数据加载loading
      this.carouselDom = this.$refs[refsNmae][0].setActiveItem;
      // 重置提示窗状态激活位置
      this.initialIndex = 0;
      this.carouselDom(0);
    },
    // 幻灯片索引
    changeCarousel(index) {
      this.initialVal = index + 1;
    },
    showErrorStatus() {
      this.errorStatus = true;
    },
    // 选择预约时间
    chooseTime(index) {
      // 时间格列表
      const messages = this.scope.row.message;
      const timeStatus = messages.map((item, index) => {
        return item.status;
      });
      // 选择被预约的格子不作处理
      if (timeStatus[index]) {
        return;
      }
      // 首次点击
      const times = this.scope.row.message;
      if (this.startIndex === null || this.startIndex !== this.endIndex) {
        this.startTime = times[index].time;
        this.startIndex = index;
        this.endTime = this.hanldTimes(times, index);
        this.endIndex = index;
      } else {
        if (index > this.startIndex && index !== this.endIndex) {
          this.endTime = this.hanldTimes(times, index);
          this.endIndex = index;
        } else if (index === this.startIndex && this.startIndex === this.endIndex) {
          this.startTime = null;
          this.endTime = null;
          this.startIndex = null;
          this.endIndex = null;
        } else if (index === this.startIndex) {
          this.endTime = this.hanldTimes(times, index);
          this.endIndex = index;
        } else if (index === this.endIndex) {
          this.startTime = times[index].time;
          this.startIndex = index;
        } else if (index < this.startIndex) {
          if (this.endTime === null) {
            this.endTime = this.hanldTimes(times, index);
            this.startTime = times[index].time;
            this.endIndex = this.startIndex;
            this.startIndex = index;
          } else {
            this.startTime = times[index].time;
            this.startIndex = index;
          }
        }
      }
      // 处理时间冲突逻辑
      const period = timeStatus.slice(this.startIndex, this.endIndex + 1);
      if (this.startIndex && this.endIndex && period.some((item, index) => item === 1)) {
        this.startTime = times[index].time;
        this.startIndex = index;
        this.endTime = this.hanldTimes(times, index);
        this.endIndex = index;
      } else {
        this.recordSelectTime(this.$data, this.scope);
      }
    },
    // 末端时间处理
    hanldTimes(times, index) {
      let timeIndexVal = times[index].time;
      let timeName = "";
      if (index == times.length - 1) {
        if (timeIndexVal != "23:30") {
          timeName = Number(timeIndexVal.split(":")[0]) + 1 + ":00";
        } else {
          timeName = "24:00";
        }
      } else {
        timeName = times[index + 1].time;
      }
      return timeName;
    },
  },
  created() {


    setTimeout(() => {
        //时间格子大于48 并且当前时间大于11点  ，滚动条定位到第二页
        this.byScrollTop();
      }, 200);
  },

  mounted() {},
};
</script>
<style lang="less" scoped>
// @import '../../../../styles/variable/variable.less';
.time-cell-time {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  text-align: center;
  color: #5d5f6c;
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
  .time-cell-list {
    display: flex;
    width: 100%;
    padding-right: 1%;
    overflow-y: auto;
    overflow-x: hidden;
    // border: 1px #e7e9ee solid;
  }
  .fixed_wrap {
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
        background-color: #edaa75;
        pointer-events: none;
        margin: 0;
        transform: translateX(0);
        border-radius: 0;
        &.width_min {
          width: 56px !important;
        }
      }
      .meetings {
        background-color: #edaa75 !important;
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
        // width: 200%;
        // width: 400%;
        vertical-align: middle;
        font-size: 12px;
        color: #778ca2;
        border: 1px #e7e9ee solid;
        box-sizing: content-box;
      }
      &.time-cell-box {
        position: absolute;
        top: 23px;
        left: 0;
        height: 40px;
        box-sizing: content-box;
        border: 1px #e7e9ee solid;
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
          background-color: #5473e8;
          left: 0;
          right: 0;
          width: auto;
        }
        &.startActive {
          left: 3px;
        }
        &.endActive {
          width: auto;
          right: 2px;
        }
      }
      &.time-cell-status {
        position: absolute;
        left: 0;
        top: 26px;
        display: none;
        &.meetings {
          display: block;
          background-color: #85b0ac;
          border: none;
          height: 36px !important;
          width: 100%;
        }
        &.other {
          background-color: #34c74f;
        }
        &.startclass {
          width: auto;
          right: 0;
          left: 3px;
        }
        &.endclass {
          width: auto;
          right: 2px;
        }
        &.width_min {
          width: auto;
          left: 3px;
          right: 2px;
          transform: translateX(0);
        }
      }
    }
    .initial_hide {
      display: none;
    }
  }
  .fixed_width {
    flex: auto;
    width: 4.15%;
  }
}

/deep/.popover-list {
  overflow-y: auto;
  height: 100%;
  &::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #cecece;
  }
  &::-webkit-scrollbar-track {
    border-radius: 4px;
    background: #ffffff;
  }
}
.tip-list {
  display: flex;
  font-size: 12px;
  color: #3a3b4c;
  margin-bottom: 4px;
  padding-left: 8px;
  .tip-list-label {
    display: inline-block;
    width: 64px;
    text-align: left;
  }
  .tip-list-val {
    width: 120px;
  }
}
/deep/.carousel_srol_hide .el-carousel__indicators {
  display: none;
}
</style>
<style lang="less">
.el-popover {
  padding: 12px 10px 10px 4px !important;
}
*::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
*::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
  display: none;
}
*::-webkit-scrollbar-corner {
  background-color: transparent;
}
*::-webkit-scrollbar-thumb {
  border: 4px solid rgba(0, 0, 0, 0);
  height: 6px;
  border-radius: 25px;
  background-clip: padding-box;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>