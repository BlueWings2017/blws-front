<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>Lot Split</li>
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
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row>
              <v-col align="left">
                <CardTitle>[LS] Lot목록</CardTitle>
              </v-col>
              <v-col align="right" >
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
                @gridButtonClick="splitBtnClick"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />

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
    <SelectLotsplitQuantity
      ref="SelectLotsplitQuantity"
      v-if="SelectLotVisible"
      :visibleDialog="SelectLotVisible"
      :title="'title'"
      :message="'message'"
      :fromData="fromData"
      :gridDataModal="gridDataModal"
      :gridHeaderModal="gridHeaderModal"
      @visibleDialog="(val) => (SelectLotVisible = val)"
      @reLoadEvent="this.searchBtn"
    />
  </div>
  <!-- @lotid="lotid"
      @productid="productid"
      @currentquantity="currentquantity" -->
</template>

<script>
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import SelectModelingConfirm from "@/pages/lotTracking/SelectModelingConfirm";
import SelectLotsplitQuantity from "@/pages/lotTracking/SelectLotsplitQuantity";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid";
import { DateInput, Calendar } from "@progress/kendo-vue-dateinputs";
import CustomCalendarCell from "@/components/common/CustomCalendarCell.vue";
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { AutoComplete, ComboBox } from "@progress/kendo-vue-dropdowns";
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
    KendoGrid,
    InputText,
    Checkbox,
    DateInput,
    Dialog,
    DialogActionsBar,
    AutoComplete,
    ComboBox,
    MesSelectBox,
    Calendar,
    CustomCalendarCell,
    DatePicker,
    SelectModelingConfirm,
    SelectLotsplitQuantity,
    gridHeaderMinin,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: "500px",
    },
  },
  data() {
    return {
      columns: [],
      gridHeader: [],
      gridData: [],
      gridLastModIdx: null,
      gridRowData: [],
      searchModalVisible: false,
      SelectLotVisible: false,
      selectedID: null,
      selectedField: "selected",
      noRowstat: true,
      expand: {
        ids: [],
        idField: "LOTID",
      },
      disabledCheckHeaderArr: ["GOINORDERREQUIRED"],
      lotid: "",
      lotstate: "",
      productid: "",
      fromdate: Utility.setFormatDate(
        fromdate.toLocaleDateString(),
        "YYYY-MM-DD"
      ),
      todate: Utility.setFormatDate(todate, "YYYY-MM-DD"),
      ProcessRouteType: "",
      visibleDialog: false,
      visibleDialog2: false,
      headerParam: {
        gridid: "dgvLotList_Split", // 그리드 ID
        //rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
      },
      fromData: {},
      visibleWindow: false,
      gridDataModal: [],
      gridHeaderModal: [],
      sortField: [{}],
    };
  },
  created() {},
  async mounted() {
    this.fromdate = Utility.setFormatDate(this.fromdate, "YYYYMMDD");
    this.todate = Utility.setFormatDate(this.todate, "YYYYMMDD");
  },
  computed: {
    items() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.LOTID === this.selectedID,
        LOTSPLITBUTTON:'분할'
      }));
    },
  },
  watch: {},

  methods: {
    //조회 버튼
    searchBtn() {
      this.$refs.rowGrid.sortField = [{}];
      this.$refs.rowGrid.skip = 0;
      if (!this.validateDates()) return;

      this.getGridData();
    },
    //저장버튼
    saveBtn() {
      this.gridDataModal = this.gridData;
      this.gridHeaderModal = this.gridHeader;
      console.log("=========saveBtn=========");
      if (this.selectedID !== null) {
        this.SelectLotVisible = true;
      } else {
        if (this.gridData.length == 0) {
          this.$refs.alertPop.title = "Info";
          this.$refs.alertPop.message = "Lot목록이 존재하지 않습니다.";
          this.$refs.alertPop.modalWidth = "330px";
          this.$refs.alertPop.visibleDialog = true;
        }
        if (this.gridData.length > 0) {
          this.$refs.alertPop.title = "Info";
          this.$refs.alertPop.message = "Lot를 선택해주세요.";
          this.$refs.alertPop.modalWidth = "330px";
          this.$refs.alertPop.visibleDialog = true;
        }
      }
    },

    //검색창
    searchInputValSet(nm, val) {
      this[nm] = val;
      this.search();
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotSearchList_Split",
        sendParam: {
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
            //rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            SPLIT: "splitBtn"
          };
        });
        this.$nuxt.$emit("iccReset");
        this.gridData = data;
        if (this.gridData[0] === undefined) {
          this.$refs.alertPop.title = "";
          this.$refs.alertPop.message = "Lot목록이 존재하지 않습니다.";
          this.$refs.alertPop.modalWidth = "330px";
          this.$refs.alertPop.visibleDialog = true;
        }
      });
    },

    //그리드 로우 클릭
    onRowClick(event) {
      console.log(event);
      this.selectedID = event.dataItem.LOTID;
      this.fromData = event.dataItem;
    },
    // 그리드 더블 클릭
    rowdblclick(event) {
      console.log(event.dataItem);
      console.log("=========rowdblclick=========");
      this.fromData = event.dataItem;
      //this.SelectLotVisible = true;
      this.saveBtn();
    },
    //날짜 형식변환
    toChange(e) {
      this.todate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    fromChange(e) {
      this.fromdate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    productCode(data) {
      this.productid = data.PRODUCTID;
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
      ]);
    },
    //그리드 검색버튼 클릭 (분할)
    splitBtnClick(e, field, dataItem) {
      if (field === 'LOTSPLITBUTTON') {
        console.log(dataItem)
         this.fromData = dataItem;
         this.selectedID = dataItem.LOTID;
         this.saveBtn();
        // this.SelectLotVisible = true;

      }
    },
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
