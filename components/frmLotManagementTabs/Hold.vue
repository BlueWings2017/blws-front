<template>
  <div :style="{ height: '100%' }">
      <v-row ref="contents" >
        <v-col :sm="8" :lg="9" :class="'divList1'" :style="{ height: '100%' }">
          <Card :style="{height: '100%'}">
            <CardBody :style="{height: '100%'}">
              <v-row>
                <v-col cols="3">
                  <CardTitle>Lot 목록</CardTitle>
                </v-col>
                <v-col cols="9" align="right">
                  <Button :theme-color="'primary'" :size="'small'" icon="save" @click="this.saveBtn">저장</Button>
                </v-col>
              </v-row>
              <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
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
                  :gridDropDownList="gridDropDownList"
                  :disabledCheckHeaderArr="disabledCheckHeaderArr"
                  @selectionchange="onSelectionchange"
                  @gridrowclick="onRowClick"
                  @gridddchang="rowDdChange"
                  @griditemchange="griditemchange"
                  @headerselectionchange="onHeaderSelectionChange"
                  @sortChangeHandler="sortChangeHandler"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
        <v-col :sm="4" :lg="3" :class="'divList1'" :style="{ height: '100%' }">
          <Card :style="{height: '100%'}">
            <CardBody :style="{height:'100%'}">
              <v-row
                class="divList divList2"
                :style="{ height: 'calc(100% - 217px)' }"
                no-gutters
              >
                <v-col cols="12" class="" align="left">
                  <CardTitle
                    >사유코드 목록<span class="i-msg"
                      >사유코드 : {{ reasoncodename }}</span
                    ></CardTitle
                  >
                </v-col>
                <v-col cols="12" class="" :style="{ height: '100%' }">
                  <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                    <KendoGrid 
                    ref="rowGrid2"
                    :gridHeight="gridHeight2"
                    :gridItems="items"
                    :sortable="true"
                    :columns="headerParam2.gridHeader"
                    :resizable="true"
                    :isPaging="true"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :disabledCheckHeaderArr="disabledCheckHeaderArr"
                    @selectionchange="onSelectionchange"
                    @gridrowclick="onRowClick2"
                    @gridddchang="rowDdChange"
                    @cellClick="cellClick"
                    @griditemchange="griditemchange"
                    @headerselectionchange="onHeaderSelectionChange"
                    />
                  </div>
                </v-col>
              </v-row>
              <v-row ref="gridCard2" class="divList divList3" no-gutters>
                <v-col cols="12" align="left">
                  <CardTitle>Comment</CardTitle>
                </v-col>
                <v-col cols="12" align="left">
                  <TextArea
                    ref="comment"
                    :style="{ width: '100%', height: '170px' }"
                    @input="textAreaChange"
                  ></TextArea>
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
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
import { 
  Input,
  TextArea
} from '@progress/kendo-vue-inputs';
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
export default {
  name: "Hold",
  mixins: [mixinGlobal, multiGridHeaderMinin],
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
    TextArea
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
    gridHeight3:{
      type: String,
      defaultData: "250px"
    },
    viewParam:{
        lotid:"",
        productid:"",
        fromdete:"",
        todate:"",
        holdstate:""
    }
  },
  data() {
    return {
      gridData : [],
      gridOriData : [],
      gridData2 : [],
      gridOriData2 : [],
      gridDropDownList:[
      ],
      selectedField: 'selected',
      disabledCheckHeaderArr: ["GOINORDERREQUIRED"],
      processid: "",
      processname: "",
      classification: "",
      processtype: "",
      headerParam: {
        gridid: "dgvLotList_Management", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: false,
        noRowstat: true
      },
      headerParam2: {
        gridid: "dgvReasonCode", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      gridRowData : [],
      gridRowData2 : [],
      reasoncodename : "",
      reasoncode : "",
      reasoncodetype : "",
      comment : "",
      selectedID : null
    };
  },
  created() {
  },
  async mounted() {
    
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    // await this.getHeaderMulti(headerParam);
    // await this.getHeaderMulti(headerParam2);
    await this.getGridComboList();
    await this.getGridData();
    await this.getGridData2();
  },
  computed: {
    items() {
      return this.gridData2.map((item) => ({
        ...item,
        selected: item.REASONCODE === this.selectedID,
      }));
    },
  },
  watch: {
  },
  methods: {
    searchBtn(){
      this.getGridData();
      this.getGridData2();
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotSearchList_Hold",
        sendParam: {
          plantid: "LS",
          lotid: this.viewParam.lotid,
          productid: this.viewParam.productid,
          fromdate: this.viewParam.fromdate,
          todate: this.viewParam.todate,
          holdstate: this.viewParam.holdstate
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
        })
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset')
        this.gridOriData = data;
        this.gridData = data;
      })
    },

    //그리드 데이터 가져오기
    async getGridData2() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReasoncodeList",
        sendParam: {
          plantid: "LS",
          reasoncode: "",
          reasoncodetype: ""
        }
      }).then((res) => {
        const data = res.filter(x => x.REASONCODETYPE === "HOLD")
        .sort((a, b) => a.POSITION - b.POSITION)
        .map((x, idx) => {
        return { 
          ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false
        }
      });
        this.$nuxt.$emit('iccReset')
        this.gridOriData2 = data;
        this.gridData2 = data;
        if(this.reasoncodename === '') {
          this.reasoncodename = data[0].DESCRIPTION;
        }
        this.reasoncode = data[0].REASONCODE;
        this.reasoncodetype = data[0].REASONCODETYPE;
        this.gridRowData2 = data[0];
      })
    },

    saveBtn(){
      const saveData = this.gridData.filter(x => x.selected)
      .map(x => {
        return { 
          ...x,
          rowStat: "U",
          _ROWSTATUS: "U",
          REASONCODETYPE: this.gridRowData2.REASONCODETYPE,
          REASONCODE: this.gridRowData2.REASONCODE,
          COMMENT: this.comment,
        }
      });

      if(saveData.length > 0){
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnLotHold",
          sendParam: saveData
        }).then(() => {
          this.$nextTick(() => {
            this.getGridData();
            this.$emit('saveCallBack', true);
          })
        })
      } else {
        this.$emit('saveCallBack', false);
      }

    },

    //그리드 로우 클릭
    onRowClick (event) {
      this.gridRowData = event.dataItem;
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    //그리드 로우 클릭
    onRowClick2 (event) {
      console.log(event.dataItem)
      this.selectedID = event.dataItem.REASONCODE;
      this.reasoncodename = event.dataItem.DESCRIPTION;
      this.gridRowData2 = event.dataItem;
      //그리드 로우 클릭시 라인표시 유무 확인필요
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    //맨앞 checkBox 클릭
    onSelectionchange (event) {
      // console.log("===========onSelectionchange==============")
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange (event) {
      // console.log("===========onHeaderSelectionChange==============")
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map((item) => {
        return { ...item, selected: checked };
      });
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem){
      // console.log("===rowDdChange===",e)
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));
      if(name === "ACTIVESTATE") {
        e.value = e.value ? "Active" : "Inactive";
      }
      
      if(name === "PROCESSTYPE"){
        //PROCESSTYPE 공정구분 에따라 
        //PACKINGFLAG	포장구분 변하는것 추가
      }

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
      console.log("===griditemchange===",e)
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

    //그리드 콤보박스 리스트가져오기
    async getGridComboList(){
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValue",
        sendParam: {
          plantid: "LS",
          enumid: "ProcessType"
        }
      }).then((data) => {
        // this.gridDropDownList[0].dataItem = data;
      })
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
    searchInput(nm, val){
      this[nm] = val;
    },
    textAreaChange(e){
      this.comment = e.value;
    },
    cellClick(e){
      console.log(e)
    },
    sortChangeHandler(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    },

  }
};

const defaultData = {
};
</script>
<style lang="scss" scoped>
@media (max-width: 1267px) {
  .divList1 {
    height: 1100px !important;
  }
  .divList2 {
    height: 700px !important;
  }
  .divList3 {
    height: 300px !important;
  }
}
</style>