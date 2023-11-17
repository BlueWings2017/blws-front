<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>라우팅상세설정</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="8" :lg="9">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>
                      제품코드
                    </Label>
                    <InputText
                      ref="productid"
                      :dataNm="'productid'"
                      :readonly="true"
                      :defaultValue="productid"
                      @input-text-set="searchInput"
                    />
                    <Button :theme-color="'primary'" :size="'medium'" @click="searchModalVisible = true" >선택</Button>
                  </div>
                  <div class="form-group" style="margin-left: 48px">
                    <InputText
                    ref="productname"
                    :dataNm="'productname'"
                    :readonly="true"
                    :defaultValue="productname"
                    @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group" style="margin-left: 48px">
                    <div class="i-msg" style="color:red" v-if="confirm">확정된 데이터이므로 수정할수 없습니다.</div>
                  </div>
                </div>
              </v-col>
              <v-col :sm="4" :lg="3" align="right">

                <!-- <Button
                  :theme-color="'secondary'"
                  :size="'medium'"
                  :class="'btn-modal'"
                  @click="popDetailView()"
                ></Button> -->
                <!-- <Button :theme-color="'primary'" :size="'medium'" @click="leftBtn()">◀</Button> -->
                <!-- <Button :theme-color="'primary'" :size="'medium'" @click="rightBtn()">▶</Button> -->
                <!-- 기존 초기화 버튼 주석처리 2023.03.29 -->
                <!-- <Button :theme-color="'primary'" :size="'medium'" icon="undo" @click="resetBtn()">초기화</Button> -->
                <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="searchBtn(initData)">조회</Button>
                <!-- <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveBtn" :disabled="confirm">저장</Button> -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12">
        <!-- <v-row :style="{ height: '20%' }">
          <v-col
            :sm="12"
            :lg="12"
            :class="'divListWapper'"
            :style="{ height: '100%' }"
          >
            <Card :style="{height : '100%'}">
              <CardBody :style="{ width: '100%', height: '100%' }">
                <div ref="divWrapper" :style="{ height: '100%' }">
                  <KendoGrid 
                    ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData"
                    :sortable="true"
                    :columns="gridHeader"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :disabledCheckHeaderArr="disabledCheckHeaderArr"
                    @gridrowclick="onRowClick"
                    @gridddchang="rowDdChange"
                    @griditemchange="griditemchange"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row> -->
        <v-row :style="{ height: '100%' }">
          <v-col
            :sm="3"
            :class="'divListWapper col-3-1qtr'"
            :style="{ height: '100%' }"
          >
            <Card :style="{height : '100%'}">
              <CardBody :style="{width:'100%', height: '100%'}">
                <div ref="divWrapper" :style="{ height: '100%' }">
                  <KendoTree
                  ref="treeView"
                  :treeData="treeData"
                  :textField="'PROCESSNAME'"
                  :icon="'icon'"
                  :activeItem="treeActiveItem"
                  @onExpandChange="onExpandChange"
                  @onItemClick="onItemClick"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
          <v-col :sm="1" :class="'col-0-half'">
            <div :class="'btn-cell-move'">
              <Button
                :theme-color="'secondary'"
                :class="'btn-cell-right'"
                :disabled="confirm"
                @click="rightBtn"
              ></Button>
              <Button
                :theme-color="'secondary'"
                :class="'btn-cell-left'"
                :disabled="confirm"
                @click="leftBtn"
              ></Button>
            </div>
          </v-col>
          <v-col
            :sm="8"
            :class="'divListWapper col-8-1qtr'"
            :style="{ height: '100%' }"
          >
            <Card :style="{height : '100%'}">
              <CardBody :style="{width:'100%', height: '100%'}">
                <TabStrip
                  :selected="selected"
                  @select="onSelect"
                  :tabs="tabs"
                  :style="{ width: '100%' , height: '100%'}"
                >
                  <template v-slot:RawMaterialInput>
                    <RawMaterialInput
                      ref="RawMaterialInput"
                      :gridHeight="gridHeight3"
                      :gridHeight2="gridHeight4"
                      :initData="initData"
                      :confirm="confirm"
                      @searchBtn="searchBtn"
                      @saveCallBack="saveCallBack"
                      @initTree="initTree"
                    />
                  </template>
                  <template v-slot:ProcessConditionSetting>
                    <ProcessConditionSetting
                      v-if="v1"
                      ref="ProcessConditionSetting"
                      :gridHeight="gridHeight5"
                      :gridHeight2="gridHeight4"
                      :viewData="gridData3"
                      :initData="initData"
                      :addBtn="addBtn"
                      :delBtn="delBtn"
                      :undoBtn="undoBtn"
                      :saveBtn="saveBtn"
                      :confirm="confirm"
                      :clickTreeData="clickTreeData"
                      @searchBtn="searchBtn"
                      :treeClickTime="treeClickTime"
                    />
                  </template>
                </TabStrip>
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
    <ConfirmPop ref="confirmPop" 
      :is="'confirmPop'" 
      :visibleDialog = false />

    <SelectModelingConfirm
      ref="SelectModelingConfirm"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="()=>{}"
      @visibleDialog="(val) => searchModalVisible = val"
      @searchBtn="searchBtn"
      @saveCallBack="saveCallBack"
      />
      
      <SelectRecipeParameter
      ref="SelectRecipeParameter"
      v-if="searchModalVisible2"
      :visibleDialog="searchModalVisible2"
      :title="'title'"
      :message="'message'"
      :callBack="()=>{}"
      @visibleDialog="(val) => searchModalVisible2 = val"
      @addData="addData"
    />
    <DetailView ref="detailView" :is="'detailView'" 
      :header="gridHeader"
      :item="initData"
    />
    <div v-if="isLoading" class="loading-container" :style="{'z-index': '999999', position: 'relative'}">
      <div class="loading">
        <FadeLoader />
      </div>
    </div>
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle, TabStrip } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import InputText from "@/components/common/input/InputText";
import utils2 from "~/plugins/utils2";
// import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import SelectModelingConfirm from "@/components/frmRouteDetailDefinition/SelectModelingConfirm";
import SelectRecipeParameter from "@/components/frmRouteDetailDefinition/SelectRecipeParameter";
import RawMaterialInput from "@/components/frmRouteDetailDefinition/RawMaterialInput";
import ProcessConditionSetting from "@/components/frmRouteDetailDefinition/ProcessConditionSetting";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import DetailView from "@/components/common/DetailView";
import KendoTree from '@/components/common/KendoTree';
import moment from "moment";
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
    menuId : myMenuId,
    closable: true
  },
  components: {
    Utility,
    Card,
    Button,
    CardBody, 
    CardTitle,
    TabStrip,
    KendoGrid,
    InputText,
    RawMaterialInput,
    ProcessConditionSetting,
    SelectModelingConfirm,
    SelectRecipeParameter,
    // TreeView,
    FadeLoader,
    DetailView,
    KendoTree,
    moment
  },
  data() {
    return {
      gridHeader: [
        {field: "PRODUCTGROUPID", editable: false, title: "제품군", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes" },
        {field: "ACTIVESTATE", editable: true, title: "BOM활성", minWidth: 50, cell: "ACTIVESTATE", className: "gridTextCenter", VISIBLEFLAG: "Yes" },
        {field: "BOMID", editable: false, title: "BOMID", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes" },
        {field: "BOMVERSION", editable: false, title: "BOM버전", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes" },
        {field: "POLICYTYPE", editable: false, title: "제품/제품군", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes" },
        {field: "PROCESSROUTEID", editable: false, title: "라우팅코드", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes" },
        {field: "POLICYNAME", editable: false, title: "Policy 명", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes" },
        {field: "POLICYVALUE", editable: false, title: "Policy 값", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes" },
        {field: "CONDITIONTYPE", editable: false, title: "조건구분", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes" },
        {field: "CONDITIONID", editable: false, title: "조건ID", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes" }
      ],
      gridData : [],
      gridOriData : [],
      gridData2 : [],
      gridOriData2 : [],
      gridData3 : [],
      gridOriData3 : [],

      gridLastModIdx: null,

      // gridDropDownList:[{
      //   dataVal : 'AREATYPE',
      //   dataItem: []
      // }],
      selectedField: 'selected',


      expand: {
        ids: [],
        idField: 'AREANAME',
      },

      disabledCheckHeaderArr: ["ACTIVESTATE"],

      parentAreaId: "",

      productid: "",
      productname: "",
      processrouteid: "",

      bomid: "",
      bomversion: "",
      policyname: "",
      policyvalue: "",
      conditiontype: "",
      conditionid: "",

      confirm: false,
      processData: [],
      stepData: [],
      selected: 0,
      tabs: [
        {title: "원료투입", content: "RawMaterialInput"},
        {title: "공정조건설정", content: "ProcessConditionSetting"},
      ],

      treeData: [],
      tempData: [],

      gridHeight : '100px',
      gridHeight2 : '100px',
      gridHeight3: (window.innerHeight || document.body.clientHeight)/5*2 + "px",
      gridHeight4: (window.innerHeight || document.body.clientHeight)/18*2 + "px",
      gridHeight5: (window.innerHeight || document.body.clientHeight)/7*2 + "px",

      v1: false,
      v2: false,
      searchModalVisible: false,
      searchModalVisible2: false,

      firstSearch:false,

      initData: {},
      clickTreeData: {},
      isLoading: true,
      treeActiveItem: {},
      treeClickTime:''
    };
  },
  created() {
  },
  async mounted() {
    this.gridHeight = (this.$refs.contents.offsetHeight * 0.15) +'px';
    this.gridHeight2 = (this.$refs.contents.offsetHeight * 0.75) +'px';
    this.isLoading = false;
    // await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    // await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    // await this.getGridComboList();
    // await this.getGridData();
  },
  computed: {
  },
  watch: {
  },
  methods: {
    popDetailView() {
      this.$refs.detailView.show("제품 상세보기", "700px", "230px");
    },
    async searchBtn(data){
      
      this.isLoading = false;
      this.clickTreeData = {};
      if(Object.keys(data).length === 0){
        this.$refs.alertPop.title = ""
        this.$refs.alertPop.message = "라우팅 상세설정을 할 제품정보를 선택해 주시기 바랍니다.";
        this.$refs.alertPop.modalWidth = "330px";
        this.$refs.alertPop.visibleDialog = true;
        return;
      }

      // this.lotid = data.LOTID;
      
      this.confirm = data.CONFIRMFLAG === "Yes" ? true : false;
      // this.$refs.Process.confirmCheck = this.confirm;
      this.$nuxt.$emit('iccReset');
      this.initData = data;
      this.gridOriData = [data];
      this.gridData = [data];
      this.productname = data.PRODUCTNAME;
      this.processrouteid = data.PROCESSROUTEID;
      this.productid = data.PRODUCTID;
      this.bomid= data.BOMID;
      this.bomversion= data.BOMVERSION;
      this.policyname= data.POLICYNAME;
      this.policyvalue= data.POLICYVALUE;
      this.conditiontype= data.CONDITIONTYPE;
      this.conditionid= data.CONDITIONID;

      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetConsumableConditionMaterialList",
        sendParam: {
          plantid: "LS",
          productid: this.initData.PRODUCTID,
          bomid: this.initData.BOMID,
          bomversion: this.initData.BOMVERSION
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
        this.gridData2 = data;
        this.gridOriData2 = JSON.parse(JSON.stringify(data));
      });

      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetTPCPolicyList",
        sendParam: {
          plantid: "LS",
          processrouteid: this.initData.PROCESSROUTEID,
          productid: this.initData.PRODUCTID,
          bomid: this.initData.BOMID,
          bomversion: this.initData.BOMVERSION
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
        this.$nuxt.$emit('iccReset')
        this.gridData3 = data;
        this.gridOriData3 = JSON.parse(JSON.stringify(data));
      });
      await this.initTree(false);
    },
    //트리 데이터 가져오기
    async initTree(reset) {
      this.isLoading = false;
      let res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetConsumableConditionSetTree",
        sendParam: {
          plantid: "LS",
          productid: this.productid,
          bomid: this.bomid,
          bomversion: this.bomversion,
          policyname: this.policyname,
          policyvalue: this.policyvalue,
          ConditionType: this.conditiontype, // 수정해야할 듯 ConditionType >> conditiontype
          conditionid: this.conditionid,
        }
      });

      res = res.map((x, idx) => {
        return {
          ...x,
          icon: x.LEVELVALUE
        }
      });
      res.unshift({
        UIKEY: "",
        UIVALUE: this.processrouteid,
        PROCESSID: this.processrouteid,
        PROCESSNAME: this.processrouteid,
        icon: "PROCESSROUTE",
        SEQ:"100,000"
      });

      if(!reset){
        this.gridData2.filter(x => x.ROCCOMPOSITIONID !== null)
        .map((x, idx) => {
          res.unshift({
            UIVALUE: x.CONSUMABLEID,
            UIKEY: x.ROCCOMPOSITIONID,
            PROCESSID: x.CONSUMABLEID,
            PROCESSNAME: x.CONSUMABLENAME,
            SEQ: x.FEEDINGRATE,
            LEVELVALUE: "CONSUMABLE",
            icon: "CONSUMABLE",
            STAT:"N"
          })
        });
  
        this.gridData3.filter(x => x.COMPOSITIONID !== null)
        .map((x, idx) => {
          res.unshift({
            UIVALUE: x.RECIPEPARAMETERNAME,
            UIKEY: x.COMPOSITIONID,
            PROCESSID: x.RECIPEPARAMETERID,
            PROCESSNAME: x.RECIPEPARAMETERNAME,
            SEQ: x.ORDERINDEX,
            LEVELVALUE: "RECIPEPARAMETER",
            icon: "RECIPEPARAMETER",
            STAT:"N"
          })
        });
      }


      // this.tempData.filter(x => x.ROCCOMPOSITIONID !== null)
      // .map((x, idx) => {
      //   res.unshift({
      //     UIVALUE: x.UIVALUE,
      //     UIKEY: x.UIKEY,
      //     PROCESSID: x.PROCESSID,
      //     PROCESSNAME: x.PROCESSNAME,
      //     SEQ: x.SEQ,
      //     LEVELVALUE: "CONSUMABLE"
      //   })
      // });

      const data = res.sort((a, b) => a.SEQ - b.SEQ).map(x => ({ ...x, expanded: true }))
      this.treeData = utils2.makeTreeData(data, 'UIVALUE', 'UIKEY');

      await this.$refs.RawMaterialInput.getGridData(this.gridData2, this.clickTreeData);
      if(this.v1){
        await this.$refs.ProcessConditionSetting.getGridData(this.gridData3, this.clickTreeData);
      }

      this.firstSearch = true;
    },
    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },
    //트리 클릭
    onItemClick(event){
      this.treeActiveItem = event.item;
      this.clickTreeData = event;
      this.$refs.RawMaterialInput.clickTreeData = event;
      let today = moment();
      today = today.format('HHmmss');
      this.treeClickTime = today;
      if(this.clickTreeData.item.LEVELVALUE === "RECIPE"){ // 스텝
        this.selected = 0;
      }
      if(this.clickTreeData.item.LEVELVALUE === "RECIPEPARAMETER"){
        this.selected = 1;
        if(this.selected === 1 && !this.v1){
          if(!this.firstSearch){
            this.$refs.alertPop.title = ""
            this.$refs.alertPop.message = "라우팅 상세설정을 할 제품정보를 선택해 주시기 바랍니다.";
            this.$refs.alertPop.modalWidth = "330px";
            this.$refs.alertPop.visibleDialog = true;
            this.selected = 0;
            return;
          } else {
            this.v1 = !this.v1;
          }
        } else {
          this.$refs.ProcessConditionSetting.gridData
          .filter(x => x.rowStat === "N")
          .map(x => {
            if(this.clickTreeData.item.UIKEY === x.COMPOSITIONID && this.clickTreeData.item.PROCESSID === x.RECIPEPARAMETERID){
              let processSetGrid = this.$refs.ProcessConditionSetting.$refs;
              let clickGridData = this.$refs.ProcessConditionSetting.gridData[x.idx];
              let today = moment();
              today = today.format('HHmmss');
              this.$refs.ProcessConditionSetting.gridData[x.idx].selected = !this.$refs.ProcessConditionSetting.gridData[x.idx].selected;
              this.treeClickTime = today;
              // 트리 클릭시 spce구분 ~ 작업지시상세설명 변경
              if(clickGridData.selected) {
                processSetGrid.lowerspeclimit._data.textVal = clickGridData.LOWERSCREENLIMIT;
                processSetGrid.target._data.textVal = clickGridData.TARGET;
                processSetGrid.upperspeclimit._data.textVal = clickGridData.UPPERSPECLIMIT;
                processSetGrid.lowercontrollimit._data.textVal = clickGridData.LOWERSCREENLIMIT;
                processSetGrid.uppercontrollimit._data.textVal = clickGridData.UPPERCONTROLLIMIT;
                processSetGrid.lowerscreenlimit._data.textVal = clickGridData.LOWERSCREENLIMIT;
                processSetGrid.upperscreenlimit._data.textVal = clickGridData.UPPERSCREENLIMIT;
                processSetGrid.comment.currentValue = clickGridData.DESCRIPTION;
              }else{
                processSetGrid.lowerspeclimit._data.textVal = '';
                processSetGrid.target._data.textVal = '';
                processSetGrid.upperspeclimit._data.textVal = '';
                processSetGrid.lowercontrollimit._data.textVal = '';
                processSetGrid.uppercontrollimit._data.textVal = '';
                processSetGrid.lowerscreenlimit._data.textVal = '';
                processSetGrid.upperscreenlimit._data.textVal = '';
                processSetGrid.comment.currentValue = '';
              }
            }
          });
        }
      }
      if(this.clickTreeData.item.LEVELVALUE === "CONSUMABLE"){
        this.selected = 0;
        this.$refs.RawMaterialInput.gridData
        .filter(x => x.rowStat === "N")
        .map(x => {
          if(this.clickTreeData.item.UIKEY === x.ROCCOMPOSITIONID && this.clickTreeData.item.PROCESSID === x.CONSUMABLEID){
            this.$refs.RawMaterialInput.gridData[x.idx].selected = !this.$refs.RawMaterialInput.gridData[x.idx].selected;
          }
        });
      }
    },

    leftBtn(){
      // LEVELVALUE // PROCESS 공정, RECIPE 스텝, CONSUMABLE 원료투입, RECIPEPARAMETER, 공정조건
      if(this.clickTreeData.item === undefined ){
        this.$refs['alertPop2'].show('','선택된 공정 및 스탭이 없습니다.');
        return;
      }

      // 원료투입 탭
      if(this.selected === 0){
        if(this.clickTreeData.item.LEVELVALUE === "RECIPE"){
          if(this.$refs.RawMaterialInput.gridData.filter(x => x.selected === true).length === 0){
            this.$refs['alertPop2'].show('','체크된 항목이 없습니다.');
            return;
          } else {
            if(this.clickTreeData.item.RECIPETYPE === "Consumable"){
              this.$refs.RawMaterialInput.gridData
              .filter(x => x.selected === true)
              .forEach((x, idx) => {
                x.PROCESSNAME = this.clickTreeData.item.PROCESSID;
                x.RECIPENAME = this.clickTreeData.item.PROCESSNAME;
                x.ROCCOMPOSITIONID = this.clickTreeData.item.COMPOSITIONID;
                x.FEEDINGDESCRIPTION = this.$refs.RawMaterialInput.comment;

                if(x.rowStat === "N") {
                  x.rowStat = "U";
                }

                if (x.rowStat === "U" && !this.gfn_ChkOriginalData(this.$refs.RawMaterialInput.gridHeader, this.$refs.RawMaterialInput.gridData, this.$refs.RawMaterialInput.gridOriData, idx)) {
                  x.rowStat = "N";
                }

                const tmpTreeData = {
                  UIVALUE: x.CONSUMABLEID,
                  UIKEY: x.ROCCOMPOSITIONID,
                  PROCESSID: x.CONSUMABLEID,
                  PROCESSNAME: x.CONSUMABLENAME,
                  SEQ: x.FEEDINGRATE,
                  LEVELVALUE: "CONSUMABLE",
                  icon: "CONSUMABLE"
                }

                this.clickTreeData.item.children.push(tmpTreeData);
              });

              this.gridData2 = this.$refs.RawMaterialInput.gridData;
            } else {
              this.$refs['alertPop2'].show('','원료투입 스텝이 아닙니다.');
              return;
            }
          }
        } else {
          this.$refs['alertPop2'].show('','원료투입은 스텝에서만 가능합니다.');
        }
      } else { // 공정조건설정 탭
        
      }

      // if(this.clickTreeData.item.LEVELVALUE === "PROCESS" && this.selected === 1) {
      //   if(this.clickTreeData.item.RECIPETYPE === "Consumable"){
      //     this.$refs['alertPop'].show('','원료투입은 스텝에서만 가능합니다.');
      //   }
      // }
      // console.log(this.$refs.RawMaterialInput.gridData)

    },
    rightBtn(){
      
      if(this.clickTreeData.item === undefined ){
        this.$refs['alertPop2'].show('','선택된 공정 및 스탭이 없습니다.');
        return;
      }

      if(this.selected === 0){
        if(this.clickTreeData.item.LEVELVALUE === "CONSUMABLE"){
          this.$refs.RawMaterialInput.gridData
          .forEach((x, idx) => {
            if(x.CONSUMABLEID === this.clickTreeData.item.PROCESSID){
              x.PROCESSNAME = "";
              x.RECIPENAME = "";
              x.ROCCOMPOSITIONID = "";
              x.FEEDINGDESCRIPTION = "";

              if(x.rowStat === "N") {
                x.rowStat = "U";
              }

              if (x.rowStat === "U" && !this.gfn_ChkOriginalData(this.$refs.RawMaterialInput.gridHeader, this.$refs.RawMaterialInput.gridData, this.$refs.RawMaterialInput.gridOriData, idx)) {
                x.rowStat = "N";
              }
            }
          });

          for(let i = 0; i < this.treeData[0].children.length; i++){
            for(let x = 0; x < this.treeData[0].children[i].children.length; x++){
              for(let z = 0; z < this.treeData[0].children[i].children[x].children.length; z++){
                if(this.treeData[0].children[i].children[x].children[z] !== undefined){
                  if(this.treeData[0].children[i].children[x].children[z].PROCESSID === this.clickTreeData.item.PROCESSID){
                    this.treeData[0].children[i].children[x].children.splice(z, 1);
                    z--;
                  }
                }
              }
            }
          }

          this.gridData2 = this.$refs.RawMaterialInput.gridData;

        } else if(this.clickTreeData.item.LEVELVALUE === "RECIPE"){
          this.$refs['alertPop2'].show('','스탭은 삭제할 수 없습니다.');
          return;
        } else if(this.clickTreeData.item.LEVELVALUE === "RECIPEPARAMETER"){
          this.$refs['alertPop2'].show('','탭변경');
          return;
        } else {
          this.$refs['alertPop2'].show('','공정조건 삭제는 탭변경 후 삭제를 진행하세요.');
          return;
        }
      } else {
        if(this.clickTreeData.item.LEVELVALUE === "RECIPEPARAMETER"){
          this.delBtn();
        } else {
          this.$refs['alertPop2'].show('','원료투입 삭제는 탭변경 후 삭제를 진행하세요.');
          return;
        }
      }  
    },

    saveBtn(){
      if(this.v1){
        this.gridData3 = this.$refs.ProcessConditionSetting.gridData;
      }
      let save = true;
      let saveData2 = this.gridData3
      .filter(x => x.rowStat !== "N")
      .map(x => {
        return { 
          ...x,
        }
      });

      if(this.clickTreeData.item !== undefined){
        let compareData = this.gridData3
        .filter(x => x.COMPOSITIONID === this.clickTreeData.item.COMPOSITIONID && x.rowStat === "N")
        .map(x => {
          // RECIPEPARAMETERID
          return { 
            ...x,
          }
        });
        saveData2.map(x => {
          const chkArr = compareData.filter(y => {
            return x.RECIPEPARAMETERID === y.RECIPEPARAMETERID;
          });
          if(chkArr.length > 0){
            this.$refs['alertPop2'].show('','PK값이 중복되었습니다.');
            save = false;
          }
        });
        if(saveData2.length > 0 && save){
          const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnTPCPolicy",
            sendParam: saveData2
          }).then(() => {
            this.$nextTick(() => {
              this.$refs['alertPop2'].show('Info','저장되었습니다.');
              this.searchBtn(this.initData);
            })
          })
        }

      } else {
        if(saveData2.length > 0){
          const res = this.mesPost({
            apiKey: "mes/common/manage",
            messagename: "TxnTPCPolicy",
            sendParam: saveData2
          }).then(() => {
            this.$nextTick(() => {
              this.$refs['alertPop2'].show('Info','저장되었습니다.');
              this.searchBtn(this.initData);
            })
          })
        } else {
          this.$refs['alertPop2'].show('알림','저장할 데이터가 없습니다.');
        }
      }

    },

    addBtn(){
      if(this.clickTreeData.item === undefined ){
        this.$refs['alertPop2'].show('','선택된 공정 및 스탭이 없습니다.');
        return;
      }
      if(this.clickTreeData.item.LEVELVALUE === "RECIPE" || this.clickTreeData.item.LEVELVALUE === "PROCESS"){
        if(this.clickTreeData.item.RECIPETYPE === "Consumable"){
          this.$refs['alertPop2'].show('','스텝 원료투입항목에서는 공정조건을 추가 할 수 없습니다.');
          return;
        } else if(this.clickTreeData.item.RECIPETYPE === "End"){
          this.$refs['alertPop2'].show('','스텝 종료항목에서는 공정조건을 추가 할 수 없습니다.');
          return;
        } else {
          this.searchModalVisible2 = true; // 공정조건 팝업
        }
      } else {
        this.$refs['alertPop2'].show('','공정 및 스텝을 선택 후 공정조건을 추가하세요.');
        return;
      }
    },

    addData(data){

      let saveData;
      let saveData2;
      let saveData3;
      const newRowUUid = Math.round(Math.random()*1000000000).toString()
      // PLANTID, PRODUCTID, COMPOSITIONID, RECIPEPARAMETERID, BOMID, BOMVERSION

      // this.$refs.ProcessConditionSetting.gridData = this.$refs.ProcessConditionSetting.gridData
      // .map(x => {
      //   return { 
      //     ...x,
      //     newRow: false,
      //   }
      // });


      data.map(x => {
        this.$refs.ProcessConditionSetting.gridData.push({
          ...x,
          inEdit: false, 
          newRow: true,
          selected: false, 
          rowStat: "C",
          _ROWSTATUS: "C",
          newRowUUid: newRowUUid,
          idx: this.$refs.ProcessConditionSetting.gridData.length,
          PROCESSNAME: this.clickTreeData.item.PROCESSID,
          PROCESSID: this.clickTreeData.item.PROCESSID,
          RECIPENAME: this.clickTreeData.item.PROCESSNAME,
          COMPOSITIONID: this.clickTreeData.item.COMPOSITIONID,
          DESCRIPTION:this.$refs.ProcessConditionSetting.comment,
          PRODUCTID: this.productid,
          BOMID: this.bomid,
          BOMVERSION: this.bomversion,
          LOWERSPECLIMIT:"", // 하한값
          LOWERCONTROLLIMIT:"", // 특별관리 하한값
          LOWERSCREENLIMIT:"", // 제외할 하한값
          TARGET:"", // 목표값
          UPPERSPECLIMIT:"",// 상한값
          UPPERCONTROLLIMIT:"", // 특별관리 상한값
          UPPERSCREENLIMIT:"", // 제외할 상한값
          CTPFLAG:"",
        })
      });

      const newArray = this.$refs.ProcessConditionSetting.gridData
      .filter(x => x.COMPOSITIONID === this.clickTreeData.item.COMPOSITIONID)
      .map(x => {
        return { 
          ...x
        }
      });

      saveData = newArray.filter((item, i) => {
        return (
          newArray.findIndex((item2, j) => {
            return item.RECIPEPARAMETERID === item2.RECIPEPARAMETERID;
          }) === i
        );
      });

      for(let i = 0; i < this.treeData[0].children.length; i++){
        if(this.clickTreeData.itemHierarchicalIndex.length === 5){
          if(this.treeData[0].children[i].COMPOSITIONID === this.clickTreeData.item.UIKEY){
            for(let x = 0; x < this.treeData[0].children[i].children.length; x++){
              if(this.treeData[0].children[i].children[x].LEVELVALUE === "RECIPE" && this.treeData[0].children[i].children[x].COMPOSITIONID === this.clickTreeData.item.COMPOSITIONID){
                for(let z = 0; z < this.treeData[0].children[i].children[x].children.length; z++){
                  if(this.treeData[0].children[i].children[x].children[z].LEVELVALUE === "RECIPEPARAMETER"){
                    this.treeData[0].children[i].children[x].children.splice(z,1)
                    z--;
                  }
                }
                saveData.map((y, idx) => {
                  const tmpTreeData = {
                    UIVALUE: y.RECIPEPARAMETERID,
                    UIKEY: this.clickTreeData.item.COMPOSITIONID,
                    PROCESSID: y.RECIPEPARAMETERID,
                    PROCESSNAME: y.RECIPEPARAMETERNAME,
                    ROCCOMPOSITIONID: this.clickTreeData.item.COMPOSITIONID,
                    SEQ: y.ORDERINDEX,
                    LEVELVALUE: "RECIPEPARAMETER",
                    icon: "RECIPEPARAMETER",
                    STAT:"C"
                  }
                  this.treeData[0].children[i].children[x].children.push(tmpTreeData);
                });
              }
            }
          }
        } else {
          if(this.treeData[0].children[i].COMPOSITIONID === this.clickTreeData.item.COMPOSITIONID){
            for(let x = 0; x < this.treeData[0].children[i].children.length; x++){
              if(this.treeData[0].children[i].children[x].LEVELVALUE === "RECIPEPARAMETER"){
                this.treeData[0].children[i].children.splice(x,1)
                x--;
              }
            }
            saveData.map((y, idx) => {
              const tmpTreeData = {
                UIVALUE: y.RECIPEPARAMETERID,
                UIKEY: this.clickTreeData.item.COMPOSITIONID,
                PROCESSID: y.RECIPEPARAMETERID,
                PROCESSNAME: y.RECIPEPARAMETERNAME,
                ROCCOMPOSITIONID: this.clickTreeData.item.COMPOSITIONID,
                SEQ: y.ORDERINDEX,
                LEVELVALUE: "RECIPEPARAMETER",
                icon: "RECIPEPARAMETER",
                STAT:"C"
              }
              this.treeData[0].children[i].children.push(tmpTreeData);
            });
          }
        }
      }

      this.gridData3 = this.$refs.ProcessConditionSetting.gridData;
      this.$refs.ProcessConditionSetting.skip = 0;
    },
    //삭제버튼
    /*confirmDel() {
        this.$refs['confirmPop'].title = 'info';
        this.$refs['confirmPop'].message = `선택한 데이터 (${this.row.EQUIPMENTNAME
            }) 삭제 하시겠습니까?`;
        this.$refs['confirmPop'].callBack = this.delBtn;
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
    },*/
    delBtn() {

      // for(let i = 0; this.$refs.ProcessConditionSetting.gridData.length; i++){
      //   if(this.$refs.ProcessConditionSetting.gridData[i].selected && this.$refs.ProcessConditionSetting.gridData[i].rowStat === "C"){
      //     this.$refs.ProcessConditionSetting.gridData.splice(i, 1);
      //   }
      // }

      const data = JSON.parse(JSON.stringify(this.$refs.ProcessConditionSetting.gridData));
      this.$refs.ProcessConditionSetting.gridData = data
      // .filter(x=> x.rowStat !== "C")
      .map(x => {
        if (x.selected && x.rowStat === "N") {
          return {
            ...x,
            rowStat: "D",
            _ROWSTATUS: "D",
          }
        }
        return x;
      }).filter(x => {
        return !x.selected || x.rowStat !== "C"
      });


    //   const filtered = array.filter((value, index, arr) => {
    // return value > 5;
// });

      // this.clickTreeData = {};
      // const data2 = JSON.parse(JSON.stringify(this.$refs.ProcessConditionSetting.gridData))
      // this.$refs.ProcessConditionSetting.gridData = data2.map(x => {
      //     if (x.selected) {
      //         if (x.rowStat === "C") {
      //             const item = this.$refs.ProcessConditionSetting.gridOriData.filter(ori => ori.RECIPEPARAMETERID === x.RECIPEPARAMETERID 
      //                                                                                    && ori.COMPOSITIONID === x.COMPOSITIONID); // 수정 필요한가?
      //             return item[0];
      //         }
      //     } else {
      //         return x
      //     }
      // }).filter(x => !!x);

      // this.initTree(false);
      
      const delData = this.$refs.ProcessConditionSetting.gridData.filter(x => {
        return x.rowStat === "D"
      });

      for(let i = 0; i < this.treeData[0].children.length; i++){
        for(let y = 0; y < delData.length; y++){
          for(let x = 0; x < this.treeData[0].children[i].children.length; x++){
            if(this.treeData[0].children[i].children[x] !== undefined){
              if(this.treeData[0].children[i].children[x].children.length > 0){
                for(let z = 0; z < this.treeData[0].children[i].children[x].children.length; z++){
                  if(this.treeData[0].children[i].children[x].children[z].PROCESSID === delData[y].RECIPEPARAMETERID && this.treeData[0].children[i].children[x].children[z].UIKEY === delData[y].COMPOSITIONID){
                    this.treeData[0].children[i].children[x].children.splice(z, 1);
                    z--;
                  }
                }
              } else {
                if(this.treeData[0].children[i].children[x].PROCESSID === delData[y].RECIPEPARAMETERID && this.treeData[0].children[i].children[x].UIKEY === delData[y].COMPOSITIONID){
                  this.treeData[0].children[i].children.splice(x, 1);
                  x--;
                }
              }
            }
          }
        }
      }

      this.gridData3 = this.$refs.ProcessConditionSetting.gridData;

    },

    undoBtn() {
      this.clickTreeData = {};
      this.$refs.ProcessConditionSetting.gridData = [];
      this.$refs.ProcessConditionSetting.gridData = JSON.parse(JSON.stringify(this.$refs.ProcessConditionSetting.gridOriData));

      // const data = JSON.parse(JSON.stringify(this.$refs.ProcessConditionSetting.gridData))
      // this.$refs.ProcessConditionSetting.gridData = data.map(x => {
      //     if (x.selected) {
      //         if (!x.newRow) {
      //             const item = this.$refs.ProcessConditionSetting.gridOriData.filter(ori => ori.RECIPEPARAMETERID === x.RECIPEPARAMETERID 
      //                                                                                    && ori.COMPOSITIONID === x.COMPOSITIONID); // 수정 필요한가?
      //             return item[0];
      //         }
      //     } else {
      //         return x
      //     }
      // }).filter(x => !!x);

      this.gridData3 = this.$refs.ProcessConditionSetting.gridData;
      this.initTree(false);
      this.$nuxt.$emit('iccReset');
    },

    // 기존 초기화 버튼 주석처리 2023.03.29
    resetBtn() {
      this.gridData2
      .map(x => {
          this.gridData2[x.idx].PROCESSNAME = null;
          this.gridData2[x.idx].RECIPENAME = null;
          this.gridData2[x.idx].ROCCOMPOSITIONID = null;
          this.gridData2[x.idx].FEEDINGDESCRIPTION = null;
      });
      
      const data = JSON.parse(JSON.stringify(this.gridData3));
      this.gridData3 = data
      .map(x => {
        return {
          ...x,
          rowStat: "D",
          _ROWSTATUS: "D"
        }
      });

      this.initTree(true);

    },

    //그리드 로우 클릭
    onRowClick (event) {
      console.log("===========onRowClick==============")
      //그리드 로우 클릭시 라인표시 유무 확인필요
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem){
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
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValue",
        sendParam: {
          plantid: "LS",
          enumid: "AreaType"
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
    onSelect(e) {
      this.selected = e.selected;
      if(this.selected === 1 && !this.v1){
        if(!this.firstSearch){
          this.$refs.alertPop.title = ""
          this.$refs.alertPop.message = "라우팅 상세설정을 할 제품정보를 선택해 주시기 바랍니다.";
          this.$refs.alertPop.modalWidth = "330px";
          this.$refs.alertPop.visibleDialog = true;
          this.selected = 0;
          return;
        } else {
          this.v1 = !this.v1;
        }
        // } else {
        //   this.v1 = !this.v1;
        //   this.$refs.ProcessConditionSetting.getGridData(this.gridData3);
        // }
        // this.$refs.RawMaterialInput.getGridData(this.initData);
      }
    },
    searchInput(nm, val){
      // currentqty: "", // 현재수량
      // workqty: "", // Scrap수량
      // resultqty: "", // 결과수량
      this[nm] = val;
    },
    onInput(e){
      let sumqty = 0;
      if( this.selected === 0 ){
        sumqty = Number(this.currentqty) - Number(e.value);
      } else {
        sumqty = Number(this.currentqty) + Number(e.value);
      }
      this.resultqty = sumqty.toFixed(3);
      // currentqty: "", // 현재수량
      // workqty: "", // Scrap수량
      // resultqty: "", // 결과수량
      // console.log(nm) // workqty
      this.workqty = e.value;
    },
    toggleDialog() {
      // this.visibleDialog = !this.visibleDialog;
      this.$refs['confirmPop'].title = "confirm";
      this.$refs['confirmPop'].message = "현재수량 : " + this.currentqty + "<br/>" + "<br/>"
                                       + "작업수량 : " + this.workqty + "<br/>" + "<br/>"
                                       + "잔여수량 : " + this.resultqty + "<br/>" + "<br/>"
                                       + this.labelqty + "처리 하시겠습니까?";
      this.$refs['confirmPop'].callBack = this.saveBtn;
      this.$refs['confirmPop'].modalWidth = "300px";
      this.$refs['confirmPop'].visibleDialog = true;
    },
    saveCallBack(p){
      this.$refs['alertPop2'].show(p.title, p.message);
    }

  }
};

const defaultData = {
};
</script>
<style lang="scss" scoped>
.col-0-half,
.col-3-1qtr,
.col-8-1qtr {
    position: relative;
    width: 100%;
    padding-right: 5px;
    padding-left: 5px;
}
.col-0-half {
    -ms-flex: 0 0 4.166667%;
    flex: 0 0 4.166667%;
    max-width: 4.166667%;
}
.col-3-1qtr {
    -ms-flex: 0 0 27.083333%;
    flex: 0 0 27.083333%;
    max-width: 27.083333%;
}
.col-8-1qtr {
    -ms-flex: 0 0 68.75%;
    flex: 0 0 68.75%;
    max-width: 68.75%;
}
</style>