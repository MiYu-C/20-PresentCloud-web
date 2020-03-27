<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">到云签到</h3>
      </div>

      <el-tabs v-model="activeName">
        <el-tab-pane label="手机号码登录" name="first">
          <el-form-item prop="phone">
            <!-- <span class="svg-container">
              <svg-icon icon-class="user" />
            </span> -->
            <el-input
              ref="phone"
              v-model="loginForm.phone"
              placeholder="手机号码"
              name="phone"
              type="text"
              tabindex="1"
              auto-complete="on"
              prefix-icon="el-icon-mobile-phone"
            />
          </el-form-item>
          <el-form-item prop="code">
            <!-- <span class="svg-container">
              <svg-icon icon-class="password" />
            </span> -->
            <el-input
              ref="code"
              v-model="loginForm.code"
              placeholder="验证码"
              name="code"
              tabindex="2"
              auto-complete="on"
              prefix-icon="el-icon-key"
            >
              <el-button slot="append" :disabled="resend" @click="sendCode">{{ codeStatus }}</el-button>
            </el-input>
            <!-- <span class="show-pwd">
              <el-button type="primary" :disabled="resend" @click="sendCode">{{ codeStatus }}</el-button>
            </span> -->
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="帐号密码登录" name="second">
          <el-form-item prop="username">
            <!-- <span class="svg-container">
              <svg-icon icon-class="user" />
            </span> -->
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="账户"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
              prefix-icon="el-icon-s-custom"
            />
          </el-form-item>

          <el-form-item prop="password">
            <!-- <span class="svg-container">
              <svg-icon icon-class="password" />
            </span> -->
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              prefix-icon="el-icon-unlock"
              @keyup.enter.native="handleLogin"
            >
              <el-button slot="append" @click="showPwd">
                <!-- {{ passwordType === 'password' ? '显示密码' : '隐藏密码' }} -->
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </el-button>
            </el-input>
            <!-- <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span> -->
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

      <div class="tips">
        <el-row type="flex" justify="end">
          <el-col :span="12"><el-checkbox v-model="checked">自动登录</el-checkbox></el-col>
          <el-col :span="12" :offset="15">
            <el-link type="primary" :underline="false" @click.native.prevent="findPwd">忘记密码</el-link>
          </el-col>
        </el-row>
      </div>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->

    </el-form>
    <el-dialog
      title="忘记密码"
      :visible.sync="findPwdVisible"
      width="50%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-col :span="22">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="right">
          <el-form-item label="帐号" :label-width="formLabelWidth" prop="user">
            <el-input v-model="ruleForm.user" placeholder="请输入帐号" clearable />
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" prop="user">
            <el-input v-model="ruleForm.user" placeholder="请输入手机号" clearable />
          </el-form-item>
          <el-form-item label="验证码" :label-width="formLabelWidth" prop="user">
            <el-input v-model="ruleForm.user" placeholder="请输入验证码" clearable>
              <el-button slot="append" :disabled="resend" @click="sendCode">{{ codeStatus }}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="user">
            <el-input v-model="ruleForm.user" placeholder="请输入新密码" clearable />
          </el-form-item>
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="user">
            <el-input v-model="ruleForm.user" placeholder="请再次输入密码" clearable />
          </el-form-item>
        </el-form>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeForm">确 定</el-button>
        <el-button @click="closeForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/web/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        phone: '13211111111',
        code: '123456',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      ruleForm: {
        user: ''
      },
      rules: {
        user: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      activeName: 'second',
      codeStatus: '获取验证码',
      findPwdVisible: false,
      resend: false,
      checked: true,
      formLabelWidth: '100px'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    closeForm() {
      this.findPwdVisible = false
    },
    findPwd() {
      // this.$router.push('/findPwd')
      this.findPwdVisible = true
    },
    sendCode() {
      this.resend = !this.resend
      this.codeStatus = '60s'
      console.log(this.resend)
    },
    handleLogin() {
      if (this.activeName === 'second') {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$router.push('/findPwd')
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    // display: inline-block;
    // height: 47px;
    // width: 85%;

    input {
      // background: transparent;
      // border: 0px;
      // -webkit-appearance: none;
      // border-radius: 0px;
      // padding: 12px 5px 12px 15px;
      color: #111;
      // height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgb(255, 255, 255);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background: url("../../../assets/images/login.png");
  overflow: hidden;

  .login-form {
    position: relative;
    width: 470px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    // color: #fff;
    color: $bg;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $bg;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $bg;
    cursor: pointer;
    user-select: none;
  }
}
</style>
