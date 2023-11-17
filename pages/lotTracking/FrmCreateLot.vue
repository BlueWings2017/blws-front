<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>W/O생성</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col cols="4" align="left">
                <v-row class="search-box" align="center" no-gutters>
                  <v-col :cols="2">
                    <Label>
                      <!-- <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon> -->
                      제품코드
                    </Label>
                  </v-col>
                  <v-col :cols="6">
                    <InputText
                      ref="productid"
                      :boxWidth="'98%'"
                      :dataNm="'productid'"
                      :disabled="false"
                      :defaultValue="productid"
                      @input-text-set="searchInput"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                    />
                  </v-col>
                  <v-col :cols="2">
                    <Button :theme-color="'secondary'" :size="'medium'" @click="searchModalVisible = true" >선택</Button>
                  </v-col>
                </v-row>
              </v-col>
              <v-col :cols="8" align="right">
                <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="productCode(initData)">조회</Button>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12" :style="{height : '100%'}">
        <v-row :style="{ height: '100%' }">
          <v-col :cols="12" :class="'divList1'" :style="{ height: '40%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>생성정보</CardTitle>
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" icon="undo" @click="lotCreateCountVisible = true" :disabled="confirm">생성</Button>
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
                    :edit-field="'inEdit'"
                    :isPaging="true"
                    :selected-field="selectedField"
                    :gridDropDownList="gridDropDownList"
                    :checkHeaderArr="checkHeaderArr"
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
          <v-col :cols="12" :class="'divList2'" :style="{ height: '60%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>Lot 목록</CardTitle>
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'secondary'" :size="'small'" icon="delete" @click="delBtn">삭제</Button>
                  </v-col>
                </v-row>
                <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
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
                    :gridDropDownList="gridDropDownList"
                    :checkHeaderArr="checkHeaderArr"
                    @selectionchange="onSelectionchange"
                    @gridrowclick="onRowClick2"
                    @gridddchang="rowDdChange"
                    @griditemchange="griditemchange"
                    @headerselectionchange="onHeaderSelectionChange"
                    @sortChangeHandler="sortChangeHandler2"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
      :callBack="() => searchModalVisible = true"
    />
    <AlertPop 
      ref="alertPop2"
      :is="'alertPop'"
    />
    <SelectModelingConfirm
      ref="SelectModelingConfirm"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="()=>{}"
      @visibleDialog="(val) => searchModalVisible = val"
      @productCode="productCode"
    />
    <LotCreateCount
      ref="LotCreateCount"
      v-if="lotCreateCountVisible"
      :visibleDialog="lotCreateCountVisible"
      :title="'title'"
      :message="'message'"
      :initData=initData
      :callBack="()=>{}"
      @visibleDialog="(val) => lotCreateCountVisible = val"
      @saveBtn="saveBtn"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
// import { Input } from '@progress/kendo-vue-inputs';
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import SelectModelingConfirm from "@/components/frmCreateLot/SelectModelingConfirm";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import LotCreateCount from "@/components/frmCreateLot/LotCreateCount";

