
<template>
  <div class="app-wrap no-padding no-bg" v-loading="contentLoading">
    <div class="save-submit">
      <el-button type="button" 
      class="reservation-submit el-button--primary" 
      :loading="submitLoading" 
      @click="putMeetingInfo">{{$t('button.save')}}</el-button>
    </div>
    <div class="meeting-edit-wrap">
      <!-- 会议室信息 -->
        <div class="edit-box">
            <div class="edit-box-title">{{$t('message.roomInfoForm')}}</div>
            <div class="edit-box-list">
                <!-- 会议室楼层 -->
                <!-- <div class="edit-box-item">
                    <span class="edit-box-label">
                      <i class="warring ">*</i>{{$t('message.floor')}}：
                    </span>
                    <el-select
                        class="edit-box-input"
                        v-model="ruleForm.room.floor_guid"
                        size="mini"
                        @change="getFloorRoomList(ruleForm.room.floor_guid, 'changeFloor')"
                    >
                        <el-option
                        v-for="item in category"
                        :key="item.guid"
                        :label="item.name"
                        :value="item.guid"
                        ></el-option>
                    </el-select>
                </div> -->
                <!-- 会议室名称 -->
                <div class="edit-box-item">
                    <span class="edit-box-label">
                      <i class="warring ">*</i>{{$t('message.meetRoom')}}：
                    </span>
                    <el-select
                        class="edit-box-input"
                        v-model="ruleForm.room.guid"
                        size="mini"
                        @change="selectRoom"
                    >
                        <el-option
                        v-for="item in roomNameList"
                        :key="item.guid"
                        :label="item.name"
                        :value="item.guid"
                        
                        ></el-option>
                    </el-select>
                    <div class="error" v-if="error.room.isFocus">
                      {{$t('message.selectRoom')}}
                    </div>
                </div>
                <!-- 支持的会议类型 -->
                <div class="edit-box-item">
                    <span class="edit-box-label">{{$t('message.meetingType')}}：</span>
                    <span class="edit-box-value">{{ruleForm.device||$t('message.nothing')}}</span>
                </div>
            </div>
        </div>
        <!-- 基本信息 -->
        <div class="edit-box">
            <div class="edit-box-title">{{$t('message.essentialInformation')}}</div>
            <div class="edit-box-list">
                <template >
                  <!-- 预约类型 -->
                  <div class="edit-box-item ">
                    <span class="edit-box-label">
                      <i class="warring ">*</i>{{$t('message.AppointmentType')}}：
                    </span>
                    <el-select 
                      v-model="ruleForm.repe_type" 
                      class="edit-box-input" 
                      size="mini"
                      @change="handleSelectMeeting"  
                    >
                      <el-option
                        v-for="item in ruleForm.repe_types"
                        :key="item.guid"
                        :label="item.name"
                        :value="item.guid"
                      ></el-option>
                    </el-select>
                    <div class="error" v-if="error.repeType.isFocus">
                      {{$t('message.selectMeetingType')}}
                    </div>
                  </div>
                  <!-- 重复预约开始日期 -->
                  <div class="edit-box-item" v-if="ruleForm.repe_type !== 0">
                    <span class="edit-box-label">
                      <i class="warring ">*</i>{{$t('message.repeatStartTime')}}：
                    </span>
                    <el-date-picker
                      v-model="ruleForm.repe_start_date"
                      type="date"
                      size="mini"
                      class="edit-box-input"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions"
                      disabled
                      >></el-date-picker>
                    <!-- <span class="edit-box-report-tips">{{$t('message.term')}}</span> -->
                    <div class="error" v-if="error.repeStartTime.isFocus">{{$t('message.selectStartTime')}}</div>
                  </div>
                  <!-- 重复截止日期 -->
                  <div class="edit-box-item margin-top" v-if="ruleForm.repe_type !== 0">
                    <span class="edit-box-label">
                      <i class="warring ">*</i>{{$t('message.repeatTime')}}：
                    </span>
                    <el-date-picker
                      v-model="ruleForm.end_date"
                      type="date"
                      size="mini"
                      class="edit-box-input"
                      value-format="yyyy-MM-dd"
                      :picker-options="repetPickerOptions"
                      >></el-date-picker>
                    <span class="edit-box-report-tips">{{$t('message.term')}}</span>
                    <div class="error" v-if="error.repeTime.isFocus">{{$t('message.selectRepeatTime')}}</div>
                  </div>
                </template>
                <!-- 会议主题 -->
                <div class="edit-box-item">
                    <span class="edit-box-label"><i class="warring ">*</i>{{$t('message.theme')}}：</span>
                    <el-input
                      class="input edit-box-input"
                      size="mini"
                      v-model="ruleForm.title"
                      :class="error.title.isFocus ? 'inputError' : ''"
                    ></el-input>
                    <div class="error" v-if="error.title.isFocus">
                      {{$t('message.theme')}}
                    </div>
                </div>
                <!-- 会议时间 -->
                <div class="edit-box-item">
                    <span class="edit-box-label">{{$t('message.meetingTime')}}：</span>
                    <span class="edit-box-value">
                      <el-input 
                      ref="inputRepeTime"
                      class="input edit-box-input" 
                      size="mini" 
                      v-model="dateTimes" 
                      @focus="handleTimesMeet">
                      </el-input>
                    </span>
                </div>
                <!-- 内部参会人员 -->
                <div class="edit-box-item">
                    <span class="edit-box-label">{{$t('message.internalParticipants')}}：</span>
                    <span class="edit-box-value border" @click="showInnerDialog">{{ruleForm.participantVal||$t('message.promptInternalParticipants')}}</span>
                    <!-- <el-input
                      class="input edit-box-input"
                      size="mini"
                      :placeholder="$t('message.promptInternalParticipants')"
                      v-model="ruleForm.participantVal"
                      @focus="showInnerDialog"
                    ></el-input> -->
                </div>
                <!-- 外部参会人员 -->
                <div class="edit-box-item f-start">
                    <span class="edit-box-label margin-top-8">{{$t('message.externalParticipants')}}：</span>
                    <div class="inner">
                      <div
                        class="item margin-bottom-10"
                        v-for="(item, index) in ruleForm.other_participants"
                        :key="index"
                      >
                        <div class="df ac">
                          <!-- 名称 -->
                          <el-input
                            :placeholder="$t('message.fullName')"
                            class="input1"
                            size="mini"
                            v-model="item.name"
                            clearable
                          ></el-input>
                          <!-- 邮箱 -->
                          <el-input
                            :placeholder="$t('message.mailbox')"
                            class="input2"
                            size="mini"
                            v-model="item.email"
                            clearable
                          ></el-input>
                          <!-- 新增 -->
                          <el-button
                            type="text"
                            icon="el-icon-plus"
                            size="mini"
                            v-if="index === 0"
                            @click="editOtherParticipant()"
                            ></el-button
                          >
                          <!-- 删除 -->
                          <el-button
                            type="text"
                            icon="el-icon-close"
                            size="mini"
                            v-else
                            @click="editOtherParticipant(index)"
                            ></el-button
                          >
                        </div>
                        <div class="error-box">
                          <div class="nameError" v-if="item.nameError">{{ $t("message.nameError") }}</div>
                          <div class="emailError" v-if="item.error">
                            {{ $t("message.mailError") }}
                          </div>
                        </div>
                      </div>
                      <div class="tips" style="margin-top: 15px">
                        {{ $t("message.mailTips") }}
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="edit-box">
            <!-- 会议类型 -->
            <div class="edit-box-title">{{$t('message.meetType')}}</div>
            <div class="edit-box-list">
                <div class="edit-box-item">
                    <span class="edit-box-label ">
                      <i class="warring ">*</i>{{$t('message.meetType')}}：
                    </span>
                    <el-select
                      class="input edit-box-input"
                      size="mini"
                      :class="this.error.type.isFocus ? 'inputError' : ''"
                      v-model="ruleForm.type_guid_id"
                      :placeholder="$t('message.selectMeetingType')"
                      @change="changeMeetingType"
                    >
                      <el-option
                        v-for="(item, index) in ruleForm.types"
                        :key="index"
                        :label="item.name"
                        :value="item.guid"
                      ></el-option>
                    </el-select>
                    <div class="error " v-if="this.error.type.isFocus">
                      {{$t('message.selectMeetingType')}}
                    </div>
                </div>

                <div class="edit-box-item f-start" 
                  v-if="
                      ruleForm.meetingTypeText == '视频会议' ||
                      ruleForm.meetingTypeText == '视频与电话会议'
                    "
                >
                  <div class="edit-box-label margin-top-8">
                    <span class="warring ">*</span>{{ $t("message.subsidiaries") }}：
                  </div>
                  <div class="inner">
                    <!-- 添加下属公司 -->
                    <div class="df ac item">
                      <el-button icon="el-icon-plus" class="company-puls" @click="handlerCompany()" size="mini"></el-button>
                      <span class="company-tips">{{ $t("message.companiesFill") }}</span>
                      <div class="error" v-if="error.company.isFocus" >
                          {{ $t("message.subsidiariesNum") }}
                      </div>
                    </div>
                    <!-- 填写下属公司信息 -->
                    <div class="df ac item "
                      v-for="(item, index) in ruleForm.child_company"
                      :key="index"
                    >
                      <el-input
                        class="input edit-box-company"
                        size="mini"
                        :placeholder="$t('message.promptCompanyName')"
                        v-model="item.name"
                        :class="item.isFocus ? 'inputError' : ''"
                      ></el-input>
                      <el-button type="text" class="company-close" @click="handlerCompany(index)" icon="el-icon-close" size="mini"></el-button>
                      <div class="error" v-if="item.isFocus">
                        {{ $t("message.promptCompanyName") }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="edit-box-item"
                  v-if="
                    ruleForm.meetingTypeText == '电话会议' ||
                    ruleForm.meetingTypeText == '视频与电话会议'
                  "
                >
                    <div class="edit-box-label ">
                      <!-- 选择地区 -->
                      <span class="warring">*</span>{{ $t("message.meetArea") }}：
                    </div>
                    <div
                      class="df ac"
                      v-for="(item, index) in ruleForm.areas"
                      :key="index"
                      @click="changeArea(item)"
                    >
                      <div
                        class="btn"
                        :class="item.guid == ruleForm.area_guid_id ? 'active' : ''"
                      >
                        {{ item.name }}
                      </div>
                    </div>
                    <div class="error" v-if="error.area.isFocus">
                      <!-- 请选择地区提示 -->
                      {{ $t("message.promptMeetArea") }}
                    </div>
                </div>

                <div class="edit-box-item " 
                      v-if=" ruleForm.meetingTypeText == '电话会议' || 
                      ruleForm.meetingTypeText == '视频与电话会议'"
                >
                    <div class="edit-box-label ">
                      <!-- 参会方 -->
                      <span class="warring">*</span>{{ $t("message.participants") }}：
                    </div>
                    <div class="inner">
                      <div class="df ac">
                        <el-input
                          class="input company-puls"
                          size="mini"
                          :placeholder="$t('placeholder.companiesNum')"
                          @input="
                            (val) => {
                              inputChange('content', val);
                            }
                          "
                          maxlength="5"
                          v-model="ruleForm.content"
                          :class="error.number.isFocus ? 'inputError' : ''"
                        ></el-input>
                        <span class="company-tips">{{ $t("message.companiesNum") }}</span>
                        <div class="error" v-if="error.number.isFocus">
                          {{ $t("message.promptNumber") }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 电话信息 -->
                    <div class="edit-box-telephoneInfo" v-if="meetingType == '电话会议'|| meetingType == '视频与电话会议'"> 
                        <div class="telephoneInfo-title">{{$t('message.telephoneInfo')}}:</div>
                        <div class='telephoneInfo-list' v-if='ruleForm.telephone && ruleForm.telephone.length'>
                            <div class="telephoneInfo-item" v-for="(item, index) in ruleForm.telephone" :key="index">
                                <span class="telephoneInfo-label ">{{item.key}}：</span>
                                <span class="telephoneInfo-value">{{item.value}}</span>
                            </div>
                        </div>
                        <div v-else class='telephoneInfo-list'>
                          <div class="telephoneInfo-item">
                                <span class="telephoneInfo-label "></span>
                                <span class="telephoneInfo-value">{{$t('message.nothing')}}</span>
                            </div>
                        </div>
                    </div>


            </div>
        </div>
        <!-- 其他信息 -->
        <div class="edit-box">
            <div class="edit-box-title">{{$t('message.otherInformation')}}</div>
            <div class="edit-box-list">
                <div class="edit-box-item f-start">
                    <!-- 物业服务 -->
                    <span class="edit-box-label">{{$t("message.propertyServices")}}：</span>
                    <div>
                      <el-radio-group v-model="ruleForm.is_property">
                        <el-radio  :label="1">{{$t('message.yes')}}</el-radio>
                        <el-radio  :label="0">{{$t('message.no')}}</el-radio>
                      </el-radio-group>
                    </div>
                </div>
                <!-- 开启后物业可收到会议信息邮件通知 -->
                <span class="edit-box-tips">{{$t('message.openingInfor')}}</span>
            </div>
        </div>
        <!-- 备注信息 -->
        <div class="edit-box">
            <div class="edit-box-title">{{$t('message.Remarks')}}</div>
            <div class="edit-box-list">
                <div class="edit-box-item f-start">
                    <span class="edit-box-label margin-top-8">{{ $t("message.remarks2") }}：</span>
                    <el-input
                      type="textarea"
                      class="input edit-box-input"
                      v-model="ruleForm.remark"
                      :autosize="{ minRows: 4, maxRows: 4}"
                      :placeholder="$t('message.EnterComments')"
                    ></el-input>
                </div>
            </div>
        </div>
        <!-- 电话信息 -->
        <!-- <div class="edit-box" v-if="meetingType == '电话会议'|| meetingType == '视频与电话会议'">
            <div class="edit-box-title">{{$t('message.telephoneInfo')}}</div>
            <div class='edit-box-list' v-if='ruleForm.telephone && ruleForm.telephone.length'>
                <div class="edit-box-item" v-for="(item, index) in ruleForm.telephone" :key="index">
                    <span class="edit-box-label ">{{item.key}}：</span>
                    <span class="edit-box-value">{{item.value}}</span>
                </div>
            </div>
            <div v-else class='edit-box-list'>
              <div class="edit-box-item">
                    <span class="edit-box-label "></span>
                    <span class="edit-box-value">{{$t('message.nothing')}}</span>
                </div>
            </div>
        </div> -->
    </div>

    <!-- 修改预约时间 -->
    <el-dialog
      width="500px"
      :title="$t('message.meetingTime')"
      :visible.sync="timesVisible"
      append-to-body
      @close="callbackTimesDialogClose"
    >
      <div class="meet-time-content">
        <div class="time-content-btm" v-if="ruleForm.repe_type === 0">
          <span class="time-content-label">{{$t('message.date')}}：</span>
           <el-date-picker
            v-model="chooseMeetDate"
            type="date"
            size="mini"
            :placeholder="$t('placeholder.date')"
            value-format="yyyy-MM-dd"
            :editable="false"
            :picker-options="pickerOptions"
            clearable
            @change="selectDate"
            >></el-date-picker>
            <span class="select-tips date-tips" v-show="showDateTips">{{$t('message.selsectDate')}}</span>
        </div>
        <div class="time-content-top">
          <span class="time-content-label">{{$t('message.time')}}：</span>
          <el-time-select
            :placeholder="$t('message.startTime')"
            v-model="startTime"
            size="mini"
            :picker-options="startTimesOptions"
            @change="selectTimes"
            >
          </el-time-select>
          <span class="time-content-connect">-</span>
          <el-time-select
            :placeholder="$t('message.endTime')"
            v-model="endTime"
            size="mini"
            :picker-options="endTimesOptions"
            @change="selectStop"
            >
          </el-time-select>
          <span class="select-tips start-tips" v-show="showStartTips">{{$t('message.selectStartTime')}}</span>
          <span class="select-tips stop-tips" v-show="showStopTips">{{$t('message.selectEndTime')}}</span>
        </div>
        
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="timesVisible = false" size="mini">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="confirmMeetTime" size="mini">{{$t('button.confirm')}}</el-button>
      </span>
    </el-dialog>
    <!-- /修改预约时间 -->
    
    <!-- 选择参会人员 -->
    <el-dialog
      width="700px"
      :title="$t('message.promptInternalParticipants')"
      :visible.sync="innerVisible"
      append-to-body
      @close="callbackForInnerDialogClose"
      @open="callbackForInnerDialogOpen"
    >
      <div class="df join-content">
        <div class="left">
          <el-input
            class="inline-input"
            v-model="searchStr"
            @change="querySearch"
            :placeholder="$t('message.searchContent')"
          ></el-input>
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
          <div v-for="(item, index) in joinData" :key="index">
            - {{ item.label }}
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-right: 20px" size="mini" @click="innerVisible = false">
          {{$t("button.cancel")}}
        </el-button>
        <el-button type="primary" size="mini" @click="addMeetingPeople">
          {{$t("button.confirm")}}
        </el-button>
      </div>
    </el-dialog>
    <!-- /选择参会人员 -->
</div>
</template>
<script>
/* eslint-disable */
import {
  getBuildingApi,
  getDepartmentApi,
  getMeetingInfoApi,
  saveMeetingInfoApi,
  getVisibleRoomApi
} from '@api/appoint';
import dayjs from "dayjs";
import qs from 'querystring'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data () {
    return {
      contentLoading: false,// 主题loading
      submitLoading: false,// 提交按钮loading
      category: [],
      searchMeetingRoom: Function,
      isExpand: false, // 是否展开
      searchStr: '', // 模糊搜索员工
      dialogFormVisible: false,
      timesVisible: false, // 预约时间弹窗
      innerVisible: false, // 选择参会人员 
      dateTimes: '',// 预约时间
      meetingType: '',//会议类型
      startTime: '', // 预约开始时间
      endTime: '', // 预约结束时间 
      showStartTips : false, // 开始时间提示
      showStopTips :false, // 结束时间提示
      showDateTips : false, // 结束日期提示
      isPass: true, 
      meetingInfo: '',
      chooseMeetDate: '', // 预约日期
      defaultProps: {},
      allPeopleInfo: [], // 所有部门人员
      queryPeople: [], // 搜寻人员
      joinData: [],// 弹窗内参会人员
      roomNameList: [], // 楼层会议室
      ruleForm: {
        repe_start_date: '',
        repe_types: [],// 所有的会议预约类型
        room: {}
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
       pickerOptions: { // 控制日期选择
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      // 重复预约日期控制
      repetPickerOptions: {
        disabledDate: this.disabledDateRepet
      },
      error: { // 验证提示
        room: {isFocus: false},
        title: { isFocus: false },
        type: { isFocus: false },
        number: { isFocus: false },
        company: { isFocus: false },
        area: { isFocus: false },
        repeType: {isFocus: false},
        repeTime: {isFocus: false},
        repeStartTime: {isFocus: false}
      },
      defaultChecked: [] // 默认展开被选中的参会人员
      
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ]),
  },
  watch: {
    searchStr (val) {
      var departs = this.allPeopleInfo
      var results = val ? this.createFilter(departs, val) : departs
      // 调用 callback 返回建议列表的数据
      this.queryPeople = results
      this.$nextTick(() => {
        this.$refs.tree.filter(val)
      })
    },
    queryPeople: {
      handler (newValue) {
        this.$nextTick(() => {
          this.$refs.tree && this.$refs.tree.setCheckedNodes(this.joinData)
        })
        // this.$refs.tree && this.$refs.tree.setCheckedNodes(this.joinData)
      },
      deep: true
    }
  },
  mounted () {
  // 注销onresizes事件
  window.onresize = null;
  // 获取会议信息
  let meetInfo = this.$route.query
  this.getMeetingInfo(meetInfo.guid, meetInfo.outEventId)
  // 获取部门人员
  this.getMeetingPeopleInfo()
  },
  methods: {
    // 获取会议信息
    async getMeetingInfo(id, outEventId) {
        this.contentLoading = true
        let result = await getMeetingInfoApi({ guid: id, repe_guid: outEventId })
        // 获取所有楼层
        this.getBuilding(result.data.room.mansion_guid)
        // 获取该楼层所有会议室
        // this.getFloorRoomList(result.data.room.floor_guid, 'init')
        this.getFloorRoomList()
        
        this.ruleForm = {...result.data }
        let data = result.data
        if (data.title) {
          let str = ''
          let arr = []

          // 内部参会人员
          data.participants && data.participants.forEach((item) => {
            arr.push({ guid: item.guid })
            str = str ? str + ',' + item.name : item.name
          })

          // 外部参会人员
          if (data.other_participants.length > 0) {
            this.ruleForm.other_participants = data.other_participants
          } else {
            this.ruleForm.other_participants = [{ name: '', email: '' }]
          }
          
          // 会议时间
          if(this.ruleForm.repe_type === 0 ){
          // 单次预约时间显示文本
            this.dateTimes = this.ruleForm.start_time + ' - ' + this.ruleForm.stop_time.split(" ")[1]
          }else{
            // 重复会议开始日期
            this.$set(this.ruleForm,'repe_start_date',this.ruleForm.start_time.split(" ")[0])
            // 重复预约时间显示文本
            this.dateTimes = this.ruleForm.start_time.split(" ")[1] + ' - ' + this.ruleForm.stop_time.split(" ")[1]
          }
          
          // 默认会议类型 本地类型
           let type = ''
          if(!data.type_guid_id) {
            // 没有会议类型时，默认会议类型 '本地类型'
            this.ruleForm.type_guid_id = data.types[0].guid 
            type = data.types[0].name
          } else {
            type = data.types.filter(item => item.guid === data.type_guid_id)[0].name
          }
          
         // 下属公司
          let childCompany = data.companys.map((item, index) => {
            return { ...item, isFocus: false }
          })

          // 支持会议类型
          let device = ''
          data.functionals && data.functionals.forEach((item) => {
            device = device ? device + ',' + item.name : item.name
          })
          this.ruleForm.participantGuids = arr // 内部参会人员id
          this.ruleForm.participantVal = str // 内部参会人员
          this.ruleForm.companyNum = data.companys.length || '' // 参会方数量
          this.ruleForm.meetingTypeText = type // 会议类型
          this.meetingType = type
          this.ruleForm.device = device // 支持的会议类型
          this.$set(this.ruleForm,'child_company',this.ruleForm.companys)// 下属公司
        }
    },
    // 获取楼层
    async getBuilding(mansionid) {
      let result = await getBuildingApi({mansion_guid: mansionid, floor_list: 1})
      if(result.ret === '0'){
        this.category = [...result.floor_list]
      }
    },
    // 获取楼层会议室
    async getFloorRoomList(guids, type) {
      // let result = await getFloorRoomApi({guid: guids})
      let result = await getVisibleRoomApi()
      this.contentLoading = false
      if(result.ret === '0'){
        this.roomNameList = [...result.data]
        if(type === 'changeFloor'){
          this.ruleForm.room.guid = ''
          this.ruleForm.device = ''
          this.setStatus(this.ruleForm.room.guid, 'room')
        }
      }
    },
    // 选择会议室
    selectRoom() {
      let guid = this.ruleForm.room.guid
      let device = []
      if(guid){
        this.roomNameList.map(res => {
          if(res.guid === guid){
            device = res.functionals
          }
        })
        let deviceDec = ''
        device.map(v =>{
           deviceDec = deviceDec ? deviceDec + ',' + v.name : v.name
        })
        this.ruleForm.device = deviceDec
        this.setStatus(this.ruleForm.room.guid, 'room')
      }      
    },
    
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    querySearch (queryString, cb) {
      // var departs = this.allPeopleInfo
      // var results = queryString ? this.createFilter(departs, queryString) : departs
      // console.log('query-people', results)
      // // 调用 callback 返回建议列表的数据
      // this.queryPeople = results
    },
    // 同步tree进行筛选后的数据
    createFilter (all, queryString) {
      // all.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      let queryArr = []
      // const queryPeople = this.transformDeepArr(all)
      all.forEach(item => {
        if (item.children) {
          if (this.createFilter(item.children, queryString).length !== 0) {
            queryArr.push({
              id: item.id,
              label: item.label,
              children: this.createFilter(item.children, queryString)
            })
          }
        } else {
          if (item.label.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) {
            queryArr.push(item)
          }
        }
      })
      return queryArr
    },
    hideDialog () { },
    // 将多层数组转为一维数组
    transformDeepArr (arr) {
      let newArr = []
      arr.forEach(item => {
        if (!item.children) {
          newArr.push(item)
        } else {
          newArr.push(...this.transformDeepArr(item.children))
        }
      })
      return newArr
    },
    // 转换tree数据
    transformDatabase (arr) {
      let newArr = []
      arr.forEach(item => {
        let obj = {}
        // if (item.children) {
        obj['id'] = item['id']
        obj['label'] = item['name']
        obj['children'] = []
        if (item.user_list.length !== 0) {
          obj['children'] = item.user_list.map(ele => {
            return {
              id: ele.guid,
              label: ele.nickname
            }
          })
        }
        if (item.children.length !== 0) {
          obj['children'] = this.transformDatabase(item.children).concat(obj['children'])
        }
        // }
        newArr.push(obj)
      })
      return newArr
    },
    // 获取公司所有部门的工作人员
    async getMeetingPeopleInfo () {
      const result = await getDepartmentApi()
      if (result.ret === '0') {
        const allData = this.transformDatabase(result.data.items)
        this.allPeopleInfo = allData
        this.queryPeople = this.allPeopleInfo
      }
    },
    // 选择参会人会的面板关闭回调
    callbackForInnerDialogClose () {
      this.joinData = []
      this.searchStr = ''
      this.getMeetingPeopleInfo()
    },
    // 选择参会人会的面板开启回调
    callbackForInnerDialogOpen () {
      this.defaultChecked = this.ruleForm.participants.map(item => {
        return item.guid
      })
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.defaultChecked)
      })
    },
    
    // 会议时间获取焦点
    handleTimesMeet(time) {
      this.chooseMeetDate = this.ruleForm.start_time.split(' ')[0] // // 获取日期
      this.startTime = this.ruleForm.start_time.split(' ')[1].substring(0,5) // 获取小时分钟
      this.endTime = this.ruleForm.stop_time.split(' ')[1].substring(0,5) // 获取小时分钟
      // 限制时间选择范围
      const date = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const dateCurrent = date.split(' ')[0]
      if(this.chooseMeetDate === dateCurrent){
        const times = date.split(' ')[1]
        const hour = times.substring(0, 3)
        const minute = times.split(':')[1]
        const min = minute >= 30 ? 30 : '00'
        this.startTimesOptions.minTime = `${hour}${min}` ///`${hour}${min}`
        this.endTimesOptions.minTime = this.startTime
      }
      // 会议时间input失焦
      this.$refs.inputRepeTime.blur()
      // 时间弹窗 
      this.timesVisible =  true 
    },
    // 选择开始时间
    selectTimes(value) {
      // 提示
      this.showStartTips = value ? false : true
      // 限制时间选择范围
      if(value) {
        let startHour = value.split(':')[0]
        let endHour = this.endTime.split(':')[0]
        let startMinute = value.split(':')[1]
        let endMinute = this.endTime.split(':')[1]
        if(startHour > endHour||(startHour === endHour && startMinute > endMinute)){ // 判断日期是否为当天
           this.endTime = ''
           this.showStopTips = true
        }
        // 禁用结束时间最小选择范围
        this.endTimesOptions.minTime = value
      }else{
        // 输入框清空时重置结束时间限制范围
        this.endTimesOptions.minTime = this.startTimesOptions.minTime
      }
      // 当开始时间等于结束时间
      if(value === this.endTime){
        this.endTime = ''
        this.showStopTips = true
      }
    },
    // 选择结束时间
    selectStop(value) {
     this.showStopTips = value ? false : true
    },
    // 选择日期
    selectDate(value){
      const date = dayjs().format('YYYY-MM-DD HH:mm:ss')
      const dateCurrent = date.split(' ')[0]
      if(this.chooseMeetDate === dateCurrent){ // 当前时间禁用时间段
        const times = date.split(' ')[1]
        const hour = times.substring(0, 3)
        const minute = times.split(':')[1]
        let min = Number(minute) >= 30 ? 30 : '00'
        this.startTimesOptions.minTime = `${hour}${min}`
        this.endTimesOptions.minTime = `${hour}${min}`//this.startTime
        this.showStartTips = false
        this.showStopTips = false
      } else {
        this.startTimesOptions.minTime = ''
        this.endTimesOptions.minTime = ''
      }
      const meetDate = this.ruleForm.start_time.split(' ')[0]
      if(this.chooseMeetDate === meetDate){// 等于预约时间时重置选择时间为初始时间
        this.startTime = this.ruleForm.start_time.split(' ')[1].substring(0,5) // 获取小时分钟
        this.endTime = this.ruleForm.stop_time.split(' ')[1].substring(0,5) // 获取小时分钟
        this.showStartTips = false
        this.showStopTips = false
      }else{
        this.startTime = ''
        this.endTime = ''
        this.showStartTips = true
        this.showStopTips = true
      }
      this.showDateTips = value ? false : true
    },
    // 确认选择会议时间
    confirmMeetTime() {
      if(this.showStartTips || this.showStopTips || this.showDateTips){
        return
      }
      this.ruleForm.start_time = this.chooseMeetDate + ' ' + this.startTime + ':00'
      this.ruleForm.stop_time = this.chooseMeetDate + ' ' + this.endTime + ':00'
      if(this.ruleForm.repe_type === 0 ){
        // 单次预约时间
        this.dateTimes = this.ruleForm.start_time + ' - ' + this.endTime + ':00'
      }else{
        // 重复预约时间
        this.dateTimes = this.startTime + ':00' + ' - ' + this.endTime + ':00'
      }
      this.timesVisible =  false
    },
    // 选择预约类型
    handleSelectMeeting() {
      this.$set(this.ruleForm, 'repe_start_date', this.ruleForm.start_time.split(" ")[0])
      let singleTime = this.ruleForm.start_time + ' - ' + this.ruleForm.stop_time.split(" ")[1]
      let repeatTime = this.ruleForm.start_time.split(" ")[1] + ' - ' + this.ruleForm.stop_time.split(" ")[1]
      // 会议时间
      this.dateTimes = this.ruleForm.repe_type === 0 ? singleTime : repeatTime
    },
    // 预约时间弹窗关闭回调
    callbackTimesDialogClose() {
      this.showStartTips = false
      this.showStopTips = false
      this.showDateTips = false
    },
    // 选择树
    handleNodeClick (data, node) {
      let nodes = this.$refs.tree.getCheckedNodes()
      let arr = []
      nodes.forEach((item, index) => {
        if (!item.children) {
          arr.push(item)
        }
      })
      // 判断当前Tree中有没有该条数据,没有则不对其做处理
      let queryArr = []
      let extraPeople = []
      queryArr.push(...this.transformDeepArr(this.queryPeople))
      this.joinData.forEach(ele => {
        const filterArr = queryArr.filter(e => e.id === ele.id)
        if (filterArr.length === 0) {
          extraPeople.push(ele)
        }
      })

      this.joinData = extraPeople.concat(arr)
    },
    // 选择会议类型
    changeMeetingType (guid) {
      let type = this.ruleForm.types.filter(item => item.guid === guid)[0].name
      this.ruleForm = { ...this.ruleForm, meetingTypeText: type }
    },
    // 选择会议地区
    changeArea (data) {
      this.ruleForm = { ...this.ruleForm, area_guid_id: data.guid }
    },
    // 外部参会人员新增、删除
    editOtherParticipant (index) {
      if (!isNaN(index)) {
        this.ruleForm.other_participants.splice(index, 1)
      } else {
        this.ruleForm.other_participants.unshift({ name: '', email: '' })
      }
    },
    // 下属公司新增、删除
    handlerCompany(index) {
      if(isNaN(index)) {
        let conmpanNum = Number(this.ruleForm.companyNum) 
        let num = conmpanNum += 1
        if(num <= 30) {
          this.ruleForm.child_company.push({ name: '', isFocus: false })
        }else{
          num = 30
        }

        // console.log(num,'num')
        this.ruleForm.companyNum = num
      }else{
        this.ruleForm.child_company.splice(index, 1)
        this.ruleForm.companyNum = Number(this.ruleForm.child_company.length)
      }
    },
    // 下属公司输入框
    inputChange (type, value) {
      if (value.length === 1) {
        value = value.replace(/[^1-9]/g, '')
      } else {
        value = value.replace(/\D/g, '')
      }
      this.ruleForm[type] = value
      // this.ruleForm = { ...this.ruleForm }
    },
    // 输入框失焦
    inputBlur (type) {
      if (type === 'company') {
        let company = this.ruleForm.child_company
        let num = this.ruleForm.companyNum
        if (num > 30) {
          num = 30
        }
        this.ruleForm = { ...this.ruleForm, companyNum: num }
        if (company.length > num) {
          this.ruleForm.child_company.splice(num)
        } else if (company.length < num) {
          let tem = num - company.length
          for (let i = 0; i <= tem - 1; i++) {
            this.ruleForm.child_company.push({ name: '', isFocus: false })
          }
        }
      }
    },
    
    // 显示内部弹框
    showInnerDialog () {
      this.innerVisible = true
      this.joinData = this.ruleForm.participants.map(item => {
        return {
          label: item.name,
          id: item.guid
        }
      })
    },
    // 确认选择
    addMeetingPeople () {
      let str = ''
      let guids = []
      let arr = this.joinData.map((item) => {
        guids.push({ guid: item.id })
        str = str ? str + ',' + item.label : item.label
        return {
          guid: item.id,
          name: item.label
        }
      })
      this.ruleForm.participants = arr
      this.ruleForm.participantGuids = guids
      this.ruleForm.participantVal = str
      this.innerVisible = false
    },
    // 输入框校验
    setStatus (value, name, index) {
      if (!value) {
        this.isPass = false
        if (name === 'childCompany') {
          this.ruleForm.child_company[index].isFocus = true
        } else {
          this.error[name].isFocus = true
        }
      } else {
        if (name === 'childCompany') {
          this.ruleForm.child_company[index].isFocus = false
        } else {
          this.error[name].isFocus = false
        }
      }
      this.error = { ...this.error }
    },
    // 保存
    async putMeetingInfo () {
      this.isPass = true
      let ruleForm = this.ruleForm
      // 字段校验
      this.setStatus(String(ruleForm.room.guid), 'room')// 会议室
      this.setStatus(String(ruleForm.title), 'title')// 会议主题
      this.setStatus(String(ruleForm.repe_type), 'repeType')// 预约类型
      this.setStatus(String(ruleForm.type_guid_id), 'type')// 会议类型
      // 重复预约校验
      if(ruleForm.repe_type !== 0){
        this.setStatus(ruleForm.end_date, 'repeTime')
        this.setStatus(ruleForm.repe_start_date, 'repeStartTime')
      }

      // 参会人名字 邮箱检验
      let flag = false
      let other = this.ruleForm.other_participants.filter(item => {
        if (item.email||item.name) {
          var reg = /^(\w)+(\.\w+)*@(.)+((\.\w+)+)$/
          if (reg.test(item.email)) {
            item.error = false
          } else {
            flag = true
            item.error = true
          }
          if(item.name === ''){
            flag = true
            item.nameError =true
          }else{
            item.nameError =false
          }
        }else{
          item.error = false
          item.nameError =false
        }
        return item.email
      })
      if (flag) {
        return false
      }

      // 重复会议时间处理
      if(this.ruleForm.repe_type !== 0 && this.ruleForm.repe_start_date && this.isPass){
        this.ruleForm.start_time = this.ruleForm.repe_start_date+' ' + this.ruleForm.start_time.split(' ')[1]
        this.ruleForm.stop_time = this.ruleForm.repe_start_date+' ' + this.ruleForm.stop_time.split(' ')[1]
      }

      // 删除其他人员必填判断字段
      other.map(res=>{
        delete res.error
      })
      let data = {
        guid	: ruleForm.guid,//	会议guid
        repe_guid	: this.$route.query.outEventId,//	会议out_event_id
        room_guid	: ruleForm.room.guid,//	房间guid
        repe_type	: ruleForm.repe_type,//	重复类型
        end_date	: ruleForm.end_date,//	重复截止日期
        start_time	: ruleForm.start_time,//	会议开始时间
        stop_time	: ruleForm.stop_time,//	会议结束时间
        title	: ruleForm.title,//	会议主题
        type_guid	: ruleForm.type_guid_id,//	会议类型guid
        participants	: JSON.stringify(ruleForm.participantGuids),//	参会人列表=[{“guid”:””},{“guid”:””}]
        other_participants	: JSON.stringify(other),//	其他参会人列表[{“name”:””,”email”:””},]
        is_property	: ruleForm.is_property,//	: '',//是否需要物业服务
        remark	: ruleForm.remark//	会议备注
        // area_guid	: '',//	会议区域guid
        // companys	: '',//	下属公司信息[{“name”:””},]
        // content	: '',//	会议内容
      }

      if (this.ruleForm.meetingTypeText === '本地会议') {

      } else if (this.ruleForm.meetingTypeText === '电话会议') {
        this.setStatus(this.ruleForm.area_guid_id, 'area')
        this.setStatus(this.ruleForm.content, 'number')
        data = Object.assign(data, {
          area_guid: this.ruleForm.area_guid_id,
          content: this.ruleForm.content
        })
      } else if (this.ruleForm.meetingTypeText === '视频会议') {
        this.setStatus(this.ruleForm.companyNum, 'company')
        this.ruleForm.child_company.forEach((item, index) => {
          this.setStatus(item.name, 'childCompany', index)
        })
        if(this.isPass){
          let childCompany = JSON.parse(JSON.stringify(this.ruleForm.child_company))
          childCompany.map(res=>{
            delete res.isFocus
          })
          data = Object.assign(data, {
            companys: JSON.stringify(childCompany)
          })
        }
      } else if (this.ruleForm.meetingTypeText === '视频与电话会议') {
        this.setStatus(this.ruleForm.companyNum, 'company')
        this.ruleForm.child_company.forEach((item, index) => {
          this.setStatus(item.name, 'childCompany', index)
        })
        this.setStatus(this.ruleForm.area_guid_id, 'area')
        this.setStatus(this.ruleForm.content, 'number')
        if(this.isPass){
           let childCompany = JSON.parse(JSON.stringify(this.ruleForm.child_company))
          childCompany.map(res=>{
            delete res.isFocus
          })
          data = Object.assign(data, {
            area_guid: this.ruleForm.area_guid_id,
            content: this.ruleForm.content,
            companys: JSON.stringify(childCompany)
          })
        }
        
      }

      if (!this.isPass) return false
      let that = this;
      that.submitLoading = true
      let result = await saveMeetingInfoApi(qs.stringify(data))
      if (result.ret === '0') {
        this.$message({
          message: this.$t('tip.reserveSuccess'),
          type: 'success'
        })
        that.submitLoading = false
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.replace('/')
      }else if(result.msg === '会议已存在') {
        this.$message({
          message: result.msg,
          type: 'error'
        })
        setTimeout(() => {
          that.submitLoading = false
          that.$store.dispatch('tagsView/delView', that.$route)
          that.$router.replace('/')
        }, 600);
      } else {
        that.submitLoading = false
        this.$message({
          message: result.msg,
          type: 'error'
        })
      }
    },
    // 控制日期选择
    disabledDate(time) {
      return (
        time.getTime() < Date.now()
      );
    },
    // 最长重复时间段为180天 ，禁用开始日期之前的日期
    disabledDateRepet(time) {
      let startDate = dayjs(this.ruleForm.start_time.split(' ')[0]).valueOf() // 180天
      return time.getTime() > startDate + 24 * 60 * 60 * 1000 * 180 || time.getTime() < startDate 
    }
  },
  destroyed() {
    // sessionStorage.removeItem('meetingInfo')
    // let info = sessionStorage.getItem('meetingInfo')
    // console.log(info, '销毁info')
  }
}
</script>
<style lang="less" scoped>
@import '../../../../styles/variable/variable.less';

