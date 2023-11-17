<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>Lot수량관리</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>Lot ID</label>
                    <InputText
                      ref="lotid"
                      :dataNm="'lotid'"
                      :disabled="true"
                      :defaultValue="lotid"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                    <Button
                      :theme-color="'secondary'"
                      :size="'medium'"
                      @click="searchModalVisible = true"
                      >선택</Button
                    >
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <!-- <Button
                  :theme-color="'secondary'"
                  :size="'medium'"
                  :class="'btn-modal'"
                  @click="popDetailView()"
                ></Button> -->
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  icon="search"
                  @click="searchBtn(selectedLot)"
                  >조회</Button
                >
                <!-- <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="toggleDialog">저장</Button> -->
              </v-col>
              <!--
                            <v-col cols="6" align="left">
                                <v-row class="search-box" align="center" no-gutters>
                                    <v-col :cols="1">
                                        <Label>
                                            <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                                            Lot Id
                                        </Label>
                                    </v-col>
                                    <v-col :cols="5">
                                        <InputText
                                        ref="lotid"
                                        :boxWidth="'98%'"
                                        :dataNm="'lotid'"
                                        :disabled="false"
                                        :defaultValue="lotid"
                                        @input-text-set="searchInput"
                                        />
                                    </v-col>
                                    <v-col :cols="6">
                                        <Button :theme-color="'primary'" :size="'medium'" @click="searchModalVisible = true" >선택</Button>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="6" align="right">
                                <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="searchBtn(initData)">조회</Button>
                                <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="toggleDialog">저장</Button>
                            </v-col>
                            -->
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <div ref="divWrapper"></div>
      <!--
            <Card :style="{height : '20%'}">
                <CardBody :style="{width:'100%'}">
                    <v-row>
                        <v-col :cols="12">
                            <Card :style="{height : '100%'}">
                                <CardBody :style="{width:'100%'}">
                                    <div ref="divWrapper">
                                        <KendoGrid 
                                        ref="rowGrid"
                                        :gridHeight="gridHeight"
                                        :gridItems="gridData"
                                        :sortable="true"
                                        :columns="headerParam.gridHeader"
                                        :resizable="false"
                                        :edit-field="'inEdit'"
                                        :selected-field="selectedField"
                                        :gridDropDownList="gridDropDownList"
                                        :disabledCheckHeaderArr="disabledCheckHeaderArr"
                                        @gridrowclick="onRowClick"
                                        @gridddchang="rowDdChange"
                                        @griditemchange="griditemchange"
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </v-col>
                    </v-row>
                </CardBody>
            </Card>
            -->
      <v-col
        :sm="12"
        :lg="3"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <Card :class="'divList1'" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters :style="{ height: '100%' }">
              <v-col cols="12" align="left">
                <CardTitle>공정목록</CardTitle>
              </v-col>
              <v-col cols="12" :style="{ height: 'calc(100% - 43px)' }">
                <div ref="divWrapper2" :style="{ height: '100%' }">
                  <KendoGrid
                    ref="rowGrid2"
                    :gridHeight="gridHeight2"
                    :gridItems="gridData2"
                    :sortable="true"
                    :columns="headerParam2.gridHeader"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :gridDropDownList="gridDropDownList"
                    :disabledCheckHeaderArr="disabledCheckHeaderArr"
                    @gridrowclick="onRowClick"
                    @gridddchang="rowDdChange"
                    @griditemchange="griditemchange"
                  />
                </div>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
      <v-col
        :sm="12"
        :lg="9"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <TabStrip
              :selected="selected"
              @select="onSelect"
              :tabs="tabs"
              :style="{ width: '100%' }"
            >
              <template v-slot:Scrap>
                <Scrap
                  ref="Scrap"
                  :gridHeight="gridHeight3"
                  :gridHeight2="gridHeight4"
                  :viewParam="{
                    currentqty: currentqty,
                    workqty: workqty,
                    resultqty: resultqty
                  }"
                  @toggleDialog="toggleDialog"
                />
              </template>
              <template v-slot:Bonus>
                <Bonus
                  v-if="v1"
                  ref="Bonus"
                  :gridHeight="gridHeight3"
                  :gridHeight2="gridHeight4"
                  :viewParam="{
                    currentqty: currentqty,
                    workqty: workqty,
                    resultqty: resultqty,
                  }"
                  @toggleDialog="toggleDialog"
                />
              </template>
            </TabStrip>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop
      ref="alertPop"
      :is="'alertPop'"
      :callBack="() => (searchModalVisible = true)"
    />
    <AlertPop ref="alertPop2" :is="'alertPop'" />
    <ConfirmPop ref="confirmPop" :is="'confirmPop'" :visibleDialog="false" />
    <SelectModelingConfirm
      ref="SelectModelingConfirm"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="(val) => (searchModalVisible = val)"
      @searchBtn="searchBtn"
    />
    <DetailView ref="detailView" :is="'detailView'" 
      :header="headerParam.gridHeader"
      :item="selectedLot"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid";
