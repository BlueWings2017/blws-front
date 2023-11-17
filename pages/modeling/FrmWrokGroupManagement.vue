<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>작업그룹관리</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>
                      작업조ID
                    </Label>
                    <InputText
                      ref="WORKGROUPIDINP"
                      :boxWidth="'90%'"
                      dataNm="WORKGROUPIDINP"
                      :disabled="false"
                      @input-text-set="searchInput"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button :theme-color="'primary'" icon="search" @click="searchBtn">조회</Button>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <v-row ref="contents">

      <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
        <v-row :style="{ height: '100%' }">
          <v-col :cols="12" :class="'divList1'" :style="{ height: '50%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>작업조목록</CardTitle>
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" icon="save" @click="groupValidation">저장</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="groupAddBtn">추가</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="groupDelConfirm">삭제</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="groupUndoBtn">UNDO</Button>
                  </v-col>
                </v-row>
                <div ref="divWrapper1" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid 
                    ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="groupData"
                    :sortable="true"
                    :columns="groupHeader"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :isPaging="true"
                    :selected-field="selectedField"
                    @selectionchange="onSelectionchange"
                    @gridrowclick="grpOnRowClick"
                    @griditemchange="grpitemchange"
                    @sortChangeHandler="sortChangeHandler1"
                    @headerselectionchange="onHeaderSelectionChangeGrp"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>

          <v-col :cols="12" :class="'divList2'" :style="{ height: '50%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>작업조/작업자 관계</CardTitle>
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" icon="save" @click="workerValidation">저장</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="workerAddBtn">추가</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="workerDelConfirm">삭제</Button>
                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="workerUndoBtn">UNDO</Button>
                  </v-col>
                </v-row>
                <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid 
                    ref="rowGrid2"
                    :gridHeight="gridHeight"
                    :gridItems="workerData"
                    :sortable="true"
                    :columns="workerHeader"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :isPaging="true"
                    :selected-field="selectedField"
                    @selectionchange="onSelectionchange"
                    @gridrowclick="workerOnRowClick"
                    @griditemchange="workeritemchange"
                    @headerselectionchange="onHeaderSelectionChangeWorker"
                    @gridButtonClick="workerGridButtonClick"
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
    />
    <ConfirmPop
      ref="ConfirmPop"
    />
    <GetUserModal
      ref="UserModal"
      v-if="UserModalVisible"
      :visibleDialog="UserModalVisible"
      @visibleDialog="(val) => UserModalVisible = val"
      @selectUser="selectUser"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import GetUserModal from "@/components/common/modal/GetUserModal.vue"
