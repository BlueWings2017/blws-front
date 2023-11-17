<template>
  <div :style="{height : '100%'}">
    <v-row :style="{height : '100%'}">
      <v-col ref="gridArea" :cols="12" align="right">
          <!-- <v-col :cols="2"> -->
            <label :style="{backgroundColor:'green', color:'green', float: 'left'}">&nbsp;색상</label>
            <label :style="{fontWeight: 'bold', float: 'left', marginRight: '15px'}">&nbsp;: 완료</label>
          <!-- </v-col>
          <v-col :cols="2"> -->
            <label :style="{backgroundColor:'blue', color:'blue', float: 'left'}">&nbsp;색상</label>
            <label :style="{fontWeight: 'bold', float: 'left', marginRight: '15px'}">&nbsp;: 진행중</label>
          <!-- </v-col>
          <v-col :cols="2"> -->
            <label :style="{backgroundColor:'red', color:'red', float: 'left'}">&nbsp;색상</label>
            <label :style="{fontWeight: 'bold', float: 'left', marginRight: '15px'}">&nbsp;: 미진행</label>
          <!-- </v-col> -->
          <!-- <v-col :cols="2"> -->
            <label :style="{backgroundColor:'yellow', color:'yellow', float: 'left'}">&nbsp;색상</label>
            <label :style="{fontWeight: 'bold', float: 'left'}">&nbsp;: 예정</label>
          <!-- </v-col> -->
          <Button :theme-color="'primary'" :size="'small'" @click="addPMCycle" >PM주기 추가</Button>
      </v-col>
      <v-col ref="gridArea" :cols="4" style="display: none;">
        <Card ref="gridCard" :style="{height : '100%'}">
          <CardBody>
            <div class="d-flex align-center justify-space-between pa-2">
            <CardTitle>{{$t('CalendarMngPage.label2')}}</CardTitle>
            <div>
              <!-- <Button :theme-color="'primary'" @click="rowGridSave">{{$t('CommLang.btn.saveBtn')}}</Button> -->
            </div>
          </div>
            <div ref="divWrapper">
            <KendoGrid ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridItems"
                  :sortable="true"
                  :columns = "columns"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :gridDropDownList="gridDropDownList"
                  @griditemchange="itemChange"
                  @gridddchang="ddChange"
                  @gridrowclick="onRowClick">
              </KendoGrid>
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="12" :style="{height : '100%'}">
            <div ref="calWrapper" style="height:100%;">
              <calendar ref="calendar" :navigation="false" :cell="customCell" :style="{width:'100%', height:'100%'}" :value="defaultValue">
                <template v-slot:myCellTemplate="{props}">
                  <CustomCalendarCell 
                  :is-weekend="props.isWeekend"
                  
                  :is-focused="props.isFocused"
                  :formatted-value="props.formattedValue"
                  :is-today="props.isToday"
                  :title="props.title"
                  :value="props.value"
                  :gridData="gridData"
                  :planData="planData"
                  :calCellHeight="calCellHeight"
                  :calCellWidth="calCellWidth"
                  @click="changeHandler"
                  @updateClick="updateClick"
                  @onRightClick="onRightClick"
                  @onLeftClick="onLeftClick"
                  />
              </template>
              </calendar>
            </div>
        </v-col>
    </v-row>
    <PlanPop 
      ref="planPop"
      :is="'PlanPop'"
      :comId="comId"
      @search="search"
    />
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" :callBack="()=>{}"/>
    <ContextMenu 
    v-if="isContextMenuVisible" 
    :posX="contextMenuPosX" 
    :posY="contextMenuPosY"
    :planData="contextMenuPlanData"
    :menuFlag="menuFlag"
    @addClickContextMenu="addClickContextMenu"
    @editClickContextMenu="editClickContextMenu"
    @removeClickContextMenu="removeClickContextMenu"
    @startPMClickContextMenu="startPMClickContextMenu" 
    />
    <PMDetail 
    ref="PMDetail" 
    v-if="setPMDetailModalVisible" 
    :visibleDialog="setPMDetailModalVisible"
    :rightClickPlanData="rightClickPlanData"
    :btnFlag="btnFlag"
    :title="'title'" 
    :message="'message'"
    :callBack="() => { }" 
    @visibleDialog="(val) => setPMDetailModalVisible = val"
    @pmDetailSaveData="pmDetailSaveData"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import { Card, CardBody, CardTitle, CardActions, TabStrip } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import { DateInput, Calendar } from '@progress/kendo-vue-dateinputs';
