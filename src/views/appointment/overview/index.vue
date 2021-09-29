/* 数据概览 */
<template>
  <div class="app-wrap overview no-padding no-bg">
    <div class="overview-top">
      <div class="overview-top-left">
        <div class="overview-top-statis">{{ $t("message.statistics") }}</div>
        <el-radio-group v-model="tabPosition">
          <el-radio-button :label="1">{{ $t("message.week") }}</el-radio-button>
          <el-radio-button :label="2">{{ $t("message.month") }}</el-radio-button>
          <el-radio-button :label="3">{{ $t("message.year") }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="overview-top-right">
        <div class="overview-top-rigth_item">
          <div class="top-rigth_item-dec">
            <span class="top-rigth_item-label">{{ $t("message.CumulativeDuration") }}</span>
            <span class="top-rigth_item-value">{{ statisticsData.total_time }}</span>
          </div>
          <div class="top-rigth_item-icon icon-dur"></div>
        </div>
        <div class="overview-top-rigth_item">
          <div class="top-rigth_item-dec">
            <span class="top-rigth_item-label">{{ $t("message.CumulativeNumber") }}</span>
            <span class="top-rigth_item-value">{{ statisticsData.total_count }}</span>
          </div>
          <div class="top-rigth_item-icon icon-num"></div>
        </div>
        <div class="overview-top-rigth_item">
          <div class="top-rigth_item-dec">
            <span class="top-rigth_item-label">{{ $t("message.meeting") }}</span>
            <span class="top-rigth_item-value">{{ statisticsData.my_count }}</span>
          </div>
          <div class="top-rigth_item-icon icon-meet"></div>
        </div>
        <div class="overview-top-rigth_item">
          <div class="top-rigth_item-dec">
            <span class="top-rigth_item-label">{{ $t("message.invited") }}</span>
            <span class="top-rigth_item-value">{{ statisticsData.other_count }}</span>
          </div>
          <div class="top-rigth_item-icon icon-invite"></div>
        </div>
      </div>
    </div>
    <div class="overview-bottom">
      <bar-chart ref="chartRef" :dataJson="chartData" />
    </div>
    <div class="overview-calendar">
      <div class="demo-app-main">
        <FullCalendar class="demo-app-calendar" ref="fullCalendar" :options="calendarOptions">
          <template v-slot:eventContent="arg">
            <div class="dots"></div>
            <!-- <i style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ arg.event.title }}</i> -->
            <i>{{ arg.event.title }}</i>
          </template>
        </FullCalendar>
      </div>
    </div>
  </div>
</template>

