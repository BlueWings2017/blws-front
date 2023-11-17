<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>재작업취소</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>제품코드</label>
                    <InputText
                      ref="productid"
                      :dataNm="'productid'"
                      :readonly="true"
                      @input-text-set="searchInput"
                      :defaultValue="productid"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                    />
                    <Button
                      :theme-color="'primary'"
                      :size="'medium'"
                      @click="searchModalVisible = true"
                      >선택</Button
                    >
                  </div>
                  <div class="form-group">
                    <label>생성일자</label>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="fromdate"
                        :default-value="new Date(fromdate)"
                        :dataNm="'fromdate'"
                        :format="'yyyy-MM-dd'"
                        @change="fromChange"
                      />
                    </div>
                    <span class="i_tilde">~</span>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="todate"
                        :default-value="new Date()"
                        :dataNm="'todate'"
                        :format="'yyyy-MM-dd'"
                        @change="toChange"
                      />
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                  >{{ $t("CommLang.btn.selectBtn") }}</Button
                >
                <!-- <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'save'"
                  @click="saveBtn"
                  >{{ $t("CommLang.btn.saveBtn") }}</Button
                > -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="8" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row>
              <v-col align="left">
                <CardTitle>[LS] Lot목록</CardTitle>
              </v-col>
                            <v-col :sm="3" :lg="2" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  :icon="'save'"
                  @click="saveBtn"
                  >{{ $t("CommLang.btn.saveBtn") }}</Button
                >
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="items"
                :sortable="true"
                :columns="gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :disabledCheckHeaderArr="disabledCheckHeaderArr"
                :isPaging="true"
                @gridrowclick="onRowClick"
                @rowdblclick="rowdblclick"
                @sortChangeHandler="sortChangeHandler"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="4" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody>
            <v-row>
              <v-col align="left">
                <CardTitle>재작업정보</CardTitle>
              </v-col>
            </v-row>
            <div ref="divWrapper2">
              <KendoTree
                ref="TreeView"
                :treeData="treeData"
                :textField="'PROCESSNAME'"
                :chidrenField="'children'"
                :icon="'icon'"
                @expandchange="onExpandChange"
              ></KendoTree>
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    <!-- 팝업 -->

    <SelectModelingConfirm
      ref="SelectModelingConfirm"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="(val) => (searchModalVisible = val)"
      @productCode="productCode"
    />
    <div
      v-if="isLoading"
      class="loading-container"
      :style="{ 'z-index': '999999', position: 'relative' }"
    >
      <div class="loading">
        <FadeLoader />
      </div>
    </div>
  </div>
</template>
<script>
import SelectModelingConfirm from "@/pages/lotTracking/SelectModelingConfirm";
import { TreeView, processTreeViewItems } from "@progress/kendo-vue-treeview";
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import Checkbox from "@/components/common/input/Checkbox";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid";
import { Dialog, DialogActionsBar, Window } from "@progress/kendo-vue-dialogs";
import { AutoComplete } from "@progress/kendo-vue-dropdowns";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import utils2 from "~/plugins/utils2";
import KendoTree from "@/components/common/KendoTree";
import { orderBy } from "@progress/kendo-data-query";

