<template>
    <div>
        <span v-if="!visibleDialog">
            <Button @click="toggleDialog">Open Dialog</Button>
        </span>
        <Dialog
            v-if="visibleDialog"
            title="PMDetail"
            width="822px"
            height="628px"
            @close="toggleDialog"
        >
            <v-row :style=" { margiBottom: '10px', width:'100%'}">
                <v-col :sm="12" :lg="12" align="left" :style="{ width:'100%'}">
                    <v-row class="search-box" align="center" no-gutters :style="{ width:'100%', marginBottom: '10px', marginRight:'15px'}">
                        <v-col :sm="12" :lg="12" align="right">
                            <div :style="{float:'right'}">
                                <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="confirmWorker" >저장</Button>
                                <Button :theme-color="'primary'" :size="'medium'" icon="close"  @click="toggleDialog">닫기</Button>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row :style="{ marginLeft: '20px'}">
                        <div class="detail-area">
                            <div class="left-area">
                                <div ref="PMCodeArea">
                                    <div class="area-form">
                                        <div class="area-th">
                                            <label style="float: left; margin-top: 8px; margin-left: 27px;">PM코드</label>
                                        </div>
                                        <div class="area-td area-full">
                                            <inputText 
                                            :boxWidth="'100%'"
                                            :dataNm="'intputPMCode'"
                                            :disabled="false"
                                            :readonly="true"
                                            :defaultValue="intputPMCode"
                                            @input-text-set="searchInput"
                                            style="float: left; margin-right: 15px;" />
                                        </div>
                                    </div>
                                </div>
                                <div class="area-form">
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">설비코드</label>
                                    </div>
                                    <div class="area-td">
                                        <inputText 
                                        ref="intputEquipmentCode"
                                        :boxWidth="'85%'"
                                        :dataNm="'intputEquipmentCode'"
                                        :disabled="false"
                                        :readonly="true"
                                        :defaultValue="intputEquipmentCode"
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: -30px;" />
                                        <Button :theme-color="'primary'" :size="'small'" :icon="'add'" :disabled="selectEquipmentModalVisible" :style="{ width: '25px', float: 'left', marginTop:'5px' }" @click="$event => selectEquipmentModalVisible = true"></Button>
                                    </div>
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">설비명</label>
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
                                        style="float: left; margin-right: 15px;" />
                                    </div>
                                </div>
                                <div class="area-form">
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">설비구분</label>
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
                                        style="float: left; margin-right: 15px;" />
                                    </div>
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">상세구분</label>
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
                                        style="float: left; margin-right: 15px;" />
                                    </div>
                                </div>
                                <div class="area-form">
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">설비상태</label>
                                    </div>
                                    <div class="area-td">
                                        <inputText
                                        ref="intputEquipmentStatus"
                                        :boxWidth="'100%'" 
                                        :dataNm="'intputEquipmentStatus'"
                                        :disabled="false"
                                        :readonly="true"
                                        :defaultValue="intputEquipmentStatus" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: 15px;" />
                                    </div>
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">PM상태</label>
                                    </div>
                                    <div class="area-td">
                                        <inputText 
                                        ref="intputPMStatus" 
                                        :boxWidth="'100%'" 
                                        :dataNm="'intputPMStatus'" 
                                        :disabled="false"
                                        :readonly="true"
                                        :defaultValue="intputPMStatus" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: 15px;" />
                                    </div>
                                </div>
                                <div class="area-form">
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">PM주기</label>
                                    </div>
                                    <div class="area-td">
                                        <inputText ref="intputPmCycle" 
                                        :boxWidth="'100%'" 
                                        :dataNm="'intputPmCycle'" 
                                        :disabled="false"
                                        :readonly="true"
                                        :defaultValue="intputPmCycle" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: 15px;" />
                                    </div>
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">PM구분</label>
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
                                        style="float: left; margin-right: 15px;" />
                                    </div>
                                </div>
                                <div class="area-form">
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">최근PM</label>
                                    </div>
                                    <div class="area-td area-full">
                                        <inputText 
                                        ref="intputRecentPMYYYYMMDD" 
                                        :boxWidth="'100%'" 
                                        :dataNm="'intputRecentPMYYYYMMDD'" 
                                        :disabled="false"
                                        :readonly="true"
                                        :defaultValue="intputRecentPMYYYYMMDD" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: 5px; width: 100px;" />
                                        <inputText 
                                        ref="intputRecentPMHHmmss" 
                                        :boxWidth="'100%'" 
                                        :dataNm="'intputRecentPMHHmmss'"
                                        :disabled="false"
                                        :readonly="true"
                                        :defaultValue="intputRecentPMHHmmss" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: 5px; width: 95px;" />
                                    </div>
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">PM일정</label>
                                    </div>
                                    <div class="area-td area-full">
                                        <inputText 
                                        ref="intputPmScheduleYYYYMMDD" 
                                        :boxWidth="'100%'" 
                                        :dataNm="'intputPmScheduleYYYYMMDD'" 
                                        :readonly="readonlyPmScheduleYYYYMMDD"
                                        :defaultValue="intputPmScheduleYYYYMMDD" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: 5px; width: 100px;" />
                                        <inputText 
                                        ref="intputPmScheduleHHmmss" 
                                        :boxWidth="'100%'" 
                                        :dataNm="'intputPmScheduleHHmmss'"
                                        :readonly="readonlyPmScheduleHHmmss" 
                                        :defaultValue="intputPmScheduleHHmmss" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: 5px; width: 95px;" />
                                    </div>
                                </div>
                                <div class="area-form">
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">PM시작</label>
                                    </div>
                                    <div class="area-td area-full">
                                        <inputText 
                                        ref="intputPmStartYYYYMMDD" 
                                        :boxWidth="'100%'" 
                                        :dataNm="'intputPmStartYYYYMMDD'"
                                        :disabled="false"
                                        :readonly="true"
                                        :defaultValue="intputPmStartYYYYMMDD" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: 5px; width: 100px;" />
                                        <inputText 
                                        ref="intputPmStartHHmmss" 
                                        :boxWidth="'100%'" 
                                        :dataNm="'intputPmStartHHmmss'"
                                        :disabled="false"
                                        :readonly="true"
                                        :defaultValue="intputPmStartHHmmss" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: 5px; width: 95px;" />
                                    </div>
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">PM완료</label>
                                    </div>
                                    <div class="area-td area-full">
                                        <inputText 
                                        ref="intputPmEndYYYYMMDD" 
                                        :boxWidth="'100%'" 
                                        :dataNm="'intputPmEndYYYYMMDD'"
                                        :disabled="false"
                                        :readonly="true"
                                        :defaultValue="intputPmEndYYYYMMDD" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: 5px; width: 100px;" />
                                        <inputText 
                                        ref="intputPmEndHHmmss" 
                                        :boxWidth="'100%'" 
                                        :dataNm="'intputPmEndHHmmss'"
                                        :disabled="false"
                                        :readonly="true"
                                        :defaultValue="intputPmEndHHmmss" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: 5px; width: 95px;" />
                                    </div>
                                </div>
                                <div class="area-form">
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">관리자</label>
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
                                        style="float: left; margin-right: 15px;" />
                                    </div>
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">작업자</label>
                                    </div>
                                    <div class="area-td">
                                        <inputText 
                                        ref="intputWorker" 
                                        :boxWidth="'85%'" 
                                        :dataNm="'intputWorker'" 
                                        :disabled="false"
                                        :readonly="true"
                                        :defaultValue="intputWorker" 
                                        @input-text-set="searchInput"
                                        style="float: left; margin-right: -30px;" />
                                        <Button :theme-color="'primary'" :size="'small'" :icon="'add'" :disabled="workSearchBtnDisabled" :style="{ width: '25px', float: 'left', marginTop:'5px' }" @click="$event => searchUserModalVisible = true"></Button>
                                    </div>
                                </div>
                                <div class="area-form" :style="{height: '110px'}">
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">지시사항</label>
                                    </div>
                                    <div class="area-td">
                                        <TextArea 
                                        :auto-size="false" 
                                        :rows="5"
                                        :disabled="false"
                                        :readonly="false"
                                        v-model="instructionsTextArea"
                                        style="width: 100%; float: left; margin-right: 15px; border: 1px solid black;"/>
                                    </div>
                                    <div class="area-th">
                                        <label style="float: left; margin-top: 5px; margin-right: 5px;">작업결과</label>
                                    </div>
                                    <div class="area-td">
                                        <TextArea 
                                        :auto-size="false" 
                                        :rows="5"
                                        :disabled="false"
                                        :readonly="true"
                                        v-model="opResultTextArea" 
                                        style="width: 100%; float: left; margin-right: 15px; border: 1px solid black;" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </v-row>
                </v-col>
            </v-row>
        </Dialog>
        <AlertPop 
        ref="alertPop" 
        :is="'alertPop'"
        :callBack="() => selectEquipmentModalVisible = true" 
        />
        <ConfirmPop 
        ref="confirmPop" 
        :is="'confirmPop'" 
        :visibleDialog="false" 
        :callBack="() => { }" 
        />
        <SelectUser 
        ref="SelectUser" 
        v-if="searchUserModalVisible" 
        :visibleDialog="searchUserModalVisible" 
        :title="'title'"
        :message="'message'" 
        :callBack="() => { }" @visibleDialog="(val) => searchUserModalVisible = val"
        @rowdblclick="rowdblclick"
        @workuserid="workuserid" 
        />
        <SelectEquipmentModal
        ref="SelectEquipmentModal"
        v-if="selectEquipmentModalVisible"
        :visibleDialog="selectEquipmentModalVisible"
        title="Select Equipment"
        :inputVal="inputVal"
        :checkHeaderArr="checkHeaderArr"
        @visibleDialog="(val) => (selectEquipmentModalVisible = val)"
        @selectedRow="selectedRow"
        />
    </div>
