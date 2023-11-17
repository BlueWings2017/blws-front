<template>
  <!-- <v-switch
    class="theme-switch"
    v-model="mode"
    @change="themeChange"
  ></v-switch> -->
  <kSwitch :size="'small'" v-model="mode" @change="themeChange" />
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { Switch } from "@progress/kendo-vue-inputs";
export default {
  data() {
    return {
      mode: null,
    };
  },
  components: {
    kSwitch: Switch,
  },
  computed: {
    ...mapState({
      isDarkMode: "isDarkMode",
      lightTheme: "lightTheme"
    }),
  },
  created() {
    this.mode = this.isDarkMode;
  },
  methods: {
    ...mapMutations({
      setThemeChange: "setThemeChange",
    }),
    themeChange() {
      this.$vuetify.theme.isDark = this.mode;
      this.setThemeChange(this.mode);
      localStorage.setItem("isDarkMode", this.mode);

      if (this.mode) {
        $("body").attr("class", "dark-mode");
      } else {
        $("body").attr("class", this.lightTheme);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.theme-switch {
  display: inline-flex;
  width: 47px;
  height: 30px;
  :deep() {
    .v-input__control,
    .v-input__slot {
      height: 100%;
    }
    .v-input--selection-controls__input {
      width: 100%;
      margin-right: 0;
      height: 100%;
    }
    .v-input--switch__track {
      width: 100%;
      height: 100%;
      border-radius: 50px;
      position: initial;
      background-color: #f1f0f8;
    }
    input {
      min-height: initial;
    }
    .v-input--selection-controls__ripple {
      display: none;
    }
    .v-input--switch__thumb {
      position: absolute;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background-color: #f2f2f2;
      top: 2px;
      left: 0;
      background-image: url(../../assets/images/icon/ico-theme-light.png);
      background-size: 18px 18px;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }
  &.v-input--is-label-active {
    :deep(.v-input--switch__track) {
      background-color: #383f5d;
    }
    :deep(.v-input--switch__thumb) {
      //transform: translate(38px, 0);
      background-image: url(../../assets/images/icon/ico-theme-dark.png);
    }
  }
}
</style>
