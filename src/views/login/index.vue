/*
 * Created: 2020-07-09 08:15:26
 * Author : Jan
 * Last Modified: 2021-03-24 11:34:13
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

<template>
  <div id="login">
    <el-card class="box-card">
      <div class="login-box"></div>
      <div class="login-box" v-show="loginType === 'user'">
        <h3 class="welcome">欢迎登录</h3>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="80px"
          hide-required-asterisk
        >
          <el-form-item label="用户名" prop="username">
            <svg-icon icon-class="username" slot="label" />
            <el-input
              v-model="ruleForm.username"
              autocomplete="off"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <svg-icon icon-class="password" slot="label" />
            <el-input
              show-password
              type="password"
              v-model="ruleForm.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <div class="submit-btn">
            <el-button type="primary" @click="handleLogin()">登录</el-button>
          </div>
        </el-form>
        <div class="switch" @click="showDialog"><el-divider><span>其他登录方式</span></el-divider></div>
        <!-- <el-tooltip
          class="item"
          effect="light"
          content="企业微信登录"
          placement="top-start"
          :visible-arrow="false"
        >
          <div class="enchange ex-user" @click="handleLoginTypes('code')"></div>
        </el-tooltip> -->
      </div>
      <div class="login-box" v-show="loginType === 'code'">
        <div class="content">
          <div id="wx_login"></div>
          <!-- <p class="error" v-show="error">
          {{ $t('message.login.tips') }}：{{ msg }}
        </p> -->
        </div>
        <el-tooltip
          class="item"
          effect="light"
          content="密码登录"
          placement="top-start"
          :visible-arrow="false"
        >
          <div class="enchange ex-code" @click="handleLoginTypes('user')"></div>
        </el-tooltip>
      </div>
    </el-card>
    <el-dialog title="选择登录方式" :visible.sync="dialogIsShow">
      <template>
        <div class="social-signup-container">
          <div class="sign-btn" @click="handleOtherLogin('wechat')">
            <span class="wx-svg-container"
              ><svg-icon icon-class="wechat" class="icon"
            /></span>
            微信
          </div>
          <div class="sign-btn" @click="handleOtherLogin('qq')">
            <span class="qq-svg-container"
              ><svg-icon icon-class="qq" class="icon"
            /></span>
            QQ
          </div>
          <div class="sign-btn" @click="handleOtherLogin('dingding')">
            <span class="ding-svg-container"
              ><svg-icon icon-class="dingding" class="icon"
            /></span>
            钉钉
          </div>
          <div class="sign-btn" @click="handleOtherLogin('qiye')">
            <span class="qiye-svg-container"
              ><svg-icon icon-class="qiye" class="icon"
            /></span>
            企业微信
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { getHost } from '@/utils/tool'
export default {
  components: {},
  data () {
    return {
      ruleForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      redirect: undefined,
      otherQuery: {},
      loginType: 'user',
      dialogIsShow: false
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
    handleLogin () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('user/login', { username: this.ruleForm.username, password: this.ruleForm.password }).then(() => {
            // console.log('login-data===',data)
            this.$router.replace({ path: this.redirect || '/', query: this.otherQuery })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleOtherLogin (type) {
      if (type === 'wechat') {

      } else if (type === 'qq') {

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
    handleLoginTypes (type) {
      if (type === 'code') {
        // ....
        this.loginType = type
        // encodeURI
      } else {
        // ...
        this.loginType = type
      }
    },
    showDialog () {
      this.dialogIsShow = true
    }
  },
  mounted () {
    window.WwLogin({
      id: 'wx_login',
      appid: 'ww63beae6c0cd72cf1',
      agentid: '1000010',
      redirect_uri: encodeURIComponent(`https://bshtest.aa-iot.com`),
      state: '',
      href: '',
    })
  }
}
</script>
<style lang='less' scoped>
#login {
  height: 100%;
  width: 100%;
  background-image: url("../../assets/login-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  .box-card {
    width: 800px;
    height: 420px;
    padding-top: 36px;
    /deep/.el-card__body {
      display: flex;
      .login-box {
        position: relative;
        flex: 1;
        &:first-child {
          background-image: url("../../assets/login-box-bg.png");
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .welcome {
          text-align: center;
          font-size: 24px;
        }
        .el-form {
          .el-form-item {
            .el-form-item__content {
              .el-input {
                .el-input__inner {
                  border: none;
                  border-bottom: solid 1px #dddddd;
                  border-radius: unset;
                }
              }
            }
          }
          .submit-btn {
            margin-top: 36px;
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
            .el-button {
              width: 280px;
            }
          }
        }
        .switch {
          display: flex;
          justify-content: center;
          span {
            color: #027aff;
            cursor: pointer;
            &:hover {
              color: gray;
            }
          }
        }
        .enchange {
          cursor: pointer;
          position: absolute;
          right: 0;
          top: 0;
          width: 48px;
          height: 48px;
          line-height: 30px;
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .ex-user {
          background-image: url("../../assets/wx_hellorf_l.svg");
        }
        .ex-code {
          background-image: url("../../assets/web_hellorf_l.svg");
        }
      }
    }
  }
  /deep/.el-dialog__wrapper {
    .el-dialog {
      .el-dialog__body {
        .social-signup-container {
          margin: 20px 0;
          .sign-btn {
            display: inline-block;
            cursor: pointer;
          }
          .icon {
            color: #fff;
            font-size: 24px;
            margin-top: 8px;
          }
          .qiye-svg-container,
          .ding-svg-container,
          .wx-svg-container,
          .qq-svg-container {
            display: inline-block;
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            padding-top: 1px;
            border-radius: 4px;
            margin-bottom: 20px;
            margin-right: 5px;
          }
          .wx-svg-container {
            background-color: #24da70;
          }
          .qq-svg-container {
            background-color: #6ba2d6;
            margin-left: 50px;
          }
          .ding-svg-container {
            background-color: #268df9;
            margin-left: 50px;
          }
          .qiye-svg-container {
            background-color: #6ba2d6;
            margin-left: 50px;
          }
        }
      }
    }
  }
}
</style>
