export const state = () => Object.assign({}, INIT_DATA);
const INIT_DATA = {
  frmAE_Data: [],
  dgvProcessList_Available: [], 
  dgvEquipmentList_Available: [],
  isModelingSetSave: false,
  selectedProduct: {}, // 추가버튼 - 제품 제품명
  selectedProcess: {}, // 추가버튼 - 공정 공정명
  selectedEquipment: [], // BOM상세 그리드 추가-검색버튼 클릭시 설비명, 설비코드
  equipmentOriData: [],
};

export const mutations = {
  setData(state, payload) {
    state.frmAE_Data = payload;
  }, 
  setDgvProcessList(state, payload) {
    state.dgvProcessList_Available = payload;
  },
  setDgvEquipmentList(state, payload) {
    state.dgvEquipmentList_Available = payload;
  },
  setModelingSetSave(state, payload) {
    state.isModelingSetSave = payload;
  },
  setSelectedProduct(state, payload) {
    state.selectedProduct = payload;
  },
  setSelectedProcess(state, payload) {
    state.selectedProcess = payload;
  },
  setSelectedEquipment(state, payload) {
    state.selectedEquipment = payload;
  },
setEquipmentOriData(state, payload) {
    state.equipmentOriData = payload;
  },
  
}

export const actions =  {
  setDataAction({ state, commit, dispatch }, payload){
    commit("setData", payload);
  },
  setDgvProcessListAction({ state, commit, dispatch }, payload){
    commit("setDgvProcessList", payload);
  },
  setDgvEquipmentListAction({ state, commit, dispatch }, payload){
    commit("setDgvEquipmentList", payload);
  },
  setModelingSetSaveAction({ state, commit, dispatch }, payload){
    commit("setModelingSetSave", payload);
  },
  setSelectedProductAction({ state, commit, dispatch }, payload){
    commit("setSelectedProduct", payload);
  },
  setSelectedProcessAction({ state, commit, dispatch }, payload){
    commit("setSelectedProcess", payload);
  },
  setSelectedEquipmentAction({ state, commit, dispatch }, payload){
    commit("setSelectedEquipment", payload);
  },
  setsetEquipmentOriDataAction({ state, commit, dispatch }, payload){
    commit("setEquipmentOriData", payload);
  },
}


export const getters = {}
;
