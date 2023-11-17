<template>
  <div :style="{ height: '100%' }">
    <v-row ref="contents">
      <v-col :cols="12" :style="{ height: '100%' }">
        <v-row no-gutters>
          <v-col cols="4" align="left">
            <Button :theme-color="'primary'" :size="'small'" @click="searchBtn(initData)" :disabled=true>제품군라우팅불러오기</Button>
          </v-col>
          <v-col cols="8" align="right">
            <Button :theme-color="'primary'" :size="'small'" icon="save" @click="this.saveBtn" :disabled="confirm">저장</Button>
            <Button :theme-color="'secondary'" :size="'small'" icon="add" @click="this.addBtn" :disabled="confirm">추가</Button>
            <Button :theme-color="'secondary'" :size="'small'" icon="delete" @click="this.delBtn" :disabled="confirm">삭제</Button>
            <Button :theme-color="'secondary'" :size="'small'" icon="undo" @click="this.undoBtn" :disabled="confirm">undo</Button>
          </v-col>
        </v-row>
        <v-row class="divList divList1" no-gutters>
          <v-col cols="12" class="" :style="{ height: 'calc(100% - 33px)' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoGrid 
              ref="rowGrid"
              :gridHeight="gridHeight"
              :gridItems="gridData"
              :sortable="true"
              :columns="gridHeader"
              :resizable="true"
              :edit-field="'inEdit'"
              :isPaging="true"
              :selected-field="selectedField"
              :checkHeaderArr="checkHeaderArr"
              @gridrowclick="onRowClick"
              @selectionchange="onSelectionChange"
              @gridddchang="rowDdChange"
              @griditemchange="griditemchange"
              @sortChangeHandler="sortChangeHandler"
              @headerselectionchange="onHeaderSelectionChange"
              />
            </div>
          </v-col>
        </v-row>
        <v-row class="divList" no-gutters>
          <v-col :cols="6">
            <v-row>
              <v-col :cols="3">
                <Label>
                  Spec구분
                </Label>
              </v-col>
              <v-col :cols="3" align="center">
                <Label>
                  하한값
                </Label>
              </v-col>
              <v-col :cols="3" align="center">
                <Label>
                  목표값
                </Label>
              </v-col>
              <v-col :cols="3" align="center">
                <Label>
                  상한값
                </Label>
              </v-col>
            </v-row>
            <v-row>
              <v-col :cols="3">
                <MesSelectBox
                  ref="comboSpecType"
                  :enumID="'SpecType'"
                  :allYN="false"
                  :dataNm="'comboSpecType'"
                  @comboChange="comboChange"
                ></MesSelectBox>
              </v-col>
              <v-col :cols="3">
                <InputText
                ref="lowerspeclimit"
                :boxWidth="'98%'"
                :dataNm="'lowerspeclimit'"
                :disabled="lowerspeclimitdisabled"
                :defaultValue="lowerspeclimit"
                @input="onInput"
                />
              </v-col>
              <v-col :cols="3">
                <InputText
                ref="target"
                :boxWidth="'98%'"
                :dataNm="'target'"
                :disabled="targetdisabled"
                :defaultValue="target"
                @input="onInput"
                />
              </v-col>
              <v-col :cols="3">
                <InputText
                ref="upperspeclimit"
                :boxWidth="'98%'"
                :dataNm="'upperspeclimit'"
                :disabled="upperspeclimitdisabled"
                :defaultValue="upperspeclimit"
                @input="onInput"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col :cols="3" align="right">
                <Label>
                  Control Limit
                </Label>
              </v-col>
              <v-col :cols="3">
                <InputText
                ref="lowercontrollimit"
                :boxWidth="'98%'"
                :dataNm="'lowercontrollimit'"
                :disabled="false"
                :defaultValue="lowercontrollimit"
                @input="onInput"
                />
              </v-col>
              <v-col :cols="3">
              </v-col>
              <v-col :cols="3">
                <InputText
                ref="uppercontrollimit"
                :boxWidth="'98%'"
                :dataNm="'uppercontrollimit'"
                :disabled="false"
                :defaultValue="uppercontrollimit"
                @input="onInput"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col :cols="3" align="right">
                <Label>
                  Screen Limit
                </Label>
              </v-col>
              <v-col :cols="3">
                <InputText
                ref="lowerscreenlimit"
                :boxWidth="'98%'"
                :dataNm="'lowerscreenlimit'"
                :disabled="false"
                :defaultValue="lowerscreenlimit"
                @input="onInput"
                />
              </v-col>
              <v-col :cols="3">
              </v-col>
              <v-col :cols="3">
                <InputText
                ref="upperscreenlimit"
                :boxWidth="'98%'"
                :dataNm="'upperscreenlimit'"
                :disabled="false"
                :defaultValue="upperscreenlimit"
                @input="onInput"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col :cols="1">
          </v-col>
          <v-col :cols="5">
            <v-row>
              <v-col :cols="12">
                <Label>
                  작업지시상세설명
                </Label>
              </v-col>
            </v-row>
            <v-row>
              <v-col :cols="12">
                <TextArea ref="comment" 
                  :style="{width:'100%', height:gridHeight2}"
                  @input="textAreaChange"></TextArea>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
