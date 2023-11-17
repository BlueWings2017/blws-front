<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>자재관리</li>
      <li>자재입고</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap" style="width: 1500px;">
                  <!-- <div class="form-group form-calendar-info">
                    <span class="calendar-info"></span>
                    <span class="calendar-info">{{ stockMonthStr }}</span>
                  </div> -->
                  <div class="form-group">
                    <label>창고</label>
                    <MesVariableSelectBox
                      :ref="'comboArea'"
                      :allYN="false"
                      :dataNm="'areaid'"
                      :queryId="'GetWarehouseList'"
                      :inputcol="inputcol"
                      :sendParam="{
                        plantid: 'LS',
                        warehouse: warehouseid,
                      }"
                      @comboChange="comboChange"
                    ></MesVariableSelectBox>
                  </div>
                  <div class="form-group" style="display: none;">
                    <label>자재타입</label>
                    <MesSelectBox
                      ref="materialtype"
                      :enumID="'MATERIALTYPE'"
                      :allYN="false"
                      :dataNm="'materialtype'"
                      :disabled="true"
                      :defaultValue="materialtype"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>자재코드</label>
                    <InputText
                      ref="materialid"
                      :dataNm="'materialid'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"  
                      @input-text-set="searchInputValSet"
                    />
                  </div>
                  <div class="form-group">
                    <label>자재명</label>
                    <InputText
                      ref="materialname"
                      :dataNm="'materialname'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"  
                      @input-text-set="searchInputValSet"
                    />
                  </div>
                  <div class="form-group">
                    <label>입고일자</label>
                    <div class="form-chk">
                      <Checkbox
                        ref="receiptDate"
                        :value="true"
                        dataNm="receiptDate"
                        :required="true"
                        :defaultchecked="false"
                        @checkbox-set="receiptDateCheckValSet"
                      />
                    </div>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="workToDate"
                        :disabled="!!this.receiptDate"
                        :default-value="new Date(workFromDate)"
                        :dataNm="'workToDate'"
                        :format="'yyyy-MM-dd'"
                        @change="fromChange"
                      />
                    </div>
                    <span class="i_tilde">~</span>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="workFromDate"
                        :disabled="!!this.receiptDate"
                        :default-value="new Date()"
                        :dataNm="'workFromDate'"
                        :format="'yyyy-MM-dd'"
                        @change="toChange"
                      />
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="searchBtn">조회</Button>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
     <div ref="divWrapper"></div>
      <v-col :sm="12" :lg="3" :class="'divList1'" :style="{ height: '100%' }">
        <Card ref="divList1" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="6" align="left">
                <CardTitle>자재목록</CardTitle>
              </v-col>
              <v-col cols="6" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  @click="receiveDetailBtn()"
                  >입고</Button
                >
              </v-col>
            </v-row>
            <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridItems="gridData.material"
                :gridHeight="gridHeight2"
                :sortable="true"
                :columns="headerParam2.gridHeader"
                :resizable="true"
                :isPaging="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                @gridrowclick="onMaterialRowClick"
                @rowdblclick="rowdblclick"
                @sortChangeHandler="sortChangeHandler"
                :reSetPage="this.reSetPage"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col
        :sm="12"
        :lg="9"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <v-row no-gutters>
          <v-col :cols="12">
            <Card ref="gridCard">
              <CardBody :style="{ width: '100%' }">
                <div class="detail-area area-4">
                  <div class="area-form">
                    <div class="area-th">
                      <label>창고코드</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input1"
                        :boxWidth="'100%'"
                        :dataNm="'areaid'"
                        :readonly="true"
                        :defaultValue="areaid"
                      />
                    </div>
                    <div class="area-th">
                      <label>창고명</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input2"
                        :boxWidth="'100%'"
                        :dataNm="'input2'"
                        :readonly="true"
                        :defaultValue="input2"
                      />
                    </div>
                    <div class="area-th">
                      <label>자재코드</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input3"
                        :boxWidth="'100%'"
                        :dataNm="'input3'"
                        :readonly="true"
                        :defaultValue="input3"
                      />
                    </div>
                    <div class="area-th">
                      <label>자재명</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input4"
                        :boxWidth="'100%'"
                        :dataNm="'input4'"
                        :readonly="true"
                        :defaultValue="input4"
                      />
                    </div>
                  </div>
                  <div class="area-form">
                    <div class="area-th">
                      <label>자재구분</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input5"
                        :boxWidth="'100%'"
                        :dataNm="'input5'"
                        :readonly="true"
                        :defaultValue="input5"
                      />
                    </div>
                    <div class="area-th">
                      <label>총재고수량</label>
                    </div>
                    <div class="area-td"> 
                      <inputText
                        ref="input6"
                        :boxWidth="'100%'"
                        :dataNm="'input6'"
                        :readonly="true"
                        :defaultValue="input6.toString()"
                      />
                    </div>
                    <div class="area-th">
                      <label>총보류수량</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input7"                      
                        :boxWidth="'100%'"
                        :dataNm="'input7'"
                        :readonly="true"
                        :defaultValue="input7.toString()"
                      />
                    </div>
                    <div class="area-th">
                    <label>가용수량</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="input8"
                      :boxWidth="'100%'"
                      :dataNm="'input8'"
                      :readonly="true"
                      :defaultValue="input8.toString()"
                    />
                  </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
        <v-row :class="'divList2'" :style="{ height: 'calc(100% - 130px)' }">
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :class="'gridCard'" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>재고목록</CardTitle>
                  </v-col>
                </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                    <KendoGrid 
                      ref="rowGrid"
                      :gridHeight="gridHeight"
                      :gridItems="gridData.stock"
                      :sortable="true"
                      :columns="headerParam.gridHeader"
                      :resizable="false"
                      :edit-field="'inEdit'"
                      :selected-field="selectedField"
                      :gridDropDownList="gridDropDownList"
                      :isPaging="true"
                      @gridrowclick="onRowClick"
                      @rowdblclick="stockRowdblclick"
                      @sortChangeHandler="sortChangeHandler2"
                    />
                  </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'"/>
    <SearchModal
      ref="SearchModal"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :screenType="'frmMaterialReceive'"
      :data="data"
      :callBack="() => {}"
      @visibleDialog="(val) => (searchModalVisible = val)"
    />

    <ReceiveDetailModal
      ref="ReceiveDetailModal"
      v-if="receiveDetailModalVisible"
      :visibleDialog="receiveDetailModalVisible"
      :title="'title'"
      :message="'message'"
      :curMaterial="curMaterial"
      :callBack="() => {}"
      @visibleDialog="(val) => (receiveDetailModalVisible = val)"
      @saveBtn="saveBtn"
    />
    <DetailView ref="detailView" :is="'detailView'" 
      :header="headerParam.gridHeader"
      :item="gridData"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from "@progress/kendo-vue-treeview";
