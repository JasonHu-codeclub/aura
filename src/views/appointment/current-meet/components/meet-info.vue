/*
* 会议详情 
*/
<template>
 <div 
   class="app-wrap no-padding detail-wrap no-bg" 
   v-loading="formLoading"
   element-loading-text="加载中..."
   element-loading-spinner="el-icon-loading"
   element-loading-background="rgba(0, 0, 0, 0.38)" 
 >
    <div class="save-submit" v-show="dataType === 2">
      <el-button type="button" class="reservation-submit el-button--primary" @click="save" round>{{$t('button.save')}}</el-button>
    </div>
    <div class="meeting-edit-wrap">

      <!-- 会议信息 -->
      <div class="edit-box">
         <div class="edit-box-title">{{$t('placeholder.conferenceInfor')}}</div>
         <div class="edit-box-list">
            <!-- 会议地点 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('labe.meetAddress')}}：</div>
               <div class="edit-box-value">{{ruleForm.meeting_room_name||'--'}}</div>
            </div>
            <!-- 会议设备 -->
            <div class="edit-box-item" >
               <div class="edit-box-label">{{$t('labe.equipmentOfroom')}}：</div>
               <div class="edit-box-value">{{equipmentStr||'--'}}</div>
            </div>
            <!-- 预约类型 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('labe.AppointmentType')}}：</div>
               <div class="edit-box-value">{{categoryStr||'--'}}</div>
            </div>
         </div>
         <div class="edit-sign_in" v-if="ruleForm.status == 1">
            <!-- {{ruleForm.is_is_sign == 1 ? $t('tip.signIn') : $t('tip.notSignIn')}} -->
            <span v-if="ruleForm.is_is_sign == 1"><i class="el-icon-circle-check"></i>{{$t('tip.signIn')}}</span>
            <span v-else><i class="el-icon-warning"></i>{{$t('tip.notSignIn')}}</span>
         </div>
      </div>

      <!-- 基本信息 -->
      <div class="edit-box">
         <div class="edit-box-title">{{$t('message.essentialInformation')}}</div>
         <div class="edit-box-list">
            <!-- 会议信息 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('placeholder.conferenceInfor')}}：</div>
               <div class="edit-box-value">
                  <span v-if="dataType===1">{{ruleForm.is_secrecy?'保密':'公开'}}</span>
                  <el-radio-group v-if="dataType===2" v-model="ruleForm.is_secrecy">
                     <el-radio  :label="0">{{$t('message.open')}}</el-radio>
                     <el-radio  :label="1">{{$t('message.private')}}</el-radio>
                  </el-radio-group>
               </div>
            </div>
            <!-- 会议主题 -->
            <div class="edit-box-item">
               <div class="edit-box-label"><i class="warring ">*</i>{{$t('message.theme')}}：</div>
               <div class="edit-box-value">
                  <el-input
                     class="input edit-box-input"
                     v-model="ruleForm.title"
                     :placeholder="$t('placeholder.theme')"
                     :class="error.title.isFocus ? 'inputError' : ''"
                     :disabled="dataType===1"
                     maxlength="15"
                     clearable
                  ></el-input>
               </div>
               <div class="error" v-if="error.title.isFocus">
                  {{$t('placeholder.validateTheme')}}
               </div>
            </div>
            <template v-if="ruleForm.category==2">
               <!-- 重复开始时间 -->
               <div class="edit-box-item">
                  <div class="edit-box-label">{{$t('message.repeatStartTime')}}：</div>
                  <div class="edit-box-value">
                     <el-input
                        class="input edit-box-input"
                        v-model="ruleForm.date"
                        disabled
                     ></el-input>
                  </div>
               </div>
               <!-- 重复截止时间 -->
               <div class="edit-box-item">
                  <div class="edit-box-label">{{$t('message.repeatTime')}}：</div>
                  <div class="edit-box-value">
                     <el-input
                        class="input edit-box-input"
                        v-model="ruleForm.repetition_end_date"
                        disabled
                     ></el-input>
                     <span class="edit-box-total">{{reapSessions}}</span>
                  </div>
                  <div class="edit-box-repeat_time">{{$t('message.term')}}</div>
               </div>
            </template>
            <!-- 会议时间 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('message.meetingTime')}}：</div>
               <div class="edit-box-value">
                  <el-input
                     class="input edit-box-input"
                     v-model="meetTime"
                     disabled
                  ></el-input>
               </div>
            </div>
            <!-- 会议类型 -->
            <div class="edit-box-item" v-if="ruleForm.meeting_type_show == 1">
               <div class="edit-box-label">{{$t('message.meetType')}}：</div>
               <div class="edit-box-value">
                  <el-select 
                     v-model="ruleForm.meeting_type_id" 
                     class="edit-box-input"
                     :disabled="dataType===1"
                     clearable
                  >
                     <el-option
                     v-for="item in meetTypeList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"
                     ></el-option>
                  </el-select>
               </div>
            </div>
            
            <!-- 内部参会人 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('message.internalParticipants')}}：</div>
               <div class="edit-box-value">
                  <span class="edit-box-value border" :class="{ disabled_edit: dataType === 1 }" @click="showInnerDialog">
                     {{participantVal||$t('message.promptInternalParticipants')}}
                  </span>
               </div>
            </div>
            <!-- 外部参会人 -->
            <div class="edit-box-item" v-if="ruleForm.external_participants_show==1">
               <div class="edit-box-label">{{$t('message.externalParticipants')}}：</div>
               <div class="edit-box-value">
                  <span class="edit-box-value border" :class="{ disabled_edit: dataType === 1 }" @click="showExtDialog">
                     {{outParticipantVal||$t('message.addExtParticipants')}}
                  </span>
                  <!-- <el-input
                     class="input edit-box-input"
                     v-model="ruleForm.title"
                     :disabled="dataType===1"
                  ></el-input> -->
               </div>
            </div>
         </div>
      </div>

      <!-- 会议服务 -->
      <div class="edit-box">
         <div class="edit-box-title">{{$t('route.service')}}</div>
         <div class="edit-box-list">
            <!-- 茶点服务 -->
            <div class="edit-box-item f-start" v-if="ruleForm.service_show == 1">
               <div class="edit-box-label margin-top-10">{{$t('message.Refreshment')}}：</div>
               <div class="edit-box-value">
                  <el-select
                     v-model="ruleForm.serviceId"
                     multiple
                     filterable
                     allow-create
                     default-first-option
                     class="input edit-box-input"
                     @change="selectServeChange"
                     :placeholder="$t('placeholder.selectServe')"
                     :disabled="dataType===1">
                     <el-option
                        v-for="item in serviceList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                     </el-option>
                  </el-select>
                  <div class="edit-box-service">
                    <div class="edit-box-refreshment" v-for="(item, index) in ruleForm.service" :key="index">
                        <span class="edit-refreshment-label" >{{item.name}}：</span>
                        <el-input
                           :class="{highlight: item.value > 0 }" 
                           v-model="item.value" 
                           controls-position="right" :min="0" 
                           :disabled="dataType===1"
                           clearable
                           @input="changeValueHandle(item)"
                           >
                        </el-input>
                     </div>
                  </div>
               </div>
               
            </div>
            <!-- 设备服务 -->
            <div class="edit-box-item" v-if="ruleForm.equipment_show == 1">
               <div class="edit-box-label">{{$t('message.equipmentServices')}}：</div>
               <div class="edit-box-value">
                  <el-select
                     v-model="checkListEquipment"
                     multiple
                     filterable
                     allow-create
                     default-first-option
                     class="input edit-box-input"
                     @change="selectEquimentChange"
                     :placeholder="$t('placeholder.selectEquipment')"
                     :disabled="dataType===1">
                     <el-option
                        v-for="item in equipmentList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                     </el-option>
                  </el-select>
               </div>
               
            </div>
            <div class="edit-service-tips">（ {{$t('message.serveTips')}} ）</div>

         </div>
      </div>
      
      <!-- 其他信息 -->
      <div class="edit-box">
         <div class="edit-box-title">{{$t('message.otherInformation')}}</div>
         <div class="edit-box-list">
            <!-- 备注 -->
            <div class="edit-box-item f-start">
               <span class="edit-box-label margin-top-10">{{ $t("message.remarks2") }}：</span>
               <el-input
                  type="textarea"
                  class="input edit-box-input"
                  v-model="ruleForm.remark"
                  :autosize="{ minRows: 4, maxRows: 4}"
                  :placeholder="$t('message.EnterComments')"
                  :disabled="dataType===1"
                  maxlength="50"
                  show-word-limit
               ></el-input>
            </div>
         </div>
      </div>

    </div>
    
    <!-- 外部参会人 -->
    <el-dialog
      width="700px"
      :title="$t('message.addExtParticipants')"
      :visible.sync="extVisible"
      append-to-body
      custom-class="res-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @open="callbackForExtDialogOpen"
    > 
      <div class="ext-content">
         <div
         class="item margin-bottom-10"
         v-for="(item, index) in outParticipantGuids"
         :key="index"
         >
            <div class="df ac">
               <!-- 序号 -->
               <span class="ext-content-num">{{index+1}}.</span>
               <!-- 名称 -->
               <el-input
                  :placeholder="$t('message.fullName')"
                  class="input1"
                  v-model="item.name"
                  clearable
               ></el-input>
               <!-- 邮箱 -->
               <el-input
                  :placeholder="$t('message.mailbox')"
                  class="input2"
                  v-model="item.email"
                  clearable
               ></el-input>
               <!-- 电话 -->
               <el-input
                  :placeholder="$t('placeholder.phone')"
                  class="input2"
                  v-model="item.phone"
                  oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                  maxlength="11"
                  clearable
               ></el-input>
               <!-- 新增 -->
               <el-button
                  type="text"
                  class="plus-btn"
                  icon="el-icon-circle-plus-outline"
                  v-if="index === 0"
                  @click="editOtherParticipant()"
                  ></el-button
               >
               <!-- 删除 -->
               <el-button
                  type="text"
                  class="remove-btn"
                  icon="el-icon-remove-outline"
                  v-else
                  @click="editOtherParticipant(index)"
                  ></el-button
               >
            </div>
            <div class="error-box">
               <div class="error-box-item nameError" v-if="item.nameError">{{ $t("message.nameError")}}</div>
               <div class="error-box-item emailError" v-if="item.mailError">{{ $t("message.mailError") }}</div>
               <div class="error-box-item phoneError" v-if="item.phoneError">{{ $t("message.phoneError")}}</div>
               <div class="error-box-item mailPhoneError" v-if="item.error">{{ $t("message.mailPhoneError")}}</div>
            </div>
         </div>
      </div>
      <div slot="footer" class="dialog-footer">
         <div class="footer-tips">提示：<span class="footer-tips-item">电话/邮箱信息，请务必输入其中一项<br>用于接收邮件/短信通知</span></div>
         <el-button style="margin-right: 20px"  @click="extVisible = false">{{$t("button.cancel")}}</el-button>
         <el-button v-show="dataType === 2" type="primary"  @click="addExtMeetPeople">{{
          $t("button.confirm")
         }}</el-button>
      </div>
    </el-dialog>

    <!-- 内部参会人弹窗 -->
    <el-dialog
      width="890px"
      :title="$t('message.addInteParticipants')"
      :visible.sync="innerVisible"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="res-dialog"
      @open="callbackForInnerDialogOpen"
    > 
      <div class="search-group" v-show="dataType === 2">
         <div class="search-group-item">
            {{$t('message.fullName')}}：
            <el-input
               class="inline-input"
               v-model="searchName"
               clearable
               @clear="clearHandle"
            ></el-input>
         </div>
         <!-- <div class="search-group-item">
            {{$t('labe.Department')}}：
            <el-input
               class="inline-input"
               v-model="searchDep"
               clearable
            ></el-input>
         </div> -->
         <el-button class="search-btn" type="primary" @click="searchHandle">{{$t('button.search')}}</el-button>
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
          <el-table
            :data="participantGuids"
            border
            style="width: 100%">
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
               width="80">
            </el-table-column>
            <!-- 部门 -->
            <el-table-column
               prop="department_name"
               :label="$t('labe.Department')"
               align="center"
               show-overflow-tooltip
               >
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
            v-show="dataType === 2"
            :label="$t('message.operation')"
            align="center"
            width="80">
               <template slot-scope="scope">
                  <el-button
                     type="text"
                     class="right-delete"
                     @click="deleteDep(scope.$index)"
                     :disabled="dataType===1"
                     >
                     {{ $t("button.delete") }}
                  </el-button>
               </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="margin-right: 20px"  @click="innerVisible = false">{{$t("button.cancel")}}</el-button>
        <el-button v-show="dataType === 2" type="primary"  @click="addMeetingPeople">{{
          $t("button.confirm")
        }}</el-button>
      </div>
    </el-dialog>
    <!-- /选择参会人员 -->
 </div>
