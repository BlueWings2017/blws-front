<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>Lot Merge</li>
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
                      :disabled="false"
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
                      <!-- <input id="datepicker" value="05/03/2023" title="datepicker"/> -->
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
                  @click="saveBtnBefore"
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
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row>
              <v-col :sm="3" :lg="4">
                <CardTitle>[LS] Lot목록</CardTitle>
              </v-col>
              <v-col :sm="9" :lg="8" align="right">
                <!-- <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  :icon="'save'"
                  @click="saveBtnBefore"
                  >저장</Button
                > -->
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="targetSelectBtn"
                  >기준선택</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  @click="sourceSelectBtn"
                  >병합선택</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'undo'"
                  @click="cleanBtn"
                  >설정초기화</Button
                >
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                gridHeight="700px"
                :gridItems="items"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :disabledCheckHeaderArr="disabledCheckHeaderArr"
                :isPaging="true"
                @gridrowclick="onRowClick"
                @sortChangeHandler="sortChangeHandler"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="4" :style="{ height: '100%' }">
        <v-col
          :cols="12"
          :class="'divList2'"
          :style="{ height: '100%', padding: '0px' }"
        >
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <v-row>
                <v-col>
                  <CardTitle>기준 Lot</CardTitle>
                </v-col>
              <v-col align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  :icon="'save'"
                  @click="saveBtnBefore"
                  >{{ $t("CommLang.btn.saveBtn") }}</Button
                >
              </v-col>
              </v-row>
              <div ref="divWrapper2" :style="{ height: 'calc(50% - 33px)' }">
                <KendoGrid
                  ref="rowGrid2"
                  :gridHeight="gridHeight"
                  :gridItems="targetData"
                  :sortable="true"
                  :columns="headerParam2.gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :disabledCheckHeaderArr="disabledCheckHeaderArr"
                  @gridrowclick="onRowClick"
                />
              </div>
              <v-row>
                <v-col>
                  <CardTitle>병합될 Lot(삭제)</CardTitle>
                </v-col>
              </v-row>
              <div ref="divWrapper3" :style="{ height: 'calc(50% - 33px)' }">
                <KendoGrid
                  ref="rowGrid3"
                  :gridHeight="gridHeight"
                  :gridItems="sourceData"
                  :sortable="true"
                  :columns="headerParam3.gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :disabledCheckHeaderArr="disabledCheckHeaderArr"
                  @gridrowclick="onRowClick"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop ref="confirmPop" :callBack="saveBtn" />
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
  </div>