let myTitle;
let myMenuId;
const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth(); // 월
let day = d.getDate(); // 일
let fromdate = new Date(year, month, day - 7);
let todate = d;

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
    TreeView,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    Checkbox,
    Dialog,
    DialogActionsBar,
    AutoComplete,
    Window,
    DatePicker,
    SelectModelingConfirm,
    KendoTree,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: "500px",
    },
  },
  data() {
    return {
      isLoading: false,
      treeData: [],
      columns: [],
      gridHeader: [],
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      searchModalVisible: false,
      disabledCheckHeaderArr: ["GOINORDERREQUIRED"], //순차진행여부
      selectedID: null,
      selectedField: "selected",
      expand: {
        ids: [],
        idField: "PROCESSNAME",
      },
      lotid: "",
      lotstate: "",

      productid: "",
      fromdate: Utility.setFormatDate(
        fromdate.toLocaleDateString(),
        "YYYY-MM-DD"
      ),
      todate: Utility.setFormatDate(todate, "YYYY-MM-DD"),
      
      headerParam: {
        gridid: "dgvLotList_ReworkCancel", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },

      visibleWindow: false,
      lotidMessage: "",
      lotIds: [],
      sortField: [{}],
    };
  },
  created() {},
  async mounted() {
    // await this.getGridData();
    // await this.initTree();
    this.fromdate = Utility.setFormatDate(this.fromdate, "YYYYMMDD");
    this.todate = Utility.setFormatDate(this.todate, "YYYYMMDD");
  },
  computed: {
    items() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.LOTID === this.selectedID,
      }));
    },
  },
  watch: {},
  methods: {
    //조회버튼
    searchBtn() {
      this.$refs.rowGrid.sortField = [{}];
      if (!this.validateDates()) return;
      this.$refs.rowGrid.skip = 0;
      this.getGridData();
      this.selectedID = null;
      this.treeData = undefined;
    },

    //검색창
    searchInputValSet(nm, val) {
      this[nm] = val;
      this.search();
    },
    //저장버튼
    saveBtn() {
      if (this.selectedID !== null) {
        console.log("=========saveBtn=========");
        this.$refs["confirmPop"].title = "info";
        this.$refs[
          "confirmPop"
        ].message = `Lot [${this.selectedID}]를 재진행취소 하시겠습니까?`;
        this.$refs["confirmPop"].callBack = this.reworkCancelBtn;
        this.$refs["confirmPop"].modalWidth = "300px";
        this.$refs["confirmPop"].visibleDialog = true;
      } else {
        this.$refs.alertPop.show("Info", "Lot를 선택해주세요.");
      }
      //this.SelectLotVisible = true;
    },

    //체크박스
    formCheckValSet(nm, val) {
      this.selectedData[nm] = val ? "1" : "0";
      this.selectedData.useFgNm = val ? "사용" : "미사용";
      const index = this.baseData.findIndex(
        (p) => p.idx === this.selectedData.idx
      );
      if (this.selectedData.rowStat == "") {
        this.selectedData.rowStat = "U";
      }
      this.baseData.splice(index, 1, this.selectedData);
    },

    //날짜형식변환
    toChange(e) {
      this.todate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    fromChange(e) {
      this.fromdate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },

    //트리 데이터 가져오기
    async initTree() {
      console.log("=========initTree=======");
      console.log("Select LOT ID : " + this.selectedID);
      console.log("Select LOT STATE : " + this.lotstate);
      let res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProcessRouteReworkCancelProgressList",
        sendParam: {
          lotid: this.selectedID,
          lotstate: this.lotstate,
          plantid: "LS",
          loadingDisabled: true,
        },
      });
      console.log(res);
      res = res.map((x, idx) => {
        return {
          ...x,
          icon: "PROCESS",
        };
      });

      res.unshift({
        LOTID: "",
        PROCESSID: this.selectedID,
        PROCESSNAME: "Rework",
        PROCESSROUTEID: "",
        PROCESSDESC: "", // PROCESSROUTETYPENAME
        PROCESSSEQUENCE: "1",
        PROCESSCOMPLETESTATUS: "PROCESSROUTE",
        PROCESSSTATUS: "",
        icon: "PROCESSROUTE",
        PLANTID: "LS",
      });
      console.log(this.gridData);
      console.log("res");
      console.log(res);
      const data = res.map((x) => ({ ...x, expanded: true }));
      this.treeData = utils2.makeTreeData(data, "PROCESSID", "LOTID");
      // this.treeData = utils2.makeTreeData(data);
    },

    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },

    //그리드 데이터 가져오기
    async getGridData(treeId = "") {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotSearchList_ReworkCancel",
        sendParam: {
          parentareaid: treeId,
          lotid: this.lotid,
          lotstate: this.lotstate,
          productid: this.productid,
          fromdate: this.fromdate,
          todate: this.todate,
          plantid: "LS",
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
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit("iccReset");
        this.gridOriData = data;
        this.gridData = data;
        if (this.gridData[0] === undefined) {
          this.$refs.alertPop.show("", "Lot목록이 존재하지 않습니다.");
        }
      });
    },

    //그리드 로우 클릭
    onRowClick(event) {
      console.log(event);
      this.selectedID = event.dataItem.LOTID;
      this.lotstate = event.dataItem.LOTSTATE;
      this.initTree();
      //그리드 로우 클릭시 라인표시 유무 확인필요
      //event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    // 그리드 더블 클릭
    rowdblclick(event) {
      console.log(event.dataItem);
      console.log("=========rowdblclick=========");
      this.saveBtn();
    },

    //row 선택
    selectRow() {
      const retuenData = this.items.filter((x) => x.selected);
    },
    //재진행취소 YES버튼
    reworkCancelBtn() {
      const saveData = this.gridData
        .filter((x) => x.LOTID === this.selectedID)
        .map((x) => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });
      console.log(saveData);
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnLotReworkCancel",
          sendParam: saveData,
        }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode === "0") {
              this.$refs.alertPop.show("알림", "저장되었습니다.");
              this.getGridData();
              this.treeData = undefined;
            } else {
              this.$refs.alertPop.show(
                "ERROR : " + result.code,
                result.message
              );
            }
          });
        });
      }
    },

    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    comboChange(nm, val) {
      this[nm] = val;
    },
    chkVal(nm, val) {
      this[nm] = val ? "Yes" : "";
    },
    productCode(data) {
      console.log(data);
      this.productid = data.PRODUCTID;
      this.$nuxt.$emit("iccReset");
      this.getGridData();
    },
    validateDates() {
      if (this.todate && this.fromdate > this.todate) {
        this.$refs.alertPop.show("", "From 날짜가 To날짜보다 큽니다.");
        return false;
      }
      return true;
    },
    // 필터 정렬
    // sortChangeHandler(e) {
    //   this.gridData = orderBy(this.gridData, e.sort);
    // },
      sortChangeHandler(e){
      this.gfn_sortChangeHandler(this.gridData, e,[
        'PRODUCTUNITQUANTITY',
        'PRIORITY',
        'CURRENTQUANTITY',
        'REPEATCOUNT',
        'REWORKCOUNT'
      ]);
    },
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
