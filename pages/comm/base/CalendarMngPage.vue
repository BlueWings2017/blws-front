<template>
  <div>
  <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
          <v-row>
            <v-col :cols="4">
              <v-row  align="center">
              <v-col :cols="4">
                <Label>
                  <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                  {{$t('CalendarMngPage.label1')}}
                </Label>
              </v-col>
              <v-col :cols="8">
              <DateInput :style="{ width: '90%' }"
                  :format="'yyyy-MM'"
                  :steps="steps"
                  :spinners="true"
                  v-model="fromDt"
                  @change="search"
              />
              </v-col>
              </v-row>
            </v-col>
            <v-col :cols="8" class="text-right">
                <Button :theme-color="'primary'" @click="search">{{$t('CommLang.btn.selectBtn')}}</Button>
            </v-col>
          </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="4">
        <Card ref="gridCard" :style="{height : '100%'}">
          <CardBody>
            <div class="d-flex align-center justify-space-between pa-2">
            <CardTitle>{{$t('CalendarMngPage.label2')}}</CardTitle>
            <div>
              <Button :theme-color="'primary'" @click="rowGridSave">{{$t('CommLang.btn.saveBtn')}}</Button>
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
      <v-col :cols="8">
        <Card :style="{height : '100%'}">
          <CardBody>
            <div class="d-flex align-center justify-space-between pa-2">
              <CardTitle>{{$t('CalendarMngPage.label3')}}</CardTitle>
            </div>
            <div ref="calWrapper" style="height:90%;">
              <calendar ref="calendar" :navigation="false" :cell="customCell" :style="{width:'100%', height:'100%'}" :value="defaultValue">
                <template v-slot:myCellTemplate="{props}" style="width:100%; height:100%;">
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
                  />
              </template>
              </calendar>
            </div>
          </CardBody>
        </Card>
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
import CustomCalendarCell from '@/components/common/CustomCalendarCell.vue';
import PlanPop from "@/components/common/modal/PlanPop";
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
    PlanPop
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
      defaultValue: null
    };
  },
  computed: {
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
    this.gridHeight = (this.$refs.contents.offsetHeight - 90) +'px';
    this.calCellWidth = (this.$refs.calWrapper.offsetWidth/8) +'px';;
    this.calCellHeight = (this.$refs.calWrapper.offsetHeight/7) +'px';
    //this.calCelWidth = (this.$refs,calendar)
    this.gridInit();
    this.search();
  },
  methods: {
    search(){
      var today = new Date();
      this.defaultValue = new Date(this.fromDt);
      this.gridDataSelect();
    },
    searchSelectValSet(nm,txt, val){
      this[nm] = val;
      this.search();
    },
    searchDateValSet(nm, val){
      this[nm] = Utility.setFormatDate(val,'YYYY-MM-DD');
      
      this.search();
    },
    async onRowClick(event){
      if(event.dataItem){
        this.selectedID = event.dataItem.idx;
        this.selectedData = event.dataItem;
      }
    },
    gridInit(){
      this.columns = [
        { field: 'dt',  editable: false, title: this.$i18n.t('CalendarMngPage.label4'), width: this.setPer("divWrapper",25), cell:"crudCellTemplate", className: "gridTextCenter"  },
        { field: 'dtNm', editable: false, title: this.$i18n.t('CalendarMngPage.label5'),   width: this.setPer("divWrapper",10), className: "gridTextCenter"},
        { field: 'hldyFg', editable: true, title: this.$i18n.t('CalendarMngPage.label6'), width: this.setPer("divWrapper",25), cell:'hldyFg', className: "gridTextCenter"},
        { field: 'hldyNm',     editable: true, title: this.$i18n.t('CalendarMngPage.label7'),    width: this.setPer("divWrapper",35), className: "gridTextLeft"}
      ];
    },
    async gridDataSelect(){
      let res = await this.getListReturn({
        apiKey: "common/calendar/search",
        sendParam : {
          yyyymm: Utility.setFormatDate(this.fromDt,'YYYYMM')
        }
      });
      let res2 = await this.getListReturn({
        apiKey: "common/plan/search",
        sendParam : {
          yyyymm: Utility.setFormatDate(this.fromDt,'YYYYMM')
        }
      });

      for(var i=0; i<res2.length; i++){
        if(!(res2[i].hldyNm == null || res2[i].hldyNm == "토요일" || res2[i].hldyNm == "일요일")){
          for(var j=i+1; j<res2.length; j++){
            if(res2[i].hldyNm == res2[j].hldyNm){
              res2[i].hldyNm = "";
            }
          }
        }  
      }

      res = res.map((item,i) => {
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
      this.planData = res2;
      if(this.gridData.length > 0);
      this.onRowClick({dataItem : this.gridData[0]});
    },
    itemChange: function (e) {
        const data = this.gridData.slice();
        const index = data.findIndex(d => d.idx === e.dataItem.idx);
        data[index] = { ...data[index], [e.field]: e.value };
        if(data[index].rowStat == ''){
          data[index].rowStat = "U";
        }
        this.gridData = data;
    },
    ddChange: function (e, name, dataItem) {
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
      this.$refs['planPop'].planLabel = this.$i18n.t('CalendarMngPage.label8')
      this.$refs['planPop'].popUpAction = 'insert';
      this.$refs['planPop'].strtDt = value;
      this.$refs['planPop'].endDt = value;
      this.$refs['planPop'].visibleDialog = true;
    },
    updateClick: function(val) {
      this.$refs['planPop'].planLabel = this.$i18n.t('CalendarMngPage.label9')
      this.$refs['planPop'].popUpAction = 'update';
      this.$refs['planPop'].planSeq = val;
      this.$refs['planPop'].visibleDialog = true;
    },
    async rowGridSave(){
      let dataArr = [];
      this.gridData.filter(item => {
        if(item.rowStat == "I" || item.rowStat == "U" || item.rowStat == "D"){
          dataArr.push(item);
        }
      });

      dataArr = dataArr.map(item => {
        const dt = item.dt.substr(0,10);
        const newItem = {
          ...item,
          dt: dt,
        };
        return newItem;
      });

      if (dataArr.length > 0) {
        await this.putUpdateReturn({
          apiKey: "common/calendar",
          sendParam: dataArr
        });
        this.search();
      } else {
        this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');;
        this.$refs['alertPop'].message = this.$i18n.t('CommLang.message.msg1');
        this.$refs['alertPop'].modalWidth = "300px";
        this.$refs['alertPop'].visibleDialog = true;
      }
    }
  }
};

const defaultData = {
};
</script>
<style lang="scss">
.k-calendar-view{
  margin: 50px auto !important;
}
</style>