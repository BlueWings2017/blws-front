import Utility from "~/plugins/utility";
const DOMAIN = "/api/";

export const state = () => Object.assign({}, INIT_HEADER);
const INIT_HEADER = {
  gridHeader: [],
  initParam: {
    apiKey: "mes/common/getqueryresult",
    queryId: "GetGridInit",
    sendParam: {
      plantid: "LS",
      userid: "manager",
      menugrouptype: "UI",
      gridid: ""
    }
  },
};

export const mutations = {
  setHader(state, payload) {
    state.gridHeader = payload;
  },
  setGridId(state, payload){
    state.initParam.sendParam.gridid = payload;
  }
}
export const actions =  {
  //수정여부
  // { field: 'rowStat', editable: false, title: " 빈칸", width: 10, cell:"crudCellTemplate", className: "gridTextCenter"},
  //콤보박스  CELLTYPE : "EnumComboBox"
  // { field: 'AREATYPE', editable: true, title: "생산지역구분", cell: "AREATYPE",width: 10, className: "gridTextCenter"  },
  //체크박스  CELLTYPE : "YesNo"
  // { field: 'GOINOR',  editable: true, title: "순차여부", cell: "checkbox", width: 10, className: "gridTextCenter"  },
  //인풋
  // { field: 'KOREAN',  editable: false, title: "한글", width: 10, className: "gridTextCenter"  },

  async getHaderAction({ state, commit, dispatch }, payload) {
    commit("setGridId", payload.gridid);
    const width = Math.round(payload.offsetWidth / 100);

    let header = [];
    let gridComboList = [];
    //GRIDCOLUMNID: "AREATYPE"
    
    await dispatch("modules/list/mesGet", state.initParam, { root: true }).then((res) => {
      const data = res.sort((a, b) => a.POSITION - b.POSITION);
      gridComboList = data.filter(x => x.CELLTYPE === "EnumComboBox");

      header = data.map((x) => {
        let cell = "";
        //CELL_TYPE 정의
        if(!x.PRIMARYKEYFLAG && x.EDITFLAG === "Yes"){
          if(x.CELLTYPE === "EnumComboBox"){
            cell = x.GRIDCOLUMNID;
          }else if(x.CELLTYPE === "YesNo" || x.CELLTYPE === "ActiveState"){
            cell = x.GRIDCOLUMNID
          }
        }

        if(x.PRIMARYKEYFLAG){
          cell = "PRIMARYKEYFLAG"
        }
        return {
          field: x.GRIDCOLUMNID,
          editable: !x.PRIMARYKEYFLAG && x.EDITFLAG === "Yes",
          title: x.GRIDCOLUMNNAME,
          width: width * (x.GRIDCOLUMNSIZE-5)/10,
          cell: cell,
          className: "gridTextCenter",
          VISIBLEFLAG: x.VISIBLEFLAG,
        }
      }).filter(x => x.VISIBLEFLAG === "Yes");
      const rowstat = { field: 'rowStat', editable: false, title: " ", width: width *5, cell:"crudCellTemplate", className: "gridTextCenter"}
      header.splice(1,0,rowstat);
      commit("setHader", header);

    });

  },
}
