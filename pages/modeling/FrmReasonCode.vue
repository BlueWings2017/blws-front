<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>사유코드기준정보</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :sm="9" :lg="10" align="left">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>사유구분</Label>
                    <inputText
                      ref="intputReasonCodeType"
                      :boxWidth="'100%'"
                      :dataNm="'intputReasonCodeType'"
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
      <v-col :cols="4" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col cols="12" align="left">
                <CardTitle>사유구분목록</CardTitle>
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="gridDropDownList"
                :disabledCheckHeaderArr="disabledCheckHeaderArr"
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
      <v-col :cols="8" :style="{ height: '100%' }">
        <Card ref="gridCard2" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col cols="6" align="left">
                <CardTitle>사유코드 목록</CardTitle>
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
                  @click="delBtn"
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
            <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid2"
                :gridHeight="gridHeight2"
                :gridItems="gridData2"
                :sortable="true"
                :columns="headerParam2.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField2"
                :gridDropDownList="gridDropDownList"
                :disabledCheckHeaderArr="disabledCheckHeaderArr"
                :isPaging="true"
                @sortChangeHandler="sortChangeHandler2"
                @selectionchange="onSelectionchange"
                @gridrowclick="onRowClick2"
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
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import Checkbox from "@/components/common/input/Checkbox";
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
    KendoGrid,
    InputText,
    Checkbox,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: "500px",
    },
    gridHeight2: {
      type: String,
      defaultData: "500px",
    },
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      gridOriData: [],
      gridHeader2: [],
      gridData2: [],
      gridOriData2: [],
      saveOriData:[],
      gridDropDownList: [{}],
      selectedField: "selected",
      selectedField2: "selected",
      //checkHeaderArr: ["GOINORDERREQUIRED"],
      disabledCheckHeaderArr: ["GOINORDERREQUIRED"],
      intputReasonCodeType: "",
      headerParam: {
        gridid: "dgvReasonCodeType", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      headerParam2: {
        gridid: "dgvReasonCode_Modeling", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
      },
    };
  },
  created() {},
  async mounted() {
    // this.gridHeight = (this.$refs.contents.offsetHeight - 180) +'px';
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    this.searchBtn();
  },
  computed: {
    areAllSelected() {
      return (
        this.gridData.findIndex((x) => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    }
    
  },
  watch: {},
  methods: {
    // 조회버튼 클릭
    searchBtn() {
      this.$refs.rowGrid.sortField = [{}];
      this.$refs.rowGrid.skip = 0;
      this.$refs.rowGrid2.sortField = [{}];
      this.$refs.rowGrid2.skip = 0;
      this.getGridData();
      // this.getGridData2();
    },
    // 저장버튼 클릭
    saveBtn() {
      const saveData = this.gridData2
        .filter((x) => x.rowStat !== "N")
        .map((x) => {
          return {
            ...x,
            _rowstatus: x.rowStat,
            reasoncodetype: x.SUPERREASONCODE,
          };
        });

      const saveValidate = this.mesValidation(
        this.headerParam2.gridHeader,
        this.gridData2
      );
      if (!saveValidate.isValidate) {
        this.$refs.alertPop.show("알림", saveValidate.msg);
        return;
      }
      
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnReasonCode",
          sendParam: saveData,
        }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === "0") {
              this.$refs.alertPop.show("알림", "저장되었습니다.");
              this.getGridData2(saveData[0].SUPERREASONCODE);
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
    //그리드1 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReasoncodeTypeList_Modeling",
        sendParam: {
          plantid: "LS",
          reasoncodetype: this.intputReasonCodeType,
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
            reasoncodetype: this.intputReasonCodeType,
          };
        });
        // console.log("data ====== ", data);
        this.$nuxt.$emit("iccReset");
        this.gridOriData = data;
        this.gridData = data;
        if (data[0].reasoncodetype == "") {
          this.getGridData2(data[0].REASONCODETYPEID);
        } else {
          this.getGridData2(data[0].reasoncodetype);
        }
      });
    },
    //그리드2 데이터 가져오기
    async getGridData2(reasoncodetype) {
      // console.log("reasoncodetype:::::::::", reasoncodetype);

      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReasoncodeList",
        sendParam: {
          plantid: "LS",
          reasoncodetype: reasoncodetype,
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
        // console.log("data22 ====== ", data);
        this.$nuxt.$emit("iccReset");
        this.gridOriData2 = data;
        this.saveOriData = data;
        this.gridData2 = data;
      });
    },

    //그리드 로우 클릭
    onRowClick(event) {
      // console.log("===========onRowClick==============");
      this.row = { ...event.dataItem };
      this.gridData.forEach(
        (item) => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
      // console.log(event.dataItem);
      //그리드 로우 클릭시 라인표시 유무 확인필요
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      const reasoncodetype = event.dataItem.REASONCODETYPEID;
      this.getGridData2(reasoncodetype);
    },
    onRowClick2(event) {
      this.row = { ...event.dataItem };
      this.gridData2.forEach(
        (item) => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
      // console.log(event.dataItem);
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      // console.log("===========onSelectionchange==============");
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      const availability = event.dataItem.AVAILABILITY;
      const rowStat = event.dataItem.rowStat;
      if (availability != "Available" && rowStat == "N") {
        const reasoncodetype = event.dataItem.REASONCODETYPEID;
        this.getGridData2(reasoncodetype);
      }
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      // console.log("===========onHeaderSelectionChange==============");
      // let checked = event.event.target.checked;
      // this.gridData = this.gridData2.map((item) => {
      //   return { ...item, selected: checked };
      // });
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      // console.log("===rowDdChange===", e);
      const idx = this.gridData2.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData2));

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }

      this.gridData2 = data;
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      // console.log("===griditemchange===");
      const data = JSON.parse(JSON.stringify(this.gridData2));
      const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }

      this.gridData2 = data;
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      // console.log(":::::::::::::::::::")
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter((x) => {
        return this.parseNullOrUndefinedToBlank(data[idx][x]) !== this.parseNullOrUndefinedToBlank(this.gridOriData2[idx][x]) && x !== "selected" && x !== "rowStat";
        // return data[idx][x] !== this.gridOriData2[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    //unbo 버튼 클릭
    undoBtn() {
      this.gridData2 = this.gridOriData2.filter((x) => x.newRow !== true);
      // const data = JSON.parse(JSON.stringify(this.gridData2));
      // this.gridData2 = data
      //   .map((x) => {
      //     if (x.selected) {
      //       if (!x.newRow) {
      //         const item = this.gridOriData2.filter(
      //           (ori) => ori.REASONCODE === x.REASONCODE
      //         );
      //         return item[0];
      //       }
      //     } else {
      //       return x;
      //     }
      //   })
      //   .filter((x) => !!x);
      this.$nuxt.$emit("iccReset");
    },
    //추가 버튼 클릭
    addBtn() {
      this.$refs.rowGrid2.skip = 0;
      const newRowUUid = Math.round(Math.random() * 1000000000).toString();
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: true,
        PLANTID: "LS",
        rowStat: "C",
        idx: this.gridData2.length,
        _ROWSTATUSIMAGE: "System.Drawing.Bitmap",
        REASONCODE: "",
        newRowUUid: newRowUUid,
      };
      // console.log(":::::::", this.gridData2);
      // console.log("dataItems ::::::", dataItem);
      this.gridData2.splice(0, 0, dataItem);
      this.$nuxt.$emit("iccReset");
    },
    //삭제버튼
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData2));
      this.gridData2 = data.map(x => {
        if(x.selected){
          if(x.rowStat !== "C"){
            return {
              ...x,
              rowStat: "D"
            }
          }
        }
        else {
          return x;
        }
      }).filter(x => x !== undefined);
      this.$nuxt.$emit('iccReset')
    },

    //검색 인풋
    searchInput(nm, val) {
      this[nm] = val;
    },
    sortChangeHandler(e){
      this.gfn_sortChangeHandler(this.gridData, e);
    },
    sortChangeHandler2(e){
      this.gfn_sortChangeHandler(this.gridData2, e, ["POSITION"]);
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
