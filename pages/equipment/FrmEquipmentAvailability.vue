<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>설비관리</li>
      <li>설비가동률</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap" style="width: 1500px;">
                  <div class="form-group">
                    <label>설비코드</label>
                    <InputText
                      ref="equipmentid"
                      :boxWidth="'98%'"
                      :dataNm="'equipmentid'"
                      :disabled="false"
                      :defaultValue="equipmentid"
                      :searchOption="true"
                      :searchFunc="searchBtn" 
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>작업일자</label>
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
                        :default-value="new Date(todate)"
                        :dataNm="'todate'"
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
      <v-col :sm="3" :lg="3" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{height : '100%'}">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters :style="{ height: '100%' }">
              <v-col cols="12" align="left">
                <CardTitle>설비목록</CardTitle>
              </v-col>
              <v-col cols="12" :style="{ height: 'calc(100% - 33px)' }">
                <div ref="divWrapper" :style="{ height: '100%' }">
                  <KendoGrid 
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="headerParam.gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :isPaging="true"
                  :selected-field="selectedField"
                  @gridrowclick="onRowClick"
                  @sortChangeHandler="sortChangeHandler"
                  />
                </div>
            </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
      <v-col :sm="9" :lg="9" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{height : '100%'}">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters :style="{ height: '100%' }">
              <v-col cols="12" class="" align="left">
                <CardTitle
                  >설비상태 이력<span class="i-msg" v-if="click"
                    >{{ equipmentidtxt }}의 가동률 : {{ availabilitytxt }}%</span
                  ></CardTitle
                >
              </v-col>
              <v-col cols="12" :style="{ height: 'calc(100% - 34px)' }">
                <div ref="divWrapper2" :style="{ height: '100%' }">
                  <KendoGrid 
                  ref="rowGrid2"
                  :gridHeight="gridHeight2"
                  :gridItems="gridData2"
                  :sortable="true"
                  :columns="headerParam2.gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :isPaging="true"
                  :selected-field="selectedField"
                  @sortChangeHandler="sortChangeHandler2"
                  />
                </div>
              </v-col>
            </v-row>
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
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import InputText from "@/components/common/input/InputText";
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import utils from "~/plugins/utils";

