<template>
  <div>
    <div class="login">
      <link rel="stylesheet" :href="themeLink" />
      <VueSlickCarousel
        @afterChange="afterChange"
        :initialSlide="getCurrentPosition()"
        :arrows="false"
        :dots="true"
        :autoplay="false"
        :fade="true"
        class="login-slider-wrap"
      >
        <div class="img img-1">&nbsp;</div>
        <div class="img img-2">&nbsp;</div>
        <div class="img img-3">&nbsp;</div>
        <div class="img img-4">&nbsp;</div>
      </VueSlickCarousel>
      <div class="login-inner">
        <div class="login-img">
          <!-- <img
            src="../../assets/images/icon/logo.svg"
            style="width: 120px"
          /> -->
          <!-- <img
            src="https://lsitc.com/img/common/logo.png"
            style="width: 110px"
          /> -->
        </div>
        <div>
          <div ref="form">
            <div class="login-form">
              <KInput
                v-model.trim="userId"
                ref="userId"
                type="text"
                @keypress.enter="focusPw()"
                :label="$i18n.t('LoginPage.label1')"
                :style="{ width: '100%' }"
                height="44"
              ></KInput>
            </div>
            <div class="login-form" style="margin-bottom: 10px">
              <KInput
                v-model.trim="userPw"
                ref="userPw"
                type="password"
                @keypress.enter="mberCheck()"
                :label="$i18n.t('LoginPage.label2')"
                :style="{ width: '100%' }"
                height="44"
              ></KInput>
            </div>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20px;
              "
            >
              <Checkbox :dataNm="'lotstate'" :value="'aaa'" :disabled="true" />
              <p class="ic-reset-password">Password Reset</p>
            </div>
            <Button
              :theme-color="'primary'"
              :style="{ width: '100%' }"
              @click="mberCheck"
              >{{ $t("LoginPage.label3") }}</Button
            >
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 20px;
              "
            >
              <ThemeSwitch ref="themeSwitch" />
              <DropDownList
                :style="{ width: '100px' }"
                :data-items="i18List"
                :text-field="'text'"
                :value="i18nVal"
                :default-value="i18List[0]"
                @change="selectI18"
              >
              </DropDownList>
            </div>
          </div>
        </div>
      </div>
      <AlertPop ref="alertPop" :is="'alertPop'" />
      <div class="scrolling-text">
        <p>
          스마트 제조공장 구축으로 우리는, 생산량 중심에서 기술/지식 중심으로
          사람 /경험 의존에서 시스템 기반으로 사후 대응에서 예지/예방으로 일하는
          방식이 변화합니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Input } from "@progress/kendo-vue-inputs";