<script>
import { getStatisticsApi, getCalendarApi } from "@/api/appoint";
import BarChart from "@/components/BarChart";
import zh from "@/lang/zh";
import _ from "lodash";
import Cookies from "js-cookie";
import dayjs from "dayjs";
//引入日历组件
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
const lineChartData = {
  weeks: {
    title: [],
    duration: ["", "", "", "", "", "", ""],
    frequency: ["", "", "", "", "", "", ""],
    barWidth: 30
  },
  months: {
    title: [],
    duration: [],
    frequency: [],
    barWidth: 10
  },
  years: {
    title: [],
    duration: [],
    frequency: [],
    barWidth: 30
  }
};
export default {
  name: "overview",
  components: { BarChart, FullCalendar },
  data() {
    return {
      tabPosition: "1",
      chartData: lineChartData.weeks,
      statisticsData: {},
      getType: [0, 1, 2, 3],
      calendarOptions: {
        headerToolbar: {
          left: "",
          center: "prevYear,prev,title,next,nextYear",
          right: ""
        },
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        aspectRatio: 2, //宽高比例
        eventLimit: true, //每日事件展示上限
        eventLimitText: "更多",
        initialView: "dayGridMonth", // 设置默认显示月，可选周、日
        editable: false, //是否允许拖拽事件
        selectable: true,
        displayEventEnd: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        datesSet: this.handleDatesSet,
        events: [],
        eventMouseEnter: this.eventMouseEnter,
        locale: Cookies.get("language") == "en" ? "" : "zh-cn",
        moreLinkClick: this.eventClickHandle
      },
      dataList: [],
      start: "",
      end: "",
      dataTypes: 1,
      timeInfo: {},
      calendarApi: ""
    };
  },
  watch: {
    tabPosition(news, old) {
      this.getStatistics(news);
    },
    start(news, old) {
      this.dataList = [];
      this.getCalendar(news, this.end);
    }
  },
  mounted() {
    // 注销onresizes事件
    window.onresize = null;
    this.getStatistics();
    this.calendarApi = this.$refs.fullCalendar.getApi(); // 获取当前日历视图信息
  },
  activated() {
    // 设置会议预约次数/时长统计
    this.getStatistics(this.dataTypes);
    // 设置日历数据
    let start = this.timeFormat(this.timeInfo.start);
    let end = this.timeFormat(this.timeInfo.end);
    this.getCalendar(start, end);
    this.calendarApi.updateSize(); // 强制更新日历宽高
  },
  methods: {
    // 点击更多
    eventClickHandle(arg) {
      let that = this;
      setTimeout(function() {
        let doc = document.getElementsByClassName("fc-popover")[0];
        doc.innerHTML = that.creadHtml(arg.allSegs, arg.date);
      }, 5);
    },
    // 弹窗更多列表内容
    creadHtml(data, day) {
      let htmlStr = "";
      let dates = dayjs(day).format("YYYY.MM.DD");
      if (data) {
        data.map(res => {
          htmlStr += `<div class="popover-list">
             <div class="popover-list-title">
               <span class="title-date">${res.event._def.extendedProps.dates}</span>
               <span class="title-text">${res.event._def.extendedProps.titleDec}</span>
             </div>
             <div class="popover-list-room">${res.event._def.extendedProps.rooName}</div>
          </div>`;
        });
      }
      let box = `<div class="popover-box">
          <div class="popover-date">${dates}</div>
          <div class="popover-title">${this.$t("message.meetingSchedule")} (${data.length})</div>
          <div class="popover-content">${htmlStr}</div>
        </div>`;
      return box;
    },
    // 获取数据
    getStatistics(types = 1) {
      this.dataTypes = types;
      let params = { type: types ? this.getType[types] : 1 };
      getStatisticsApi(params).then(res => {
        if (res.meta.code == "RESP_OKAY") {
          this.statisticsData = res.data;
          let typeStr = "weeks";
          switch (types) {
            case 1:
              typeStr = "weeks";
              break;
            case 2:
              typeStr = "months";
              break;
            case 3:
              typeStr = "years";
              break;
          }
          this.resetData(typeStr, res.data);
        }
      });
    },
    //获取会议日历数据
    getCalendar(start, end) {
      var that = this;
      let params = { start: start, end: end };
      getCalendarApi(params).then(res => {
        if (res.meta.code == "RESP_OKAY") {
          that.dataList = res.data["monthly-data"];
          that.getReservationList(that.dataList);
        }
      });
    },
    // 重组数据
    resetData(types, data) {
      let dataObj = this.handelArr(data[types]);
      lineChartData[types]["duration"] = dataObj.arr_hours; // 总小时数
      lineChartData[types]["frequency"] = dataObj.arr_count; // 总场数
      lineChartData[types]["title"] = [];
      if (types == "weeks" || types == "years") {
        for (let key in zh[types]) {
          lineChartData[types]["title"].push(this.$t(types + "." + key));
        }
      } else if (types == "months") {
        data[types].map((res, index) => {
          lineChartData[types]["title"].push(index + 1);
        });
      }

      this.chartData = lineChartData[types];
      this.$refs.chartRef.refreshData(this.chartData);
    },
    // 分离小时数和场次
    handelArr(arr) {
      let obj = {
        arr_hours: [], // 总小时数
        arr_count: [] // 总场数
      };
      arr.map(res => {
        obj.arr_hours.push(res.total_hours);
        obj.arr_count.push(res.total_count);
      });
      return obj;
    },
    //数据赋值然后渲染至日历上
    getReservationList(arrayData) {
      let newArr = [];
      arrayData.forEach(item => {
        newArr.push({
          start: item.is_cross_day ? item.date + " 00:00" : item.start,
          end: item.end,
          id: item.id,
          rooName: item.meeting_room_name,
          titleDec: item.title,
          dates: item.is_cross_day
            ? `${this.getNextTime(item.start, item.start_time)} - ${this.getNextTime(
                item.end,
                item.end_time
              )}`
            : this.getTitle(item.start, item.end),
          title: item.is_cross_day
            ? `${this.getTitle(item.start, "")} ${item.title} ${this.getTitle("", item.end)}`
            : `${this.getTitle(item.start, item.end)} ${item.title}`
        });
      });
      this.calendarOptions.events = newArr;
    },
    // 获取会议事件title
    getTitle(startDate, endDate) {
      if (startDate && endDate) {
        let start = startDate.substring(11, 16);
        let end = endDate.substring(11, 16);
        return `${start}~${end}`;
      } else {
        let start = startDate.substring(11, 16);
        let end = endDate.substring(11, 16);
        return `${start} ${end}`;
      }
    },
    // 跨日预约时间
    getNextTime(dates, times) {
      let md = dates.substring(5, 11);
      let strMd = md.replace(/-/, "/");
      let startStr = `${strMd} ${times}`;
      return startStr;
    },
    //格式化时间
    timeFormat(time) {
      let year = time.getFullYear();
      let month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1);
      let day = time.getDate() >= 10 ? time.getDate() : "0" + time.getDate();
      return year + "-" + month + "-" + day;
    },
    //选择prevYear,prev,next,nextYear事件
    handleDatesSet(info) {
      this.timeInfo = info;
      this.start = this.timeFormat(info.start);
      this.end = this.timeFormat(info.end);
    },
    eventMouseEnter: mouseEnterInfo => {
      tippy(mouseEnterInfo.el, {
        content: mouseEnterInfo.event.title,
        placement: "top-start"
      });
    }
  },
  created() {}
};
</script>

