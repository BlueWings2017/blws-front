import Utility from "~/plugins/utility";
const DOMAIN = "/api/";

export const state = () => Object.assign({}, INIT_URL_STATE);

export const mutations = {
}
export const actions = {
  async postApi({ state, commit }, payload) {
    const headers = {
      headers: {
        "X-Fems-MenuId":
          this.state.activeMenuInfo.menuId == undefined
            ? "0"
            : this.state.activeMenuInfo.menuId,
      },
    };
    const apiUrl = state[payload.apiKey];
    const params = { params: payload.sendParam || {} };
    const res = await this.$axios.post(DOMAIN + apiUrl, params, headers);
    commit(
      "setPageData",
      {
        [payload.dataKey]: payload.resKey
          ? res.data.dataset[payload.resKey]
          : res.data.dataset,
      },
      { root: true }
    );
  },

  async postApiReturn({ state }, payload) {
    const headers = {
      headers: {
        "X-Fems-MenuId":
          this.state.activeMenuInfo.menuId == undefined
            ? "0"
            : this.state.activeMenuInfo.menuId,
      },
    };
    const apiUrl = state[payload.apiKey];
    const params = { params: payload.sendParam || {} };
    const res = await this.$axios.post(DOMAIN + apiUrl, params, headers);
    if (Array.isArray(payload.resKey)) {
      const result = {};
      for (const item of payload.resKey) {
        result[item] = res.data.dataset[item];
      }
      return result;
    }
    return payload.resKey ? res.data.dataset[payload.resKey] : res.data.dataset;
  },

  async postUpdateApi({ state }, payload) {
    const headers = {
      headers: {
        "X-Fems-MenuId":
          this.state.activeMenuInfo.menuId == undefined
            ? "0"
            : this.state.activeMenuInfo.menuId,
      },
    };
    const apiUrl = state[payload.apiKey];
    const params = payload.sendParam;
    const res = await this.$axios.post(DOMAIN + apiUrl, params, headers);
    return res;
  },

  getDomain() {
    return DOMAIN;
  },

  setTree({ commit }, payload) {
    const res = payload.value;
    const treeKey = payload.treeKey;
    let tmpLsit = [];
    if (res.length > 0) {
      tmpLsit = res
        .map((item) => ({
          ...item,
          expanded: true,
          name: item[Utility.toCamelCase(treeKey + "_nm")],
          _attributes: {
            expanded: true,
          },
          _children: [],
        }))
        .reduce(
          (acc, it) => ({
            ...acc,
            [it[Utility.toCamelCase("up_" + treeKey)]]: acc[
              it[Utility.toCamelCase("up_" + treeKey)]
            ]
              ? [...acc[it[Utility.toCamelCase("up_" + treeKey)]], it]
              : [it],
          }),
          {}
        );
      Object.getOwnPropertyNames(tmpLsit)
        .reverse()
        .forEach(function (val, idx, array) {
          array.map((obj) => {
            tmpLsit[obj].filter((v) => {
              if (val === v[Utility.toCamelCase(treeKey)]) {
                v._children = tmpLsit[val];
              }
              if (val === obj && v._children.length === 0) {
                delete v._children;
              }
            });
          });
        });
    }
    return tmpLsit;
  },

  async getListReturn({ state }, payload) {
    const apiUrl = payload.apiKey;
    const params = payload.sendParam;
    const res = await this.$axios.get(DOMAIN + apiUrl, { params });
    return res.data;
  },

  async postInsertReturn({ state }, payload) {
    const apiUrl = payload.apiKey;
    const params = payload.sendParam;
    const res = await this.$axios.post(DOMAIN + apiUrl, params);
    return res.data;
  },

  async putUpdateReturn({ state }, payload) {
    const apiUrl = payload.apiKey;
    const params = payload.sendParam;
    const res = await this.$axios.put(DOMAIN + apiUrl, params);
    return res.data;
  },

  async deleteDeleteReturn({ state }, payload) {
    const apiUrl = payload.apiKey;
    const params = { data: payload.sendParam };
    const res = await this.$axios.delete(DOMAIN + apiUrl, params, {
      withCredentials: true,
    });
    return res.data;
  },

  async mesGet({ state }, payload) {
    const apiUrl = payload.apiKey;
    const param = getParam(
      payload.queryId,
      payload.sendParam,
      payload.queryVersion
    );
    const res = await this.$axios.get(DOMAIN + apiUrl, { params: param });
    if (res.data.status === 400) {
      return [];
    }
    return res.data;
    // try {
    //   const res = await this.$axios.get(DOMAIN + apiUrl, {params: param} );
    //   return res.data;
    // } catch (error) {
    //   return [];
    // }
  },

  async mesPost({ state }, payload) {
    const apiUrl = payload.apiKey;
    const params = postParam(
      payload.messagename,
      payload.sendParam,
      payload.params2
    );
    const res = await this.$axios.post(DOMAIN + apiUrl, params);
    return res.data;
  },

};

const getParam = (QUERYID, param, queryVersion = "00001") => {
  const obj = Object.keys(param).map((x) => {
    const key = `bindv.${x}`;
    return { [key]: param[x] };
  });
  return {
    language: "ko",
    queryid: QUERYID,
    plantid: "LS",
    eventuser: "manager",
    queryversion: queryVersion,
    loadingDisabled: param.loadingDisabled,
    ...Object.assign({}, ...obj),
  };
};

const postParam = (messagename, param, params2 = {}) => {
  return {
    PLANTID: "LS",
    EVENTUSER: "manager",
    DATALIST: {
      MESSAGENAME: messagename,
      PLANTID: "LS",
      EVENTUSER: "manager",
      DATAINFO: param,
      id: "DATASET",
    },
    MESSAGENAME: messagename,
    ...params2,
  };
};

const INIT_URL_STATE = {
};
