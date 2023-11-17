export const state = () => Object.assign({}, INIT_DATA);

const INIT_DATA = {
  rotId: "",
  nowTab: 0,
  lotInfo: {},
  process: {},
  event:{},
  eventOrg:[],
  tabType: "",
  eventRowId: "",
  eventHeader: [],
  processHeader: [],
  sTimeKey: "",
  curProcess: 0,
};

export const mutations = {
  setRotId(state, payload) {
    state.rotId = payload;
  },
  setNowTab(state, payload) {
    state.nowTab = payload;
  },
  setLotInfo(state, payload) {
    state.lotInfo = payload;
  },
  setProcess(state, payload) {
    state.process = payload;
  },
  setEvent(state, payload) {
    const groupByEvent = payload.reduce((acc, cur, idx) => {
      const arr = [];
      const key = `${cur["PROCESSID"]}_${cur["ROUTERELATIONSEQUENCE"]}`
      const main_rework = cur["PROCESSROUTETYPE"];
      const obj = {};

      if(!acc[main_rework]){
        if(!acc[main_rework]?.[key]){
          arr.push(cur);
          obj[key] = arr;
          acc[main_rework] = obj
        }
        return acc;
      }else{
        if(acc[main_rework]?.[key]){
          acc[main_rework]?.[key].push(cur)
        }else{
          arr.push(cur);
          obj[cur["PROCESSID"]] = arr;
          acc[main_rework] = {...acc[main_rework], [key]: arr};
        }
        return acc;
      }
    },{});

    state.event = groupByEvent;
  },
  setEventRowId(state, payload) {
    state.eventRowId = payload;
  },
  setTabType(state, payload) {
    state.tabType = payload;
  },
  setEventHeader(state, payload) {
    state.eventHeader = payload;
  },
  setProcessHeader(state, payload) {
    state.processHeader = payload;
  },
  setSTimeKey(state, payload) {
    state.sTimeKey = payload;
  },
  setCurProcess(state, payload) {
    state.curProcess = payload;
  },
  setReset(state, payload){
    state.rotId = ""
    state.nowTab = 0
    state.lotInfo = {}
    state.process = {}
    state.event = {}
    state.eventOrg = []
    state.tabType = ""
    state.eventRowId = ""
    state.eventHeader = []
    state.processHeader = []
    state.sTimeKey = ""
    state.curProcess = 0
  }
}

export const actions =  {
  async rotIdAction({ state, commit, dispatch }, payload){
    commit("setRotId", payload);
    const param = {
      apiKey: "mes/common/getqueryresult",
      queryId: "GetProcessRouteProgressList",
      sendParam: {
        plantid: "Ls",
        lotid: payload,
      },
      queryVersion: "00010"
    }

    const processList =  await dispatch("modules/list/mesGet", param, { root: true })
    let groupByData = processList.reduce((acc, cur, idx) => {
      const status = !!cur.PROCESSSTATUS
      if(!acc[cur["ROUTERELATIONSEQUENCE"]]){
        const arr = [];
        arr.push({...cur});
        acc[cur["ROUTERELATIONSEQUENCE"]] = arr;
        return acc;
      }else{
        acc[cur["ROUTERELATIONSEQUENCE"]].push({...cur});
        return acc;
      }
    },{});
    
    Object.keys(groupByData).forEach(ele => {
      const status = groupByData[ele].filter(x => !!x.PROCESSSTATUS);
      const selected = status.length === 0 ? groupByData[ele][0] : status[0];
      groupByData[ele] = groupByData[ele].map(x => {
        if(x.PROCESSID === selected.PROCESSID){
          return {...x, selected: true}
        }
        return {...x, selected: false}
      })
    });
    commit("setProcess", groupByData);
    
    const param2 = {
      apiKey: "mes/common/getqueryresult",
      queryId: "GetStepRouteProgressList",
      sendParam: {
        plantid: "Ls",
        lotid: payload,
      },
      queryVersion: "00010"
    }
    const eventList =  await dispatch("modules/list/mesGet", param2, { root: true });
    commit("setEvent", eventList)
  },
  lotInfoAction({ state, commit, dispatch }, payload){
    commit("setLotInfo", payload);
  },
  nowTabAction({ state, commit, dispatch }, payload){
    commit("setNowTab", payload);
  },
  processAction({ state, commit, dispatch }, payload){
    commit("setProcess", payload);
  },
  eventRowIdAction({ state, commit, dispatch }, payload){
    commit("setEventRowId", payload);
  },
  tabTypeAction({ state, commit, dispatch }, payload){
    commit("setTabType", payload);
  },
  eventHeaderAction({ state, commit, dispatch }, payload){
    commit("setEventHeader", payload);
  },
  processHeaderAction({ state, commit, dispatch }, payload){
    commit("setProcessHeader", payload);
  },
  curProcessAction({ state, commit, dispatch }, payload){
    commit("setCurProcess", payload);
  },
  resetAction({ state, commit, dispatch }, payload){
    commit("setReset", payload);
  },
}


export const getters= {
}