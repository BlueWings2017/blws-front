<template>
  <div :style="{ height: '100%' }">
    <v-row ref="contents" >
      <v-col :cols="12">
        <Card ref="gridCard" :style="{height:'100%'}">
          <CardBody :style="{height:'100%'}">
            <v-row no-gutters>
              <v-col cols="8" align="left">
                <CardTitle>공정별 이벤트목록</CardTitle>
              </v-col>
            </v-row>
            <div style="height: calc(100% - 33px)">
              <div id="dgvEventList" ref="divWrapper" :style="{ height: '100%' }">
                <KendoGrid 
                  ref="rowGrid"
                  v-if="gridShow"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="eventHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :gridDropDownList="gridDropDownList"
                  @gridrowclick="onRowClick"
                  @gridddchang="rowDdChange"
                  @griditemchange="griditemchange"
                  @gridButtonClick="gridButtonClick"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    <ConfirmPop
      ref="ConfirmPop"
    />
    <SelectParameterDataResult
      ref="TextAreaModal"
      v-if="textAreaModalVisible"
      :visibleDialog="textAreaModalVisible"
      title="공정조건"
      :rowInfo="rowInfo"
      @visibleDialog="(val) => textAreaModalVisible = val"
    />
    <OperSelectTime
      ref="OperSelectTime"
      v-if="operSelectTimeVisible"
      :visibleDialog="operSelectTimeVisible"
      :title="operSelectTimeTitle"
      :rowInfo="rowInfo"
      :EventName="EventName"
      :modealType="modealType"
      :defaultEquipment="defaultEquipment"
      @visibleDialog="(val) => operSelectTimeVisible = val"
      @equipmentReset="() => defaultEquipment = []"
      @saveData="saveData"
    />
    <StepSelectTime
      ref="StepSelectTime"
      v-if="stepSelectTimeVisible"
      :visibleDialog="stepSelectTimeVisible"
      :rowInfo="rowInfo"
      :EventName="EventName"
      @visibleDialog="(val) => stepSelectTimeVisible = val"
      @saveData="saveData"
    />
    <SelectInputValueSet
      ref="SelectInputValueSet"
      v-if="selectInputValueSetVisible"
      :visibleDialog="selectInputValueSetVisible"
      :rowInfo="rowInfo"
      :EventName="EventName"
      @visibleDialog="(val) => selectInputValueSetVisible = val"
      @saveData="saveData"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import TextAreaModal from "@/components/frmProcessRouteComposition/TextAreaModal";
import OperSelectTime from "@/components/frmProcessRouteEvent/OperSelectTime";
import StepSelectTime from "@/components/frmProcessRouteEvent/StepSelectTime";
import SelectInputValueSet from "@/components/frmProcessRouteEvent/SelectInputValueSet";
import SelectParameterDataResult from "@/components/frmProcessRouteEvent/SelectParameterDataResult";
import moment from "moment";

