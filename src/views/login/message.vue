/* * Created: 2020-07-09 08:15:26 * Author : Jan * Last Modified: 2021-03-24 11:34:13 * Modified By:
Jan * Copyright (c) 2019. 深圳奥雅纳智能科技有限公司. All Rights Reserved. */

<template>
  <div id="login">
    <div class="login-content-box">
      <img
        v-if="falg"
        src="../../assets/type_code.png"
        class="image2"
        alt=""
        @click="falg = false"
      />
      <img v-else src="../../assets/type_phone.png" class="image2" alt="" @click="falg = true" />
      <div class="login-content-form" v-if="falg">
        <div class="login-content-divider">
          <span class="divider-text"> {{ $t("codeLogin") }}</span>
        </div>
        <div class="login-form">
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-width="80px"
            hide-required-asterisk
          >
            <el-form-item label="" prop="phone">
              <el-input :placeholder="$t('tip.phoneNotEmpty')" v-model="ruleForm.phone" clearable>
                <template slot="prepend"
                  ><img src="../../assets/phone.png" alt="" class="image1"
                /></template>
              </el-input>
            </el-form-item>
            <el-form-item label="" prop="code">
              <el-input
                show-code
                :placeholder="$t('tip.codesNotEmpty')"
                v-model="ruleForm.code"
                clearable
                style="position: relative"
              >
                <template slot="prepend"
                  ><img src="../../assets/code.png" alt="" class="image1"
                /></template>
              </el-input>
              <div
                class="code-button"
                :style="
                  isCode
                    ? 'background: #fff;border: 1px solid #82ADF1;color: #5272E9;'
                    : ruleForm.phone.length == 11
                    ? 'background: #5272E9;'
                    : ''
                "
                @click="goCode()"
                :loading="loginLoading"
              >
                {{ isCode ? (second > 0 ? second + "S" : $t("tip.reacquire")) :$t("tip.getVerificationCode")   }}
              </div>
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

          <div class="remark"> {{ $t("tip.remark3") }}</div>
        </div>
      </div>

      <div class="login-content-form" v-else>
        <img :src="imgBase" class="image3" />
        <div class="remark">{{ $t("tip.remark1") }}</div>
        <div class="remark" style="margin-top:15px;">{{ $t("tip.remark2")}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { imgBaseUrl, initToken } from "@/utils/varible";
import { getHost, decrypt, setIcon } from "@/utils/tool";

import { authOpenPlatformCodeApi, getAuthInviteSmallProgramCodeApi } from "@/api/user";
import wxlogin from "vue-wxlogin";
export default {
  components: { wxlogin },
  data() {
    return {
      imgBase: "",
      isCode: false,
      second: 0,
      falg: true,
      scope: "snsapi_login",
      isWxin: false,
      host: imgBaseUrl,
      loginLoading: false,
      ruleForm: {
        phone: "",
        code: "",
      },
      rules: {
        phone: [
          {
            required: true,
            message: this.$t("tip.phoneNotEmpty"),
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: this.$t("tip.codesNotEmpty"),
            trigger: "blur",
          },
        ],
      },
      redirect: undefined,
      appid: "", // 企业号
      agentid: "", // 自建应用ID
      wxAppid: "wx85a71682d259d702", // 微信开放平台appid
      AppSecret: "", // 应用密钥AppSecret
      otherQuery: {}, // 回调参数
      companyLogo: "", // 公司logo
      companyName: "", // 公司名称
      unionid: "",
    };
  },
  computed: {},
  created() {
    this.unionid = this.$route.query.unionid;
    // this.unionid = "osYXI55P_dh53Pq10a-y_pHP8I5s";
    this.getAuthInviteSmallProgramCode();
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
  watch: {},
  methods: {
    getAuthInviteSmallProgramCode() {
      getAuthInviteSmallProgramCodeApi({
        id: "1",
        page: "pages/Login",
      }).then((res) => {
        if (res && res.meta.code == "RESP_OKAY") {
          console.log(res);
          this.imgBase = res.data.base64;
        }
      });
    },

    goCode() {
      if (!this.ruleForm.phone) {
        this.$message({
          message: "请输入手机号码",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      }
      if (this.ruleForm.phone.length != 11) {
        this.$message({
          message: "手机号输入错误",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      }
      let that = this;

      authOpenPlatformCodeApi({ phone: this.ruleForm.phone, unionid: this.unionid }).then((res) => {
        if (res && res.meta.code == "RESP_OKAY") {
          console.log(res);
          that.isCode = true;
          that.second = 60;
          let timer = setInterval(function () {
            if (that.second > 0) {
              that.second--;
            } else {
              clearInterval(timer);
              timer = null;
            }
          }, 1000);
        }
      });
    },

    // 登录
    handleLogin() {
      if (!this.ruleForm.code) {
        this.$message({
          message: "请输入验证码",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      }
      if (this.ruleForm.code.length != 6) {
        this.$message({
          message: "验证码输入错误",
          type: "error",
          duration: 3 * 1000,
        });
        return;
      }

      this.loginLoading = true;
      this.$store
        .dispatch("user/messageLogin", {
          phone: this.ruleForm.phone,
          unionid: this.unionid,
          code: this.ruleForm.code,
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
  },
};
</script>
<style lang="less" scoped>
#login {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #f5f7f8;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .login-content-box {
    position: relative;
    width: 426px;
    background-color: #fff;
    height: 493px;
    padding: 46px;
    text-align: center;
    .login-content-form {
      .login-content-divider {
        height: 70px;
      }
      .divider-text {
        font-size: 24px;
        font-weight: 500;
        color: #333333;
        line-height: 70px;
      }
      .image3 {
        width: 300px;
        height: 300px;
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
        }
      }
      /deep/.el-button--medium {
        width: 100%;
        height: 60px;
        background: #fff;
        color: #fff;
        background-color: #5272e9;
        // font-weight: bold;
        padding: 12px 20px;
        letter-spacing: 2px;
        margin-top: 40px;
        font-size: 24px;
      }
      /deep/.el-input-group__prepend {
        position: relative;
        // color: #fff;
        background-color: #fff;
        border: none;
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
        // border: 1px #82adf1 solid;
        border: none;
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
  .remark {
    width: 100%;
    font-size: 13px;
    font-weight: 400;
    color: #666666;
    line-height: 18px;
    margin-top: 40px;
  }
  .image1 {
    width: 20px;
    height: 27px;
  }
  .image2 {
    width: 64px;
    height: 64px;
    position: absolute;
    top: 50px;
    top: 0px;
    right: 0px;
  }
  .code-button {
    width: 108px;
    height: 40px;
    background: #7f8ab3;
    border: 1px solid #82adf1;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    position: absolute;
    bottom: 1px;
    right: -1px;
  }
}
</style>