<style lang="less" scoped>
.overview {
  .overview-top {
    display: flex;
    height: 160px;
    background: #fff;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    overflow-x: auto;
    margin-bottom: 20px;
    .overview-top-left {
      flex: 1;
      min-width: 300px;
      .overview-top-statis {
        min-width: 167px;
        font-size: 14px;
        padding: 0 0 22px;
      }
    }
    .overview-top-right {
      display: flex;
      text-align: right;
      .overview-top-rigth_item {
        display: inline-flex;
        width: 188px;
        height: 90px;
        align-items: center;
        padding: 20px;
        justify-content: space-between;
        border: 1px #eaedf6 solid;
        border-radius: 4px;
        margin-left: 26px;
        .top-rigth_item-dec {
          text-align: center;
          .top-rigth_item-label {
            display: block;
            font-size: 12px;
            color: #778ca2;
            margin-bottom: 6px;
          }
          span.top-rigth_item-value {
            color: #252631;
            font-size: 19.5px;
          }
        }
        .top-rigth_item-icon {
          display: inline-block;
          width: 40px;
          height: 40px;
          background: #eee;
          margin-left: 10px;
          background-size: 100% 100%;
        }
        .icon-dur {
          background: url("../../../assets/icon/icon-dur.png") no-repeat;
        }
        .icon-num {
          background: url("../../../assets/icon/icon-num.png") no-repeat;
        }
        .icon-meet {
          background: url("../../../assets/icon/icon-meet.png") no-repeat;
        }
        .icon-invite {
          background: url("../../../assets/icon/icon-invite.png") no-repeat;
        }
      }
    }
  }
  .overview-bottom {
    width: 100%;
    height: 500px;
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 20px;
  }
  .overview-calendar {
    width: 100%;
    background: #fff;
    padding: 50px 20px 50px;
  }
}
/deep/.el-radio-button--medium .el-radio-button__inner {
  padding: 12px 32px;
  border: none;
}
/deep/.el-radio-button__inner {
  background: #f3f6fc;
}
/deep/.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  color: #fff;
  background-color: #5c7bea;
  border-color: #5c7bea;
  box-shadow: -1px 0 0 0 #5c7bea;
}
/deep/.fc-toolbar-chunk > div {
  display: flex;
}
/deep/.fc .fc-button-primary {
  background-color: #ffffff;
  color: #000;
  border-color: #ffffff;
  border: 0px solid #ffffff;
}
/deep/.fc .fc-toolbar-title {
  margin: 0 50px;
}
/deep/.fc .fc-button-primary:not(:disabled):active,
.fc .fc-button-primary:not(:disabled).fc-button-active {
  color: #000;
  background-color: #ffffff;
}
/deep/.fc-popover-body {
  height: 150px;
  overflow: scroll;
}
/deep/.fc-event-main {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.fc .fc-popover {
  width: 266px;
}
/deep/.fc .fc-daygrid-event-harness {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 3px 0 3px 0;
}
/deep/.fc-daygrid-event span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dots {
  display: inline-block;
  margin: 0 4px;
  box-sizing: content-box;
  width: 0;
  height: 0;
  border: 4px solid #3788d8;
  border: calc(var(--fc-daygrid-event-dot-width, 8px) / 2) solid
    var(--fc-event-border-color, #3788d8);
  border-radius: 4px;
  border-radius: calc(var(--fc-daygrid-event-dot-width, 8px) / 2);
}
.colors {
  color: red;
}

/deep/.popover-box {
  position: relative;
  height: 200px;
  .popover-date {
    background-color: #f1f1f1;
    color: #32353b;
    padding: 4px 10px;
    font-size: 12px;
  }
  .popover-title {
    background-color: #3788d8;
    color: #fff;
    padding: 4px 4px;
    font-size: 12px;
    margin: 8px 11px;
  }
  .popover-list-room {
    color: #333;
    font-weight: bold;
    margin-top: 2px;
  }
  .popover-content {
    position: absolute;
    top: 62px;
    width: 98%;
    font-size: 12px;
    background: #fff;
    overflow-y: auto;
    bottom: 5px;
    margin-right: 4px;
    .popover-list {
      position: relative;
      padding: 0 6px 8px 30px;
      &:before {
        position: absolute;
        top: 2px;
        left: 16px;
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #3788d8;
      }
      .title-date {
        color: #585858;
      }
      .title-text {
        color: #000000;
        font-weight: bold;
      }
    }
  }
}

/deep/.fc-popover-header,
/deep/.fc-popover-body {
  display: none;
}

/*-------滚动条整体样式----*/
/deep/.popover-content::-webkit-scrollbar {
  width: 3px;
  height: 8px;
}
/*滚动条里面小方块样式*/
/deep/.popover-content::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background: #dcdfe6;
}
/*滚动条里面轨道样式*/
/deep/.popover-content::-webkit-scrollbar-track {
  border-radius: 0;
  background: #fff;
}
</style>
