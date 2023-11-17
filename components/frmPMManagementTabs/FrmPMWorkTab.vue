<template>
  <div :style="{ height: '100%' }">
    <v-row :style="{ height: '100%' }">
      <v-col :sm="12" :lg="3" :class="'divList1'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row>
              <v-col cols="12" align="left">
                <CardTitle>PM일정목록</CardTitle>
              </v-col>
            </v-row>
            <v-row class="grid-tf-option" no-gutters>
              <v-col col="12" align="left">
                <div class="inline-flex-wrap">
                  <div class="form-chk">
                    <Checkbox
                      ref="pmEstimatedDay"
                      :value="true"
                      :dataNm="'pmEstimatedDay'"
                      :required="true"
                      :defaultchecked="pmEstimatedDayCheck"
                      @checkbox-set="pmEstimatedDayCheckValSet"
                    >
                    </Checkbox>
                    <label>PM 예정일</label>
                  </div>
                  <div class="form-datepicker">
                    <DatePicker
                      ref="pmScheduleDate"
                      :default-value="new Date()"
                      :dataNm="'pmScheduleDate'"
                      :format="'yyyy-MM-dd'"
                      :disabled="pmScheduleDateDisabled"
                      @change="pmScheduleDateChange"
                    />
                  </div>
                </div>
              </v-col>
            </v-row>
            <div ref="divWrapper1" :style="{ height: 'calc(100% - 80px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :isPaging="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                @sortChangeHandler="sortChangeHandler"
                @gridrowclick="onRowClick"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :sm="12" :lg="9" :class="'divList2'" :style="{ height: '100%' }">
        <Card ref="gridCard2" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row>
              <v-col cols="6" align="left">
                <CardTitle>설비이력목록</CardTitle>
              </v-col>
              <v-col ref="btnArea" cols="6" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  :disabled="startBtnDisabled"
                  @click="startBtn"
                  >PM시작</Button
                >
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  :disabled="endBtnDisabled"
                  @click="endBtn"
                  >PM종료</Button
                >
              </v-col>
            </v-row>
            <v-row class="grid-tf-option" no-gutters>
              <v-col col="8" align="left">
                <div class="inline-flex-wrap">
                  <div class="form-chk">
                    <Checkbox
                      ref="historyChk"
                      :value="true"
                      :dataNm="'historyChk'"
                      :required="true"
                      :defaultchecked="equipmentHisCheck"
                      @checkbox-set="equipmentHisCheckValSet"
                    ></Checkbox>
                    <label>설비이력</label>
                  </div>
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
              </v-col>
              <v-col ref="btnArea" cols="4" align="right">
                <Button
                  :theme-color="'secondary'"
                  :size="'medium'"
                  :disabled="cancelBtnDisabled"
                  @click="cancelBtn"
                  >PM작업취소</Button
                >
              </v-col>
            </v-row>
            <div
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
                @sortChangeHandler="sortChangeHandler2"
                @gridrowclick="onRowClick2"
                @headerselectionchange="onHeaderSelectionChange2"
              />
            </div>
            <div class="detail-area">
              <div class="left-area">
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
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>PM구분</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputPmType"
                      :boxWidth="'100%'"
                      :dataNm="'intputPmType'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputPmType"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="area-th">
                    <label>PM일정</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputPmSchedule"
                      :boxWidth="'100%'"
                      :dataNm="'intputPmSchedule'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputPmSchedule"
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
                    <label>PM상태</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputPmState"
                      :boxWidth="'100%'"
                      :dataNm="'intputPmState'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputPmState"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
                <div class="area-form">
                  <div class="area-th">
                    <label>작업일시</label>
                  </div>
                  <div class="area-td area-full">
                    <!-- 3칸 : area-full -->
                    <inputText
                      ref="intputWorkDateYYYYMMDD"
                      :dataNm="'intputWorkDateYYYYMMDD'"
                      :readonly="workDateReadonly"
                      :defaultValue="intputWorkDateYYYYMMDD"
                      @input-text-set="searchInput"
                      style="width: 100px"
                    />
                    <inputText
                      ref="intputWorkDateHHMMSS"
                      :dataNm="'intputWorkDateHHMMSS'"
                      :readonly="workDateReadonly"
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
                    <label>관리자</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputManager"
                      :boxWidth="'100%'"
                      :dataNm="'intputManager'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputManager"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="area-th">
                    <label>작업자</label>
                  </div>
                  <div class="area-td">
                    <inputText
                      ref="intputWorker"
                      :dataNm="'intputWorker'"
                      :disabled="false"
                      :readonly="true"
                      :defaultValue="intputWorker"
                      @input-text-set="searchInput"
                      style="width: calc(100% - 39px)"
                    />
                    <Button
                      :theme-color="'secondary'"
                      :class="'btn-form'"
                      :disabled="workSearchBtnDisabled"
                      @click="($event) => (searchUserModalVisible = true)"
                      >...</Button
                    >
                  </div>
                </div>
              </div>
              <div class="right-area">
                <div class="area-form" style="height: 138px">
                  <div class="area-th">
                    <label>지시사항</label>
                  </div>
                  <div class="area-td">
                    <TextArea
                      :auto-size="false"
                      :rows="5"
                      :readonly="instructionsTextAreaReadonly"
                      v-model="instructionsTextArea"
                    />
                  </div>
                </div>
                <div class="area-form" style="height: 184px">
                  <div class="area-th">
                    <label>작업결과</label>
                  </div>
                  <div class="area-td">
                    <TextArea
                      :auto-size="false"
                      :rows="5"
                      :readonly="opResultTextAreaReadonly"
                      v-model="opResultTextArea"
                    />
                  </div>
                </div>
              </div>
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
    <SelectUser
      ref="SelectUser"
      v-if="searchUserModalVisible"
      :visibleDialog="searchUserModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="(val) => (searchUserModalVisible = val)"
      @workuserid="workuserid"
    />
    <SetDescription
      ref="SetDescription"
      v-if="setDescriptionModalVisible"
      :visibleDialog="setDescriptionModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="(val) => (setDescriptionModalVisible = val)"
      @setComment="setComment"
    />
    <!-- @workuserid="workuserid" -->
  </div>