.save-submit{
  position: absolute;
  top: 18.5px;
  right: 45px;
  z-index: 1000;
  .reservation-submit{
      width: 120px;
      height: 32px;
      padding: 6px 0;
    }
}
.meeting-edit-wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    padding: 0 0 10px;
    width: 100%;
    min-width: 1100px;
    overflow-y: scroll;
    
    .meeting-edit-register {
        padding: 16px 30px;
        background: #f5f7e4;
        color: #498232;
        text-align: center;
        font-size: 14px;
    }
    .edit-box {
        margin-bottom: 4px;
        padding: 6px 6px 6px 8px;
        margin-bottom: 7px;
        background: #fff;
        border-radius: 4px;
        .edit-box-title {
            margin: 23px 0 14px;
            position: relative;
            padding-left: 10px;
            font-size: 14px;
            font-weight: bold;
            color: @textColor;
        }
        .edit-box-list {
          position: relative;
          margin-bottom: 16px;
          .edit-box-item {
              position: relative;
              display: flex;
              align-items: center;
              color:  @textColor;
              margin-bottom: 16px;
              font-size: 12px;
              padding-left: 25px;
              .inner {
                .item {
                  margin-bottom: 10px;
                  .input1 {
                    width: 120px;
                  }
                  .input2 {
                    width: 225px;
                    margin: 0 8px;
                  }
                  .input3 {
                    width: 120px;
                    margin: 0 8px;
                  }
                  .error-box{
                    display: flex;
                    justify-content: space-between;
                    clear: both;
                    margin-top: 4px;
                    color: #DD0000;
                  }
                  .nameError{
                    flex: 1;
                  }
                  .emailError{
                    flex: 1;
                    text-align: right;
                    padding-right: 25px;
                  }
                }
                .tips {
                  font-size: 12px;
                  color: #ABBAC9;
                }
                .margin-bottom-10{
                  margin-bottom: 10px;
                }
                .company-puls{
                  width: 75px;
                }
                .company-close{
                  margin-left: 8px;
                }
                .company-tips{
                  color: #ABBAC9;
                  margin-left: 32px;
                }
                
              }
              .btn {
                margin-right: 10px;
                min-width: 75px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                &.active {
                  color: #fff;
                  border: 1px solid #5C7BEA;
                  background: #5C7BEA;
                }
              }
              .edit-box-centen{
                  width: 560px;
                  .edit-box-centen-list {
                      display: flex;
                      margin-bottom: 10px;
                      .edit-box-btn{
                          display: flex;
                          padding-left: 10px;
                      }
                  }
              }
              .edit-box-label{
                  min-width: 162px;
                  padding-left: 48px;
                  .warring{
                    color: #DD0000;
                  }
              }
              .border{
                display: inline-block;
                width: 375px;
                color: #384677;
                min-height: 28px;
                border-radius: 4px;
                line-height: 24px;
                padding:0 15px;
                cursor: pointer;
                border: 1px #DFE4EB solid;
              }
              .edit-box-input{
                  width: 375px;
              }
              .edit-box-company{
                width: 354px;
              }
              .edit-box-textarea{
                  width: 500px;
              }

              /deep/.el-button {
                .el-icon-plus{
                  color: #ABBAC9;
                  font-weight: bold;
                  font-size: 14px;
                }
                .el-icon-close{
                  color: #FC9400;
                  font-weight: bold;
                  font-size: 14px;
                }
              }
              .emailError {
                padding-left: 88px;
                color: #f00;
              }
              .error {
                position: absolute;
                color: #f00;
                left: 580px;
                white-space: nowrap;
              }
          }

          .edit-box-telephoneInfo{
            position: absolute;
            top: 0;
            right: 80px;
            display: flex;
            font-size: 14px;
            color: #384677;
            .telephoneInfo-title {
              margin-right: 20px;
            }
            .telephoneInfo-list {
              display: flex;
              flex-wrap: wrap;
              width: 310px;
              .telephoneInfo-item {
                margin: 0 20px 14px 0;
              }
            }
          }
          
          .edit-box-tips{
              display: block;
              font-size: 12px;
              color: #ABBAC9;
              padding-left: 188px;
              margin-top: 18px;
          }
          .edit-box-report-tips{
            position: absolute;
            left: 430px;
            top: -16px;
            color: #ABBAC9;
          }

          .margin-top{
            margin-top: 24px;
          }
        }
        
        .f-start{
            align-items: flex-start !important;
        }

       

    }
    
    .edit-botton{
        padding-top: 20px;
    }
    .margin-top-8{
        margin-top: 8px;
    }
    .margin-left-6{
        margin-left: 6px;
    }
    .margin-bottom-10{
        margin-bottom: 10px;
    }
 }
