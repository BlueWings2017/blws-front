<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>재작업</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="8" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>Lot ID</label>
                    <InputText
                      ref="lotid"
                      :dataNm="'lotid'"
                      :defaultValue="lotid"
                      :readonly="true"
                      @input-text-set="searchInput"
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
                </div>
              </v-col>
              <v-col :sm="4" :lg="2" align="right">
                <!-- <Button
                  :theme-color="'secondary'"
                  :size="'medium'"
                  :class="'btn-modal'"
                  @click="popDetailView()"
                ></Button> -->
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn(selectedLot)"
                  >조회</Button
                >
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :sm="6" :lg="5" :class="'divList1'" :style="{ height: '100%' }">
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <v-row class="divList" :style="{ height: '100%' }" no-gutters>
              <v-col :sm="5" :lg="5">
                <v-row :style="{ height: '100%' }" no-gutters>
                  <v-col cols="12" :style="{ height: '33px)' }">
                    <CardTitle>현재진행정보</CardTitle>
                  </v-col>
                  <v-col cols="12" :style="{ height: 'calc(100% - 33px)' }">
                    <div
                      ref="divWrapper"
                      class="grid-tree grid-tree-lines"
                      :style="{ height: '100%' }"
                    >
                      <KendoTree
                        ref="TreeView"
                        :treeData="treeData"
                        :textField="'PROCESSNAME'"
                        :chidrenField="'children'"
                        :activeItem="checkTreeData"
                        :icon="'icon'"
                        @onExpandChange="onExpandChange"
                        @onItemClick="onItemClick"
                      ></KendoTree>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col :sm="1" :lg="1">
                <div :class="'btn-cell-move'">
                  <Button
                    :theme-color="'secondary'"
                    :class="'btn-cell-right'"
                    @click="treeInsert"
                  ></Button>
                  <Button
                    :theme-color="'secondary'"
                    :class="'btn-cell-left'"
                    @click="treeDelete"
                  ></Button>
                </div>
              </v-col>
              <v-col :sm="6" :lg="6">
                <v-row :style="{ height: '100%' }" no-gutters>
                  <v-col :sm="12" :lg="12">
                    <v-row no-gutters>
                      <v-col :sm="6" :lg="6" align="left">
                        <CardTitle>재작업설정</CardTitle>
                      </v-col>
                      <v-col :sm="6" :lg="6" align="right">
                        <Button
                          :theme-color="'primary'"
                          :size="'small'"
                          @click="routeChangeBefore"
                          >라우팅변경</Button
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col :sm="12" :lg="12">
                    <KendoGrid
                      ref="rowGrid4"
                      gridHeight="108px"
                      :gridItems="RoutingData"
                      :sortable="true"
                      :columns="headerParam4.gridHeader"
                      :resizable="true"
                      :edit-field="'inEdit'"
                      :selected-field="selectedField"
                      :disabledCheckHeaderArr="disabledCheckHeaderArr"
                    />
                  </v-col>
                  <v-col
                    :sm="12"
                    :lg="12"
                    :style="{ height: 'calc(100% - 98px)' }"
                  >
                    <div
                      ref="divWrapper5"
                      class="grid-tree grid-tree-lines"
                      :style="{ height: '100%' }"
                    >
                      <KendoTree
                        ref="TreeView2"
                        :treeData="treeData2"
                        :textField="'PROCESSNAME'"
                        :chidrenFiedl="'children'"
                        :activeItem="checkTreeData"
                        :icon="'icon'"
                        @onExpandChange="onExpandChange"
                        @onItemClick="onItemClick"
                      ></KendoTree>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
      <v-col
        :sm="6"
        :lg="7"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
        align="left"
      >
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <v-row :style="{ height: '100%' }" no-gutters>
              <v-col class="divList divList2" :sm="12" :lg="12">
                <v-row no-gutters :style="{ height: '100%' }">
                  <v-col :sm="10" :lg="6" align="left">
                    <CardTitle
                      >원인공정<span class="i-msg">{{
                        this.selectedReasonProcess
                      }}</span></CardTitle
                    >
                  </v-col>
                  <v-col :sm="2" :lg="6" align="right">
                    <Button
                      :theme-color="'primary'"
                      :size="'small'"
                      icon="save"
                      @click="saveBefore"
                      >저장</Button
                    >
                  </v-col>
                  <v-col
                    :sm="12"
                    :lg="12"
                    :style="{ height: 'calc(100% - 33px)' }"
                  >
                    <div ref="divWrapper2" :style="{ height: '100%' }">
                      <KendoGrid
                        ref="rowGrid2"
                        gridHeight="220px"
                        :gridItems="items2"
                        :sortable="true"
                        :columns="headerParam2.gridHeader"
                        :resizable="true"
                        :edit-field="'inEdit'"
                        :selected-field="selectedField"
                        :disabledCheckHeaderArr="disabledCheckHeaderArr"
                        @gridrowclick="reasonProcessClick"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="divList divList2" cols="12">
                <v-row no-gutters :style="{ height: '100%' }">
                  <v-col :sm="12" :lg="6" align="left">
                    <CardTitle
                      >사유코드<span class="i-msg">{{
                        this.selectedReasonCode
                      }}</span></CardTitle
                    >
                  </v-col>
                  <v-col
                    :sm="12"
                    :lg="12"
                    :style="{ height: 'calc(100% - 33px)' }"
                  >
                    <div ref="divWrapper3" :style="{ height: '100%' }">
                      <KendoGrid
                        ref="rowGrid3"
                        gridHeight="220px"
                        :gridItems="items3"
                        :sortable="true"
                        :columns="headerParam3.gridHeader"
                        :resizable="true"
                        :edit-field="'inEdit'"
                        :selected-field="selectedField"
                        :disabledCheckHeaderArr="disabledCheckHeaderArr"
                        @gridrowclick="reasonCodeClick"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="divList divList2" :sm="12" :lg="12">
                <v-row no-gutters :style="{ height: '100%' }">
                  <v-col :sm="12" :lg="6" align="left">
                    <CardTitle>Comment</CardTitle>
                  </v-col>
                  <v-col
                    :sm="12"
                    :lg="12"
                    :style="{ height: 'calc(100% - 33px)' }"
                  >
                    <TextArea
                      ref="comment"
                      :style="{ width: '100%', height: '100%' }"
                      @input="textAreaChange"
                    ></TextArea>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
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
    <ConfirmPop ref="confirmPop" :callBack="routeChangeBtn" />
    <ConfirmPop ref="confirmPop2" :callBack="saveBtn" />

    <!-- <lotIdSearch
      ref="lotIdSearch"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="(val) => (searchModalVisible = val)"
      @selectLotId="selectLotId"
      @searchBtn="searchBtn"
    /> -->
    <SelectLotID
      ref="SelectLotID"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :selectedLot="selectedLot"
      :callBack="() => {}"
      :chkNotReleaseLot="true"
      @visibleDialog="val => (searchModalVisible = val)"
      @selectLotId="selectLotId"
      @searchBtn="searchBtn"
    />
    <selectReworkRoute
      ref="selectReworkRoute"
      v-if="routeSearchModalVisible"
      :visibleDialog="routeSearchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="(val) => (routeSearchModalVisible = val)"
      @popupRouteData="popupRouteData"
    />
    <DetailView
      ref="detailView"
      :is="'detailView'"
      :header="headerParam.gridHeader"
      :item="this.selectedLot"
    />
  </div>