</template>
<script>
  import mixinGlobal from "@/mixin/global.js";
  import InputText from "@/components/common/input/InputText";
  import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
  import Utility from "~/plugins/utility";
  import KendoGrid from "@/components/common/KendoGrid"
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import { Button } from "@progress/kendo-vue-buttons";
  import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
  import { DatePicker } from "@progress/kendo-vue-dateinputs";
  import { TextArea } from "@progress/kendo-vue-inputs";
  import Checkbox from "@/components/common/input/Checkbox";
  import SelectUser from "@/components/frmPMManagementTabs/SelectUser";
  import SetDescription from "@/components/frmPMManagementTabs/SetDescription";
  
  let myTitle;
  let myMenuId;
  const d = new Date();
  let year = d.getFullYear(); // 년
  let month = d.getMonth();   // 월
  let day = d.getDate();      // 일
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
      menuId : myMenuId,
      closable: true
    },
    components: {
      Utility,
      Card,
      Button,
      CardBody, 
      CardTitle,
      KendoGrid,
      InputText,
      MesVariableSelectBox,
      DatePicker,
      TextArea,
      Checkbox,
      SelectUser,
      SetDescription
    },
    props:{
      viewParam:{
        lotid:"",
        productid:"",
        fromdete:"",
        todate:"",
        setYYYYMM:"",
        equipmentId:"",
        btnFlagPMWork:"",
        startPMData:[],
      }
    },
    data() {
      return {
        gridHeader: [],
        gridData : [],
        gridOriData : [],
        gridHeader2: [],
        gridData2 : [],
        gridOriData2 : [],
        gridDropDownList:[{
        }],
        selectedField: 'selected',
        selectedField2: 'selected',
        intputEquipmentId : "",
        intputEquipmentCode : "",
        intputEquipmentName : "",
        intputEquipmentType : "",
        intputDetailType : "",
        intputPmType: "",
        intputPmCycle : "",
        intputPmSchedule: "",
        intputPmState: "",
        intputManager:"",
        intputWorker:"",
        opResultTextArea:"",
        instructionsTextArea:"",
        intputLatelyPreservation : "",
        intputWorkDateYYYYMMDD : "",
        intputWorkDateHHMMSS : "",
        intputNowStatus : "",
        intputReasonCode : "",
        intputReasonCodeName : "",
        textAreaData: "",
        headerParam: {
          gridid: "dgvPMList", // 그리드 ID
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
        stateobject: "",
        pmScheduleDate: Utility.setFormatDate(new Date(), "YYYYMMDD"),
        workFromDate: Utility.setFormatDate(workFromDate.toLocaleDateString(), 'YYYY-MM-DD'),
        workToDate: Utility.setFormatDate(new Date(), "YYYYMMDD"),
        inputcol:["STATE", "STATENAME"],
        inputcol2:["STATE", "STATENAME"],
        defaultvalue:"",
        gridHeight:"",
        gridHeight2:"",
        // pmEstimatedDay:"",
        // historyChk:"",
        workDateReadonly: false,
        startBtnDisabled: false,
        endBtnDisabled: false,
        cancelBtnDisabled: false,
        workSearchBtnDisabled: false,
        instructionsTextAreaReadonly: false,
        equipmentHisCheck: true,
        pmEstimatedDayCheck: false,
        searchUserModalVisible: false,
        setDescriptionModalVisible: false,
        opResultTextAreaReadonly: false,
        pmScheduleId: "",
        disabledCheckHeaderArr: ['ACTIVESTATE_BOM'],
        pmScheduleDateDisabled: true,
      };
    },
    created() {
    },
    async mounted() {
        // this.gridHeight = (this.$refs.contents.offsetHeight * 0.8) +'px';
        // this.gridHeight2 = (this.$refs.contents.offsetHeight * 0.38) +'px';
        await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper1);
        await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
        // this.$refs.comboArea.sendParam.stateobject = this.sparepart;  
        // this.$refs.comboArea.sendParam.stateobject = this.changeStatus;
        // this.$refs.comboArea2.sendParam.stateobject = this.sparepart;
        // this.sparepart = this.$refs.comboArea.value;
        // this.$refs['pmEstimatedDay'].chkValue =  true ;
        // this.$refs['historyChk'].chkValue = true;
        
        // console.log("조회조건YYYYMM:::::::::::", this.viewParam.setYYYYMM);
        this.getGridData(this.viewParam.setYYYYMM);
        
    },
    computed: {
      areAllSelected() {
        return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
      },
    },
    watch: {
    },
    methods: {
      //PM시작 버튼클릭
      startBtn() {
        // this.getGridData();
        // console.log("=========== PM시작 버튼클릭 ============");
        this.visibleDialog = !this.visibleDialog;
        this.$refs['confirmPop'].title = "Info";
        this.$refs['confirmPop'].message = "PM작업을 시작하시겠습니까?";
        this.$refs['confirmPop'].callBack = this.saveStart;
        this.$refs['confirmPop'].modalWidth = "300px";
        this.$refs['confirmPop'].visibleDialog = true;
        
      },
      // PM종료 버튼클릭
      endBtn() {
        // console.log("=========== PM종료 버튼클릭 ============");
        this.visibleDialog = !this.visibleDialog;
        this.$refs['confirmPop'].title = "Info";
        this.$refs['confirmPop'].message = "PM작업을 종료하시겠습니까?";
        this.$refs['confirmPop'].callBack = this.saveEnd;
        this.$refs['confirmPop'].modalWidth = "300px";
        this.$refs['confirmPop'].visibleDialog = true;
      },
      // PM작업취소 버튼클릭
      cancelBtn() {
        // console.log("=========== PM작업취소 버튼클릭 ============");
        this.visibleDialog = !this.visibleDialog;
        this.$refs['confirmPop'].title = "Info";
        this.$refs['confirmPop'].message = "PM작업을 정말 취소하시겠습니까?";
        this.$refs['confirmPop'].callBack = this.cancelModalFunction;
        this.$refs['confirmPop'].modalWidth = "300px";
        this.$refs['confirmPop'].visibleDialog = true;
        
      },
      saveEnd (commentData) {
        // console.log("saveEnd  ::::::::::");
        let eventTime = this.intputWorkDateYYYYMMDD.replaceAll('-', '') + this.intputWorkDateHHMMSS.replaceAll(':', ''); // 작업일시
        // console.log("eventTime::::::::::", eventTime);
        const saveData = this.gridData.filter(x => x.PMSCHEDULEID == this.pmScheduleId)
        .map(x => {
          return { 
            workresult: this.opResultTextArea,
            eventtime: eventTime,
            workcomment: this.instructionsTextArea,
            pmscheduleid : x.PMSCHEDULEID, // PM스케줄ID
            plantid: "LS",
            _rowstatus: "",
            equipmentid: x.EQUIPMENTID,
            workeruserid:this.intputWorker,

          }
        });
        // console.log("saveEnd data ::::::::", saveData);
        if(saveData.length > 0) {
          const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnEquipmentPMEnd",
            sendParam: saveData
            
          }).then((result) => {
          this.$nextTick(() => {
              if (result.returncode !== undefined && result.returncode === "0") {
                // this.inputBoxReset(); // 우측 정보창 클리어시키기 위함
                this.$refs.alertPop.show("Info", "저장되었습니다.");
                this.getGridData(this.viewParam.setYYYYMM);
              } else {
                this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
              }
            })
          })
        }
      },
      cancelModalFunction() {
        this.setDescriptionModalVisible = true;
      },
      saveCancel (commentData) {
        // console.log("saveCancel comment data ::::::::::", commentData);
        const saveData = this.gridData.filter(x => x.PMSCHEDULEID == this.pmScheduleId)
        .map(x => {
          return { 
            comment: commentData, // 취소사유 팝업 TextArea 값
            equipmentstate: x.EQUIPMENTSTATE, // 설비상태
            pmscheduleid : x.PMSCHEDULEID, // PM스케줄ID
            plantid: "LS",
            _rowstatus:"",
            equipmentid: x.EQUIPMENTID
          }
        });
        // console.log("saveCancel save data ::::::::", saveData);
        if(saveData.length > 0) {
          const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnEquipmentPMCancel",
            sendParam: saveData
            
          }).then((result) => {
          this.$nextTick(() => {
              if (result.returncode !== undefined && result.returncode === "0") {
                // this.inputBoxReset(); // 우측 정보창 클리어시키기 위함
                this.$refs.alertPop.show("Info", "저장되었습니다.");
                this.getGridData(this.viewParam.setYYYYMM);
              } else {
                this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
              }
            })
          })
        }

        
      },

      // 저장버튼 클릭
      saveStart(){
        // console.log("저장시::::::::", this.intputEquipmentCode);
        // console.log("저장시::::::::", this.textAreaData);
        // console.log("시간::::::::", this.intputWorkDateYYYYMMDD.replaceAll('-', '') + this.intputWorkDateHHMMSS.replaceAll(':', '')); // replaceAll('-', '')
        
        const saveData = this.gridData.filter(x => x.PMSCHEDULEID == this.pmScheduleId)
        .map(x => {
          return { 
            _rowstatus: "",
            workresult : this.opResultTextArea, // 작업결과
            eventtime: this.intputWorkDateYYYYMMDD.replaceAll('-', '') + this.intputWorkDateHHMMSS.replaceAll(':', ''), // 작업일시
            workcomment: this.instructionsTextArea, // 지시사항
            pmscheduleid : x.PMSCHEDULEID, // PM스케줄ID
            plantid: "LS",
            equipmentid: this.intputEquipmentCode, // 설비코드 있음
            workeruserid: this.intputWorker, // 작업자
          }
        });
        // console.log("save data ::::::::", saveData);
        if(saveData.length > 0) {
          const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnEquipmentPMStart",
            sendParam: saveData
            
          }).then((result) => {
          this.$nextTick(() => {
              if (result.returncode !== undefined && result.returncode === "0") {
                // this.inputBoxReset(); // 우측 정보창 클리어시키기 위함
                this.$refs.alertPop.show("Info", "저장되었습니다.");
                this.getGridData(this.viewParam.setYYYYMM);
              } else {
                this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
              }
            })
          })
        }
      },
      
      nowDateBtn() {
        // 현재시간 버튼클릭
        this.intputWorkDateYYYYMMDD = Utility.setFormatDate(new Date(), "YYYY-MM-DD");
        this.intputWorkDateHHMMSS = Utility.setFormatDate(new Date(), "HH:mm:ss");
      },

      // clearBtn 클릭
      clearBtn() {
        // Clear 클릭시 사유코드 초기화
        this.intputReasonCode = ""; // 사유코드
        this.intputReasonCodeName = ""; // 사유코드명
      },
      
      //PM일정목록 데이터 가져오기
      async getGridData(yyyymmData, equipmentId, workeruserid, clickData) {
        // console.log("getGridData::props::btnFlagPMWork:::::::", this.viewParam.btnFlagPMWork);
        // console.log("getGridData::props::startPMData:::::::", this.viewParam.startPMData);
        // console.log("getGridData::props::startPMData:::::::", this.viewParam.startPMData.length);
        // console.log("this.workeruserid = ====", workeruserid);
        this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetPMScheduleList",
          sendParam: {
            plantid: "LS",
            yyyymm : yyyymmData,
            equipmentid: equipmentId,
            // workeruserid : workeruserid // 작업자는 쿼리에 막혀있음.
          }
        }).then((res) => {
          let data;
          if(workeruserid === "" || workeruserid === undefined){
            data = res
            .map((x, idx) => {
              if(this.viewParam.startPMData.length > 0) {
                if(x.PMSCHEDULEID === this.viewParam.startPMData[0].pmscheduleid){
                  return {
                  ...x,
                  rowStat: "N",
                  selected: true,
                  idx: idx,
                  inEdit: false,
                  newRow: false,
                  // equipmentid: this.intputEquipmentId,
                  // equipmentstate: this.sparepart
                  }
                }else{
                  return {
                    ...x,
                    rowStat: "N",
                    selected: false,
                    idx: idx,
                    inEdit: false,
                    newRow: false,
                    // equipmentid: this.intputEquipmentId,
                    // equipmentstate: this.sparepart
                  }
                }
              } else {
                return {
                    ...x,
                    rowStat: "N",
                    selected: false,
                    idx: idx,
                    inEdit: false,
                    newRow: false,
                    // equipmentid: this.intputEquipmentId,
                    // equipmentstate: this.sparepart
                  }
              }
            });
          } else {
            data = res
            .filter(x => x.WORKERUSERID === null ? null : workeruserid)
            .map((x, idx) => {
             if(this.viewParam.startPMData.length > 0) {
               if(x.PMSCHEDULEID === this.viewParam.startPMData[0].pmscheduleid){
                 return {
                 ...x,
                 rowStat: "N",
                 selected: true,
                 idx: idx,
                 inEdit: false,
                 newRow: false,
                 // equipmentid: this.intputEquipmentId,
                 // equipmentstate: this.sparepart
                 }
               }else{
                 return {
                   ...x,
                   rowStat: "N",
                   selected: false,
                   idx: idx,
                   inEdit: false,
                   newRow: false,
                   // equipmentid: this.intputEquipmentId,
                   // equipmentstate: this.sparepart
                 }
               }
             } else {
               return {
                   ...x,
                   rowStat: "N",
                   selected: false,
                   idx: idx,
                   inEdit: false,
                   newRow: false,
                   // equipmentid: this.intputEquipmentId,
                   // equipmentstate: this.sparepart
                 }
             }
           });
          }
          this.$nuxt.$emit('iccReset')
          this.gridOriData = data;
          this.gridData = data;

          if(this.viewParam.startPMData.length > 0) {
            this.inputAreaControll(this.viewParam.startPMData, "viewParamData");
          } else if (data.length > 0) {
            this.inputAreaControll(data, "gridData");
          } else {
            this.inputAreaControll();
          }
        })
    },
      async inputAreaControll (data, flag) {
        // console.log("input data :::::::", data);
        // console.log("input flag :::::::", flag);
        if(data.length > 0 && flag == "viewParamData") {
          this.intputEquipmentCode = data.equipmentid;  // 설비코드
          this.intputEquipmentName = data.equipmentname;  // 설비명 
          this.intputEquipmentType = data.equipmenttype;  // 설비구분
          this.intputDetailType = data.equipmenttypename; // 상세구분
          this.intputLatelyPreservation = data.lastmaintenancetime; // 최근보전
          this.intputNowStatus = data.equipmentstatename; // 현재상태
          this.intputPmType = data.pmscheduletypename;  // PM구분
          this.intputPmSchedule = data.pmplannedtime; //PM일정
          this.intputPmCycle = data.pmcyclevalue + data.pmcycletypename;  // PM주기
          this.intputPmState = data.pmstate;  // PM상태
          this.intputWorkDateYYYYMMDD = Utility.setFormatDate(new Date(), "YYYY-MM-DD");  // 작업일시 YYYY-MM-DD
          this.intputWorkDateHHMMSS = Utility.setFormatDate(new Date(), "HH:mm:ss");  // 작업일시 HH:mm:ss
          this.intputManager = data.manageruserid;  // 관리자
          this.intputWorker = data.workeruserid;  // 작업자
          this.instructionsTextArea = data.workcomment; //지시사항
          this.opResultTextArea = data.workresult;  //작업결과
          this.pmScheduleId = data.pmscheduleid; // PM스케줄ID
          
          this.getGridData2(data.equipmentid);
          
          // PM상태에 따른 input 및 버튼 비활성화
          if(data.pmstate == "완료") {
            this.workDateReadonly = true;
            this.instructionsTextAreaReadonly = true;
            this.startBtnDisabled = true;
            this.endBtnDisabled = true;
            this.cancelBtnDisabled = false;
            this.workSearchBtnDisabled = true;
            this.opResultTextAreaReadonly = true;
          } else if (data.pmstate == "미진행") {
            this.workDateReadonly = false;
            this.instructionsTextAreaReadonly = false;
            this.startBtnDisabled = false;
            this.endBtnDisabled = true;
            this.cancelBtnDisabled = true;
            this.workSearchBtnDisabled = false;
            this.opResultTextAreaReadonly = true;
            // this.$refs.dateArea.style.disabled = false;
          } else if (data.pmstate == "진행중") {
            this.workDateReadonly = true;
            this.instructionsTextAreaReadonly = true;
            this.startBtnDisabled = true;
            this.endBtnDisabled = false;
            this.cancelBtnDisabled = false;
            this.workSearchBtnDisabled = true;
            this.opResultTextAreaReadonly = false;
          }
        } else if (data.length > 0 && flag == "gridData") {
            this.$refs.btnArea.style.display = 'block';
            this.intputEquipmentCode = this.gridData[0].EQUIPMENTID;  // 설비코드
            this.intputEquipmentName = this.gridData[0].EQUIPMENTNAME;  // 설비명 
            this.intputEquipmentType = this.gridData[0].EQUIPMENTTYPE;  // 설비구분
            this.intputDetailType = this.gridData[0].EQUIPMENTTYPENAME; // 상세구분
            this.intputLatelyPreservation = this.gridData[0].LASTMAINTENANCETIME; // 최근보전
            this.intputNowStatus = this.gridData[0].EQUIPMENTSTATENAME; // 현재상태
            this.intputPmType = this.gridData[0].PMSCHEDULETYPENAME;  // PM구분
            this.intputPmSchedule = this.gridData[0].PMPLANNEDTIME; //PM일정
            this.intputPmCycle = this.gridData[0].PMCYCLEVALUE + this.gridData[0].PMCYCLETYPENAME;  // PM주기
            this.intputPmState = this.gridData[0].PMSTATE;  // PM상태
            this.intputWorkDateYYYYMMDD = Utility.setFormatDate(new Date(), "YYYY-MM-DD");  // 작업일시 YYYY-MM-DD
            this.intputWorkDateHHMMSS = Utility.setFormatDate(new Date(), "HH:mm:ss");  // 작업일시 HH:mm:ss
            this.intputManager = this.gridData[0].MANAGERUSERID;  // 관리자
            this.intputWorker = this.gridData[0].WORKERUSERID;  // 작업자
            this.instructionsTextArea = this.gridData[0].WORKCOMMENT; //지시사항
            this.opResultTextArea = this.gridData[0].WORKRESULT;  //작업결과
            this.pmScheduleId = this.gridData[0].PMSCHEDULEID; // PM스케줄ID
            
            this.getGridData2(this.gridData[0].EQUIPMENTID);
            
            // PM상태에 따른 input 및 버튼 비활성화
            if(this.gridData[0].PMSTATE == "완료") {
              this.workDateReadonly = true;
              this.instructionsTextAreaReadonly = true;
              this.startBtnDisabled = true;
              this.endBtnDisabled = true;
              this.cancelBtnDisabled = false;
              this.workSearchBtnDisabled = true;
              this.opResultTextAreaReadonly = true;
            } else if (this.gridData[0].PMSTATE == "미진행") {
              this.workDateReadonly = false;
              this.instructionsTextAreaReadonly = false;
              this.startBtnDisabled = false;
              this.endBtnDisabled = true;
              this.cancelBtnDisabled = true;
              this.workSearchBtnDisabled = false;
              this.opResultTextAreaReadonly = true;
              // this.$refs.dateArea.style.disabled = false;
            } else if (this.gridData[0].PMSTATE == "진행중") {
              this.workDateReadonly = true;
              this.instructionsTextAreaReadonly = true;
              this.startBtnDisabled = true;
              this.endBtnDisabled = false;
              this.cancelBtnDisabled = false;
              this.workSearchBtnDisabled = true;
              this.opResultTextAreaReadonly = false;
            }
          } else if (data !== null && data !== undefined && flag == "rowClick") {
            this.intputEquipmentCode = data.EQUIPMENTID;  // 설비코드
            this.intputEquipmentName = data.EQUIPMENTNAME;  // 설비명 
            this.intputEquipmentType = data.EQUIPMENTTYPE;  // 설비구분
            this.intputDetailType = data.EQUIPMENTTYPENAME; // 상세구분
            this.intputLatelyPreservation = data.LASTMAINTENANCETIME; // 최근보전
            this.intputNowStatus = data.EQUIPMENTSTATENAME; // 현재상태명
            this.intputPmType = data.PMSCHEDULETYPENAME;  // PM구분
            this.intputPmSchedule = data.PMPLANNEDTIME; //PM일정
            this.intputPmCycle = data.PMCYCLEVALUE + data.PMCYCLETYPENAME;  // PM주기
            this.intputPmState = data.PMSTATE;  // PM상태
            this.intputWorkDateYYYYMMDD = Utility.setFormatDate(new Date(), "YYYY-MM-DD");  // 작업일시 YYYY-MM-DD
            this.intputWorkDateHHMMSS = Utility.setFormatDate(new Date(), "HH:mm:ss");  // 작업일시 HH:mm:ss
            this.intputManager = data.MANAGERUSERID;  // 관리자
            this.intputWorker = data.WORKERUSERID;  // 작업자
            this.instructionsTextArea = data.WORKCOMMENT; //지시사항
            this.opResultTextArea = data.WORKRESULT;  //작업결과
            this.pmScheduleId = data.PMSCHEDULEID; // PM스케줄ID
            // console.log("스케줄ID:::::::", this.pmScheduleId);
            
            // PM상태에 따른 input 및 버튼 비활성화
            if(data.PMSTATE == "완료") {
                this.workDateReadonly = true;
                this.instructionsTextAreaReadonly = true;
                this.startBtnDisabled = true;
                this.endBtnDisabled = true;
                this.cancelBtnDisabled = false;
                this.workSearchBtnDisabled = true;
                this.opResultTextAreaReadonly = true;
            } else if (data.PMSTATE == "미진행") {
              this.workDateReadonly = false;
              this.instructionsTextAreaReadonly = false;
              this.startBtnDisabled = false;
              this.endBtnDisabled = true;
              this.cancelBtnDisabled = true;
              this.workSearchBtnDisabled = false;
              this.opResultTextAreaReadonly = true;
              // this.$refs.dateArea.style.disabled = false;
            } else if (data.PMSTATE == "진행중") {
              this.workDateReadonly = true;
              this.instructionsTextAreaReadonly = true;
              this.startBtnDisabled = true;
              this.endBtnDisabled = false;
              this.cancelBtnDisabled = false;
              this.workSearchBtnDisabled = true;
              this.opResultTextAreaReadonly = false;
            }
  
            this.getGridData2(data.EQUIPMENTID);
          } else {
            this.intputEquipmentCode = "";  // 설비코드
            this.intputEquipmentName = "";  // 설비명 
            this.intputEquipmentType = "";  // 설비구분
            this.intputDetailType = ""; // 상세구분
            this.intputLatelyPreservation = ""; // 최근보전
            this.intputNowStatus = ""; // 현재상태
            this.intputPmType = "";  // PM구분
            this.intputPmSchedule = ""; //PM일정
            this.intputPmCycle = "";  // PM주기
            this.intputPmState = "";  // PM상태
            this.intputWorkDateYYYYMMDD = "";  // 작업일시 YYYY-MM-DD
            this.intputWorkDateHHMMSS = "";  // 작업일시 HH:mm:ss
            this.intputManager = "";  // 관리자
            this.intputWorker = "";  // 작업자
            this.instructionsTextArea = ""; //지시사항
            this.opResultTextArea = "";  //작업결과
            this.pmScheduleId = ""; // PM스케줄ID
            this.gridData2 = [];
            this.$refs.btnArea.style.display = 'none';
        }
      },
      //그리드2 데이터 가져오기
      async getGridData2(intputEquipmentId) {
        // console.log("intputEquipmentId:::::::::", intputEquipmentId);
        // console.log("todate:::::::::",this.workToDate);
        // console.log("fromdate:::::::::",this.workFromDate.replaceAll('-', ''));
        let equipmentHisToDate;
        let equipmentHisFromDate;
        // console.log("CHK::::::::", this.equipmentHisCheck);
        if (this.equipmentHisCheck == true) {
          equipmentHisToDate = this.workToDate;
          equipmentHisFromDate = this.workFromDate.replaceAll('-', '');
        }
        // console.log("TO::::", equipmentHisToDate);
        // console.log("FROM::::", equipmentHisFromDate);
        
        this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetEquipmentHistory",
          sendParam: {
            plantid: "LS",
            equipmentid : intputEquipmentId,
            todate: equipmentHisToDate,
            fromdate: equipmentHisFromDate
          }
        }).then((res) => {
           const data = res.map((x, idx) => {
            return {
              ...x,
              rowStat: "N",
              selected: false,
              idx: idx,
              inEdit: true,
              newRow: false
            }
          });
          // console.log("data22 ====== ", data)
          this.$nuxt.$emit('iccReset')
          this.gridOriData2 = data;
          this.gridData2 = data;
        })
      },

      inputAreaDataSet(data) {

      },

      //그리드 로우 클릭
      onRowClick (event) {
        // console.log("===========onRowClick==============", event)
        // console.log("startPM:::::btnFlagPMWork:::::::", this.viewParam.btnFlagPMWork);
        // console.log("startPM::::::startPMData::::::", this.viewParam.startPMData);
        // if (this.viewParam.btnFlagPMWork == "startPM") {
        //   let e = this.viewParam.startPMData;
        //   this.row = { ...e[0] };
        //   this.gridData.forEach(
        //     (item) => (item.selected = item.PMSCHEDULEID === e.pmscheduleid)
        //   );
        //   this.selected = e.dataItem;  
        // } else {
          this.row = { ...event.dataItem };
          // console.log("this.row::::::", this.row);
          this.gridData.forEach(
            (item) => (item.selected = item.idx === event.dataItem.idx)
          );
          this.selected = event.dataItem;
          const equipmentid = event.dataItem.EQUIPMENTID;
          const rowStat = event.dataItem.rowStat;

          if (equipmentid != "" && rowStat == "N") {
            // const intputEquipmentId = event.dataItem.EQUIPMENTID;
            // // this.getGridData2(intputEquipmentId);
            this.inputAreaControll(event.dataItem, "rowClick");
          }
      },
      onRowClick2 (event) {
        // console.log("===========onRowClick2==============")
        this.row = { ...event.dataItem };
        this.gridData2.forEach(
          (item) => (item.selected = item.idx === event.dataItem.idx)
        );
        this.selected = event.dataItem;
        //그리드 로우 클릭시 라인표시 유무 확인필요
        // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
        // const reasoncodetype = event.dataItem.REASONCODETYPEID;
        // this.getGridData2(reasoncodetype);
      },
      //맨앞 checkBox 클릭
      onSelectionchange (event) {
        // console.log("===========onSelectionchange==============")
      },
      //header checkbox 클릭
      onHeaderSelectionChange (event) {
        // console.log("===========onHeaderSelectionChange==============")
        // let checked = event.event.target.checked;
        // this.gridData = this.gridData2.map((item) => {
        //   return { ...item, selected: checked };
        // });
      },
      onHeaderSelectionChange2 (event) {
        // console.log("===========onHeaderSelectionChange==============")
        // let checked = event.event.target.checked;
        // this.gridData = this.gridData2.map((item) => {
        //   return { ...item, selected: checked };
        // });
      },
  
        //검색 인풋
        searchInput(nm, val) {
            this[nm] = val;
        },
        comboChange(nm, val){
            //콤보체인지
            // console.log("콤보체인지nm:::::::",nm);
            // console.log("콤보체인지val:::::::",val);
        },
        toChange(e) {
            this.workToDate = Utility.setFormatDate(e.value, "YYYYMMDD");
        },
        fromChange(e) {
            this.workFromDate = Utility.setFormatDate(e.value, "YYYYMMDD");
        },
        pmScheduleDateChange (e) {
          this.pmScheduleDate = Utility.setFormatDate(e.value, "YYYYMMDD");
          this.pmEstimatedDayCheckValSet("", true);
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
        },
        pmEstimatedDayCheckValSet(nm, val){
          // console.log("pmEstimatedDayCheckValSet::::nm::::", nm);
          // console.log("pmEstimatedDayCheckValSet::::val::::", val);
          // console.log("this.pmScheduleDate::::", this.pmScheduleDate);
          // console.log("this.gridData::::", this.gridData);
          if (val === true) {
            this.pmScheduleDateDisabled = false;
            this.gridData = this.gridOriData.filter((x) => Utility.setFormatDate(x.PMPLANNEDTIME, "YYYYMMDD") == this.pmScheduleDate);
            if(this.gridData.length > 0) {
              this.inputAreaControll(this.gridData, "gridData");
            } else {
              this.inputAreaControll(this.gridData, "gridData");
              // this.gridData2 = [];
            }
          } else {
            this.pmScheduleDateDisabled = true;
            this.gridData = this.gridOriData;
            if(this.gridData.length > 0) {
              this.inputAreaControll(this.gridData, "gridData");
            } else {
              this.inputAreaControll(this.gridData, "gridData");
              // this.gridData2 = [];
            }
          }
        },
        equipmentHisCheckValSet(nm, val){
          // console.log("equipmentHisCheckValSet::::nm::::", nm);
          // console.log("equipmentHisCheckValSet::::val::::", val);
          if (val === true) {
            this.equipmentHisCheck = true;
          } else {
            this.equipmentHisCheck = false;
          }
          // this[nm] = val ? "Released" :'';
        },
        //그리드 더블 클릭
        rowdblclick(data){
          this.intputWorker = data.USERID;
        },
        workuserid (data) {
          // console.log("workuserid data:::::::::", data);
          // console.log("workuserid data:::::::::", data.USERID);
          this.intputWorker = data.USERID;
        },
        setComment (data) {
          // console.log("comment data :::::::", data);
          
          this.saveCancel(data);
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
        }
    }
  };
  
  const defaultData = {
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