import { Button } from "@progress/kendo-vue-buttons";
import InputText from "../../components/common/input/InputText.vue";
import {
  AutoComplete,
  ComboBox,
  DropDownList,
  MultiSelect,
} from "@progress/kendo-vue-dropdowns";
import { Dialog, DialogActionsBar, Window } from "@progress/kendo-vue-dialogs";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import SearchModal from "@/components/frmWarehouseStockManagement/SearchModal";
import ReceiveDetailModal from "@/components/frmMaterialReceive/ReceiveDetailModal";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import Checkbox from "@/components/common/input/Checkbox";
import DetailView from "@/components/common/DetailView";

let myTitle;
let myMenuId;
const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth(); // 월
let day = d.getDate(); // 일
let fromdate = new Date(year, month, day - 7);
let todate = d;
let workFromDate = new Date(year, month, day - 7);

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
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    gridHeight: {
      type: String,
      defaultData: "150px",
    },
    gridHeight2: {
      type: String,
      defaultData: "500px",
    },
    gridHeight3: {
      type: String,
      defaultData: "250px",
    },
    gridHeight4: {
      type: String,
      defaultData: "250px",
    },
  },
  components: {
    Utility,
    Card,
    Button,
    CardBody,
    window: Window,
    CardTitle,
    TreeView,
    KendoGrid,
    InputText,
    dropdownlist: DropDownList,
    kbutton: Button,
    MesSelectBox,
    SearchModal,
    DatePicker,
    ReceiveDetailModal,
    MesVariableSelectBox,
    Checkbox,
    DetailView
  },
  data() {
    return {
      columns: [],
      gridData: { stock: [], material: [] },
      gridOriData: { stock: [], material: [] },
      gridDataStockHistory: [],
      selectedField: "selected",
      stockGetParams: {
        yyyymm: "202201",
        //  fromdate: this.fromdate,
        //  todate: this.todate,
        warehouseid: this.warehouseid,
        materialtype: this.materialtype,
        plantid: "LS",
        materialid: this.materialid,
      },
      materialGetParams: {
        plantid: "LS",
      },
      checkHeaderArr: ["ACTIVESTATE"],
      headerParam: {
        gridid: "dgvStockList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        noFirstCheck: true,
        noRowstat: true,
        gridHeader: [],
      },
      headerParam2: {
        gridid: "dgvMaterialConsumableList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        noFirstCheck: true,
        noRowstat: true,
        gridHeader: [],
      },
      visibleWindow: false,
      searchModalVisible: false,
      receiveDetailModalVisible: false,
      show: false,
      gridDropDownList: [{ dataVal: "MATERIALTYPE", dataItem: [] }],
      warehouseid: "",
      warehousename: "",
      materialid: "",
      materialname: "",
      areaid: "",
      areaid2: "",
      materialtype: "Consumable",
      inqty: "",
      vendor: "",
      openingqty: "",
      selectedID: null,
      workFromDate: Utility.setFormatDate(workFromDate.toLocaleDateString(), 'YYYY-MM-DD'),
      workToDate: Utility.setFormatDate(new Date(), "YYYYMMDD"),
      // fromdate: Utility.setFormatDate(new Date(), "YYYYMMDD"),
      // todate: Utility.setFormatDate(new Date(), "YYYYMMDD"),
      curMaterial: [],
      curStock: [],
      curMaterial: {},
      inputcol: ["WAREHOUSEID", "WAREHOUSENAME"],
      stockMonth: [],
      stockMonthStr: "",
      input2: "", // 창고명
      input3: "", // 자재코드
      input4: "", // 자재명
      input5: "", // 자재구분
      input6: "", // 총재고수량
      input7: "", // 총보유수량
      input8: "", // 가용수량
      data: {},
      isChecked: false,
      selectedSummary: {},
      receiptDateCheck: "",
      receiptDate: "Released",
      reSetPage: false,
    };
  },
  created() {},
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    await this.getStockMonth();
    await this.getGridComboList();
    await this.searchBtn();
    const inputEl1 = this.$refs.input6.$el.querySelector('input');
    const inputEl2 = this.$refs.input7.$el.querySelector('input');
    const inputEl3 = this.$refs.input8.$el.querySelector('input');
    inputEl1.style.textAlign = 'right';
    inputEl2.style.textAlign = 'right';
    inputEl3.style.textAlign = 'right';
    this.areaid = this.$refs.comboArea.value; // 창고콤보 첫번째 고정
    this.input2 = this.$refs.comboArea.codeLists.find(x => x.id === this.areaid).text;
  },
  computed: {
    buttonText: function () {
      return this.show ? "Hide" : "Show";
    },
    items() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.MATERIALID === this.selectedID,
      }));
    },
  },
  watch: {
    isChecked() {
      if (this.isChecked) {
        this.loadData(); // isChecked가 true일 때 데이터 로드
      } else {
        // isChecked가 false일 때 전체 데이터를 로드.
      }
    },
  },
  methods: {
    popDetailView() {
      this.$refs.detailView.show("Summary 상세보기");
    },
    //검색 인풋 변경시
    searchInputValSet(nm, val) {
      this[nm] = val;
    },
    searchBtn() {
      this.reSetPage = true;
      const params = {
        yyyymm: "202201",
        consumablename: this.materialname,
        plantid: "LS",
        consumableid: this.materialid,
        materialtype: this.materialtype,
        warehouseid: this.warehouseid,
        fromdate: this.workFromDate,
        todate: this.workToDate,
      };
      this.getGridComboList();
      this.getGridData("material", "GetMaterialConsumableList", params);
    },
    onClick() {
      this.show = !this.show;
    },
    receiveDetailBtn() {
      this.receiveDetailModalVisible = true;
    },

    //그리드 데이터 가져오기
    async getGridData(id, queryId, params, queryVersion) {
      try {
        let receiptDateToDate;
        let receiptDateFromDate;

        if (this.receiptDateCheck == true) {
          receiptDateToDate = this.workToDate;
          receiptDateFromDate = this.workFromDate.replaceAll('-', '');
        }else{
          this.workToDate = "99999999"
          this.workFromDate = "00000000"
          todate = this.workToDate;
          fromdate = this.workFromDate;
        }

        this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: queryId,
          sendParam: params,
          queryVersion: queryVersion,
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
          this.$nuxt.$emit("iccReset");
          this.gridOriData[id] = data;
          this.gridData[id] = data;

          if (id === "stock") {
            this.gridData.stock.forEach((item) => {
              item.RECEIPTDATE = Utility.setFormatDate(item.RECEIPTDATE.slice(0, 10), "YYYY-MM-DD");
            });            
            if (this.gridData[id].length > 0) {
              this.input3 = this.gridData[id][0].MATERIALID; // 자재코드
              this.input4 = this.gridData[id][0].MATERIALNAME; // 자재명
              this.input5 = this.gridData[id][0].MATERIALTYPE; // 자재구분
              let sum = 0;
              for (let i = 0; i < this.gridData[id].length; i++) {
                sum += Number(this.gridData[id][i].STOCKQTY);
              }
              this.input6 = sum; // 총재고수량

              let sum2 = 0;
              for (let i = 0; i < this.gridData[id].length; i++) {
                sum2 += Number(this.gridData[id][i].HOLDQTY);
              }
              this.input7 = sum2; // 총보류수량
              this.input8 = Number(this.input6) - Number(this.input7); // 가용수량
            }else{
              this.input3 = this.curMaterial.CONSUMABLEID; // 자재코드
              this.input4 = this.curMaterial.CONSUMABLENAME; // 자재명
              this.input5 = this.curMaterial.CONSUMABLETYPE; // 자재구분
              this.input6 = "0"; // 총재고수량
              this.input7 = "0"; // 총보류수량
              this.input8 = "0"; // 가용수량
            }
          } 
          else{
            if(data.length > 0) {

              const paramsStock = {
                plantid: "LS",
                yyyymm: this.stockMonth[0].YYYYMM,
                warehouseid: this.areaid,
                materialtype: this.materialtype,
                materialid: data[0].CONSUMABLEID,
                todate: this.workToDate,
                fromdate: this.workFromDate
              };
              this.getGridData('stock', 'GetStockList', paramsStock, '00002');
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    // 년월목록
    async getStockMonth() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetStockMonth",
        sendParam: {
          plantid: "LS",
        },
      }).then((res) => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: false,
          };
        });
        this.stockMonth = data;

        console.log(this.stockMonth);
        this.stockMonthStr =
          this.stockMonth[0].YYYYMM + "-" + this.stockMonth[0].STATENAME;
      });
    },
    onRowClick(event) {
      console.log("===========onRowClick==============");
      //그리드 로우 클릭시 라인표시 유무 확인필요
      this.gridData.stock.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
    },

    // 자재목록 그리드 로우 클릭
    onMaterialRowClick(event) {
      this.gridData.material.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.curMaterial = event.dataItem;

      let receiptDateToDate;
      let receiptDateFromDate;

      if (this.receiptDateCheck == true) {
        receiptDateToDate = this.workToDate;
        receiptDateFromDate = this.workFromDate.replaceAll('-', '');
      }else{
        receiptDateToDate = "99999999"
        receiptDateFromDate = "00000000"
        todate = this.workToDate;
        fromdate = this.workFromDate.replaceAll('-', '');
      }

      const params = {
        plantid: "LS",
        yyyymm: this.stockMonth[0].YYYYMM,
        warehouseid: this.areaid,
        materialtype: this.materialtype,
        materialid: event.dataItem.CONSUMABLEID,
        receiptdate: this.gridData.stock.RECEIPTDATE,
        todate: this.workToDate,
        fromdate: this.workFromDate.replaceAll('-', '') 
      };
      this.getGridData("stock", "GetStockList", params, "00002");
    },
    //그리드 더블 클릭
    rowdblclick(e) {
      this.curMaterial = e.dataItem;
      this.getGridData("stock", "GetStockList", params, "00002");
      this.initData = e.dataItem;
      this.receiveDetailModalVisible = true;
    },
    //재고목록 그리드 더블 클릭
    stockRowdblclick(e) {
      this.data = e.dataItem;
      this.searchModalVisible = true;
    },
    //저장버튼
    saveBtn(data) {
      if (!data.openingqty) {
        this.$refs.alertPop.show("알림", "입고수량을 입력하지 않았습니다. 다시 입력해 주세요.");
        return;
      }      

      const sendParam = Object.assign(data, {
        MATERIALID: data.CONSUMABLEID,
        plantid: "LS",
        OPENINGQTY: data.OPENINGQTY,
        WAREHOUSEID: this.areaid,
        YYYYMM: this.stockMonth[0].YYYYMM,
        VENDOR: data.VENDOR,
        MATERIALTYPE: this.materialtype,
      })

      const res = this.mesPost({
        apiKey: "mes/common/manage",
        messagename: "TxnMaterialReceive",
        sendParam: sendParam,
      }).then(() => {
        this.$nextTick(() => {
          this.onMaterialRowClick({ dataItem: this.curMaterial }); // 이벤트 발생시키기
        });
      });
    },
    comboChange(nm, val) {
      //창고정보 세팅
      if(nm == 'areaid') {
        this.input2 = this.$refs.comboArea.codeLists.find(x => x.id === val).text;
      }

      this[nm] = val;
    },

    //row 선택
    selectRow() {
    },
    //그리드 인풋 제외 데이터 변경시(*콤보박스는 저장할때 데이터 변경후 저장)
    rowDdChange(e, name, dataItem) {
      console.log("===rowDdChange===", e);
      const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));
      console.log("name", name);
      if (name === "AREATYPE") {
      }
      if (name === "GOINORDERREQUIRED") {
        e.value = e.value ? "Yes" : "No";
      }

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
      console.log("===griditemchange===");
      const data = JSON.parse(JSON.stringify(this.gridData));
      const index = data.findIndex((x) => x.idx === e.dataItem.idx);
      data[index] = { ...data[index], [e.field]: e.value };
      if (data[index].rowStat === "N") {
        data[index].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }
      this.gridData = data;
    },

    //그리드 콤보박스 리스트가져오기
    async getGridComboList() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValue",
        sendParam: {
          plantid: "LS",
          enumid: "MATERIALTYPE",
        },
      }).then((data) => {
        this.gridDropDownList[0].dataItem = data;
      });
    },

    calendarChange(nm, val) {
      this[nm] = Utility.setFormatDate(nm.value, "YYYY-MM-DD");
    },

    toChange(e) {
      this.workToDate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    fromChange(e) {
      this.workFromDate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    receiptDateCheckValSet(nm, val){
      this[nm] = val ? '' : 'Released';
      console.log(nm, val)
      if (val == true) {
        this.receiptDateCheck = true;
      } else {
        this.receiptDateCheck = false;
      }
    },
    notPageReset(flag) {
      this.reSetPage = flag;
    },
    // sortChangeHandler(e){
    //   const isAscending = e.sort[0]?.dir == "asc";
    //   if(isAscending){
    //     this.gridData.material = this.gridData.material.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
    //     this.gridData.stock = this.gridData.stock.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
    //   }else{
    //     this.gridData.material = this.gridData.material.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
    //     this.gridData.stock = this.gridData.stock.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
    //   }
    // }
    sortChangeHandler(e){
      this.gfn_sortChangeHandler(this.gridData.material, e);
    },
    sortChangeHandler2(e){
      this.gfn_sortChangeHandler(this.gridData.stock, e);
    }   
  },
};

const defaultData = {};
</script>
<style lang="scss">
.windowContent {
  width: 1300px !important;
  height: 1300px !important;
}
</style>
<style lang="scss" scoped>
@media (max-width: 1267px) {
  .divList1 {
    height: 282px !important;
  }
  .divList2 {
    height: 593px !important;
  }
}
.calendar-info {
  display: inline-block;  /* inline-block으로 변경 */
  width: 166px;  /* 원하는 가로 넓이 설정 */
}
</style>
