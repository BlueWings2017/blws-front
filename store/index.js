const INIT_STATE = {
  userInfo: {
    userId: "manager"
  },
  indexRoot: {
    root: "/",
    menuNm: "Index",
    menuId: "myIndex",
    id: "myIndex"
  },
  myHome: {
    root: "/",
    menuNm: "Index",
    menuId: "myIndex",
    id: "myIndex"
  },
  menuData: localStorage.getItem("menuData")!=null ? JSON.parse(localStorage.getItem("menuData")) : {
    myIndex: {
      root: "/",
      menuNm: "Index",
      menuId: "myIndex",
      id: "myIndex"
    }
  },
  treevieItems: [],
  horizTreevieItems: [],
  activeMenuInfo: {
    menuId: "0"
  },
  openTabList: [],
  isDarkMode: false,
  lightTheme: "light-mode",
  holidayList: null,
  drawer: true,
};

export const state = () => Object.assign({}, INIT_STATE);

export const mutations = {
  setActiveMenuInfo(state, payload) {
    state.activeMenuInfo = payload;
  },
  setMyHome: (state, payload) => {
    state.myHome = payload;
  },
  setIndexRoot: (state, payload) => {
    state.indexRoot = payload;
  },

  setMenuItems(state, payload) {
    localStorage.setItem("menuData", JSON.stringify(payload))
    state.menuData = Object.assign(INIT_STATE.menuData, payload); // 일단 추가
  },
  
  setTreevieItems(state, payload) {
    state.treevieItems = INIT_STATE.treevieItems; // 일단 추가
    state.treevieItems = state.treevieItems.concat(payload); // 일단 추가
  },

  setHorizTreevieItems(state, payload) {
    state.horizTreevieItems = INIT_STATE.horizTreevieItems; // 일단 추가
    state.horizTreevieItems = state.horizTreevieItems.concat(payload); // 일단 추가
  },

  setThemeChange: (state, payload) => {
    localStorage.setItem("isDarkMode", payload);
    state.isDarkMode = payload;
  },
  setLightTheme: (state, payload) => {
    localStorage.setItem("lightTheme", payload);
    state.lightTheme = payload;
  },
  setDrawer: (state, payload) => {
    state.drawer = !state.drawer;
  },
  
  setUserInfo: (state, payload) => {
    state.userInfo = Object.assign({}, payload);
  },
};

export const getters = {};

export const actions = {

};
export const strict = false;