</template>
<script>
  import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
  import { Button } from "@progress/kendo-vue-buttons";
  import mixinGlobal from "@/mixin/global.js";
  import InputText from "@/components/common/input/InputText";
  import SelectUser from "@/components/frmPMManagementTabs/SelectUser";
  import SelectEquipmentModal from "@/components/frmPMManagementTabs/PMDetailSelectEquipmentModal";
  import Utility from "~/plugins/utility";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import {TextArea} from '@progress/kendo-vue-inputs';
  
    export default { 
        name: "SetDescriptionModal",
        mixins: [mixinGlobal],
        components: {
        Dialog,
        DialogActionsBar,
        Button,
        InputText,
        SelectUser,
        Utility,
        SelectEquipmentModal,
        Card,
        CardBody,
        CardTitle,
        TextArea
        },
        props:{
            visibleDialog: {
                type: Boolean,
                default: false,
            },
            callBack: {
                type: Function,
                default: () => true
            },
            rightClickPlanData:[],
            btnFlag:"",
            
        },
        data() {
        return {
            checkHeaderArr: ["ACTIVESTATE"],
            inputVal: "",
            intputPMCode: "",   // PM코드 (수정때만 나타남)
            intputEquipmentCode : "",   // 설비코드
            intputEquipmentName : "",   // 설비명
            intputEquipmentType : "",   // 설비구분  
            intputDetailType : "",  // 상세구분
            intputEquipmentStatus: "",  // 설비상태
            intputPMStatus: "", // PM상태
            intputPmCycle : "", // PM주기
            intputPmType: "",   // PM구분
            intputRecentPMYYYYMMDD: "", // 최근PM 년 월 일
            intputRecentPMHHmmss: "",   // 최근PM 시 분 초
            intputPmScheduleYYYYMMDD: "",   // PM일정 년 월 일
            intputPmScheduleHHmmss:"",    // PM일정 시 분 초
            intputPmStartYYYYMMDD: "",  // PM시작 년 월 일
            intputPmStartHHmmss: "",    // PM시작 시 분 초
            intputPmEndYYYYMMDD:"", // PM완료 년 월 일
            intputPmEndHHmmss:"",   // PM완료 시 분 초
            intputManager:"",   // 관리자
            intputWorker:"",    // 작업자
            instructionsTextArea:"", // 지시사항
            opResultTextArea:"",    // 작업결과
            workSearchBtnDisabled: false,
            searchUserModalVisible: false,
            selectEquipmentModalVisible: false,
            readonlyPmScheduleYYYYMMDD: true,
            readonlyPmScheduleHHmmss: true,
            pmscheduleId:"",
            rowStatus: "",
        }
        },
        computed: {
            userInfo: (state) => state.$session.get('userInfo'),
            
            
        },
        async mounted() {
            if (this.btnFlag == "C") {
                this.$refs.PMCodeArea.style.display = "none";
            } else if (this.btnFlag == "U") {
                this.$refs.PMCodeArea.style.display = "block";
            }

            // this.rightClickPlanData 데이터로 inputBox 세팅
            this.setInputBox(this.rightClickPlanData, this.btnFlag);
        },
        methods: {
            setInputBox (inputData, btnFlag) {
                console.log("inputData::::::", inputData[0].nowDate); //추가용 날짜
                console.log("btnFlag::::::", btnFlag);
                console.log("수정용 데이터:::::::", this.rightClickPlanData[0]);
                this.rowStatus = btnFlag;
                
                if (btnFlag == "C") {
                    this.readonlyPmScheduleHHmmss = false;
                    this.intputManager = this.userInfo.userId;
                    this.intputPmType = "Modeling";
                    
                    if (inputData[0].nowDate == "undefined" || inputData[0].nowDate == "" || inputData[0].nowDate == null) {
                        this.intputPmScheduleYYYYMMDD =  inputData[0].dt;
                    } else {
                        this.intputPmScheduleYYYYMMDD =  Utility.setFormatDate(inputData[0].nowDate, "YYYY-MM-DD");
                    }
                    this.intputPmScheduleHHmmss =  Utility.setFormatDate("000000", "HH:mm:ss");

                } else if (btnFlag == "U") {
                    this.readonlyPmScheduleYYYYMMDD = false;
                    this.readonlyPmScheduleHHmmss = false;

                    // this.rightClickPlanData[0] // 수정시 인풋박스 세팅
                    this.intputPMCode               = this.rightClickPlanData[0].pmscheduleid;   // PM코드 (수정때만 나타남)
                    this.intputEquipmentCode        = this.rightClickPlanData[0].equipmentid;   // 설비코드
                    this.intputEquipmentName        = this.rightClickPlanData[0].equipmentname;   // 설비명
                    this.intputEquipmentType        = this.rightClickPlanData[0].equipmenttype;   // 설비구분  
                    this.intputDetailType           = this.rightClickPlanData[0].equipmentdetailtype;  // 상세구분
                    this.intputEquipmentStatus      = this.rightClickPlanData[0].equipmentstate;  // 설비상태
                    this.intputPMStatus             = this.rightClickPlanData[0].pmstate; // PM상태
                    this.intputPmCycle              = this.rightClickPlanData[0].pmcyclevalue + this.rightClickPlanData[0].pmcycletype; // PM주기
                    this.intputPmType               = this.rightClickPlanData[0].pmscheduletype;   // PM구분
                    this.intputRecentPMYYYYMMDD     = Utility.setFormatDate(this.rightClickPlanData[0].lastmaintenancetime,"YYYY-MM-DD"); // 최근PM 년 월 일
                    this.intputRecentPMHHmmss       = Utility.setFormatDate(this.rightClickPlanData[0].lastmaintenancetime,"HH:mm:ss");   // 최근PM 시 분 초
                    this.intputPmScheduleYYYYMMDD   = Utility.setFormatDate(this.rightClickPlanData[0].pmplannedtime,"YYYY-MM-DD");   // PM일정 년 월 일
                    this.intputPmScheduleHHmmss     = Utility.setFormatDate(this.rightClickPlanData[0].pmplannedtime,"HH:mm:ss");    // PM일정 시 분 초
                    this.intputPmStartYYYYMMDD      = Utility.setFormatDate(this.rightClickPlanData[0].pmstarttime,"YYYY-MM-DD");  // PM시작 년 월 일
                    this.intputPmStartHHmmss        = Utility.setFormatDate(this.rightClickPlanData[0].pmstarttime,"HH:mm:ss");    // PM시작 시 분 초
                    this.intputPmEndYYYYMMDD        = Utility.setFormatDate(this.rightClickPlanData[0].pmendtime,"YYYY-MM-DD"); // PM완료 년 월 일
                    this.intputPmEndHHmmss          = Utility.setFormatDate(this.rightClickPlanData[0].pmendtime,"HH:mm:ss");   // PM완료 시 분 초
                    this.intputManager              = this.rightClickPlanData[0].manageruserid;   // 관리자
                    this.intputWorker               = this.rightClickPlanData[0].workeruserid;    // 작업자
                    this.instructionsTextArea       = this.rightClickPlanData[0].workcomment;   // 지시사항
                    this.opResultTextArea           = this.rightClickPlanData[0].workresult;    // 작업결과
                }
            },

            // 설비검색에서 선택한 데이터 세팅
            selectedRow(modalSelectData) {
                console.log("설비검색 rowData:::::::", modalSelectData);
                this.intputEquipmentCode = modalSelectData.EQUIPMENTID;   // 설비코드
                this.intputEquipmentName = modalSelectData.EQUIPMENTNAME;   // 설비명
                this.intputEquipmentType = modalSelectData.EQUIPMENTTYPE;   // 설비구분  
                this.intputDetailType = modalSelectData.EQUIPMENTDETAILTYPE;  // 상세구분
                this.intputEquipmentStatus = modalSelectData.EQUIPMENTSTATE;  // 설비상태
                this.intputPMStatus = ""; // PM상태
                if (modalSelectData.PMCYCLEVALUE != null && modalSelectData.PMCYCLEVALUE != "") {
                    this.intputPmCycle = modalSelectData.PMCYCLEVALUE + modalSelectData.PMCYCLETYPE; // PM주기
                } else {
                    this.intputPmCycle = ""; // PM주기
                }
                this.intputPmType= "Modeling";   // PM구분
                this.intputRecentPMYYYYMMDD= Utility.setFormatDate(modalSelectData.LASTMAINTENANCETIME, "YYYY-MM-DD"); // 최근PM 년 월 일
                this.intputRecentPMHHmmss= Utility.setFormatDate(modalSelectData.LASTMAINTENANCETIME, "HH-mm-ss");   // 최근PM 시 분 초
                // PM일정 년 월 일 기본세팅됨
                // PM일정 시 분 초 기본세팅됨
                // PM시작 년 월 일 빈값
                // PM시작 시 분 초 빈값
                // PM완료 년 월 일 빈값
                // PM완료 시 분 초 빈값
                // this.intputManager= modalSelectData.LASTUPDATEUSERID;   // 관리자
                // 작업자는 팝업선택
                this.instructionsTextArea= modalSelectData.DESCRIPTION; // 지시사항
                // 작업결과 빈값
            },

            rowdblclick (data) {
                this.intputWorker = data.USERID;
            },
            workuserid (data) {
                console.log("workuserid data:::::::::", data);
                console.log("workuserid data:::::::::", data.USERID);
                this.intputWorker = data.USERID;
            },

            toggleDialog() {
                this.$emit('visibleDialog', !this.visibleDialog);
            },

            // 저장버튼 누르면 확인먼저
            confirmWorker () {
                //설비코드, 작업자 유무 판단, PM일정시간 판단
                let nowDate = Utility.setFormatDate(new Date(), "YYYYMMDDHHmmss");
                let pmDate = this.intputPmScheduleYYYYMMDD.replaceAll('-', '') + this.intputPmScheduleHHmmss.replaceAll(':', '');
                // console.log("nowDate::::::::::::", nowDate);
                // console.log("pmDate::::::::::::", pmDate);
                
                if (this.intputEquipmentCode == "" || this.intputEquipmentCode == null) {
                    this.$refs.alertPop.show("Info", "설비코드를 선택해 주십시오.");
                    this.$refs.alertPop.visibleDialog = true;
                } else if (this.intputWorker == "" || this.intputWorker == null) {
                    // this.visibleDialog = !this.visibleDialog;
                    this.$refs['confirmPop'].title = "Warning";
                    this.$refs['confirmPop'].message = "작업자를 선택하지 않았습니다. 그대로 저장하시겠습니까?";
                    this.$refs['confirmPop'].callBack = this.save;
                    this.$refs['confirmPop'].modalWidth = "300px";
                    this.$refs['confirmPop'].visibleDialog = true;
                } else if (pmDate < nowDate) {
                    // this.visibleDialog = !this.visibleDialog;
                    this.$refs['confirmPop'].title = "Warning";
                    this.$refs['confirmPop'].message = "PM일정시간이 현재시각 보다 작습니다.\n그래도 진행하시겠습니까?";
                    this.$refs['confirmPop'].callBack = this.save;
                    this.$refs['confirmPop'].modalWidth = "300px";
                    this.$refs['confirmPop'].visibleDialog = true;
                } else {
                    this.save();
                }
            },
            save() {
                let savePmDate = this.intputPmScheduleYYYYMMDD.replaceAll('-', '') + this.intputPmScheduleHHmmss.replaceAll(':', '');
                let saveData = [];
                saveData.push({
                    workcomment: this.instructionsTextArea,
                    pmplannedtime: savePmDate,
                    plantid: "LS",
                    pmscheduletype: this.intputPmType,
                    _rowstatus: this.rowStatus,
                    manageruserid: this.userInfo.userId,
                    equipmentid: this.intputEquipmentCode,
                    workeruserid: this.intputWorker
                });
                
                if ( this.rowStatus == "U" ) {  // 수정때만 PM코드가 있어서 하나 더 담아줌.
                    saveData[0].pmscheduleid = this.intputPMCode;
                }
                console.log("saveData:::::::", saveData);
                // 여기서 input박스 데이터를 담아서 스케쥴 탭으로 가져감.  추가, 수정 동일
                this.$emit('pmDetailSaveData', saveData, saveData[0]._rowstatus);
               
            },
            searchInput(nm, val){
                this[nm] = val;
            },
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