<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>생산계획</li>
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
                      제품코드
                    </Label>
                   </v-col> 
                    <v-col :cols="6">
                    <InputText
                      ref="PRODUCTID"
                      :boxWidth="'98%'"
                      dataNm="PRODUCTID"
                      :readonly="true"
                      :defaultValue="PRODUCTID"
                      @input-text-set="searchInput"
                    />
                    </v-col>
                    <v-col :cols="2">
                    <Button :theme-color="'primary'" :size="'medium'" @click="searchModalVisible = true" >선택</Button>
                    </v-col>
                </v-row>
              </v-col>
              <v-col :cols="8" align="right">
                <Button :theme-color="'primary'" icon="search" @click="searchBtn">조회</Button>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{height : '100%'}">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="6" align="left">
              </v-col>
              <v-col cols="6" align="right">
                <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveValidation">저장</Button>
                <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">추가</Button>
                <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delConfirm">삭제</Button>
                <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">UNDO</Button>
              </v-col>
            </v-row>
            <div ref="divWrapper"  :style="{'margin-top': '10px', height: 'calc(100% - 43px)'}">
              <KendoGrid 
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="this.gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :isPaging="true"
                :selected-field="selectedField"
                :pkNotEditArr="['PRODUCTORDERID']"
                :gridDropDownList="headerParam.enumComboBox"
                @gridddchang="rowDdChange"
                @selectionchange="onSelectionchange"
                @gridrowclick="onRowClick"
                @griditemchange="griditemchange"
                @headerselectionchange="onHeaderSelectionChange"
                @gridButtonClick="gridButtonClick"
                @sortChangeHandler="sortChangeHandler"
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
    <ConfirmPop
      ref="ConfirmPop"
    />
    <!-- <GetGroupModal
      ref="GetGroupModal"
      v-if="VendorModalVisible"
      :visibleDialog="VendorModalVisible"
      @visibleDialog="(val) => VendorModalVisible = val"
      @selectGroup="selectGroup"
    /> -->
    <VendorModal
      ref="VendorModal"
      v-if="VendorModalVisible"
      :visibleDialog="VendorModalVisible"
      title="납품처"
      @visibleDialog="(val) => (VendorModalVisible = val)"
      @vendorInfo="vendorInfo"
    />

    <SelectModelingConfirm
      ref="SelectModelingConfirm"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'제품ID 검색'"
      :message="'message'"
      :callBack="()=>{}"
      @visibleDialog="(val) => searchModalVisible = val"
      @searchBtn="productData"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import utils from "~/plugins/utils";
