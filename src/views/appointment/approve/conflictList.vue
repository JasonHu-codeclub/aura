/** 冲突列表 */

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
            :start-placeholder="$t('message.startTime')"
            :end-placeholder="$t('message.endTime')"
            range-separator="-"
            @change="inputChange"
            >></el-date-picker
          >
        </div>
        <!-- 名称 -->
        <div class="filter-item-box">
          <span>{{ $t("labe.name") }}：</span>
          <el-input
            type="text"
            v-model="searchForm.keyword"
            :placeholder="$t('placeholder.nameTypes')"
            @keyup.enter.native="inputChange"
            @clear="inputChange"
            clearable
          ></el-input>
        </div>
      </div>
      <div class="filter-item">
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
          width="210"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.start }}<br />{{ scope.row.end }}</span>
          </template>
        </el-table-column>
        <!-- 会议室 -->
        <el-table-column
          prop="meeting_room_name"
          :label="$t('message.room')"
          align="center"
          width="100"
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
            <span>{{ statusList[scope.row.status]["name"] }}</span>
          </template>
        </el-table-column>
        <!-- 参会人数 -->
        <el-table-column
          prop="attendence_number"
          :label="$t('message.participantsNum')"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.is_secret">*</span>
            <el-tooltip
              v-else
              :disabled="!scope.row.attendence_number"
              placement="top"
              effect="light"
              :open-delay="350"
              popper-class="tooltip-per"
            >
              <div slot="content">{{ scope.row.participant_users }}</div>
              <span :class="{ part_num: scope.row.attendence_number > 0 }">{{
                scope.row.attendence_number || "/"
              }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 发起人 -->
        <el-table-column
          prop="user_name"
          :label="$t('message.sender')"
          width="100"
          align="center"
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('message.operation')" width="140" align="center">
          <template slot-scope="scope">
            <!-- 会议状态 0=>审批中 1=》会议中，2=》未开始，3=》已结束，4=》已拒绝,5=》已取消，6=》过期未审批 -->
            <el-button
              type="text"
              v-can-appointment
              :disabled="scope.row.status == 1"
              @click="agreeRefuseMeeting(scope.row, 1)"
            >
              {{ $t("button.agree") }}
            </el-button>
            <el-button type="text" @click="detailsMeet(scope.row)" v-can-appointment>
              {{ $t("button.details") }}
            </el-button>
            <el-button
              type="text"
              v-can-appointment
              :disabled="scope.row.status == 1"
              @click="agreeRefuseMeeting(scope.row, 2)"
            >
              {{ $t("button.refuse") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :background="false"
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
      @handleClose="handleClose"
      @hanldConfirm="hanldDeleteMeeting"
    ></dialog-cancel>
  </div>
</template>
<script>
import { meetingShowApi, serviceAgreeApi, serviceRefuseApi } from "@/api/approve";
import Pagination from "@/components/Pagination";
import dialogCancel from "@/views/appointment/current-meet/components/dialogCancel";
import { mapGetters } from "vuex";
export default {
  name: "Conflict",
  components: { Pagination, dialogCancel }, // 分页
  data() {
    return {
      isCurrent: 1,
      searchForm: {
        keyword: "" // 会议名称
      },
      chooseDate: null, // 日期
      statusList: [
        // 会议状态 0=>审批中 1=》会议中，2=》未开始，3=》已结束，4=》已拒绝,5=》已取消，6=》过期未审批
        { key: 0, name: this.$t("statusList.approval") },
        { key: 1, name: this.$t("statusList.agree") },
        { key: 2, name: this.$t("statusList.hasRefused") },
        { key: 3, name: this.$t("statusList.noApproval") }
      ],
      userList: [
        { key: 1, name: this.$t("userList.originator") },
        { key: 2, name: this.$t("userList.participants") }
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
      deleteBtnLoading: false, // 弹窗确认loading
      isShowInput: false, // 拒绝理由
      operationType: null
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
    this.getApproveInfo();
    this.resizeHeight(100);
    const id = Number(this.$route.query.id);
    this.$store.dispatch("user/setEditId", { type: "conflict", id: id });
  },
  activated() {
    // 获取数据
    this.getApproveInfo();
  },
  methods: {
    inputChange() {
      this.paginationQuery.page = 1; // 当前页
      this.getApproveInfo();
    },
    // 获取列表数据
    getApproveInfo() {
      let params = {
        type: 2,
        id: this.$route.query.id,
        page: this.paginationQuery.page, // 当前页
        size: this.paginationQuery.limit,
        start_date: this.chooseDate ? this.chooseDate[0] : "",
        end_date: this.chooseDate ? this.chooseDate[1] : "",
        ...this.searchForm
      };
      this.dataLoading = true;
      meetingShowApi(params).then(res => {
        let meetings = res.data.meeting;
        if (res.meta.code == "RESP_OKAY") {
          meetings.map(v => {
            // 会议时间
            v.satrtTime = `${v.date} ${v.start}`;
            v.endTime = `${v.end_date} ${v.end}`;
            // 是否保密
            if (v.is_secret) {
              v.title = "*";
              v.categoryStr = "*";
              v.meeting_room_name = "*";
            } else {
              v.categoryStr =
                v.category == 2
                  ? `${this.categoryList[v.category]}（${this.repetitionType[v.repetition_type]}）`
                  : this.categoryList[v.category];
            }
          });
          this.myMeetingInfo = meetings;
          this.total = res.data.total; // 总条数
        }

        this.dataLoading = false;
      });
    },
    // 重置
    resetMeetingInfo() {
      this.paginationQuery = {
        page: 1, // 当前页
        limit: 10 // 每页显示条目个数
      };
      this.searchForm = {
        approve_status: "", // 状态
        keyword: "" // 会议名称
      };
      this.chooseDate = null; // 日期
      this.getApproveInfo();
    },
    // 详情
    detailsMeet(row) {
      this.$router.push({
        path: "/details",
        query: {
          menu: "conflict",
          id: row.id
        }
      });
    },
    // 同意/拒绝会议
    agreeRefuseMeeting(data, type) {
      // type 1同意 2拒绝
      this.$refs.cancel.dialogVisible = true;
      this.selectCurrentRowData = data;
      this.operationType = type;
      this.cancelTitle = this.$t("tip.ApprovalConflict");
      let content = "";
      if (type == 1) {
        content = `${this.$t("tip.agreed")}<br/>${this.$t("tip.continue")}`;
      } else {
        this.isShowInput = true;
        content = `${this.$t("tip.confirmMeet")}【${data.title}】<br/>${this.$t("tip.refuseMeet")}`;
      }
      this.cancelContent = content;
    },
    // 同意/拒绝会议请求
    hanldDeleteMeeting(value) {
      let data = this.selectCurrentRowData;
      let ajaxName = "";
      let params = {
        id: data.approve_flow_id
      };
      if (this.operationType && this.operationType == 1) {
        ajaxName = serviceAgreeApi;
      } else {
        ajaxName = serviceRefuseApi;
        params.reason = value || "";
      }
      console.log(params, "params");
      this.deleteBtnLoading = true; // 确认按钮loading
      ajaxName(params).then(res => {
        this.deleteBtnLoading = false; // 确认按钮loading
        if (res.meta.code == "RESP_OKAY") {
          this.$message({
            message: this.$t("tip.approveSuccess"),
            type: "success"
          });
          this.getApproveInfo();
          this.$refs.cancel.dialogVisible = false; // 弹框
        }
      });
    },
    // 弹窗关闭回调
    handleClose() {
      this.cancelTitle = "";
      this.cancelContent = "";
      this.isShowInput = false;
    }
  },
  beforeRouteLeave(to, from, next) {
    // 注销onresizes事件
    window.onresize = null;
    next();
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
        // background: url('../../../../assets/icon/warning.png') no-repeat;
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
