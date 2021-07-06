<template>
  <div class="app-wrap user-wrap"> 
    <h2 class="user-title">{{$t('message.essentialInformation')}}</h2>
    <div class="user-list">
       <div class="user-list-left">
            <div class="user-list-box">
               <span class="user-list-labe">{{$t('labe.Account')}}：</span>
               <span class="user-list-value">{{userForm.name||'--'}}</span>    
            </div>
            <div class="user-list-box">
               <span class="user-list-labe">{{$t('labe.Password')}}：</span>
               <span class="user-list-value">******</span>
               <!-- <span class="user-list-value">{{isOpen ? (saveForm.pass?saveForm.pass:'--') : '******'}}</span>  -->
               <!-- <span class="user-list-view" :class="{'is-open': isOpen}" @click="openView"></span> -->
               <span class="user-list-set" @click="setPassword">{{$t('button.modify')}}</span>   
            </div>
            <div class="user-list-box">
               <span class="user-list-labe">{{$t('labe.RealName')}}：</span>
               <span class="user-list-value">{{userForm.nickname||'--'}}</span>    
            </div>
            <div class="user-list-box">
               <span class="user-list-labe">{{$t('labe.Gender')}}：</span>
               <span class="user-list-value">{{sexList[userForm.sex]||'--'}}</span>    
            </div>
            <div class="user-list-box">
               <span class="user-list-labe">{{$t('labe.Birthday')}}：</span>
               <span class="user-list-value">{{userForm.birthday||'--'}}</span>    
            </div>
            <div class="user-list-box">
               <span class="user-list-labe">{{$t('labe.Department')}}：</span>
               <span class="user-list-value">{{userForm.department_id||'--'}}</span>    
            </div>
            <div class="user-list-box">
               <span class="user-list-labe">{{$t('labe.Position')}}：</span>
               <span class="user-list-value">{{userForm.name||'--'}}</span>    
            </div>
            <div class="user-list-box">
               <span class="user-list-labe">{{$t('labe.Telephone')}}：</span>
               <span class="user-list-value">{{userForm.phone||'--'}}</span>    
            </div>
            <div class="user-list-box">
               <span class="user-list-labe">{{$t('labe.Email')}}：</span>
               <span class="user-list-value">{{userForm.email||'--'}}</span>    

            </div>
            <div class="user-list-box">
               <span class="user-list-labe">{{$t('labe.Role')}}：</span>
               <span class="user-list-value">{{userForm.name||'--'}}</span>    
            </div>
            <!-- 保存 -->
            <div class="btn-group">
               <el-button type="primary" @click="serve" :loading="saveLoading">{{$t('button.save')}}</el-button>
            </div>
         </div>
         
         <!-- 头像 -->
         <div class="user-image">
            <upload
               :img.sync="imgUrl"
               :onSuccess="uploadSuccess"
            />
            <div class="user-image-name">{{userForm.name}}</div>
         </div>

    </div>
    <!-- 修改密码 -->
   <el-dialog
      width="460px"
      :title="$t('message.setPassord')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="handleClose">
      <div class="">
         <el-form :model="passwordForm" :rules="rules" ref="ruleForm" label-width="100px" class="pass-Form">
            <el-form-item :label="$t('message.originalPassword')" prop="oldPass">
               <el-input type="password" v-model="passwordForm.oldPass" autocomplete="off" show-password clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('message.newPassword')" prop="pass">
               <el-input type="password" v-model="passwordForm.pass" autocomplete="off" maxLength="20" clearable></el-input>
               <span class="pass-rules-tips">{{$t('message.passwordRules')}}</span>
            </el-form-item>
            <el-form-item :label="$t('message.confirmPassword')" prop="newkPass">
               <el-input type="password" v-model="passwordForm.newkPass" autocomplete="off" maxLength="20" clearable></el-input>
            </el-form-item>
            <el-form-item>
               <el-button @click="dialogVisible = false">{{$t('button.cancel')}}</el-button>
               <el-button type="primary" :loading="submitLoading" @click="submitForm('ruleForm')">{{$t('button.confirm')}}</el-button>
            </el-form-item>
         </el-form>
      </div>
   </el-dialog>
  </div>
</template>

