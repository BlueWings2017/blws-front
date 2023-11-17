<template>
  <v-menu offset-y nudge-bottom="8" :left="true">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="btn-tf-admin"
        v-bind="attrs"
        v-on="on"
        depressed
        :ripple="false"
        :title="'사용자 정보'"
      >
        <span class="admin-name">
          <span>{{ name }}</span>
          <i>님</i>
        </span>
      </v-btn>
    </template>

    <v-list class="pa-2">
      <!--
      <v-list-item style="color:#fff; border-bottom: 2px solid #fff;">
        <div style="color:#fff;">
          <v-icon class="mr-1" size="20" style="color:#fff">mdi-account-outline</v-icon>
          <span class="body-2">{{name}}</span>
        </div>
      </v-list-item>
      -->
      <v-list-item>
        <v-btn @click="pswdChange" small elevation="0">
          <v-icon class="mr-1" size="20">mdi-lock-outline</v-icon>
          <span class="body-2">{{ $t("CommLang.btn.passwordBtn") }}</span>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn @click="logout" small elevation="0">
          <v-icon class="mr-1" size="20">mdi-logout</v-icon>
          <span class="body-2">{{ $t("CommLang.btn.logoutBtn") }}</span>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import { mapState } from "vuex";
import { Avatar } from "@progress/kendo-vue-layout";
import mixinGlobal from "@/mixin/global.js";
export default {
  mixins: [mixinGlobal],
  props: {
    miniVariant: Boolean,
    userNm: {
      type: String,
      require: true,
    },
    comId: {
      type: String,
      require: true,
    },
  },
  components: {
    avatar: Avatar,
  },
  data() {
    return {
      logoutUrl: "/login",
      item: {},
      name:
        this.$session.get("userInfo") == undefined
          ? "비로그인"
          : this.$session.get("userInfo").name,
    };
  },
  computed: {
    ...mapState(["isDarkMode"]),
    btnStyle() {
      return this.isDarkMode
        ? { color: "#fff", width: "auto" }
        : { color: "#111", width: "auto" };
    },
  },
  async mounted() {
    if (!this.$session.get("userInfo")) {
      let res = await this.getListReturn({
        apiKey: "common/user/myinfo",
      });
      this.$session.set("userInfo", res);
      this.name = res.name;
    }
  },
  methods: {
    async logout() {
      await this.$auth
        .logout()
        .then((result) => {
          this.$session.destroy();
          this.$nextTick(() => {
            this.$router.push({ path: "/login" });
            // window.location.href = this.logoutUrl;
            // this.$auth.onRedirect((to, from) => {
            //   return '/login';
            // });
          });
        })
        .catch((err) => {});
      // await this.$axios.get("/api/common/auth/signout").then((response) => {
      //   if(response.status == "200"){
      //     this.$session.destroy();
      //     this.$nextTick(() => {
      //       this.$router.push({ path: '/login' });
      //       // window.location.href = this.logoutUrl;
      //       this.$auth.onRedirect((to, from) => {
      //         return '/login';
      //       });
      //     });
      //   }
      // })
    },
    pswdChange() {
      this.$emit("open");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/var.scss";
@each $theme in dark, light, colAquablue, colGreen, colBlue, colOrange, colGray,
  colNavy
{
  .v-application.#{$theme}-mode {
    .mdi-account {
      color: map-deep-get(
        $config,
        #{$theme},
        "tui-datepicker-calendar-color"
      ) !important;
    }

    .v-menu__content {
      z-index: 9 !important;
      border-radius: 0;
      box-shadow: none;

      .v-list {
        padding: 0 !important;
        border-width: 1px;
        border-style: solid;
        border-radius: 0;
        box-shadow: none;
        background-color: map-deep-get($config, #{$theme}, "bg-color-input");
        border-color: map-deep-get($config, #{$theme}, "bd-color-basic");

        .v-list-item {
          min-height: 100%;
          height: 31px;
          align-items: flex-start;
          border-top-width: 1px;
          border-top-style: solid;
          border-color: map-deep-get($config, #{$theme}, "bd-color-basic");

          &:first-of-type {
            border-top: 0;
          }

          .v-btn {
            padding: 0 9px !important;
            margin-bottom: 0;
            height: 100%;
            color: map-deep-get($config, #{$theme}, "ft-color-listbox");
            justify-content: flex-start;

            .v-icon {
              display: none;
            }

            &:hover {
              color: map-deep-get($config, #{$theme}, "ft-color-listbox-hover");
            }
          }
        }
      }
    }
  }
}

.v-btn {
  width: 100%;
  min-width: auto !important;
  display: flex;

  &,
  &:before {
    background-color: transparent !important;
  }

  :deep(.v-btn__content) {
    justify-content: flex-start;
  }

  &.miniVariant {
    :deep(.v-btn__content > .body-1, .v-btn__content > .mdi-chevron-down) {
      display: none;
    }
  }
}
</style>