export default {
  name: "EventList",
  mixins: [mixinGlobal],
  components: {
    Card,
    Button,
    CardBody, 
    CardTitle,
    KendoGrid,
    TextAreaModal,
    OperSelectTime,
    StepSelectTime,
    SelectInputValueSet,
    SelectParameterDataResult
  },
  props:{
    gridHeight: {
      type: String,
      default: "600px"
    },
    gridOriData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      gridHeader: [],
      gridDropDownList:[{
        dataVal : 'PROCESSMODE',
        dataItem: []
      }],
      selectedField: 'selected',
      noFirstCheck: true,
      noRowstat: true,
      gridShow: true,
      textAreaModalVisible: false,
      operSelectTimeVisible: false,
      stepSelectTimeVisible: false,
      selectInputValueSetVisible: false,
      operSelectTimeTitle: "",
      rowInfo: {},
      EventName: "",
      cancelData: {},
      modealType: "",
      defaultEquipment: [],
      waitData: [],
    };
  },
  created() {
    // this.$nuxt.$on('changTab', () => {
    //   this.gridShow = false;
    //   this.$nextTick(() => {
    //     this.gridShow = true;
    //   })
    // });
  },
  async mounted() {
  },
  computed: {
    ...mapState({
      process: state => state.modules.frmRouteEvent.process,
      nowTab: state => state.modules.frmRouteEvent.nowTab,
      tabType: state => state.modules.frmRouteEvent.tabType,
      eventRowId: state => state.modules.frmRouteEvent.eventRowId,
      event: state => state.modules.frmRouteEvent.event,
      eventHeader: state => state.modules.frmRouteEvent.eventHeader,
      eventOrg: state => state.modules.frmRouteEvent.eventOrg,
      curProcess: state => state.modules.frmRouteEvent.curProcess,
      lotInfo: state => state.modules.frmRouteEvent.lotInfo,
    }),
    // ...mapGetters({
    //   getTodoById: "modules/frmRouteEvent/getTodoById",
    // }),
    gridData(){
      //하나의 LOTID에대해  sTimeKey 동일
      
      this.gridShow = false;
      const dtEvent = this.event[this.tabType]?.[this.eventRowId] || [];
      let detailData = [];
      if(dtEvent.length > 0 && !!this.process[this.nowTab]) {
        const status = this.process[this.nowTab].filter(x => x.PROCESSSTATUS == "O");
        if(status.length > 0 && this.curProcess == this.nowTab){
          if(this.tabType.indexOf("Main") > -1){
            const objs = Object.keys(this.event["Main"]).reduce((acc, cur, idx) => {
              acc.push(this.event["Main"][cur])
              return acc
            },[])
            detailData = objs.flat(1)
          }else{
            detailData = JSON.parse(JSON.stringify(dtEvent));
          }
        
          let sTimeKey = null;
          let sFlag = false;

          detailData.forEach((x, idx) => {
            if( x["CURRENTFLAG"] === "Y" ){
              sFlag = true;
            }
            if(sFlag){
              sFlag = false;
              for (var j = idx - 1; j > -1; j--) {
                if (detailData[j]["INPUTMODE"] != "RecipeParameter" 
                    && !!detailData[j]["RELATIONTIME"]
                    && detailData[j]["INPUTMODE"] != "OperationParameter") {
                  sTimeKey = detailData[j]["TIMEKEY"];
                  // console.log('sTimeKey ==> ', sTimeKey)
                  break;
                }
              }
            }
          });
  
          if (!sFlag) {
            const result = detailData.map((x, idx) => {
              x["ACTIONBUTTON"] = "";
              x["isButton"] = false;
              if(this.curProcess == this.nowTab){
                if(x["HOLDSTATE"] === "OnHold" && x["CURRENTFLAG"] === "Y"){
                  x["ACTIONBUTTON"] = "HOLD";
                  x["isButton"] = true;
                }else{
                  if(x["CURRENTFLAG"] == "Y" && x["INPUTMODE"] != "RecipeParameter" && x["INPUTMODE"] != "OperationParameter" ) {
                    x["ACTIONBUTTON"] = x["BUTTONNAME"];
                    x["isButton"] = true;
                  }else if( x["CURRENTFLAG"] == "Y" ) {
                    if( x["INPUTMODE"] == "RecipeParameter" || x["INPUTMODE"] == "OperationParameter" ) {
                      x["ACTIONBUTTON"] = x["BUTTONNAME"];
                      x["isButton"] = true;
                    }
                  }
                }
              }
  
              if (sTimeKey == x["TIMEKEY"]) {
                if (x["HOLDSTATE"] == "OnHold") {
                  x["ACTIONBUTTON"] = "HOLD";
                } else {
                  x["ACTIONBUTTON"] = "진행취소";
                }
              }
              if (sTimeKey == null) {
                if (dtEvent[dtEvent.length - 1]["TIMEKEY"] == detailData[detailData.length - 1]["TIMEKEY"] 
                    && !!dtEvent[dtEvent.length - 1]["RELATIONTIME"]) {
                  if ( dtEvent[dtEvent.length - 1]["HOLDSTATE"] == "OnHold" ) {
                    x["ACTIONBUTTON"] = "HOLD";
                  } else {
                    x["ACTIONBUTTON"] = "진행취소";
                  }
                }
              }
              return x
            });
            
            const filterRes = result.filter(x => {
              const key = `${x.PROCESSID}_${x.ROUTERELATIONSEQUENCE}`
              if(key === this.eventRowId){
                return x
              }
            })
            this.gridShow = true;
            // console.log(filterRes)
            return filterRes
          }else{
            this.gridShow = true;
            // console.log(dtEvent)
            return dtEvent
          }
        }else{
          this.gridShow = true;
          // console.log(dtEvent)
          return dtEvent
        }
      }else{
        // console.log("no DATA")
        this.gridShow = true;
        return []
      }
    }
  },
  methods: {
    ...mapActions({
    }),
    onRowClick (event) {
    },
    rowDdChange(e, name, dataItem){
    },
    griditemchange(e) {
    },
    chkOriginalData(gridData, idx){
    },
    selectedRow(row){
    },
    cancelRow(){
    },
    initGrid(){
      this.$nuxt.$emit('iccReset');
    },
    openAlert(title, message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    
    async gridButtonClick(e, field, dataItem){
      // console.log(e)
      // console.log(field)
      // console.log(JSON.stringify(dataItem))
      
      if(!!this.lotInfo.CARRIERID){
        const message = `현재 Lot은 ${this.lotInfo.CARRIERID}에 할당된 상태입니다. \n 
          할당을 해제하거나 ${this.lotInfo.CARRIERID} 클리어 후에 다시 시도해 주십시오`;
        this.openAlert("Warining", message)
        return;
      }

      const sActionType = dataItem.RECIPETYPENAME;
      
      if(sActionType == "공정조건"){
        //공정조건
        this.textAreaModalVisible = true //저장하는거 확인해야함
        this.rowInfo = dataItem;
      }else{
        let sEvent = "";
        if(dataItem[field] == "진행취소"){
          sEvent = "취소"
        }else if(dataItem[field] == "HOLD"){ //HOLD
          const sLotID = dataItem.LOTID;
          const dsReturn = await this.mesGet({
            apiKey: "mes/common/getqueryresult",
            queryId: "GetOMHoldInfo",
            sendParam: {plantid: "Ls",lotid: sLotID}
          });
          const sReason = dsReturn[0].REASONCODEDESC;
          const message = `현재 Lot: [${sLotID}]은 \n\n
            원인: [${sReason}]으로인해 HOLD상태 입니다. \n\n HOLD를 해제후 진행하세요.`;
          this.openAlert("Warining", message)
          return;
        }

        let sProcessID = dataItem["PROCESSID"]
        //진행이벤트
        if(dataItem["CURRENTFLAG"] == "Y"){
          //시작 버튼 클릭 -> OperSelectTime 팝업 -> 저장
          if( dataItem["INPUTMODE"] == "Operation" && dataItem["ACTIONTYPE"] == "Start" ){
            this.EventName = "TxnOperStart";
            /**
             * @OperSelectTime 팝업 띄우기
             */
            this.rowInfo = dataItem;
            const data = await this.mesGet({
              apiKey: "mes/common/getqueryresult",
              queryId: "GetAvailableEquipmentList",//GetAvailableEquipmentList
              sendParam: {
                plantid: "LS",
                equipmentid: "",
                processid: dataItem.PROCESSID,
                productid: this.lotInfo.PRODUCTID
              }
            });
            if(data.length > 0){
              this.waitData = data;
              if(!dataItem["EQUIPMENTID"] && dataItem["ACTIONTYPE"] == "Start" ){
                this.$refs.ConfirmPop.title = "확인"
                this.$refs.ConfirmPop.message = `현재공정 ${dataItem["PROCESSNAME"]}의 진행가능설비가 ${data[0].EQUIPMENTID}로 설정되어 있습니다. 선택하시겠습니까?`
                this.$refs.ConfirmPop.modalWidth = "330px";
                this.$refs.ConfirmPop.visibleDialog = true;
                this.$refs.ConfirmPop.callBack = this.isOperSelectTime2;
                this.$refs.ConfirmPop.callBack2 = this.isOperSelectTime;
              }
            }else{
              // this.operSelectTimeVisible = true;
              // this.operSelectTimeTitle = dataItem.ACTIONBUTTON;
              // this.rowInfo = dataItem;
              // this.modealType = "Start"
              this.isOperSelectTime()
            }
            if( this.rowInfo["CLOSEFLAG"] == "Close" ){
              // #TODO 저장 안하는듯 확인필요
              return;
            }


          }else if(dataItem["INPUTMODE"] == "Recipe"){
            if(dataItem["ACTIONTYPE"] == "Consumable"){
              this.EventName = "TxnConsumable";
              /**
               * @selectInputValueSet 팝업 띄우기
               */
              this.rowInfo = dataItem;
              this.selectInputValueSetVisible = true;
              console.log("TxnConsumable")
            }else{
              this.EventName = "TxnStepProcess";
              if(dataItem["ACTIONTYPE"] == "Packing"){ 
                //포장팝업 작업X 2023-03-10 구자윤 부장
                /**
                 * @frmLotPacking 팝업 띄우기
                 */
                if( this.rowInfo["CLOSEFLAG"] == "" ){
                  this.rowInfo["CLOSEFLAG"] = "Close";
                }                                    
              }else{
                this.$refs.ConfirmPop.title = "저장"
                this.$refs.ConfirmPop.message = `${sActionType}을 진행 ${sEvent} 하시겠습니까?`;
                this.$refs.ConfirmPop.modalWidth = "330px";
                this.$refs.ConfirmPop.visibleDialog = true;
                // callback => stepSelectTimeOpen
                this.$refs.ConfirmPop.callBack = this.stepSelectTimeOpen;
                this.rowInfo = dataItem;
                console.log("xxxxxxxxxxxxx")
              }
            }

            if( this.rowInfo["CLOSEFLAG"] == "Close" ){
              return;
            }

          }else if(dataItem["INPUTMODE"] == "Operation" && dataItem["ACTIONTYPE"] == "End"){
            this.EventName = "TxnOperEnd";
            
            /**
             * @OperSelectTime 팝업 띄우기
             */
            this.operSelectTimeVisible = true;
            this.operSelectTimeTitle = dataItem.ACTIONBUTTON;
            this.rowInfo = dataItem;
            this.modealType = "End"
            
          }
        }else{ 
          //진행 취소
          this.$refs.ConfirmPop.title = "취소"
          this.$refs.ConfirmPop.message = `${sActionType}을 진행 ${sEvent} 하시겠습니까?`;
          this.$refs.ConfirmPop.modalWidth = "330px";
          this.$refs.ConfirmPop.visibleDialog = true;
          this.$refs.ConfirmPop.callBack = this.cancelSave;
          this.cancelData = dataItem;
        }
      }
    },
    //진행취소 이벤트
    cancelSave(){
      if(this.cancelData["INPUTMODE"] == "Operation" && this.cancelData["ACTIONTYPE"] == "Start"){ //진행 취소
        this.EventName = "TxnOperStartCancel"
        // console.log("TxnOperStartCancel")
      }else if(this.cancelData["INPUTMODE"] == "Recipe"){
        if( this.cancelData["ACTIONTYPE"] == "Consumable" ){
          this.EventName = "TxnConsumableCancel";
        }else{
          this.EventName = "TxnStepProcessCancel";
        }
      }else if(this.cancelData["INPUTMODE"] == "Operation" && this.cancelData["ACTIONTYPE"] == "End"){
        this.EventName = "TxnOperEndCancel";
      }
      const obj = {eventName: this.EventName}
      this.rowInfo = this.cancelData;
      this.saveData(obj)
    },

      // EventName = "TxnOperStart"; ooo
      // EventName = "TxnOperEnd"; ooo 
      // EventName = "TxnOperStartCancel"; ooo
      // EventName = "TxnOperEndCancel"; ooo
      // EventName = "TxnConsumable"; ooo
      // EventName = "TxnStepProcess"; ooo
      // EventName = "TxnConsumableCancel" ooo
      // EventName = "TxnStepProcessCancel"; ooo
    async saveData({eventName, data}){
      // console.log(data)
      let saveObj = {}
      if(this.rowInfo.ROUTERELATIONSEQUENCE == "0"){
        this.rowInfo.ROUTERELATIONSEQUENCE = null;
      }

      if(eventName === "TxnOperStart"){
        saveObj = {...this.rowInfo, ...data, EVENTTIME: moment().format("yyyyMMDDHHmmss")};
      }else if(eventName === "TxnOperStartCancel"){
        saveObj = this.rowInfo;
      }else if(eventName === "TxnOperEnd"){
        saveObj = {...this.rowInfo, ...data, EVENTTIME: moment().format("yyyyMMDDHHmmss")};
      }else if(eventName === "TxnOperEndCancel"){
        saveObj = this.rowInfo;
      }else if(eventName === "TxnStepProcess"){
        saveObj = {...this.rowInfo, ...data, EVENTTIME: moment().format("yyyyMMDDHHmmss")};
      }else if(eventName === "TxnStepProcessCancel"){
        saveObj = this.rowInfo;
      }else if(eventName === "TxnConsumable"){
        saveObj = {...this.rowInfo, ...data};
      }else if(eventName === "TxnConsumableCancel"){
        saveObj = this.rowInfo;
      }
      
      const saveResult = await this.mesPost({
        apiKey: "mes/common/manage",
        messagename: eventName,
        sendParam: saveObj,
      });
      if(saveResult?.returncode == "0"){
        this.openAlert("저장", "저장되었습니다.")
        this.$nuxt.$emit('reSearch');
      }else{
        this.openAlert("오류", "이미 처리가 완료되었거나 처리 가능한 상태가 아닙니다. 현재 상태를 다시 한번 확인 후 진행해 주시기 바랍니다..")
        this.$nuxt.$emit('reSearch');
      }

    },
    stepSelectTimeOpen(){
      this.stepSelectTimeVisible = true;
      // console.log(JSON.stringify(this.rowInfo))
    },
    isOperSelectTime(){
      this.operSelectTimeVisible = true;
      this.operSelectTimeTitle = this.rowInfo.ACTIONBUTTON;
      this.rowInfo = this.rowInfo;
      this.modealType = "Start"
    },
    isOperSelectTime2(){
      this.defaultEquipment = JSON.parse(JSON.stringify(this.waitData));
      this.operSelectTimeVisible = true;
      this.operSelectTimeTitle = this.rowInfo.ACTIONBUTTON;
      this.rowInfo = this.rowInfo;
      this.modealType = "Start"
    }
  },
  watch: {
  },
};

</script>
<style lang="scss">

</style> 
