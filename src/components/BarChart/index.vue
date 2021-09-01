<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from "echarts";
import resize from "./mixins/resize";
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "90%"
    },
    dataJson: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      let duration = this.$t("message.duration");
      let frequency = this.$t("message.frequency");
      this.chart = echarts.init(this.$el);

      this.chart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          show: true,
          orient: "horizontal",
          top: "0",
          right: "left",
          data: [
            {
              name: duration,
              icon: "rect",
              textStyle: { color: "#A6B6C6" }
            },
            {
              name: frequency,
              icon: "rect",
              textStyle: { color: "#A6B6C6" }
            }
          ]
        },
        grid: {
          top: "30%",
          left: "2%",
          right: "2%",
          bottom: "0",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.dataJson.title,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: duration,
            type: "bar",
            barGap: 0,
            barWidth: this.dataJson.barWidth,
            emphasis: {
              focus: "none"
            },
            data: this.dataJson.duration,
            itemStyle: {
              color: "#A6B6C6"
            }
          },
          {
            name: frequency,
            type: "bar",
            barWidth: this.dataJson.barWidth,
            emphasis: {
              focus: "none"
            },
            data: this.dataJson.frequency,
            itemStyle: {
              color: "#A5B7F4"
            }
          }
        ]
      });
    },
    refreshData(data) {
      this.$nextTick(() => {
        if (!this.chart) {
          return;
        }
        //更新数据
        var option = this.chart.getOption();
        option.xAxis[0].data = data.title;
        option.series[0].data = data.duration;
        option.series[1].data = data.frequency;
        option.series[0].barWidth = data.barWidth;
        option.series[1].barWidth = data.barWidth;
        this.chart.setOption(option, true);
      });
    }
  }
};
</script>
