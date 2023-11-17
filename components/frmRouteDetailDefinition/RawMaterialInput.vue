<template>
  <div :style="{ height: '100%' }">
    <v-row ref="contents">
      <v-col :cols="12" :style="{ height: '100%' }">
        <v-row no-gutters>
          <v-col cols="12" align="right">
            <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveBtn" :disabled="confirm">저장</Button>
            <Button :theme-color="'secondary'" :size="'small'" icon="undo" @click="undoBtn" :disabled="confirm">undo</Button>
          </v-col>
        </v-row>
        <v-row class="divList divList1" :style="{ height: 'calc(100% - 200px)' }" no-gutters>
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
              :gridDropDownList="gridDropDownList"
              @gridrowclick="onRowClick"
              @gridddchang="rowDdChange"
              @griditemchange="griditemchange"
              @selectionchange="onSelectionChange"
              @sortChangeHandler="sortChangeHandler"
              @headerselectionchange="onHeaderSelectionChange"
              />
            </div>
          </v-col>
        </v-row>
        <v-row class="divList" no-gutters>
          <v-col cols="12" align="left">
              <CardTitle>투입지시사항</CardTitle>
          </v-col>
          <v-col cols="12" align="left">
              <TextArea ref="comment" 
              :style="{width:'100%', height:gridHeight2}"
              @input="textAreaChange"
              ></TextArea>
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
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import { 
  TextArea
} from '@progress/kendo-vue-inputs';
import InputText from "@/components/common/input/InputText";
export default {
  name: "RawMaterialInput",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    KendoGrid,
    Button,
    Card,
    CardBody, 
    CardTitle,
    TextArea,
    InputText,
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
    initData:{},
    confirm:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      gridHeader: [],
      gridData : [],
      gridOriData : [],
      selectedField: "selected",
      selectedID: null,
      // disabledCheckHeaderArr: [],
      comment: "",
      gridDropDownList:[{
        dataVal : 'FEEDINGMODE',
        dataItem: []
      }],
      // reasoncodename: "",
      // reasoncode: "",
      // reasoncodetype: "",
      noFirstCheck: false,
      headerParam: {
        gridid: "dgvMaterial", // 그리드 ID
        rowStat: "" //rowStat 표시 여부
      },
      rowClickData:{}
    };
  },
  created() {
  },
  async mounted() {
    await this.getGridComboList();
    // await this.getGridData();
  },
  computed: {
    items() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.CONSUMABLEID === this.selectedID,
      }));
    },
    // areAllSelected() {
    //   return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
    // },
  },
  watch: {
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData(param) {
      this.$nuxt.$emit('iccReset')
      this.gridOriData = JSON.parse(JSON.stringify(param));
      this.gridData = param;
      if(this.gridData.length == 0) {
        this.$refs.comment.currentValue = '';
      }else{
        this.$refs.comment.currentValue = this.gridData[0].FEEDINGDESCRIPTION;
      }
    },

    //그리드 콤보박스 리스트가져오기
    async getGridComboList(){
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValue",
        sendParam: {
          plantid: "LS",
          enumid: "FeedingMode"
        }
      }).then((data) => {
        const combo = data.map(x => {
          return {
            ENUMVALUE: x.ENUMVALUE,
            ENUMVALUENAME: x.ENUMVALUENAME,
          }
        })
        this.gridDropDownList[0].dataItem = combo;
      })
    },

    //그리드 로우 클릭
    onRowClick (e) {
      e.dataItem[this.selectedField] = !e.dataItem[this.selectedField];
      this.rowClickData = e.dataItem;
      this.$refs.comment.currentValue = e.dataItem.FEEDINGDESCRIPTION;
    },
    
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem){
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if(name === "FEEDINGMODE") {
        // e.value = e.value ? "Yes" : "No";
      }

      // if(name === "POSITION"){
      //   e.value = e.value.replace(/[^0-9]/gi, "")
      // }

      data[idx] = {...data[idx], [name]: e.value}
      if(data[idx].rowStat === "N") {
        data[idx].rowStat = "U"; 
      }
      if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
        data[idx].rowStat = "N";
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
      }
      if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
        data[idx].rowStat = "N";
      }

      this.gridData = data;
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx){
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat"
      });
      return chkArr.length > 0;
    },
    
    onSelectionChange(e){
      e.dataItem[this.selectedField] = !e.dataItem[this.selectedField];
      this.rowClickData = e.dataItem;
    },

    //검색 인풋 변경시
    searchInput(nm, val){
      this[nm] = val;
    },
    comboChange(nm, val){
      this[nm] = val;
    },
    chkVal(nm, val){
      this[nm] = val ? "Yes" : "";
    },
    textAreaChange(e){
      let idx = this.gridData.findIndex(x => x.idx === this.rowClickData.idx);
      if(idx == -1) {
        idx = 0;
      }
      this.gridData[idx].FEEDINGDESCRIPTION = e.value;
      this.gridData[idx].rowStat = 'U';
    },
    saveBtn(){
      // let save = true;
      // if(this.rowClickItem === undefined ){
      //   save = false;
      // } else{
      //   if(this.rowClickItem.LEVELVALUE !== "RECIPE"){
      //     save = false;
      //   }
      //   if(this.rowClickItem.RECIPETYPE !== "Consumable"){
      //     save = false;
      //   }
      // }
      let saveCallBackParam = {};
      const saveData = this.gridData
        .filter((x) => x.rowStat !== "N")
        .map((x) => {
          return {
            ...x,
            ROCCOMPOSITIONID: x.ROCCOMPOSITIONID,
            FEEDINGDESCRIPTION: x.FEEDINGDESCRIPTION,
            _ROWSTATUS: x.rowStat
          };
        });
      
      if(saveData.length > 0){
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnConsumableConditionSet",
          sendParam: saveData
        }).then(() => {
          this.$nextTick(() => {
            saveCallBackParam = {
              title: "Info",
              message: "저장되었습니다."
            }
            this.$emit("saveCallBack", saveCallBackParam);
            this.$emit("searchBtn", this.initData);
          })
        })
      } else {
        saveCallBackParam = {
          title: "알림",
          message: "저장할 데이터가 없습니다."
        }
        this.$emit("saveCallBack", saveCallBackParam);
      }
    },
    undoBtn(){
      if(this.gridData.length > 0){
        this.gridData = JSON.parse(JSON.stringify(this.gridOriData));
        this.$emit("initTree", true);
      } else {
        const saveCallBackParam = {
            title: "알림",
            message: "그리드 데이터가 없습니다."
        }
        this.$emit("saveCallBack", saveCallBackParam);
      }
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
<style lang="scss">

</style>