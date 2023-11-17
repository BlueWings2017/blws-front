<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>상태변경설정</li>
    </ol>
    <v-row ref="searchFilter" no-gutters>
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row>
              <v-col :sm="9" :lg="10" align="left">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>상태관리 개체</label>
                    <inputText
                      ref="intputStateObject"
                      :boxWidth="'100%'"
                      :dataNm="'intputStateObject'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">조회</Button>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col cols="6" align="left">
                <CardTitle>상태변경 설정</CardTitle>
              </v-col>
              <v-col cols="6" align="right">
                <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">저장</Button>
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'add'"
                  @click="addBtn"
                  >추가</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'delete'"
                  @click="delBeforChk"
                  >삭제</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'undo'"
                  @click="undoBtn"
                  >undo</Button
                >
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="false"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :checkHeaderArr="checkHeaderArr"
                :isPaging="true"
                :customCell="customCell"
                @sortChangeHandler="sortChangeHandler"
                @selectionchange="onSelectionchange"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @headerselectionchange="onHeaderSelectionChange"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop
      :is="'confirmPop'"
      ref="confirmPop"
      :visibleDialog="false"
      :callBack="() => {}"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
// import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
// import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
// import utils from "~/plugins/utils";

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
  async asyncData(context) {
    const myState = context.store.state;
    myMenuId = context.route.query.menuId;
    await context.store.commit("setActiveMenuInfo", myState.menuData[myMenuId]);
    myTitle = await myState.activeMenuInfo.menuNm;
  },
  meta: {
    title: () => {
      return myTitle;
    },
    menuId: myMenuId,
    closable: true,
  },
  components: {
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    // TreeView,
    KendoGrid,
    InputText,
  },
  data() {
    return {
      gridHeader: [],
      treeData: [],
      columns: [],
      gridHeight: "100px",
      gridData: [],
      gridOriData: [],
      saveOriData:[],
      gridLastModIdx: null,
      checkHeaderArr: [],
      intputStateObject: "",
      selectedField: 'selected',
      headerParam: {
        gridid: "dgvStateChangePolicy", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        gridDropDownList: [
        {
          dataVal: "REASONCODETYPE",
          dataItem: [],
          disable: false,
        },
        {
          dataVal: "STATEOBJECT",
          dataItem: [],
          disable: false,
        },
        {
          dataVal: "RESOURCESTATENAME", // 기존상태
          dataItem: [],
          disable: true,
        },
        {
          dataVal: "CHANGESTATENAME", // 변경가능상태
          dataItem: [],
          disable: true,
        },
      ],
      },
      gridHeader: [],
      customCell: [ 'REASONCODETYPE','STATEOBJECT', 'RESOURCESTATENAME', 'CHANGESTATENAME'],
      customDropDown:true,
      
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + "px";
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper, this.customDropDown);
    await this.getGridComboList();
    await this.getGridData();
  },
  computed: {
    areAllSelected() {
      return (
        this.gridData.findIndex((x) => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    },
  },
  watch: {},
  methods: {
    // 조회버튼 클릭
    searchBtn() {
      this.$refs.rowGrid.sortField = [{}];
      this.$refs.rowGrid.skip = 0;
      this.getGridComboList();
      this.getGridData();
    },
    // 저장버튼 클릭
    saveBtn() {
      // console.log("저장버튼::::::::::::")
      const saveData = this.gridData
        .filter((x) => x.rowStat !== "N")
        .map((x) => {
          // console.log("::::XXXXX:::::::", x);
          let changeState = "";
          let resourceState = "";
          if (x.rowStat == "C") {
            const changeStateData = x.customCell.CHANGESTATENAME.dataItem.filter((y) => y.ENUMVALUE == x.CHANGESTATENAME);
            changeState = changeStateData[0].ENUMVALUENAME;
            const resourceStateData = x.customCell.RESOURCESTATENAME.dataItem.filter((y) => y.ENUMVALUE == x.RESOURCESTATENAME);
            resourceState = resourceStateData[0].ENUMVALUENAME;

            return {
              ...x,
              plantid: "LS",
              _rowstatus: x.rowStat,
              STATEOBJECT: x.STATEOBJECT === undefined ? "" : x.STATEOBJECT,
              CHANGESTATE: x.CHANGESTATENAME === undefined ? "" : x.CHANGESTATENAME,
              CHANGESTATENAME: changeState === undefined ? "" : changeState,
              RESOURCESTATE: x.RESOURCESTATENAME === undefined ? "" : x.RESOURCESTATENAME,
              RESOURCESTATENAME: resourceState === undefined ? "" : resourceState,
              REASONCODETYPE: x.REASONCODETYPE === undefined ? "" : x.REASONCODETYPE,
              _ROWSTATUSIMAGE: "System.Drawing.Bitmap",
              DESCRIPTION: x.DESCRIPTION === undefined ? "" : x.DESCRIPTION,
              idx: x.idx
              
            }
          } else {
            return {
              ...x,
              _rowstatus: x.rowStat,
              _ROWSTATUSIMAGE: "System.Drawing.Bitmap",
            }
          }
          // console.log("changeData:::::", changeStateData[0].ENUMVALUENAME);
          // console.log("changeData:::::", resourceStateData[0].ENUMVALUENAME);
          
        });
        // console.log("::::saveData:::::::", saveData);

        for(var i=0; i<saveData.length; i++) {
          // console.log("saveData[i]::::::::", saveData[i]);
          if(saveData[i].STATEOBJECT == "" || saveData[i].STATEOBJECT === undefined) {
            this.$refs.alertPop.show("알림", "상태관리개체 값은 필수 입력 값입니다.");
            return;
          } 
          if (saveData[i].RESOURCESTATENAME == "" || saveData[i].RESOURCESTATENAME === undefined) {
            this.$refs.alertPop.show("알림", "기존상태 값은 필수 입력 값입니다.");
            return;
          }
          if (saveData[i].CHANGESTATENAME == "" || saveData[i].CHANGESTATENAME === undefined) {
            this.$refs.alertPop.show("알림", "변경가능상태 값은 필수 입력 값입니다.");
            return;
          }
          
          for(var j=0; j<this.saveOriData.length; j++) {
            if(this.saveOriData[j].idx != saveData[i].idx){
              if(this.saveOriData[j].STATEOBJECT == saveData[i].STATEOBJECT) {
                if(this.saveOriData[j].RESOURCESTATE == saveData[i].RESOURCESTATE) {
                  if(this.saveOriData[j].CHANGESTATE == saveData[i].CHANGESTATE) {
                    this.$refs.alertPop.show("알림", "해당개체에 이미 등록된 상태 값이 있습니다.");
                    return;
                  }
                }
              }
            }
          }
        }

      // console.log(saveData);
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnStatePolicy",
          sendParam: saveData,
        }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === "0") {
              this.$refs.alertPop.show("알림", "저장되었습니다.");
              this.getGridData();
            } else {
              this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
            }
          });
        });
      } else {
        this.$refs.alertPop.show("알림", "저장할 데이터가 존재하지 않습니다.");
        return;
      }
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetStateChangePolicyList",
        sendParam: {
          plantid: "LS",
          stateobject: this.intputStateObject,
        },
      }).then((res) => {
        const data = res.map((x, idx) => {
          const customCell = {
            REASONCODETYPE: {
              type: 'combo',
              dataItem: this.headerParam.gridDropDownList[0].dataItem,
              disable: false,
            },
            STATEOBJECT: {
              type: 'combo',
              dataItem: this.headerParam.gridDropDownList[1].dataItem,
              disable: false,
              readonly: true
            },
            RESOURCESTATENAME: {
              type: '',
              disable: true,
            },
            CHANGESTATENAME: {
              type: '',
              disable: true,
            },

          };

          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            customCell,
          };
        });
        // console.log("data ====== ", data);
        this.$nuxt.$emit("iccReset");
        this.gridOriData = data;
        // this.gridOriData = JSON.parse(JSON.stringify(data));
        this.saveOriData = data;
        this.gridData = data;
      });
    },
    //그리드 콤보박스 리스트가져오기
    async getGridComboList() {
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReasoncodeTypeList",
        sendParam: {
          plantid: "LS",
        },
      }).then((data) => {
        const combo = data.map((x) => {
          return {
            ENUMVALUE: x.CODE,
            ENUMVALUENAME: x.NAME,
          };
        });
        // console.log("comboList::::", combo);
        this.headerParam.gridDropDownList[0].dataItem = combo;
      }),
        await this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetStateObjectList",
          sendParam: {
            plantid: "LS",
          },
        }).then((data) => {
          const combo = data.map((x) => {
              return {
                ENUMVALUE: x.STATEOBJECT,
                ENUMVALUENAME: x.STATEOBJECT,
              };
            });
            // console.log("combo list:::::::::", combo);
          this.headerParam.gridDropDownList[1].dataItem = combo;
        });
        await this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetStateDefinitionList",
          sendParam: {
            plantid: "LS",
            stateobject: "",
            state: ""
          },
        }).then((data) => {
          const combo = data.map((x) => {
              return {
                ENUMVALUE: x.STATE,
                ENUMVALUENAME: x.STATENAME,
                STATEOBJECT: x.STATEOBJECT,
              };
            });
            // console.log("combo list:::::::::", combo);
          this.headerParam.gridDropDownList[2].dataItem = combo;
          this.headerParam.gridDropDownList[3].dataItem = combo;

        });

        // console.log("comboFullList::::::", this.headerParam.gridDropDownList);
    },

    onSelectionchange(event) {
      // console.log("===========onSelectionchange==============");
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      // console.log("===========onHeaderSelectionChange==============");
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map((item) => {
        return { ...item, selected: checked };
      });
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      // console.log("===rowDdChange===", e);
      // console.log("===rowDdChange===", name);
      // console.log("===rowDdChange===", dataItem);
      const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }

      if (name === "STATEOBJECT") {

        
        // data[idx] = {...data[idx], customCell.dataItem: this.reasonCodeList.filter(x => x.REASONCODETYPE === e.value)}
        // STATEOBJECT
        // console.log("eVal:::", e.value)
        // console.log("eVal:::", this.headerParam.gridDropDownList[2].dataItem)
        data[idx].customCell.RESOURCESTATENAME.dataItem = this.headerParam.gridDropDownList[2].dataItem
        .filter(x => x.STATEOBJECT === e.value)
        .map((x) => {
          return {
            ENUMVALUENAME : x.ENUMVALUENAME === null ? "" : x.ENUMVALUENAME,
            ENUMVALUE : x.ENUMVALUE  === null ? "" : x.ENUMVALUE,
            STATEOBJECT : x.STATEOBJECT
          };
        });

        data[idx].customCell.CHANGESTATENAME.dataItem = this.headerParam.gridDropDownList[3].dataItem
        .filter(x => x.STATEOBJECT === e.value)
        .map((x) => {
          return {
            ENUMVALUENAME : x.ENUMVALUENAME === null ? "" : x.ENUMVALUENAME,
            ENUMVALUE : x.ENUMVALUE  === null ? "" : x.ENUMVALUE,
            STATEOBJECT : x.STATEOBJECT
          };
        });

        // data[idx].customCell.CHANGESTATENAME.dataItem = this.headerParam.gridDropDownList[3].dataItem.filter(x => x.STATEOBJECT === e.value);

        // const test = this.headerParam.gridDropDownList[2].dataItem.filter(x => x.STATEOBJECT === e.value)
        // console.log(data[idx].customCell.CHANGESTATENAME.dataItem)
      }

      this.gridData = data;
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      // console.log("===griditemchange===");
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }

      this.gridData = data;
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      // console.log(":::::::::::::::::::")
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter((x) => {
        return this.parseNullOrUndefinedToBlank(data[idx][x]) !== this.parseNullOrUndefinedToBlank(this.gridOriData[idx][x]) && x !== "selected" && x !== "rowStat" && x !== "customCell";
        // return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    onRowClick(event) {
      // console.log("로우셀렉티드:::", event);
      // console.log(this.headerParam.gridHeader)
      // console.log(this.gridData)
      this.row = { ...event.dataItem };
      this.gridData.forEach(
        (item) => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
    },

    //unbo 버튼 클릭
    undoBtn() {
      // this.gridData = JSON.parse(JSON.stringify(this.gridOriData));
      this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit("iccReset");
      // const data = JSON.parse(JSON.stringify(this.gridData));
      // this.gridData = data
      //   .map((x) => {
      //     if (x.selected) {
      //       if (!x.newRow) {
      //         const item = this.gridOriData.filter(
      //           (ori) => ori.PLANTID === x.PLANTID && ori.STATEOBJECT === x.STATEOBJECT && ori.RESOURCESTATE === x.RESOURCESTATE && ori.CHANGESTATE === x.CHANGESTATE
      //         );
      //         return item[0];
      //       }
      //     } else {
      //       return x;
      //     }
      //   })
      //   .filter((x) => !!x);
      //   // console.log(":::::::::::",this.gridData)
    },
    //추가 버튼 클릭
    addBtn() {
      const newRowUUid = Math.round(Math.random() * 1000000000).toString();
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: true,
        PLANTID: "LS",
        rowStat: "C",
        idx: this.gridData.length,
        newRowUUid: newRowUUid,
        customCell: {
          REASONCODETYPE: {
            type: 'combo',
            dataItem: this.headerParam.gridDropDownList[0].dataItem,
            disable: false,
          },
          STATEOBJECT: {
            type: 'combo',
            dataItem: this.headerParam.gridDropDownList[1].dataItem,
            disable: false,
          },
          RESOURCESTATENAME: {
            type: 'combo',
            dataItem: [],
            disable: false,
          },
          CHANGESTATENAME: {
            type: 'combo',
            dataItem: [],
            disable: false,
          },
        },

        
        
        // changeCellType: "combo",
        // changeCellDataItem: ["111", "222"]
      };
      // console.log(this.headerParam.gridDropDownList[2].dataItem)
      // console.log(":::::::", this.gridData);
      // console.log("dataItems ::::::", dataItem);
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit("iccReset");
    },
    //삭제버튼
    //삭제버튼
    delBeforChk() {
      const delData = this.gridData
        .filter((x) => x.selected === true)
        .map((x) => {
          return {
            ...x,
          };
        });

      if (delData.length > 0) {
        if (delData.filter((x) => x.rowStat !== 'C').length >= 1) {
          var selectedRow = {};
          selectedRow = delData
            .filter((x) => x.rowStat !== 'C')
            .map((x) => x.PRODUCTID);

          this.$refs['confirmPop'].title = 'info';
          this.$refs['confirmPop'].message = "선택된 데이터(" + this.selected.STATEOBJECT + ")를 삭제하시겠습니까?";
          this.$refs['confirmPop'].modalWidth = '300px';
          this.$refs['confirmPop'].visibleDialog = true;
          this.$refs['confirmPop'].callBack = this.delBtn;
        } else {
          this.delBtn();
        }
      } else {
        this.$refs.alertPop.show(
          '알림',
          '선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.'
        );
        return;
      }
    },
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.gridData = data
        .filter(x => !(x.selected && x.rowStat === 'C'))
        .map(x => {
          if (x.selected) {
            return {
              ...x,
              rowStat: 'D',
            };
          }
          return x;
        });
    },

    //검색 인풋
    searchInput(nm, val) {
      this[nm] = val;
    },
    sortChangeHandler(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    }
  },
};

const defaultData = {};
</script>
<style lang="scss" scoped>
@media (max-width: 1267px) {
  .divList1 {
    height: 339px !important;
  }
  .divList2 {
    height: auto !important;
  }
  .divList3 {
    height: 213px !important;
  }
}
</style>
