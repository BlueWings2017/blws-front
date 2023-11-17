const DOMAIN = "/api/";

const ROUTE_URL = {
  myIndex: "/"
};

export const state = () => Object.assign({}, ROUTE_URL);

export const actions = {
  async getMenu({ state, dispatch, commit }, payload) {
    let localeGroup = localStorage.getItem("i18nVal") !=null ? JSON.parse(localStorage.getItem("i18nVal")) : {text : "Kor",id : "ko", iso:"ko-KR"};
    let locale = localeGroup.id;
    let iso = localeGroup.iso;
    const params = { locale : iso };
    const res = await this.$axios.get(
      DOMAIN + "common/menu/main",
      {params}
    );
    const treeList = res.data.treeList;
    const horizTreeList = res.data.horizTreeList;
    const list = res.data.menuList.map(item=> ({
      ...item,
      text: item.menuNm,
      expanded: false,
      selected: false,
      items:[]
    }));
    let myMenu = [];
    if (list.length > 0) {
      myMenu = list
        .map((item, i) => ({
          ...item,
          upMenuId: item.upMenuId || item.menuNm,
        }));
    }
    commit("setHorizTreevieItems", horizTreeList, { root: true });
    commit("setTreevieItems", treeList, { root: true });
  //  dispatch("setMenuTree", res.data.treeList);
    commit(
      "setMenuItems",
      myMenu.reduce(
        (acc, it) => ({
          ...acc,
          [it.menuId]: it
        }),
        {}
      ),
      { root: true }
    );
  },

  async setMenuTree({ commit }, payload) {
    let tmpLsit = [];
    if (payload.length > 0) {
      tmpLsit = payload
        .map(item => ({
          ...item,
          children: []
        }))
        .reduce(
          (acc, it) => ({
            ...acc,
            [it.upMenuId]: acc[it.upMenuId] ? [...acc[it.upMenuId], it] : [it]
          }),
          {}
        );
      Object.getOwnPropertyNames(tmpLsit)
        .reverse()
        .forEach(function(val, idx, array) {
          array.map(obj => {
            tmpLsit[obj].filter(v => {
              if (val === v.menuId) {
                v.children = tmpLsit[val];
              }
              if (val === obj && v.children.length === 0) {
                delete v.children;
              }
            });
          });
        });
    }
    commit("setTreevieItems", tmpLsit["0"], { root: true });
  }
};
