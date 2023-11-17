<template>
  <div ref="contents">
    <ol class="page-navigation">
      <li>홈</li>
      <li>설비관리</li>
      <li>설비상태 변경</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row>
              <v-col :sm="9" :lg="10" align="left">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>설비코드</label>
                    <inputText
                      ref="intputEquipmentId"
                      :boxWidth="'100%'"
                      :dataNm="'intputEquipmentId'"
                      :disabled="false"
                      :readonly="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <Label>설비상태</Label>
                    <MesVariableSelectBox
                      ref="comboArea"
                      :allYN="true"
                      :dataNm="'sparepart'"
                      :defaultvalue="defaultvalue"
                      :queryId="'GetStateDefinitionList'"
                      :sendParam="{
                        plantid: 'LS',
                        stateobject: 'Equipment',
                      }"
                      :inputcol=inputcol
                      @comboChange="sparepartComboChange"
                    ></MesVariableSelectBox>
                  </div>
                  <div class="form-group" style="display : none">
                    <Label>작업일자</Label>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="workToDate"
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
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                  >조회</Button
                >
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents" :style="{ height: '100%' }">
      <v-col :cols="12"  :style="{ height: 'calc(50% - 58px)' }">
        <Card ref="gridCard" :style="{ height : '100%'}">
            <CardBody :style="{width:'100%', height : '100%'}">
            <v-row>
              <v-col cols="12" align="left"> </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100%)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :isPaging="true"
                @gridrowclick="onRowClick"
                @sortChangeHandler="sortChangeHandler"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="12" :class="'divList2'" :style="{ height: 'calc(50% + 58px)' }">
        <Card ref="gridCard2" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="12" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  :icon="'save'"
                  @click="toggleDialog"
                  >저장</Button
                >
              </v-col>
            </v-row>
            <!-- <div
              ref="divWrapper2"
              :class="'divList3'"
              :style="{ height: 'calc(100% - 412px)' }"
              style="min-height: 213px"
            >
              <KendoGrid
                ref="rowGrid2"
                :gridHeight="gridHeight2"
                :gridItems="gridData2"
                :sortable="true"
                :columns="headerParam2.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField2"
                @gridrowclick="onRowClick2"
                @headerselectionchange="onHeaderSelectionChange2"
                @sortChangeHandler="sortChangeHandler2"
              />
            </div> -->
            <div class="detail-area">
              <div class="area-form">
                  <div class="area-th">
                    <label>설비코드</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputEquipmentCode"
                      :boxWidth="'100%'"
                      :dataNm="'intputEquipmentCode'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputEquipmentCode"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="area-th">
                    <label>설비명</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputEquipmentName"
                      :boxWidth="'100%'"
                      :dataNm="'intputEquipmentName'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputEquipmentName"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>설비구분</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputEquipmentType"
                      :boxWidth="'100%'"
                      :dataNm="'intputEquipmentType'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputEquipmentType"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="area-th">
                    <label>상세구분</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputDetailType"
                      :boxWidth="'100%'"
                      :dataNm="'intputDetailType'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputDetailType"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>PM주기</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputPmCycle"
                      :boxWidth="'100%'"
                      :dataNm="'intputPmCycle'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputPmCycle"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="area-th">
                    <label>최근보전</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputLatelyPreservation"
                      :boxWidth="'100%'"
                      :dataNm="'intputLatelyPreservation'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputLatelyPreservation"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>작업일시</label>
                  </div>
                  <div class="area-td area-full">
                    <inputText
                      ref="intputWorkDateYYYYMMDD"
                      :boxWidth="'100%'"
                      :dataNm="'intputWorkDateYYYYMMDD'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputWorkDateYYYYMMDD"
                      @input-text-set="searchInput"
                      style="width: 100px"
                    />
                    <inputText
                      ref="intputWorkDateHHMMSS"
                      :boxWidth="'100%'"
                      :dataNm="'intputWorkDateHHMMSS'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputWorkDateHHMMSS"
                      @input-text-set="searchInput"
                      style="width: 80px"
                    />
                    <Button
                      :theme-color="'secondary'"
                      :size="'medium'"
                      @click="nowDateBtn"
                      >현재일시</Button
                    >
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>현재상태</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputNowStatus"
                      :boxWidth="'100%'"
                      :dataNm="'intputNowStatus'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputNowStatus"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="area-th">
                    <label>변경상태</label>
                  </div>
                  <div class="area-td">
                    <DropDownList
                      ref="comboArea2"
                      :data-items="codeLists"
                      :text-field="'STATENAME'"
                      :value-field="'STATE'"
                      :value-primitive="true"
                      :default-value="intputAfterStatus"
                      v-model="intputAfterStatus"
                      @change="comboChange"
                    ></DropDownList>
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>사유코드</label>
                  </div>
                  <div class="area-td area-full">
                    <!-- 3칸 : area-full -->
                    <DropDownList
                      ref="comboArea3"
                      style="width: 265px"
                      :disabled="reasonDisable"
                      :data-items="gridData3"
                      :text-field="'DESCRIPTION'"
                      :value-field="'REASONCODE'"
                      :value-primitive="true"
                      :default-value="intputReasonCode"
                      v-model="intputReasonCode"
                      @change="reasonComboChange"
                    ></DropDownList>
                  </div>
                </div>
                <div class="area-form" style="display : none">
                  <div class="area-th">
                    <label>비고</label>
                  </div>
                  <div class="area-td area-full">
                    <TextArea
                      :style="{ height: '80px' }"
                      :auto-size="false"
                      :rows="5"
                      v-model="textAreaData"
                    />
                  </div>
                </div>
              <!-- <div ref="topAreaDivWrapper3" class="right-area" style="display: block; float: right; width: calc(40% - 5px) !important; ">
                <span class="i-msg" style="display: block; padding: 10px 0">※ 더블클릭하여 사유코드를 선택하세요.</span>
                <div ref="divWrapper3">
                  <KendoGrid
                    ref="rowGrid3"
                    :style="{ height: '330px' }"
                    :gridItems="gridData3"
                    :sortable="true"
                    :columns="headerParam3.gridHeader"
                    :resizable="true"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField3"
                    @selectionchange="onSelectionchange3"
                    @gridrowclick="onRowClick3"
                    @rowdblclick="rowdblclick3"
                    @headerselectionchange="onHeaderSelectionChange3"
                    @sortChangeHandler="sortChangeHandler3"
                  />
                </div>
              </div> -->
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
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import { TextArea } from "@progress/kendo-vue-inputs";

