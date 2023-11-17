import { arrayToTree } from "performant-array-to-tree";

export const state = () => Object.assign({}, INIT_DATA);
const INIT_DATA = {
  frmPRC_Data: [],
  dgvOperation: [], 
  dgvRecipe: [],
  treeData: [],
  isRoutingSetSave: false,
  seq: 100000,
  recipSeq: 100000,
  isTreeChange: false,
  modProcessStep: false,
  isTreeClicked: false
};

const processSeqArr = [];

export const mutations = {
  setData(state, payload) {
    state.frmPRC_Data = payload;
  }, 
  setdgvOperation(state, payload) {
    // payload.forEach(x => {
    //   state.processSeqArr.push(x.PROCESSSEQUENCE)
    // });
    state.dgvOperation = payload;
    state.seq = ((payload.length+1) * 100) + 100000;
    
  },
  setDgvRecipe(state, payload) {
    state.dgvRecipe = payload
    state.recipSeq = ((payload.length + 1) * 100) + 100000;
  },
  setTreeData(state, payload) {
    const data = payload.map(x => ({...x, expanded: true, selected: false}))
    const tree = arrayToTree(data, { dataField: null, childrenField: "items"  });
    state.treeData = tree;
  },
  setMvTreeData(state, payload) {
    state.treeData = payload;
  },
  setRoutingSetSave(state, payload) {
    state.isRoutingSetSave = payload;
  },
  setReset(state, payload) {
    state.frmPRC_Data = []
    state.dgvOperation = []
    state.dgvRecipe = []
    state.treeData = []
    state.isRoutingSetSave = false;
    state.seq = 100000;
    state.isTreeChange = false;
    state.modProcessStep = false;
    state.isTreeClicked = false;
  },
  setSeqs(state, payload) {
    state.seq = payload;
  },
  setIsTreeChange(state, payload) {
    state.isTreeChange = payload;
  },
  setModProcessStep(state, payload) {
    state.modProcessStep = payload;
  },
  setIsTreeClicked(state, payload) {
    state.isTreeClicked = payload;
  },
  
}

export const actions =  {
  setDataAction({ state, commit, dispatch }, payload){
    commit("setData", payload);
  },
  setdgvOperationAction({ state, commit, dispatch }, payload){
    commit("setdgvOperation", payload);
  },
  setDgvRecipeAction({ state, commit, dispatch }, payload){
    commit("setDgvRecipe", payload);
  },
  setTreeDataAction({ state, commit, dispatch }, payload){
    commit("setTreeData", payload);
  },
  setMvTreeDataAction({ state, commit, dispatch }, payload){
    commit("setMvTreeData", payload);
  },
  setRoutingSetSaveAction({ state, commit, dispatch }, payload){
    commit("setRoutingSetSave", payload);
  },
  resetPRCAction({ state, commit, dispatch }, payload){
    commit("setReset", payload);
  },
  setSeqsAction({ state, commit, dispatch }, payload){
    commit("setSeqs", payload);
  },
  setIsTreeChange({ state, commit, dispatch }, payload){
    commit("setIsTreeChange", payload);
  },
  setModProcessStep({ state, commit, dispatch }, payload){
    commit("setModProcessStep", payload);
  },
  setIsTreeClicked({ state, commit, dispatch }, payload){
    commit("setIsTreeClicked", payload);
  },
  
}


export const getters = {}
;