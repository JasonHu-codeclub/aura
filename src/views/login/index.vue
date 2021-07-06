/*
 * Created: 2020-07-09 08:15:26
 * Author : Jan
 * Last Modified: 2021-03-24 11:34:13
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

<template>
  <div id="login">
    <div class="login-content">
      <h3 class="login-content-logo" :style="{backgroundImage: 'url(' + host + baseImg + ')'}"></h3>
      <div class="login-content-box">
        <div class="login-content-form">
          <div class="login-content-divider">
            <span class="divider-text">使用第三方账号登录</span>
          </div>
          <div class="login-content-type">
            <span class="login-content-type-icon login-content-type-weixin-1 margin-r-20" @click="handleLoginType('qiye')"></span>
            <span class="login-content-type-icon login-content-type-weixin-2" @click="handleLoginType('wechat')" ></span>
          </div>
          <div class="login-content-divider">
            <span class="divider-text">使用账号密码登录</span>
          </div>
          <div class="login-form">
              <el-form
              ref="ruleForm"
              :model="ruleForm"
              :rules="rules"
              label-width="80px"
              hide-required-asterisk
            >
                <el-form-item label="" prop="username">
                  <!-- <input  class="myinput"  v-model="ruleForm.username"> -->
                  <el-input placeholder="请输入用户名" v-model="ruleForm.username">
                    <template slot="prepend"><svg-icon icon-class="username" slot="label" /></template>
                  </el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                  <el-input 
                  type="password" 
                  show-password 
                  placeholder="请输入密码" 
                  v-model="ruleForm.password" 
                  @keyup.enter.native="handleLogin"
                  >
                    <template slot="prepend"><svg-icon icon-class="password" slot="label" /></template>
                  </el-input>
                </el-form-item>
                <div class="submit-btn">
                  <el-button type="primary" @click.native.prevent="handleLogin()" :loading="loginLoading">登录</el-button>
                </div>
              </el-form>
          </div>
        </div>
      </div>
      <div class="login-content-name">{{$t('message.loginTitle')}}</div>
    </div>
  </div>
</template>
<script>
import { imgBaseUrl } from '@/utils/varible'
import { getSystemInfoApi } from '@/api/user'
export default {
  components: {},
  data () {
    return {
      host: imgBaseUrl,
      baseImg: require('../../assets/logo.png'),
      loginLoading : false,
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: this.$t('tip.userNameNotEmpty'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('tip.pwdNotEmpty'), trigger: 'blur' }
        ]
      },
      redirect: undefined,
      appid: 'ww63beae6c0cd72cf1',
      agentid: '1000014',
      otherQuery: {},
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 登录
    handleLogin () {
      
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loginLoading = true
          this.$store.dispatch('user/login', { username: this.ruleForm.username, pwd: this.ruleForm.password, company: '' }).then((res) => {
            this.loginLoading = false
            if(res.meta.code=="RESP_OKAY"){
              this.$router.replace('/')
              // this.$router.replace({ path: this.redirect || '/', query: this.otherQuery })// 因为权限控制
            }
          })
        } 
      })
    },
    // 第三方登录
    handleLoginType (type) {
      if (type === 'qiye') { // 企业微信
        const redirect_uri = 'https://alc01.aa-iot.com/sp-pcmeet/#/login'
        window.location.href = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${this.appid}&agentid=${this.agentid}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=STATE`
      } else if (type === 'wechat') { // 微信登录
      }
    },
    getOtherQuery (query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
  },
  mounted () {
    // 获取系统前台信息
    // getSystemInfoApi().then(res=>{
    //   if(res){

    //   }
    // })
  },
  created() {
    /* 存在code,第三方登录 */
    if (this.otherQuery.code) {
      this.pageLoading = false
      this.$store.dispatch('user/otherLogin', { appid: this.appid, code: this.otherQuery.code, state: this.otherQuery.state }).then(() => {
        if(res.meta.code=="RESP_OKAY"){
          this.pageLoading = true
          this.$router.replace('/')
          // this.$router.replace({ path: this.redirect || '/', query: this.otherQuery })
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
#login {
  position: relative;
  height: 100%;
  width: 100%;
  background-image: url("../../assets/login_bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  .login-content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 550px;
    background: rgba(13, 80, 188 ,.7);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 2px 0 32px #191633;
    .login-content-logo{
      position: absolute;
      top: 5%;
      width: 80px;
      height: 80px;
      color: #88B6FF;
      font-size: 18px;
      z-index: 1000;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .login-content-name {
      position: absolute;
      bottom: 5%;
      color: #88B6FF;
      font-size: 18px;
    }
    .login-content-box{
      width: 300px;
      text-align: center;
      .login-content-form{
        .login-content-divider {
          position: relative;
          height: 0.5px;
          background: #82ADF1;
        }
        .divider-text {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: #134eb9;
          padding: 3px 12px;
          color: #82ADF1;
        }
        .login-content-type{
          padding: 20px 0 38px;
          .login-content-type-icon{
            display: inline-block;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            cursor: pointer;
            background-color: #eee;
            margin-right: 10px;
          }
          .login-content-type-weixin-1{
            background: url("../../assets/weixin-1.png") no-repeat;
            background-size: 100% 100%;
          }
          .login-content-type-weixin-2{
            background: url("../../assets/weixin-2.png") no-repeat;
            background-size: 100% 100%;
          }
          .margin-r-20{
            margin-right: 38px;
          }
        }
      }
      
      .login-form{
        margin-top: 20px;
        /deep/.el-form-item__content {
          margin: 0 !important;
        }
        /deep/.el-button--medium{
          width: 100%;
          background: #fff;
          color: #0D50BC;
          font-weight: bold;
        }
      }
    }
  }
}
/deep/.el-form-item{
  margin-bottom: 20px;
}
/deep/.el-input__inner{
  height: 40px;
}
/deep/.el-button--medium{
  padding: 12px 20px;
}
/deep/input:-internal-autofill-selected{
  background-color: red !important;
}
.myinput{
  background-color: red !important;

}
</style>