import {
  Card,
  CardBody,
  CardTitle,
  TabStrip,
} from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import InputText from "@/components/common/input/InputText";
import utils from "~/plugins/utils";
import SelectModelingConfirm from '../../components/popup/SelectLotID.vue';
import Scrap from "@/components/frmLotScrapManagementTabs/FrmScrap";
import Bonus from "@/components/frmLotScrapManagementTabs/FrmBonus";
import DetailView from "@/components/common/DetailView";

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
    TabStrip,
    KendoGrid,
    InputText,
    Scrap,
    Bonus,
    SelectModelingConfirm,
    DetailView
  },
  data() {
    return {
      gridData: [],
      gridData2: [],
      gridOriData: [],
      gridOriData2: [],
      scrapGridData: [],
      bonusGridData: [],
      gridLastModIdx: null,
      gridDropDownList: [
        {
          dataVal: "AREATYPE",
          dataItem: [],
        },
      ],
      selectedField: "selected",
      expand: {
        ids: [],
        idField: "AREANAME",
      },
      disabledCheckHeaderArr: ["GOINORDERREQUIRED"],
      parentAreaId: "",
      headerParam: {
        gridid: "dgvLotInfo_Scrap", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      headerParam2: {
        gridid: "dgvProcessList_Scrap", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },

      gridHeader: [],
      lotid: "",
      productid: "",
      selected: 0,
      tabs: [
        { title: "Scrap", content: "Scrap" },
        { title: "Bonus", content: "Bonus" },
      ],
      gridHeight: "100px",
      gridHeight2: "100px",
      gridHeight3:
        ((window.innerHeight || document.body.clientHeight) / 9) * 2 + "px",
      gridHeight4:
        ((window.innerHeight || document.body.clientHeight) / 24) * 2 + "px",
      v1: false,
      v2: false,
      searchModalVisible: false,
      currentqty: "", // 현재수량
      workqty: "", // Scrap수량
      resultqty: "", // 결과수량
      labelqty: "Scrap",
      orgworkqty: "",
      selectedLot: {},
    };
  },
  created() {},
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    await this.getGridComboList();
    // await this.getGridData();
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
    popDetailView() {
      this.$refs.detailView.show("Lot 상세보기");
    },
    selectBtn() {},
    searchBtn(data) {


      if (Object.keys(data).length === 0) {
        this.$refs.alertPop.show("Info", "Lot ID를 선택 후 조회 하세요.");
        return;
      }
      this.selectedLot = data;
      this.lotid = data.LOTID;
      this.productid = data.PRODUCTID;
      this.$nuxt.$emit("iccReset");
      // this.initData = data;
      this.getGridData();
      this.getGridData2();
    },

    saveBtn() {
      const saveData = this.gridData.map((x) => {
        return {
          ...x,
          _ROWSTATUS: x.rowStat,
          REASONCODETYPE:
            this.selected === 0
              ? this.$refs.Scrap.reasoncodetype
              : this.$refs.Bonus.reasoncodetype,
          REASONCODE:
            this.selected === 0
              ? this.$refs.Scrap.reasoncode
              : this.$refs.Bonus.reasoncode,
          SCRAPQUANTITY: this.workqty,
          CHANGEQUANTITY: this.workqty,
          COMMENT:
            this.selected === 0
              ? this.$refs.Scrap.comment
              : this.$refs.Bonus.comment,
        };
      });

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: this.selected === 0 ? "TxnScrap" : "TxnUnscrap",
          sendParam: saveData,
        }).then(() => {
          this.$nextTick(() => {
            this.$refs.alertPop2.show("Info", "저장되었습니다.");
            this.searchBtn(this.selectedLot);
          });
        });
      }
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotSearchList_Bonus",
        sendParam: {
          plantid: "LS",
          lotid: this.lotid,
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
        this.$nuxt.$emit("iccReset");
        this.gridOriData = data;
        this.gridData = data;
        // console.log(this.gridData)
        // this.selectedLot = data;
        // this.initData = data;
        this.selectedLot = this.gridData[0];
        this.currentqty = this.gridData[0].CURRENTQUANTITY; // 현재수량
        this.resultqty = this.gridData[0].CURRENTQUANTITY; // 결과수량
        this.workqty = "0";

        // 탭별로 grid lotid,productid 셋팅
        this.scrapGridData = this.$refs.Scrap.gridData.map((x) => {
          return {
            ...x,
            LOTID: this.lotid,
            PRODUCTID: this.productid
          };
        });

        this.bonusGridData = this.$refs.Bonus.gridData.map((x) => {
          return {
            ...x,
            LOTID: this.lotid,
            PRODUCTID: this.productid
          };
        });
        
        this.$refs.Scrap.gridData = this.scrapGridData;
        this.$refs.Scrap.currentqty = this.currentqty;
        this.$refs.Scrap.resultqty = this.resultqty;
        this.$refs.Scrap.workqty = this.workqty;
        if (this.v1) {
          this.$refs.Bonus.gridData = this.bonusGridData;
          this.$refs.Bonus.currentqty = this.currentqty;
          this.$refs.Bonus.resultqty = this.resultqty;
          this.$refs.Bonus.workqty = this.workqty;
        }
      });

    },
    //그리드 데이터 가져오기
    async getGridData2() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProcessRouteProgressList",
        sendParam: {
          lotid: this.lotid,
        },
        queryVersion: "00005",
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
        this.gridOriData2 = data;
        this.gridData2 = data;
      });
    },
    //그리드 로우 클릭
    onRowClick(event) {
      console.log("===========onRowClick==============");
      //그리드 로우 클릭시 라인표시 유무 확인필요
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      // console.log("===rowDdChange===",e)
      const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if (name === "GOINORDERREQUIRED") {
        e.value = e.value ? "Yes" : "No";
      }

      // if(name === "POSITION"){
      //   e.value = e.value.replace(/[^0-9]/gi, "")
      // }

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
      console.log("===griditemchange===", e);

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
        return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    //그리드 콤보박스 리스트가져오기
    async getGridComboList() {
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValue",
        sendParam: {
          plantid: "LS",
          enumid: "AreaType",
        },
      }).then((data) => {
        const combo = data.map((x) => {
          return {
            ENUMVALUE: x.ENUMVALUE,
            ENUMVALUENAME: x.ENUMVALUENAME,
          };
        });
        this.gridDropDownList[0].dataItem = combo;
      });
    },
    onSelect(e) {
      this.selected = e.selected;
      // this.$refs.workqty.textVal = "0";
      this.workqty = "0";
      if (this.gridData.length > 0) {
        this.currentqty = this.gridData[0].CURRENTQUANTITY; // 현재수량
        this.resultqty = this.gridData[0].CURRENTQUANTITY; // 결과수량
      }
      if (this.selected === 0) {
        this.labelqty = "Scrap";
      } else {
        this.labelqty = "Bonus";
        if (!this.v1) {
          this.v1 = !this.v1;
        }
      }
    },
    searchInput(nm, val) {
      // currentqty: "", // 현재수량
      // workqty: "", // Scrap수량
      // resultqty: "", // 결과수량
      console.log(nm); // workqty
      this[nm] = val;
    },
    toggleDialog(data) {
      this.currentqty = data.currentqty;
      this.workqty = data.workqty;
      this.resultqty = data.resultqty;
      this.labelqty = data.labelqty;

      if (this.gridData.length === 0) {
        this.$refs.alertPop2.show("알림", "저장할 데이터가 없습니다.");
        return;
      }
      if (Number(this.workqty) <= 0) {
        this.$refs.alertPop2.show(
          "알림",
          this.labelqty + "수량 입력을 확인하세요."
        );
        return;
      }
      if (Number(this.workqty) > Number(this.currentqty) && this.selected === 0) {
        this.$refs.alertPop2.show(
          "알림",
          "현재수량 (" + this.currentqty + ") 보다 " + 
          "입력된 불량수량 (" + this.workqty + ") 이 더 큽니다. " + 
          "수량을 다시 입력하세요."
          
        );
        return;
      }
      if (!Number.isInteger(Number(this.workqty))) {
        this.$refs.alertPop2.show(
          "알림",
          this.labelqty + "수량 입력을 확인하세요."
        );
        return;
      }
      // this.visibleDialog = !this.visibleDialog;
      this.$refs["confirmPop"].title = "confirm";
      this.$refs["confirmPop"].message =
        "현재수량 : " +
        this.currentqty +
        "<br/>" +
        "<br/>" +
        "작업수량 : " +
        this.workqty +
        "<br/>" +
        "<br/>" +
        "잔여수량 : " +
        this.resultqty +
        "<br/>" +
        "<br/>" +
        this.labelqty +
        "처리 하시겠습니까?";
      this.$refs["confirmPop"].callBack = this.saveBtn;
      this.$refs["confirmPop"].modalWidth = "300px";
      this.$refs["confirmPop"].visibleDialog = true;
    },
  },
};

const defaultData = {};
</script>
<style lang="scss" scoped>
@media (max-width: 1267px) {
  .divList1 {
    height: 234px !important;
  }
}
</style>