let myTitle;
let myMenuId;
const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth(); // 월
let day = d.getDate(); // 일
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
  components: {
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    DropDownList,
    MesVariableSelectBox,
    DatePicker,
    TextArea,
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true
    }
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      gridOriData: [],
      gridHeader2: [],
      gridData2: [],
      gridOriData2: [],
      gridHeader3: [],
      gridData3: [],
      gridOriData3: [],
      selectedField: "selected",
      selectedField2: "selected",
      selectedField3: "selected",
      intputEquipmentId: "",
      intputEquipmentCode: "",
      intputEquipmentName: "",
      intputEquipmentType: "",
      intputDetailType: "",
      intputPmCycle: "",
      intputLatelyPreservation: "",
      intputWorkDateYYYYMMDD: "",
      intputWorkDateHHMMSS: "",
      intputNowStatus: "",
      intputReasonCode: "",
      intputReasonCodeName: "",
      textAreaData: "",
      sparepartData:"",
      headerParam: {
        gridid: "dgvEquipmentStateChangeList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      headerParam2: {
        gridid: "dgvEquipmentHistory", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      headerParam3: {
        gridid: "dgvReasonCode", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      stateobject: "",
      workFromDate: Utility.setFormatDate(workFromDate.toLocaleDateString(),"YYYY-MM-DD"),
      workToDate: Utility.setFormatDate(new Date(), "YYYYMMDD"),
      inputcol: ["STATE", "STATENAME"],
      // inputcol2: ["STATE", "STATENAME"],
      codeLists:[],
      statusFlag:"",
      defaultvalue: "",
      intputAfterStatus: "",
      gridHeight: "",
      gridHeight2: "",
      gridHeight3: "",
      dropDownStatus:{},
      reasonDisable: false
    };
  },
  created() {},
  async mounted() {
    // this.gridHeight = this.$refs.contents.offsetHeight * 0.95 + "px";
    // this.gridHeight2 = this.$refs.contents.offsetHeight * 0.45 + "px";
    // this.gridHeight3 = this.$refs.contents.offsetHeight * 0.41 + "px";
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    //await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    //await this.getHeaderMulti(this.headerParam3, this.$refs.divWrapper3);
    
    // this.$refs.comboArea.sendParam.stateobject = this.changeStatus;
    // this.$refs.comboArea2.sendParam.stateobject = this.changeStatus;
    // this.comboList();
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
      //this.$refs.rowGrid2.sortField = [{}];
      //this.$refs.rowGrid3.sortField = [{}];
      this.getGridData();
      // this.getGridData2();
    },

    // 저장버튼 클릭
    saveBtn() {
      // console.log("저장시::::::::", this.intputEquipmentCode);
      // console.log("저장시::::::::", this.textAreaData);
      // console.log("변경상태:::::::", this.intputAfterStatus);
      let reasonCodeTypeData;
      if (this.intputAfterStatus == "Down") {
        reasonCodeTypeData = "EQP-DOWN";
      } else if (this.intputAfterStatus == "Hold") {
        reasonCodeTypeData = "EQP-HOLD";
      }

      const saveData = this.gridData
        .filter((x) => x.EQUIPMENTID == this.intputEquipmentCode)
        .map((x) => {
          return {
            ...x,
            _rowstatus: x.rowStat,
            comment: this.textAreaData, // 비고
            currentstate: this.intputNowStatus, // 현재상태
            reasoncode: this.intputReasonCode, // 사유코드 있음
            plantid: "LS",
            eventtime: this.intputWorkDateYYYYMMDD.replaceAll("-", "") + this.intputWorkDateHHMMSS.replaceAll(":", ""), // 작업일시
            changestate: this.intputAfterStatus, // 변경상태
            equipmentid: this.intputEquipmentCode, // 설비코드 있음
            reasoncodetype: reasonCodeTypeData, // 사유코드 타입 있음
            /* 
                저장신을하면되는데....
                파라미터를 잘 확인하고 저장하시오
                주의 YES or NO 팝업창 있음!!!!!확인하기
            */
          };
        });
      // console.log("save data ::::::::", saveData);
      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnEquipmentStateChange",
          sendParam: saveData,
        }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === "0") {
              this.inputBoxReset(); // 우측 정보창 클리어시키기 위함
              this.$refs.alertPop.show("알림", "저장되었습니다.");
              this.getGridData("R");
            } else {
              this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
            }
          });
        });
      }
    },

    nowDateBtn() {
      // 현재시간 버튼클릭
      this.intputWorkDateYYYYMMDD = Utility.setFormatDate(new Date(),"YYYY-MM-DD");
      this.intputWorkDateHHMMSS = Utility.setFormatDate(new Date(), "HH:mm:ss");
    },

    // clearBtn 클릭
    clearBtn() {
      // Clear 클릭시 사유코드 초기화
      this.intputReasonCode = ""; // 사유코드
      this.intputReasonCodeName = ""; // 사유코드명
    },
    //그리드1 데이터 가져오기
    async getGridData(re) {
      // console.log("this.$refs.comboArea:::::::::::", this.$refs.comboArea.value);
      // console.log(":::::::::::", this.inputcol);

      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEquipmentList",
        sendParam: {
          plantid: "LS",
          equipmentid: this.intputEquipmentId,
          equipmentstate: this.sparepartData === undefined ? "" : this.sparepartData,
        },
      }).then((res) => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: false,
            newRow: false,
            // equipmentid: this.intputEquipmentId,
            // equipmentstate: this.sparepart,
          };
        });
        // console.log("data ====== ", data[0]);
        // this.$nuxt.$emit("iccReset");
        this.gridOriData = data;
        this.gridData = data;

        if (re != "R") {
          if (this.intputEquipmentId == "") {
            this.getGridData2(data[0].EQUIPMENTID);
          } else {
            this.getGridData2(data[0].equipmentid);
          }
          // inputArea 박스들에 값넣어주기
          this.intputEquipmentCode = this.gridData[0].EQUIPMENTID;
          this.intputEquipmentName = this.gridData[0].EQUIPMENTNAME;
          this.intputEquipmentType = this.gridData[0].EQUIPMENTTYPE;
          this.intputDetailType = this.gridData[0].EQUIPMENTTYPENAME;
          this.intputPmCycle = this.gridData[0].PMCYCLEVALUE + "일";
          this.intputLatelyPreservation = this.gridData[0].LASTMAINTENANCETIME;
          this.intputWorkDateYYYYMMDD = Utility.setFormatDate(
            new Date(),
            "YYYY-MM-DD"
          );
          this.intputWorkDateHHMMSS = Utility.setFormatDate(
            new Date(),
            "HH:mm:ss"
          );
          this.intputNowStatus = this.gridData[0].EQUIPMENTSTATENAME;
          // 현재상태에 따라 셀박 바꿔주기
          this.statusFlag = this.gridData[0].EQUIPMENTSTATENAME;
          
          this.intputAfterStatus = this.gridData[0].EQUIPMENTSTATENAME;

          let changeState = "";
          if (
            this.gridData[0].EQUIPMENTSTATE == "PM" ||
            this.gridData[0].EQUIPMENTSTATE == "Down"
          ) {
            changeState = "Idle";
            this.intputAfterStatus = changeState;
            // this.$refs.topAreaDivWrapper3.style.display = "none";
            // this.$refs.divWrapper3.style.display = "none";
            this.reasonDisable = true;
          } else {
            changeState = "Down";
            this.intputAfterStatus = changeState;
            // this.$refs.topAreaDivWrapper3.style.display = "block";
            // this.$refs.divWrapper3.style.display = "block";
            this.reasonDisable = false;
          }
          //   console.log("STATUS::::", changeState);
          this.getGridData3(changeState);

        } else {
          let nowStatus = this.intputNowStatus;
          let afterStatus = this.intputAfterStatus;

          this.intputNowStatus = afterStatus; // 현재상태
          this.intputAfterStatus = nowStatus; // 변경상태
          // console.log("this.intputNowStatus:::::::", this.intputNowStatus);
          this.statusFlag = this.intputNowStatus;
          let changeState = "";
          if (
            this.intputAfterStatus == "PM" ||
            this.intputAfterStatus == "Idle" ||
            this.intputAfterStatus == "Run"
          ) {
            // this.intputAfterStatus = "Idle";
            // this.$refs.topAreaDivWrapper3.style.display = "none";
            // this.$refs.divWrapper3.style.display = "none";
            this.reasonDisable = true;
          } else {
            // this.intputAfterStatus = "Down";
            // this.$refs.topAreaDivWrapper3.style.display = "block";
            // this.$refs.divWrapper3.style.display = "block";
            this.reasonDisable = false;
            if (this.intputAfterStatus == "Down") {
              changeState = "EQP-DOWN";
            } else {
              changeState = "EQP-HOLD";
            }
          }

          this.getGridData2(this.intputEquipmentCode);
          this.getGridData3(changeState);
        }
      });
      // console.log("inputcol2::::::::", this.intputAfterStatus);
      // console.log("this.:::::::", this.intputNowStatus);
      
    },
    //그리드2 데이터 가져오기
    async getGridData2(intputEquipmentId) {
      // console.log("intputEquipmentId:::::::::", intputEquipmentId);
      // console.log("workToDate:::::::::", this.workToDate);
      // console.log("workFromDate:::::::::", this.workFromDate.replaceAll('-', ''));

      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEquipmentHistory",
        sendParam: {
          plantid: "LS",
          equipmentid: intputEquipmentId,
          todate: this.workToDate,
          fromdate: this.workFromDate.replaceAll("-", ""),
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
        // this.$nuxt.$emit("iccReset");
        this.gridOriData2 = data;
        this.gridData2 = data;
      });
    },
    //그리드3 데이터 가져오기
    async getGridData3(state) {
      // console.log("state:::::::::", state);

      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReasoncodeList",
        sendParam: {
          plantid: "LS",
          reasoncodetype: state,
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
        // console.log("data33 ====== ", data);
        // this.$nuxt.$emit("iccReset");
        this.gridOriData3 = data;
        this.gridData3 = data;
        
        if(this.gridData3.length > 0) {
          this.intputReasonCode = this.gridData3[0].REASONCODE;
        }
      });
      this.comboList();
    },
    async comboList() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetStateDefinitionList",
        sendParam: {
          plantid: "LS",
          stateobject: 'Equipment',
        },
      }).then((res) => {
        const data = res.map((x) => {
          return {
            STATE: x.STATE,
            STATENAME: x.STATENAME,
          };
        });
        // console.log("comboArea2List data ====== ", data);
        // console.log("nStatus ====== ", nStatus);
        if(this.statusFlag === "Idle") {
          this.codeLists = data.filter((y) => y.STATE !== "Idle");
        } else if(this.statusFlag === "PM") {
          this.codeLists = data.filter((y) => y.STATE === "Idle");
        } else if(this.statusFlag === "Hold") {
          this.codeLists = data.filter((y) => y.STATE === "Idle" || y.STATE === "Down");
        } else if(this.statusFlag === "Run") {
          this.codeLists = data.filter((y) => y.STATE === "Idle" || y.STATE === "Down" || y.STATE === "Hold");
        } else if(this.statusFlag === "Down") {
          this.codeLists = data.filter((y) => y.STATE === "Idle" || y.STATE === "PM");
        } else {
          this.codeLists = data;
        }
        // console.log("codeList::::==::", this.codeLists);
      });
    },

    //그리드 로우 클릭
    onRowClick(event) {
      // console.log("===========onRowClick==============");
      //그리드 로우 클릭시 라인표시 유무 확인필요
      // event.dataItem[this.selectedField] = event.dataItem[this.selectedField];
      const equipmentid = event.dataItem.EQUIPMENTID;
      const rowStat = event.dataItem.rowStat;
      this.intputReasonCode = "";
      this.intputReasonCodeName = "";
      if (equipmentid != "" && rowStat == "N") {
        const intputEquipmentId = event.dataItem.EQUIPMENTID;
        this.getGridData2(intputEquipmentId);

        // inputArea 박스들에 값넣어주기
        this.intputEquipmentCode = event.dataItem.EQUIPMENTID;
        this.intputEquipmentName = event.dataItem.EQUIPMENTNAME;
        this.intputEquipmentType = event.dataItem.EQUIPMENTTYPE;
        this.intputDetailType = event.dataItem.EQUIPMENTTYPENAME;
        this.intputPmCycle = event.dataItem.PMCYCLEVALUE + "일";
        this.intputLatelyPreservation = event.dataItem.LASTMAINTENANCETIME;
        this.intputWorkDateYYYYMMDD = Utility.setFormatDate(new Date(),"YYYY-MM-DD");
        this.intputWorkDateHHMMSS = Utility.setFormatDate(new Date(),"HH:mm:ss");
        this.intputNowStatus = event.dataItem.EQUIPMENTSTATE;
        this.statusFlag = event.dataItem.EQUIPMENTSTATE;

        let changeState = "";
        if (
          event.dataItem.EQUIPMENTSTATE == "PM" ||
          event.dataItem.EQUIPMENTSTATE == "Down"
        ) {
          changeState = "Idle";
          // this.statusFlag = changeState;
          this.intputAfterStatus = changeState;
          // this.$refs.topAreaDivWrapper3.style.display = "none";
          // this.$refs.divWrapper3.style.display = "none";
          this.reasonDisable = true;
        } else {
          changeState = "Down";
          // this.statusFlag = changeState;
          this.intputAfterStatus = changeState;
          // this.$refs.topAreaDivWrapper3.style.display = "block";
          // this.$refs.divWrapper3.style.display = "block";
          this.reasonDisable = false;
        }
        this.getGridData3(changeState);
        //그리드 selecte
        this.row = { ...event.dataItem };
        this.gridData.forEach(
          (item) => (item.selected = item.idx === event.dataItem.idx)
        );
        this.selected = event.dataItem;
        //   console.log("STATUS::::", changeState);
      }
    },
    onRowClick2(event) {
      // console.log("===========onRowClick2==============");
      //그리드 로우 클릭시 라인표시 유무 확인필요
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      // const reasoncodetype = event.dataItem.REASONCODETYPEID;
      // this.getGridData2(reasoncodetype);
      //그리드 selecte
      this.row = { ...event.dataItem };
      this.gridData2.forEach(
        (item) => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
    },
    onRowClick3(event) {
      // console.log("===========onRowClick3==============");
      //그리드 로우 클릭시 라인표시 유무 확인필요
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      //그리드 selecte
      this.row = { ...event.dataItem };
      this.gridData3.forEach(
        (item) => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
    },
    // 그리드 더블 클릭
    rowdblclick3(event) {
      // console.log("========= 더블클릭 그리드 3 =========");
      // console.log("event.dataItem:::::::::", event.dataItem);
      this.intputReasonCode = event.dataItem.REASONCODE;
      this.intputReasonCodeName = event.dataItem.DESCRIPTION;
      // this.fromData = event.dataItem;
      // this.SelectLotVisible = true;
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      // console.log("===========onSelectionchange==============");
    },
    onSelectionchange3(event) {
      // console.log("===========onSelectionchange==============");
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      const equipmentid = event.dataItem.EQUIPMENTID;
      const rowStat = event.dataItem.rowStat;
      if (equipmentid != "" && rowStat == "N") {
        const intputEquipmentId = event.dataItem.EQUIPMENTID;
        this.getGridData2(intputEquipmentId);
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
    onHeaderSelectionChange2(event) {
      // console.log("===========onHeaderSelectionChange==============");
      // let checked = event.event.target.checked;
      // this.gridData = this.gridData2.map((item) => {
      //   return { ...item, selected: checked };
      // });
    },
    onHeaderSelectionChange3(event) {
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
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter((x) => {
        return data[idx][x] !== this.gridOriData2[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    //검색 인풋
    searchInput(nm, val) {
      this[nm] = val;
    },
    sparepartComboChange (nm, val) {
      // console.log("콤보체인지nm:::::::", nm);
      // console.log("콤보체인지val:::::::", val);
      this.sparepartData = val;
    },
    comboChange(e, val) {
      //콤보체인지
      // console.log("콤보체인지nm:::::::", e);
      // console.log("콤보체인지val:::::::", e.value);
      this.intputAfterStatus = e.value;
      this.intputReasonCode = "";
      this.intputReasonCodeName = "";

      if (e.value == "PM" || e.value == "Idle" || e.value == "Run") {
        // this.$refs.topAreaDivWrapper3.style.display = "none";
        // this.$refs.divWrapper3.style.display = "none";
        this.reasonDisable = true;
      } else if (e.value == "Down") {
        // this.$refs.topAreaDivWrapper3.style.display = "block";
        // this.$refs.divWrapper3.style.display = "block";
        this.reasonDisable = false;
        let changeState = "";
        changeState = "EQP_DOWN";
        this.getGridData3(changeState);
      } else {
        // this.$refs.topAreaDivWrapper3.style.display = "block";
        // this.$refs.divWrapper3.style.display = "block";
        this.reasonDisable = false;
        let changeState = "";
        changeState = "EQP_HOLD";
        this.getGridData3(changeState);
      }
    },
    reasonComboChange (e, val) {
      // console.log("콤보체인지nm:::::::", nm);
      // console.log("콤보체인지val:::::::", val);
      this.intputReasonCode = e.value;
    },
    toChange(e) {
      this.workToDate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    fromChange(e) {
      this.workFromDate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },

    toggleDialog() {
      // this.visibleDialog = !this.visibleDialog;
      if (this.intputAfterStatus == "Down" && this.intputReasonCode == "") {
        this.$refs.alertPop.show("알림","사유입력이 필수 입니다. 사유를 선택해 주시기 바랍니다.");
      } else if (
        this.intputAfterStatus == "Hold" &&
        this.intputReasonCode == ""
      ) {
        this.$refs.alertPop.show("알림","사유입력이 필수 입니다. 사유를 선택해 주시기 바랍니다.");
      } else {
        this.$refs["confirmPop"].title = "Info";
        this.$refs["confirmPop"].message =
          "EquipmentID (" +
          this.intputEquipmentCode +
          ") 의 상태를<br/>" +
          "<br/>" +
          this.intputNowStatus +
          " -> " +
          this.intputAfterStatus +
          " 으로 변경하시겠습니까?";
        this.$refs["confirmPop"].callBack = this.saveBtn;
        this.$refs["confirmPop"].modalWidth = "300px";
        this.$refs["confirmPop"].visibleDialog = true;
      }
    },
    inputBoxReset() {
      // this.$refs.intputEquipmentCode.defaultValue = ""; // 설비코드
      // this.intputEquipmentCode = ""; // 설비코드
      // this.intputEquipmentName = ""; // 설비명
      // this.intputEquipmentType = ""; //설비구분
      // this.intputDetailType = ""; // 상세구분
      // this.intputPmCycle = ""; // PM주기
      // this.intputLatelyPreservation = ""; // 최근보전
      // this.intputWorkDateYYYYMMDD = ""; // 작업일시 YYYY-MM-DD
      // this.intputWorkDateHHMMSS = ""; // 작업일시 HH:MM:SS
      // this.intputNowStatus = ""; // 현재상태
      // this.intputAfterStatus = ""; // 변경상태
      this.intputReasonCode = ""; // 사유코드
      this.intputReasonCodeName = ""; // 사유코드명
      this.textAreaData = ""; // 비고
    },
    sortChangeHandler(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    },
    sortChangeHandler2(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.gridData2 = this.gridData2.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.gridData2 = this.gridData2.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    },
    sortChangeHandler3(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.gridData3 = this.gridData3.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.gridData3 = this.gridData3.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    }
  },
};

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