let myTitle;
let myMenuId;
const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth();   // 월
let day = d.getDate();      // 일
let hours = d.getHours(); // 시
let minutes = d.getMinutes(); // 분
let seconds = d.getSeconds(); // 초
let fromdate = new Date(year, month, 1, hours, minutes, seconds);
let todate = d;

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
    DatePicker
  },
  data() {
    return {
      gridHeight : '100px',
      gridData : [],
      gridOriData : [],
      gridHeight2 : '100px',
      gridData2 : [],
      gridOriData2 : [],

      gridData2Calc: [],
      runningList : [],
      runningListOrg : [],
      stateHistory : [],
      stateHistoryOrg : [],

      selectedField: 'selected',
      
      headerParam: {
        gridid: "dgvEquipmentAvailability", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      headerParam2: {
        gridid: "dgvEquipmentStateHistory", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      equipmentid:"",
      availability:"",
      equipmentidtxt:"",
      availabilitytxt:"",
      click:false,
      fromdate: Utility.setFormatDate(fromdate, 'YYYY-MM-DD'),
      todate: Utility.setFormatDate(todate, 'YYYY-MM-DD'),
      sumFromdate: Utility.setFormatDate(fromdate, 'YYYY-MM-DD') + ' 00:00:00', 
      sumTodate: Utility.setFormatDate(todate, 'YYYY-MM-DD HH:mm:ss'),
    };
  },
  created() {
  },
  async mounted() {
    this.gridHeight = (this.$refs.contents.offsetHeight - 80) +'px';
    this.gridHeight2 = (this.$refs.contents.offsetHeight - 80) +'px';
    this.fromdate = Utility.setFormatDate(this.fromdate, 'YYYYMMDD');
    this.todate = Utility.setFormatDate(this.todate, 'YYYYMMDD');
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    await this.getGridData();
    await this.getGridData2();
  },
  computed: {
  },
  watch: {
  },
  methods: {
    searchBtn(){

      if( this.fromdate > this.todate ) {
        this.$refs['alertPop'].show('','시작날짜를 종료날짜보다 늦은 날짜로 설정할 수 없습니다.');
        return;
      } else if( this.todate < this.fromdate ) {
        this.$refs['alertPop'].show('','종료날짜를 시작날짜보다 이전 날짜로 설정할 수 없습니다.');
        return;
      } else if( this.todate > Utility.setFormatDate(todate, 'YYYYMMDD')) {
        this.$refs['alertPop'].show('','종료날짜를 현재보다 늦은 날짜로 설정할 수 없습니다.');
        return;
      }

      this.getGridData();
      this.getGridData2();
      this.$refs.rowGrid.skip = 0;
      this.$refs.rowGrid2.skip = 0;
    },
    //그리드 데이터 가져오기
    async getGridData() {
      // this.gridData = [];
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEquipmentList",
        sendParam: {
          plantid: "LS",
          equipmentid: this.equipmentid,
          EquipmentDetailType: "Equipment",
        }
      }).then((res) => {
         const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: false,
            newRow: false
          }
        });
        // this.$nuxt.$emit('iccReset')
        this.gridOriData = data;
        this.gridData = data;
      })
    },
    async getGridData2() {
      // this.gridData = [];
      this.gridOriData2 = [];
      this.gridData2 = [];
      this.gridData2Calc = [];
      let runningTime = 0;
      let accRunningTime = 0;
      let sumTime = 0;
      let newRunningIndex = -1;
      let newEquipmentIndex = 0;
      let isEquipmentRunning = false;

      if(this.todate === Utility.setFormatDate(todate, 'YYYYMMDD')){
        this.sumTodate = Utility.setFormatDate(todate, 'YYYY-MM-DD HH:mm:ss')
      } else {
        this.sumTodate = Utility.setFormatDate(this.sumTodate, 'YYYY-MM-DD') + ' 23:59:59'
      }

      sumTime = this.calcDate(Utility.setFormatDate(this.sumTodate, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.sumFromdate, 'YYYY-MM-DD HH:mm:ss'));
      
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEquipmentFirstRunningList",
        sendParam: {
          plantid: "LS",
          equipmentid: this.equipmentid,
          fromdate: this.fromdate,
        }
      }).then((res) => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: false,
            newRow: false
          }
        });
        // this.$nuxt.$emit('iccReset')
        this.runningListOrg = data;
        this.runningList = data;

        this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetEquipmentStateHistory",
          sendParam: {
            plantid: "LS",
            equipmentid: this.equipmentid,
            fromdate: this.fromdate,
            todate: this.todate
          }
        }).then((res) => {
          const data = res.map((x, idx) => {
            return {
              ...x,
              rowStat: "N",
              selected: false,
              idx: idx,
              inEdit: false,
              newRow: false
            }
          });
  
          this.stateHistoryOrg = data;
          this.stateHistory = data;

  
          let equipmentFirstRunningDic = [];
          let drSelectedArr = [];
          

          if(this.runningList.length > 0){
            for(let i = 0; i < this.runningList.length; i++){
              if(this.runningList[i].EQUIPMENTSTATE === "Run"){
                const initData = {};
                initData["EQUIPMENTID"] = this.runningList[i].EQUIPMENTID;
                initData["EVENTTIME"] = this.runningList[i].EVENTTIME;
                equipmentFirstRunningDic.push(initData)
              }
            }
            
            // 1. 선택한 기간 이전에 설비가 가동된 경우
            for(let i = 0; i < equipmentFirstRunningDic.length; i++ ){
              let equipmentID = equipmentFirstRunningDic[i].EQUIPMENTID;
              drSelectedArr = this.stateHistory
              .filter(x => x.EQUIPMENTID === equipmentID && x.EQUIPMENTSTATE !== "Run")
              .map(x => {
                return {
                  ...x,
                }
              });

              // 1-1 선택한 기간 이후에 설비가 중단된 경우
              if( this.stateHistory.length === 0 || drSelectedArr.length === 0 ){
                const newRowUUid = Math.round(Math.random()*1000000000).toString()
                runningTime = runningTime + this.calcDate(Utility.setFormatDate(this.sumTodate, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.sumFromdate, 'YYYY-MM-DD HH:mm:ss'));
                accRunningTime = accRunningTime + runningTime;

                this.gridData2Calc.push({
                  inEdit: false, 
                  newRow: false,
                  selected: false, 
                  rowStat: "N",
                  _ROWSTATUS: "N",
                  newRowUUid: newRowUUid,
                  idx: this.gridData2Calc.length,
                  EQUIPMENTID: equipmentID,
                  STARTSTATE: "Run",
                  STARTSTATENAME: "가동",
                  STARTTIME: this.sumFromdate,
                  ENDSTATE: "Run",
                  ENDSTATENAME: "가동",
                  ENDTIME: this.sumTodate,
                  RUNNINGTIME: this.calcTime(runningTime),
                  ACCRUNNINGTIME: this.calcTime(accRunningTime),
                  AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                  COMMENT: "(설비시작시간)"+equipmentFirstRunningDic[i].EVENTTIME,
                });

                runningTime = 0;
                accRunningTime = 0;
                continue;
              // 1-2. 선택한 기간 내에 설비가 중단된 경우
              } else {
                const newRowUUid = Math.round(Math.random()*1000000000).toString()
                runningTime = runningTime + this.calcDate(Utility.setFormatDate(drSelectedArr[0].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.sumFromdate, 'YYYY-MM-DD HH:mm:ss'));
                accRunningTime = accRunningTime + runningTime;

                this.gridData2Calc.push({
                  inEdit: false, 
                  newRow: false,
                  selected: false, 
                  rowStat: "N",
                  _ROWSTATUS: "N",
                  newRowUUid: newRowUUid,
                  idx: this.gridData2Calc.length,
                  EQUIPMENTID: equipmentID,
                  STARTSTATE: "Run",
                  STARTSTATENAME: "가동",
                  STARTTIME: this.sumFromdate,
                  ENDSTATE: drSelectedArr[0].EQUIPMENTSTATE,
                  ENDSTATENAME: drSelectedArr[0].EQUIPMENTSTATENAME,
                  ENDTIME: drSelectedArr[0].EVENTTIME,
                  RUNNINGTIME: this.calcTime(runningTime),
                  ACCRUNNINGTIME: this.calcTime(accRunningTime),
                  AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                  COMMENT: "(설비시작시간)"+equipmentFirstRunningDic[i].EVENTTIME,
                });


                runningTime = 0;
                accRunningTime = 0;
                continue;

              }
            }

            // 2. 선택한 기간 내에 설비가 가동된 경우
            for( let i = 0; i < this.stateHistory.length; ++i ){
              let equipmentID = this.stateHistory[i].EQUIPMENTID;
              let equipmentState = this.stateHistory[i].EQUIPMENTSTATE;
              
              // 2-1. 같은 설비일 때
              if(equipmentID === this.stateHistory[newEquipmentIndex].EQUIPMENTID){
                if(equipmentState === "Run" && !isEquipmentRunning){
                  newRunningIndex = i;
                  isEquipmentRunning = true;
                  
                  if(i === this.stateHistory.length - 1){

                    for(let j = 0; j < equipmentFirstRunningDic.length; j++){
                      if(equipmentID === equipmentFirstRunningDic[j].EQUIPMENTID){
                        const initData = this.gridData2Calc
                        .filter(x => x.EQUIPMENTID === equipmentID)
                        .map(x => {
                          return {
                            ...x,
                          }
                        });

                        if(initData.length === 1){
                          const time = initData[0].ACCRUNNINGTIME.replaceAll(':', '');
                          const hh = Number(time.substring(0, 2));
                          const mm = Number(time.substring(2, 4));
                          const ss = Number(time.substring(4, 6));
                          accRunningTime = (hh*60+mm)*60+ss;
                        }

                      }
                    }
                    const newRowUUid = Math.round(Math.random()*1000000000).toString();

                    
                    runningTime = runningTime + this.calcDate(Utility.setFormatDate(this.sumTodate, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.stateHistory[i].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'));
                    accRunningTime = accRunningTime + runningTime;
                    this.gridData2Calc.push({
                      inEdit: false, 
                      newRow: false,
                      selected: false, 
                      rowStat: "N",
                      _ROWSTATUS: "N",
                      newRowUUid: newRowUUid,
                      idx: this.gridData2Calc.length,
                      EQUIPMENTID: equipmentID,
                      STARTSTATE: equipmentState,
                      STARTSTATENAME: this.stateHistory[0].EQUIPMENTSTATENAME,
                      STARTTIME: this.stateHistory[0].EVENTTIME,
                      ENDSTATE: "Run",
                      ENDSTATENAME: "가동",
                      ENDTIME: this.sumTodate,
                      RUNNINGTIME: this.calcTime(runningTime),
                      ACCRUNNINGTIME: this.calcTime(accRunningTime),
                      AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                    });
                    
                    runningTime = 0;
                    accRunningTime = 0;

                  }
                } else if (equipmentState !== "Run" && isEquipmentRunning){
                  for(let j = 0; j < equipmentFirstRunningDic.length; j++){
                    if(equipmentID === equipmentFirstRunningDic[j].EQUIPMENTID){
                      const initData = this.gridData2Calc
                      .filter(x => x.EQUIPMENTID === equipmentID)
                      .map(x => {
                        return {
                          ...x,
                        }
                      });

                      if(initData.length === 1){
                        const time = initData[0].ACCRUNNINGTIME.replaceAll(':', '');
                        const hh = Number(time.substring(0, 2));
                        const mm = Number(time.substring(2, 4));
                        const ss = Number(time.substring(4, 6));
                        accRunningTime = (hh*60+mm)*60+ss;
                      }

                    }
                  }

                  const newRowUUid = Math.round(Math.random()*1000000000).toString();
                  
                  runningTime = runningTime + this.calcDate(Utility.setFormatDate(this.stateHistory[i].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.stateHistory[newRunningIndex].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'));
                  accRunningTime = accRunningTime + runningTime;
                  this.gridData2Calc.push({
                    inEdit: false, 
                    newRow: false,
                    selected: false, 
                    rowStat: "N",
                    _ROWSTATUS: "N",
                    newRowUUid: newRowUUid,
                    idx: this.gridData2Calc.length,
                    EQUIPMENTID: equipmentID,
                    STARTSTATE: this.stateHistory[newRunningIndex].EQUIPMENTSTATE,
                    STARTSTATENAME: this.stateHistory[newRunningIndex].EQUIPMENTSTATENAME,
                    STARTTIME: this.stateHistory[newRunningIndex].EVENTTIME,
                    ENDSTATE: equipmentState,
                    ENDSTATENAME: this.stateHistory[i].EQUIPMENTSTATENAME,
                    ENDTIME: this.stateHistory[i].EVENTTIME,
                    RUNNINGTIME: this.calcTime(runningTime),
                    ACCRUNNINGTIME: this.calcTime(accRunningTime),
                    AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                  });

                  runningTime = 0;
                  isEquipmentRunning = false;

                }

              // 2-2. 다른 설비일 때
              } else {
                // 2-2-1. 이전 설비의 최근 상태가 가동중일 때 처리
                if( isEquipmentRunning ){
                  if( this.stateHistory[i - 1].EQUIPMENTSTATE === "Run" ){
                    const newRowUUid = Math.round(Math.random()*1000000000).toString();
                    
                    runningTime = runningTime + this.calcDate(Utility.setFormatDate(this.sumTodate, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.stateHistory[newRunningIndex].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'));
                    accRunningTime = accRunningTime + runningTime;

                    this.gridData2Calc.push({
                      inEdit: false, 
                      newRow: false,
                      selected: false, 
                      rowStat: "N",
                      _ROWSTATUS: "N",
                      newRowUUid: newRowUUid,
                      idx: this.gridData2Calc.length,
                      EQUIPMENTID: this.stateHistory[newRunningIndex].EQUIPMENTID,
                      STARTSTATE: this.stateHistory[newRunningIndex].EQUIPMENTSTATE,
                      STARTSTATENAME: this.stateHistory[newRunningIndex].EQUIPMENTSTATENAME,
                      STARTTIME: this.stateHistory[newRunningIndex].EVENTTIME,
                      ENDSTATE: this.stateHistory[i - 1].EQUIPMENTSTATE,
                      ENDSTATENAME: this.stateHistory[i - 1].EQUIPMENTSTATENAME,
                      ENDTIME: this.sumTodate,
                      RUNNINGTIME: this.calcTime(runningTime),
                      ACCRUNNINGTIME: this.calcTime(accRunningTime),
                      AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                      // COMMENT: "(설비시작시간2)"+equipmentFirstRunningDic[i].EVENTTIME,
                    });
                    
                  } else {
                    const newRowUUid = Math.round(Math.random()*1000000000).toString();
                    
                    runningTime = runningTime + this.calcDate(Utility.setFormatDate(this.stateHistory[i - 1].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.stateHistory[newRunningIndex].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'));
                    accRunningTime = accRunningTime + runningTime;

                    this.gridData2Calc.push({
                      inEdit: false, 
                      newRow: false,
                      selected: false, 
                      rowStat: "N",
                      _ROWSTATUS: "N",
                      newRowUUid: newRowUUid,
                      idx: this.gridData2Calc.length,
                      EQUIPMENTID: this.stateHistory[newRunningIndex].EQUIPMENTID,
                      STARTSTATE: this.stateHistory[newRunningIndex].EQUIPMENTSTATE,
                      STARTSTATENAME: this.stateHistory[newRunningIndex].EQUIPMENTSTATENAME,
                      STARTTIME: this.stateHistory[newRunningIndex].EVENTTIME,
                      ENDSTATE: this.stateHistory[i - 1].EQUIPMENTSTATE,
                      ENDSTATENAME: this.stateHistory[i - 1].EQUIPMENTSTATENAME,
                      ENDTIME: this.stateHistory[i - 1].EVENTTIME,
                      RUNNINGTIME: this.calcTime(runningTime),
                      ACCRUNNINGTIME: this.calcTime(accRunningTime),
                      AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                    });
                  }
                }
                // 2-2-2. 데이터 테이블의 마지막 행인 경우
                if( i === this.stateHistory.length - 1 && equipmentState === "Run"){
                  for(let j = 0; j < equipmentFirstRunningDic.length; j++){
                    if(equipmentID !== equipmentFirstRunningDic[j].EQUIPMENTID){
                      const newRowUUid = Math.round(Math.random()*1000000000).toString();
                      runningTime = runningTime + this.calcDate(Utility.setFormatDate(this.sumTodate, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.stateHistory[i].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'));
                      accRunningTime = accRunningTime + runningTime;

                      this.gridData2Calc.push({
                        inEdit: false, 
                        newRow: false,
                        selected: false, 
                        rowStat: "N",
                        _ROWSTATUS: "N",
                        newRowUUid: newRowUUid,
                        idx: this.gridData2Calc.length,
                        EQUIPMENTID: equipmentID,
                        STARTSTATE: equipmentState,
                        STARTSTATENAME: this.stateHistory[i].EQUIPMENTSTATENAME,
                        STARTTIME: this.stateHistory[i].EVENTTIME,
                        ENDSTATE: "Run",
                        ENDSTATENAME: "가동",
                        ENDTIME: this.sumTodate,
                        RUNNINGTIME: this.calcTime(runningTime),
                        ACCRUNNINGTIME: this.calcTime(accRunningTime),
                        AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                      });
                    }
                  }
                }
                runningTime = 0;
                accRunningTime = 0;
                newEquipmentIndex = i;
                if(equipmentState === "Run"){
                    newRunningIndex = i;
                    isEquipmentRunning = true;
                } else {
                    newRunningIndex = -1;
                    isEquipmentRunning = false;
                }
              }
            }
          } else{
            for(let i = 0; i < this.stateHistory.length; i++ ){
              let equipmentID = this.stateHistory[i].EQUIPMENTID;
              let equipmentState = this.stateHistory[i].EQUIPMENTSTATE;
              if(equipmentID === this.stateHistory[newEquipmentIndex].EQUIPMENTID){
                if(equipmentState === "Run" && !isEquipmentRunning){
                  newRunningIndex = i;
                  isEquipmentRunning = true;
                  if(i === this.stateHistory.length - 1){
                    const newRowUUid = Math.round(Math.random()*1000000000).toString();
                    
                    runningTime = runningTime + this.calcDate(Utility.setFormatDate(this.sumTodate, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.stateHistory[i].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'));
                    accRunningTime = accRunningTime + runningTime;

                    this.gridData2Calc.push({
                      inEdit: false, 
                      newRow: false,
                      selected: false, 
                      rowStat: "N",
                      _ROWSTATUS: "N",
                      newRowUUid: newRowUUid,
                      idx: this.gridData2Calc.length,
                      EQUIPMENTID: equipmentID,
                      STARTSTATE: equipmentState,
                      STARTSTATENAME: this.stateHistory[i].EQUIPMENTSTATENAME,
                      STARTTIME: this.stateHistory[i].EVENTTIME,
                      ENDSTATE: "Run",
                      ENDSTATENAME: "가동",
                      ENDTIME: this.sumTodate,
                      RUNNINGTIME: this.calcTime(runningTime),
                      ACCRUNNINGTIME: this.calcTime(accRunningTime),
                      AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                    });
                    runningTime = 0;
                    accRunningTime = 0;
                  }
                } else if(equipmentState !== "Run" && isEquipmentRunning){
                  const newRowUUid = Math.round(Math.random()*1000000000).toString();
                  
                  runningTime = runningTime + this.calcDate(Utility.setFormatDate(this.stateHistory[i].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.stateHistory[newRunningIndex].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'));
                  accRunningTime = accRunningTime + runningTime;

                  this.gridData2Calc.push({
                    inEdit: false, 
                    newRow: false,
                    selected: false, 
                    rowStat: "N",
                    _ROWSTATUS: "N",
                    newRowUUid: newRowUUid,
                    idx: this.gridData2Calc.length,
                    EQUIPMENTID: equipmentID,
                    STARTSTATE: this.stateHistory[newRunningIndex].EQUIPMENTSTATE,
                    STARTSTATENAME: this.stateHistory[newRunningIndex].EQUIPMENTSTATENAME,
                    STARTTIME: this.stateHistory[newRunningIndex].EVENTTIME,
                    ENDSTATE: equipmentState,
                    ENDSTATENAME: this.stateHistory[i].EQUIPMENTSTATENAME,
                    ENDTIME: this.stateHistory[i].EVENTTIME,
                    RUNNINGTIME: this.calcTime(runningTime),
                    ACCRUNNINGTIME: this.calcTime(accRunningTime),
                    AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                  });
                  runningTime = 0;
                  isEquipmentRunning = false;
                }
              } else {
                if(isEquipmentRunning){
                  if( this.stateHistory[i - 1].EQUIPMENTSTATE === "Run" ){
                    const newRowUUid = Math.round(Math.random()*1000000000).toString();
                    
                    runningTime = runningTime + this.calcDate(Utility.setFormatDate(this.sumTodate, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.stateHistory[newRunningIndex].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'));
                    accRunningTime = accRunningTime + runningTime;
                    this.gridData2Calc.push({
                      inEdit: false, 
                      newRow: false,
                      selected: false, 
                      rowStat: "N",
                      _ROWSTATUS: "N",
                      newRowUUid: newRowUUid,
                      idx: this.gridData2Calc.length,
                      EQUIPMENTID: equipmentID,
                      STARTSTATE: this.stateHistory[newRunningIndex].EQUIPMENTSTATE,
                      STARTSTATENAME: this.stateHistory[newRunningIndex].EQUIPMENTSTATENAME,
                      STARTTIME: this.stateHistory[newRunningIndex].EVENTTIME,
                      ENDSTATE: this.stateHistory[i - 1].EQUIPMENTSTATE,
                      ENDSTATENAME: this.stateHistory[i - 1].EQUIPMENTSTATENAME,
                      ENDTIME: this.sumTodate,
                      RUNNINGTIME: this.calcTime(runningTime),
                      ACCRUNNINGTIME: this.calcTime(accRunningTime),
                      AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                    });
                  } else {
                    const newRowUUid = Math.round(Math.random()*1000000000).toString();
                    
                    runningTime = runningTime + this.calcDate(Utility.setFormatDate(this.stateHistory[i - 1].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.stateHistory[newRunningIndex].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'));
                    accRunningTime = accRunningTime + runningTime;
                    this.gridData2Calc.push({
                      inEdit: false, 
                      newRow: false,
                      selected: false, 
                      rowStat: "N",
                      _ROWSTATUS: "N",
                      newRowUUid: newRowUUid,
                      idx: this.gridData2Calc.length,
                      EQUIPMENTID: equipmentID,
                      STARTSTATE: this.stateHistory[newRunningIndex].EQUIPMENTSTATE,
                      STARTSTATENAME: this.stateHistory[newRunningIndex].EQUIPMENTSTATENAME,
                      STARTTIME: this.stateHistory[newRunningIndex].EVENTTIME,
                      ENDSTATE: this.stateHistory[i - 1].EQUIPMENTSTATE,
                      ENDSTATENAME: this.stateHistory[i - 1].EQUIPMENTSTATENAME,
                      ENDTIME: this.stateHistory[i - 1].EVENTTIME,
                      RUNNINGTIME: this.calcTime(runningTime),
                      ACCRUNNINGTIME: this.calcTime(accRunningTime),
                      AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                      // COMMENT: "(설비시작시간2)"+equipmentFirstRunningDic[i].EVENTTIME,
                    });
                  }
                }

                drSelectedArr = [];
                drSelectedArr = this.stateHistory
                .filter(x => x.EQUIPMENTID === equipmentID)
                .map(x => {
                  return {
                    ...x,
                  }
                });

                if(drSelectedArr.length === 1 && equipmentState === "Run"){
                  const newRowUUid = Math.round(Math.random()*1000000000).toString();
                  
                  runningTime = runningTime + this.calcDate(Utility.setFormatDate(this.sumTodate, 'YYYY-MM-DD HH:mm:ss'), Utility.setFormatDate(this.stateHistory[i].EVENTTIME, 'YYYY-MM-DD HH:mm:ss'));
                  accRunningTime = accRunningTime + runningTime;
                  this.gridData2Calc.push({
                    inEdit: false, 
                    newRow: false,
                    selected: false, 
                    rowStat: "N",
                    _ROWSTATUS: "N",
                    newRowUUid: newRowUUid,
                    idx: this.gridData2Calc.length,
                    EQUIPMENTID: equipmentID,
                    STARTSTATE: equipmentState,
                    STARTSTATENAME: this.stateHistory[i].EQUIPMENTSTATENAME,
                    STARTTIME: this.stateHistory[i].EVENTTIME,
                    ENDSTATE: "Run",
                    ENDSTATENAME: "가동",
                    ENDTIME: this.sumTodate,
                    RUNNINGTIME: this.calcTime(runningTime),
                    ACCRUNNINGTIME: this.calcTime(accRunningTime),
                    AVAILABILITY: (accRunningTime / sumTime * 100).toFixed(2),
                    // COMMENT: "(설비시작시간2)"+equipmentFirstRunningDic[i].EVENTTIME,
                  });
                }
                runningTime = 0;
                accRunningTime = 0;
                newEquipmentIndex = i;
                if(equipmentState == "Run"){
                    newRunningIndex = i;
                    isEquipmentRunning = true;
                } else {
                  newRunningIndex = -1;
                  isEquipmentRunning = false;
                }
              }
            }
          }

          let gridData = JSON.parse(JSON.stringify(this.gridData));

          gridData.map(x => {
            this.gridData2Calc.map(y => {
              if(x.EQUIPMENTID === y.EQUIPMENTID){
                gridData[x.idx].AVAILABILITY = this.gridData2Calc[y.idx].AVAILABILITY;
              }
            })

            if(x.AVAILABILITY === undefined){
              gridData[x.idx].AVAILABILITY = "0.00"
            }
          });

          this.gridData = gridData;
        })
      })
    },
    //그리드 로우 클릭
    onRowClick (event) {
      this.gridData2 = [];
      this.click = true;
      this.equipmentidtxt = event.dataItem.EQUIPMENTID;
      this.availabilitytxt = event.dataItem.AVAILABILITY;
      this.gridData2 = this.gridData2Calc
      .filter(x => x.EQUIPMENTID === event.dataItem.EQUIPMENTID)
      .map(x => {
        return {
          ...x
        }
      });
      this.$refs.rowGrid2.skip = 0;
    },
    searchInput(nm, val){
      this[nm] = val;
    },
    toChange(e){
      this.todate = Utility.setFormatDate(e.value, 'YYYYMMDD');
      if(this.todate === Utility.setFormatDate(todate, 'YYYYMMDD')){
        this.sumTodate = Utility.setFormatDate(e.value, 'YYYY-MM-DD HH:mm:ss')
      } else {
        this.sumTodate = Utility.setFormatDate(e.value, 'YYYY-MM-DD') + ' 23:59:59'
      }

    },
    fromChange(e){
      this.fromdate = Utility.setFormatDate(e.value, 'YYYYMMDD');
      this.sumFromdate = Utility.setFormatDate(e.value, 'YYYY-MM-DD') + ' 00:00:00'
    },

    // 092908 163639 Minus
    calcDate(val1, val2, calc){
      let calcDate1 = new Date(val1);
      let calcDate2 = new Date(val2);
      return (calcDate1.getTime()- calcDate2.getTime()) / 1000;
    },
    calcTime(val) {
      // let day = parseInt(val/86400) < 10 ? '0'+ parseInt(val/86400) : parseInt(val/86400);
      let hour = parseInt(val/3600) < 10 ? '0'+ parseInt(val/3600) : parseInt(val/3600);
      let min = parseInt((val%3600)/60) < 10 ? '0'+ parseInt((val%3600)/60) : parseInt((val%3600)/60);
      let sec = val % 60 < 10 ? '0'+val % 60 : val % 60;
      return hour + ":" + min + ":" + sec
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

  }
}

const defaultData = {
};
</script>
<style lang="scss">

</style>