import { Button } from "@progress/kendo-vue-buttons";
import { Avatar } from "@progress/kendo-vue-layout";
import AlertPop from "@/components/common/modal/AlertPop";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import ThemeSwitch from "@/components/common/ThemeSwitch";
import Checkbox from "@/components/common/input/Checkbox";
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
export default {
  layout: "landing",
  components: {
    KInput: Input,
    Button,
    Avatar,
    AlertPop,
    DropDownList,
    ThemeSwitch,
    Checkbox,
    VueSlickCarousel,
  },
  data: () => ({
    valid: true,
    userId: "",
    userPw: "",
    i18List: [
      {
        text: "Kor",
        id: "ko",
        iso: "ko-KR",
      },
      {
        text: "Eng",
        id: "en",
        iso: "en-US",
      },
    ],
    i18nVal: {
      text: "Kor",
      id: "ko",
      iso: "ko-KR",
    },
  }),
  computed: {
    ...mapState(["indexRoot", "isDarkMode", "myHome"]),
    themeLink() {
      // if (this.isDarkMode) {
      //   return "https://kendo.cdn.telerik.com/themes/5.8.0/bootstrap/bootstrap-main-dark.css";
      // } else {
      //   return "https://kendo.cdn.telerik.com/themes/5.8.0/bootstrap/bootstrap-nordic.css";
      // }
      if (this.isDarkMode) {
        return "https://kendo.cdn.telerik.com/themes/6.2.0/default/default-main-dark.css";
      } else {
        return "https://kendo.cdn.telerik.com/themes/6.2.0/default/default-nordic.css";
      }
    },
  },
  beforeMount() {
    let tmpI18n =
      localStorage.getItem("i18nVal") != null
        ? JSON.parse(localStorage.getItem("i18nVal"))
        : { text: "Kor", id: "ko", iso: "ko-KR" };
    this.$i18n.setLocale(tmpI18n.id);
    this.i18nVal = tmpI18n;
  },
  mounted() {
    this.focusId();
    this.$vuetify.theme.isDark =
      localStorage.getItem("isDarkMode") == "true" ? true : false;
    this.setThemeChange(
      localStorage.getItem("isDarkMode") == "true" ? true : false
    );
    this.$refs["themeSwitch"].mode =
      localStorage.getItem("isDarkMode") == "true" ? true : false;

    const lightTheme = localStorage.getItem("lightTheme");
    this.setLightTheme(lightTheme !== null ? lightTheme : 'light-mode');
  },

  methods: {
    ...mapMutations({
      setUserInfo: "setUserInfo",
      setThemeChange: "setThemeChange",
      setLightTheme: "setLightTheme",
    }),
    focusId() {
      this.$refs.userId.focus();
    },
    focusPw() {
      this.$refs.userPw.focus();
    },
    async mberCheck() {
      if (this.userId == "") {
        this.$refs["alertPop"].title = this.$i18n.t("CommLang.label.label6");
        this.$refs["alertPop"].message = this.$i18n.t("LoginPage.msg1");
        this.$refs["alertPop"].modalWidth = "300px";
        this.$refs["alertPop"].visibleDialog = true;
        this.focusId();
        return;
      }

      if (this.userPw == "") {
        this.$refs["alertPop"].title = this.$i18n.t("CommLang.label.label6");
        this.$refs["alertPop"].message = this.$i18n.t("LoginPage.msg2");
        this.$refs["alertPop"].modalWidth = "300px";
        this.$refs["alertPop"].visibleDialog = true;
        this.focusPw();
        return;
      }
      await this.loginChk();
    },
    async loginChk() {
      // const form = new FormData();
      // form.append('userId', this.userId);
      // form.append('name', this.userId);
      // form.append('password', this.userPw);
      const form = {
        name: this.userId,
        userId: this.userId,
        password: this.userPw,
      };
      await this.$auth
        .loginWith("local", {
          data: form,
        })
        .then((response) => {
          this.setUserInfo(response.data);
          this.$session.start();
          this.$session.set("userInfo", response.data);
          // console.log("access - token",response.headers?.authorization)
          // this.$auth.strategy.token.set(response.headers?.authorization)

          //===========================
          var value = document.cookie.match(
            "(^|;) ?" + "accessToken" + "=([^;]*)(;|$)"
          );
          const accesstoken = value ? value[2] : null;

          // this.$auth.setUserToken(accesstoken,'refreshToken');

          //===========================

          this.$auth.onRedirect((to, from) => {
            return this.myHome.root;
          });
          this.$router.push({ path: this.myHome.root });
        })
        .catch((err) => {
          console.log("err", err);
          this.$refs["alertPop"].title = this.$i18n.t("CommLang.label.label6");
          this.$refs["alertPop"].message = this.$i18n.t("LoginPage.msg3");
          this.$refs["alertPop"].modalWidth = "300px";
          this.$refs["alertPop"].visibleDialog = true;
        });

      // let res = await this.$axios.post("/api/signin", form).then((response) => {
      //   this.$router.push({ path: this.myHome.root });
      //   console.log(this.myHome.root)
      //   this.setUserInfo(response.data);
      //   this.$session.start();
      //   this.$session.set("userInfo", response.data)

      //   console.log(this.$session.get("userInfo"))
      // })
      // .catch((error) => {
      //   this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');
      //   this.$refs['alertPop'].message = this.$i18n.t('LoginPage.msg3');
      //   this.$refs['alertPop'].modalWidth = "300px";
      //   this.$refs['alertPop'].visibleDialog = true;
      // });
    },
    selectI18(val) {
      localStorage.setItem(
        "i18nVal",
        JSON.stringify({
          text: val.value.text,
          id: val.value.id,
          iso: val.value.iso,
        })
      );
      window.location.reload();
      window.location.href = "/login";
    },
    afterChange(pos) {
      localStorage.setItem("loginImagePosition", pos);
    },
    getCurrentPosition() {
      const pos = localStorage.getItem("loginImagePosition");

      if(pos !== "undefined" && pos !== null) {
        return Number(pos);
      }
      else {
        return 0;
      }
    }
  },
};

</script>
<style lang="scss">
@import "@/assets/scss/var.scss";
@import "@/assets/scss/mixin.scss";

