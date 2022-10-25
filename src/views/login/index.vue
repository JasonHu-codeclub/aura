/* * Created: 2020-07-09 08:15:26 * Author : Jan * Last Modified: 2021-03-24 11:34:13 * Modified By:
Jan * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved. */

<template>
  <div id="login">
    <div class="login-content">
      <div class="login-language">
        <div
          @click="chooseLang('zh_CN')"
          class="zh_CN"
          :class="{ cn_active: $i18n.locale == 'zh_CN' }"
        ></div>
        <div
          @click="chooseLang('en')"
          class="en"
          :class="{ en_active: $i18n.locale == 'en' }"
        ></div>
        <div
          @click="chooseLang('zh_HK')"
          class="zh_HK"
          :class="{ fan_active: $i18n.locale == 'zh_HK' }"
        ></div>
      </div>
      <h3 class="login-content-logo">
        <img
          :src="host + companyLogo + '?time=' + new Date().getTime()"
          class="login-content-logo-img"
          alt=""
        />
      </h3>
      <div class="login-content-box">
        <div class="login-content-form">
          <div class="login-content-divider">
            <span class="divider-text">{{ $t("thirdPartyAccount") }}</span>
          </div>
          <div class="login-content-type">
            <!-- 企业微信登录 -->
            <span
              class="login-content-type-icon login-content-type-weixin-2"
              @click="handleLoginType('qiye')"
              :title="$t('tip.enterprise')"
              style="margin-right: 30px"
            ></span>
            <!-- 微信登录 -->
            <span
              class="login-content-type-icon login-content-type-weixin-1"
              @click="handleLoginType('wechat')"
              :title="$t('tip.wechat')"
            ></span>
          </div>
          <div class="login-content-divider">
            <span class="divider-text">{{ $t("accountLogin") }}</span>
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
                <el-input
                  :placeholder="$t('tip.userNameNotEmpty')"
                  v-model="ruleForm.username"
                  clearable
                >
                  <template slot="prepend"
                    ><svg-icon icon-class="username" slot="label"
                  /></template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input
                  type="password"
                  show-password
                  :placeholder="$t('tip.pwdNotEmpty')"
                  v-model="ruleForm.password"
                  clearable
                >
                  <template slot="prepend"
                    ><svg-icon icon-class="password" slot="label"
                  /></template>
                </el-input>
              </el-form-item>
              <div class="submit-btn">
                <el-button
                  type="primary"
                  @click.native.prevent="handleLogin()"
                  :loading="loginLoading"
                  >{{ $t("login") }}</el-button
                >
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <div class="login-content-name">{{ companyName }}</div>
    </div>
  </div>