</template>

<script>
import {
   getMeetingDetailApi,
   getDepartmentApi,
   getMeetingTypeApi,
   getServiceApi,
   getEquipmentApi,
   saveMeetEditApi
} from '@/api/currentMeet'
import dayjs from "dayjs";
export default {
  data() {
     return {
        formLoading: false,
        ruleForm: {
           is_property: '',
           repe_type: 1,
           repe_types: '',
           remark: '',
        },
        participantGuids: '', // 内部参会人员id
        participantVal: '', // 内部参会人员集合
        meetTypeList: [], // 会议类型
        serviceList: [], // 茶点服务
        equipmentList: [], // 设备信息
        category: ['', '单次预约', '重复预约', '跨日预约'],
        repetitionType: ['', '每日', '每周', '每月'],
        categoryStr: '', // 会议重复类型
        reapSessions: '',// 重复总场次
        weekDecstr: '', // 每天/每周/每月
        meetTime: '', // 会议时间
        equipmentStr: '',// 设备
        checkListEquipment: [], // 选中的设备
        isExpand: false, // 是否展开
        innerVisible: false, // 内部参会人员 
        extVisible: false, // 外部参与人员
        joinData: [],// 弹窗内参会人员
        searchName: '', // 搜索员工名称
        searchDep: '', // 搜索员工部门
        allPeopleInfo: [], // 所有部门人员
        queryPeople: [], // 搜寻人员
        defaultProps: { // tree配置
         children: 'children',
         label: 'name'
        },
        defaultChecked: [], // 默认展开被选中的参会人员
        error: { // 验证提示
        title: { isFocus: false },
      },
         outParticipantGuids: [],
         outParticipantVal: ''
     }
  },
  props: {
   dataType: {
      require: true,
      type: Number
   }
  },
  mounted() {
   let params = this.$route.params
   // 获取详情信息
   this.getDateilsInfo(params.id)
   
   // 获取会议类型
   this.getMeetingTypeInfo()
   // 获取部门信息
   this.getDepartmentInfo()
   
   // 设备
   this.getEquipmentInfo()
   // 注销onresizes事件
    window.onresize = null;
   // 活动菜单
   let menu = this.$route.params.menu
   this.$route.meta.activeMenu = menu === 'current' ? '/current/current_list' : '/history/history_list'
  },
  methods: {
   
     // 获取详情
   getDateilsInfo(id) {
      this.formLoading = true
      getMeetingDetailApi({id: id}).then( res=> {
         this.ruleForm = res.data.meeting
         // 会议时间
         this.meetTime = this.setMeetTime(this.ruleForm.start, this.ruleForm.end, this.ruleForm.category)
         // 预约类型
         this.categoryStr = this.category[this.ruleForm.category]
         // 重复预约计算场次, 重复类型
         if(this.ruleForm.category==2){
           this.repeatEndTimeHandle()
           // 预约类型
           this.categoryStr = `${this.category[this.ruleForm.category]}（${this.repetitionType[this.ruleForm.repetition_type]}）`
         }

         // 茶点服务
         this.ruleForm.serviceId = []
         this.ruleForm.service && this.ruleForm.service.map(item=> {
            this.ruleForm.serviceId.push(item.id)
         })
         // 获取服务
         this.getServiceInfo()
         // if(this.ruleForm.service.length>0){
         //    let services = this.ruleForm.service
         //    services.map(res=>{
         //       res.value = 0
         //    })
         //    this.serviceList = services 
         // }
         
         
         
         // 设备
          let device = ''
          this.ruleForm.equipment && this.ruleForm.equipment.forEach((item) => {
            device = device ? device + ' / ' + item.name : item.name
            this.checkListEquipment.push(item.id)
          })
          this.equipmentStr = device || '--'

         // 内部参会人员
         let str = ''
         let arr = []
         this.ruleForm.inside_participant && this.ruleForm.inside_participant.forEach((item) => {
            arr.push({ id: item.id, name: item.name,  department_name: item.department_name})
            str = str ? str + '，' + item.name : item.name
         })
         this.participantGuids = arr
         this.participantVal = str
         
         // 外部参会人
         this.outParticipantHandle()
         
         // let equipment = this.ruleForm.equipment

         this.formLoading = false

      })
   },
   // 获取茶点服务
   getServiceInfo() {
      getServiceApi({}).then(res => {
        let services = res.data.services 
        if(this.ruleForm.service.length>0){
           this.ruleForm.service.map(res=>{
            services.map(item=>{
               if(res.id == item.id){
                 item.value = res.value
               }
            })
           })
        }else{
         services.map(res=>{
           res.value = 0
         })
        }
        this.serviceList = services 
      })
   },
   // 选择茶点服务
   selectServeChange(arr){
      var arr3 = this.serviceList.filter(v => {
         return arr.every(e => e != v.id);
      });
      this.serviceList.map(res=>{
         arr3.map(item=>{
            if(res.id == item.id){
               res.value = 0
            }
         })
      })

      let arrs = []
      this.serviceList.map(res=>{
         arr.map(item=>{
            if(res.id == item){
               let obj={
                  name: res.name,
                  id: res.id,
                  value: res.value
               }
               arrs.push(obj)
            }
         })
      })
      this.ruleForm.service = arrs
   },
   // 修改茶点
   changeValueHandle(item){
      this.serviceList.map(res=>{
         if(res.id == item.id){
            res.value = item.value 
         }
      })
   },
   // 选择设备
   selectEquimentChange() {
      
   },
   // 重复预约： 计算场次、会议重复类型
   repeatEndTimeHandle() {
       let types = this.ruleForm.repetition_type
       let day = 24 * 60 * 60 * 1000
       let week = 7 * day
       let month = 30 * day
       let start_time = this.ruleForm.start.split(" ")
       let startTimes = dayjs(this.ruleForm.start.split(' ')[0]).valueOf() // 开始日期时间戳
       let stopTimes = dayjs(this.ruleForm.repetition_end_date).valueOf() // 结束日期时间戳
       let step = stopTimes - startTimes
       let dec = 1
       let weekDec = ''
       switch(types) {
         case 1:
           dec += parseInt(step / day) // 重复每天
           weekDec = '（每日）'
          break;
         case 2:
           dec += parseInt(step / week) // 重复每周
           let weeks = this.getWeek(start_time[0])
           weekDec = `（${weeks}）`
          break;
         case 3:
           dec += parseInt(step / month) // 重复每月
           let dates = parseFloat(start_time[0].split('-')[2])
           weekDec = `（每月${dates}号）` 
          break;
       }
       this.reapSessions = dec ? ` 共${dec}场会议` : ''
       this.meetTime = `${this.meetTime} ${weekDec}` 
    },
    // 获取周
    getWeek(dateString) {
        let dateArray = dateString.split("-");
        let dates = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
        let week = "周" + "日一二三四五六".charAt(dates.getDay())
        return week
    },
   //  添加外部参会人弹窗
   showExtDialog() {
      if(this.dataType==1){// 详情
         return
      }
      this.extVisible = true
      this.outParticipantHandle()
   },
   // 外部参会人数据处理
   outParticipantHandle(){
      let strExt = ''
      let arrExt = []
      let valExt = [{ name: '',  email: '', phone: '', nameError: false, mailError: false, phoneError: false,  error: false}]
      let outData = this.ruleForm.out_participant 
      if (outData && outData.length > 0) {
         outData.forEach((item) => {
            if(item.name!=''){
              arrExt.push({ name: item.name,  email: item.email, phone: item.phone, nameError: false, mailError: false, phoneError: false,  error: false })
              strExt = strExt ? strExt + '，' + item.name : item.name
            }
            if(arrExt.length==0){
              arrExt = valExt      
            }
         })
      } else {
         arrExt = valExt
      }
      this.outParticipantGuids = arrExt
      this.outParticipantVal = strExt
   },
   // 选择外部参会人回调
    callbackForExtDialogOpen () {
      
    },
    // 外部参会人员新增、删除
    editOtherParticipant (index) {
      if (!isNaN(index)) {
        this.outParticipantGuids.splice(index, 1)
      } else {
        this.outParticipantGuids.unshift({ name: '', email: '', phone: '', nameError: false, mailError: false, phoneError: false,  error: false })
      }
    },
    // 确认外部参会人员
    addExtMeetPeople () {
       // 参会人名字 邮箱检验
      let flag = false
       let other = this.outParticipantGuids.map(item => { //filter
        if (item.email || item.name || item.phone) { 
          if(item.name === ''){// 名字
            flag = true
            item.nameError =true
            console.log(item.error,'item.name')
          }else{
            item.nameError =false
          }
          if(item.phone == '' && item.email == ''){
            flag = true
            item.error = true
            item.mailError = false
            item.phoneError = false
          }else{
            if(item.email != ''){
               var reg = /^(\w)+(\.\w+)*@(.)+((\.\w+)+)$/
               if (reg.test(item.email)) {// 邮箱
                  item.mailError = false
               } else {
                  flag = true
                  item.mailError = true
               }
            } else {
              item.mailError = false
            }
            if(item.phone != ''){
              let phonereg = /^[1][3,4,5,7,8][0-9]{9}$/;
              if (phonereg.test(item.phone)) {
                 item.phoneError = false
              }else{
                 flag = true
                 item.phoneError = true
              }
            }else{
               item.phoneError = false
            }
            item.error =false
          }
        }else{
          item.nameError =false
          item.mailError = false
          item.phoneError = false
          item.error =false
        }
      })
      if(flag){
         return false
      }
      // other.map(res=>{
      //    delete res.error
      //    delete res.nameError
      //    // delete res.phoneError
      // })
      this.ruleForm.out_participant = JSON.parse(JSON.stringify(this.outParticipantGuids))
      this.outParticipantHandle()
      this.extVisible = false
      
    },
   // 显示内部参会人员弹框
    showInnerDialog () {
      if(this.dataType==1){// 详情
         return
      }
      this.innerVisible = true
      this.participantGuids = this.ruleForm.inside_participant.map(item => {
        return {
         department_name: item.department_name,
         name: item.name,
         id: item.id
        }
      })
    },
    // 选择参会人会的面板开启回调设置选中节点
    callbackForInnerDialogOpen () {
      this.defaultChecked = this.participantGuids.map(item => {
        return item.id
      })
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.defaultChecked)
      })
    },
    // 勾选参会人
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
      this.participantGuids.forEach(ele => {
        const filterArr = queryArr.filter(e => e.id === ele.id)
        if (filterArr.length === 0) {
          extraPeople.push(ele)
        }
      })
    
      this.participantGuids = extraPeople.concat(arr)
    },
   //  删除参会人
    deleteDep(index) {
      this.participantGuids.splice(index, 1)
      this.callbackForInnerDialogOpen()
    },
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
    // 确认选择内部参会人员
    addMeetingPeople () {
      let str = ''
      let arr = this.participantGuids.map((item) => {
        str = str ? str + '，' + item.name : item.name
        return {
          id: item.id,
          name: item.name,
          department_name: item.department_name
        }
      })
      if(arr && arr.length == 0){
        this.$message({
           message: '请勾选内部参会人员',
           type: 'error'
        })
        return
      }
      this.ruleForm.inside_participant = arr
      this.participantVal = str
      this.innerVisible = false
    },
    // 转换tree数据
    transformDatabase (arr, depName) {
      arr.forEach(item => {
         if(item.children) {
            if ( item.children.length !== 0) {
               let names1 = depName ? `${depName} / ${item['name']}` : item['name']
               this.transformDatabase(item.children, names1)
            }else{
               let names = depName?`${depName}`:''
               item['department_name'] = names
            }
         }else{
            item['department_name'] = depName
         }
      })
      return arr
    },
   // 获取部门
   getDepartmentInfo() {
     getDepartmentApi({}).then(res => {
        const allData = this.transformDatabase(res.data.departments)
        this.allPeopleInfo = allData
        this.queryPeople = this.allPeopleInfo
     })
   },
   // 搜索内部参与人员
   searchHandle(){
      let name = this.searchName
      let dep = this.searchDep
      this.$refs.tree.filter(name);
   },
   // 清除搜索
   clearHandle(){
      this.$refs.tree.filter();
   },
   // tree节点过滤
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },


   // 保存编辑
   save() {
      if(!this.ruleForm.title) {
        this.$message({
           message: '标题不能为空',
           type: 'error'
        })
        return
      }
      let insidePar= JSON.parse(JSON.stringify(this.ruleForm.inside_participant))
      // 内部参会人
      insidePar.map(res=>{
         delete res.department_name
      })
      let outPar = JSON.parse(JSON.stringify(this.ruleForm.out_participant))
      // 外部参会人
      outPar.map(res=>{
         delete res.error
         delete res.nameError
         delete res.mailError
         delete res.phoneError
      })

      // 设备
      let equ = []
      this.equipmentList.map(res=>{
         this.checkListEquipment.map(e=> {
            if(res.id == e){
              equ.push(res)
            }
         })
      })
      
      let dataJson = {
         id: this.ruleForm.id,
         title: this.ruleForm.title,	//是	string	主题
         is_secrecy: this.ruleForm.is_secrecy,	//是	number: '',	//是否保密会议 0公开 1保密
         inside_participant: insidePar, //	否	array	内部参会人数组
         out_participant: outPar,//	否	array	外部参会人数组
         meeting_type_id: this.ruleForm.meeting_type_id || '',	//是	number	会议类型
         meeting_type_name: this.ruleForm.meeting_type_name || '',	//是	string	会议类型 名称
         service: this.ruleForm.service, //	否	array	茶点服务数组
         equipment: equ, // 否	array	设备数组
         remark: this.ruleForm.remark
      }
      saveMeetEditApi(dataJson).then(res=> {
         this.$message({
            message: this.$t('tip.infoEditSuccess'),
            type: 'success'
         })
         this.$router.push('/current')
      })
   },
   
   setMeetTime(start, end, type){
      let time = type === 2 ? `${start.split(' ')[1]} - ${end.split(' ')[1]}` : `${start} - ${end}`
      // if(type === 2){
      //   time = `${start.split(' ')[1]} - ${end.split(' ')[1]}`
      // }else{
      //    time = `${start} - ${end}`
      // }
      return time
   },
   // 获取会议类型
   getMeetingTypeInfo() {
     getMeetingTypeApi({}).then(res => {
        this.meetTypeList = res.data.meeting_type
     })
   },
   
   
   // 设备信息
   getEquipmentInfo() {
     getEquipmentApi().then(res => {
        this.equipmentList = res.data.equipments
     })
   }
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
    }
}
.meeting-edit-wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    padding: 0 0 10px;
    width: 100%;
    min-width: 600px;
    overflow-y: auto;
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
            margin: 23px 0 27px;
            position: relative;
            padding-left: 10px;
            font-size: 14px;
            font-weight: 700;
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
              font-size: 14px;
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
                  min-width: 140px;
                  text-align: right;
                  padding-right: 4px;
                  .warring{
                    color: #DD0000;
                  }
              }
              .edit-box-value{
                color: #898FA8;
                .edit-box-service{
                  margin-top: 20px;
                  min-width: 600px;
                }
                .edit-box-refreshment{
                  display: inline-block;
                  justify-content: space-between;
                  margin-bottom: 10px;
                  margin-right: 10px;
                  .edit-refreshment-label{
                     display: inline-block;
                     height: 36px;
                     text-align: left;
                     color: #B1BFCD;
                     line-height: 36px;
                  }
                  /deep/.el-input--medium{
                     display: inline-block;
                     width: 94px;
                  }
                  .set-bg{
                     background-color: #F5F7FA;
                     border-color: #E4E7ED;
                     color: #C0C4CC;
                     cursor: not-allowed;
                  }
                  /deep/.el-input__inner{
                     text-align: left;
                     color: #B1BFCD;
                  }
                  .highlight{
                     color: #43434D;
                     /deep/.el-input__inner{
                        color: #43434D;
                     }
                  }
                }
                /deep/.el-tag.el-tag--info{
                  background-color: #5C7BEA;
                  border-color: #5C7BEA;
                  color: #ffffff;
                  .el-tag__close.el-icon-close{
                     color: #717171;
                     background-color: #ffffff;
                  }
                  
                }
              }
               /deep/.el-tag.el-tag--info .el-tag__close:hover {
                  color: #FFF !important;
                  background-color: #c3c3c3 !important;
               }  

              .edit-box-repeat_time{
                 position: absolute;
                  left: 386px;
                  top: -14px;
                  font-size: 12px;
                  color: #ABBAC9;
              }

              .max_heigth{
               max-height: 184px;
               overflow-y: auto;
               padding-right: 30px;
              }

              .border{
                display: inline-block;
                width: 375px;
                color: #384677;
                min-height: 34px;
                line-height: 24px;
                border-radius: 4px;
                padding:5px 15px;
                cursor: pointer;
                border: 1px #DFE4EB solid;
              }
              .disabled_edit{
                background-color: #F5F7FA;
                border-color: #E4E7ED;
                color: #C0C4CC;
                cursor: not-allowed;
              }
              .edit-box-input{
                  width: 375px;
              }
              .edit-box-total{
                 color: #34343F;
              }
              .edit-nex-input{
                width: 182px;
                margin-right: 10px;
              }
              .edit-nex-select{
                width: 183px;
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

              .error {
                position: absolute;
                color: #f00;
                left: 580px;
                white-space: nowrap;
              }
              .stop-date{
                top: 36px;
                left: 298px;
              }
              .select-tips{
                position: absolute;
                top: 7px;
                font-size: 14px;
                color:#f00;
              }
              .start-tips{
                left: 575px;
              }
              .stop-tips{
                left: 575px;
              }

              .picker-box{
                position: relative;
                width: 375px;
                height: 32px;
                .picker-bg{
                  position: absolute;
                  top: 0;
                  left: 0;
                  z-index: 2;
                  opacity: 0;
                }
                .picker-input{
                  position: absolute;
                  top: 0;
                  left: 0;
                  z-index: 1;
                }
              }
          }

         .edit-service-tips {
            margin-left: 58px;
            color: #ABBAC9;
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
            // position: absolute;
            // left: 430px;
            // top: -16px;
            color: #ABBAC9;
          }
          .edit-box-cross-tips{
            position: absolute;
            left: 575px;
            white-space: nowrap;
            color: #ABBAC9;
          }

          .margin-top{
            margin-top: 24px;
          }
        }
        .edit-sign_in{
           position: absolute;
           top: 30px;
           right: 20px;
        }
        .f-start{
            align-items: flex-start !important;
        }

    }
    .edit-botton{
        padding-top: 20px;
    }
    .margin-top-10{
        margin-top: 10px;
    }
    .margin-left-6{
        margin-left: 6px;
    }
    .margin-bottom-10{
        margin-bottom: 10px;
    }

    /deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
      background-color: #409EFF !important;
      border-color: #409EFF !important;
   }

   /deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
      border-color: #ffffff !important;
   }
 }