import { 
  TextArea
} from '@progress/kendo-vue-inputs';
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { xCircleIcon } from '@progress/kendo-svg-icons';
import moment from "moment";

export default {
  name: "ProcessConditionSetting",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Card,
    Button,
    CardBody, 
    CardTitle,
    TreeView,
    KendoGrid,
    InputText,
    Checkbox,
    MesSelectBox,
    DropDownList,
    TextArea,
    moment
  },
  props:{
    gridHeight:{
      type: String,
      defaultData: "500px"
    },
    gridHeight2:{
      type: String,
      defaultData: "250px"
    },
    viewData:[],
    initData:{},
    clickTreeData:{},
    addBtn: {
      type: Function,
      default: () => true
    },
    delBtn: {
      type: Function,
      default: () => true
    },
    undoBtn: {
      type: Function,
      default: () => true
    },
    saveBtn: {
      type: Function,
      default: () => true
    },
    confirm:{
      type: Boolean,
      default: false,
    },
    treeClickTime:{
      type: String,
      default: '',
    }
  },
  data() {
    return {
      gridHeader: [],
      gridData : [],
      gridOriData : [],
      gridDropDownList:[
      ],
      selectedField: 'selected',
      // checkHeaderArr: ["GOINORDERREQUIRED"],
      comment: "",
      selectedID:null,

      noFirstCheck: false,
      headerParam: {
        gridid: "dgvRecipeParameter", // 그리드 ID
        rowStat: "" //rowStat 표시 여부
      },

      checkHeaderArr: ["CTPFLAG"],

      lowerspeclimit:"", // 하한값
      lowercontrollimit:"", // 특별관리 하한값
      lowerscreenlimit:"", // 제외할 하한값
      target:"", // 목표값
      upperspeclimit:"",// 상한값
      uppercontrollimit:"", // 특별관리 상한값
      upperscreenlimit:"", // 제외할 상한값
      targetcontrol:"",	// 특별관리 목표값 (사용여부확인필요)
      comboSpecType:"", // 조건구분
      lowerspeclimitdisabled:true, // 하한값 disabled
      targetdisabled:true, // 목표값 disabled
      upperspeclimitdisabled:true, // 상한값 disabled
      rowClickData:{},
      rowClickTime:'',
      treeClickInitChk:false
    };
  },
  created() {
  },
  async mounted() {
    // await this.getGridComboList();
    await this.getGridData(this.viewData);
   
  },
  computed: {    
  },
  watch: {
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData(param) {
      this.$nuxt.$emit('iccReset')
      this.gridOriData = JSON.parse(JSON.stringify(param));
      this.gridData = param;
      if(this.clickTreeData.item !== undefined){
        this.treeClickInitChk = true;
        this.gridData = this.gridData
        .map(x => {
          if(x.RECIPEPARAMETERID === this.clickTreeData.item.PROCESSID && x.COMPOSITIONID === this.clickTreeData.item.UIKEY){
              this.lowerspeclimit = x.LOWERSCREENLIMIT;
              this.target = x.TARGET;
              this.upperspeclimit = x.UPPERSPECLIMIT;
              this.lowercontrollimit = x.LOWERSCREENLIMIT;
              this.uppercontrollimit = x.UPPERCONTROLLIMIT;
              this.lowerscreenlimit = x.LOWERSCREENLIMIT;
              this.upperscreenlimit = x.UPPERSCREENLIMIT;
              this.$refs.comment.currentValue = x.DESCRIPTION;
            return { 
              ...x,
              selected : true
            }
            
          } else {
            return {
              ...x
            }
          }
        });
      }else{
        if(this.gridData.length == 0) {
          this.$refs.comment.currentValue = '';
        }else{
          this.$refs.comment.currentValue = this.gridData[0].DESCRIPTION;
        }
      }

    },
    //그리드 로우 클릭
    onRowClick (e) {
      this.treeClickInitChk = false;
      let today = moment();
      today = today.format('HHmmss');
      this.rowClickTime = today;
      e.dataItem[this.selectedField] = !e.dataItem[this.selectedField];
      this.rowClickData = e.dataItem;
      this.lowerspeclimit = this.rowClickData.LOWERSPECLIMIT; // 하한값
      this.lowercontrollimit = this.rowClickData.LOWERSPECLIMIT; // 특별관리 하한값
      this.lowerscreenlimit = this.rowClickData.LOWERSCREENLIMIT; // 제외할 하한값
      this.target = this.rowClickData.TARGET; // 목표값
      this.upperspeclimit = this.rowClickData.UPPERSPECLIMIT; // 상한값
      this.uppercontrollimit = this.rowClickData.UPPERCONTROLLIMIT; // 특별관리 상한값
      this.upperscreenlimit = this.rowClickData.UPPERSCREENLIMIT; // 제외할 상한값
      this.comboSpecType = this.rowClickData.SPECTYPE;
      this.$refs.comboSpecType.comboVal = this.rowClickData.SPECTYPE;
      this.$refs.comment.currentValue = e.dataItem.DESCRIPTION;

    },
    
    //검색 인풋 변경시
    searchInput(nm, val){
      this[nm] = val;
      
    },
    comboChange(nm, val){
      this[nm] = val;

      if(this[nm] === "None"){ // 미설정
        this.lowerspeclimitdisabled =  true; // 하한값 disabled
        this.targetdisabled = true; // 목표값 disabled
        this.upperspeclimitdisabled = true; // 상한값 disabled
      } else if(this[nm] === "Spec"){ // 하한-목표-상한
        this.lowerspeclimitdisabled =  false; // 하한값 disabled
        this.lowerspeclimit = "";
        this.targetdisabled = false; // 목표값 disabled
        this.target = "";
        this.upperspeclimitdisabled = false; // 상한값 disabled
        this.upperspeclimit = "";
      } else if(this[nm] === "Range"){ // 하한-상한
        this.lowerspeclimitdisabled =  false; // 하한값 disabled
        this.lowerspeclimit = "";
        this.targetdisabled = true; // 목표값 disabled
        this.upperspeclimitdisabled = false; // 상한값 disabled
        this.upperspeclimit = "";
      } else if(this[nm] === "Fix" || this[nm] === "MoreThan" || this[nm] === "OrUnder" || this[nm] === "Result"){ // 목표값 고정, 목표값보다 크게, 목표값보다 작게, 결과값입력
        this.lowerspeclimitdisabled =  true; // 하한값 disabled
        this.targetdisabled = false; // 목표값 disabled
        this.target = "";
        this.upperspeclimitdisabled = true; // 상한값 disabled
      }

      this.valueChange(val, nm);
    },
    onInput(e, nm){
      this[nm] = e.target.value;
      this.valueChange(e.target.value, nm);
    },
    chkVal(nm, val){
      this[nm] = val ? "Yes" : "";
    },
    textAreaChange(e){
      this.comment = e.value;
      this.valueChange(e.value, "comment");
    },
    onSelectionChange(e){ 
      e.dataItem[this.selectedField] = !e.dataItem[this.selectedField];
      this.rowClickData = e.dataItem;
      this.lowerspeclimit = this.rowClickData.LOWERSPECLIMIT; // 하한값
      this.lowercontrollimit = this.rowClickData.LOWERSPECLIMIT; // 특별관리 하한값
      this.lowerscreenlimit = this.rowClickData.LOWERSCREENLIMIT; // 제외할 하한값
      this.target = this.rowClickData.TARGET; // 목표값
      this.upperspeclimit = this.rowClickData.UPPERSPECLIMIT; // 상한값
      this.uppercontrollimit = this.rowClickData.UPPERCONTROLLIMIT; // 특별관리 상한값
      this.upperscreenlimit = this.rowClickData.UPPERSCREENLIMIT; // 제외할 상한값
      this.comboSpecType = this.rowClickData.SPECTYPE;
      this.$refs.comboSpecType.comboVal = this.rowClickData.SPECTYPE;
      this.$refs.comment.currentValue = e.dataItem.DESCRIPTION;
    },


    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem){
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if(name === "CTPFLAG") {
        e.value = e.value ? "Yes" : null;
        if(e.value === "No"){
          e.value = null;
        }
      }

      data[idx] = {...data[idx], [name]: e.value}
      if(data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
        data[idx]._ROWSTATUS = "U";
      }
      if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
        data[idx].rowStat = "N";
        data[idx]._ROWSTATUS = "N";
      }

      this.gridData = data;
    },
    
    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);

      data[idx] = { ...data[idx], [e.field]: e.value };
      if(data[idx].rowStat === "N"){
        data[idx].rowStat = "U";
        data[idx]._ROWSTATUS = "U";
      }
      if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
        data[idx].rowStat = "N";
        data[idx]._ROWSTATUS = "N";
      }

      this.gridData = data;
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx){
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return this.parseNullOrUndefinedToBlank(data[idx][x]) !== this.parseNullOrUndefinedToBlank(this.gridOriData[idx][x]) && x !== "rowStat" && x !== "_ROWSTATUS"
      });

      return chkArr.length > 0;
    },
    valueChange(val, nm){
       let idx;
       // 트리에서 클릭했을 때
       if(this.treeClickInitChk || Number(this.treeClickTime) > Number(this.rowClickTime)){
         let treeClickData = this.gridData
         .filter(x => this.clickTreeData.item.UIKEY === x.COMPOSITIONID && this.clickTreeData.item.PROCESSID === x.RECIPEPARAMETERID)
           .map(x => {
             return { 
               ...x,
             }
           });
         idx = treeClickData[0].idx;       
       // Row 클릭 했을 때
       }else{
         idx = this.gridData.findIndex(x => x.idx === this.rowClickData.idx);
        if(idx < 0) {
          idx = 0;
        }
       }
      const data = JSON.parse(JSON.stringify(this.gridData));
      let name = "";

      if(nm === "lowerspeclimit"){
        name = "LOWERSPECLIMIT";
      }
      if(nm === "lowercontrollimit"){
        name = "LOWERCONTROLLIMIT";
      }
      if(nm === "lowerscreenlimit"){
        name = "LOWERSCREENLIMIT";
      }
      if(nm === "target"){
        name = "TARGET";
      }
      if(nm === "upperspeclimit"){
        name = "UPPERSPECLIMIT";
      }
      if(nm === "uppercontrollimit"){
        name = "UPPERCONTROLLIMIT";
      }
      if(nm === "upperscreenlimit"){
        name = "UPPERSCREENLIMIT";
      }
      if(nm === "comboSpecType"){
        name = "SPECTYPE";
      }
      if(nm === "comment"){
        name = "DESCRIPTION";
      }
      const value = val === "" ? null : val;

      data[idx] = {...data[idx], [name]: value}

      if(data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
        data[idx]._ROWSTATUS = "U";
      }
      if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
        data[idx].rowStat = "N";
        data[idx]._ROWSTATUS = "N";
      }

      this.gridData = data;

      // let sum = this.lowerspeclimit + this.lowercontrollimit + this.lowerscreenlimit + this.target + this.upperspeclimit + this.uppercontrollimit + this.upperscreenlimit;
      // console.log(sum)
      // if(this.gridData.length > 0){
      //   this.gridData = this.gridData
      //   .map(x => {
      //     if(x.COMPOSITIONID === this.rowClickData.COMPOSITIONID && x.RECIPEPARAMETERID === this.rowClickData.RECIPEPARAMETERID){
      //       return { 
      //         ...x,
      //         // rowStat: "U",
      //         // _ROWSTATUS: "U",
      //         LOWERSPECLIMIT : this.lowerspeclimit,
      //         LOWERCONTROLLIMIT : this.lowercontrollimit,
      //         LOWERSCREENLIMIT : this.lowerscreenlimit,
      //         TARGET : this.target,
      //         UPPERSPECLIMIT : this.upperspeclimit,
      //         UPPERCONTROLLIMIT : this.uppercontrollimit,
      //         UPPERSCREENLIMIT : this.upperscreenlimit,
      //       }
      //     } else {
      //       return {
      //         ...x
      //       }
      //     }
      //   });
      // }
    },
    sortChangeHandler(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map(item => {
        return { ...item, selected: checked };
      });
    }
  }
};

const defaultData = {
};
</script>
<style lang="scss" scoped>
@media (max-width: 1267px) {
  .divList1 {
    height: 800px !important;
  }
}
@media (min-width: 1268px) {
  .divList1 {
    height: 430px !important;
  }
}
</style>