<template>
  <div class="app-wrap invitation-wrap">
    <!-- 搜索 -->
    <div class="filter">
      <div class="filter-item">
        <!-- 日期 -->
        <div class="filter-item-box">
          <span>{{ $t("labe.date") }}：</span>
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
            @change="inputChange"
            >></el-date-picker
          >
        </div>
        <!-- 关键字 -->
        <div class="filter-item-box">
          <span>{{ $t("labe.keyword") }}：</span>
          <el-input
            type="text"
            v-model="searchForm.keyword"
            :placeholder="$t('placeholder.nameTypes')"
            @keyup.enter.native="inputChange"
            @clear="inputChange"
            clearable
          ></el-input>
        </div>
        <!-- 状态 -->
        <div class="filter-item-box">
          <span>{{ $t("labe.status") }}：</span>
          <el-select
            v-model="searchForm.status"
            :placeholder="$t('message.status')"
            @change="inputChange"
            collapse-tags
            multiple
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
        <!-- 发起方式 -->
        <div class="filter-item-box">
          <span>{{ $t("labe.senderType") }}：</span>
          <el-select
            v-model="searchForm.user_type"
            :placeholder="$t('message.all')"
            @change="inputChange"
            clearable
          >
            <el-option
              v-for="item in userList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </div>

        <div class="filter-item-box">
          <!-- 查询 -->
          <el-button
            type="primary"
            class="search"
            @click="inputChange"
            :loading="searchBtnStatus"
            >{{ $t("button.search") }}</el-button
          >
          <!-- 重置 -->
          <el-button type="info" class="search" @click="resetMeetingInfo">{{
            $t("button.reset")
          }}</el-button>
        </div>
      </div>
    </div>
    <!-- /搜索 -->

    <div class="current-table">
      <el-table
        ref="table"
        :data="myMeetingInfo"
        :height="tableHeight - 150"
        tooltip-effect="light"
        style="width: 100%"
        header-row-class-name="table-header"
        v-loading="dataLoading"
      >
        <!-- 序号 -->
        <el-table-column :label="$t('message.serial')" type="index" width="60" align="center">
        </el-table-column>
        <!-- 主题 -->
        <el-table-column
          prop="title"
          :label="$t('message.theme')"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <!-- 会议时间 -->
        <el-table-column
          prop="start_time"
          :label="$t('message.meetingTime')"
          align="center"
          width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.satrtTime }}<br />{{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <!-- 会议室 -->
        <el-table-column
          prop="meeting_room_name"
          :label="$t('message.room')"
          align="center"
        ></el-table-column>
        <!-- 预约类型 -->
        <el-table-column prop="category" :label="$t('message.AppointmentType')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.categoryStr }}</span>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column prop="status" :label="$t('message.meetingStatus')" align="center">
          <template slot-scope="scope">
            <span>{{ listStatus[scope.row.status]["name"] }}</span>
          </template>
        </el-table-column>
        <!-- 参会人数 -->
        <el-table-column
          prop="participant"
          :label="$t('message.participantsNum')"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-tooltip
              :disabled="!scope.row.participant"
              placement="bottom-start"
              effect="light"
              :open-delay="350"
              popper-class="tooltip-per"
            >
              <div slot="content">{{ scope.row.personnel }}</div>
              <span :class="{ part_num: scope.row.participant > 0 }">{{
                scope.row.participant || "/"
              }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 发起人 -->
        <el-table-column
          prop="user_nickname"
          :label="$t('message.sender')"
          align="center"
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column
          :label="$t('message.operation')"
          :width="dataType == 1 ? 140 : 80"
          align="center"
        >
          <template slot-scope="scope">
            <!-- 会议状态 0=>审批中 1=》会议中，2=》未开始，3=》已结束，4=》已拒绝,5=》已取消，6=》过期未审批 -->
            <el-button
              type="text"
              v-can-appointment
              v-if="dataType == 1"
              :disabled="scope.row.status == 1 || scope.row.can_release == 0"
              @click="deleteMeeting(scope.row)"
            >
              {{ $t("button.cancel") }}
            </el-button>
            <el-button type="text" @click="detailsMeet(scope.row)">
              {{ $t("button.details") }}
            </el-button>
            <el-button
              type="text"
              v-can-appointment
              v-if="dataType == 1"
              :disabled="scope.row.status == 1 || scope.row.can_update == 0"
              @click="editMeetingInfo(scope.row)"
            >
              {{ $t("button.edit") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :background="false"
        :page.sync="paginationQuery.page"
        :limit.sync="paginationQuery.limit"
        @change="getMyMeetingInfo"
      />
    </div>
    <!-- 取消会议 -->
    <dialog-cancel
      ref="cancel"
      :content="cancelContent"
      :title="cancelTitle"
      :btnLoading="deleteBtnLoading"
      @handleClose="handleClose"
      @hanldConfirm="hanldDeleteMeeting"
    ></dialog-cancel>
  </div>
</template>
<script>
import { myMeetingListApi, meetCancelApi } from "@/api/currentMeet";
import Pagination from "@/components/Pagination";
import dialogCancel from "./dialogCancel";
import qs from "querystring";
import Cookies from "js-cookie";
export default {
  components: { Pagination, dialogCancel }, // 分页
  data() {
    return {
      isCurrent: 1,
      searchForm: {
        user_type: "", // 用户类型
        status: [], // 状态
        keyword: "" // 会议名称
      },
      chooseDate: null, // 日期
      statusList: [], // 会议状态 0=>审批中 1=》会议中，2=》未开始，3=》已结束，4=》已拒绝,5=》已取消，6=》过期未审批
      currentStatus: [
        // 当前会议状态
        { key: 1, name: this.$t("statusList.meeting") },
        { key: 0, name: this.$t("statusList.pending") },
        { key: 2, name: this.$t("statusList.noStart") }
      ],
      historyStatus: [
        // 历史会议状态
        { key: 3, name: this.$t("statusList.hasEnded") },
        { key: 6, name: this.$t("statusList.noApproval") },
        { key: 4, name: this.$t("statusList.hasRefused") },
        { key: 5, name: this.$t("statusList.hasCancel") }
      ],
      listStatus: [
        // 表格列表状态
        { key: 0, name: this.$t("statusList.pending") },
        { key: 1, name: this.$t("statusList.meeting") },
        { key: 2, name: this.$t("statusList.noStart") },
        { key: 3, name: this.$t("statusList.hasEnded") },
        { key: 4, name: this.$t("statusList.hasRefused") },
        { key: 5, name: this.$t("statusList.hasCancel") },
        { key: 6, name: this.$t("statusList.noApproval") }
      ],
      userList: [
        { key: 1, name: this.$t("userList.initiate") },
        { key: 2, name: this.$t("userList.byInvitation") }
      ],
      paginationQuery: {
        page: 1, // 当前页
        limit: 10 // 每页显示条目个数
      },
      pickerOptions: {
        // 控制日期选择
        disabledDate(time) {
          // return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      categoryList: {
        1: this.$t("categoryList.singleAppointment"),
        2: this.$t("categoryList.repeatAppointment"),
        3: this.$t("categoryList.crossAppointment")
      },
      repetitionType: {
        1: this.$t("repeatTypeList.daily"),
        2: this.$t("repeatTypeList.weeks"),
        3: this.$t("repeatTypeList.month")
      },
      total: 0, // 总页数
      searchBtnStatus: false, // 查询loading
      myMeetingInfo: [], // 列表数据
      selectCurrentRowData: {}, // 会议状态
      deleting: false, // 取消按钮状态
      dataLoading: false, // 列表loading
      cancelTitle: "", // 弹窗title
      cancelContent: "", // 弹窗内容
      deleteBtnLoading: false // 弹窗确认loading
    };
  },
  props: {
    dataType: {
      require: true,
      type: Number
    }
  },
  mounted() {
    // 获取数据
    this.getMyMeetingInfo();
    // 状态查询
    this.statusList = this.dataType == 1 ? this.currentStatus : this.historyStatus;

    this.resizeHeight(100);
  },
  activated() {
    // 获取数据
    this.getMyMeetingInfo();
  },
  methods: {
    // 选择日期
    inputChange() {
      this.paginationQuery.page = 1; // 当前页
      this.getMyMeetingInfo();
    },
    // 获取列表数据
    async getMyMeetingInfo() {
      let params = {
        page: this.paginationQuery.page, // 当前页
        size: this.paginationQuery.limit,
        type: this.dataType,
        start_date: this.chooseDate ? this.chooseDate[0] : "",
        end_date: this.chooseDate ? this.chooseDate[1] : "",
        ...this.searchForm
      };
      this.dataLoading = true;
      const result = await myMeetingListApi(params);
      let meetings = result.data.meetings;
      meetings.map(v => {
        v.satrtTime = `${v.date} ${v.start}`;
        v.endTime = `${v.end_date} ${v.end}`;
        v.categoryStr =
          v.category == 2
            ? `${this.categoryList[v.category]}（${this.repetitionType[v.repetition_type]}）`
            : this.categoryList[v.category];
        v.participant_users.map(item => {
          v.personnel = v.personnel ? v.personnel + "，" + item.nickname : item.nickname;
        });
      });
      this.myMeetingInfo = meetings;
      this.total = result.data.total; // 总条数
      this.dataLoading = false;
    },
    // 详情
    detailsMeet(row) {
      // 判断单次还是重复预约 category会议类型 1=》单次预约，2=》重复预约 ，3=》跨日预约
      let meetType =
        !!row.category && row.category == 2 && this.dataType != 2 ? "repeat" : "/details";
      this.$router.push({
        path: meetType,
        query: {
          menu: this.dataType === 1 ? "current" : "history",
          id: row.id
        }
      });
    },
    // 编辑会议
    editMeetingInfo(row) {
      if (row.status === 1) {
        // 会议中提示
        this.$alert(this.$t("message.meetingProgress"), this.$t("message.tips"), {
          confirmButtonText: this.$t("button.confirm")
        }).catch(() => {});
        return false;
      }
      // 跳转编辑页
      this.$router.push({
        path: "edit",
        query: {
          menu: "current",
          id: row.id
        }
      });
    },
    // 取消会议
    deleteMeeting(data) {
      // status: 0审批中 1会议中 2未开始
      this.$refs.cancel.dialogVisible = true;
      this.selectCurrentRowData = data;
      this.cancelTitle = this.$t("message.cancelTips");
      if (data.category == 2) {
        this.cancelContent = `${this.$t("message.cancels")}${data.meeting_count}${this.$t(
          "message.confirms"
        )}<br/>${this.$t("tip.confirmTips")}`;
      } else {
        this.cancelContent = `${this.$t("tip.cancelMeeting")}<br/>${this.$t("tip.confirmTips")}`;
      }
    },
    // 取消会议请求
    hanldDeleteMeeting() {
      let data = this.selectCurrentRowData;
      // data.category：2 重复预约、1 单次预约
      let params = { id: data.id };
      if (data.category === 2) {
        params.type = 2;
      }
      // 取消/结束会议成功提示
      this.deleteBtnLoading = true; // 确认按钮loading
      meetCancelApi(params).then(res => {
        this.deleteBtnLoading = false; // 确认按钮loading
        if (res.meta.code == "RESP_OKAY") {
          this.$message({
            message: this.$t("tip.meetCancelled"),
            type: "success"
          });
          if (this.myMeetingInfo.length == 1 && this.paginationQuery.page > 1) {
            this.paginationQuery.page--;
          }
          this.getMyMeetingInfo();
          this.$refs.cancel.dialogVisible = false; // 弹框
        }
      });
    },
    // 重置
    resetMeetingInfo() {
      this.paginationQuery = {
        page: 1, // 当前页
        limit: 10 // 每页显示条目个数
      };
      this.searchForm = {
        user_type: "", // 用户类型
        status: [], // 状态
        keyword: "" // 会议名称
      };
      (this.chooseDate = null), // 日期
        this.getMyMeetingInfo();
    },
    handleClose() {
      this.cancelTitle = "";
      this.cancelContent = "";
    }
  },
  beforeDestroy() {
    // 注销onresizes事件
    window.onresize = null;
  },
  created() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {}
};
</script>
<style lang="less" scoped>
.invitation-wrap {
  .filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 20px 0 0;
    .filter-item {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      /deep/.el-input {
        width: auto;
      }
    }
    .filter-item-box {
      display: flex;
      margin: 0 20px 20px 0;
      align-items: center;
      /deep/.el-input__inner {
        width: 180px;
        height: 36px;
        padding-right: 10px;
      }
      .choose-date {
        width: 260px;
      }
      /deep/.el-button {
        width: 80px;
        font-size: 14px;
      }
    }
  }

  .current-table {
    overflow-y: hidden;
    overflow-x: hidden;
    .meeting-time {
      display: block;
    }
    .part_num {
      display: inline-block;
      width: 50px;
      height: 24px;
      line-height: 24px;
      border-radius: 20px;
      cursor: pointer;
      background-color: #f5f8ff;
    }
  }

  /deep/.table-header {
    th {
      background: #f6f7fc !important;
    }
  }
  /deep/.el-table--medium td,
  .el-table--medium th {
    padding: 6px 0;
    font-size: 14px;
    color: #56697d;
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
      .el-table__body {
      }
    }
  }
  /deep/.el-dialog__header {
    padding: 0;
  }
  /dedp/.el-dialog__headerbtn {
    top: 25px;
  }
  /deep/.el-dialog__header {
    border: none !important;
  }
  /deep/.el-dialog__body {
    padding: 25px 10px 12px 33px;
    .cancel-tips {
      font-size: 16px;
      color: #43434d;
      .ancel-title-icon {
        display: inline-block;
        width: 26px;
        height: 24px;
        background: url("../../../../assets/icon/warning.png") no-repeat;
        background-size: 100% 100%;
      }
      .cancel-title {
        color: #43434d;
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
  /deep/.el-dialog__footer {
    .el-button--medium {
      padding: 12px 23px !important;
    }

    .el-button + .el-button {
      margin-left: 20px;
    }
    .el-button--primary {
      background-color: #ff5b5b;
      border-color: #ff5b5b;
    }

    .el-button--primary:focus,
    .el-button--primary:hover {
      background: #cc2121;
      border-color: #cc2121;
      color: #fff;
    }
  }
}
</style>
<style lang="less">
.tooltip-per {
  max-width: 348px;
  div:first-child {
    font-size: 12px;
    max-height: 80px;
    overflow-y: auto;
    line-height: 20px;
  }
}
</style>
