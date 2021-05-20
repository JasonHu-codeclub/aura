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
           <span class="user-list-set" @click="setPassword">修改</span>   
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
  </div>
</template>

<script>
import { getInfoApi } from '@/api/user'
export default {
  data(){
    return {
      userForm: {},
      sexList: ['女', '男']
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    /*用户信息*/
    async getUserInfo() {
       const result = await getInfoApi()
       this.userForm = result.data.user
    },
    /*修改密码*/ 
    setPassword() {
        console.log('修改密码')
    }
  }
}
</script>

<style lang="less" scope>
.user-title{
    font-size: 16px;
    color: #43434D;
    margin: 24px 0;
}
 .user-list {
    padding-left: 30px;
    .user-list-box {
        margin-bottom: 20px;
        font-size: 14px;
    }
    .user-list-labe {
        color: #A6B6C6;
    }
    .user-list-value {
        color: #58585D;
    }
    .user-list-set{
        display: inline-block;
        color: #FF5B5B;
        margin-left: 20px;
        cursor: pointer;
    }
}
</style>