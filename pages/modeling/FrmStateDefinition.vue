<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>상태기준정보</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
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
                  <div class="form-group">
                    <label>상태코드</label>
                    <inputText
                      ref="intputState"
                      :boxWidth="'100%'"
                      :dataNm="'intputState'"
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
                <CardTitle>상태목록</CardTitle>
              </v-col>
              <v-col cols="6" align="right">
                <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">저장</Button>
                <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">추가</Button>
                <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delBeforChk" >삭제</Button>
                <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn" >undo</Button>
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="gridHeader"
                :resizable="false"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="gridDropDownList"
                :checkHeaderArr="checkHeaderArr"
                :isPaging="true"
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
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
// import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
// import utils from "~/plugins/utils";

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, gridHeaderMinin],
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
      treeData: [],
      columns: [],
      gridHeight: "100px",
      gridData: [],
      gridOriData: [],
      saveOriData:[],
      gridLastModIdx: null,
      gridDropDownList: [],
      selectedField: "selected",
      expand: {
        ids: [],
        idField: "DESCRIPTION",
      },
      checkHeaderArr: ["GOINORDERREQUIRED"],
      intputStateObject: "",
      intputState: "",
      headerParam: {
        gridid: "dgvStateDefinition", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        noFirstCheck: true,
      },
      gridHeader: [],
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + "px";

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
      this.getGridData();
    },
    // 저장버튼 클릭
    async saveBtn() {
      
      const saveData = this.gridData
        .filter((x) => x.rowStat !== "N")
        .map((x) => {
          return {
            ...x,
            // columnname: x.COLUMNNAME,
            // description: x.DESCRIPTION,
            plantid: "LS",
            // state: x.STATE,
            // statename: x.STATENAME,
            // stateobject: x.STATEOBJECT,
            // tablename: x.TABLENAME,
            _rowstatus: x.rowStat,
            _rowstatusimage: "System.Drawing.Bitmap",
          };
        });

        

      // console.log(saveData);
      // console.log(saveData[0].STATEOBJECT);
      // console.log("this.saveOriData::::", this.saveOriData );
      if (saveData.length > 0) {
        let returnChk = false;
        for(var i=0; i<saveData.length; i++) {
          let stateobjectData = saveData[i].STATEOBJECT;
          let stateData = saveData[i].STATE;
          // console.log("스테이트",stateData)
          await this.mesGet({
            apiKey: "mes/common/getqueryresult",
            queryId: "GetStateChangePolicyList",
            sendParam: {
              plantid: "LS",
              stateobject: stateobjectData,
            },
          }).then((res) => {
            // console.log("알이에스:", res);
            const data = res.filter(x => x.CHANGESTATE == stateData || x.RESOURCESTATE == stateData)
            .map((x, idx) => {
              return {
                ...x,
                rowStat: "N",
                selected: false,
                idx: idx,
                inEdit: true,
                newRow: false,
              };
            });
            // console.log("data ====== ", data);
            // console.log("data length ====== ", data.length);
            if (data.length > 0) {
              returnChk = true;
            } else {
              returnChk = false;
            }
          });
          // console.log("saveData::::", saveData);
          // 상태변경설정에서 사용하는지 아닌지 체크
          if (returnChk === true) {
            this.$refs.alertPop.show("ERROR", "해당 상태 ("+saveData[i].STATE+") 의 기준정보가 상태변경 기준정보에서 사용중입니다.");
            return;
          }
          
          if(saveData[i].STATEOBJECT == "" || typeof saveData[i].STATEOBJECT === "undefined") {
            this.$refs.alertPop.show("알림", "상태관리개체 값은 필수 입력 값입니다.");
            return;
          } 
          if (saveData[i].STATE == "" || typeof saveData[i].STATE === "undefined") {
            this.$refs.alertPop.show("알림", "상태코드 값은 필수 입력 값입니다.");
            return;
          }
          
          for(var j=0; j<this.saveOriData.length; j++) {
            if(this.saveOriData[j].idx != saveData[i].idx){
              if(this.saveOriData[j].STATEOBJECT == saveData[i].STATEOBJECT) {
                if(this.saveOriData[j].STATE == saveData[i].STATE) {
                  this.$refs.alertPop.show("알림", "상태코드 값이 중복되었습니다.");
                  return;
                }
              }
            }
          }
        }
        // console.log("for체크 끝난 이후");
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnStateDefinition",
          sendParam: saveData,
        }).then(result => {
          // console.log("result:::::::::::", result);
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === "0") {
              this.$refs.alertPop.show("알림", "저장되었습니다.");
              this.getGridData();
            } else {
              this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
            }
          });
        });
        // console.log("res:::::::::::",res);
      }
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetStateDefinitionList",
        sendParam: {
          plantid: "LS",
          stateobject: this.intputStateObject,
          state: this.intputState,
        },
      }).then((res) => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
          };
        });
        // console.log("data ====== ", data);
        this.$nuxt.$emit("iccReset");
        this.saveOriData = data;
        this.gridOriData = data;
        this.gridData = data;
      });
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      // console.log("===========onSelectionchange==============");
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      // console.log("===========onHeaderSelectionChange==============");
      
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      // console.log("===rowDdChange===", e);
      const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
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
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter((x) => {
        return this.parseNullOrUndefinedToBlank(data[idx][x]) !== this.parseNullOrUndefinedToBlank(this.gridOriData[idx][x]) && x !== "selected" && x !== "rowStat";
        // return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    onRowClick(event) {
      // console.log("로우셀렉티드:::", event);
      this.row = { ...event.dataItem };
      this.gridData.forEach(
        (item) => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
    },

    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit("iccReset");
      // const data = JSON.parse(JSON.stringify(this.gridData));
      // this.gridData = data
      //   .map((x) => {
      //     if (x.selected) {
      //       if (!x.newRow) {
      //         const item = this.gridOriData.filter(
      //           (ori) =>
      //             ori.STATEOBJECT === x.STATEOBJECT
      //         );
      //         return this.gridData = this.gridOriData;
      //       }
      //     } else {
      //       return x;
      //     }
      //   })
      //   .filter((x) => !!x);
    },
    //추가 버튼 클릭
    addBtn() {
      this.$refs.rowGrid.skip = 0;
      const newRowUUid = Math.round(Math.random() * 1000000000).toString();
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: true,
        PLANTID: "LS",
        rowStat: "C",
        idx: this.gridData.length,
        newRowUUid: newRowUUid,
      };
      // console.log(":::::::", this.gridData);
      // console.log("dataItems ::::::", dataItem);
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit("iccReset");
    },
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
          this.$refs['confirmPop'].message = "선택된 데이터(" + this.selected.STATE + ")를 삭제하시겠습니까?";
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