</template>
<script>
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import SelectModelingConfirm from "@/pages/lotTracking/SelectModelingConfirm";
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid";
import { Dialog, DialogActionsBar, Window } from "@progress/kendo-vue-dialogs";
import { AutoComplete, DropDownList } from "@progress/kendo-vue-dropdowns";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
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
    Dialog,
    DialogActionsBar,
    AutoComplete,
    dropdownlist: DropDownList,
    MesSelectBox,
    Window,
    DatePicker,
    SelectModelingConfirm,
    multiGridHeaderMinin,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: "500px",
    },
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      targetData: [],
      sourceData: [],

      gridLastModIdx: null,
      searchModalVisible: false,
      selectedID: null,
      fromdata: [],
      selectedField: "selected",
      noRowstat: true,
      expand: {
        ids: [],
        idField: "LOTID",
      },
      disabledCheckHeaderArr: ["GOINORDERREQUIRED"], //순차진행여부
      lotid: "",
      lotstate: "",
      productid: "",
      fromdate: Utility.setFormatDate(
        fromdate.toLocaleDateString(),
        "YYYY-MM-DD"
      ),
      todate: Utility.setFormatDate(todate, "YYYY-MM-DD"),
      visibleDialog: false,
      visibleDialog2: false,

      headerParam: {
        //Lot 목록
        gridid: "dgvLotList_Merge", // 그리드 ID
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      headerParam2: {
        //target Lot 목록
        gridid: "dgvTarget", // 그리드 ID
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      headerParam3: {
        //source Lot 목록
        gridid: "dgvSource", // 그리드 ID
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      visibleWindow: false,
      lotidMessage: "",
      TARGETLOTID: "", //기준Lot ID
      SOURCELOTID: "", //병합될 Lot ID
      sortField: [{}],
    };
  },
  created() {},
  async mounted() {
    this.fromdate = Utility.setFormatDate(this.fromdate, "YYYYMMDD");
    this.todate = Utility.setFormatDate(this.todate, "YYYYMMDD");
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    await this.getHeaderMulti(this.headerParam3, this.$refs.divWrapper3);
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
    //조회
    searchBtn() {
      this.$refs.rowGrid.sortField = [{}];
      this.$refs.rowGrid.skip = 0;
      if (!this.validateDates()) return;
      this.getGridData();
    },
    //검색창
    searchInputValSet(nm, val) {
      this[nm] = val;
      this.search();
    },
    toChange(e) {
      this.todate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    fromChange(e) {
      this.fromdate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotSearchList_Merge",
        sendParam: {
          lotid: this.lotid,
          productid: this.productid,
          fromdate: this.fromdate,
          todate: this.todate,
          plantid: "LS",
        },
      }).then((res) => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit("iccReset");
        this.gridData = data;
      });
    },

    //그리드 로우 클릭
    onRowClick(event) {
      console.log("===========onRowClick==============");
      console.log("::::::::::", event);
      this.selectedID = event.dataItem.LOTID;
      this.fromdata = event.dataItem;
    },

    targetSelectBtn(event) {
      console.log("=========targetSelect=======");
      //this.targetData = [this.fromdata];
      if (this.targetData[0] == null) {
        if (this.sourceData == null) {
          this.targetData = [this.fromdata];
          this.dataItem = event.getTargetData;
          this.getTargetData(this.fromdata);
          return;
        }
        if (
          this.sourceData.some(
            (data) => data.PRODUCTID != this.fromdata.PRODUCTID
          )
        ) {
          this.$refs.alertPop.title = "Info";
          this.$refs.alertPop.message = "병합될 Lot의 제품코드와 다릅니다.";
          this.$refs.alertPop.modalWidth = "330px";
          this.$refs.alertPop.visibleDialog = true;
          return;
        }
        if (this.sourceData.some((data) => data.LOTID == this.fromdata.LOTID)) {
          this.$refs.alertPop.show(
            "",
            "Lot:( " +
              this.selectedID +
              " )는(은) Source Lot과 같습니다. 다른 Lot을 선택하여 주세요."
          );
          return;
        } else {
          this.targetData = [this.fromdata];
          this.dataItem = event.getTargetData;
          this.getTargetData(this.fromdata);
          return;
        }
      }
      if (this.targetData[0] != null) {
        this.$refs.alertPop.show("", "이미 Target Lot이 입력되어 있습니다.");
        // if (
        //   this.sourceData.some(
        //     (data) => data.PRODUCTID != this.fromdata.PRODUCTID
        //   )
        // ) {
        //   this.$refs.alertPop.title = "Info";
        //   this.$refs.alertPop.message = "병합될 Lot의 제품코드와 다릅니다.";
        //   this.$refs.alertPop.modalWidth = "330px";
        //   this.$refs.alertPop.visibleDialog = true;
        //   return;
        // }
        // if (this.sourceData.some((data) => data.LOTID == this.fromdata.LOTID)) {
        //   this.$refs.alertPop.title = "Info";
        //   this.$refs.alertPop.message = "병합될 Lot에 등록된 Lot ID입니다.";
        //   this.$refs.alertPop.modalWidth = "330px";
        //   this.$refs.alertPop.visibleDialog = true;
        //   return;
        // } else {
        //   this.targetData = [this.fromdata];
        //   this.dataItem = event.getTargetData;
        //   this.getTargetData(this.fromdata);
        //   return;
        // }
      }
    },

    //병합선택 버튼
    sourceSelectBtn(event) {
      console.log("=========sourceSelectBtn=======");
      if (this.sourceData[0] != null) {
        if (
          this.sourceData.some(
            (data) => data.PRODUCTID != this.fromdata.PRODUCTID
          )
        ) {
          this.$refs.alertPop.title = "Info";
          this.$refs.alertPop.message =
            "제품코드가 다릅니다. 다른 LOT을 선택해 주세요";
          this.$refs.alertPop.modalWidth = "330px";
          this.$refs.alertPop.visibleDialog = true;
          return;
        }
        if (this.targetData[0] == null) {
          if (
            this.sourceData.some((data) => data.LOTID == this.fromdata.LOTID)
          ) {
            this.$refs.alertPop.title = "Info";
            this.$refs.alertPop.message = "이미 등록된 Lot 입니다.";
            this.$refs.alertPop.modalWidth = "330px";
            this.$refs.alertPop.visibleDialog = true;
            return;
          }
        }
      }

      if (this.sourceData[0] == null) {
        if (this.targetData[0] == null) {
          this.sourceData.push(this.fromdata);
          return;
        }
      }

      if (this.sourceData.some((data) => data.LOTID == this.fromdata.LOTID)) {
        this.$refs.alertPop.title = "Info";
        this.$refs.alertPop.message = "이미 등록된 Lot ID입니다.";
        this.$refs.alertPop.modalWidth = "330px";
        this.$refs.alertPop.visibleDialog = true;
        return;
      }

      if (this.targetData[0] != this.fromdata.LOTID) {
        if (this.targetData[0] != null) {
          if (this.targetData[0].PRODUCTID != this.fromdata.PRODUCTID) {
            this.$refs.alertPop.title = "Info";
            this.$refs.alertPop.message = "기준 제품 코드와 다릅니다.";
            this.$refs.alertPop.modalWidth = "330px";
            this.$refs.alertPop.visibleDialog = true;
            return;
          }
          if (this.targetData[0].LOTID == this.fromdata.LOTID) {
            this.$refs.alertPop.title = "Info";
            this.$refs.alertPop.message =
              "Lot :(" +
              this.targetData[0].LOTID +
              ")은(는) Target Lot과 같습니다. " +
              " 다른 lot을 선택하여 주세요.";
            this.$refs.alertPop.modalWidth = "330px";
            this.$refs.alertPop.visibleDialog = true;
            return;
          } else {
            this.sourceData.push(this.fromdata);
            return;
          }
        }
      }
    },

    //설정초기화 버튼
    cleanBtn() {
      this.sourceData = [];
      console.log(this.sourceData);

      this.targetData = [];
      console.log(this.targetData);
    },
    //기준선택데이터 가져오기
    async getTargetData() {},

    //병합선택데이터 가져오기
    async getSourceData() {},

    //저장 버튼
    saveBtnBefore() {
      if (this.targetData[0] === undefined) {
        this.$refs.alertPop.show("", "기준 Lot을 선택해주세요.");
        return;
      }
      if (this.sourceData[0] === undefined) {
        this.$refs.alertPop.show("", "병합될 Lot을 선택해주세요.");

        return;
      }

      let lotIds = "";
      for (let i = 0; i < this.sourceData.length; i++) {
        lotIds += `${this.sourceData[i].LOTID} ` + ", ";
      }
      this.$refs["confirmPop"].title = "Info";
      this.$refs["confirmPop"].message =
        "LotID : " +
        lotIds +
        "가(이)" +
        "<br/><br/>" +
        "LotID : " +
        `${this.targetData[0].LOTID}` +
        "에 병합됩니다." +
        "<br/><br/>" +
        "진행하시겠습니까?";
      this.$refs["confirmPop"].callBack = this.saveBtn;
      this.$refs["confirmPop"].modalWidth = "330px";
      this.$refs["confirmPop"].visibleDialog = true;
    },
    //저장버튼 (확인)
    saveBtn(data) {
      for (let i = 0; i < this.sourceData.length; i++) {
        const saveData = this.targetData.map((x) => {
          return {
            SOURCELOTID: this.sourceData[i].LOTID,
            TARGETLOTID: x.LOTID,
          };
        });

        console.log(saveData);

        if (saveData.length > 0) {
          const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnLotMerge",
            sendParam: saveData,
          }).then((result) => {
            this.$nextTick(() => {
              if (
                result.returncode !== undefined &&
                result.returncode === "0"
              ) {
                this.$refs.alertPop.show("알림", "저장되었습니다.");
                this.getGridData();
                this.targetData = [];
                this.sourceData = [];
              } else {
                this.$refs.alertPop.show(
                  "ERROR : " + result.code,
                  result.message
                );
              }
            });
          });
        }
      }
    },

    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },

    chkVal(nm, val) {
      this[nm] = val ? "Yes" : "";
    },
    productCode(data) {
      console.log(data);
      this.productid = data.PRODUCTID;
      this.getGridData();
      // this.frmPRC(JSON.parse(JSON.stringify(data)));
      this.$nuxt.$emit("iccReset");
      //this.$refs.searchBtn();
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
      ]);
    },
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