import customGridHeaderMixin from "@/mixin/customGridHeaderMixin";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import WorkerGroup from "@/components/frmEquipmentWorker/WorkerGroup"
import InputText from "@/components/common/input/InputText";
import moment from "moment";
import SelectModelingConfirm from "@/components/frmRouteDetailDefinition/SelectModelingConfirm";
import VendorModal from '@/components/common/modal/VendorModal';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
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
    KendoGrid,
    WorkerGroup,
    InputText,
    SelectModelingConfirm,
    VendorModal,
    DropDownList,
  },
  data() {
    return {
      gridHeight : '100px',
      columns: [],
      gridData : [],
      gridOriData : [],
      gridLastModIdx: null,
      selectedField: 'selected',
      gridHeader: [],
      enumComboBox: [],
      EQUIPMENTID: "",
      gridGRPHeight: "",
      rowInfo: {},
      VendorModalVisible: false,
      newRowUUid: "",
      PRODUCTID: "",
      searchModalVisible: false,
      productRow: {},
      headerParam: {
        gridid: "dgvProductPlanList", // 그리드 ID
        rowStat:'',
        gridHeader: [],
        noRowstat: false,
        enumComboBox: [],
      },
    };
  },
  created() {
  },
  async mounted() {
    this.getHaeder();
    this.gridHeight = (this.$refs.contents.offsetHeight - 150) +'px';
    //await this.getGridComboList();
  },
  computed: {
    areAllSelected() {
      return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
    },
  },
  watch: {
  },
  methods: {
    getHaeder (){},
    productData(data){
      console.log(data)
      this.productRow = data
      this.PRODUCTID = data.PRODUCTID;
      if(this.PRODUCTID != undefined && this.PRODUCTID != ""){
        this.searchBtn();
      }
    },

    async searchBtn(){
      if(!this.PRODUCTID){
        this.openAlert("조회", "제품ID 조회후 가능합니다.")
        this.$refs.alertPop.callBack2 = () => {this.searchModalVisible = true}
        return;
      }
      this.$nuxt.$emit('iccReset')
      const sendParam = {productid: this.PRODUCTID, plantid: "LS"}

      const res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProductionPlan",
        sendParam: sendParam
      });
      const data = res.map((x, idx) => {
        return {
          ...x,
          rowStat: "N",
          selected: false,
          idx: idx,
          inEdit: true,
          newRow: false,
          checked: false,
          newRowUUid: `N${Math.round(Math.random()*1000000000).toString()}`,
          change: true,
        }
      });
      this.gridData = [];
      this.gridData = data;
      this.gridOriData = data;
      console.log(this.productRow)
    },
    saveBtn(){
      this.$refs.WorkerGroup.saveValidation();
    },
    openAlert(title, message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    onRowClick(event){
      this.gridData = this.gridData.map(x => ({...x, selected: x.EQUIPMENTID === event.dataItem?.EQUIPMENTID}))
      this.rowInfo = this.gridData.filter(x => x.EQUIPMENTID === event.dataItem?.EQUIPMENTID)[0];
      this.$refs.WorkerGroup.rowInfo = this.rowInfo;
      this.$refs.WorkerGroup.searchBtn();
    },
    searchInput(nm, val){
      this[nm] = val;
    },
    onSelectionchange (event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    onRowClick(event){
    },
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      if(e.field === "PLANORDERQTY"){
        e.value = e.value.replace(/[^0-9]/gi, "");
      }
      data[idx] = { ...data[idx], [e.field]: e.value };
      
      // PLANORDERQTY

      if(data[idx].rowStat === "N"){
        data[idx].rowStat = "U";
      }
      if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
        data[idx].rowStat = "N";
      }
      this.gridData = data;
    },
    chkOriginalData(gridData, idx){
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return data[idx][x] !== this.gridData[idx][x] && x !== "rowStat"
      });
      return chkArr.length > 0;
    },
    onHeaderSelectionChange (event) {
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map((item) => {
        return { ...item, selected: checked };
      });
    },
    addBtn(){
      if(!this.PRODUCTID){
        this.openAlert("조회", "제품ID 조회후 가능합니다.")
        this.$refs.alertPop.callBack2 = () => {this.searchModalVisible = true}
        return;
      }

      this.$refs.rowGrid.skip = 0;
      // this.productRow.PRODUCTNAME
      // this.productRow.PRODUCTID
      ['PLANSTARTDATE','PLANENDDATE','DUEDATE'];
      const newRowUUid = Math.round(Math.random()*1000000000).toString()
      const dataItem = { 
        inEdit: true, 
        newRow: true,
        selected: false, 
        PLANTID: "LS", 
        rowStat: "C",
        _ROWSTATUS: "C",
        newRowUUid: newRowUUid,
        idx: this.gridData.length,
        PRODUCTID: this.productRow.PRODUCTID,
        PRODUCTNAME: this.productRow.PRODUCTNAME,
        PRODUCTORDERID: "",
        PRODUCTIDPRODUCTNAME: "",
        PLANSTARTDATE: moment().format("YYYY-MM-DD"),
        PLANENDDATE: moment().format("YYYY-MM-DD"),
        PLANORDERQTY: "",
        PRODUCTUNIT: this.productRow.PRODUCTUNIT ,
        WORKORDERQTY: "0",
        VENDOR: "",
        VENDORNM: "",
        DUEDATE: moment().format("YYYY-MM-DD"),
        DESCRIPTION: "",
        change: true,
      };
      this.gridData.splice(0, 0, dataItem)
      this.$nuxt.$emit('iccReset')
    },
    gridButtonClick(e, field, dataItem){
      this.VendorModalVisible = true;
      this.newRowUUid = dataItem.newRowUUid;
    },
    vendorInfo(data){
      console.log(data)
      this.gridData = this.gridData.map(x => {
        if(x.rowStat === "C"){
          if(x.newRowUUid === this.newRowUUid){
            return {...x, VENDOR: data.COMPANYID, VENDORNM: data.COMPANYNAME ,[`N${x.newRowUUid}USERNAME`]: data.COMPANYID}
          }
        }else{
          if(x.newRowUUid === this.newRowUUid){
            return {...x, VENDOR: data.COMPANYID, VENDORNM: data.COMPANYNAME , [`N${x.newRowUUid}USERNAME`]: data.COMPANYID, rowStat: "U"}
          }
        }
        return x;
      });
    },
    saveValidation(){

      const validation = this.gridData.filter(x => x.rowStat !== "N" && !x.PRODUCTID)
      if(validation.length > 0){
        this.openAlert("저장", "제품코드 값은 필수 입력값입니다.")
        return;
      }
      const validation2 = this.gridData.filter(x => x.rowStat !== "N" && !x.PLANSTARTDATE)
      if(validation2.length > 0){
        this.openAlert("저장", "계획시작일 값은 필수 입력값입니다.")
        return;
      }
      const validation3 = this.gridData.filter(x => x.rowStat !== "N" && !x.PLANENDDATE)
      if(validation3.length > 0){
        this.openAlert("저장", "계획종료일 값은 필수 입력값입니다.")
        return;
      }
      const validation4 = this.gridData.filter(x => x.rowStat !== "N" && !x.PLANORDERQTY)
      if(validation4.length > 0){
        this.openAlert("저장", "주문수량 값은 필수 입력값입니다.")
        return;
      }
      // const validation5 = this.gridData.filter(x => x.rowStat !== "N" && !x.WORKORDERQTY)
      // if(validation5.length > 0){
      //   this.openAlert("저장", "작업지시 수 값은 필수 입력값입니다.")
      //   return;
      // }


      const saveData = this.gridData.filter(x => x.rowStat !== "N")
      const timeChk = [];
      saveData.forEach(x => {
        timeChk.push(moment(x.PLANSTARTDATE, "YYYY-MM-DD", true).isValid().toString());
      })
      if(timeChk.indexOf("false") > -1){
        this.openAlert("계획시작일","계획시작일 표현이 잘못되었습니다.")
        return;
      }
      const timeChk2 = [];
      saveData.forEach(x => {
        timeChk2.push(moment(x.PLANENDDATE, "YYYY-MM-DD", true).isValid().toString());
      })
      if(timeChk2.indexOf("false") > -1){
        this.openAlert("계획종료일","계획종료일 표현이 잘못되었습니다.")
        return;
      }
      const timeChk3 = [];
      saveData.forEach(x => {
        if(x.DUEDATE){
          timeChk3.push(moment(x.DUEDATE, "YYYY-MM-DD", true).isValid().toString());
        }
      })
      if(timeChk3.indexOf("false") > -1){
        this.openAlert("납기일","납기일 표현이 잘못되었습니다.")
        return;
      }


      this.saveData();
    },
    async saveData(){
      const saveData = this.gridData
        .filter(x => x.rowStat !== "N")
        .map(x => ({...x, _ROWSTATUS: x.rowStat, WORKORDERQTY: x.WORKORDERQTY || "0"}));

      if(saveData.length > 0){
        const res = await this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnProductOrder",
          sendParam: saveData
        })

        if(res?.returncode == "0"){
          this.openAlert("저장", "저장되었습니다.")
          this.$refs.alertPop.callBack2 = () => {this.searchModalVisible = false}
          this.searchBtn();
        }else{
          this.openAlert("error", "오류가 발생했습니다.")
          this.$refs.alertPop.callBack2 = () => {this.searchModalVisible = false}
        }
      }else{
        this.openAlert("저장", "저장할 데이터가 존재하지 않습니다.")
        this.$refs.alertPop.callBack2 = () => {this.searchModalVisible = false}
      }
    },
    delConfirm(){
      const chk = []
      this.gridData.forEach(e => {
        if(e.selected){
          chk.push(`${e.PRODUCTORDERID}`);
        }
      });
      if(chk.length === 0) {
        this.openAlert("알림", "삭제할 데이터를 선택해주세요.");
        return;
      }
      if(chk.join() === undefined || chk.join() === ""){
      this.$refs.ConfirmPop.title = "삭제"
      this.$refs.ConfirmPop.message = `선택한 데이터를 삭제 하시겠습니까?`;
      this.$refs.ConfirmPop.modalWidth = "330px";
      this.$refs.ConfirmPop.visibleDialog = true;
      this.$refs.ConfirmPop.callBack = this.groupDelBtn;        
      } else {
      this.$refs.ConfirmPop.title = "삭제"
      this.$refs.ConfirmPop.message = `선택한 데이터(${chk.join()})를 삭제 하시겠습니까?`;
      this.$refs.ConfirmPop.modalWidth = "330px";
      this.$refs.ConfirmPop.visibleDialog = true;
      this.$refs.ConfirmPop.callBack = this.groupDelBtn;
      }
    },
    // groupDelBtn(){
    //   const data = JSON.parse(JSON.stringify(this.gridData))
    //   this.gridData = data.map(x => {
    //     if(x.rowStat == "C"){
    //       return false;
    //     }
    //     if(x.selected){
    //       return {
    //         ...x,
    //         rowStat: "D"
    //       }
    //     }
    //     return x;
    //   });
    // },
    groupDelBtn(){
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.gridData = data.map(x => {
        if (x.rowStat === "C" && x.selected) {
          return null;
        } else if (x.selected) {
          return {
            ...x,
            rowStat: "D"
          }
        }
        return x;
      }).filter(x => x !== null);
    },



    undoBtn(){
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
      this.$nuxt.$emit('iccReset')
    },
    openAlert(title="", message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData, e, [
        'PLANORDERQTY',
        'WORKORDERQTY',
      ]);
    },
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      const dateChk = ['PLANSTARTDATE','PLANENDDATE','DUEDATE'];
      if (dateChk.indexOf(name) > -1) {
        e.value = moment(e.value).format("YYYY-MM-DD");
      }

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (
        data[idx].rowStat === "U" &&
        !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)
      ) {
        data[idx].rowStat = "N";
      }

      this.gridData = data;
    },
  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>