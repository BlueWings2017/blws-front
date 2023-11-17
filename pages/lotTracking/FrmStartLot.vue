<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>Lot시작</li>
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
                    <!-- <Button
                      :theme-color="'primary'"
                      :size="'medium'"
                      @click="searchModalVisible = true"
                      >선택</Button
                    >                     -->
                    <Button
                      :theme-color="'primary'"
                      :size="'medium'"
                      @click="modelingSearchModalVisible = true"
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

                    <label>상태</label>
                    <div class="form-selectBox">
                      <MesSelectBox
                        :enumID="'LotStateStart'"
                        :allYN="true"
                        :dataNm="'lotstate'"
                        @comboChange="comboChange"
                      ></MesSelectBox>
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
          <CardBody :style="{ width: '100%', height:'100%' }">
            <v-row>
              <v-col :sm="9" :lg="9" align="left">
                <CardTitle>[LS] Lot목록</CardTitle>
              </v-col>
              <v-col :sm="3" :lg="3" align="right">
                <Button
                  :theme-color="this.startBtnColor"
                  :size="'small'"
                  @click="btnClick('start')"
                  >생산시작</Button
                >
                <Button
                  :theme-color="this.cancelBtnColor"
                  :size="'small'"
                  @click="btnClick('cancel')"
                  >시작취소</Button
                >
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="this.gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="gridDropDownList"
                :disabledCheckHeaderArr="disabledCheckHeaderArr"
                :isPaging="true"
                @selectionchange="onSelectionchange"
                @gridrowclick="onRowClick"
                @headerselectionchange="onHeaderSelectionChange"
                @sortChangeHandler="sortChangeHandler"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop
      v-if="selectPopup"
      ref="alertPop"
      :is="'alertPop'"
      :callBack="() => (searchModalVisible = true)"
    />
    <AlertPop v-else ref="alertPop" :is="'alertPop'" />

    <!-- 팝업 -->

    <ConfirmPop ref="confirmPop" :callBack="{}" />

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
    <ModelingSearchModal
      ref="ModelingSearchModal"
      v-if="modelingSearchModalVisible"
      :visibleDialog="modelingSearchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      :selected-field="selectedField"
      @visibleDialog="(val) => (modelingSearchModalVisible = val)"
      @productCode="productCode"
      @modelingInfo="modelingInfo"
    />
  </div>