let myTitle;
let myMenuId;

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
    Card,
    Button,
    CardBody, 
    CardTitle,
    TreeView,
    KendoGrid,
    InputText,
    Checkbox,
    SelectModelingConfirm,
    MesVariableSelectBox,
    DropDownList,
    MesSelectBox,
    LotCreateCount
  },
  data() {
    return {
      gridHeight : '100px',
      gridHeight2 : '100px',
      gridData : [],
      gridOriData : [],
      gridData2 : [],
      gridOriData2 : [],
      gridLastModIdx: null,
      gridDropDownList:[{
        dataVal : 'AREATYPE',
        dataItem: []
      }],
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'AREANAME',
      },
      checkHeaderArr: ["GOINORDERREQUIRED"],
      parentAreaId: "",
      searchModalVisible: false,
      lotCreateCountVisible: false,
      productid: "",
      departmentid: "",
      areaid: "",
      headerParam: {
        gridid: "dgvConfirm2", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      headerParam2: {
        gridid: "dgvLotList_Create2", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: false,
        noRowstat: true
      },
      initData: { },
      inputcol: ["DEPARTMENT", "DEPARTMENTNAME"],
      inputcol2: ["AREAID", "AREANAME"],
      selectedID:null,
      confirm:true,
      sortField: [{}],
    };
    
  },
  created() {
  },
  async mounted() {
    this.gridHeight = ((this.$refs.contents.offsetHeight * 0.23) - 70) +'px';
    this.gridHeight2 = ((this.$refs.contents.offsetHeight  * 0.77) - 70) +'px';
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper);
    // this.departmentid = this.$refs.comboDepartment.value;
    // this.$refs.comboArea.sendParam.department = this.departmentid;
    // await this.$refs.comboArea.getComboList();
  },
  computed: {
    items () {
      return this.gridData.map((item) => ({ ...item, selected: item.PRODUCTORDERID === this.selectedID }));
    },
  },
  watch: {
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData(data) {

      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotCreateModelingConfirmList2",
        sendParam: {
          plantid: "LS",
          processroutetype: "Main",
          productid: this.productid,
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
        this.gridOriData = data;
        this.gridData = data;
        this.confirm = true;
        
      })

      // this.gridOriData = [data];
      // this.gridData = [data];
    },

    //그리드 데이터 가져오기
    async getGridData2() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotInfoList2",
        sendParam: {
          plantid: "LS",
          productid: this.initData.PRODUCTID,
          productorderid: this.initData.PRODUCTORDERID,
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
        this.gridOriData2 = data;
        this.gridData2 = data;
      })
    },
    //그리드 로우 클릭
    onRowClick (event) {
      this.confirm = false;
      this.gridData.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
      this.initData = event.dataItem;
      this.getGridData2();
    },
    //그리드 로우 클릭
    onRowClick2 (event) {
      console.log("===========onRowClick==============")
      //그리드 로우 클릭시 라인표시 유무 확인필요
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
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
      this.gridData2 = this.gridData2.map((item) => {
        return { ...item, selected: checked };
      });
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem){
      // console.log("===rowDdChange===",e)
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if(name === "GOINORDERREQUIRED") {
        e.value = e.value ? "Yes" : "No";
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

    //삭제버튼
    delBtn(){
      const data = JSON.parse(JSON.stringify(this.gridData2))
      this.gridData2 = data.map(x => {
        if(x.selected){
          return {
            ...x,
            rowStat: "D"
          }
        }
        return x;
      });

      const saveData = this.gridData2.filter(x => x.rowStat !== "N")
      .map(x => {
        return { 
          ...x,
          _ROWSTATUS: x.rowStat,
        }
      });

      if(saveData.length > 0){
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnCreatedLotCancel",
          sendParam: saveData
        }).then(() => {
          this.$nextTick(() => {
            // this.initTree();
            this.$refs.alertPop2.show("Info", "삭제되었습니다.");
            this.productCode(this.initData);
          })
        })
      } else {
        this.$refs.alertPop2.show("알림", "선택한 데이터가 없습니다.");
      }


    },
        selectRow() {
      const returnData = this.items.filter((x) => x.selected);
    },
    // comboChange(nm, val){
    //   this[nm] = val;
    //   if(nm === "departmentid" ){
    //     this.$refs.comboArea.sendParam.department = this.departmentid;
    //     this.$refs.comboArea.getComboList();
    //   }
    // },
    searchInput(nm, val){
      this[nm] = val;
    },
    productCode(data){
      // if(Object.keys(data).length === 0){
      //   this.$refs.alertPop.title = ""
      //   this.$refs.alertPop.message = "제품코드를 선택 후 조회 하세요";
      //   this.$refs.alertPop.modalWidth = "330px";
      //   this.$refs.alertPop.visibleDialog = true;
      //   return;
      // }
      this.productid = data.PRODUCTID;
      // this.confirm = data.CONFIRMFLAG === "Yes" ? true : false;
      // this.$refs.Process.confirmCheck = this.confirm;
      this.$nuxt.$emit('iccReset');
      // this.initData = data;
      // this.$refs.rowGrid.gridItems = data;
      // this.initTree();
      this.getGridData(data);
      // this.areaid = this.$refs.comboArea.value;
      // this.departmentid = this.$refs.comboDepartment.value;
      this.getGridData2();
    },
    createBtn(){
      // this.lotCreateCountVisible = true;
      console.log("================createBtn=================")
    },
    saveBtn(data){
      // let saveData = [];
      // PRODUCTORDERID
      if(data.startquantity === undefined || data.startquantity === "0"){
        this.$refs.alertPop2.show("알림", "저장할 데이터가 존재하지 않습니다.");
      }
      for(let i = 0; i < data.startquantity; i++ ){
        const innerData = this.gridData
        .filter(x => x.selected)
        .map((x, idx) => {
          return { 
            ...x,
            _ROWSTATUS: x.rowStat,
            LOTTYPE: data.lotType,
            STARTQUANTITY: data.productquantity,
            PRODUCTQUANTITY: data.productquantity,
            AREAID: data.areaid,
            DEPARTMENT: data.departmentid,
            WORKORDER: data.workorder,
            PRODUCTORDERID: data.productorderid,
            PRIORITY: data.priority,
          }
        });
        if(innerData.length > 0){
          const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnCreateLot",
            sendParam: innerData
          }).then(() => {
            this.$nextTick(() => {
              if( i === data.startquantity-1){
                this.$refs.alertPop2.show("Info", "저장되었습니다.");
                this.productCode(this.initData);
                console.log(this.initData);
              }
            })
          })
        }
      }
    },
    // sortChangeHandler(e){
    //   const isAscending = e.sort[0]?.dir == "asc";
    //   if(isAscending){
    //     this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
    //   }else{
    //     this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
    //   }
    // },
    // sortChangeHandler2(e){
    //   const isAscending = e.sort[0]?.dir == "asc";
    //   if(isAscending){
    //     this.gridData2 = this.gridData2.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
    //   }else{
    //     this.gridData2 = this.gridData2.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
    //   }
    // },
    //필터정렬
    sortChangeHandler(e){
      this.gfn_sortChangeHandler(this.gridData, e);
    },
    sortChangeHandler2(e){
      this.gfn_sortChangeHandler(this.gridData2, e);
    },

    //조회버튼
    searchBtn(productid) {
      this.$refs.rowGrid.skip = 0;
      this.$refs.rowGrid.sortField = [{}];
        this.getGridData();
    },
  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>