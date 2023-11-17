<template>
  <Card ref="gridCard" :style="{height : '100%'}">
    <CardBody :style="{ width: '100%', height: '100%' }">
      <v-row no-gutters>
        <v-col cols="6" align="left">
          <CardTitle>[LS] LS</CardTitle>
        </v-col>
        <v-col cols="6" align="right">
          <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveBtn">저장</Button>
          <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">추가</Button>
          <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delConfirm">삭제</Button>
          <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn">UNDO</Button>
        </v-col>
      </v-row>
      <div ref="divWrapper" style="height: calc(100% - 33px)">
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
    <GetGroupModal
      ref="GetGroupModal"
      v-if="GroupModalModalVisible"
      :visibleDialog="GroupModalModalVisible"
      @visibleDialog="(val) => GroupModalModalVisible = val"
      @selectGroup="selectGroup"
    />
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    <ConfirmPop
      ref="ConfirmPop"
    />
  </Card>
</template>

<script>

import mixinGlobal from "@/mixin/global.js";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import GetGroupModal from '@/components/common/modal/GetGroupModal';
import moment from "moment";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";

export default {
  name: "WorkerGroup",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Card,
    Button,
    CardBody, 
    CardTitle,
    KendoGrid,
    GetGroupModal
  },
  props:{
    gridHeight: {
      type: String,
      default: "100px"
    },
  },
  data() {
    return {
      columns: [],
      gridData : [],
      gridOriData : [],
      gridLastModIdx: null,
      selectedField: 'selected',
      gridHeader: [
        // {field: "selected", editable: true, width: "40px", headerSelectionValue: this.areAllSelected, className: "gridTextCenter"  },
        // {field: "rowStat", editable: false, title: " ", width: 70, cell: "crudCellTemplate", className: "gridTextCenter" },
        // {field: "EQUIPMENTID", editable: false, title: "설비코드", width: 100, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: "Yes", NOTNULLFLAG: null },
        // {field: "WORKINGDATE", editable: true, title: "작업일자", width: 150, cell: "datePicker", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
        // {field: "WORKINGGROUPID", editable: true, title: "조", width: 100, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
        // {field: "WORKGROUPID", editable: true, title: "작업조ID", width: 200, cell: "searchBtn", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
        // {field: "DESCRIPTION", editable: true, title: "비고", width: 200, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
      ],
      headerParam: {
        gridid: "dgvWorkerGroup", // 그리드 ID
        rowStat:'',
        gridHeader: [],
        noRowstat: false,
        enumComboBox: [],
      },
      rowInfo: {},
      GroupModalModalVisible: false,
      newRowUUid: ""
    };
  },
  async mounted() {
  },
  computed: {
    areAllSelected() {
      return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
    },
  },
  methods: {
    async searchData(){
      const res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEquipmentWorkGroup",
        sendParam: {
          equipmentid: this.rowInfo.EQUIPMENTID,
          plantid: "LS"
        }
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
          change: false,
        }
      });
      this.gridData = data;
      this.gridOriData = JSON.parse(JSON.stringify(data));
    },
    onSelectionchange (event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    onRowClick(event){
    },
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
      if(this.isEmptyObject(this.rowInfo)) {
        this.openAlert("알림","설비를 선택해주세요.");
        return;
      }
      this.$refs.rowGrid.skip = 0;
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
        EQUIPMENTID: this.rowInfo.EQUIPMENTID,
        EQUIPMENTNAME: "",
        WORKINGDATE: moment().format("YYYY-MM-DD"),
        WORKINGGROUPID: "",
        WORKGROUPID: "",
        DESCRIPTION: "",
        change: true
      };
      this.gridData.splice(0, 0, dataItem)
      this.$nuxt.$emit('iccReset')
    },
    gridButtonClick(e, field, dataItem){
      this.GroupModalModalVisible = true;
      this.newRowUUid = dataItem.newRowUUid;
    },
    selectGroup(data){
      this.gridData = this.gridData.map(x => {
        if(x.rowStat === "C"){
          if(x.newRowUUid === this.newRowUUid){
            return {...x, WORKGROUPID: data.WORKGROUPID, [`N${x.newRowUUid}USERNAME`]: data.WORKGROUPID}
          }
        }else{
          if(x.newRowUUid === this.newRowUUid){
            return {...x, WORKGROUPID: data.WORKGROUPID, [`N${x.newRowUUid}USERNAME`]: data.WORKGROUPID, rowStat: "U"}
          }
        }
        return x;
      });
    },
    saveValidation(){
      const saveData = this.gridData.filter(x => x.rowStat !== "N")
      const timeChk = [];
      saveData.forEach(x => {
        timeChk.push(moment(x.WORKINGDATE, "YYYY-MM-DD", true).isValid().toString());
      })
      if(timeChk.indexOf("false") > -1){
        this.openAlert("작업일자","작업일자 표현이 잘못되었습니다.")
        return;
      }

      const validation = this.gridData.filter(x => x.rowStat !== "N" && !x.WORKINGGROUPID)
      if(validation.length > 0){
        this.openAlert("저장", "조 값은 필수 입력값입니다.")
        return;
      } 
      const validation2 = this.gridData.filter(x => x.rowStat !== "N" && !x.WORKGROUPID)
      if(validation2.length > 0){
        this.openAlert("저장", "작업조ID  값은 필수 입력값입니다.")
        return;
      } 

      const dupChk = []
      this.gridData.forEach(x => {
        if(x.rowStat !== "N"){
          dupChk.push(x.WORKGROUPID)
        }
      });
      
      const dupArr = this.gridData.filter(x => x.rowStat === "N" && dupChk.indexOf(x.WORKGROUPID) > -1)
      if(dupArr.length > 0){
        this.openAlert("저장", "작업조ID값이 중복 되었습니다.")
        return;
      }

      this.saveData();
    },
    async saveData(){
      const saveData = this.gridData
        .filter(x => x.rowStat !== "N")
        .map(x => ({...x, _ROWSTATUS: x.rowStat}));

      if(saveData.length > 0){
        const res = await this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnEquipmentWorkGroupMap",
          sendParam: saveData
        })

        if(res?.returncode == "0"){
          this.openAlert("저장", "저장되었습니다.")
          this.searchData();
        }else{
          this.openAlert("error", "오류가 발생했습니다.")
        }
      }else{
        this.openAlert("저장", "저장할 데이터가 존재하지 않습니다.")
      }
    },
    delConfirm(){
      const chk = []
      this.gridData.forEach(e => {
        if(e.selected){
          chk.push(`${e.WORKINGGROUPID}조 ${e.WORKGROUPID}`);
        }
      });

      if(chk.length === 0) {
        this.openAlert("알림", "삭제할 데이터를 선택해주세요.");
        return;
      }

      this.$refs.ConfirmPop.title = "삭제"
      this.$refs.ConfirmPop.message = `선택한 데이터(${chk.join()})를 삭제 하시겠습니까?`;
      this.$refs.ConfirmPop.modalWidth = "330px";
      this.$refs.ConfirmPop.visibleDialog = true;
      this.$refs.ConfirmPop.callBack = this.groupDelBtn;
    },
    groupDelBtn(){
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.gridData = data.map(x => {
        if(x.selected){
          if(x.rowStat !== "C"){
            return {
              ...x,
              rowStat: "D"
            }
          }
        }
        else {
          return x;
        }
      }).filter(x => x !== undefined);
    },
    undoBtn(){
      //this.gridData = this.gridOriData;
      this.gridData = this.gridOriData.filter((x) => x.newRow !== true);
      // const data = JSON.parse(JSON.stringify(this.gridData))
      // this.gridData = data.map(x => {
      //   if(x.selected){
      //     if(!x.newRow){
      //       const item = this.gridOriData.filter(ori => ori.newRowUUid === x.newRowUUid);
      //       return item[0];
      //     }
      //   }else{
      //     return x
      //   }
      // }).filter(x => !!x);
      this.$nuxt.$emit('iccReset')
    },
    openAlert(title="", message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      const dateChk = ['WORKINGDATE'];
      
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
    sortChangeHandler(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    },
    saveBtn(){
      this.$emit('saveBtn');
    }
  }
}
</script>

<style>

</style>