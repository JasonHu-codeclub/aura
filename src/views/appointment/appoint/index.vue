/** 预约会议页面 */

<template>
  <div class="app-wrap res-wrap">
    <!-- 搜索 -->
    <div class="filter">
      <div class="filter-item">
        <!-- 楼层 -->
        <div class="filter-item-box">
          {{ $t("labe.floor") }}：
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
        <div class="filter_item_box">
          {{ $t("labe.numberPeople") }}：
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
          {{ $t("labe.equipment") }}：
          <el-select
            v-model="searchData.equipment"
            :placeholder="$t('placeholder.equipment')"
            @change="searchMeetingRoom"
            @clear="searchMeetingRoom"
            multiple
            collapse-tags
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
        <div class="filter_item_box">
          {{ $t("labe.date") }}：
          <el-date-picker
            v-model="searchData.date"
            type="date"
            style="margin-right: 4px"
            :placeholder="$t('placeholder.date')"
            value-format="yyyy-MM-dd"
            :editable="false"
            :picker-options="searchPickerOptions"
            @change="dateChange"
            clearable
          ></el-date-picker>
          <el-time-select
            :placeholder="$t('placeholder.startTime')"
            style="margin-right: 4px"
            v-model="searchData.startTime"
            @change="startTimeChange"
            :picker-options="{
              start: this.defaultValue,
              step: '00:30',
              end: this.startTimesOptions.end,
              maxTime: searchData.endTime,
            }"
          >
          </el-time-select>
          <el-time-select
            :placeholder="$t('placeholder.endTime')"
            v-model="searchData.endTime"
            @change="endTimeChange"
            :picker-options="{
              start: this.defaultValue,
              step: '00:30',
              end: this.startTimesOptions.end,
              minTime: searchData.startTime,
            }"
          >
          </el-time-select>
        </div>
        <!-- 按钮 -->
        <div class="filter-item-box">
          <!-- 查询 -->
          <el-button
            type="primary"
            class="search"
            @click="searchMeetingRoom"
            :loading="searchBtnStatus"
            >{{ $t("button.search") }}</el-button
          >
        </div>
        <div class="filter-item-box margin_right">
          <!-- 重置 -->
          <el-button
            type="info"
            class="search"
            @click="resetMeetingRoom"
            :loading="resetBtnStatus"
            >{{ $t("button.reset") }}</el-button
          >
        </div>
        <!-- 添加预约 -->
        <div class="filter-item-box" v-can-appointment>
          <el-dropdown
            size="medium"
            split-button
            type="primary"
            @click="handleClick(1)"
            v-loading="addLoading"
            element-loading-spinner="el-icon-loading"
            class="add-dropdown"
            trigger="click"
          >
            <!-- :disabled="true" -->
            {{ $t("button.reservationSingle") }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleClick(2)">{{
                $t("button.reservationRepeat")
              }}</el-dropdown-item>
              <el-dropdown-item @click.native="handleClick(3)">{{
                $t("button.reservationNext")
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- /搜索 -->

    <!-- 表格 -->
    <div class="res-table">
      <div class="res-table-centent">
        <el-table
          ref="table"
          v-loading="tableLoading"
          :data="meetingRoomsFillter"
          style="width: 100%"
          @cell-click="clickTableCell"
          :height="tableHeight - 100"
          border
        >
          <el-table-column
            prop="name,floor_num"
            :label="$t('message.roomInfo')"
            width="240"
            align="center"
          >
            <template slot-scope="scope">
              <!-- 楼层 -->
              <div class="floor-number" style="width: 240px">
                <span class="floor-number-dec">{{ scope.row.num }}F</span>
                <i class="floor-number-icon"></i>
              </div>
              <div class="floor-content" style="width: 240px">
                <div>
                  <!-- 会议室图片 -->
                  <div class="floor-info">
                    <div class="floor-info-img" @click="roomInfo(scope.row)">
                      <i class="el-icon-circle-plus-outline plus"></i>
                      <img
                        ref="floorImg"
                        class="floor-info-image"
                        :src="Host + scope.row.image"
                        alt=""
                      />
                    </div>
                    <div class="floor-info-box">
                      <div class="floor-info-approve">
                        {{ approveLevel[scope.row.approve_level] }}
                      </div>
                      <div class="floor-info-address">
                        <i class="address-icon"></i>
                        <span class="address-text overhidden">{{
                          scope.row.mansion.name
                        }}</span>
                      </div>
                    </div>
                    <div class="floor-number-people overhid">
                      <i class="floor-people-icon"></i>
                      <span class="floor-people-dec">{{
                        scope.row.reservable
                      }}</span>
                    </div>
                  </div>
                  <!-- 会议室名字 -->
                  <div class="floor-name">{{ scope.row.name }}</div>
                  <!-- 支持的会议类型 -->
                  <div
                    class="floor-device"
                    :class="{ padding_set: scope.row.equipment.length > 0 }"
                  >
                    <span
                      v-for="(item, index) in scope.row.equipment"
                      :key="index"
                      class="floor-device-list"
                    >
                      {{ item.name }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="message" header-align="center">
            <template slot="header">
              <div class="res-bottomt">
                <span class="res-bottomt-box">
                  <i class="res-bottomt-label available"></i>
                  {{ $t("message.Bookable") }}
                </span>
                <span class="res-bottomt-box">
                  <i class="res-bottomt-label expired"></i>
                  {{ $t("message.Expired") }}
                </span>
                <span class="res-bottomt-box">
                  <i class="res-bottomt-label reserved"></i>
                  {{ $t("message.Reserved") }}
                </span>
                <span class="res-bottomt-box">
                  <i class="res-bottomt-label selected"></i>
                  {{ $t("message.Selected") }}
                </span>
              </div>
            </template>
            <template slot-scope="scope">
              <time-table-cell
                :recordSelectTime="recordSelectTime"
                :scope="scope"
                :schedule_time_lattice="schedule_time_lattice"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div
        class="res-select-time"
        :class="{ sticky: selectRowTime.time.startTime }"
      >
        <span v-if="selectRowTime.time.startTime"
          >{{ $t("message.select") }}：{{ searchData.date }}&nbsp;{{
            selectRowTime.time.startTime
          }}&nbsp;至&nbsp;{{ selectRowTime.time.endTime }}</span
        >
      </div>
    </div>
    <!-- /表格 -->

    <!-- 会议室信息 -->
    <el-dialog
      :title="$t('message.roomInfo')"
      :visible.sync="dialogVisible"
      width="700px"
      class="room-detail"
      @closed="handleClose"
    >
      <div class="room-content">
        <div class="room-content-l">
          <div class="room-list">
            <span class="room-list-labe">{{ $t("labe.roomName") }}：</span>
            <span class="room-list-value">{{ roomforms.name }}</span>
          </div>
          <div class="room-list">
            <span class="room-list-labe">{{ $t("labe.meetAddress") }}：</span>
            <span class="room-list-value"
              >{{ roomforms.mansion.name }}/{{ roomforms.floor_name }}</span
            >
          </div>
          <div class="room-list">
            <span class="room-list-labe letter-spacing"
              >{{ $t("labe.approvalLevel") }}：</span
            >
            <span class="room-list-value">{{
              approveLevel[roomforms.approve_level]
            }}</span>
          </div>
          <div class="room-list">
            <span class="room-list-labe letter-spacing"
              >{{ $t("labe.numberPeople") }}：</span
            >
            <span class="room-list-value">{{ roomforms.reservable }}</span>
          </div>
          <div class="room-list">
            <span class="room-list-labe"
              >{{ $t("labe.equipmentOfroom") }}：</span
            >
            <span class="room-list-value">{{ roomforms.mansioDec }}</span>
          </div>
        </div>

        <div
          class="room-content-r"
          :style="{ backgroundImage: 'url(' + roomforms.image + ')' }"
        ></div>
      </div>
    </el-dialog>

    <!-- 重复预约，跨日预约 -->
    <el-dialog
      width="520px"
      :title="appointmentTitle"
      :visible.sync="repeatNexdayDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="handleCloseAppointment"
    >
      <div class="appointment-box">
        <div class="appointment-repeat" v-if="reservationType == 2">
          <div class="appointment-box-item">
            <span
              ><i class="appo-labe-Symbol">*</i
              >{{ $t("labe.repeatType") }}：</span
            >
            <el-select
              v-model="repeatForm.repeatType"
              class="edit-box-input"
              @change="setStatus(repeatForm.repeatType, 'repeatType')"
              clearable
            >
              <el-option
                v-for="item in repeatTypeList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="appointment-err" v-if="error.repeatType.isFocus">{{
              $t("placeholder.selectType")
            }}</span>
          </div>
          <div class="appointment-box-item">
            <span
              ><i class="appo-labe-Symbol">*</i
              >{{ $t("labe.repeatTime") }}：</span
            >
            <el-date-picker
              v-model="repeatForm.repeatDate"
              type="date"
              class="edit-box-input"
              value-format="yyyy-MM-dd"
              :picker-options="repetPickerOptions"
              :placeholder="$t('message.dates')"
              @change="setStatus(repeatForm.repeatDate, 'repeatDate')"
              clearable
              >></el-date-picker
            >
            <span class="appointment-err" v-if="error.repeatDate.isFocus">{{
              $t("tip.validateRepeatTime")
            }}</span>
            <span class="appointment-tips">{{ $t("message.term") }}</span>
          </div>
        </div>
        <!-- 跨日时间设置 -->
        <div class="appointment-next" v-if="reservationType == 3">
          <div class="appointment-box-item">
            <span class="appointment-next-labe"
              ><i class="appo-labe-Symbol">*</i
              >{{ $t("message.startTime") }}：</span
            >
            <!-- 开始日期 -->
            <el-date-picker
              v-model="nextDateForm.nextStartDate"
              type="date"
              class="edit-nex-input"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              :placeholder="$t('message.dates')"
              @change="
                selectNextStartDate(nextDateForm.nextStartDate, 'nextStartDate')
              "
              >></el-date-picker
            >
            <!-- 开始时间 -->
            <el-time-select
              class="edit-nex-select"
              :placeholder="$t('message.startTime')"
              v-model="nextDateForm.nextStartTime"
              :picker-options="startTimesOptions"
              @change="
                selectNextTimes(nextDateForm.nextStartTime, 'nextStartTime')
              "
            >
            </el-time-select>
            <span
              class="appointment-err start-date"
              v-if="error.nextStartDate.isFocus"
              >{{ $t("message.selsectDate") }}</span
            >
            <span
              class="appointment-err start-time"
              v-if="error.nextStartTime.isFocus"
              >{{ $t("message.selectStartTime") }}</span
            >
          </div>
          <div class="appointment-box-item">
            <span class="appointment-next-labe"
              ><i class="appo-labe-Symbol">*</i
              >{{ $t("message.endTime") }}：</span
            >
            <!-- 结束日期 -->
            <el-date-picker
              v-model="nextDateForm.nextEndDate"
              type="date"
              class="edit-nex-input"
              value-format="yyyy-MM-dd"
              :picker-options="endPickerOptions"
              :placeholder="$t('message.dates')"
              @change="
                selectNextEndDate(nextDateForm.nextEndDate, 'nextEndDate')
              "
              clearable
              >></el-date-picker
            >
            <!-- 结束时间 -->
            <el-time-select
              class="edit-nex-select"
              :placeholder="$t('message.endTime')"
              v-model="nextDateForm.nextEndTime"
              :picker-options="endTimesOptions"
              @change="
                selectNextEndTime(nextDateForm.nextEndTime, 'nextEndTime')
              "
              clearable
            >
            </el-time-select>
            <span
              class="appointment-err end-date"
              v-if="error.nextEndDate.isFocus"
              >{{ $t("message.selsectDate") }}</span
            >
            <span
              class="appointment-err end-time"
              v-if="error.nextEndTime.isFocus"
              >{{ $t("message.selectEndTime") }}</span
            >
          </div>
        </div>
      </div>
      <div class="dialog-bottom">
        <div class="appointment-next-tips" v-if="reservationType == 3">
          {{ $t("message.nextTips") }}
        </div>
        <el-button @click="repeatNexdayDialog = false">{{
          $t("button.cancel")
        }}</el-button>
        <el-button
          type="primary"
          :loading="confirmLoading"
          @click="confirmReservation"
          >{{ $t("button.confirm") }}</el-button
        >
      </div>
    </el-dialog>

    <!-- 冲突预约提示 -->
    <dialog-cancel
      ref="conflict"
      :content="approveContent"
      :title="approveTitle"
      :btnLoading="approveBtnLoading"
      @handleClose="handleApproveClose"
      @hanldConfirm="hanldApproveMeeting"
    ></dialog-cancel>

    <!-- 预约发送邮件通知弹窗 -->
    <el-dialog
      width="400px"
      :title="
        dataType == 2 ? $t('message.addTeacher') : $t('message.checkTeacher')
      "
      :visible.sync="innerVisible"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="res-dialog"
    >
      <div class="search-group" v-show="dataType === 2">
        <div class="search-group-item">
          {{ $t("labe.keyword") }}：
          <el-input
            class="inline-input"
            v-model="searchName"
            clearable
            :placeholder="$t('placeholder.departmentName')"
            @keyup.enter.native="searchHandle"
            @clear="clearHandle"
          ></el-input>
        </div>
        <el-button class="search-btn" type="primary" @click="searchHandle">{{
          $t("button.search")
        }}</el-button>
      </div>
      <div class="df join-content">
        <div class="left" v-show="dataType === 2">
          <el-tree
            class="f1"
            :data="queryPeople"
            :props="defaultProps"
            show-checkbox
            :default-expand-all="isExpand"
            :filter-node-method="filterNode"
            :default-expanded-keys="defaultChecked"
            ref="tree"
            node-key="id"
            @check="handleNodeClick"
            highlight-current
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <i class="el-icon-folder-opened" v-if="!node.isLeaf"></i>
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
        <div class="right">
          <el-table :data="participantGuids" border style="width: 100%">
            <!-- 序号 -->
            <el-table-column
              :label="$t('message.serial')"
              type="index"
              width="60"
              align="center"
            ></el-table-column>
            <!-- 姓名 -->
            <el-table-column
              prop="name"
              :label="$t('message.fullName')"
              align="center"
              width="120"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.name || "/" }}</span>
                <span v-if="participant_confirm == '1'">
                  <div
                    class="button1"
                    style="background-color: #45b574"
                    v-if="scope.row.is_agree == 1"
                  >
                    {{ $t("mettingStatus")[1] }}
                  </div>
                  <div
                    class="button1"
                    style="background-color: #f46e5c"
                    v-if="scope.row.is_agree == 2"
                  >
                    {{ $t("mettingStatus")[2] }}
                  </div>
                  <!---->
                  <div class="button1" v-if="scope.row.is_agree == 0">
                    {{ $t("mettingStatus")[0] }}
                  </div>
                </span>
              </template>
            </el-table-column>
            <!-- 部门 -->
            <el-table-column
              prop="department_name"
              :label="$t('labe.Department')"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.department_name || "/" }}</span>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
              v-if="dataType === 2"
              :label="$t('message.operation')"
              align="center"
              width="80"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  class="right-delete"
                  @click="deleteDep(scope.$index)"
                  :disabled="dataType === 1"
                >
                  {{ $t("button.delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-right: 20px" @click="innerVisible = false">{{
          $t("button.cancel")
        }}</el-button>
        <el-button
          v-show="dataType === 2"
          type="primary"
          @click="addMeetingPeople"
          >{{ $t("button.confirm") }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dialogCancel from "./components/dialogCancel";
import dayjs from "dayjs";
import TimeTableCell from "./components/time-table-cell";
import { imgBaseUrl } from "@/utils/varible";
import { mapGetters } from "vuex";
import Cookies from "js-cookie";
import {
  getSystemInfoApi,
  getStatusApi,
  getTimeConfigApi,
  getAppointmentApi,
  getEquipmentApi,
  getMansionFloorApi,
  getReservableApi,
  appointmentApi,
  conflictValidatorApi,
} from "@api/appoint";
export default {
  name: "Home",
  components: {
    TimeTableCell,
    dialogCancel,
  },
  data() {
    return {
      schedule_time_lattice: 15,
      dialogVisible: false, // 会议室信息弹窗
      repeatNexdayDialog: false, // 重复,跨日预约弹窗
      approveDialog: false, // 冲突预约提示
      approveTitle: "", // 冲突预约标题
      approveContent: "", // 冲突提示内容
      approveBtnLoading: false, // 冲突预按钮loading
      appointmentTitle: "", // 预约冲突弹窗,
      cancelContent: "", // 预约冲突弹窗内容
      reservationType: "", // 预约类型
      repeatForm: {
        // 重复预约
        repeatType: "", // 重复类型
        repeatDate: "", // 重复截止日
      },
      nextDateForm: {
        // 跨日预约
        nextStartDate: "",
        nextEndDate: "",
        nextStartTime: "", // 开始时间
        nextEndTime: "", // 结束时间
      },
      // 重复预约日期范围控制
      repetPickerOptions: {
        disabledDate: this.disabledDateRepet,
      },
      // 顶部查询日期范围控制
      searchPickerOptions: {
        disabledDate: this.disabledDateRepet,
      },
      // 跨日预约开始日期范围控制
      pickerOptions: {
        disabledDate: this.disabledDateRepet,
      },
      // 跨日预约结束日期范围控制
      endPickerOptions: {
        disabledDate: this.disabledDateRepet,
      },
      startTimesOptions: {
        // 会议时间 开始时间配置
        start: "08:00",
        step: "00:30",
        end: "19:30:00",
        minTime: "",
        maxTime: "",
      },
      endTimesOptions: {
        // 会议时间 结束时间配置
        start: "08:30",
        step: "00:30",
        end: "20:00:00",
        minTime: "",
      },
      // 重复预约类型
      repeatTypeList: [
        { name: this.$t("repeatTypeList.daily"), value: 1 },
        { name: this.$t("repeatTypeList.weeks"), value: 2 },
        { name: this.$t("repeatTypeList.month"), value: 3 },
      ],
      roomforms: {
        mansion: {
          name: "",
        },
        mansioDec: "",
      }, // 会议室信息
      Host: imgBaseUrl,
      tableLoading: false,
      btnLoading: false,
      searchData: {
        floor: [], // 楼层
        peopleNum: "", // 人数
        equipment: "", // 设备
        date: dayjs().format("YYYY-MM-DD"), // 选择时间
        startTime: "", //开始时间
        endTime: "", //结束时间
      },
      optionsFloor: [], // 大厦楼层
      peopleNumList: [], // 容纳人数
      // tableHeight: 50,
      citys: [], // 已选择城市
      chooseCity: "",
      building: [], // 获取的大厦数组
      chooseBuilding: "",
      category: [], // 获取的分类数组
      chooseCategory: "", // 选择容纳人数
      status: [], // 获取状态数组
      equipmentList: [], // 设备
      chooseStatus: "", // 选择状态
      chooseDate: dayjs().format("YYYY-MM-DD"), // 选择时间
      meetingRooms: [], // 获取的会议室信息,
      props: {
        // 楼层级联配置
        value: "id",
        label: "name",
        children: "floor",
      },
      approveLevel: [
        this.$t("approveLevel.noApproval"),
        this.$t("approveLevel.oneApproval"),
        this.$t("approveLevel.twoApproval"),
      ],
      currentPage4: 4,
      selectTimes: [],
      selectRowTime: {
        id: null,
        time: {},
      },
      selectRoomData: {}, // 选择会议室进行预约,
      searchBtnStatus: false, // 搜索按钮状态
      resetBtnStatus: false, // 重置按钮状态
      pollingParams: {
        schedule_info: "1",
        city_guid: "",
        mansion_guid: "",
        number_groups: "",
        status_groups: "",
        day: "",
        meeting_room_schedule: "",
        functional_display: "",
        virtual_: "all",
      },
      error: {
        // 验证提示
        repeatType: { isFocus: false }, // 重复类型
        repeatDate: { isFocus: false }, // 重复截止日
        nextStartDate: { isFocus: false }, // 跨日开始日期
        nextStartTime: { isFocus: false }, // 跨日开始时间
        nextEndDate: { isFocus: false }, // 跨日结束日期
        nextEndTime: { isFocus: false }, // 跨日结束时间
      },
      isPass: false,
      addLoading: false,
      confirmLoading: false, // 确定预约
      timeConfig: {}, // 可预约时间段
      appStartTimes: "", // 预约开始时间
      appEndTimes: "", // 预约结束时间
      defaultValue: "", //设置开始起始时间
      innerVisible: false, // 设置弹窗是否可见
    };
  },
  created() {
    // 设置搜索起止时间
    this.setTimeCrrentTime();
  },
  computed: {
    ...mapGetters(["userInfo"]),
    meetingRoomsFillter() {
      let meetingArr = []; // 二维数组-记录每个会议室预定的会议
      let continuity = true; // 会议的边界
      let count = 0; // 记录一个会议室的场次
      this.meetingRooms.map((res, idx) => {
        res.day = this.searchData.date;
        // 筛选出每个预约会议
        res.message.map((value, index) => {
          if (value.status === 1) {
            let chils = [];
            chils.push(idx);
            chils.push(value.meeting[0]["id"]);
            chils.push(index);
            if (
              meetingArr[count] &&
              meetingArr[count][1] === value.meeting[0]["id"]
            ) {
              meetingArr[count].push(index);
            } else {
              if (meetingArr.length > 0) {
                count++;
              }
              meetingArr[count] = chils;
            }
            // 会议时长单位
            value.long = `${value.long}h`;
          }
        });

        meetingArr.map((val) => {
          if (val.length > 4) {
            val.splice(3, val.length - 3, val[val.length - 1]);
          }
        });
      });
      /**
       * 后台给出的数据没有场次边界
       *
       */
      // 给每场会议标注开始和结束位置
      this.meetingRooms.map((v, i) => {
        meetingArr.map((m) => {
          if (i === m[0]) {
            v.message[m[2]].start = true;
            if (m.length === 4) {
              v.message[m[3]].end = true;
            } else {
              // v.message[m[1]].end = true
              v.message[m[2]].widthMin = true;
            }
          }
        });
      });
      return this.meetingRooms;
    },
    // 根据reservationType返回不同的对话框标题
    dialogTitle() {
      if (this.reservationType === 1) {
        return this.$t("message.dialogTitle1");
      } else if (this.reservationType === 2) {
        return this.$t("message.dialogTitle2");
      } else if (this.reservationType === 3) {
        return this.$t("message.dialogTitle3");
      }
    },
  },
  watch: {},
  mounted() {
    const that = this;
    // 大厦楼层
    this.getFloorList();
    // 获取时间规则
    this.getTimeConfig();
    // 获取容纳人数
    this.getReservableList();
    // 获取设备列表
    this.getEquipmentList();
    // 会议室列表
    this.searchMeetingRoom();
    this.timer = setInterval(that.pollingSearchRoom, 1000 * 60, true);
    this.resizeHeight(100);
  },
  activated() {
    let that = this;
    this.resizeHeight(100);
    this.searchMeetingRoom();
    this.timer = setInterval(that.pollingSearchRoom, 1000 * 60, true);
  },
  methods: {
    // 设置搜索起止时间
    setTimeCrrentTime() {
      let times =
        new Date().getMinutes() == "00"
          ? (this.defaultValue = new Date().getHours() + ":" + "00")
          : new Date().getMinutes() < 30
          ? (this.defaultValue = new Date().getHours() + ":" + "30")
          : (this.defaultValue = new Date().getHours() + 1 + ":" + "00"); //当前时间
      this.defaultValue = times;
    },
    // 冲突弹窗关闭
    handleApproveClose() {
      this.cancelTitle = "";
      this.cancelContent = "";
    },
    // 大厦信息，楼层
    async getFloorList() {
      const result = await getMansionFloorApi();
      let data = result.data.mansion;
      if (data.length > 1) {
        data.unshift({ id: "", name: this.$t("public.all") });
      }
      this.optionsFloor = data;
    },
    // 获取设备
    async getEquipmentList() {
      const result = await getEquipmentApi();
      this.equipmentList = result.data.equipments;
    },
    // 点击表格
    clickTableCell(row, column, cell, event) {},
    // 记录选择的时间
    recordSelectTime(obj, scope) {
      if (
        this.selectRowTime.id !== "" &&
        this.selectRowTime.id !== scope.row.id
      ) {
        this.selectRowTime.time.startIndex = null;
        this.selectRowTime.time.endIndex = null;
        // TODO 清空其他行时间
      }
      this.selectRowTime.time = obj;
      this.selectRowTime.id = scope.row.id;
      this.selectRoomData = scope.row;
    },

    // 单次预约，重复/跨日预约弹窗
    handleClick(num) {
      this.reservationType = num;
      this.innerVisible = true; //设置弹窗可见
      if (!this.selectRoomData.day || !this.selectRowTime.time.startTime) {
        this.$message({
          message: this.$t("message.selectTime"),
          type: "warning",
        });
        return;
      }
      if (num === 1) {
        this.conflictValidator();
      } else if (num === 2) {
        this.repeatNexdayDialog = true;
        this.appointmentTitle = this.$t("public.repeatReservation");
        this.repetPickerOptions.disabledDate = this.setEndPickerOptions; // 设置重复预约日期选择范围
      } else {
        this.repeatNexdayDialog = true;
        this.appointmentTitle = this.$t("public.crossReservation");
        this.nextDateForm.nextStartDate = this.selectRoomData.day || "";
        this.nextDateForm.nextStartTime =
          this.selectRowTime.time.startTime || "";
        this.nextDateForm.nextEndDate = this.selectRoomData.day || "";
        this.nextDateForm.nextEndTime = this.selectRowTime.time.endTime || "";
        this.pickerOptions.disabledDate = this.setEndPickerOptions; // 设置跨日开始日期选择范围
        this.endPickerOptions.disabledDate = this.setEndPickerOptions; // 设置跨日结束日期选择范围
        this.initTime();
        this.setRange();
      }
    },
    // 跨日开始日期
    selectNextStartDate(dates, names) {
      this.setStatus(dates, names);
      this.nextDateForm.nextStartTime = "";
      this.nextDateForm.nextEndDate = "";
      this.nextDateForm.nextEndTime = "";
      this.initTime();
      this.endPickerOptions.disabledDate = this.setEndPickerOptions;
    },
    // 设置结束日期选择范围
    setEndPickerOptions(time) {
      let nextStartDate = dayjs(this.searchData.date).valueOf();
      let startDate = Date.now();
      return (
        time.getTime() > startDate + 24 * 60 * 60 * 1000 * 179 ||
        time.getTime() < nextStartDate
      );
    },
    // 跨日开始时间
    selectNextTimes(time, names) {
      // 校验时间
      this.setStatus(time, names);
      // 重置时间显示
      this.initTime();
      // 判断开始结束时间大小
      this.setRange();
    },
    // 判断开始结束时间选择大小范围
    setRange() {
      let startDay = dayjs(this.nextDateForm.nextStartDate).valueOf(); // 开始日期
      let endDay = dayjs(this.nextDateForm.nextEndDate).valueOf(); // 结束日期
      let startHour = this.nextDateForm.nextStartTime.split(":")[0]; // 开始时间-小时
      let startMinute = this.nextDateForm.nextStartTime.split(":")[1]; // 开始时间-分钟
      let endHour = this.nextDateForm.nextEndTime
        ? this.nextDateForm.nextEndTime.split(":")[0]
        : ""; // 结束时间-小时
      let endMinute = this.nextDateForm.nextEndTime
        ? this.nextDateForm.nextEndTime.split(":")[1]
        : ""; // 结束时间-分钟
      if (startDay == endDay) {
        // 开始结束日期是否相同
        this.endTimesOptions.minTime = this.nextDateForm.nextStartTime;
        if (
          startHour > endHour ||
          (startHour === endHour && startMinute >= endMinute)
        ) {
          // 当前开始结束小时分钟判断
          this.nextDateForm.nextEndTime = "";
        }
      } else {
        this.endTimesOptions.minTime = "";
      }
    },
    // 跨日结束日期
    selectNextEndDate(dates, names) {
      this.setStatus(dates, names);
      this.nextDateForm.nextEndTime = "";
      let start = dayjs(this.nextDateForm.nextStartDate).valueOf(); // 开始日期
      let end = dayjs(this.nextDateForm.nextEndDate).valueOf(); // 结束日期
      if (start == end) {
        this.endTimesOptions.minTime = this.nextDateForm.nextStartTime;
      } else {
        this.endTimesOptions.minTime = "";
        this.startTimesOptions.maxTime = "";
      }
    },
    // 初始化跨日预约开始、结束时间选择范围
    initTime() {
      // 限制开始时间选择范围
      let selectDate = this.nextDateForm.nextStartDate; // 被选中的日期
      const date = dayjs().format("YYYY-MM-DD HH:mm:ss");
      const dateCurrent = date.split(" ")[0];
      if (selectDate === dateCurrent) {
        const times = date.split(" ")[1];
        const hour = times.substring(0, 3);
        const minute = times.split(":")[1];
        const min = minute >= 30 ? 30 : "00";
        this.startTimesOptions.minTime = `${hour}${min}`; ///`${hour}${min}`
        // 限制结束时间选择范围
        let selectTime = this.nextDateForm.nextStartTime; // 获取开始时间（时分）
        this.endTimesOptions.minTime = selectTime
          ? selectTime
          : this.startTimesOptions.minTime;
      } else {
        this.startTimesOptions.minTime = "";
        this.endTimesOptions.minTime = "";
      }
    },

    // 跨日结束时间
    selectNextEndTime(times, names) {
      this.setStatus(times, names);
    },
    // 选择重复预约截止日期
    selectRepeatEndTime(value) {
      this.setStatus(this.repeatForm.repeatType, strType);
    },
    // 获取时间规则
    getTimeConfig() {
      getTimeConfigApi().then((res) => {
        this.timeConfig = res.data.time_rule;
        let start = this.timeConfig.start;
        let end = this.timeConfig.end; //this.timeConfig.end.split(':')[0]=='00' ? '24:00' : this.timeConfig.end
        this.endTimesOptions.start = start;
        this.endTimesOptions.end = end;
        // this.startTimesOptions.maxTime = end
        this.startTimesOptions.start = start;
        this.startTimesOptions.end = end;
      });
    },
    // 重复，跨日时间设置弹框确认预约
    confirmReservation() {
      let num = this.reservationType;
      this.isPass = true;
      if (num == 2) {
        this.setStatus(this.repeatForm.repeatType, "repeatType");
        this.setStatus(this.repeatForm.repeatDate, "repeatDate");
      } else if (num == 3) {
        this.setStatus(this.nextDateForm.nextStartDate, "nextStartDate");
        this.setStatus(this.nextDateForm.nextStartTime, "nextStartTime");
        this.setStatus(this.nextDateForm.nextEndDate, "nextEndDate");
        this.setStatus(this.nextDateForm.nextEndTime, "nextEndTime");
      }
      if (!this.isPass) {
        return;
      }
      console.log(123);
      this.conflictValidator();
    },

    // 输入框校验
    setStatus(value, name, index) {
      if (!value) {
        this.isPass = false;
        this.error[name].isFocus = true;
      } else {
        this.error[name].isFocus = false;
      }
      this.error = { ...this.error };
    },
    // 预约冲突判断
    async conflictValidator() {
      let repeType = "";
      let endDate = "";
      this.approveCount = 0;
      this.appStartTimes = `${this.selectRoomData.day} ${this.timesHandle(
        this.selectRowTime.time.startTime
      )}`;
      this.appEndTimes = `${this.selectRoomData.day} ${this.timesHandle(
        this.selectRowTime.time.endTime
      )}`;
      this.approveTitle = this.$t("message.conflictTips"); // 冲突弹窗title
      if (this.reservationType === 2) {
        // 重复预约
        repeType = this.repeatForm.repeatType;
        endDate = this.repeatForm.repeatDate;
      }
      if (this.reservationType === 3) {
        // 跨日预约
        this.appStartTimes = `${
          this.nextDateForm.nextStartDate
        } ${this.timesHandle(this.nextDateForm.nextStartTime)}`;
        this.appEndTimes = `${this.nextDateForm.nextEndDate} ${this.timesHandle(
          this.nextDateForm.nextEndTime
        )}`;
      }
      let dataJson = {
        start: this.appStartTimes, // date	预约最近一场开始时间
        end: this.appEndTimes, // date	预约最近一场结束时间
        meeting_room_id: this.selectRoomData.id, // number	会议室
        category: this.reservationType, // number	预约类型 1单次预约 2重复预约 3跨日预约
        repetition_type: repeType || null, // number	重复类型 1=》每日，2=》每周，3=》每月
        repetition_end_date: endDate || null, // date	重复会议截止日期
      };
      this.confirmLoading = true;
      // return

      if (this.selectRoomData.approve_level != 0) {
        // 会议需要审批时调用判断冲突接口
        this.addLoading = true;
        this.confirmLoading = true;
        const result = await conflictValidatorApi(dataJson);
        this.addLoading = false;
        this.confirmLoading = false;
        this.approveCount = result.data.count; // 冲突场次
        this.approveMessage = this.$t("public.waitingApproval");
        if (result.data.count) {
          this.$refs.conflict.dialogVisible = true;
          this.approveContent = `${this.selectRoomData.name}${this.$t(
            "message.room"
          )}，${this.$t("public.timePeriod")}${result.data.count}${this.$t(
            "public.noApproval"
          )}，${this.$t("public.continueAppointment")}`;
        } else {
          this.addReservation();
        }
      } else {
        this.approveMessage = this.$t("public.successful");
        this.addReservation();
      }
    },
    // 时间末端处理
    timesHandle(times) {
      let timeStr = times == "24:00" ? "23:59:59" : times + ":00";
      return timeStr;
    },
    // 冲突弹窗确认按钮
    hanldApproveMeeting() {
      this.addReservation();
    },
    // 添加预约
    addReservation() {
      let repeType = "";
      let endDate = "";
      if (this.reservationType === 2) {
        repeType = this.repeatForm.repeatType;
        endDate = this.repeatForm.repeatDate;
      }
      const data = {
        meeting_room_id: this.selectRoomData.id, // number	会议室id
        category: this.reservationType, // number	1 单次预约 2重复预约 3跨日预约
        start: this.appStartTimes, // string	会议预约开始时间
        end: this.appEndTimes, // string	会议预约结束时间（category=2时结束时间只传当天截止））
        is_conflict: this.approveCount ? 1 : 0, // number	是否冲突 0否 1是
        conflict_count: this.approveCount, // number 默认0，有冲突数量加进来
      };
      if (repeType && endDate) {
        data.repetition_type = repeType; // 当category=2时才需要传 会议重复类型 1=》每日，2=》每周，3=》每月
        data.repetition_end_date = endDate; // 当category=2时才需要传 会议重复截止时间
      }
      this.addLoading = true;
      this.confirmLoading = true;
      if (this.approveCount) this.approveBtnLoading = true;
      // 确定预约
      appointmentApi(data)
        .then((res) => {
          this.addLoading = false;
          this.confirmLoading = false;
          this.approveBtnLoading = false;
          if (res.meta.code == "RESP_OKAY") {
            this.$message({
              message: this.approveMessage,
              type: "success",
            });
            // 更新会议列表
            this.searchMeetingRoom();
            this.resetData();
          }
        })
        .catch(() => {});
    },
    // 重置已选择时间数据
    resetData() {
      this.selectRowTime.time.startIndex = null;
      this.selectRowTime.time.endIndex = null;
      this.selectRowTime = {
        id: null,
        time: {},
      };
      this.selectRoomData = {};
      this.repeatNexdayDialog = false; // 重复跨日弹窗
      this.$refs.conflict.dialogVisible = false; //  冲突弹窗
      this.appStartTimes = ""; // 会议预约开始时间
      this.appEndTimes = ""; // 会议预约结束时间

      this.handleCloseAppointment();
    },
    // 获取容纳人数数据
    async getReservableList() {
      const result = await getReservableApi();
      this.peopleNumList = [
        { name: this.$t("message.all"), guid: null },
        ...result.data.reservable,
      ];
    },
    // 获取状态数据
    async getStatusData() {
      const result = await getStatusApi();
      if (result.ret === "0") {
        const i18nStatus = result.data.map((element) => {
          if (element.guid === 0) {
            // 空闲中
            return {
              guid: element.guid,
              name: this.$t("message.inAvailable"),
            };
          } else if (element.guid === 1) {
            // 准备中
            return {
              guid: element.guid,
              name: this.$t("message.inPreparing"),
            };
          } else if (element.guid === 2) {
            // 使用中
            return {
              guid: element.guid,
              name: this.$t("message.inUse"),
            };
          } else if (element.guid === 3) {
            // 维护中
            return {
              guid: element.guid,
              name: this.$t("message.inMaintenance"),
            };
          }
        });
        this.status = [
          { name: this.$t("message.all"), guid: null },
          ...i18nStatus,
        ];
      }
    },
    // 搜索会议室
    async searchMeetingRoom(type) {
      let params = {
        date: this.searchData.date, // 日期
        start_time: this.searchData.startTime, //开始时间
        end_time: this.searchData.endTime, //结束时间
        mansion_id: this.searchData.floor[0], // 大厦id
        floor_id: this.searchData.floor[1], //楼层id
        reservable: this.searchData.peopleNum, // 人数
        equipment: this.searchData.equipment, // 设备id
      };
      this.tableLoading = true;
      this.searchBtnStatus = true;
      const result = await getAppointmentApi(params);
      this.meetingRooms = result.data.meeting_rooms;
      this.schedule_time_lattice = result.data.schedule_time_lattice;
      console.log(this.schedule_time_lattice);

      // 清除选择的时间印记
      this.selectRowTime.time.startIndex = null;
      this.selectRowTime.time.endIndex = null;
      this.tableLoading = false;
      this.searchBtnStatus = false;
    },
    // 轮询会议室
    async pollingSearchRoom(type) {
      this.setTimeCrrentTime();
      let params = {
        date: this.searchData.date, // 日期
        start_time: this.searchData.startTime, //开始时间
        end_time: this.searchData.endTime, //结束时间
        mansion_id: this.searchData.floor[0], // 大厦id
        floor_id: this.searchData.floor[1], //楼层id
        reservable: this.searchData.peopleNum, // 人数
        equipment: this.searchData.equipment, // 设备id
      };
      const result = await getAppointmentApi(params);
      this.meetingRooms = result.data.meeting_rooms;
      // 如果是预约成功后的刷新
      if (type === "reserveSuccess") {
        // 清除选择的时间印记
        this.selectRowTime.time.startIndex = null;
        this.selectRowTime.time.endIndex = null;
      }
    },
    setTimesOptions() {
      // let msg = this.meetingRooms[0]['message']
      let leng = msg.length;

      // let endHour = timeConfig.end.split(':')[0] == '00' ? '59:00' : this.timeConfig.end
      this.endTimesOptions.start = this.timeConfig.start;
      this.endTimesOptions.end = this.timeConfig.end;
      this.startTimesOptions.start = this.timeConfig.start;
      this.startTimesOptions.end = this.timeConfig.end;
    },
    // 重置搜索关键字
    resetMeetingRoom() {
      this.searchData = {
        floor: [], // 楼层
        peopleNum: "", // 人数
        equipment: "", // 设备
        date: dayjs().format("YYYY-MM-DD"), // 选择时间
        start_time: "", //开始时间
        end_time: "", //结束时间
      };
      this.searchMeetingRoom();
    },
    // 选择日期
    dateChange(value) {
      if (value !== dayjs().format("YYYY-MM-DD")) {
        this.defaultValue = this.startTimesOptions.start;
      } else {
        // this.defaultValue = this.setTimeCrrentTime()//this.currentTime;
        this.setTimeCrrentTime();
      }
      let that = this;
      setTimeout(() => {
        that.searchData.date = value || dayjs().format("YYYY-MM-DD");
        that.searchMeetingRoom();
      }, 100);
    },
    //选择开始时间
    startTimeChange(value) {
      if (value > this.searchData.endTime) {
        this.searchData.endTime = "";
      }
      let that = this;
      setTimeout(() => {
        that.searchData.startTime = value;
        that.searchMeetingRoom();
      }, 100);
    },
    //选择结束时间
    endTimeChange(value) {
      let that = this;
      setTimeout(() => {
        that.searchData.endTime = value;
        that.searchMeetingRoom();
      }, 100);
    },
    // 分钟小时转换
    handleNum(num) {
      let str =
        Number(num) / 60 > 1
          ? `${Number(num) / 60}h`
          : `${num}${this.$t("public.minutes")}`;
      return str;
    },
    // 会议室详情
    roomInfo(row) {
      this.dialogVisible = true;
      this.roomforms = JSON.parse(JSON.stringify(row));
      this.roomforms.image = this.Host + this.roomforms.image;
      let str = "";
      this.roomforms.equipment &&
        this.roomforms.equipment.forEach((item) => {
          str = str ? str + "，" + item.name : item.name;
        });
      this.roomforms.mansioDec = str || this.$t("public.no");
    },
    handleClose() {},
    handleCloseAppointment() {
      this.repeatForm = {
        // 重复预约
        repeatType: "", // 重复类型
        repeatDate: "", // 重复截止日
      };
      this.nextDateForm = {
        // 跨日预约
        nextStartDate: "",
        nextEndDate: "",
        nextStartTime: "", // 开始时间
        nextEndTime: "", // 结束时间
      };
      this.error = {
        // 验证提示
        repeatType: { isFocus: false }, // 重复类型
        repeatDate: { isFocus: false }, // 重复截止日
        nextStartDate: { isFocus: false }, // 跨日开始日期
        nextStartTime: { isFocus: false }, // 跨日开始时间
        nextEndDate: { isFocus: false }, // 跨日结束日期
        nextEndTime: { isFocus: false }, // 跨日结束时间
      };
      this.confirmLoading = false;
    },
    // 最长重复时间段为180天 ，禁用开始日期之前的日期
    disabledDateRepet(time) {
      let startDate = Date.now();
      return (
        time.getTime() > startDate + 24 * 60 * 60 * 1000 * 179 ||
        time.getTime() < startDate - 24 * 60 * 60 * 1000
      );
    },
  },
  beforeDestroy() {
    // 销毁定时器
    clearInterval(this.timer);
    // 注销onresizes事件
    window.onresize = null;
  },
  beforeRouteLeave(to, from, next) {
    // 销毁定时器
    clearInterval(this.timer);
    // 注销onresizes事件
    window.onresize = null;
    next();
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/variables.less";
.filter {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 20px 0 0;
  .filter-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    /deep/.filter-cascader {
      width: 220px;
      .el-input {
        width: 220px;
        .el-input__inner {
          width: 220px;
        }
      }
    }
  }
  .filter-item-box {
    display: flex;
    margin: 0 20px 20px 0;
    align-items: center;
    font-size: 14px;
    /deep/.el-input__inner {
      width: 170px;
    }
    /deep/.el-button {
      width: auto;
      font-size: 14px;
    }
    .item-right-btn {
      width: auto;
    }
    /deep/.el-input,
    .el-input__inner {
      width: 170px;
      padding-right: 10px;
    }
  }
  .filter_item_box {
    display: flex;
    margin: 0 20px 20px 0;
    align-items: center;
    font-size: 14px;
    /deep/.el-input__inner {
      width: 140px;
    }
    /deep/.el-input,
    .el-input__inner {
      width: 140px;
      padding-right: 10px;
    }
  }
  .margin_right {
    margin-right: 35px;
  }
}
.res-table {
  // overflow-y: hidden;
  // overflow-x: hidden;
  .res-table-centent {
    overflow-x: auto;
    /deep/.el-table {
      min-width: 800px;
    }
    /deep/.el-table--medium th {
      padding: 0;
    }
  }
  /deep/.el-table--medium td {
    padding: 0;
  }
  /deep/.el-table .cell {
    padding: 0;
    font-weight: normal;
  }
  .res-select-time {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    color: #5473e8;
    font-size: 14px;
    text-align: center;
    padding: 20px 0;
    background: #fff;
    z-index: 1000;
  }
  .sticky {
    position: sticky;
    bottom: 0;
    box-shadow: 0 -4px 13px -3px #e8e8e8;
  }
}
// .floor-name {
//   margin: 18px 0 4px;
// }
.floor-number {
  position: absolute;
  top: 0;
  right: 0;
  width: 38px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  color: #333;
  .floor-number-dec {
    position: absolute;
    top: 2px;
    right: 3px;
    z-index: 100;
    color: #fff;
    transform: rotate(45deg);
    font-size: 12px;
  }
  .floor-number-icon {
    content: "";
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

.floor-number-people {
  position: absolute;
  top: 6px;
  right: 40px;
  max-width: 80px;
  font-size: 12px;
  overflow: hidden;
  height: 22px;
  .floor-people-icon {
    display: inline-block;
    width: 14px;
    height: 12px;
    background: url("../../../assets/icon/user_count.png") no-repeat;
    background-size: contain;
    margin-right: 4px;
  }
  .floor-people-dec {
    color: #b6bdcc;
  }
}

.floor-content {
  min-height: 72px;
  .floor-name {
    font-size: 16px;
    color: #43434d;
    font-weight: bold;
    text-align: left;
    padding: 10px 10px 4px;
  }
  img.floor-image-item {
    display: block;
    width: 40px;
    height: 40px;
    background: #ececec;
    margin: 0 auto;
  }
}
.floor-device {
  width: auto;
  text-align: left;
  min-height: 10px;
  .floor-device-list {
    width: auto;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    padding: 0 10px;
    margin: 0 10px 6px 0;
    border-radius: 16px;
    color: #9aabbe;
    font-size: 12px;
    background-color: #fbfcff;
    border: 1px #e2e4ea solid;
  }
}
.padding_set {
  padding: 10px 10px 14px;
}
.floor-info {
  position: relative;
  width: 100%;
  padding: 2px 0 2px 50px;
  .floor-info-img {
    position: absolute;
    top: 50%;
    left: 0;
    width: 50px;
    height: 50px;
    transform: translateY(-50%);
    .floor-info-image {
      width: 50px;
      height: 50px;
      background: #eee;
      cursor: pointer;
      border-radius: 5px;
    }
    .plus {
      position: absolute;
      left: 2px;
      bottom: 2px;
      font-size: 14px;
      color: #fff;
      cursor: pointer;
    }
  }

  .floor-info-box {
    height: 50px;
    font-size: 12px;
    text-align: left;
    padding: 3px 0 2px 10px;
    .floor-info-approve {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      color: @btnActiveBg;
      padding: 0 16px;
      background: #eef1fc;
      border-radius: 24px;
      margin-bottom: 4px;
    }
    .floor-info-address {
      display: flex;
      justify-content: left;
      align-items: center;
      .address-icon {
        display: inline-block;
        width: 10px;
        height: 11px;
        background: url("../../../assets/icon/address.png") no-repeat;
        background-size: cover;
        background-position: center;
      }
      .address-text {
        color: #7f93a8;
        display: inline-block;
        margin-left: 4px;
      }
    }
  }
}
.res-bottomt {
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
    color: #7f93a8;
    .res-bottomt-label {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 4px;
      border: 1px #ddd solid;
    }
    .available {
      background-color: #ffffff;
    }
    .expired {
      background-color: #edaa75;
      border-color: #edaa75;
    }
    .reserved {
      background-color: #79b1ac;
      border-color: #79b1ac;
    }
    .selected {
      background-color: #5473e8;
      border-color: #5473e8;
    }
  }
}
.room-detail {
  /deep/.el-dialog__header {
    padding: 20px 34px 10px;
  }
  /deep/.el-dialog__body {
    padding: 30px 35px 50px;
  }
}
.room-content {
  display: flex;
  justify-content: center;
  .room-content-l {
    position: relative;
    flex: 1;
    max-height: 230px;
    margin-right: 20px;
    padding-right: 20px;
    overflow-y: auto;
    .room-list {
      display: flex;
      margin-bottom: 16px;
      color: #58585d;
      font-size: 14px;
      .room-list-labe {
        display: inline-block;
        flex-basis: 100px;
        width: 100px;
        text-align: left;
      }
      .letter-spacing {
        letter-spacing: 3.6px;
      }
      .room-list-value {
        width: 260px;
      }
    }
    &:after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      border-radius: 12px;
      height: 160px;
      background: #f5f8ff;
      display: none;
    }
  }
  .room-content-r {
    width: 230px;
    height: 230px;
    margin-right: 20px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.appointment-box {
  padding: 0;
  text-align: center;
  .appointment-repeat {
    .appointment-box-item {
      position: relative;
      margin-bottom: 30px;
      .el-select--medium {
        width: 340px;
      }
      .el-date-editor.el-input {
        width: 340px;
      }
      .appointment-err {
        position: absolute;
        color: #ff5050;
        top: 39px;
        left: 124px;
        font-size: 12px;
        transition: inherit;
      }
      .appointment-tips {
        position: absolute;
        color: #ff5050;
        top: -16px;
        right: 17px;
        font-size: 12px;
        transition: inherit;
      }
    }
  }
}
.appointment-next {
  .appointment-box-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    .appointment-next-labe {
      display: inline-block;
      width: 100px;
    }
    .edit-nex-input {
      margin-right: 10px;
    }
    .appointment-err {
      position: absolute;
      color: #ff5050;
      top: 39px;
      font-size: 12px;
      transition: inherit;
    }

    .start-date {
      left: 209px;
    }
    .start-time {
      right: 0;
    }
    .end-date {
      left: 209px;
    }
    .end-time {
      right: 0;
    }
  }
}

.appo-labe-Symbol {
  display: inline-block;
  color: #ff5050;
  font-size: 20px;
  margin-right: 4px;
  vertical-align: middle;
}

.dialog-bottom {
  padding-top: 0;
  text-align: right;
  /deep/.el-button {
    width: 80px;
  }
  .appointment-next-tips {
    color: #58585d;
    margin-bottom: 28px;
  }
}

/deep/.add-dropdown {
  .el-loading-spinner {
    margin-top: 0;
    transform: translateY(-50%);
    font-size: 18px;
  }
}

/deep/.el-table--scrollable-y .el-table__body-wrapper {
  height: calc(100% - 35.4px) !important;
}
</style>
