<template>
  <v-app :class="`${isDarkMode ? 'dark-mode' : lightTheme}`">
    <link rel="stylesheet" :href="themeLink" />
    <v-app-bar v-if="topMenu">
      <!-- 상단바 -->
      <template>
        <div class="header-horizontal-wrap">
          <div class="header-horizontal">
            <div class="lnb-logo">
              <router-link class="home" :to="myHome.root">
                <h1>DY POWER</h1>
              </router-link>
            </div>
            <!-- <div>
              <v-spacer>
                <kMenu
                  :items="horizTreevieItems"
                  :item-render="itemRender"
                  :customCloseItemIds="['0','0_0']"
                  @select="onSelect"
                >
                  <template v-slot:itemRender="{ props }">
                    <div>
                      <v-icon
                        size="20"
                        v-text="props.item.iconClass"
                      ></v-icon>
                      <span :style="{ color: isDarkMode ? '#ffffff' : '#000000' }">{{
                        props.item.text
                      }}</span>
                    </div>
                  </template>
                </kMenu>
              </v-spacer>
            </div> -->
            <!-- 상단메뉴 -->
            <div class="gnb-wrap">
              <ul>
                <template v-for="item in horizTreevieItems">
                  <li
                    class="menu-item"
                    :class="item.iconClass"
                    v-on:mouseover="setMenuContent($event, item)"
                  >
                    <span>{{ item.menuNm }}</span>
                  </li>
                </template>
              </ul>
              <div class="gnb-2d-wrap">
                <div class="gnb-2d" :style="menuContentStyle">
                  <template v-for="item in hoverMenuItem.items">
                    <span
                      :class="item.menuId === activeMenuId ? 'on' : ''"
                      @click="onSelect({ item: item })"
                    >
                      {{ item.menuNm }}
                    </span>
                  </template>
                </div>
              </div>
            </div>
            <div class="slot-end">
              <!-- gusalnim TODO 클릭시 modal-wrap 에 active 추가-->
              <SplitButton 
                :class="'btn-tf-text-button '"
                @buttonclick="openSrchPopup"
              >
                {{ $t("CommLang.btn.menuSearchBtn") }}
              </SplitButton>
              <SplitButton
                :items="closeBtnList"
                @buttonclick="toggleTabClose"
                @itemclick="closeItemClick"
                :class="'btn-tf-tabClose'"
              >
                {{ $t("CommLang.btn.tabCloseBtn") }}
              </SplitButton>

              <DropDownButton
                :item-render="itemRender"
                :items="refreshBtnList"
                @itemclick="onSelectTimmer"
                :class="['btn-tf-refresh', refreshIcon]"
              >
                <template v-slot:itemRender="{ props }">
                  <div
                    class="k-menu-link"
                    :class="
                      props.item.actionName === 1 && refreshIcon === 't1'
                        ? 'on'
                        : 'm' + props.item.actionName / (1000 * 60) ===
                          refreshIcon
                        ? 'on'
                        : ''
                    "
                  >
                    <span>{{ props.item.text }}</span>
                  </div>
                </template>
              </DropDownButton>
              <!-- PanelBar -->
              <PanelBar
                :expand-mode="'single'"
                :items="panelBarItems"
                setting
                :class="'btn-tf-set'"
                :title="'설정'"
              >
                <template v-slot:setting>
                  <div>
                    <div>
                      다크모드

                      <ThemeSwitch ref="themeSwitch" v-show="true" />
                    </div>
                    <div v-if="!isDarkMode" class="color-select-wrap">
                      <ul class="color-select">
                        <li
                          :class="`${
                            lightTheme === 'light-mode' ? 'active' : ''
                          }`"
                          @click="changeLightTheme('light-mode')"
                        >
                          <span class="circle col-light"></span>
                          <span class="text">Basic</span>
                        </li>
                        <li
                          :class="`${
                            lightTheme === 'colAquablue-mode' ? 'active' : ''
                          }`"
                          @click="changeLightTheme('colAquablue-mode')"
                        >
                          <span class="circle col-aquaBlue"></span>
                          <span class="text">AquaBlue</span>
                        </li>
                        <li
                          :class="`${
                            lightTheme === 'colGreen-mode' ? 'active' : ''
                          }`"
                          @click="changeLightTheme('colGreen-mode')"
                        >
                          <span class="circle col-green"></span>
                          <span class="text">Green</span>
                        </li>
                        <li
                          :class="`${
                            lightTheme === 'colBlue-mode' ? 'active' : ''
                          }`"
                          @click="changeLightTheme('colBlue-mode')"
                        >
                          <span class="circle col-blue"></span>
                          <span class="text">Blue</span>
                        </li>
                        <li
                          :class="`${
                            lightTheme === 'colOrange-mode' ? 'active' : ''
                          }`"
                          @click="changeLightTheme('colOrange-mode')"
                        >
                          <span class="circle col-orange"></span>
                          <span class="text">Orange</span>
                        </li>
                        <li
                          :class="`${
                            lightTheme === 'colGray-mode' ? 'active' : ''
                          }`"
                          @click="changeLightTheme('colGray-mode')"
                        >
                          <span class="circle col-gray"></span>
                          <span class="text">Gray</span>
                        </li>
                        <li
                          :class="`${
                            lightTheme === 'colNavy-mode' ? 'active' : ''
                          }`"
                          @click="changeLightTheme('colNavy-mode')"
                        >
                          <span class="circle col-navy"></span>
                          <span class="text">Navy</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      매뉴위치
                      <kSwitch
                        :size="'small'"
                        :value="topMenu"
                        @change="topMenuOn"
                        v-show="true"
                      />
                    </div>
                    <div>
                      <DropDownList
                        :style="{ width: '100px' }"
                        :data-items="i18List"
                        :text-field="'text'"
                        :value="i18nVal"
                        :default-value="i18List[0]"
                        @change="selectI18"
                      ></DropDownList>
                    </div>
                  </div>
                </template>
              </PanelBar>
              <AdminMenu
                :miniVariant="miniVariant"
                :userNm="userInfo.name"
                :comId="userInfo.comId"
                @open="openChangePswdPop"
              />
            </div>
          </div>
        </div>
      </template>
      <!-- // 상단바 -->
    </v-app-bar>
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="miniVariant"
      :permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      app
      overflow
      v-if="!topMenu"
    >
      <div class="lnb-logo">
        <router-link class="home" :to="myHome.root">
          <h1 aria-label="DY POWER">DY POWER</h1>
        </router-link>
      </div>
      <div class="left-menu">
        <TreeView
          :dataItems="treevieItems"
          :item="'item'"
          :style="{ 'margin-top': '13px' }"
          @expandchange="onExpandChange"
          @itemclick="onItemClick"
        >
          <template v-slot:item="{ props }">
            <div
              style="width: 100%; position: relative"
              :class="[
                miniVariant ? 'justify-center' : '',
                'menu-level-' + props.item.level,
              ]"
            >
              <v-icon
                class="mr-1"
                size="20"
                v-text="props.item.iconClass"
              ></v-icon>
              <span v-if="!miniVariant" class="treeNmText">{{
                props.item.text
              }}</span>
              <span
                v-if="
                  !props.item.url &&
                  props.item.items &&
                  props.item.items.length > 0 &&
                  props.item.expanded &&
                  !miniVariant
                "
                class="k-icon k-i-arrow-chevron-down"
              />
              <span
                v-if="
                  !props.item.url &&
                  props.item.items &&
                  props.item.items.length > 0 &&
                  !props.item.expanded &&
                  !miniVariant
                "
                class="k-icon k-i-arrow-chevron-right"
              />
            </div>
          </template>
        </TreeView>
      </div>
      <!-- <template #append>
        <p class="text-caption" :style="{ letterSpacing: '-0.2px !important' }">
          &copy; {{ new Date().getFullYear() }}. DY POWER all rights reserved.
        </p>
      </template> -->
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <router-tab
          ref="routerTab"
          :tabs="treevieItems"
          :keep-last-tab="false"
          :contextmenu="false"
        >
          <template slot-scope="{ title, closable, to }">
            <span>{{ title }}</span>
            <v-icon
              size="18"
              class="ml-2"
              v-if="closable"
              @click.stop="onCloseTab(to)"
              >mdi-close-circle
            </v-icon>
          </template>
          <template #end v-if="!topMenu">
            <!-- <ThemeSwitch ref="themeSwitch" v-show="true" /> -->
            <!-- <kSwitch
              :size="'small'"
              :value="topMenu"
              @change="topMenuOn"
              v-show="true"
            /> -->
            <kbutton
              @click.stop="primaryDrawer.model = !primaryDrawer.model"
              :class="'btn-tf-LmToggle'"
              :title="'메뉴'"
            >
              <span
                v-if="primaryDrawer.model"
                class="k-icon ico-lm-close"
              ></span>
              <span
                v-if="!primaryDrawer.model"
                class="k-icon ico-lm-open"
              ></span>
            </kbutton>
            <!-- gusalnim TODO 클릭시 modal-wrap 에 active 추가-->
            <SplitButton 
              :class="'btn-tf-text-button '"
              @buttonclick="openSrchPopup"
            >
              {{ $t("CommLang.btn.menuSearchBtn") }}
            </SplitButton>
            <SplitButton
              :items="closeBtnList"
              @buttonclick="toggleTabClose"
              @itemclick="closeItemClick"
              :class="'btn-tf-tabClose'"
            >
              {{ $t("CommLang.btn.tabCloseBtn") }}
            </SplitButton>

            <!-- PanelBar -->
            <DropDownButton
              :item-render="itemRender"
              :items="refreshBtnList"
              @itemclick="onSelectTimmer"
              :class="['btn-tf-refresh', refreshIcon]"
            >
              <template v-slot:itemRender="{ props }">
                <div
                  class="k-menu-link"
                  :class="
                    props.item.actionName === 1 && refreshIcon === 't1'
                      ? 'on'
                      : 'm' + props.item.actionName / (1000 * 60) ===
                        refreshIcon
                      ? 'on'
                      : ''
                  "
                >
                  <span>{{ props.item.text }}</span>
                </div>
              </template>
            </DropDownButton>

            <PanelBar
              :expand-mode="'single'"
              :items="panelBarItems"
              setting
              :class="'btn-tf-set'"
              :title="'설정'"
            >
              <template v-slot:setting>
                <div>
                  <div>
                    다크모드

                    <ThemeSwitch ref="themeSwitch" v-show="true" />
                  </div>
                  <!-- gusalnim : 컬러 변경 셀렉트 -->
                  <div v-if="!isDarkMode" class="color-select-wrap">
                    <ul class="color-select">
                      <li
                        :class="`${
                          lightTheme === 'light-mode' ? 'active' : ''
                        }`"
                        @click="changeLightTheme('light-mode')"
                      >
                        <span class="circle col-light"></span>
                        <span class="text">Basic</span>
                      </li>
                      <li
                        :class="`${
                          lightTheme === 'colAquablue-mode' ? 'active' : ''
                        }`"
                        @click="changeLightTheme('colAquablue-mode')"
                      >
                        <span class="circle col-aquaBlue"></span>
                        <span class="text">AquaBlue</span>
                      </li>
                      <li
                        :class="`${
                          lightTheme === 'colGreen-mode' ? 'active' : ''
                        }`"
                        @click="changeLightTheme('colGreen-mode')"
                      >
                        <span class="circle col-green"></span>
                        <span class="text">Green</span>
                      </li>
                      <li
                        :class="`${
                          lightTheme === 'colBlue-mode' ? 'active' : ''
                        }`"
                        @click="changeLightTheme('colBlue-mode')"
                      >
                        <span class="circle col-blue"></span>
                        <span class="text">Blue</span>
                      </li>
                      <li
                        :class="`${
                          lightTheme === 'colOrange-mode' ? 'active' : ''
                        }`"
                        @click="changeLightTheme('colOrange-mode')"
                      >
                        <span class="circle col-orange"></span>
                        <span class="text">Orange</span>
                      </li>
                      <li
                        :class="`${
                          lightTheme === 'colGray-mode' ? 'active' : ''
                        }`"
                        @click="changeLightTheme('colGray-mode')"
                      >
                        <span class="circle col-gray"></span>
                        <span class="text">Gray</span>
                      </li>
                      <li
                        :class="`${
                          lightTheme === 'colNavy-mode' ? 'active' : ''
                        }`"
                        @click="changeLightTheme('colNavy-mode')"
                      >
                        <span class="circle col-navy"></span>
                        <span class="text">Navy</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    매뉴위치
                    <kSwitch
                      :size="'small'"
                      :value="topMenu"
                      @change="topMenuOn"
                      v-show="true"
                    />
                  </div>

                  <div>
                    <DropDownList
                      :style="{ width: '100px' }"
                      :data-items="i18List"
                      :text-field="'text'"
                      :value="i18nVal"
                      :default-value="i18List[0]"
                      @change="selectI18"
                    ></DropDownList>
                  </div>
                </div>
              </template>
            </PanelBar>

            <AdminMenu
              :miniVariant="miniVariant"
              :userNm="userInfo.name"
              :comId="userInfo.comId"
              @open="openChangePswdPop"
            />
            <!-- <DropDownList
              :style="{ width: '100px' }"
              :data-items="i18List"
              :text-field="'text'"
              :value="i18nVal"
              :default-value="i18List[0]"
              @change="selectI18"
            > </DropDownList>-->
          </template>
        </router-tab>
      </v-container>
      <div v-if="topMenu" style="text-align: center; height: 29px">
        <p class="text-caption" :style="{ letterSpacing: '-0.2px !important' }">
          &copy; {{ new Date().getFullYear() }}. DY POWER all rights reserved.
        </p>
      </div>
      <div v-if="isLoading" class="loading-container">
        <div class="loading">
          <Fade-loader />
        </div>
      </div>
      <ChangePswdPop ref="changePswdPop" :userInfo="this.userInfo" />
    </v-main>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <!-- gusalnim TODO popup 노출할때 active -->
    <SearchMenuPop ref="srchMenu" />
  </v-app>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import {
  Button,
  SplitButton,
  DropDownButton,
} from "@progress/kendo-vue-buttons";
import { Switch } from "@progress/kendo-vue-inputs";
import ThemeSwitch from "@/components/common/ThemeSwitch";
import AdminMenu from "@/components/common/AdminMenu";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import ChangePswdPop from "~/components/common/modal/ChangePswdPop";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { TreeView } from "@progress/kendo-vue-treeview";
import { Menu } from "@progress/kendo-vue-layout";
import { PanelBar } from "@progress/kendo-vue-layout";
import AlertPop from "@/components/common/modal/AlertPop";
import SearchMenuPop from "@/components/common/modal/SearchMenuPop";
import { isAbsolute } from "path";

export default {
  // head() {
  //   return {
  //     htmlAttrs: {
  //       lang: this.$i18n.locale
  //     }
  //   }
  // },
  name: "App",
  components: {
    kbutton: Button,
    ThemeSwitch,
    SplitButton,
    DropDownButton,
    FadeLoader,
    AdminMenu,
    ChangePswdPop,
    TreeView,
    kSwitch: Switch,
    kMenu: Menu,
    DropDownList,
    PanelBar,
    AlertPop,
    SearchMenuPop
  },
  computed: {
    ...mapState({
      myHome: "myHome",
      menuData: "menuData",
      treevieItems: "treevieItems",
      horizTreevieItems: "horizTreevieItems",
      isDarkMode: "isDarkMode",
      lightTheme: "lightTheme",
      activeMenuId(state) {
        if (state.activeMenuInfo) return state.activeMenuInfo.menuId;
      },
      userInfo: (state) => state.userInfo,
    }),
    selectedId() {
      return this.items
        .map((item) => item.data.path)
        .indexOf(this.$route.path.toLowerCase());
    },
    menuIconKeys() {
      return Object.keys(this.menuIconById);
    },
    themeLink() {
      // if (this.isDarkMode) {
      //   return "https://kendo.cdn.telerik.com/2023.1.117/styles/kendo.default-main-dark.min.css";
      // } else {
      //   return "https://kendo.cdn.telerik.com/2023.1.117/styles/kendo.default-nordic.min.css";
      // }
      if (this.isDarkMode) {
        return "https://kendo.cdn.telerik.com/themes/6.2.0/default/default-main-dark.css";
      } else {
        return "https://kendo.cdn.telerik.com/themes/6.2.0/default/default-nordic.css";
      }
    },
    activeTabs() {
      if (this.routerTabInstance) {
        return this.routerTabInstance.activeTab;
      } else {
        return this.myHome.root;
      }
    },
  },
  watch: {
    // activeTree: {
    //   deep: true,
    //   handler(newVal, oldVal) {
    //     const nv = newVal[0];
    //     const ov = oldVal[0];
    //     if (nv !== ov) {
    //       if (!nv) {
    //         this.activeTree.push(ov);
    //       } else {
    //         this.myMenuId = nv;
    //         if (this.menuData[nv].url){
    //           this.$router.push({
    //             path: `${this.menuData[nv].url}?menuId=${nv}`
    //           });
    //           this.$router.beforeEach((to, from, next) => {
    //             if (!to.matched.length) {
    //               next(false);
    //             } else {
    //               next();
    //             }
    //           });
    //         }else alert("지정된 페이지 경로가 없습니다.");
    //       }
    //     }
    //   }
    // },
    activeTabs: {
      deep: true,
      handler(value) {
        if (value) {
          // if (value.menuId != 'myIndex') {
          //   let thisMenuId = this.activeMenuId;
          //   var tmp = 0;
          //   for(var i=0; i < this.myMenuList.length; i++){
          //     if(this.myMenuList[i].menuId == thisMenuId){
          //       tmp = 1;
          //     }
          //   }
          // if (this.selectedItem) {
          //   this.selectedItem.selected = false;
          // }
          // this.menuData[this.activeMenuId].selected = true;
          // this.selectedItem = this.menuData[this.activeMenuId];
          //let tmpVal = this.menuData[this.activeMenuId]
          //this.onItemClick({item : tmpVal})
          //console.log("2", this.selectedItem)
          // this.bookmarkBtn = tmp;
          // this.myMenuId = thisMenuId;
          // this.activeTree.pop();
          // this.activeTree.push(thisMenuId);
          // }
        }
      },
    },
  },
  data() {
    return {
      itemRender: "itemRender",
      routerTabInstance: null,
      hoverMenuItem: {},
      items: [],
      activeTree: [],
      miniVariant: false,
      bookmarkBtn: 0,
      menuIconById: {},
      myMenuList: [],
      drawers: ["Default (no property)", "Permanent", "Temporary"],
      primaryDrawer: {
        model: null,
        type: "default (no property)",
        clipped: false,
        floating: false,
        mini: false,
      },
      footer: {
        inset: false,
      },
      routerTabInstance: null,
      closeBtnList: [
        { text: "All", actionName: "delAllTabsData" },
        { text: "Other", actionName: "deleteSblingsTab" },
      ],
      refreshBtnList: [
        { text: "1회", actionName: 1 },
        { text: "1분", actionName: 1000 * 60 },
        { text: "5분", actionName: 5 * 1000 * 60 },
        { text: "10분", actionName: 10 * 1000 * 60 },
      ],
      isLoading: false,
      selectedItem: undefined,
      topMenu: false,
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
      panelBarItems: [
        {
          expanded: false,
          title: "설정",
          content: "setting",
        },
      ],
      comboVal: 1,
      interval: null,
      refreshIcon: "t1",
      menuContentStyle: {},
    };
  },
  beforeMount() {
    let tmpI18n =
      localStorage.getItem("i18nVal") != null
        ? JSON.parse(localStorage.getItem("i18nVal"))
        : { text: "Kor", id: "ko", iso: "ko-KR" };
    this.$i18n.setLocale(tmpI18n.id);
    this.i18nVal = tmpI18n;
  },
  async mounted() {
    const _this = this;
    window._this = this;
    // let tmpI18n = localStorage.getItem("i18nVal") !=null ? JSON.parse(localStorage.getItem("i18nVal")) : {text : "한국어",id : "ko", iso:"ko-KR"};
    // this.$i18n.setLocale(tmpI18n.id)
    // this.i18nVal = tmpI18n;
    this.$axios.interceptors.request.use(
      function (config) {
        _this.isLoading = true;
        if (config.params !== undefined) {
          if (
            config.params.loadingDisabled != undefined &&
            config.params.loadingDisabled
          ) {
            _this.isLoading = false;
          }
        }
        return config;
      },
      function (error) {
        _this.isLoading = false;
        return Promise.reject(error);
      }
    );

    this.$axios.interceptors.response.use(
      function (response) {
        _this.isLoading = false;
        return response;
      },
      function (error) {
        _this.isLoading = false;
        return Promise.reject(error);
      }
    );
    await this.getMenu({});
    //await this.selectMyMenuFunc();
    this.routerTabInstance = this.$refs.routerTab;
    if (this.$route.fullPath != "/") {
      this.$refs.routerTab.items.unshift({
        closable: false,
        id: "",
        menuId: "myIndex",
        title: "Index",
        to: "/",
      });
    }

    this.myMenuList =
      localStorage.getItem("myMenuList") != null
        ? JSON.parse(localStorage.getItem("myMenuList"))
        : [];
    this.topMenu = localStorage.getItem("isTopMenu") == "true" ? true : false;
    this.$vuetify.theme.isDark =
      localStorage.getItem("isDarkMode") == "true" ? true : false;
    this.setThemeChange(
      localStorage.getItem("isDarkMode") == "true" ? true : false
    );
    if (this.$refs?.["themeSwitch"]?.mode) {
      this.$refs["themeSwitch"].mode =
        localStorage.getItem("isDarkMode") == "true" ? true : false;
    }

    const lightTheme = localStorage.getItem("lightTheme");
    this.setLightTheme(lightTheme !== null ? lightTheme : 'light-mode');

    if (this.$vuetify.theme.isDark) {
      $("body").attr("class", "dark-mode");
    } else {
      $("body").attr("class", this.lightTheme);
    }

    if (this.topMenu) {
      document.getElementsByClassName("v-main")[0].style.height =
        "calc(100% - 50px)";
      document.getElementsByClassName("container--fluid")[0].style.height =
        "calc(100% - 29px)";
    } else {
      document.getElementsByClassName("v-main")[0].style.height = "100%";
      document.getElementsByClassName("container--fluid")[0].style.height =
        "100%";
    }
  },
  created() {
    this.topMenu = localStorage.getItem("isTopMenu") == "true" ? true : false;
  },
  methods: {
    ...mapMutations({
      setActiveMenuInfo: "setActiveMenuInfo",
      setThemeChange: "setThemeChange",
      setLightTheme: "setLightTheme",
    }),
    ...mapActions({
      getMenu: "modules/menu/getMenu",
      postUpdateApi: "modules/list/postUpdateApi",
      postApiReturn: "modules/list/postApiReturn",
    }),
    setMenuContent(event, item) {
      $(".menu-item").removeClass("on");

      $(event.currentTarget).addClass("on");

      this.menuContentStyle = {
        position: "absolute",
        left: $(event.currentTarget).offset().left + "px",
      };
      this.hoverMenuItem = item;
      this.$nuxt.$emit("iccReset");
    },
    toggleTabClose() {
      if ($('.btn-tf-tabClose [aria-expanded="true"]').length === 0) {
        $(".k-split-button-arrow").click();
      }
    },
    closeItemClick(item) {
      if (item.itemIndex == 0) {
        this.delAllTabsData();
      } else {
        this.deleteSblingsTab();
      }
    },
    myMenuClick(item) {
      this.$router.push({
        path: item.item.url + "?menuId=" + item.item.menuId,
      });
    },
    refreshTab() {
      this.$nuxt.refresh();
      this.routerTabInstance.refresh();
    },
    changeTimmer(e) {},

    delAllTabsData() {
      if (this.routerTabInstance.items.length > 0) {
        this.routerTabInstance.reset();
      }
    },
    deleteSblingsTab() {
      if (this.routerTabInstance.items.length > 1) {
        for (let i = this.routerTabInstance.items.length - 1; i > -1; --i) {
          const activeTo = this.routerTabInstance.activeTab.to;
          const diffTo = this.routerTabInstance.items[i].to;

          if (activeTo != diffTo && diffTo != this.myHome.root) {
            this.routerTabInstance.close(diffTo);
          }
        }
      }
    },
    tabScrollMove(dir) {
      const scrollTab = this.routerTabInstance.$refs.scroll;
      const scrollWidth =
        scrollTab.scrollData.scrollWidth - scrollTab.scrollData.clientWidth;
      const scrollLeft = scrollTab.scrollData.scrollLeft;

      const xAxis = this.calcScroll(scrollLeft, scrollWidth, dir);
      scrollTab.scrollTo(xAxis, 0);
    },
    calcScroll(sl, sw, dir) {
      const deScrW = 60;
      let returnSl = 0;
      switch (dir) {
        case "prev":
          returnSl = sl - deScrW <= 0 ? 0 : sl - deScrW;
          break;
        case "next":
          returnSl = sl + deScrW >= sw ? sw : sl + deScrW;
          break;
        default:
          break;
      }
      return returnSl;
    },
    onCloseTab(to) {
      const findIndex = this.$tabs.items.findIndex((v) => v.to === to);
      const { to: next } = this.$tabs.items[findIndex - 1];
      this.$tabs.close(to, null);
      if (this.$router.currentRoute.fullPath != next) {
        this.$router.replace(next);
      }
    },
    // async addBookMark(){
    //   this.myMenuList.push({menuId : this.activeMenuId, menuNm : this.menuData[this.activeMenuId]});
    //   localStorage.setItem("myMenuList", JSON.stringify(this.myMenuList))
    //   this.bookmarkBtn = 1;
    // },
    // async removeBookMark(){
    //   this.myMenuList.pop(this.activeMenuId);
    //   localStorage.setItem("myMenuList", JSON.stringify(this.myMenuList))
    //   this.bookmarkBtn = 0;
    // },
    openChangePswdPop() {
      this.$refs["changePswdPop"].message = this.$i18n.t(
        "CommLang.message.msg1"
      );
      this.$refs["changePswdPop"].visibleDialog = true;
    },
    onExpandChange(event) {
      const curExpanded = event.item.expanded;

      let sameLevelItems = this.treevieItems;
      const indexArr = event.itemHierarchicalIndex.split("_");
      for (let i = 0; i < indexArr.length; i++) {
        if (i > 0) {
          sameLevelItems = this.treevieItems[indexArr[i - 1]].items;
        }
      }

      sameLevelItems.forEach(function (item) {
        item.expanded = false;
      });

      event.item.expanded = !curExpanded;
    },
    iconClassName({ text, items, level, menuId }) {
      if (level == 1) {
        if (menuId == 1) {
          return "mdi-cog-outline";
        } else if (menuId == 10) {
          return "mdi-alert-circle-outline";
        } else {
          return "mdi-package-variant-closed";
        }
      } else if (level == 2) {
        return "mdi-square-medium";
      } else {
        return "mdi-circle-medium";
      }
    },
    async onItemClick(event) {
      //메뉴 클릭시 on Class 추가
      $(event).addClass("on");

      let menuId = event.item.menuId;
      this.myMenuId = menuId;
      if (this.menuData[menuId].url) {
        await this.$router.push({
          path: `${this.menuData[menuId].url}?menuId=${menuId}`,
        });
        this.$auth.onRedirect((to, from) => {
          return `${this.menuData[menuId].url}?menuId=${menuId}`;
        });
        this.$router.beforeEach((to, from, next) => {
          if (!to.matched.length) {
            next(false);
          } else {
            next();
          }
        });
      } else {
        this.onExpandChange(event);
      }
    },
    onSelect(event) {
      let menuId = event.item.menuId;
      this.myMenuId = menuId;
      if (this.menuData[menuId].url) {
        this.$router.push({
          path: `${this.menuData[menuId].url}?menuId=${menuId}`,
        });
        this.$router.beforeEach((to, from, next) => {
          if (!to.matched.length) {
            next(false);
          } else {
            next();
          }
        });
      }
    },
    topMenuOn() {
      this.topMenu = !this.topMenu;
      localStorage.setItem("isTopMenu", this.topMenu);
      if (this.topMenu) {
        document.getElementsByClassName("v-main")[0].style.height =
          "calc(100% - 50px)";
        document.getElementsByClassName("container--fluid")[0].style.height =
          "calc(100% - 29px)";
      } else {
        document.getElementsByClassName("v-main")[0].style.height = "100%";
        document.getElementsByClassName("container--fluid")[0].style.height =
          "100%";
      }
    },
    changeLightTheme(mode) {
      this.setLightTheme(mode);

      if (this.isDarkMode) {
        $("body").attr("class", "dark-mode");
      } else {
        $("body").attr("class", this.lightTheme);
      }
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
      window.location.href = "/";
    },
    onSelectTimmer(time) {
      if (typeof time !== "number") {
        if (typeof time.item?.actionName === "number") {
          time = time.item?.actionName;
        } else {
          return;
        }
      }

      // <div @click="onSelectTimmer(1000 * 60)">
      //                 1분
      //               </div>
      //               <div @click="onSelectTimmer(1000*5 * 60)">
      //                 5분
      //               </div>
      //               <div @click="onSelectTimmer(1000*10 * 60)">

      clearInterval(this.interval);

      if (time == 1) {
        this.refreshIcon = "t1";
        this.$nuxt.refresh();
        this.routerTabInstance.refresh();
      } else {
        this.refreshIcon = "m" + time / (1000 * 60);
        this.interval = setInterval(() => {
          this.$nuxt.refresh();
          this.routerTabInstance.refresh();
        }, time);
      }
    },
    axiosAlertPopOpen(code) {
      let message = "";
      if (code.status == 500) {
        message = "서버에 문제 발생 하였습니다. 담당자에게 문의하세요.";
      } else if (code.status == 401 || code.status == 403) {
        message = "권한이 없습니다. 로그인후 이용하세요.";
      } else if (
        code.status == 405 ||
        code.status == 413 ||
        code.status == 400
      ) {
        message = "잘못된 요청입니다.";
      } else {
        message = "오류가 발생했습니다.";
      }

      console.log(code.status);
      this.$refs.alertPop.title = "오류";
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = true;
      this.$refs.alertPop.modalWidth = "350px";
    },
    openSrchPopup() {
      this.$refs.srchMenu.toggleDialog();
    }
  },
};
</script>

<style lang="scss">
.loading {
  z-index: 99;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.4);
  //box-shadow: rgba(68, 67, 67, 0.9) 0 0 0 9999px;
}
.v-spinner {
  top: 50%;
  left: 50%;
}
.k-menu-item {
  padding-right: 20px;
}
.k-menu-link {
  font-size: 16px;
}
</style>
