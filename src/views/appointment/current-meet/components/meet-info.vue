/*
* 会议详情 
*/
<template>
 <div class="app-wrap no-padding detail-wrap no-bg">
    <div class="save-submit">
      <el-button type="button" class="reservation-submit el-button--primary" >{{$t('button.save')}}</el-button>
    </div>
    <div class="meeting-edit-wrap">

      <!-- 会议信息 -->
      <div class="edit-box">
         <div class="edit-box-title">{{$t('placeholder.conferenceInfor')}}</div>
         <div class="edit-box-list">
            <!-- 会议地点 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('labe.meetAddress')}}：</div>
               <div class="edit-box-value">{{$t('message.nothing')}}</div>
            </div>
            <!-- 会议设备 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('labe.equipmentOfroom')}}：</div>
               <div class="edit-box-value">{{$t('message.nothing')}}</div>
            </div>
            <!-- 预约类型 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('labe.AppointmentType')}}：</div>
               <div class="edit-box-value">{{$t('message.nothing')}}</div>
            </div>
         </div>
      </div>

      <!-- 基本信息 -->
      <div class="edit-box">
         <div class="edit-box-title">{{$t('message.essentialInformation')}}</div>
         <div class="edit-box-list">
            <!-- 会议信息 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('placeholder.conferenceInfor')}}：</div>
               <div>
                     <el-radio-group v-model="ruleForm.is_property">
                     <el-radio  :label="1">{{$t('message.open')}}</el-radio>
                     <el-radio  :label="0">{{$t('message.private')}}</el-radio>
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
                     clearable
                  ></el-input>
               </div>
               <div class="error" v-if="error.title.isFocus">
                  {{$t('placeholder.validateTheme')}}
               </div>
            </div>
            <!-- 重复开始时间 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('message.repeatStartTime')}}：</div>
               <div class="edit-box-value">
                  <el-input
                     class="input edit-box-input"
                     v-model="ruleForm.title"
                     disabled
                  ></el-input>
               </div>
            </div>
            <!-- 重复结束时间 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('message.repeatTime')}}：</div>
               <div class="edit-box-value">
                  <el-input
                     class="input edit-box-input"
                     v-model="ruleForm.title"
                     disabled
                  ></el-input>
               </div>
            </div>
            <!-- 会议时间 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('message.meetingTime')}}：</div>
               <div class="edit-box-value">
                  <el-input
                     class="input edit-box-input"
                     v-model="ruleForm.title"
                     disabled
                  ></el-input>
               </div>
            </div>
            <!-- 会议类型 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('message.meetingTime')}}：</div>
               <div class="edit-box-value">
                  <el-select 
                     v-model="ruleForm.repe_type" 
                     class="edit-box-input"
                  >
                     <el-option
                     v-for="item in ruleForm.repe_types"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"
                     ></el-option>
                  </el-select>
               </div>
            </div>
            
            <!-- 内部参会人 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('message.internalParticipants')}}：</div>
               <div class="edit-box-value">
                  <el-input
                     class="input edit-box-input"
                     v-model="ruleForm.title"
                  ></el-input>
               </div>
            </div>
            <!-- 外部参会人 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('message.externalParticipants')}}：</div>
               <div class="edit-box-value">
                  <el-input
                     class="input edit-box-input"
                     v-model="ruleForm.title"
                  ></el-input>
               </div>
            </div>
         </div>
      </div>

      <!-- 会议服务 -->
      <div class="edit-box">
         <div class="edit-box-title">{{$t('route.service')}}</div>
         <div class="edit-box-list">
            <!-- 茶点服务 -->
            <div class="edit-box-item f-start">
               <div class="edit-box-label margin-top-10">{{$t('message.Refreshment')}}：</div>
               <div class="edit-box-value">
                  <div class="edit-box-refreshment" v-for="(item, index) in ruleForm.refreshment" :key="index">
                     <el-input type="input" v-model="item.label"></el-input>
                     <el-input type="input" v-model="item.value"></el-input>
                  </div>
               </div>
            </div>

            <!-- 设备服务 -->
            <div class="edit-box-item">
               <div class="edit-box-label">{{$t('message.equipmentServices')}}：</div>
               <div class="edit-box-value">
                  <el-checkbox-group v-model="checkList">
                     <el-checkbox v-for="(item,index) in ruleForm.equipmentServices" :label="item.value" :key="index">{{item.name}}</el-checkbox>
                  </el-checkbox-group>
               </div>
            </div>

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
               ></el-input>
            </div>
         </div>
      </div>

    </div>
 </div>
</template>

<script>
import {
   getMeetingDetailApi,
   getDepartmentApi
} from '@/api/currentMeet'
export default {
  data() {
     return {
        ruleForm: {
           is_property: '',
           repe_type: 1,
           repe_types: [
              {label: '常规会议', id: 1},
              {label: '外部会议', id: 2},
              {label: '内部会议', id: 3},
           ],
           refreshment: [
              {label: '矿泉水', value: '10'},
              {label: '咖啡', value: '10'},
              {label: '茶水', value: '10'},
              {label: '饮料', value: '10'},
           ],
           equipmentServices: [
              {name: '话筒', value: 1},
              {name: '投影仪', value: 2},
              {name: '电子笔', value: 3},
              {name: '音响', value: 4},
           ],
           remark: ''
        },
        checkList: [1,4],
        error: { // 验证提示
        room: {isFocus: false},
        title: { isFocus: false },
        type: { isFocus: false },
        number: { isFocus: false },
        company: { isFocus: false },
        area: { isFocus: false },
        repeType: {isFocus: false},
        repeTime: {isFocus: false},
        repeStartTime: {isFocus: false},
        nexDateStartTime: {isFocus: false},
        nexDateStopTime: {isFocus: false},
        nexStartTime: {isFocus: false},
        nexStopTime: {isFocus: false}
      },
     }
  },
  created() {
     let params = this.$route.params
   // 获取详情信息
   this.getDateilsInfo(params.id)
   // 获取部门信息
   this.getDepartmentInfo()
  },
  methods: {
   // 获取详情
   getDateilsInfo(id) {
      getMeetingDetailApi({id: id}).then(res=>{
         console.log(res,'res')
      })
   },
   // 获取部门
   getDepartmentInfo() {
     getDepartmentApi({}).then(res=>{
        console.log(res)
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
                .edit-box-refreshment{
                  display: flex;
                  justify-content: space-between;
                  width: 420px;
                  margin-bottom: 10px;
                  /deep/.el-input--medium{
                     margin-right: 10px;
                  }
                }
              }

              .border{
                display: inline-block;
                width: 375px;
                color: #384677;
                min-height: 32px;
                border-radius: 4px;
                line-height: 32px;
                padding:0 15px;
                cursor: pointer;
                border: 1px #DFE4EB solid;
              }
              .edit-box-input{
                  width: 375px;
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

 

  // 参会人员 
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
        text-align: center !important;
        .el-button {
          width: 90px;
          height: 32px;
        }
      }
    }
  }
  

</style>