</template>
<script>
import ModelingSearchModal from "@/components/frmAvailableEquipment/ModelingSearchModal";
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
import {
  AutoComplete,
  ComboBox,
  DropDownList,
  MultiSelect,
} from "@progress/kendo-vue-dropdowns";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import ConfirmPop from "../../components/common/modal/ConfirmPop.vue";
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
    Dialog,
    DialogActionsBar,
    AutoComplete,
    ComboBox,
    dropdownlist: DropDownList,
    MesSelectBox,
    Window,
    DatePicker,
    SelectModelingConfirm,
    ConfirmPop,
    ModelingSearchModal,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: "500px",
    },
  },
  data() {
    return {
      modelingSearchModalVisible: false,
      startBtnColor: "secondary",
      cancelBtnColor: "secondary",
      columns: [],
      gridHeader: [],
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      searchModalVisible: false,
      gridDropDownList: [ ],
      selectedField: "selected",
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
      headerParam: {
        gridid: "dgvLotList_Start", // 그리드 ID
        gridHeader:[],
        noRowstat: true,
      },

      visibleWindow: false,
      lotidMessage: "",
      selectLots: 0,
      selectPopup: false,
      sortField: [{}],
    };
  },
  created() {},
  async mounted() {
    this.fromdate = Utility.setFormatDate(this.fromdate, "YYYYMMDD");
    this.todate = Utility.setFormatDate(this.todate, "YYYYMMDD");
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
    // 생산시작,시작취소 click 이벤트
    btnClick(type) {
      this.selectPopup = false;
      let impossibleIds = ""; // 시작,취소 불가능한 lot ID
      let possibleIds = ""; // 시작,취소 가능한 lot ID
      if (this.selectLots > 0) {
        if (type == "start") {
          // 생산시작
          this.gridData.forEach(function e(lot) {
            if (lot.selected) {
              possibleIds += lot.LOTID + ",";
              if (lot.LOTSTATE != "Created") {
                impossibleIds += lot.LOTID + ",";
              }
            }
          });
          impossibleIds = impossibleIds.slice(0, -1);
          if (impossibleIds.length > 0) {
            this.$refs.alertPop.title = "";
            this.$refs.alertPop.message =
              "Lot ID " + "[" + impossibleIds + "] 는 시작할 수 없습니다.";
            this.$refs.alertPop.modalWidth =
              150 * impossibleIds.split(",").length;
            this.$refs.alertPop.visibleDialog = true;
            return false;
          }

          this.$refs["confirmPop"].title = "저장";
          this.$refs["confirmPop"].message =
            "LotID : " + possibleIds + " 를 시작하시겠습니까?";
          this.$refs["confirmPop"].callBack = this.startBtn;
          this.$refs["confirmPop"].modalWidth = "330px";
          this.$refs["confirmPop"].visibleDialog = true;
        } else {
          // 시작 취소
          this.gridData.forEach(function e(lot) {
            if (lot.selected) {
              possibleIds += lot.LOTID + ",";
              if (lot.LOTSTATE != "Released") {
                impossibleIds += lot.LOTID + ",";
              }
            }
          });
          impossibleIds = impossibleIds.slice(0, -1);
          if (impossibleIds.length > 0) {
            this.$refs.alertPop.title = "";
            this.$refs.alertPop.message =
              "Lot ID " + "[" + impossibleIds + "] 는 시작취소할 수 없습니다.";
            this.$refs.alertPop.modalWidth =
              150 * impossibleIds.split(",").length;
            this.$refs.alertPop.visibleDialog = true;
            return false;
          }
          this.$refs["confirmPop"].title = "저장";
          this.$refs["confirmPop"].message =
            "LotID : " + possibleIds + " 를 시작 취소하시겠습니까?";
          this.$refs["confirmPop"].callBack = this.startCancelBtn;
          this.$refs["confirmPop"].modalWidth = "330px";
          this.$refs["confirmPop"].visibleDialog = true;
        }
      } else {
        this.$refs.alertPop.show("알림", "선택된 Lot목록이 없습니다.");
        return false;
      }
    },

    //생산시작
    startBtn() {
      const saveData = [];
      // 생성인 lot만 생산시작 가능
      this.gridData.forEach(function e(lot) {
        if (lot.LOTSTATE == "Created" && lot.selected) {
          saveData.push(lot);
        }
      });
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnLotStart",
          sendParam: saveData,
        }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === "0") {
              this.$refs.alertPop.show("알림", "저장되었습니다.");
              this.getGridData();
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

    //시작취소
    startCancelBtn() {
      const saveData = [];
      this.gridData.forEach(function e(lot) {
        if (lot.LOTSTATE == "Released" && lot.selected) {
          saveData.push(lot);
        }
      });
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnLotStartCancel",
          sendParam: saveData,
        }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode === "0") {
              this.$refs.alertPop.show("알림", "저장되었습니다.");
              this.getGridData();
            } else {
              this.$refs.alertPop.show(
                "Error : " + result.returnmessage,
                result.returndetailmessage
              );
            }
          });
        });
      }
    },

    //조회버튼
    searchBtn(productid) {
      this.$refs.rowGrid.skip = 0;
      this.$refs.rowGrid.sortField = [{}];
      if (!this.validateDates()) return;
      // 제품코드 값 체크
      if (productid == "") {
        this.$refs.alertPop.title = "";
        this.$refs.alertPop.message = "제품코드를 선택해주세요.";
        this.$refs.alertPop.modalWidth = "330px";
        this.$refs.alertPop.visibleDialog = true;
        this.selectPopup = true;
        return false;
      } else {
        this.getGridData();
        this.startBtnColor = "secondary";
        this.cancelBtnColor = "secondary";
      }
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
      console.log("getGridData");
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotInfoStartAndCancelList",
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
        this.selectLots = 0;
        
        if (this.gridData[0] === undefined) {
          this.$refs.alertPop.show("", "Lot목록이 존재하지 않습니다.");
        }
      });
    },

    //그리드 로우 클릭
    onRowClick(event) {
      console.log(event);
      this.selectedID = event.dataItem.LOTID;
      //그리드 로우 클릭시 라인표시 유무 확인필요
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      // 그리드 행 선택시 선택한 row 만큼 count ++
      if (event.dataItem[this.selectedField]) {
        this.selectLots += 1;
      } else {
        this.selectLots -= 1;
      }
      const saveData = [];
      this.gridData.forEach(function e(lot) {
        if (lot.selected) {
          saveData.push(lot);
        }
      });

      let hasReleased = false;
      let hasCreated = false;
      for (let i = 0; i < saveData.length; i++) {
        if (saveData[i].LOTSTATE === "Released") {
          hasReleased = true;
        } else if (saveData[i].LOTSTATE === "Created") {
          hasCreated = true;
        }
      }

      if (hasReleased) {
        this.cancelBtnColor = "primary";
      } else {
        this.cancelBtnColor = "secondary";
      }

      if (hasCreated) {
        this.startBtnColor = "primary";
      } else {
        this.startBtnColor = "secondary";
      }

      if (saveData.length === 0) {
        this.cancelBtnColor = "secondary";
        this.startBtnColor = "secondary";
      }
    },

    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      console.log("===========onSelectionchange==============");
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      // 그리드 체크박스 선택시 선택한 row 만큼 count ++
      if (event.dataItem[this.selectedField]) {
        this.selectLots += 1;
      } else {
        this.selectLots -= 1;
      }
      console.log(this.selectLots);
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      console.log("===========onHeaderSelectionChange==============");
      let checked = event.event.target.checked;
      // 전체 체크시에 count를 gridData 수 만큼 +
      if (checked) {
        this.selectLots = this.gridData.length;
      } else {
        this.selectLots = 0;
      }
      console.log(this.selectLots);
      this.gridData = this.gridData.map((item) => {
        return { ...item, selected: checked };
      });
    },

    //row 선택
    selectRow() {
      const returnData = this.items.filter((x) => x.selected);
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
      this.productid = data.PRODUCTID;
      this.getGridData();
    },
    modelingInfo(data) {
      this.$nuxt.$emit("iccReset");
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

    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData, e, [
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
