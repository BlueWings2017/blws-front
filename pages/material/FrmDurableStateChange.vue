<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>자재관리</li>
      <li>Durable상태관리</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row>
              <v-col :sm="9" :lg="10" align="left">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>
                      Durable ID
                    </Label>
                      <InputText
                        ref="DURABLEID"
                        :boxWidth="'90%'"
                        :dataNm="'durableid'"
                        :disabled="false"
                        :searchOption="true"
                        :searchFunc="searchBtn"  
                        @input-text-set="searchInput"
                      />
                  </div>
                  <div class="form-group">
                    <Label>
                      Durable상태
                    </Label>
                      <MesVariableSelectBox
                        :style="{ width: '165px', float: 'left'}"
                        :ref="'comboArea2'"
                        :allYN="true"
                        :dataNm="'durablestate'"
                        :queryId="'GetStateDefinitionList'"
                        :sendParam="{
                            plantid: 'LS',
                            stateobject: 'Durable',
                        }"
                        :inputcol="inputcol"
                        @comboChange="comboChange"
                      ></MesVariableSelectBox>
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
    
    <v-row ref="contents" :style="{ height: '100%' }">
      <v-col :cols="12"  :style="{ height: 'calc(50% - 58px)' }">
        <Card ref="gridCard" :style="{ height : '100%'}">
            <CardBody :style="{width:'100%', height : '100%'}">
              <v-row no-gutters>
                <v-col cols="12" align="left">
                  <CardTitle>Durable 목록</CardTitle>
                </v-col>
              </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(88%)' }">
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
                @gridrowclick="onRowClick"
                @sortChangeHandler="sortChangeHandler"
              />
            </div>
            </CardBody>
        </Card>
      </v-col>
      <v-col :cols="12" :class="'divList2'" :style="{ height: 'calc(50% + 58px)' }">
        <Card ref="gridCard2" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="12" align="right">
                <Button :theme-color="'primary'" :size="'small'" icon="save" @click="toggleDialog">저장</Button>
              </v-col>
            </v-row>      
                <div class="detail-area">
                  <div class="left-area" style="display: block; float: left; width: 100% !important;">
                    <div class="area-form">
                      <div class="area-th">
                        <label>Durable ID</label>
                      </div>
                      <div class="area-td area-full">
                        <inputText 
                          ref="intputDurableId"
                          :boxWidth="'100%'"
                          :dataNm="'intputDurableId'"
                          :readonly="true"
                          :defaultValue="intputDurableId"
                          @input-text-set="searchInput"
                        />
                      </div>
                    </div>
                    <div class="area-form">
                      <div class="area-th">
                        <label>현재상태</label>
                      </div>
                      <div class="area-td">
                        <inputText 
                          ref="intputNowStatus"
                          :boxWidth="'100%'"
                          :dataNm="'intputNowStatus'"
                          :readonly="true"
                          :defaultValue="intputNowStatus"
                          @input-text-set="searchInput"
                        />
                      </div>
                      <div class="area-th">
                        <label>변경상태</label>
                      </div>
                      <div class="area-td ">
                        <DropDownList
                          :data-items="filterChangeCodeList"
                          :text-field="'CHANGESTATENAME'"
                          :value-field="'CHANGESTATE'"
                          :value-primitive="true"
                          :default-value="changeStatus"
                          v-model="changeStatus"
                          @change="comboChange"
                        ></DropDownList>
                      </div>
                    </div>
                    <div class="area-form">
                      <div class="area-th">
                        <label>사유코드</label>
                      </div>
                      <div class="area-td area-full">
                        <DropDownList
                          style="width: 265px"
                          :disabled="reasonDisable"
                          :data-items="filterReasonCodeList"
                          :text-field="'DESCRIPTION'"
                          :value-field="'REASONCODE'"
                          :value-primitive="true"
                          :default-value="reasonCode"
                          v-model="reasonCode"
                          @change="comboChange"
                        ></DropDownList>"
                        <!-- <Button :theme-color="'primary'" :size="'medium'" icon="clear" @click="clearBtn">Clear</Button> -->
                      </div>
                    </div>
                    <div class="area-form">
                      <div class="area-th">
                        <label>비고</label>
                      </div>
                      <div class="area-td area-full">
                        <TextArea 
                          :style="{ height: '215px' }"  
                          :auto-size="false"
                          :disabled="textAreaDisabled"
                          v-model="textAreaData"
                        />
                      </div>
                    </div>
                  </div>
                  <div ref="topAreaDivWrapper3" class="right-area" style="display: none; float: right; width: calc(40% - 5px) !important;">
                    <span class="i-msg" style="display: block; padding: 10px 0">※ 더블클릭하여 사유코드를 선택하세요.</span>
                      <div ref="divWrapper3" :style="{height: 'calc(100% - -68px)'}">
                        <KendoGrid 
                            ref="rowGrid3"
                            :gridHeight="gridHeight3"
                            :gridItems="gridData3"
                            :sortable="true"
                            :columns="headerParam3.gridHeader"
                            :resizable="true"
                            :edit-field="'inEdit'"
                            :selected-field="selectedField3"
                            :checkHeaderArr="checkHeaderArr3"
                            @selectionchange="onSelectionchange3"
                            @gridrowclick="onRowClick3"
                            @rowdblclick="rowdblclick3"
                        />
                      </div>
                   </div>
              </div>
            </CardBody>
          </Card>          
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'"/>
      <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" :callBack="()=>{}"/>
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
import utils from "~/plugins/utils";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import DurableSearchModal from "@/components/frmWarehouseStockManagement/DurableSearchModal";
import { mapState, mapMutations, mapActions } from "vuex";
import RoutingSearchModal from "@/components/frmProcessRouteComposition/RoutingSearchModal";
import StandardDurable from "@/components/frmWarehouseStockManagement/StandardDurable.vue"
import DurableList from "@/components/frmDurableStateChange/DurableList.vue"
import InputText from "@/components/common/input/InputText";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import { TextArea } from "@progress/kendo-vue-inputs";


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
    Utility,
    Card,
    Button,
    CardBody, 
    CardTitle,
    TreeView,
    KendoGrid,
    DurableSearchModal,
    RoutingSearchModal,
    StandardDurable,
    DurableList,
    InputText,
    MesSelectBox,
    multiGridHeaderMinin,
    MesVariableSelectBox,
    DropDownList,
    TextArea
  },
  props:{
  },

  data() {
    return {
      toData:{
        durableid: "",
        durablestatename:"",
        reasoncode:"",
        description:"",
      },
      grudHeader: [],
      treeData: [],
      columns: [],
      gridHeight : '400px',
      gridData : [],
      gridData3 : [],
      gridOriData : [],
      gridOriData3 : [],
      initData: {},
      selectedField3: 'selected',
      durableSearchModalVisible: false,
      searchModalVisible: false,
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
      checkHeaderArr3: ["GOINORDERREQUIRED"],
      parentAreaId: "",
      headerParam: {
        gridid: "dgvDurableInfo", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        noFirstCheck: true,
        noRowstat: true,
      },
      headerParam3: {
        gridid: "dgvReasonCode", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      standarddurableid: "",
      DURABLEID: "",
      durabletype: "",
      durablestate: "",
      durablestatename: "",
      description:"",
      inputcol: ["STATE", "STATENAME"],
      inputcol2:["STATE", "STATENAME"],
      gridHeight:"",
      gridHeight2:"",
      gridHeight3:"",
      intputReasonCode : "",
      intputReasonCodeName : "",
      textAreaData: "",
      DESCRIPTION: "",
      intputDurableId: "",
      inputDurableId : "",
      intputNowStatus : "",
      intputAfterStatus:"",
      stateobject: "",
      statusChangeCodeList: [],
      filterChangeCodeList: [],
      filterReasonCodeList: [],
      reasonCodeList: [],
      changeStatus: "",
      changedurablestate:"",
      reasonCode:"",
      reasonCodeType:"",
      textAreaDisabled: false,
      reasonDisable: false
    };
  },
  created() {
    
  },
  async mounted() {
    this.gridHeight = (this.$refs.contents.offsetHeight * 0.65) +'px';
    this.gridHeight2 = (this.$refs.contents.offsetHeight * 0.45) +'px';
    this.gridHeight3 = (this.$refs.contents.offsetHeight * 0.41) +'px';
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam3, this.$refs.divWrapper3);
    await this.getGridData();
    await this.getChangeStatusCombo();
    await this.getReasonCodeCombo();
  },
  computed: {
    areAllSelected() {
      return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
    },
    
  },
  watch: {
  },
  methods: {
    async getChangeStatusCombo() {
      await this.mesGet({
      apiKey: "mes/common/getqueryresult",
      queryId: "GetStateChangePolicyCombo",
      sendParam: {
        plantid: 'LS',
        stateobject: 'Durable',
      }
      }).then((res) => {
        this.statusChangeCodeList = res;
      });
    },

    async getReasonCodeCombo() {
      await this.mesGet({
      apiKey: "mes/common/getqueryresult",
      queryId: "GetReasoncodeList",
      sendParam: {
          plantid: "LS",
          reasoncodetype :"DURABLESTATE",
      }
      }).then((res) => {
        this.reasonCodeList = res;
      });
    },

    searchInput(nm, val){
        this[nm] = val;
        this.searchBtn();
    },

    searchBtn(){
      this.$refs.rowGrid.sortField = [{}];
      this.$refs.rowGrid.skip = 0;
      this.getGridData();
    },

    async getGridData(){
     await this.mesGet({
      apiKey: "mes/common/getqueryresult",
      queryId: "GetOMDurableInfoList",
      sendParam: {
        standarddurableid: this.standarddurableid,
        durableid: this.durableid,
        durabletype: this.durabletype,
        durablestate: this.durablestate,
        plantid: this.plantid,
        description: this.textAreaData
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
            durableid: this.inputDurableId,
          }
        });
        this.$nuxt.$emit('iccReset')
        this.gridOriData = data;
        this.gridData = data;

        this.intputNowStatus = this.gridData[0].DURABLESTATENAME;

        const event = {};
        event.dataItem = this.gridData[0]
        this.onRowClick(event);

        let changeState = "";
          if (
            this.gridData[0].DURABLESTATE == "Created"
          ) {
            changeState = "Released";
            this.intputAfterStatus = changeState;
          }
      });
    },

    //그리드3 데이터 가져오기
    async getGridData3() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReasoncodeList",
        sendParam: {
          plantid: "LS",
          reasoncodetype :"DURABLESTATE",
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
        console.log("data3 ", data)
        this.$nuxt.$emit('iccReset')
        this.gridOriData3 = data;
        this.gridData3 = data;
      })
    },

    saveBtn(){        
        console.log("변경상태:::::::", this.intputAfterStatus);
        console.log("비고::::::::", this.textAreaData);
        const saveData = this.gridData.filter(x => x.DURABLEID == this.intputDurableId)
        .map(x => {
          return { 
            DESCRIPTION: this.textAreaData,
            _ROWSTATUS: x.rowStat,
            REASONCODE: this.reasonCode, // 사유코드 있음
            CHANGEDURABLESTATE: this.changeStatus, // 변경상태
            DURABLEID: this.intputDurableId, // Durable Id 있음
            REASONCODETYPE: this.reasonCodeList,
          }
        });
        console.log("save data ::::::::", saveData);
        if(saveData.length > 0) {
          const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnDurableStateChange",
            sendParam: saveData
            
          }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === "0") {
            // '비고' 값을 변경하고, 다음 렌더링 이후에 그리드를 갱신.
            this.gridData.forEach(item => {
              if (item.DURABLEID == this.intputDurableId) {
                item.DESCRIPTION = this.textAreaData;
              }
            });
            this.textAreaData = '';
            this.$refs.alertPop.show("알림", "저장되었습니다.");
            this.textAreaData = ''; // 저장 후 '비고' clear
            this.searchBtn();
            } else {
              this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
            }
            })
          })
        }
      },

    //그리드 로우 클릭
    onRowClick (event) {
      console.log("===========onRowClick==============")
      this.textAreaData = ''; // 저장 후 '비고' clear
      // //그리드 로우 클릭시 라인표시 유무 확인필요
      this.gridData.forEach(x => x.selected = false);
      event.dataItem[this.selectedField] = true;
      console.log(event.dataItem)
      if(event.dataItem.DURABLESTATENAME != "폐기"){
      this.changeStatus = this.statusChangeCodeList.filter(x => x.RESOURCESTATE === event.dataItem.DURABLESTATE)[0].CHANGESTATE;
      this.intputAfterStatus = this.statusChangeCodeList.filter(x => x.RESOURCESTATE === event.dataItem.DURABLESTATE)[0].CHANGESTATENAME;
      this.filterChangeCodeList = this.statusChangeCodeList.filter(x => x.RESOURCESTATE === event.dataItem.DURABLESTATE);
      this.filterReasonCodeList = this.reasonCodeList
      }else{
        this.changeStatus = ""
        this.intputAfterStatus = ""
      }

      // this.reasonCodeTypeList = this.statusChangeCodeList.filter(x => x.RESOURCESTATE === event.dataItem.REASONCODETYPE);

      // inputArea 박스들에 값넣어주기
      this.intputDurableId = event.dataItem.DURABLEID;
      this.intputNowStatus = event.dataItem.DURABLESTATENAME;

      if(event.dataItem.DURABLESTATE == "Created") {
          this.$refs.topAreaDivWrapper3.style.display = 'none';
          let changeState = "";
          changeState = "Released";
      } else {
        this.$refs.topAreaDivWrapper3.style.display = 'none';

        this.getGridData3(this.changeStatus);
      }
      if (this.intputNowStatus == "사용가능" || this.intputNowStatus == "파손") {
          this.reasonDisable = false;
      } else if (this.intputNowStatus == "오염" || this.intputNowStatus == "생성" || this.intputNowStatus == "폐기" || this.intputNowStatus == "사용중지" ) {
          this.reasonDisable = true;
      } 
    },
    onRowClick3 (event) {
      console.log("===========onRowClick3==============")
    },
    rowdblclick (e) {
    console.log("===========rowdblclick==============")
    this.initData = e.dataItem;
    this.toData.durableid = this.DURABLEID; // Durable ID
    this.toData.durablestatename = this.DURABLESTATENAME; // 현재상태
    this.toData.reasoncode = this.initData.REASONCODE; // 사유코드
    this.toData.description = this.initData.DESCRIPTION; // 사유코드명
  },
    // 그리드 더블 클릭
    rowdblclick3(event) {
        console.log("========= 더블클릭 그리드 3 =========");
        console.log("event.dataItem:::::::::",event.dataItem);
        this.intputReasonCode = event.dataItem.REASONCODE;
        this.intputReasonCodeName = event.dataItem.DESCRIPTION;
    },
    comboChange(nm, val){
      this[nm] = val;


    },
    toggleDialog() {
      if(this.intputNowStatus === "사용가능" && this.reasonCode =="") {
          this.$refs.alertPop.show("알림", "사유입력이 필수 입니다. 사유를 선택해 주시기 바랍니다.");   
      }
      else if(this.intputNowStatus === "파손" && this.reasonCode ==""){
          this.$refs.alertPop.show("알림", "사유입력이 필수 입니다. 사유를 선택해 주시기 바랍니다.");   
      }
      else if(this.intputNowStatus === "폐기"){
          this.$refs.alertPop.show("알림", "상태를 변경할 수 없습니다.");
      } 
      else{
          this.$refs['confirmPop'].title = "POPUP";
          this.$refs['confirmPop'].message = "DurableId (" + this.intputDurableId + ") 의 상태를<br/>" + "<br/>"
                                          + this.intputNowStatus + " -> " + this.intputAfterStatus + " 으로 변경하시겠습니까?";
          this.$refs['confirmPop'].callBack = this.saveBtn;
          this.$refs['confirmPop'].modalWidth = "300px";
          this.$refs['confirmPop'].visibleDialog = true;
      }

    },
    onSelectionchange3 (event) {
      console.log("===========onSelectionchange==============")
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      const durableid = event.dataItem.DURABLEID;
      const rowStat = event.dataItem.rowStat;
      if (druableid != "" && rowStat == "N") {
        this.getGridData(inputDurableId);
      }
    },
    inputBoxReset() {
      this.intputReasonCode = ""; // 사유코드
      this.intputReasonCodeName = ""; // 사유코드명
      this.textAreaData = ""; // 비고
    },
    // sortChangeHandler(e){
    //   const isAscending = e.sort[0]?.dir == "asc";
    //   if(isAscending){
    //     this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
    //   }else{
    //     this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
    //   }
    // } ,
    sortChangeHandler(e){
      this.gfn_sortChangeHandler(this.gridData, e);
    }, 
  }
};
</script>