//  修改预约时间
  .meet-time-content{
    font-size: 12px;
    margin: 0 auto;
    color: #384677;
    text-align: left;
    padding-left: 50px;
    .time-content-top{
      position: relative;
      .el-date-editor{
        width: 123px;
      }
      .select-tips{
        position: absolute;
        top: 33px;
        font-size: 12px;
        color:#DD0000;
      }
      .start-tips{
        right: 208px;
      }
      .stop-tips{
        right: 68px;
      }
    }
    .time-content-btm{
      position: relative;
      margin-bottom: 18px;
      .el-date-editor{
        width: 262px;
      } 
      .date-tips{
        position: absolute;
        top: 31px;
        right: 68px;
        font-size: 12px;
        color:#DD0000;
      }
    }
    .time-content-label{
      display: inline-block;
      width: 80px;
      text-align: right;
    }
    .time-content-connect{
      display: inline-block;
      margin: 0 6px;
    }
  }
  .join-content {
    // font-size:12px;
    .left {
      box-sizing: border-box;
      padding: 0 8px 0 8px;
      height: 400px;
      // overflow-y: auto;
      .el-tree {
        height: 360px;
        overflow-y: auto;
        .el-checkbox__inner {
          margin-right: 5px;
        }
      }
    }
    .right {
      width: 300px;
      height: 400px;
      overflow-y: auto;
      padding: 10px 15px;
      line-height: 24px;
      border: 1px solid #ddd;
    }
  }

  // 弹窗头部
  /deep/.el-dialog__header{
    padding: 12px 20px 10px;
    .el-dialog__title{
      font-size: 16px;
    }
    .el-dialog__headerbtn{
      top: 16px;
    }
    .el-dialog__close{
      font-size: 18px;
    }
  }

  // 弹窗底部
  /deep/.el-dialog__footer{
    text-align: center;
  .dialog-footer {
    text-align: center !important;
    .el-button {
      width: 90px;
      height: 32px;
      padding: 6px 0;
    }
  }
}
</style>