</template>
<script>
import { imgBaseUrl, initToken } from "@/utils/varible";
import { getHost, decrypt, setIcon } from "@/utils/tool";
export default {
  components: {},
  data() {
    return {
      host: imgBaseUrl,
      baseImg: require("../../assets/logo.png"),
      loginLoading: false,
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t("tip.userNameNotEmpty"),
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("tip.pwdNotEmpty"),
            trigger: "blur",
          },
        ],
      },
      redirect: undefined,
      appid: "", // 企业号
      agentid: "", // 自建应用ID
      wxAppid: "wx633cde8a865d394e", // 微信开放平台appid
      AppSecret: "", // 应用密钥AppSecret
      otherQuery: {}, // 回调参数
      companyLogo: "", // 公司logo
      companyName: "", // 公司名称
    };
  },
  computed: {},
  created() {
    // 获取企业号appid,agentid
    this.getAppidInfo();
    // 获取公司信息
    this.getSystemInfo();
  },
  mounted() {
    // 回车键
    let _this = this;
    document.onkeydown = function (e) {
      if (e.keyCode === 13) {
        _this.handleLogin();
      }
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 获取企业号appid,agentid
    getAppidInfo() {
      this.$store.dispatch("user/getQywechatConfig").then((res) => {
        if (res && res.meta.code == "RESP_OKAY") {
          let dataJson = decrypt(res.data.code, initToken);
          let appidInfo = JSON.parse(dataJson);
          this.appid = appidInfo.qywechat_app_id;
          this.agentid = appidInfo.qywechat_h5_id;
          if (this.otherQuery.code) {
            this.otherLogin(this.appid);
          }
        }
      });
    },
    otherLogin(appid) {
      /* 存在code,第三方登录 */
      this.loginLoading = true;
      this.$store
        .dispatch("user/otherLogin", {
          appid: appid,
          code: this.otherQuery.code,
          state: this.otherQuery.state,
        })
        .then((res) => {
          this.loginLoading = false;
          if (res.meta.code == "RESP_OKAY") {
            this.$message({
              message: this.$t("tip.loginSuccess"),
              type: "success",
              duration: 3 * 1000,
            });
            this.$router.replace("/");
            // this.$router.replace({ path: this.redirect || '/', query: this.otherQuery })
          } else {
            this.$message({
              message: res.meta.message,
              type: "error",
              duration: 3 * 1000,
            });
          }
        });
    },
    // 获取公司信息
    getSystemInfo() {
      this.$store.dispatch("user/icoSetting").then((res) => {
        let { front_system_inside_logo, front_system_name, front_system_title_logo } = res;
        this.companyLogo = front_system_inside_logo; // 公司logo
        this.companyName = front_system_name; // 公司名称
        document.title = front_system_name; // title
        setIcon(front_system_title_logo); // icon
      });
    },
    // 登录
    handleLogin() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loginLoading = true;
          this.$store
            .dispatch("user/login", {
              username: this.ruleForm.username,
              pwd: this.ruleForm.password,
              company: "",
            })
            .then((res) => {
              this.loginLoading = false;
              if (res.meta.code == "RESP_OKAY") {
                this.$router.replace("/");
                // this.$router.replace({ path: this.redirect || '/', query: this.otherQuery })// 因为权限控制
              }
            });
        }
      });
    },
    // 第三方登录
    handleLoginType(type) {
      if (this.appid == "" || this.agentid == "") {
        this.$message({
          message: "未设置企业微信登录",
          type: "error",
        });
        return false;
      }
      const redirect_uri = getHost() + "/sp-pcmeet/#/login";
      if (type === "qiye") {
        // 企业微信
        window.location.href = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${
          this.appid
        }&agentid=${this.agentid}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=qiye`;
      } else if (type === "wechat") {
        // 微信登录
        window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${
          this.wxAppid
        }&redirect_uri=${encodeURIComponent(
          "https://jctest.iot-oa.com/#/login"
        )}&response_type=code&scope=snsapi_login&state=wechat#wechat_redirect`;

      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    chooseLang(lang) {
      this.$i18n.locale = lang;
      this.$store.dispatch("app/setLanguage", lang);
      // 重新刷新页面
      window.location.reload();
    },
  },
};
</script>
<style lang="less" scoped>
#login {
  position: relative;
  height: 100%;
  width: 100%;
  background-image: url("../../assets/login_bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #0849b2;
  .login-content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 38.2%;
    max-width: 730px;
    min-width: 400px;
    background: rgba(13, 80, 188, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 10px 0 32px #231f45;
    .login-language {
      display: flex;
      justify-content: flex-end;
      position: absolute;
      top: 5%;
      right: 5%;
    }
    .zh_CN,
    .en,
    .zh_HK {
      height: 26px;
      width: 26px;
      background-repeat: no-repeat;
      cursor: pointer;
    }
    .en {
      margin: 0 10px;
    }
    .zh_CN {
      background-image: url("../../assets/jian_noactive.png");
      background-size: 100%;
    }
    .zh_CN:hover,
    .cn_active {
      background-image: url("../../assets/jian_active.png");
    }
    .en {
      background-image: url("../../assets/en_noactive.png");
      background-size: 100%;
    }
    .en:hover,
    .en_active {
      background-image: url("../../assets/en_active.png");
    }
    .zh_HK {
      background-image: url("../../assets/fan_noactive.png");
      background-size: 100%;
    }
    .zh_HK:hover,
    .fan_active {
      background-image: url("../../assets/fan_active.png");
    }
    .login-content-logo {
      position: absolute;
      top: 9%;
      width: 300px;
      height: 80px;
      color: #88b6ff;
      font-size: 18px;
      z-index: 1000;
      text-align: center;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      .login-content-logo-img {
        height: 100%;
      }
    }
    .login-content-name {
      position: absolute;
      bottom: 5%;
      color: #88b6ff;
      font-size: 18px;
    }
    .login-content-box {
      width: 300px;
      text-align: center;
      .login-content-form {
        .login-content-divider {
          position: relative;
          height: 0.5px;
          background: #82adf1;
        }
        .divider-text {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 180px;
          transform: translate(-50%, -50%);
          background: #134eb9;
          color: #82adf1;
        }
        .login-content-type {
          padding: 26px 0 30px;
          .login-content-type-icon {
            display: inline-block;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            cursor: pointer;
            background-color: #eee;
          }
          .login-content-type-weixin-1 {
            background: url("../../assets/weixin-1.png") no-repeat;
            background-size: 100% 100%;
          }
          .login-content-type-weixin-2 {
            background: url("../../assets/weixin-2.png") no-repeat;
            background-size: 100% 100%;
          }
          .margin-r-20 {
            margin-right: 38px;
          }
        }
      }

      .login-form {
        margin-top: 20px;
        /deep/.el-form-item__content {
          margin: 0 !important;
          .el-input-group {
            border-radius: 4px;
            box-sizing: content-box;
            border: 1px #82adf1 solid;
            background-color: #5272e9;
          }
        }
        /deep/.el-button--medium {
          width: 100%;
          height: 40.6px;
          background: #fff;
          color: #0d50bc;
          font-weight: bold;
          padding: 12px 20px;
          letter-spacing: 2px;
        }
        /deep/.el-input-group__prepend {
          position: relative;
          color: #fff;
          border: none;
          background-color: #5272e9 !important;
          &::after {
            content: "";
            position: absolute;
            width: 1px;
            height: 20px;
            background: #82adf1;
            right: 0;
            top: 50%;
            margin-top: -10px;
          }
        }
        /deep/.el-input__inner {
          height: 40px;
          color: #fff;
          border: none;
          background: #5272e9 !important;
          &::-webkit-input-placeholder {
            color: #82adf1;
          }
          &:-internal-autofill-selected {
            -webkit-box-shadow: 0 0 0 1000px #5272e9 inset !important;
            -webkit-text-fill-color: white;
          }
        }
      }
    }
  }
}
</style>