import { Label } from "@progress/kendo-vue-labels";
import KendoGrid from "@/components/common/KendoGrid.vue"
import CustomCalendarCell from '@/components/frmPMManagementTabs/PMScheduleCustom.vue';
import PlanPop from "@/components/common/modal/PlanPop";
import ContextMenu from '@/components/frmPMManagementTabs/ContextMenu.vue';
import PMDetail from "@/components/frmPMManagementTabs/PMDetail";

let myTitle;
let myMenuId;
export default {
  mixins: [mixinGlobal],
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
    closable: true
  },
  components: {
    Card, CardBody, CardTitle, CardActions, TabStrip,
    Button,
    Utility,
    DateInput,
    Label,
    KendoGrid,
    Calendar,
    CustomCalendarCell,
    PlanPop,
    ContextMenu,
    PMDetail
  },
  props:{
    viewParam:{
      lotid:"",
      productid:"",
      fromdete:"",
      todate:"",
      setYYYYMM:"",
      inputEquipmentId:""
    }
  },
  data() {
    return {
      comId : "FEMS",
      fromDt: new Date(),
      steps: { year: 1, month: 1 },
      columns: [],
      selectedField: 'selected',
      selectedID: 0,
      selectedData: [],
      gridHeight : '0px',
      gridData : [],
      planData : [],
      gridDropDownList:[
        {
          dataVal : 'hldyFg',
          dataItem: ['평일', '휴일']
        }
      ],
      customCell: 'myCellTemplate',
      calendarValue: null,
      calCellWidth: '100px',
      calCellHeight: '100px',
      defaultValue: null,
      testValue: null,
      addSaveData : [],
      searchDate : "",
      isContextMenuVisible: false,
      contextMenuPosX: 0,
      contextMenuPosY: 0,
      contextMenuPlanData: [],
      setPMDetailModalVisible: false,
      rightClickPlanData:[],
      btnFlag:"",
      menuFlag:"",
      inputEqId: ""
    };
  },
  computed: {
    userInfo: (state) => state.$session.get('userInfo'),
    gridItems() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.idx === this.selectedID,
        inEdit: item.idx === this.selectedID,
        hldyFg: item.hldyFg == "1" ? "휴일" : "평일"
      }));
    }
  },
  watch: {
  },
  beforeCreate() {
  },
  async mounted(){
    // var today = new Date();
    // this.defaultValue = new Date(today.setMonth(today.getMonth() -1));
    // this.gridHeight = (this.$refs.contents.offsetHeight - 90) +'px';
    this.calCellWidth = (this.$refs.calWrapper.offsetWidth/8) +'px';;
    this.calCellHeight = (this.$refs.calWrapper.offsetHeight/7) +'px';
    // console.log("mounted 조회조건YYYYMM:::::::::::", this.viewParam.setYYYYMM);
    // console.log("mounted 조회조건YYYYMMDD:::::::::::", this.viewParam.setYYYYMMDD);
    this.testValue = this.viewParam.setYYYYMM;
    //this.calCelWidth = (this.$refs,calendar)
    //   this.gridInit();
    this.search(this.viewParam.setYYYYMMDD);
  },
  methods: {
      onLeftClick (e, customPlanData, customPMState) {
        this.isContextMenuVisible = false;
      },
      onRightClick (e, customPlanData, customPMState) {
          this.showContextMenu(e, customPlanData, customPMState);
      },
      showContextMenu(e, customPlanData, customPMState) {
          // console.log(":::::showContextMenu::::::");
          // console.log(":::::showContextMenu::::customPMState ::::", customPMState);
          this.menuFlag = customPMState;
          this.contextMenuPosX = e.clientX;
          this.contextMenuPosY = e.clientY;
          this.contextMenuPlanData = customPlanData;
          this.isContextMenuVisible = true;
      },

      /* 
        ContextMenu 기능
        planData - PMScheduleCustom.vue 에서 우클릭대상의 데이터, 
        btnFlag - ContextMenu.vue 에서 버튼 기능별 플래그
                - 추가: C, 수정: U, 삭제: D, PM실행: startPM
      */
      addClickContextMenu (clickData, btnFlag) {
          // 우클릭 메뉴 - 추가
          this.rightClickPlanData = clickData;
          this.btnFlag = btnFlag;
          this.isContextMenuVisible = false;
          // console.log("rightClickPlanData::::::::", this.rightClickPlanData);
          this.setPMDetailModalVisible = true;
          // this.savePlanData(clickData, btnFlag);
      },
      editClickContextMenu (clickData, btnFlag) {
          // 우클릭 메뉴 - 수정
          this.rightClickPlanData = clickData;
          this.btnFlag = btnFlag;
          this.isContextMenuVisible = false;
          this.setPMDetailModalVisible = true;
          // this.savePlanData(clickData, btnFlag);
      },
      removeClickContextMenu (clickData, btnFlag) {
          // 우클릭 메뉴 - 삭제
          this.isContextMenuVisible = false;
          this.savePlanData(clickData, btnFlag);
      },
      startPMClickContextMenu (clickData, btnFlag) {
          // 우클릭 메뉴 - PM실행 얘는 탭이동해야함
          this.isContextMenuVisible = false;
          this.$emit('openPMWorkTab', clickData, btnFlag);
          // this.savePlanData(clickData, btnFlag);
      },
      
    addPMCycle(e) {
      // console.log("======= PM주기 추가 버튼 =========", e);
      this.visibleDialog = !this.visibleDialog;
      this.$refs['confirmPop'].title = "Info";
      this.$refs['confirmPop'].message = "설비정보에 입력한 대로 일정을 추가하시겠습니까?";
      this.$refs['confirmPop'].callBack = this.getPMCycleListSearch;
      this.$refs['confirmPop'].modalWidth = "300px";
      this.$refs['confirmPop'].visibleDialog = true;
    },
      itemChange: function (e) {
      // console.log("::::::::::::::: itemChange: function (e) :::::::::::");
        const data = this.gridData.slice();
        const index = data.findIndex(d => d.idx === e.dataItem.idx);
        data[index] = { ...data[index], [e.field]: e.value };
        if(data[index].rowStat == ''){
          data[index].rowStat = "U";
        }
        this.gridData = data;
      },
      ddChange: function (e, name, dataItem) {
          // console.log("::::::::::::::: ddChange: function (e, name, dataItem) :::::::::::")
          const data = this.gridData.slice();
          const index = data.findIndex(d => d.idx === dataItem.idx);
          if(name == "hldyFg"){
          e.value = e.value == "휴일" ? "1" : "0"
          }
          data[index] = { ...data[index], [name]: e.value };
          if(data[index].rowStat == ''){
              data[index].rowStat = "U";
          }
          this.gridData = data;
      },
      changeHandler: function (value) {
          // console.log(":::::::::::: changeHandler: function (value) :::::::::::", value);


          // this.$refs['planPop'].planLabel = this.$i18n.t('CalendarMngPage.label8')
          // this.$refs['planPop'].popUpAction = 'insert';
          // this.$refs['planPop'].strtDt = value;
          // this.$refs['planPop'].endDt = value;
          // this.$refs['planPop'].visibleDialog = true;
      },
      updateClick: function(e) {
          // console.log(":::::::::::: updateClick: function(val)  :::::::::::", e);


          // this.$refs['planPop'].planLabel = this.$i18n.t('CalendarMngPage.label9')
          // this.$refs['planPop'].popUpAction = 'update';
          // this.$refs['planPop'].planSeq = val;
          // this.$refs['planPop'].visibleDialog = true;
    },

    search(yearMonthData, equipmentId, workeruserid){
      var today = new Date();
      this.defaultValue = new Date(Utility.setFormatDate(yearMonthData));
      // console.log("defaultValue:::::::::", this.defaultValue);
      // console.log("yearMonthData::::::::::::", yearMonthData);
      this.gridDataSelect(yearMonthData, equipmentId, workeruserid);
    },
    searchSelectValSet(nm,txt, val){
      // console.log("=========== searchSelectValSet(nm,txt, val) ============");
      this[nm] = val;
      this.search();
    },
    searchDateValSet(nm, val){
      // console.log("=========== searchDateValSet(nm, val) ============");
      this[nm] = Utility.setFormatDate(val,'YYYY-MM-DD');
      
      this.search();
    },
    async onRowClick(event){
      // console.log("=========== async onRowClick(event)============");
      if(event.dataItem){
          // console.log("event.dataItem.idx::::::::::", event.dataItem.idx);
          // console.log("event.dataItem::::::::::", event.dataItem);
        this.selectedID = event.dataItem.idx;
        this.selectedData = event.dataItem;
      }
    },

    // PM주기추가버튼 클릭
    async getPMCycleListSearch () {
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetPMCycleList",
        sendParam: {
          plantid: "LS",
          // yyyymm : Utility.setFormatDate(yearMonthData, 'YYYYMM')
          // yyyymm : "202303"
          // yyyymm : Utility.setFormatDate(this.fromDt,'YYYYMM'),
          // equipmentid : ""
          }
        }).then((getPMCycleListRes) => {
         const getPMCycleListData = getPMCycleListRes.map((x, idx) => {
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
        });

        if(getPMCycleListData.length > 0) {
          // console.log("PMCYCLETYPE ::::::::", getPMCycleListData);
          
          for(var i=0; i<getPMCycleListData.length; i++){
              if(getPMCycleListData[i].PMCYCLETYPE != "0" && getPMCycleListData[i].PMCYCLETYPE != "None" && getPMCycleListData[i].PMCYCLETYPE != null) {
                  const orgDateTime = new Date(getPMCycleListData[i].LASTMAINTENANCETIME);
                  let dateTime = new Date(getPMCycleListData[i].LASTMAINTENANCETIME);
                  let dateTimeFormat = Utility.setFormatDate(dateTime, "YYYYMM");
                  const currdate = new Date(Utility.setFormatDate(this.searchDate));
                  const dateTimeAddMonth = new Date(currdate.setMonth(currdate.getMonth() +1));
                  const dateTimeAddMonthFormat = Utility.setFormatDate(dateTimeAddMonth, "YYYYMM");
                  const newCurrdate = new Date();
                  const getCurrdateFormat = Utility.setFormatDate(newCurrdate, "YYYYMM");
                  let newDateTime = "";
                  
                  while(dateTimeFormat < dateTimeAddMonthFormat) {
                      if(getPMCycleListData[i].PMCYCLETYPE == "Day") {
                          // const newDate = new Date(orgDateTime.setDate(orgDateTime.getDate() + parseInt(getPMCycleListData[i].PMCYCLEVALUE)));
                          dateTime = new Date(dateTime.getTime() + (parseInt(getPMCycleListData[i].PMCYCLEVALUE) * 24 * 60 * 60 * 1000));
                          dateTimeFormat = Utility.setFormatDate(dateTime, "YYYYMM");
                          newDateTime = Utility.setFormatDate(dateTime, "YYYYMMDDHHmmss");

                      } else if(getPMCycleListData[i].PMCYCLETYPE == "Hour") {
                          // const newDate = new Date(orgDateTime.setHours(orgDateTime.getHours() + parseInt(getPMCycleListData[i].PMCYCLEVALUE)));
                          dateTime = new Date(dateTime.setHours(dateTime.getHours() + (parseInt(getPMCycleListData[i].PMCYCLEVALUE) * 60 * 60 * 1000)));
                          dateTimeFormat = Utility.setFormatDate(dateTime, "YYYYMM");
                          newDateTime = Utility.setFormatDate(dateTime, "YYYYMMDDHHmmss");
                      } else {
                          break;
                      }

                      if(dateTimeFormat == this.searchDate) {
                          this.addSaveData.push({
                              pmplannedtime:newDateTime,
                              workcomment: "",
                              pmscheduleid:"",
                              plantid: "LS",
                              pmscheduletype:"Manual",
                                  _rowstatus : "C",
                                  manageruserid : this.userInfo.userId,
                              equipmentid:getPMCycleListData[i].EQUIPMENTID,
                              workeruserid: ""
                          });
                        }
                      }
                    }
                  }
                  // console.log("addSaveData::::::::::::::", this.addSaveData);
          
        } else {
          // console.log("getPMCycleListData:::::::", getPMCycleListData);
        }

        // 위에서 this.addSaveData 에 push 한 data를 저장.
          if(this.addSaveData.length > 0) {
              const res = this.mesPost({
                  apiKey: "mes/common/manage",
                  messagename: "TxnEquipmentPMSchedule",
                  sendParam: this.addSaveData
              }).then((result) => {
              this.$nextTick(() => {
                  if (result.returncode !== undefined && result.returncode === "0") {
                      this.search(this.searchDate);
                      this.addSaveData = [];
                      this.$refs.alertPop.show("Info", "저장되었습니다.");
                  } else {
                    this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
                  }
                  })
              })
          }
      })
    },

    async gridDataSelect(yearMonthData, equipmentId, workeruserid){
      // console.log("this.fromDt:::::::::::::", this.fromDt);
      // console.log("this.fromDt:::::::::::::", this.fromDt);
      console.log("Utility.setFormatDate(yearMonthData, 'YYYYMM'):::::::::", Utility.setFormatDate(yearMonthData, 'YYYYMM'));
      // console.log("this.fromDt:::::::::", Utility.setFormatDate(this.fromDt,'YYYYMM'));
      
          this.searchDate = yearMonthData; // 다른곳에서 공통으로 해당날자 사용하기위함.
      let res = await this.getListReturn({
        apiKey: "common/calendar/search",
        sendParam : {
          yyyymm: Utility.setFormatDate(yearMonthData,'YYYYMM')
        }
      });

      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetPMScheduleList",
        sendParam: {
          plantid: "LS",
          yyyymm : Utility.setFormatDate(yearMonthData, 'YYYYMM'),
          equipmentid: this.inputEqId,
          // workeruserid: workeruserid  //작업자는 쿼리막혀있음
          }
        }).then((res1) => {
          let PMScheduleListData;
          if(workeruserid === "" || workeruserid === undefined){
            PMScheduleListData = res1
              .map((x, idx) => {
              // console.log(":x::::::",x);
              return {
                ...x,
                rowStat: "N",
                selected: false,
                idx: idx,
                inEdit: false,
                newRow: false,
              }
            });
          } else {
            PMScheduleListData = res1
            .filter(x => x.WORKERUSERID === null ? null : workeruserid)
            .map((x, idx) => {
              // console.log(":x::::::",x);
              return {
                ...x,
                rowStat: "N",
                selected: false,
                idx: idx,
                inEdit: false,
                newRow: false,
              }
            });
          }
        // if(PMScheduleListData.length > 0) {
        //     console.log("PMScheduleListData:::::::", PMScheduleListData);
        //     console.log("HH:mm   ::::", PMScheduleListData[0].PMPLANNEDTIME.substring(11,16));
        // } else {
        //   console.log("PMScheduleListData:::::::", PMScheduleListData);
        // }
        this.planData = PMScheduleListData;
      })


        for(var i=0; i<res.length; i++){
          if(!(res[i].hldyNm == null || res[i].hldyNm == "토요일" || res[i].hldyNm == "일요일")){
            for(var j=i+1; j<res.length; j++){
              if(res[i].hldyNm == res[j].hldyNm){
                  res[i].hldyNm = "";
              }
            }
          }  
        }
  
        res = res.map((item,i) => {
          // console.log("item::::::::::::", item);
          const dt = this.$dayjs(item.dt.split(" ")[0]); // YYYY-MM-DD
          const dtNm = dt.format("ddd"); // 요일
          const newItem = {
            ...item,
            dtNm: dtNm,
            dt : Utility.setFormatDate(item.dt, 'YYYY-MM-DD'),
            hldyNm: item.hldyNm ? item.hldyNm : "",
            rowStat: null,
            selected: i === this.selectedID,
            idx: i,
            rowStat: ""
          };
          return newItem;
        });
        this.gridData = res;
      //   this.planData = res2;
        if(this.gridData.length > 0);
        this.onRowClick({dataItem : this.gridData[0]});
      //   this.$refs.gridArea.style.display = 'none';
    },

    savePlanData (clickData, btnFlag) {
      // console.log("removePlanData::::::", clickData);
      clickData[0]._rowstatus = btnFlag; 


      // console.log("removePlanData:::::삭제바로전[0] 에 속성추가 ::", clickData);

      if(clickData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnEquipmentPMSchedule",
          sendParam: clickData[0],
        }).then((result) => {
          this.$nextTick(() => {
            if(result.returncode === "0"){
              let alertText = "";
              if ( btnFlag == "D" ) {
                alertText = "삭제";
              } else {
                alertText = "저장";
              }
              this.setPMDetailModalVisible = false;
              this.search(this.searchDate);
              this.$refs.alertPop.show("Info", "일정이 " + alertText + "되었습니다.");
            } else {
              this.$refs.alertPop.show("ERROR : " + result.code , result.message);
            }
          })
        })
      }
    },
    pmDetailSaveData (data, btnFlag){
      // console.log("pmDetailSaveData:::::::", data);

      this.savePlanData(data, btnFlag);
    },
    pmDetailSave () {
      if(saveData.length > 0) {
          const res = this.mesPost({
              apiKey: "mes/common/manage",
              messagename: "TxnEquipmentPMSchedule",
              sendParam: saveData[0],
          }).then((result) => {
              this.$nextTick(() => {
                  if (result.returncode !== undefined && result.returncode === "0") {
                      this.$emit('reSearch', Utility.setFormatDate(saveData[0].workcomment, "YYYYMM"));
                      this.$refs.alertPop.show("Info", "저장되었습니다.");
                      this.visibleDialog = !this.visibleDialog;
                  } else {
                    this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
                  }
              })
          })
      }
    },
    setEquipmentID (equipmentId) {
      // console.log("eqID::", equipmentId)
      this.inputEqId = equipmentId;
    }
  }
};

const defaultData = {
};
</script>
<style lang="scss">
.k-calendar-view{
  margin: 50px auto !important;
  height: 100%;
}
.k-calendar-table {
  height: 100%;
}
</style>