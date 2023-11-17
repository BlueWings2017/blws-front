<template>
  <div>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-col cols="12" align="right">
              <label style="float: left; margin-top: 5px; margin-right: 5px;">연결코드 : </label>
              <inputText
                  ref="inputPolicyCode"
                  :boxWidth="'100%'"
                  :dataNm="'inputPolicyCode'"
                  :disabled="false"
                  @input-text-set="searchInput"
                  style="float: left;"
                />
              <Button icon="search" @click="searchBtn">조회</Button>
              <Button icon="save" @click="saveBtn">저장</Button>
            </v-col>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12">
        <Card ref="gridCard" :style="{height : '100%'}">
          <CardBody :style="{width:'100%'}">
            <v-row>
              <v-col cols="6" align="left">
                <CardTitle>샘플링 설정</CardTitle>
              </v-col>
              <v-col cols="6" align="right">
                <Button icon="add" @click="addBtn">추가</Button>
                <Button icon="delete">삭제</Button>
                <Button icon="undo" @click="undoBtn">undo</Button>
              </v-col>
            </v-row>
            <div ref="divWrapper">
              <KendoGrid 
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="gridHeader"
                :resizable="false"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="gridDropDownList"
                :checkHeaderArr="checkHeaderArr"
                @selectionchange="onSelectionchange"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @headerselectionchange="onHeaderSelectionChange"
                @gridButtonClick="gridButtonClick"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    <SelectSamplingDefinitionModal
      ref="SelectSamplingDefinitionModal"
      v-if="SelectSamplingDefinitionModalVisible"
      :visibleDialog="SelectSamplingDefinitionModalVisible"
      :gridData="selectSamplingDefinitionModalData"
      title="샘플링 목록"
      :inputVal="inputVal"
      @visibleDialog="(val) => SelectSamplingDefinitionModalVisible = val"
      @selectedRow="selectedRow"
      @cancelRow="cancelRow"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import Utility from "~/plugins/utility";