//  修改预约时间
 .meet-time-content{
    font-size: 14px;
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
        top: 38px;
        font-size: 12px;
        color:#DD0000;
      }
      .start-tips{
        left: 120px;
      }
      .stop-tips{
        right: 67px;
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
        top: 38px;
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

  .search-group{
     display: flex;
     margin-bottom: 20px;
     .search-group-item{
         display: flex;
         justify-content: center;
         align-items: center;
         padding-left: 10px;
        /deep/.el-input--medium{
            flex: 1;
            width: 120px;
        }
     }
     .search-btn{
        margin-left: 20px;
     }
  }

   .ext-content{
      max-height: 400px;
      overflow-y: auto;
     .item {
         margin-bottom: 10px;
         .input1 {
            width: 120px;
         }
         .input2 {
            width: 200px;
            margin: 0 8px;
         }
         .input3 {
            width: 120px;
            margin: 0 8px;
         }
         .error-box{
            position: relative;
            clear: both;
            color: #DD0000;
            .error-box-item{
               position: absolute;
               top: -2px;
               font-size: 12px;
            }
            .nameError {
               left: 32px;
            }
            .emailError {
               left: 160px;
            }
            .phoneError {
               left: 376px;
            }
            .mailPhoneError{
               left: 32px;
            }
         }
         .nameError{
            flex: 1;
         }
         .emailError{
            flex: 1;
            text-align: right;
            padding-right: 25px;
         }

         .plus-btn{
            font-size: 24px;
            color: #ABBAC9;
         }

         .remove-btn{
            font-size: 24px;
            color: #FF5B5B;
         }
         
         .ext-content-num{
            display: inline-block;
            margin-right: 10px;
            min-width: 22px;
            text-align: right;
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
   .dialog-footer{
      position: relative;
   }
   .footer-tips{
      display: flex;
      float: left;
      margin-top: 2px;
      font-size: 14px;
      color: #ABBAC9;
      .footer-tips-item{
         text-align: left;
         display: inline-block;
      }
   }

  // 参会人员 
  .join-content {
     border: 1px #ddd solid;
    .left {
      box-sizing: border-box;
      height: 400px;
      min-width: 330px;
      // overflow-y: auto;
      .el-tree {
        height: 100%;
        padding: 10px 15px;
        overflow-y: auto;
        .el-checkbox__inner {
          margin-right: 5px;
        }
      }
    }
    .right {
      flex: 1;
      height: 400px;
      overflow-y: auto;
      padding: 10px 15px;
      border-left: 1px solid #ddd;
      .right-delete{
        color: #FF5B5B;
      }
      /deep/.el-table tr{
         color: #58585D;
         font-weight: normal !important;
      }
      /deep/th{
         font-weight: normal !important;
      }
    }
  }

  .res-dialog{
    // 弹窗头部
    .el-dialog__header{
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
    .el-dialog__footer{
      text-align: center;
      .dialog-footer {
        .el-button {
          width: 80px;
          height:36px;
        }
      }
    }
  }

  .scrollColor::-webkit-scrollbar {
      /*滚动条整体样式*/
      width : 8px;  /*高宽分别对应横竖滚动条的尺寸*/
      height: 8px;
   }
   .scrollColor::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 4px;
      // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
      background   : #cacaca;
   }
   .scrollColor::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      background   : #EAEDF6;
   }
  

</style>