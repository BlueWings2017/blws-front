<template>
  <div>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-col cols="12" align="right">
              <label style="float: left; margin-top: 5px; margin-right: 5px;">샘플링ID : </label>
              <!-- <input v-model="intputSamplingId" placeholder="샘플링ID를 입력하세요."/> -->
              <inputText
                  ref="intputSamplingId"
                  :boxWidth="'100%'"
                  :dataNm="'intputSamplingId'"
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
                <CardTitle>샘플링 기준정보</CardTitle>
              </v-col>
              <v-col cols="6" align="right">
                <Button icon="add" @click="addBtn">추가</Button>
                <Button icon="delete" @click="delBtn">삭제</Button>
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
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
// import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
// import utils from "~/plugins/utils";

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
    Utility,
    Card,
    Button,
    CardBody, 
    CardTitle,
    // TreeView,
    KendoGrid,
    InputText
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
          dataVal : 'SAMPLINGTYPE',
          dataItem: []
        },
        {dataVal : 'SAMPLINGMETHOD',
          dataItem: []
        }],
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'DESCRIPTION',
      },
      checkHeaderArr: ["GOINORDERREQUIRED"],
      intputSamplingId : "",
      headerParam: {
        gridid: "dgvSamplingDefinition", // 그리드 ID
        rowStat: "" //rowStat 표시 여부
      },
      gridHeader: []
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
    // 조회버튼 클릭
    searchBtn(){
      this.getGridData();
    },
    // 저장버튼 클릭
    saveBtn(){
      const saveData = this.gridData.filter(x => x.rowStat != "")
      .map(x => {
        return { 
          ...x,
          _ROWSTATUS: x.rowStat,
        }
      });

      console.log(saveData)
      if(saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnSamplingDefinition",
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
        queryId: "GetSamplingDataList",
        sendParam: {
          plantid: "LS",
          samplingid : this.intputSamplingId
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
        console.log("data ====== ", data)
        this.$nuxt.$emit('iccReset')
        this.gridOriData = data;
        this.gridData = data;
      })
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

      
      data[idx] = {...data[idx], [name]: e.value}
      if(data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
        data[idx].rowStat = "N";
      }

      if(name === "SAMPLINGMETHOD") {
        if(e.value == "LotNumber") {
          // e.target.find(x => x.field === "SAMPLINGCHECK").editable = true;
          // console.log("::::::::::", e.target.field.SAMPLINGMETHOD.editable = true);
          console.log("랏넘버클릭");
          data[idx] = {...data[idx], changeCellType: "combo"}
        }else{
          data[idx] = {...data[idx], changeCellType: "input"}
        }
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

    onRowClick(event) {
      console.log("로우셀렉티드:::", event);
    },

    //트리 데이터 가져오기
    // async initTree() {
    //   const res = await this.mesGet({
    //     apiKey: "mes/common/getqueryresult",
    //     queryId: "GetAreaList",
    //     sendParam: {
    //       SUPERAREAID: "",
    //       plantid: "LS"
    //     }
    //   });
    //   const data = res.map(x => ({...x, expanded: true}))
    //   this.treeData = utils.makeTreeData(data);
    // },
    //트리 확장
    // onExpandChange(event) {
    //   event.item.expanded = !event.item.expanded;
    // },
    //트리 클릭
    // onItemClick(event){
    //   this.getGridData(event.item.AREAID); // 데이터 없을경우 NullPointerException
    //   this.parentAreaId = event.item.AREAID;
    // },
    //그리드 콤보박스 리스트가져오기
    async getGridComboList(){
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValueList",
        sendParam: {
          plantid: "LS",
          enumid: "SamplingType"
        }
      }).then((data) => {
        const combo = data.filter(x => x.ENUMID === 'SamplingType')
        .map(x => {
          return {
            ENUMVALUE: x.ENUMVALUE,
            ENUMVALUENAME: x.ENUMVALUENAME,
          }
        })
        this.gridDropDownList[0].dataItem = combo;
      }),
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValueList",
        sendParam: {
          plantid: "LS",
          enumid: "SamplingMethod"
        }
      }).then((data) => {
        const combo = data.filter(x => x.ENUMID === 'SamplingMethod')
        .map(x => {
          return {
            ENUMVALUE: x.ENUMVALUE,
            ENUMVALUENAME: x.ENUMVALUENAME,
          }
        })
        this.gridDropDownList[1].dataItem = combo;
      })
    },
    //unbo 버튼 클릭
    undoBtn(){
      const data = JSON.parse(JSON.stringify(this.gridData))
      this.gridData = data.map(x => {
        if(x.selected){
          if(!x.newRow){
            const item = this.gridOriData.filter(ori => ori.SAMPLINGID === x.SAMPLINGID);
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
      console.log(":::::::", this.gridData);
      console.log("dataItems ::::::", dataItem);  
      this.gridData.splice(0,0,dataItem)
      this.$nuxt.$emit('iccReset')
    },
    //삭제버튼
    delBtn(){
      const data = JSON.parse(JSON.stringify(this.gridData))
      this.gridData = data.map(x => {
        if(x.selected){
          return {
            ...x,
            rowStat: "D"
          }
        }
        return x;
      });
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