import { Input } from '@progress/kendo-vue-inputs';
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
// import SelectSamplingDefinitionModal from "@/components/frmSamplingPolicy/SelectSamplingDefinitionModal";

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, gridHeaderMinin],
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
    Input,
    Utility,
    Card,
    Button,
    CardBody, 
    CardTitle,
    // TreeView,
    KendoGrid,
    InputText,
    SelectSamplingDefinitionModal
  },
  data() {
    return {
      treeData: [],
      columns: [],
      gridHeight : '100px',
      gridData : [],
      gridOriData : [],
      gridLastModIdx: null,
      gridDropDownList:[{
          dataVal : 'PROCESSID',
          dataItem: []
        }
        // ,
        // {dataVal : 'EQUIPMENTID',
        //   dataItem: []
        // }
      ],
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'DESCRIPTION',
      },
      checkHeaderArr: ["GOINORDERREQUIRED"],
      inputPolicyCode : "",
      headerParam: {
        gridid: "dgvSamplingPolicy", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        // gridBtnStat: ""
      },
      gridHeader: [],
      SelectSamplingDefinitionModalVisible: false,
      selectSamplingDefinitionModalData: [],
    };
  },
  created() {
  },
  async mounted() {
    this.gridHeight = (this.$refs.contents.offsetHeight - 180) +'px';
    
    await this.getGridComboList();
    await this.getGridData();
  },
  computed: {
    areAllSelected() {
      return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
    },
  },
  watch: {
  },
  methods: {
    searchBtn(){
      this.getGridComboList();
      this.getGridData();
    },
    saveBtn(){
      const saveData = this.gridData.filter(x => x.rowStat === "U")
      .map(x => {
        return { 
          ...x,
          _ROWSTATUS: x.rowStat
        }
      });

      console.log(saveData)
      if(saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnSamplingPolicy",
          sendParam: saveData
        }).then(() => {
        this.$nextTick(() => {
          this.getGridData();
          })
        })
      }

    },
    //그리드 데이터 가져오기
    async getGridData(treeId="") {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetSamplingPolicyList",
        sendParam: {
          plantid: "LS",
          prolcycode : this.inputPolicyCode,
        }
      }).then((res) => {
         const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            // gridBtnStat: "S"
          }
        });
        this.$nuxt.$emit('iccReset')
        this.gridOriData = data;
        this.gridData = data;
      })
    },

    //그리드 콤보박스 리스트가져오기
    async getGridComboList(){
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProcessTypeMeasureList",
        sendParam: {
          // PROCESSTYPE: 'Measure'
        }
      }).then((data) => {
          const combo = data.map(x => {
          return {
              ENUMVALUE: x.PROCESSID,
              ENUMVALUENAME: x.PROCESSNAME,
          }
          })
          console.log("comboList::::", combo);
          console.log("this.gridDropDownList[0]", this.gridDropDownList[0])
          this.gridDropDownList[0].dataItem = combo;
      })
      // await this.mesGet({
      //   apiKey: "mes/common/getqueryresult",
      //   queryId: "GetEquipmentTypeMeasurementList",
      //   sendParam: {
      //     plantid: "LS"
      //   }
      // }).then((data) => {
      //     const combo = data.map(x => {
      //     return {
      //         ENUMVALUE: x.EQUIPMENTID,
      //         ENUMVALUENAME: x.EQUIPMENTNAME,
      //     }
      //     })
      //     console.log("comboList22222::::", combo);
      //     this.gridDropDownList[1].dataItem = combo;
      // })
    },

    //그리드 로우 클릭
    onRowClick (event) {
      console.log("===========onRowClick==============")
      //그리드 로우 클릭시 라인표시 유무 확인필요
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //맨앞 checkBox 클릭
    onSelectionchange (event) {
      console.log("===========onSelectionchange==============")
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange (event) {
      console.log("===========onHeaderSelectionChange==============")
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map((item) => {
        return { ...item, selected: checked };
      });
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem){
      console.log("===rowDdChange===",e)
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData)); 

      if(name === "GOINORDERREQUIRED") {
        e.value = e.value ? "Yes" : "No";
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
      console.log("===griditemchange===")
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

    
    //unbo 버튼 클릭
    undoBtn(){
      const data = JSON.parse(JSON.stringify(this.gridData))
      this.gridData = data.map(x => {
        if(x.selected){
          if(!x.newRow){
            const item = this.gridOriData.filter(ori => ori.AREAID === x.AREAID);
            return item[0];
          }
        }else{
          return x
        }
      }).filter(x => !!x)
      this.$nuxt.$emit('iccReset')
    },
    //추가 버튼 클릭
    addBtn(){
      const dataItem = { 
        inEdit: true, 
        newRow: true,
        selected: false, 
        PLANTID: "LS", 
        rowStat: "C",
        idx: this.gridData.length
      };
      this.gridData.splice(0, 0, dataItem)
      this.$nuxt.$emit('iccReset')
    },

    //그리드 버튼 클릭
    gridButtonClick(e, field ,dataItem){
      if(field === "SAMPLINGBUTTON"){
        // this.selectSamplingDefinitionModalData = this.gridData.filter(x => x.idx > dataItem.idx);
        // if(this.currentGridData.length === 0){
        //   this.$refs.alertPop.title = ""
        //   this.$refs.alertPop.message = "현재 마지막 공정입니다.";
        //   this.$refs.alertPop.modalWidth = "330px";
        //   this.$refs.alertPop.visibleDialog = true;
        //   return 
        // }
        // this.btnClickRow = dataItem;
        // this.inputVal = dataItem.PROCESSNAME
        this.SelectSamplingDefinitionModalVisible = true;
      }else{
        // this.btnClickRow = dataItem;
        // this.defaultDescription = dataItem.DESCRIPTION;
        this.SelectSamplingDefinitionModalVisible = true;
      }
    },

    //검색 인풋
    searchInput(nm, val) {
      this[nm] = val;
    },
  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>