</template>
<script>
import DetailView from "@/components/common/DetailView";
import mixinGlobal from "@/mixin/global.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import Utility from "~/plugins/utility";
import {
  Card,
  CardBody,
  CardTitle,
  TabStrip,
} from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from "@progress/kendo-vue-treeview";
import KendoGrid from "@/components/common/KendoGrid";
import KendoTree from "@/components/common/KendoTree";
import DateUtility from "~/plugins/dateUtility";
import { Button } from "@progress/kendo-vue-buttons";
import { Input, TextArea } from "@progress/kendo-vue-inputs";
import InputText from "../../components/common/input/InputText.vue";
import Checkbox from "@/components/common/input/Checkbox";
import AlertPop from "../../components/common/modal/AlertPop.vue";
import lotIdSearch from "@/components/frmReWork/lotIdSearch";
import selectReworkRoute from "@/components/frmReWork/selectReworkRoute";
import SelectLotID from '../../components/popup/SelectLotID.vue';
import utils2 from "~/plugins/utils2";

import ConfirmPop from "../../components/common/modal/ConfirmPop.vue";
import { booleanFilterValues } from "@progress/kendo-vue-data-tools";
let myTitle;
let myMenuId;
let saveData;
let processItem;
export default {
  name: "LotProcessHistory",
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
    AlertPop,
    Input,
    Button,
    CardBody,
    CardTitle,
    Card,
    InputText,
    KendoGrid,
    TabStrip,
    Checkbox,
    Utility,
    DateUtility,
    lotIdSearch,
    selectReworkRoute,
    ConfirmPop,
    multiGridHeaderMinin,
    TreeView,
    KendoTree,
    TextArea,
    DetailView,
    SelectLotID,
  },
  props: {
    gridHeight1: {
      type: String,
      defaultData: "150px",
    },
  },

  data() {
    return {
      gridHeader: [],
      gridData: [],
      ReasonCodeData: [],
      ReasonProcessData: [],
      RoutingData: [],
      columns: [],
      treeData: [],
      treeData2: [],
      treeData3: [],
      routeReworkProgressTree: [],
      selected: 0,
      searchModalVisible: false,
      routeSearchModalVisible: false,
      selectedID: null,
      lotid: "",
      productid: "",
      reasoncodetype: "",
      processid: "",
      reasoncode: "",
      processName: "",
      plantid: "LS",
      processroutetype: "",
      gridHeight: "100px",
      selectedReasonCode: "",
      selectedReasonProcess: "",
      selectedReasonProcessSeq: "",
      selectPopup: false,
      selectedLot: {},

      disabledCheckHeaderArr: ["GOINORDERREQUIRED"], //순차진행여부
      selectedField: "selected",
      headerParam: {
        gridid: "dgvLotList_Rework",
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      headerParam2: {
        gridid: "dgvReasonProcess",
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      headerParam3: {
        gridid: "dgvReasonCode",
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      headerParam4: {
        gridHeader: [
          {
            field: "PROCESSROUTENAME",
            editable: false,
            title: "라우팅명 ",
            minWidth: 40,
            cell: "PRIMARYKEYFLAG",
            className: "gridTextCenter",
            VISIBLEFLAG: "Yes",
          },
          {
            field: "PROCESSROUTEID",
            editable: false,
            title: "라우팅코드",
            minWidth: 40,
            cell: "PRIMARYKEYFLAG",
            className: "gridTextCenter",
            VISIBLEFLAG: "Yes",
          },
        ],
      },

      checkTreeData: {},
      curLot: null,
      routeChangeCheck: false,
    };
  },

  created() {},
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    await this.getHeaderMulti(this.headerParam3, this.$refs.divWrapper3);
  },

  computed: {
    items() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.LOTID === this.lotid,
      }));
    },
    items2() {
      return this.ReasonProcessData.map((item) => ({
        ...item,
        selected: item.PROCESSID === this.processid,
      }));
    },
    items3() {
      return this.ReasonCodeData.map((item) => ({
        ...item,
        selected: item.REASONCODE === this.reasoncode,
      }));
    },
  },

  watch: {},

  methods: {
    //그리드데이터 가져오기 (Lot정보)
    async getGridData() {
      this.treeData2 = []; // ReWork 트리 초기화
      processItem = ""; // lot 조회시 마다 공정 재작업 트리 값 초기화
      let result = false;
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotSearchList_Rework",
        sendParam: {
          plantid: "LS",
          lotid: this.lotid,
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
        // Lot 정보 있을때
        if (data.length > 0) {
          result = true;
          this.$nuxt.$emit("iccReset");

          this.gridData = data;
          this.processName = data[0].PROCESSROUTETYPE;
          this.initTree();
          this.selectedLot = data[0];
        } else if (data.length === 0){
          result = false;
          console.log("##")
          this.$refs.alertPop.show("", "Lot ID 선택 후 조회하세요.");
          return;
        }
      });
      return result;
    },
    //그리드 데이터 가져오기 (원인공정)
    getGridData2() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReworkReasonProcessList",
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
        this.ReasonProcessData = data;
        if (data[0] != undefined) {
          this.selectedReasonProcess = data[0].PROCESSID;
          this.selectedReasonProcessSeq = data[0].PROCESSSEQUENCE;
        }
      });
    },
    //그리드 데이터 가져오기 (사유코드)
    getGridData3() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReasoncodeList",
        sendParam: {
          plantid: "LS",
          REASONCODE: "",
          reasoncodetype: "REWORK",
          lotid: this.lotid,
          productid: this.productid,
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
        this.ReasonCodeData = data;
        this.selectedReasonCode = data[0].DESCRIPTION;
      });
    },
    // grid Data 조회
    async getGridsData() {
      let result = await this.getGridData();
      if (result) {
        await this.getGridData2();
        await this.getGridData3();
        return true;
      } else {
        return false;
      }
    },
    //트리 데이터 가져오기 (현재진행정보)
    async initTree() {
      const res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProcessRouteReworkProgressList ",
        sendParam: {
          lotid: this.lotid,
          plantid: "LS",
        },
      });

      res.unshift({
        LOTID: "",
        PROCESSID: this.lotid,
        PROCESSNAME: this.processName,
        PROCESSROUTEID: "",
        PROCESSDESC: "", // PROCESSROUTETYPENAME
        PROCESSSEQUENCE: "1",
        PROCESSCOMPLETESTATUS: "",
        PROCESSSTATUS: "PROCESSROUTE",
        PLANTID: "LS",
        //LEVELVALUE: "PROCESSROUTE",
        icon: "PROCESSROUTE",
      });
      const res2 = res.map((x) => {
        let PN = "";
        let PNicon = "";
        if (x.PROCESSNAME === "Main") {
          PN = "Main";
          PNicon = "PROCESSROUTE";
        } else if (x.PROCESSNAME === "Rework") {
          PN = "Rework";
          PNicon = "PROCESSROUTE";
        } else {
          PN = x.PROCESSNAME + "[" + x.PROCESSCOMPLETESTATUS + "]";
          PNicon = "PROCESS";
        }
        return {
          LOTID: x.LOTID,
          PROCESSID: x.PROCESSID,
          PROCESSNAME: PN,
          PROCESSROUTEID: x.PROCESSROUTEID,
          PROCESSDESC: x.PROCESSDESC,
          PROCESSSEQUENCE: x.PROCESSSEQUENCE,
          PROCESSCOMPLETESTATUS: x.PROCESSCOMPLETESTATUS,
          PROCESSSTATUS: x.PROCESSSTATUS,
          PLANTID: x.PLANTID,
          LEVELVALUE: "PROCESS",
          icon: PNicon,
        };
      });

      this.processName = this.gridData[0].PROCESSROUTETYPE;
      const data = res2.map((x) => ({ ...x, expanded: true }));
      this.treeData = utils2.makeTreeData(data, "PROCESSID", "LOTID");
      this.routeReworkProgressTree = this.treeData;
    },

    //트리 Insert (▶)
    treeInsert() {
      const chkData = this.checkTreeData; // 선택값

      if (
        chkData.PROCESSCOMPLETESTATUS === "대기" ||
        chkData.PROCESSCOMPLETESTATUS === "진행중"
      ) {
        this.$refs.alertPop.show("", "미진행 공정은 재작업 할 수 없습니다.");
        return false;
      }

      if (this.routeChangeCheck === true) {
        this.routeChangeCheck = false;
        this.RoutingData = [];
        this.treeData2 = [];
        processItem = "";
        this.treeInsert();
        return;
      }

      if (Object.keys(chkData).length === 0) {
        this.$refs.alertPop.show("", "항목을 선택하세요.");
        return;
      }
      if (this.treeData2.length === 0) {
        const res = [
          {
            LOTID: "",
            PROCESSID: this.lotid,
            PROCESSNAME: "Rework",
            PROCESSROUTEID: "",
            PROCESSDESC: "", // PROCESSROUTETYPENAME
            PROCESSSEQUENCE: "1",
            PROCESSCOMPLETESTATUS: "",
            PROCESSSTATUS: "PROCESSROUTE",
            icon: "PROCESSROUTE",
            PLANTID: "LS",
          },
        ];

        const data = res.map((x) => ({ ...x, expanded: true }));
        this.treeData2 = utils2.makeTreeData(data, "PROCESSID", "LOTID");
      }
      const childData = this.treeData2[0].children; // 재작업 tree
      const parentData = this.treeData[0].children; // 현재진행정보 tree
      let chkProcessSeq = Number(chkData.PROCESSSEQUENCE); // 체크 PROCESSSEQUENCE 값
      let reWorkLastSeq; // 배열 push 전 마지막 PROCESSSEQUENCE 값
      let lastIndex; // 배열 push 전 마지막 index
      let plusIdx = 0;
      let spliceLastData = false;
      let reWorkFirstSeq; // 배열 push 전 첫번째 PROCESSSEQUENCE 값

      // 최초 배열 push
      //console.log(processItem);
      if (chkData.PROCESSCOMPLETESTATUS == "완료") {
        if (processItem == "") {
          processItem += chkData.PROCESSID + ",";
          childData.push(chkData);
        }
        reWorkFirstSeq = Number(childData[0].PROCESSSEQUENCE);
        // 체크값 중복체크
        if (!processItem.includes(chkData.PROCESSID)) {
          childData.push(chkData);
          lastIndex = childData.length - 1;
          reWorkLastSeq = Number(childData[lastIndex - 1].PROCESSSEQUENCE);
          parentData.forEach(function reWorkCellChk(list) {
            // 현재진행정보 리스트 반복
            if (list.PROCESSCOMPLETESTATUS == "완료") {
              // ▶▶ 버튼 클릭시 체크한 값, 배열 마지막 값 사이 중간데이터들 조회
              if (chkProcessSeq > reWorkLastSeq) {
                if (
                  list.PROCESSSEQUENCE > reWorkLastSeq &&
                  list.PROCESSSEQUENCE < chkProcessSeq
                ) {
                  processItem += list.PROCESSID + ",";
                  childData.splice(lastIndex + plusIdx, 0, list);
                  plusIdx++;
                }
              } else {
                if (
                  list.PROCESSSEQUENCE < reWorkFirstSeq &&
                  list.PROCESSSEQUENCE >= chkProcessSeq
                ) {
                  // ◀◀ 버튼 클릭시 체크한 값, 배열 첫번째 값 사이 중간데이터들 조회
                  processItem += list.PROCESSID + ",";
                  childData.splice(plusIdx, 0, list);
                  plusIdx++;
                  spliceLastData = true;
                }
              }
            }
          });
          // ◀◀ 버튼 클릭시 마지막 배열값 삭제
          if (spliceLastData) {
            childData.splice(childData.length - 1, 1);
          } else {
            processItem += chkData.PROCESSID + ",";
          }
        }
      }

      this.RoutingData = [this.gridData[0]];
    },

    //트리 Delete (◀)
    treeDelete() {
      const chkData = this.checkTreeData;
      // console.log(chkData);
      // console.log(this.treeData2);
      if (Object.keys(chkData).length === 0) {
        return;
      }

      const childData = this.treeData2[0].children;
      const index = childData.indexOf(chkData);
      processItem = processItem.replaceAll(chkData.PROCESSID + ",", "");

      if (index > 0 && index < childData.length - 1) {
        this.$refs.alertPop.show("", "가운데 공정은 삭제가 불가능합니다.");
        return false;
      }
      if (index > -1) {
        childData.splice(index, 1);
      }
    },

    //조회버튼
    // async searchBtn(data) {
    //   this.routeChangeCheck = false;
    //   //lotID 없을경우
    //   if (this.lotid == "") {
    //     this.$refs.alertPop.show("", "Lot을 선택 후 조회하세요.");
    //     this.selectPopup = true;
    //     return false;
    //   }
    //   const result = await this.getGridsData(); // lot 정보 체크
    //   this.selectedLot = data;

    //   if (result) {
    //     if (this.treeData2.length > 0) {
    //       this.treeData2[0].children.splice(this.checkTreeData);
    //     }
    //     // lot 새로 조회하였고, lot 정보가 있을때만.
    //     this.RoutingData = [];
    //     this.selectedLot = data;
    //     //this.searchBtn(this.gridData)
    //   }
    // },
    async searchBtn(data) {
      if (data) {
        this.reSetPage = true;
        this.selectedLot = data;
        this.$refs.lotid.textVal = data.LOTID;
        this.lotid = data.LOTID;
        await this.getGridData(this.lotInfoGet) //
          .then(res => {
            if (!res) {
              this.alertCallBack = () => {};
              // this.$refs.alertPop.show(
              //   '',
              //   '존재하지 않는 Lot입니다. LotID를 확인해 주시기 바랍니다.'
              // );
              return false;
            }
          });
        this.getGridData(this.lotProcessHistoryGet);
        this.getGridData(this.reworkInformationListGet);
      } else {
        console.log(this.selectedLot);
        if (this.selectedLot) {
          return;
        }
        // this.$refs.alertPop.show('', 'Lot을 선택 후 조회하세요');
        this.alertCallBack = () => {
          this.$refs.searchLot.$listeners.click();
        };
      }
      const result = await this.getGridsData(); // lot 정보 체크
      this.selectedLot = data;

      if (result) {
        if (this.treeData2.length > 0) {
          this.treeData2[0].children.splice(this.checkTreeData);
        }
        // lot 새로 조회하였고, lot 정보가 있을때만.
        this.RoutingData = [];
        this.selectedLot = data;
        //this.searchBtn(this.gridData)
      }
    },
    //라우팅변경버튼
    routeChangeBefore() {
      if (this.gridData.length === 0) {
        this.$refs.alertPop.show("", "Lot ID 선택 후 조회하세요.");
        return false;
      } else {
        this.$refs["confirmPop"].title = "Info";
        this.$refs["confirmPop"].message =
          "재진행 정보 라우팅 변경시 현재 설정된" +
          "<br><br>" +
          "재진행 정보가 초기화 됩니다." +
          "<br><br>" +
          " 진행하시겠습니까?";
        this.$refs["confirmPop"].callBack = this.routeChangeBtn;
        this.$refs["confirmPop"].modalWidth = "330px";
        this.$refs["confirmPop"].visibleDialog = true;
      }
    },
    routeChangeBtn() {
      this.routeSearchModalVisible = true;
    },

    //저장버튼
    saveBefore() {
      if (this.treeData2[0] == undefined) {
        this.$refs.alertPop.show("", "재작업 할 공정을 선택해주세요.");
        return false;
      } else {
        saveData = this.gridData
          .filter((x) => x.LOTID === this.lotid)
          .map((x) => {
            return {
              ...x,
              _ROWSTATUS: x.rowStat,
              STARTPROCESSSEQUENCE:
                this.treeData2[0].children[0].PROCESSSEQUENCE,
              CHANGEPROCESSROUTEID:
                this.treeData2[0].children[0].PROCESSROUTEID,
              REASONPROCESSSEQUENCE: this.selectedReasonProcessSeq,
              REASONCODE: this.selectedReasonCode,
              ENDPROCESSSEQUENCE:
                this.treeData2[0].children.at(-1).PROCESSSEQUENCE,
              REASONCODETYPE: "REWORK",
            };
          });
        this.$refs["confirmPop2"].title = "저장";
        this.$refs["confirmPop2"].message =
          "Lot : " +
          this.lotid +
          "<br><br>" +
          "시작공정 : " +
          this.treeData2[0].children[0].PROCESSNAME +
          "<br><br>" +
          "종료공정 : " +
          this.treeData2[0].children.at(-1).PROCESSNAME +
          "<br><br>" +
          "사유코드 : " +
          this.selectedReasonCode +
          "<br><br>" +
          "원인공정 : " +
          this.selectedReasonProcess +
          "<br><br>" +
          "Rework 하시겠습니까?";
        this.$refs["confirmPop2"].callBack = this.saveBtn;
        this.$refs["confirmPop2"].modalWidth = "330px";
        this.$refs["confirmPop2"].visibleDialog = true;
      }
    },

    saveBtn() {

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnLotRework",
          sendParam: saveData,
        }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === "0") {
              this.$refs.alertPop.show("알림", "저장되었습니다.");
              //this.getGridData();
              this.selectedReasonProcess = "";
              this.searchBtn();
            } else if(this.treeData[0].children[0] === undefined){
              this.$refs.alertPop.show("알림", "기존에 등록된 공정이 없습니다.");
            } 
            else {
              this.$refs.alertPop.show(
                "ERROR : " + result.code,
                result.message
              );
            }
          });
        });
      }
    },

    //검색창
    searchInputValSet(nm, val) {
      this[nm] = val;
      this.search();
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },

    selectLotId(data) {
      this.lotid = data.LOTID;
      this.$nuxt.$emit("iccReset");
      //this.searchBtn();
    },

    //tree 데이터클릭
    onItemClick(e) {
      this.checkTreeData = e.item;
    },
    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },

    //원인공정 그리드 클릭
    reasonProcessClick(event) {
      this.selectedReasonProcess = event.dataItem.PROCESSID;
      this.selectedReasonProcessSeq = event.dataItem.PROCESSSEQUENCE;
    },
    //사유코드 그리드 클릭
    reasonCodeClick(event) {
      this.selectedReasonCode = event.dataItem.DESCRIPTION;
    },
    //Comment Text
    textAreaChange(e) {
      this.comment = e.value;
    },
    popupRouteData(data) {
      this.routeChangeCheck = true;
      this.RoutingData = [];
      this.treeData2 = [];
      this.RoutingData.push(data);
      this.initTree2();
    },

    async initTree2() {
      let res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetModelingDetailProcessList",
        sendParam: {
          processrouteid: this.RoutingData[0].PROCESSROUTEID,
          plantid: "LS",
        },
        queryVersion: "00002",
      });

      res = res.map((x, idx) => {
        return {
          ...x,
          icon: x.PROCESSSTATUS ? null : "PROCESS",
        };
      });

      res.unshift({
        LOTID: "",
        PROCESSID: this.RoutingData[0].PROCESSROUTEID,
        PROCESSNAME: "ReworkRoute",
        PROCESSROUTEID: "",
        PROCESSDESC: "", // PROCESSROUTETYPENAME
        PROCESSSEQUENCE: "1",
        PROCESSCOMPLETESTATUS: "",
        PROCESSSTATUS: "PROCESSROUTE",
        icon: "PROCESSROUTE",
        PLANTID: "LS",
      });
      const data = res.map((x) => ({ ...x, expanded: true }));

      this.treeData2 = utils2.makeTreeData(data, "PROCESSID", "PROCESSROUTEID");
    },
    //Lot상세보기
    popDetailView() {
      this.selectedLot = this.gridData[0];
      this.$refs.detailView.show("Lot 상세보기");
    },
  },
};
</script>
<style lang="scss" scoped>
@media (max-width: 1267px) {
  .divList1 {
    height: 300px !important;
  }
  .divList2 {
    height: 282px !important;
  }
}
</style>
