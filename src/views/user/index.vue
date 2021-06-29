<template>
  <div class="app-wrap user-wrap"> 
    <h2 class="user-title">{{$t('message.essentialInformation')}}</h2>
    <div class="user-list">
        <div class="user-list-box">
           <span class="user-list-labe">{{$t('labe.Account')}}：</span>
           <span class="user-list-value">{{userForm.name||'--'}}</span>    
        </div>
        <div class="user-list-box">
           <span class="user-list-labe">{{$t('labe.Password')}}：</span>
           <span class="user-list-value">******</span> 
           <span class="user-list-view" :class="{'is-open': isOpen}" @click="isOpen=!isOpen"></span>
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
        
    </div>
    <div class="btn-group">
        <el-button type="primary" @click="serve">{{$t('button.save')}}</el-button>
    </div>
    <div class="user-image">
      <!-- <div class="user-image-item" @click="imageUpload" :style="{backgroundImage: 'url('+imgUrl+')'}">
         <span class="modify-imge">{{$t('button.modifyUserImg')}}</span>
      </div> -->
      <upload
         :img.sync="imgUrl"
         :onSuccess="uploadSuccess"
      />
      <div class="user-image-name">{{userForm.name}}</div>
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
               <el-input type="password" v-model="passwordForm.pass" autocomplete="off" clearable></el-input>
               <span class="pass-rules-tips">{{$t('message.passwordRules')}}</span>
            </el-form-item>
            <el-form-item :label="$t('message.confirmPassword')" prop="newkPass">
               <el-input type="password" v-model="passwordForm.newkPass" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item>
               <el-button @click="dialogVisible = false">{{$t('button.cancel')}}</el-button>
               <el-button type="primary" v-loading="submitLoading" @click="submitForm('ruleForm')">{{$t('button.confirm')}}</el-button>
            </el-form-item>
         </el-form>
      </div>
   </el-dialog>

   <!-- 头像弹框 -->
   <el-dialog
      width="460px"
      :title="$t('message.uploadAvatar')"
      :visible.sync="userDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="handleClose">
      <div class="">
        {{$t('message.uploadAvatar')}}
      </div>
   </el-dialog>


  </div>
</template>

<script>
import upload from '@/components/Upload'
import { getInfoApi, resetPassApi, serviceCenterApi } from '@/api/user'
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
            let reg =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
            let re = new RegExp(reg)
            console.log(value,'value')
            if (re.test(value)) { 
               callback();
            }else{ 
               callback(new Error(this.$t('message.passwordRules')));
               return false; 
            }
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
      dialogVisible: false, // 修改密码
      userDialogVisible: false,// 修改用户头像
      submitLoading: false, // 提交按钮loading
      baseURL: process.env.NODE_ENV === 'development' ? 'https://alc01.aa-iot.com/' : getHost(),
      userForm: {},
      sexList: ['女', '男'],
      imgUrl: 'http://up.enterdesk.com/edpic/31/c3/fd/31c3fdc63511cabedd6415d121fa2d58.jpg',
      baseImg: require('../../assets/user-icon.png'),
      isOpen: false, // 显示密码
      passwordForm: {
         oldPass: '', // 旧密码
         pass: '', // 新密码
         newkPass: '',// 确认密码
      },
      saveForm: {},
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
      thumb_avatar_file: ''
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
     // 上传图片
    imageUpload() {
      this.userDialogVisible = true
    },
    // 图片上传成功
    uploadSuccess (rawFile) {
      this.thumb_avatar_file = rawFile
      console.log(rawFile,'thumb_avatar_file')
    },
    /*用户信息*/
    async getUserInfo() {
       const result = await getInfoApi()
       this.userForm = result.data.user
       this.imgUrl = this.userForm.thumb_avatar ? this.baseURL + this.userForm.thumb_avatar : this.baseImg
       console.log(this.imgUrl,'imgUrl')
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
      let params = {
         id: this.userForm.id,
         password: this.saveForm.pass,
         thumb_avatar: this.thumb_avatar_file
      }
      const formData = new FormData()
      formData.append('password', this.saveForm.pass)
      formData.append('thumb_avatar', this.thumb_avatar_file)
      console.log(formData,'params')
      // return
     serviceCenterApi(formData, this.userForm.id).then(res=>{
        if(res.meta.code == 'RESP_OKAY'){
            this.$message({
               message: this.$t('message.saveSuccess'),
               type: 'success'
            })
            this.getUserInfo()
         }
        console.log(res,'res')
     })
   },
   // 重置
   resetForm(formName) {
      this.$refs[formName].resetFields();
   },
   //  弹窗关闭
    handleClose() {
       console.log('passwordForm')
       this.passwordForm= {
         oldPass: '', // 旧密码
         pass: '', // 新密码
         newkPass: '',// 确认密码
      }
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
    padding-left: 30px;
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
       background: url('../../assets/icon/view_opens.png') no-repeat;
       background-size: contain;
      margin-left: 20px;
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
   position: absolute;
   top: 30px;
   right: 130px;
   width: 180px;
   .user-image-item{
      width: 180px;
      height: 180px;
      cursor: pointer;
      // border-radius: 50%;
      background-size: cover;
      
      .modify-imge{
         display: none;
         position: absolute;
         top: 0;
         left: 0;
         width: 180px;
         height: 180px;
         border-radius: 50%;
         justify-content: center;
         align-items: center;
         color: #fff;
         font-size: 14px;
         background-color: rgba(0,0,0,0.3);
      }
      &:hover > .modify-imge:first-child{
         display: inline-flex;
      }  
   }
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