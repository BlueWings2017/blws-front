<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>시스템유지</li>
      <li>Spread관리</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10" align="left">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>GRID ID</label>
                    <InputText
                      ref="gridid"
                      :boxWidth="'100%'"
                      :dataNm="'gridid'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <!-- <Button :theme-color="'primary'" :size="'medium'" @click="initBtn">
                  Grid DB 정보 적용
                </Button> -->
                <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">{{
                  $t('CommLang.btn.selectBtn')
                }}</Button>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <v-row ref="contents">
      <v-col :cols="12" :style="{ height: '100%' }">
        <v-row :class="'divListWapper'" :style="{ height: '50%' }">
          <v-col :cols="12" :class="'divList1'" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ width: '100%' }">
                <v-row>
                  <v-col cols="6" align="left">
                    <CardTitle>GRID 목록</CardTitle>
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">{{
                      $t('CommLang.btn.saveBtn')
                    }}</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'add'"  @click="confirmAdd">추가</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="confirmDel('grid')">삭제</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">undo</Button>
                  </v-col>
                </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData.dgvGridList"
                    :sortable="true"
                    :columns="headerParam.gridHeader"
                    :resizable="true"
                    :isPaging="true"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :checkHeaderArr="headerParam.checkBox"
                    @selectionchange="onSelectionchange('grid', $event)"
                    @gridrowclick="onRowClick"
                    @gridddchang="rowDdChange"
                    @griditemchange="griditemchange"
                    @headerselectionchange="onHeaderSelectionChange('grid', $event)"
                    @sortChangeHandler="sortChangeHandler"  
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
        <v-row :class="'divListWapper'" :style="{ height: '50%' }">
          <v-col :cols="12" :class="'divList2'" :style="{ height: '100%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ width: '100%', height: '100%' }">
                <v-row>
                  <v-col cols="6" align="left">
                    <CardTitle>Column 목록</CardTitle>
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="columnAddBtn">추가</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="confirmDel('column')">삭제</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="columnUndoBtn">undo</Button>
                  </v-col>
                </v-row>
                <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid ref="rowColumnGrid" 
                    :gridHeight="gridHeight"
                    :gridItems="gridData.dgvGridColumnList"
                    :sortable="true"
                    :columns="headerParam2.gridHeader"
                    :resizable="true"
                    :isPaging="true"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :gridDropDownList="headerParam2.enumComboBox"
                    :checkHeaderArr="headerParam2.checkBox"
                    @gridrowclick="onColumnRowClick"
                    @selectionchange="onSelectionchange('column', $event)"
                    @gridddchang="columnRowDdChange"
                    @griditemchange="columnGriditemchange"
                    @headerselectionchange="onHeaderSelectionChange('column', $event)"
                    @sortChangeHandler="columnSortChangeHandler"  
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" 
      :callBack="()=>{}"/>
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import InputText from "@/components/common/input/InputText";

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
  async asyncData(context) {
    const myState = context.store.state;
    console.log(myState);
    myMenuId = context.route.query.menuId;
    await context.store.commit('setActiveMenuInfo', myState.menuData[myMenuId]);
    myTitle = await myState.activeMenuInfo.menuNm;
  },
  meta: {
    title: () => {
      return myTitle;
    },
    menuId: myMenuId,
    closable: true,
  },
  components: {
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    DropDownList,
    InputText
  },
  data() {
    return {
      gridid: "",
      treeData: [],
      gridHeight: '400px',
      gridData: { dgvGridList:[], dgvGridColumnList:[] },
      gridOriData: { dgvGridList: [], dgvGridColumnList: [] },
      gridLastModIdx: null,
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'GRIDID',
      },
      // checkHeaderArr: ['CHECKBOX', 'ROWSTATUS'],
      // checkHeaderArr2: ['VISIBLEFLAG', 'EDITFLAG'],
      // gridDropDownList: [{
      //   dataVal: 'CELLTYPE',
      //   dataItem: []
      // }, {
      //   dataVal: 'ALIGN',
      //   dataItem: []
      // }],
      headerParam: {
        gridid: "dgvGridList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        enumComboBox: [],
        checkBox: []
      },
      headerParam2: {
        gridid: "dgvGridColumnList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        enumComboBox: [],
        checkBox: []
      }
    };
  },
  created() {},
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    //await this.getGridComboList();
    await this.getGridData();
  },
  computed: {
  },
  watch: {
  },
  methods: {
    initScreen() {
      this.gridData.dgvGridList = [];
      this.gridOriData.dgvGridList = [];
      this.gridData.dgvGridColumnList = [];
      this.gridOriData.dgvGridColumnList= [];
      this.$refs.rowGrid.skip = 0;
      this.$refs.rowColumnGrid.skip = 0;
    },
    initBtn() {
      this.getGridInitData();
    },
    searchBtn() {
      // TODO confirm 리팩토링
      const data = this.gridData.dgvGridList.filter(x => x.rowStat != "N");
      const detailData = this.gridData.dgvGridList.filter(x => x.rowStat != "N");
      const len = data.length + detailData.length;
      if(len > 0) {
        this.$refs['confirmPop'].title = "info";
        this.$refs['confirmPop'].message = "저장이 안된 데이터가 존재합니다. 무시하겠습니까?";
        this.$refs['confirmPop'].callBack = this.getGridData;
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
      } else {
        this.getGridData();
      }

    },
    saveBtn(){
      const saveData = this.gridData.dgvGridList.filter(x => x.rowStat !== "N")
      .map(x => {
        return { 
          ...x,
          _ROWSTATUS: x.rowStat,
        }
      });

      if(saveData.length > 0){
        const validate = this.mesValidation(this.headerParam.gridHeader, this.gridData.dgvGridList);
        if (!validate.isValidate) {
          this.$refs.alertPop.show("알림", validate.msg);
          return;
        }
      }
      const saveDetailData = this.gridData.dgvGridColumnList.filter(x => x.rowStat !== "N")
      .map(x => {
        return { 
          ...x,
          _ROWSTATUS: x.rowStat,
        }
      });

      if(saveDetailData.length > 0){
        const validate2 = this.mesValidation(this.headerParam2.gridHeader, this.gridData.dgvGridColumnList);
        if (!validate2.isValidate) {
          this.$refs.alertPop.show("알림", validate2.msg);
          return;
        }
      }

      //console.log(saveData);
      //console.log(saveDetailData);

      const updateCnt = saveData.length + saveDetailData.length;
      if(updateCnt > 0) {
        if(saveData.length > 0){
          const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnGridDefinition",
            sendParam: saveData
          }).then((result) => {
            if(result.returncode !== undefined && result.returncode === "0"){
              if(saveDetailData.length > 0) {
                const res = this.mesPost({
                  apiKey: "mes/common/manage",
                  messagename: "TxnGridDetail",
                  sendParam: saveDetailData
                }).then((result) => {
                  this.$nextTick(() => {
                    if(result.returncode !== undefined && result.returncode === "0"){
                      this.$refs.alertPop.show("알림", "저장되었습니다.");
                      this.getGridData();
                    } else {
                      this.$refs.alertPop.show("ERROR : " + result.code, result.message);
                    }
                  })
                })
              } else {
                this.$refs.alertPop.show("알림", "저장되었습니다.");
                this.getGridData();
              }
            } else {
              this.$refs.alertPop.show("Error : ", result.code, result.message);
            }
          })
        } else {
          if(saveDetailData.length > 0) {
              const res = this.mesPost({
                apiKey: "mes/common/manage",
                messagename: "TxnGridDetail",
                sendParam: saveDetailData
              }).then((result) => {
                this.$nextTick(() => {
                  if(result.returncode !== undefined && result.returncode === "0"){
                    this.$refs.alertPop.show("알림", "저장되었습니다.");
                    this.getGridData();
                  } else {
                    this.$refs.alertPop.show("Error : ", result.code, result.message);
                  }
                })
              })
          }
        }
      } else {
        this.$refs.alertPop.show("알림", "저장할 데이터가 존재하지 않습니다.");
        return;
      }
    },
    //그리드 DB 정보 적용
    async getGridInitData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetGridSettingInit",
        sendParam: {
          plantid: "", // TODO GlobalVariables.g_strPlantID = String.Empty
        },
      }).then((res) => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
          }
        });
        //console.log("dgvGridList ====== ", data)
        this.$nuxt.$emit('iccReset')
        this.gridData.dgvGridList = data;
        this.gridOriData.dgvGridList = JSON.parse(JSON.stringify(data));

        this.getdgvGridColumnListData(this.gridData.dgvGridList[0].GRIDID);
      });

    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.initScreen();
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetGridList",
        sendParam: {
          plantid: "LS",
          gridid: this.gridid,
        },
      }).then((res) => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
          }
        });
        //console.log("dgvGridList ====== ", data)
        this.$nuxt.$emit('iccReset')
        this.gridData.dgvGridList = data;
        this.gridOriData.dgvGridList = JSON.parse(JSON.stringify(data));
        if(data.length > 0){
          this.gridData.dgvGridList[0].selected = true;
          this.getdgvGridColumnListData(this.gridData.dgvGridList[0].GRIDID);
        }
      });

    },
    async getdgvGridColumnListData(gridid) {
      this.gridData.dgvGridColumnList = [];
      this.gridOriData.dgvGridColumnList = [];
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetGridDetailList",
        sendParam: {
          plantid: "LS",
          gridid: gridid,
        },
      }).then((res) => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
          }
        });
        console.log("dgvGridColumnList ====== ", data)
        this.$nuxt.$emit('iccReset')
        this.gridData.dgvGridColumnList = data;
        this.gridOriData.dgvGridColumnList = JSON.parse(JSON.stringify(data));
        if(data.length > 0){
          this.gridData.dgvGridColumnList[0].selected = true;
        }
      });
    },

    //그리드 로우 클릭
    onRowClick(event) {
      //console.log('===========onRowClick==============');
      const data = this.gridData.dgvGridList.filter(x => x.rowStat == "D");
      const detailData = this.gridData.dgvGridColumnList.filter(x => x.rowStat != "N");
      const len = data.length + detailData.length;
      const item = event.dataItem;

      if(len > 0) {
        this.$refs['confirmPop'].title = "info";
        this.$refs['confirmPop'].message = "저장이 안된 데이터가 존재합니다. 무시하겠습니까?";
        this.$refs['confirmPop'].callBack =()=> {
          this.onRowClickCallBack(item, "N")
        };
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
      } else {
        this.onRowClickCallBack(item, "");
      }
    },
    onRowClickCallBack(data, undoStat = "") {
      //console.log('===========onRowClickCallBack==============');
      //그리드 로우 클릭시 라인표시 유무 확인필요
      if(undoStat == "N"){
        this.gridData.dgvGridList.splice(0, this.gridData.dgvGridList.filter(x => x.rowStat == "C").length);
        this.gridData.dgvGridList.forEach(x => {x.selected = false, x.rowStat = "N"})
      } else {
        this.gridData.dgvGridList.forEach(x => x.selected = false)
      }
      data[this.selectedField] = true;
    
      if(data.rowStat != "C"){
        this.getdgvGridColumnListData(data.GRIDID);
      } else {
        const len = this.gridData.dgvGridColumnList.length;
        this.gridData.dgvGridColumnList.splice(0,len);
      }
    },
    //맨앞 checkBox 클릭
    onSelectionchange(id, event) {
      //console.log('===========onSelectionchange==============');
      if(id == 'grid'){
        this.gridData.dgvGridList.forEach(x => x.selected = false)
      } else {
        this.gridData.dgvGridColumnList.forEach(x => x.selected = false)
      }
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      
      if(id == 'grid'){
        this.onRowClick(event);
      }
    },
    //header checkbox 클릭
    onHeaderSelectionChange(id, event) {
      //console.log('===========onHeaderSelectionChange==============');
      let checked = event.event.target.checked;
      if(id == 'grid'){
        this.gridData.dgvGridList = this.gridData.dgvGridList.map(item => {
          return { ...item, selected: checked };
        });
      } else {
        this.gridData.dgvGridColumnList = this.gridData.dgvGridColumnList.map(item => {
          return { ...item, selected: checked };
        });
      }
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      // console.log("===rowDdChange===",e)
      const idx = this.gridData.dgvGridList.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData.dgvGridList));
      
      if(name === "CHECKBOX" || name === "ROWSTATUS") {
        e.value = e.value ? "Yes" : "No";
      }

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' && 
        !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.gridOriData.dgvGridList, idx)
      ) {
        data[idx].rowStat = 'N';
      }

      this.gridData.dgvGridList = data;
    },
    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      //console.log('===griditemchange===', e);
      const data = JSON.parse(JSON.stringify(this.gridData.dgvGridList));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (data[idx].rowStat === 'U' &&
          !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.gridOriData.dgvGridList, idx)
      ) {
        data[idx].rowStat = 'N';
      }

      this.gridData.dgvGridList = data;
    },

    //column 그리드 로우 클릭
    onColumnRowClick(event) {
      //console.log('===========onColumnRowClick==============');
      this.gridData.dgvGridColumnList.forEach(x => x.selected = false);
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //column 그리드 인풋 데이터 변경시
    columnRowDdChange(e, name, dataItem) {
      // console.log("===rowDdChange===",e)
      const idx = this.gridData.dgvGridColumnList.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData.dgvGridColumnList));
      
      if(name === "VISIBLEFLAG" || name === "EDITFLAG") {
        e.value = e.value ? "Yes" : "No";
      }

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (data[idx].rowStat === 'U' && 
          !this.gfn_ChkOriginalData(this.headerParam2.gridHeader, data, this.gridOriData.dgvGridColumnList, idx)
      ) {
        data[idx].rowStat = 'N';
      }

      this.gridData.dgvGridColumnList = data;
    },
    //column 그리드 인풋 데이터 변경시
    columnGriditemchange(e) {
      //console.log('===columnGriditemchange===');
      const data = JSON.parse(JSON.stringify(this.gridData.dgvGridColumnList));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (data[idx].rowStat === 'U' &&
          !this.gfn_ChkOriginalData(this.headerParam2.gridHeader, data, this.gridOriData.dgvGridColumnList, idx)
      ) {
        data[idx].rowStat = 'N';
      }
      this.gridData.dgvGridColumnList = data;
    },
    //그리드 콤보박스 리스트가져오기
    // async getGridComboList() {
    //   await this.mesGet({
    //     apiKey: "mes/common/getqueryresult",
    //     queryId: "GetEnumValue",
    //     sendParam: {
    //       plantid: "LS",
    //       enumid: "CellType"
    //     }
    //   }).then((data) => {
    //       const combo = data.map(x => {
    //         return {
    //           ENUMVALUE: x.ENUMVALUE,
    //           ENUMVALUENAME: x.ENUMVALUENAME,
    //         }
    //       })
    //       this.gridDropDownList[0].dataItem = combo;
    //   }),
    //   await this.mesGet({
    //     apiKey: "mes/common/getqueryresult",
    //     queryId: "GetEnumValue",
    //     sendParam: {
    //       plantid: "LS",
    //       enumid: "align"
    //     }
    //   }).then((data) => {
    //     const combo = data.map(x => {
    //       return {
    //         ENUMVALUE: x.ENUMVALUE,
    //         ENUMVALUENAME: x.ENUMVALUENAME,
    //       }
    //     })
    //     this.gridDropDownList[1].dataItem = combo;
    //   })
    // },
    //undo 버튼 클릭
    undoBtn(){
      this.gridData.dgvGridList = this.gridOriData.dgvGridList.filter(x => x.newRow !== true);
      if(this.gridData.dgvGridList.filter(x => x.selected == true).length < 1){
        this.gridData.dgvGridList[0].selected = true;
        this.getdgvGridColumnListData(this.gridData.dgvGridList[0].GRIDID);
      }
      this.$nuxt.$emit('iccReset');
      if(this.gridData.dgvGridColumnList.length > 0){
        this.columnUndoBtn();
      }
    },
    columnUndoBtn(){
      this.gridData.dgvGridColumnList = this.gridOriData.dgvGridColumnList.filter(x => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
      if(this.gridData.dgvGridColumnList.length > 0){
        this.gridData.dgvGridColumnList.forEach(x => x.selected = false);
        this.gridData.dgvGridColumnList[0].selected = true;
      }
    },

    //추가 버튼 클릭
    confirmAdd() {
      const data = this.gridData.dgvGridList.filter(x => (x.selected == true && x.rowStat == "D") || x.rowStat == "C");
      const detailData = this.gridData.dgvGridColumnList.filter(x => (x.selected == true && x.rowStat == "D") || x.rowStat == "C");
      const len = data.length + detailData.length;
      if(len > 0) {
        this.$refs['confirmPop'].title = "info";
        this.$refs['confirmPop'].message = "저장이 안된 데이터가 존재합니다. 무시하겠습니까?";
        this.$refs['confirmPop'].callBack = ()=> {
          this.gridData.dgvGridList.splice(0, data.filter(x => x.rowStat == "C").length);
          this.addBtn();
        };
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        
      } else {
        this.addBtn();
      }
    },
    addBtn(){
      //삭제한 데이터만 무시
      this.gridData.dgvGridList.filter(x => (x.rowStat == "D" || (x.selected == true && x.rowStat == "N"))).forEach(x => {x.selected = false, x.rowStat = "N"})
  
      //첫번째 페이지로 이동
      this.$refs.rowGrid.skip = 0;

      const newRowUUid = Math.round(Math.random()*1000000000).toString()
      const dataItem = { 
        inEdit: true, 
        newRow: true,
        selected: true, 
        PLANTID: "LS", 
        rowStat: "C",
        _ROWSTATUS: "C",
        newRowUUid: newRowUUid,
        idx: this.gridData.dgvGridList.length,
        CHECKBOX: "No",
        CLASSNAME: "",
        DESCRIPTION : "",
        GRIDID: "",
        GRIDNAME: "",
        HEADERCOLUMNSIZE: "",
        HEADERROWSIZE: "",
        POSITION: "",
        ROWSTATUS: "No"
      };
      //console.log(":::::::", this.gridData.dgvGridList);
      //console.log("dataItems ::::::", dataItem);  
      this.gridData.dgvGridList.splice(0,0,dataItem)
      this.$nuxt.$emit('iccReset')
      
      const len = this.gridData.dgvGridColumnList.length;
      this.gridData.dgvGridColumnList.splice(0,len);
    },
    columnAddBtn(){
      const addData = this.gridData.dgvGridList.filter(x => x.selected == true);
      if(addData.length == 0){
        this.$refs.alertPop.show("알림", "선택된 GridID가 존재하지 않습니다. 조회 및 생성을 먼저한 다음 작업하시기 바랍니다.");
        return;
      }

      const gridid = addData[0].GRIDID;
      //console.log("gridid === ", gridid);
      if(gridid == ""){
        this.$refs.alertPop.show("알림", "상단 그리드의 GridID 항목을 입력 후 추가하세요.");
        return;
      }
      
      //첫번째 페이지로 이동
      this.$refs.rowColumnGrid.skip = 0;

      const newRowUUid = Math.round(Math.random()*1000000000).toString()
      const dataItem = { 
        inEdit: true, 
        newRow: true,
        selected: false, 
        PLANTID: "LS", 
        rowStat: "C",
        _ROWSTATUS: "C",
        newRowUUid: newRowUUid,
        ALIGN:  "",
        CELLTYPE: "",
        CHANGECELLTYPE: "",
        CLASSNAME :addData[0].CLASSNAME,
        COMBOENUMID: "", 
        DESCRIPTION: "",
        EDITFLAG: "No",
        GRIDCOLUMNID:"",
        GRIDCOLUMNNAME: "",
        GRIDCOLUMNSIZE: "100",
        GRIDID: gridid,
        POSITION: "0",
        VISIBLEFLAG: "Yes",
        idx: this.gridData.dgvGridColumnList.length
      };
      //console.log(":::::::", this.gridData.dgvGridList);
      //console.log("dataItems ::::::", dataItem);  
      this.gridData.dgvGridColumnList.splice(0,0,dataItem)
      this.$nuxt.$emit('iccReset')
    },
    //삭제버튼
    confirmDel(grid) {
      var selectedRow = {};

      this.$refs['confirmPop'].title = "info";
      //this.$refs['confirmPop'].message = `선택한 데이터 (${selectedRow}) 를 삭제 하시겠습니까?`;
      if(grid == 'grid'){
        selectedRow = this.gridData.dgvGridList.find(x => x.selected).GRIDNAME
        this.$refs['confirmPop'].callBack = this.delBtn;
      } else { 
        selectedRow = this.gridData.dgvGridColumnList.find(x => x.selected).GRIDCOLUMNID
        this.$refs['confirmPop'].callBack = this.columnDelBtn;
      }
      this.$refs['confirmPop'].message = `선택한 데이터 (${selectedRow}) 를 삭제 하시겠습니까?`;
      this.$refs['confirmPop'].modalWidth = '300px';
      this.$refs['confirmPop'].visibleDialog = true;
    },
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData.dgvGridList));
      const detailData = JSON.parse(JSON.stringify(this.gridData.dgvGridColumnList));
      
      this.gridData.dgvGridList = data
        .filter((x) => !(x.selected && x.rowStat === "C"))
        .map((x) => {
          if (x.selected) {
            return {
              ...x,
              rowStat: "D",
            };
          }
          return x;
        });

      if(this.gridData.dgvGridList.length > 0 && this.gridData.dgvGridList.find(x => x.selected) == undefined){
        this.gridData.dgvGridList[0].selected = true;
      }
      if(detailData.length > 0){
        this.gridData.dgvGridColumnList = detailData.map(item => {
          return { ...item, selected: true };
        });
        this.columnDelBtn();
      }
    },
    columnDelBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData.dgvGridColumnList));
      console.log(data)
      this.gridData.dgvGridColumnList = data
        .filter((x) => !(x.selected && x.rowStat === "C"))
        .map((x) => {
          if (x.selected) {
            return {
              ...x,
              rowStat: "D",
            };
          } 
          return x;
        });
      
      if(this.gridData.dgvGridColumnList.length > 0 && this.gridData.dgvGridColumnList.find(x => x.selected) == undefined){
            console.log(this.gridData.dgvGridColumnList)
        this.gridData.dgvGridColumnList[0].selected = true;
      }
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    sortChangeHandler(e) {
      //파라미터: gridData, event핸들러, 숫자컬럼리스트, 체크컬럼리스트
      this.gfn_sortChangeHandler(this.gridData.dgvGridList, e, undefined, ['CHECKBOX','ROWSTATUS']);
    },
    columnSortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData.dgvGridColumnList, e, ['POSITION'], ['VISIBLEFLAG', 'EDITFLAG']);
    },
  },
};

const defaultData = {};
</script>
</script>
<style lang="scss" scoped>
@media (max-width: 1267px) {
  .divList1 {
    height: 234px !important;
  }
  .divList2 {
    height: 234px !important;
  }
}
</style>
