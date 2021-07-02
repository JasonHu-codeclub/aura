/*
 * Created: 2021-03-01 11:22:15
 * Author : Jan
 * Last Modified: 2021-03-24 10:14:00
 * Modified By: Jan
 * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved.
 */

<template>
  <div class="navbar">
    <!-- 汉堡包-折叠按钮 -->
    <!-- <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    /> -->
    <!-- 面包屑 -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <!-- 标题 -->
    <div class="right-left">{{$t('navbar.title')}}</div>
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->
      </template>
      <!-- 头像,名称 -->
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <span class="user-name">{{ name }}</span>
          <span class="user-avatar" :style="{backgroundImage: avatar?'url('+ baseURL + avatar +')': 'url('+userImg+')'}"></span>
          <!-- <img :src="avatar" class="user-avatar" /> -->
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user">
            <el-dropdown-item>{{$t('message.personalCenter')}}</el-dropdown-item>
          </router-link> 
          <!-- <el-dropdown-item @click.native="dialogVisible=true">{{$t('message.setPassord')}}</el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">{{$t('message.loginOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="division"></span>
      <lang-select class="language"  />
      <!-- 全屏按钮 -->
      <screenfull id="screenfull" class="right-menu-item hover-effect" />

      <el-dialog
        :title="$t('message.setPassord')"
        :visible.sync="dialogVisible"
        width="500"
        @close="handleClose"
      >
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('message.oldPwd')" prop="oldPass">
            <el-input
              type="password"
              v-model.number="ruleForm.oldPass"
              autocomplete="off"
              :placeholder="$t('message.oldPassword')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.newPwd')" prop="pass">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              autocomplete="off"
              :placeholder="$t('message.newPassword')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('message.againNewPwd')" prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              autocomplete="off"
              :placeholder="$t('message.againPassword')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{
              $t("button.submit")
            }}</el-button>
            <el-button @click="resetForm('ruleForm')">{{
              $t("button.reset")
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>



    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './components/BreadCrumb'
import Hamburger from './components/Hamburger'
import Screenfull from './components/Screenfull'
import LangSelect from '@/components/LangSelect'
// import Search from './components/HeaderSearch'
import { imgBaseUrl } from '@/utils/varible'
import { resetPassReq } from '@/api/user' 
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    LangSelect
    // Search
  },
  data() {
    var checkOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      baseURL: imgBaseUrl,
      dialogVisible: false,
      ruleForm: {
        pass: '',
        checkPass: '',
        oldPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        oldPass: [
          { validator: checkOldPass, trigger: 'blur' }
        ]
      },
      userImg: require('../../../assets/user.png') 
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name'
    ])
  },
  methods: {
    // 切换侧边栏展开/缩起
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 登出
    async logout () {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 切换头像选项
    async handleMyself (command) {
      if (command === 'home') {
      } else if (command === 'setting') {
        this.dialogVisible = true
      } else if (command === 'logout') {
        const result = await logoutReq()
        if (result.ret === '0') {
          // 移除用户
          // localStorage.removeItem('username')
          // // 移除cookie
          // document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          // this.$router.replace('/login')
        }
      }
    },
    // 修改密码
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const result = await resetPassReq({ old_password: this.ruleForm.oldPass, new_password: this.ruleForm.pass })
          if (result.ret === '0') {
            this.$message({
              message: this.$t('tip.resetPwdSuccess'),
              type: 'success'
            })
            // this.handleMyself('logout')
          } else {
            this.$message({
              message: result.msg,
              type: 'error'
            })
          }
        } else {
          return false
        }
      })
    },
    // 重置修改密码框
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 弹窗关闭回调
    handleClose () {
      this.$refs['ruleForm'].resetFields()
    },
  }
}
</script>

<style lang="less" scoped>
.navbar {
  height: 54px;
  line-height: 54px;
  overflow: hidden;
  position: relative;
  color: #fff;
  background: #3a3b4c;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .right-left{
    float: left;
    font-size: 18px;
    line-height: 54px;
    font-weight: 600;
    margin-left: 44px;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    display: flex;
    align-items: center;
    float: right;
    height: 100%;
    line-height: 50px;
    padding: 0 14px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      font-size: 14px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .language{
      width: 86px;
      color: #fff;
      margin-right: 10px;
      cursor: pointer;
    }

    .division{
      width: 1px;
      background: #979797;
      display: inline-block;
      height: 20px;
      margin: 0 18px;
    }

    .avatar-container {
      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: flex-start;

        .user-name {
          font-size: 14px;
          color: #FFFFFF;
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          margin-top: 5px;
          border-radius: 20px;
          margin-left: 18px;
          background-color: #dddddd;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
