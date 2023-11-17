import { arrayToTree } from "performant-array-to-tree";

export const state = () => Object.assign({}, INIT_DATA);
const INIT_DATA = {
  frmBOMD_Data: [],
  dgvBomDefinition: [], 
  dgvBomDetail: [],
  selectedProduct: {},
  treeData: [],
  bomOriMasterData: [],
  bomOriDetailData: [],
};

export const mutations = {
  setData(state, payload) {
    state.frmBOMD_Data = payload;
  }, 
  setDgvBomDefinitionList(state, payload) {
    state.dgvBomDefinition = payload;
  },
  setDgvBomDetailList(state, payload) {
    state.dgvBomDetail = payload;
  },
  setSelectedProduct(state, payload) {
    state.selectedProduct = payload;
  },
  setTreeData(state, payload) {
    const data = payload.map(x => ({...x, expanded: true, selected: false}))
    const tree = arrayToTree(data, { dataField: null });
    state.treeData = tree;
  },
  setBomOriMasterData(state, payload) {
    state.bomOriMasterData = payload;
  },
  setBomOriDetailData(state, payload) {
    state.bomOriDetailData = payload;
  },
}

export const actions =  {
  setDataAction({ state, commit, dispatch }, payload){
    commit("setData", payload);
  },
  setDgvBomDefinitionListAction({ state, commit, dispatch }, payload){
    commit("setDgvBomDefinitionList", payload);
  },
  setDgvBomDetailListAction({ state, commit, dispatch }, payload){
    commit("setDgvBomDetailList", payload);
  },
  setSelectedProductAction({ state, commit, dispatch }, payload){
    commit("setSelectedProduct", payload);
  },
  setTreeDataAction({ state, commit, dispatch }, payload){
    commit("setTreeData", payload);
  },
  setBomOriMasterDataAction({ state, commit, dispatch }, payload){
    commit("setBomOriMasterData", payload);
  },
  setBomOriDetailDataAction({ state, commit, dispatch }, payload){
    commit("setBomOriDetailData", payload);
  },
}


export const getters = {}
;