<script>
import upload from '@/components/Upload'
import { getInfoApi, resetPassApi, serviceCenterApi } from '@/api/user'
import { imgBaseUrl } from '@/utils/varible'
export default {
  components: {upload},
  data(){
     var validatePass0 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原密码'));
        } else {
          callback();
        }
      };
     var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.passwordForm.newkPass !== '') {
            // let reg =/^(?![0-9]+$)[0-9]{6,20}$/
            let reg = /^.{6,20}$/ // /^[^\s]{6,20}$/ 不含空格; // 6-20位数字、字母和特殊字符(仅限!@#$%^&*())
            let re = new RegExp(reg)
            if (!re.test(value)) { 
               callback(new Error(this.$t('message.passwordRules')));
               return false; 
            }
            callback();
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passwordForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      dialogVisible: false, // 修改密码弹窗
      userDialogVisible: false,// 修改用户头像
      saveLoading: false,// 保存按钮loading
      submitLoading: false, // 确认密码按钮loading
      baseURL: imgBaseUrl,
      userForm: {},
      sexList: ['女', '男'],
      imgUrl: 'https://alc01.aa-iot.com/storage/uploads/user/QWRnUNs6BQ2dFjzDrsZMIUvyA.png',
      baseImg: require('../../assets/user.png'),
      isOpen: false, // 显示密码
      saveForm: {},
      thumb_avatar_file: '',
      passwordForm: {
         oldPass: '', // 旧密码
         pass: '', // 新密码
         newkPass: '',// 确认密码
      },
      rules: {
         oldPass: [
           { validator: validatePass0, trigger: 'blur', required: true }
         ],
         pass: [
           { validator: validatePass, trigger: 'blur', required: true }
         ],
         newkPass: [
           { validator: validatePass2, trigger: 'blur', required: true }
         ]
      },
      
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
      // 打开、关闭眼睛
     openView() {
        this.isOpen = !this.isOpen
     },
     // 上传图片
    imageUpload() {
      this.userDialogVisible = true
    },
    // 图片上传成功
    uploadSuccess (rawFile) {
      this.thumb_avatar_file = rawFile
    },
    /*用户信息*/
    async getUserInfo() {
       const result = await getInfoApi()
       this.userForm = result.data.user
       this.imgUrl = this.userForm.thumb_avatar ? this.baseURL + this.userForm.thumb_avatar : this.baseImg
    },
    /*修改密码*/ 
    setPassword() {
       this.dialogVisible = true
    },
    
   //  确认密码
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
         if (valid) {
          let params= {
            old_password: this.passwordForm.oldPass,
            password: this.passwordForm.pass,
            password_confirmation: this.passwordForm.newkPass,
          }
          this.saveForm= JSON.parse(JSON.stringify(this.passwordForm))
          this.submitLoading = true
          resetPassApi(params).then(res=> {
            this.submitLoading = false
            if(res.meta.code == 'RESP_OKAY'){
               this.dialogVisible = false
            }
          })
         }
      });
   },
   // 保存
   serve() {
      const formData = new FormData()
      formData.append('_method', 'put')
      formData.append('nickname', this.userForm.nickname)
      this.saveForm.pass && formData.append('password', this.saveForm.pass)
      this.thumb_avatar_file && formData.append('thumb_avatar', this.thumb_avatar_file)
      this.saveLoading = true
      serviceCenterApi(formData, this.userForm.id).then(res=>{
         this.saveLoading = false
         if(res.meta.code == 'RESP_OKAY'){
            this.$message({
               message: this.$t('message.saveSuccess'),
               type: 'success'
            })
            this.getUserInfo()
            this.$store.dispatch('user/getInfo')
            this.passwordForm= {
               oldPass: '', // 旧密码
               pass: '', // 新密码
               newkPass: '',// 确认密码
            }
            this.saveForm.pass = ''
         }
      })
   },
   // 重置
   resetForm(formName) {
      this.$refs[formName].resetFields();
   },
   //  弹窗关闭
    handleClose() {
      //  this.passwordForm= {
      //    oldPass: '', // 旧密码
      //    pass: '', // 新密码
      //    newkPass: '',// 确认密码
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.user-title{
   font-size: 16px;
    color: #43434D;
   margin: 24px 0;
}
   .user-list {
    display: flex;
    justify-content: space-between;
    padding-left: 30px;
      .user-list-left {
         flex: 1;
         min-width: 300px;
      }
      .user-list-box {
        margin-bottom: 34px;
        font-size: 14px;
      }
      .user-list-labe {
        color: #A6B6C6;
      }
      .user-list-value {
        color: #58585D;
      }
      .user-list-view{
         display: inline-block;
         width: 18px;
         height: 9px;
         background: url('../../assets/icon/view_1.png') no-repeat;
         background-size: contain;
         margin-left: 20px;
         cursor: pointer;
      }
      .is-open{
         margin-left: 20px;
         background: url('../../assets/icon/view_opens.png') no-repeat;
         background-size: contain;
         background-position: center;
      }
      .user-list-set{
         display: inline-block;
         color: #FF5B5B;
         margin-left: 20px;
         cursor: pointer;
      }
}
.btn-group{
   padding-left: 88px;
   margin-bottom: 60px;
}
.user-image{
   width: 180px;
   .user-image-name {
      text-align: center;
      padding: 18px 0;
      color: #43434D;
      font-size: 18px;
   }
}

.pass-Form{
   .pass-rules-tips{
      position: absolute;
      top: -27px;
      right: 0;
      font-size: 12px;
      color: #5473E8;
   }
  /deep/.el-form-item__content{
      text-align: right;
   }
}

</style>