.login {
  // height: calc(100% - 64px);
  background: #000; // url("@/assets/images/login-bg.png") no-repeat left top;
  height: 100%;
  position: relative;

  &-inner {
    width: 260px;
    padding: 30px;
    border-radius: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    box-shadow: 0px 4px 50px rgba(25, 47, 102, 0.3);
    .k-floating-label-container {
      padding-top: 10px;
      &.k-focus > .k-label {
        opacity: 0;
        top: 17px;
        left: 9px;
      }
      &.k-empty > .k-label {
        top: 17px;
        left: 9px;
      }
      > .k-label {
        opacity: 0;
        top: 17px;
        left: 9px;
      }
    }
  }
  &-logo {
    margin-bottom: 28px;
    text-align: center;
  }
  &-img {
    // width: 100px;
    // height: 100px;
    // border-radius: 50%;
    text-align: center;
    margin: 0 auto 30px;
    // img {
    //   width: 110px;
    //   height: 70px;
    // }
  }
  &-form {
    display: flex;
    align-items: center;
    &:last-child {
      margin-bottom: 0;
    }

    .v-input {
      width: 100%;
    }
  }
  .scrolling-text {
    position: absolute;
    left: 0;
    bottom: 50px;
    white-space: nowrap;
    /* 텍스트 줄 바꿈 비활성화 */
    animation: scrollText 35s linear infinite;
    background: #192f6699;
    color: #fff;
    font-size: 40px;
    padding: 22px 22px 7px;
    z-index: 4;

    /* scrollText 애니메이션 적용 */
  }

  @keyframes scrollText {
    0% {
      transform: translateX(100%);
      /* 시작 위치, 오른쪽 밖에서 시작 */
    }

    100% {
      transform: translateX(-100%);
      /* 끝 위치, 왼쪽 밖으로 이동 */
    }
  }
}
@each $theme in dark, light, colAquablue, colGreen, colBlue, colOrange, colGray,
  colNavy
{
  @include theme($theme);
  .v-application.#{$theme}-mode {
    .login {
      @if $theme == dark {
        background-color: #23272b;
      } @else {
        background-color: #fff;
      }
    }
    .login-inner {
      z-index: 3;
      @if $theme == dark {
        background-color: rgba(113, 120, 152, 0.3);
      } @else {
        // background-color: rgba(204, 204, 204, 0.35);
        background-color: #fff;
      }
    }
    .login-img {
      width: 120px;
      height: 17px;
      @if $theme == dark {
        background-image: url("@/assets/images/icon/logo_b.svg");
      } @else {
        background-image: url("@/assets/images/icon/logo.svg");
      }

      background-size: 100%;
    }
    .v-btn {
      @if $theme == dark {
        background-color: #18579e;
      } @else {
        background-color: #3f4d7d;
      }
    }
    .ic-reset-password {
      padding-left: 20px;
      margin: 0;
      font-size: 13px;
      @if $theme == dark {
        background-image: url("@/assets/images/icon/ic-password-lock.svg");
      } @else {
        background-image: url("@/assets/images/icon/ic-password-lock.svg");
      }
      background-position: left center;
    }
    // gusalnim slick css add
    .login-slider-wrap {
      position: fixed;
      z-index: 2;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      width: 100%;
      height: 100%;
      .img {
        margin: 0;
        padding: 0;
        opacity: 0 !important;
        visibility: hidden !important;
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .img-1 {
        background: url("@/assets/images/DYP-01.png") no-repeat center center;
        background-size: cover;
      }
      .img-2 {
        background: url("@/assets/images/DYP-02.png") no-repeat center center;
        background-size: cover;
      }
      .img-3 {
        background: url("@/assets/images/DYP-03.png") no-repeat center center;
        background-size: cover;
      }
      .img-4 {
        background: url("@/assets/images/DYP-04.png") no-repeat center center;
        background-size: cover;
      }
      .slick-slide {
        opacity: 0 !important;
        visibility: hidden !important;
        > div {
          width: 100%;
          height: 100%;
        }
      }
      .slick-slide.slick-current.slick-active {
        opacity: 1 !important;
        visibility: visible !important;
        .img {
          opacity: 1 !important;
          visibility: visible !important;
        }
      }
      .slick-list,
      .slick-track {
        height: 100%;
      }
      .slick-dots {
        position: absolute;
        left: 50px;
        bottom: 50px;
        width: max-content;
        li {
          button {
            background: #000;
            border-radius: 10px;
            text-indent: -10000px;
          }

          &.slick-active {
            button {
              background: #ccc;
            }
          }
        }
      }
      .slick-arrow {
        display: none !important;
      }
    }
  }
}
</style>