import InputText from "@/components/common/input/InputText";

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
    KendoGrid,
    GetUserModal,
    InputText
  },
  data() {
    return {
      columns: [],
      gridHeight : '100px',
      gridData : [],
      gridOriData : [],
      gridLastModIdx: null,
      selectedField: 'selected',
      parentAreaId: "",
      groupHeader: [
        {field: "selected", editable: true, width: "40px", headerSelectionValue: this.areGrpAllSelected, className: "gridTextCenter" },
        {field: "rowStat", editable: false, title: " ", width: 70, cell: "crudCellTemplate", className: "gridTextLeft" },
        {field: "WORKGROUPID", editable: false, title: "작업조ID", minWidth: 200, cell: "PRIMARYKEYFLAG", className: "gridTextLeft", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: "Yes", NOTNULLFLAG: null },
        {field: "WORKGROUPNAME", editable: true, title: "작업조설명", minWidth: 200, cell: "", className: "gridTextLeft", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
        {field: "DESCRIPTION", editable: true, title: "비고", minWidth: 200, cell: "", className: "gridTextLeft", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
      ],
      workerHeader: [
        {field: "selected", editable: true, width: "40px", headerSelectionValue: this.areAllSelected, className: "gridTextCenter" },
        {field: "rowStat", editable: false, title: " ", width: 70, cell: "crudCellTemplate", className: "gridTextLeft" },
        {field: "WORKGROUPID", editable: false, title: "작업조ID", minWidth: 200, cell: "", className: "gridTextLeft", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: "Yes", NOTNULLFLAG: null },
        {field: "USERNAME", editable: false, title: "작업자", minWidth: 200, cell: "searchBtn", className: "gridTextLeft", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null},
        // {field: "btn", editable: true, title: "검색", minWidth: 200, cell: "searchBtn", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
        {field: "DESCRIPTION", editable: true, title: "비고", minWidth: 200, cell: "", className: "gridTextLeft", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
      ],
      groupData: [],
      groupOriData: [],
      workerData: [],
      workerOriData: [],
      UserModalVisible: false,
      searchUserGroupId: "",
      newRowUUid: "",
      selectedID: "",
      WORKGROUPIDINP: "",
      WORKGROUPID: "",
    };
  },
  created() {
  },
  computed: {
    areGrpAllSelected() {
      return this.groupData.findIndex((x) => x.checked === false) === -1 && this.groupData.length !== 0
    },
    areAllSelected() {
      return this.workerData.findIndex((x) => x.checked === false) === -1 && this.workerData.length !== 0
    },
  },
  watch: {
  },
  async mounted() {
    this.gridHeight = (this.$refs.contents.offsetHeight - 180)/2 +'px';
    this.getGropuData();
  },
  methods: {
    async searchBtn(){
      await this.getGropuData();
    },
    async getGropuData(){
      console.log(this.WORKGROUPIDINP);

      const res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetWorkGroupList",
        sendParam: {
          workgroupid:  this.WORKGROUPIDINP,
          workgroupname: "",
          plantid: "LS"
        }
      });
      this.$nuxt.$emit('iccReset');
      const data = res.map((x, idx) => {
        return {
          ...x,
          rowStat: "N",
          selected: false,
          idx: idx,
          inEdit: true,
          newRow: false,
          checked: false,
        }
      });
      this.groupOriData = data;
      this.groupData = data;
      this.WORKGROUPID = data[0].WORKGROUPID;
      await this.getWorkerData(data[0].WORKGROUPID)
    },
    groupAddBtn(){
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
        idx: this.groupData.length,
        WORKGROUPID: "",
        WORKGROUPNAME: "",
        DESCRIPTION: "",
      };
      this.groupData.splice(0, 0, dataItem)
      this.$nuxt.$emit('iccReset')
    },
    groupDelConfirm(){
      const chk = []
      this.groupData.forEach(e => {
        if(e.selected){
          chk.push(e.WORKGROUPID);
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
    //삭제버튼
    // groupDelBtn(){
    //   const data = JSON.parse(JSON.stringify(this.groupData))
    //   this.groupData = data.map(x => {
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
      const data = JSON.parse(JSON.stringify(this.groupData));
      this.groupData = data.map(x => {
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
    groupUndoBtn(){
      this.groupData = this.groupOriData.filter((x) => x.newRow !== true);
      this.$nuxt.$emit('iccReset')
    },
    //그리드 로우 클릭
    grpOnRowClick(event){
      this.groupData = this.groupData.map(x => {
        if(event.dataItem?.WORKGROUPID == x.WORKGROUPID){
          return {...x, selected: true}
        }
        return {...x, selected: false};
      })
      if(event.dataItem?.rowStat === "N"){
        this.getWorkerData(event.dataItem?.WORKGROUPID)
      }
      this.WORKGROUPID = event.dataItem?.WORKGROUPID
      
    },

    //header checkbox 클릭
    onHeaderSelectionChangeGrp (event) {
      console.log("xxxx")
      let checked = event.event.target.checked;
      this.groupData = this.groupData.map((item) => {
        return { ...item, selected: checked };
      });
    },
    //grpitemchange 인풋 데이터 변경시
    grpitemchange(e) {
      const data = JSON.parse(JSON.stringify(this.groupData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      
      if(data[idx].rowStat === "N"){
        data[idx].rowStat = "U";
      }
      if(data[idx].rowStat === "U" && !this.grpChkOriginalData(data, idx)){
        data[idx].rowStat = "N";
      }
      this.groupData = data;
    },

    //데이터 원상복구시 "수정" 항목 제거
    grpChkOriginalData(grpData, idx){
      const data = JSON.parse(JSON.stringify(grpData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return data[idx][x] !== this.groupOriData[idx][x] && x !== "rowStat"
      });
      return chkArr.length > 0;
    },
    openAlert(title, message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },

    //그리드 데이터 가져오기
    async getWorkerData(WORKGROUPID){
      const res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetWorkerWorkGroupRelation",
        sendParam: {
          workgroupid:  WORKGROUPID,
          plantid: "LS"
        }
      });
      this.$nuxt.$emit('iccReset');
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
      this.workerOriData = data;
      this.workerData = data;
      
    },
    workeritemchange(e){
      const data = JSON.parse(JSON.stringify(this.workerData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      
      if(data[idx].rowStat === "N"){
        data[idx].rowStat = "U";
      }
      if(data[idx].rowStat === "U" && !this.workChkOriginalData(data, idx)){
        data[idx].rowStat = "N";
      }
      this.workerData = data;
    },
    workChkOriginalData(grpData, idx){
      const data = JSON.parse(JSON.stringify(grpData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return data[idx][x] !== this.workerOriData[idx][x] && x !== "rowStat"
      });
      return chkArr.length > 0;
    },
    onHeaderSelectionChangeWorker (event) {
      let checked = event.event.target.checked;
      this.workerData = this.workerData.map((item) => {
        return { ...item, selected: checked };
      });
    },
    
    workerDelConfirm(){
      const chk = []
      this.workerData.forEach(e => {
        if(e.selected){
          chk.push(e.USERID);
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
      this.$refs.ConfirmPop.callBack = this.workerDelBtn;        
      } else {
      this.$refs.ConfirmPop.title = "삭제"
      this.$refs.ConfirmPop.message = `선택한 데이터(${chk.join()})를 삭제 하시겠습니까?`;
      this.$refs.ConfirmPop.modalWidth = "330px";
      this.$refs.ConfirmPop.visibleDialog = true;
      this.$refs.ConfirmPop.callBack = this.workerDelBtn;
      }
    },
    //삭제버튼
    // workerDelBtn(){
    //   const data = JSON.parse(JSON.stringify(this.workerData))
    //   this.workerData = data.map(x => {
    //     if(x.selected){
    //       return {
    //         ...x,
    //         rowStat: "D"
    //       }
    //     }
    //     return x;
    //   });
    // },
    workerDelBtn(){
      const data = JSON.parse(JSON.stringify(this.workerData));
      this.workerData = data.map(x => {
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


    //그리드 로우 클릭
    workerOnRowClick (event) {
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    workerGridButtonClick(e, field, dataItem){
      // console.log(e)
      // console.log(field)
      console.log(dataItem)
      this.UserModalVisible = true
      this.searchUserGroupId = dataItem.WORKGROUPID
      this.newRowUUid = dataItem.newRowUUid;
    },
    selectUser(data){
      // const row = this.workerData.filter(x => x.WORKGROUPID === this.searchUserGroupId)
      this.workerData = this.workerData.map(x => {
        if(x.rowStat === "C"){
          if(x.newRowUUid === this.newRowUUid){
            return {...x, USERNAME: data.name, USERID: data.userId, [`N${x.newRowUUid}USERNAME`]: data.name}
          }
        }else{
          if(x.WORKGROUPID === this.searchUserGroupId && x.newRowUUid === this.newRowUUid){
            return {...x, USERNAME: data.name, USERID: data.userId, [`N${x.newRowUUid}USERNAME`]: data.name, rowStat: "U"}
          }
        }
        return x;
      })
      // console.log(row)
      // console.log(data.userId)
      // console.log(data.name)
      // const asd = [];
      // this.workerData.forEach(x => {
      //   asd.push(x.USERNAME)
      // })
      // console.log(asd.join(","))
    },
    //unbo 버튼 클릭
    workerUndoBtn(){
      //this.workerData = this.workerOriData;
      this.workerData = this.workerOriData.filter((x) => x.newRow !== true);
      // const data = JSON.parse(JSON.stringify(this.workerData))
      // this.workerData = data.map(x => {
      //   if(x.selected){
      //     if(!x.newRow){
      //       const item = this.workerOriData.filter(ori => ori.USERID === x.USERID);
      //       return item[0];
      //     }
      //   }else{
      //     return x
      //   }
      // }).filter(x => !!x);
      this.$nuxt.$emit('iccReset')
    },
    //추가 버튼 클릭
    workerAddBtn(){
      this.$refs.rowGrid2.skip = 0;
      console.log(this.WORKGROUPID)
      const newRowUUid = Math.round(Math.random()*1000000000).toString()
      const dataItem = { 
        inEdit: true, 
        newRow: true,
        selected: false, 
        PLANTID: "LS", 
        rowStat: "C",
        _ROWSTATUS: "C",
        newRowUUid: `N${newRowUUid}`,
        idx: this.groupData.length,
        WORKGROUPID: this.WORKGROUPID,
        WORKGROUPNAME: "",
        DESCRIPTION: "",
        USERNAME: "",
        USERID: "",
        change: true,
      };
      this.workerData.splice(0, 0, dataItem)
      this.$nuxt.$emit('iccReset')
    },

    //맨앞 checkBox 클릭
    onSelectionchange (event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    async groupValidation(){
      const validation = this.groupData.filter(x => x.rowStat !== "N" && !x.WORKGROUPID)
      if(validation.length > 0){
        this.openAlert("저장", "작업조ID 값은 필수 입력값입니다.")
        return;
      }

      const dupChk = []
      this.groupData.forEach(x => {
        if(x.rowStat !== "N"){
          dupChk.push(x.WORKGROUPID)
        }
      })
      const dupArr = this.groupData.filter(x => x.rowStat === "N" && dupChk.indexOf(x.WORKGROUPID) > -1)
      if(dupArr.length > 0){
        this.openAlert("저장", "작업조ID값이 중복 되었습니다.")
        return;
      }
      this.saveGroup();
    },

    async saveGroup(){
      const saveData = this.groupData
        .filter(x => x.rowStat !== "N")
        .map(x => {
          return { 
            ...x,
            _ROWSTATUS: x.rowStat,
          }
        });

      if(saveData.length > 0){
        const res = await this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnWorkGroup",
          sendParam: saveData
        })

        if(res?.returncode == "0"){
          this.openAlert("저장", "저장되었습니다.")
          this.getGropuData();
        }else{
          this.openAlert("error", "오류가 발생했습니다.")
        }
      }else{
        this.openAlert("저장", "저장할 데이터가 존재하지 않습니다.")
      }
    },

    async workerValidation(){
      const validation2 = this.workerData.filter(x => x.rowStat !== "N" && !x.WORKGROUPID)
      if(validation2.length > 0){
        this.openAlert("저장", "작업조ID 값은 필수 입력값입니다.")
        return;
      }
      const validation3 = this.workerData.filter(x => x.rowStat !== "N" && !x.USERID)
      if(validation3.length > 0){
        this.openAlert("저장", "작업자 값은 필수 입력값입니다.")
        return;
      }
      const dupChk = []
      this.workerData.forEach(x => {
        if(x.rowStat !== "N"){
          dupChk.push(x.USERID)
        }
      })
      const dupArr = this.workerData.filter(x => x.rowStat === "N" && dupChk.indexOf(x.USERID) > -1)
      if(dupArr.length > 0){
        this.openAlert("저장", "작업자값이 중복 되었습니다.")
        return;
      }
      

      this.saveWorker()
    },

    async saveWorker(){
      const saveData = this.workerData
        .filter(x => x.rowStat !== "N")
        .map(x => {
          return { 
            ...x,
            _ROWSTATUS: x.rowStat,
          }
        });

      if(saveData.length > 0){
        const res = await this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnWorkGroupUserMap",
          sendParam: saveData
        })

        if(res?.returncode == "0"){
          this.openAlert("저장", "저장되었습니다.")
          this.getGropuData();
        }else{
          this.openAlert("error", "오류가 발생했습니다.")
        }
      }else{
        this.openAlert("저장", "저장할 데이터가 존재하지 않습니다.")
      }
      //수정 로직 변경 필요
      //"Can't find the such data. [SELECT * FROM WORKGROUPUSERMAP WHERE WORKGROUPID = :WORKGROUPID AND USERID = :USERID AND PLANTID = :PLANTID  FOR UPDATE ]"
      // 조회할때 USERID 변경되는데 달라져서 select 안됨
      // 작업자 변경시 delete inset 
      
    },
    searchInput(nm, val){
      this[nm] = val;
    },
    sortChangeHandler1(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.groupData = this.groupData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.groupData = this.groupData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    },
    sortChangeHandler2(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.workerData = this.workerData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.workerData = this.workerData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    }
  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>