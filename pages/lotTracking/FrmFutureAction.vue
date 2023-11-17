<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>예약작업관리</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10" align="left">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>Lot ID</label>
                    <InputText
                      ref="lotid"
                      :boxWidth="'90%'"
                      :dataNm="'lotid'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>Lot 상태</label>
                    <MesSelectBox
                      :enumID="'futureactionlotstate'"
                      :allYN="true"
                      :dataNm="'futureactionlotstate'"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>생성일자</label>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="fromdate"
                        :default-value="new Date(new Date().setDate(new Date().getDate() - 7))"
                        :dataNm="'fromdate'"
                        :format="'yyyy-MM-dd'"
                        @change="fromChange"
                      />
                    </div>
                    <span class="i_tilde">~</span>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="todate"
                        :default-value="new Date()"
                        :dataNm="'todate'"
                        :format="'yyyy-MM-dd'"
                        @change="toChange"
                      />
                    </div>
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
    <div ref="contents">
      <v-row :class="'divListWapper'" :style="{ height: '50%' }">
        <v-col :cols="12" :class="'divList1'" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%',height: '100%' }">
              <v-row>
                <v-col cols="1" align="left">
                  <CardTitle>Lot 목록</CardTitle>
                </v-col>
                <v-col align="left">
                  <span>목록에서 예약 작업을 관리할 Lot을 선택하세요.</span>
                </v-col>
              </v-row>
              <div ref="divWrapperLotList" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                  ref="rowGrid"
                  :gridHeight="dgvLotListHeight"
                  :gridItems="this.dgvLotListData"
                  :sortable="true"
                  :columns="dgvLotListParam.gridHeader"
                  :resizable="true"
                  :isPaging="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :gridDropDownList="dgvLotListParam.enumComboBox"
                  :disabledCheckHeaderArr="disabledCheckHeaderArr"
                  @selectionchange="onSelectionchange"
                  @gridrowclick="onLotListRowClick"
                  @griditemchange="griditemchange"
                  @sortChangeHandler="sortChangeHandler1"
                  @headerselectionchange="onHeaderSelectionChange"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <v-row :class="'divListWapper'" :style="{ height: '50%' }">
        <v-col :cols="12" :class="'divList2'" :style="{ height: '100%' }">
          <Card ref="gridCard2" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%',height: '100%' }">
              <v-row>
                <v-col cols="6" align="left">
                  <CardTitle>예약 작업관리 목록</CardTitle>
                </v-col>
                <v-col cols="6" align="right">
                  <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveBtn">저장</Button>
                  <Button :theme-color="'secondary'" :size="'small'" icon="add" @click="addBtn">추가</Button>
                  <Button :theme-color="'secondary'" :size="'small'" icon="delete" @click="delBtn">삭제</Button>
                  <Button :theme-color="'secondary'" :size="'small'" icon="undo" @click="undoBtn">undo</Button>
                </v-col>
              </v-row>
              <v-row :style="{ height: 'calc(100% - 33px)', 'margin-top': '0px' }">
                <v-col :sm="4" :lg="3" :style="{ height: '100%' }">
                  <div ref="divWrapperLotProcessList" :style="{ height: '100%' }">
                    <KendoGrid
                      ref="rowGrid"
                      :gridItems="dgvLotProcessListData"
                      :sortable="true"
                      :columns="dgvLotProcessListParam.gridHeader"
                      :resizable="true"
                      :edit-field="'inEdit'"
                      :selected-field="selectedField"
                      :gridDropDownList="dgvLotProcessListParam.enumComboBox"
                      :disabledCheckHeaderArr="disabledCheckHeaderArr"
                      @selectionchange="onSelectionchange"
                      @gridrowclick="onLotProcessListRowClick"
                      @griditemchange="griditemchange"
                      @sortChangeHandler="sortChangeHandler2"
                      @headerselectionchange="onHeaderSelectionChange"
                    />
                  </div>
                </v-col>
                <v-col :sm="8" :lg="9" :style="{ height: '100%' }">
                  <div ref="divWrapperFutureActionList" :style="{ height: '100%' }">
                    <KendoGrid
                      ref="rowGrid3"
                      :gridItems="dgvFutureActionListData"
                      :sortable="true"
                      :columns="dgvFutureActionListParam.gridHeader"
                      :resizable="true"
                      :edit-field="'inEdit'"
                      :selected-field="selectedField"
                      :disabledCheckHeaderArr="disabledCheckHeaderArr"
                      :customCell="dgvFutureActionListParam.customCell"
                      @selectionchange="onSelectionchange"
                      @gridrowclick="onFutureActionListRowClick"
                      @gridddchang="rowDdChange"
                      @griditemchange="griditemchange"
                      @sortChangeHandler="sortChangeHandler3"
                      @headerselectionchange="onHeaderSelectionChange"
                    />
                  </div>
                </v-col>
              </v-row>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
    </div>
    
    <AlertPop ref="alertPop" :is="'alertPop'" />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid";
import { Dialog, DialogActionsBar, Window } from "@progress/kendo-vue-dialogs";
import {
  AutoComplete,
  ComboBox,
  DropDownList,
  MultiSelect,
} from "@progress/kendo-vue-dropdowns";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";

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
    InputText,
    Checkbox,
    Dialog,
    DialogActionsBar,
    AutoComplete,
    ComboBox,
    dropdownlist: DropDownList,
    MesSelectBox,
    Window,
    DatePicker
  },
  props: {
    dgvLotListHeight: {
      type: String,
      default : "250px"   
    },
    dgvLotProcessListHeight:{
      type: String,
      default: "300px"
    },
    dgvFutureActionListHeight:{
      type: String,
      default: "300px"
    }
  },
  data() {
    return {
      dgvLotListData: [],
      dgvLotProcessListData: [],
      dgvFutureActionListData: [],
      dgvFutureActionListOriData: [],
      gridLastModIdx: null,
      gridDropDownList: [],
      dgvFutureActionListDropDownList: [
        {
          dataVal: "ACTIONTYPE",
          dataItem: [],
        }
      ],
      reasonCodeList: [],
      selectedField: "selected",
      expand: {
        ids: [],
        idField: "LOTID",
      },
      selectedlot: {},
      selectedprocess: {},
      disabledCheckHeaderArr: ["GOINORDERREQUIRED"],
      lotid: "",
      futureactionlotstate: "",
      productid: "",
      fromdate: Utility.setFormatDate(new Date(new Date().setDate(new Date().getDate() - 7)), "YYYYMMDD"),
      todate: Utility.setFormatDate(new Date(), "YYYYMMDD"),
      dgvLotListParam: {
        gridid: "dgvLotList_FutureAction", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      dgvLotProcessListParam: {
        gridid: "dgvLotProcessList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true
      },
      dgvFutureActionListParam: {
        gridid: "dgvFutureActionList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true
      }
    };
  },
  created() {},
  async mounted() {
    await this.getHeaderMulti(this.dgvLotListParam, this.$refs.divWrapperLotList);
    await this.getHeaderMulti(this.dgvLotProcessListParam, this.$refs.divWrapperLotProcessList);
    await this.getHeaderMulti(this.dgvFutureActionListParam, this.$refs.divWrapperFutureActionList);
    await this.getGridComboList();
    await this.getLotListData();
  },
  computed: {
  },
  watch: {},
  methods: {
    initScreen() {
      this.dgvLotListData = [];
      this.dgvLotProcessListData = [];
      this.dgvFutureActionListData = [];
      this.dgvFutureActionListOriData = [];
      this.selectedlot = {};
      this.selectedprocess = {};
      this.$refs.rowGrid3.skip = 0;
    },
    searchBtn() {
      this.$refs.rowGrid3.skip = 0;
      this.getLotListData();
    },
    saveBtn(){
      const saveData = this.dgvFutureActionListData.filter(x => x.rowStat !== "N")
      .map(x => {
        return { 
            ...x,
            REASONCODETYPE: this.reasonCodeList.find(y => y.ENUMVALUE === x.REASONCODE) === undefined ? '' : this.reasonCodeList.find(y => y.ENUMVALUE === x.REASONCODE).REASONCODETYPE,
            _ROWSTATUS: x.rowStat,
            _ROWSTATUSIMAGE: 'System.Drawing.Bitmap'
          }
      });

      if(saveData.find(x => x.REASONCODE === "")){
        //alert( "사유코드 항목은 필수 항목입니다." );
        this.$refs.alertPop.show("알림", "사유코드 항목은 필수 항목입니다.");
        return;
      }

      const actionTypeList = this.dgvFutureActionListData.filter(x => x.rowStat !== "D").map(x => {
        return x.ACTIONTYPE;
      });
      const setCollection = new Set(actionTypeList.map(JSON.stringify));
      const isDuplicate = setCollection.size < actionTypeList.length;
      if(isDuplicate){
        //alert( "같은 작업구분 항목은 등록할 수 없습니다." );
        this.$refs.alertPop.show("알림", "같은 작업구분 항목은 등록할 수 없습니다.");
        return;
      }

      if(saveData.length > 0){
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnLotFutureAction",
          sendParam: saveData
        }).then((result) => {
          this.$nextTick(() => {
            this.getLotListData();
            if(result.returncode !== undefined){
              if(result.returncode === "0") {
                this.$refs.alertPop.show("알림", "저장되었습니다");
              }
              else {
                this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
              }
              
            }
            else{
              this.$refs.alertPop.show("ERROR : " + result.code, result.message);
            }
          })
        })
        
      }
      else {
        //alert('저장할 데이터가 존재하지 않습니다.');
        this.$refs.alertPop.show("알림", "저장할 데이터가 존재하지 않습니다.");
        return;
      }
    },
    toChange(e) {
      this.todate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    fromChange(e) {
      this.fromdate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    //그리드 데이터 가져오기
    getLotListData() {
      this.initScreen();
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetOMFutureActionLotList",
        sendParam: {
          lotid: this.lotid,
          lotstate: this.futureactionlotstate,
          fromdate: this.fromdate,
          todate: this.todate,
          plantid: "LS"
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
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit("iccReset");
        this.dgvLotListData = data;

        if(data.length > 0) {
          this.onLotListRowClick({ dataItem: this.dgvLotListData[0]});
        }
      });
    },
    async getLotProcessListData() {
      this.dgvLotProcessListData = [];
      this.dgvFutureActionListData = [];
      this.dgvFutureActionListOriData = [];
      this.selectedprocess = {};
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetOMFutureActionProcessList",
        sendParam: {
          lotid: this.selectedlot.LOTID,
          plantid: "LS"
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
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit("iccReset");
        this.dgvLotProcessListData = data;

        if(data.length > 0) {
          this.onLotProcessListRowClick({ dataItem: this.dgvLotProcessListData[0]});
        }
      });
    },
    async getFutureActionListData() {
      this.dgvFutureActionListData = [];
      this.dgvFutureActionListOriData = [];
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetOMFutureActionList",
        sendParam: {
          plantid: "LS",
          lotid: this.selectedprocess.LOTID,
          timekey: this.selectedprocess.TIMEKEY
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
            customCell: {
              ACTIONTYPE: {
                type: 'combo',
                dataItem: this.dgvFutureActionListDropDownList[0].dataItem,
                readonly: true
              },
              REASONCODE: {
                type: 'combo',
                dataItem: this.reasonCodeList.filter(y => y.REASONCODETYPE.toUpperCase() === x.ACTIONTYPE.toUpperCase()),
                readonly: true
              }
            }
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit("iccReset");
        this.dgvFutureActionListData = data;
        this.dgvFutureActionListOriData = JSON.parse(JSON.stringify(data));
      });
    },

    //그리드 콤보박스 리스트가져오기
    async getGridComboList() {
        await this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetEnumValue",
          sendParam: {
            plantid: "LS",
            enumid: "FutureActionType"
          }
        }).then((data) => {
          this.dgvFutureActionListDropDownList[0].dataItem = data;
        })

        await this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetOMFutureActionReasoncodeList",
          sendParam: {
            plantid: "LS",
          }
        }).then((data) => {
          this.reasonCodeList = data.map(x => {
            return {
              REASONCODETYPE: x.REASONCODETYPE,
              ENUMVALUE: x.REASONCODE,
              ENUMVALUENAME: x.DESCRIPTION,
            }
          })
        })
    },

    //그리드 로우 클릭
    onLotListRowClick(event) {
      //console.log("===========onRowClick==============");
      //그리드 로우 클릭시 라인표시 유무 확인필요
      this.dgvLotListData.forEach(x => x.selected = false);
      event.dataItem[this.selectedField] = true;

      this.selectedlot = event.dataItem;
      this.getLotProcessListData();
    },
    onLotProcessListRowClick(event) {
      //console.log("===========onRowClick==============");
      //그리드 로우 클릭시 라인표시 유무 확인필요
      this.dgvLotProcessListData.forEach(x => x.selected = false);
      event.dataItem[this.selectedField] = true;
      this.selectedprocess = event.dataItem;
      this.getFutureActionListData();
    },
    onFutureActionListRowClick(event) {
      this.dgvFutureActionListData.forEach(x => x.selected = false);
      event.dataItem[this.selectedField] = true;
      this.selectedprocess = event.dataItem;
    },

    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      console.log("===========onSelectionchange==============");
      //event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      console.log("===========onHeaderSelectionChange==============");
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map((item) => {
        return { ...item, selected: checked };
      });
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      // console.log("===rowDdChange===",e)
      const idx = this.dgvFutureActionListData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.dgvFutureActionListData));

      if (name === "GOINORDERREQUIRED") {
        e.value = e.value ? "Yes" : "No";
      }

      if(name === "ACTIONTYPE"){
        data[idx] = {
          ...data[idx],
          customCell: {
            ACTIONTYPE: {
              type: 'combo',
              dataItem: this.dgvFutureActionListDropDownList[0].dataItem,
            },
            REASONCODE: {
              type: 'combo',
              dataItem: this.reasonCodeList.filter(x => x.REASONCODETYPE === e.value.toUpperCase())
            }
          }
        }
      }

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.dgvFutureActionListParam.gridHeader, data, this.dgvFutureActionListOriData, idx)) {
        data[idx].rowStat = "N";
      }

      this.dgvFutureActionListData = data;
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      console.log("===griditemchange===", e);

      const data = JSON.parse(JSON.stringify(this.dgvFutureActionListData));
      const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.dgvFutureActionListParam.gridHeader, data, this.dgvFutureActionListOriData, idx)) {
        data[idx].rowStat = "N";
      }

      this.dgvFutureActionListData = data;
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    comboChange(nm, val) {
      this[nm] = val;
    },
    chkVal(nm, val) {
      this[nm] = val ? "Yes" : "";
    },

    //undo 버튼 클릭
    undoBtn(){
      this.dgvFutureActionListData = this.dgvFutureActionListOriData;
      this.$nuxt.$emit('iccReset')
    },
    //추가 버튼 클릭
    addBtn(){
      const newRowUUid = Math.round(Math.random()*1000000000).toString()
      const dataItem = { 
        inEdit: true, 
        newRow: true,
        selected: false,
        PLANTID: "LS",
        rowStat: "C",
        newRowUUid: newRowUUid,
        _ROWSTATUS: "C",
        LOTID: this.selectedprocess.LOTID,
        ACTIONTYPE: "Scrap",
        PROCESSNAME: this.selectedprocess.PROCESSNAME,
        REASONCODE: this.reasonCodeList.filter(x => x.REASONCODETYPE === "SCRAP")[0].ENUMVALUE,
        TIMEKEY: this.selectedprocess.TIMEKEY,
        idx: this.dgvFutureActionListData.length,
        customCell: {
          ACTIONTYPE: {
            type: 'combo',
            dataItem: this.dgvFutureActionListDropDownList[0].dataItem,
          },
          REASONCODE: {
            type: 'combo',
            dataItem: this.reasonCodeList.filter(x => x.REASONCODETYPE === "SCRAP")
          }
        }
      };
      
      this.dgvFutureActionListData.splice(0, 0, dataItem);
      this.$refs.rowGrid3.skip = 0;
      this.$nuxt.$emit('iccReset')
    },
    //삭제버튼
    delBtn(){
      const data = JSON.parse(JSON.stringify(this.dgvFutureActionListData));
      this.dgvFutureActionListData = data.map(x => {
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
      this.$nuxt.$emit('iccReset')
    },
    sortChangeHandler1(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.dgvLotListData = this.dgvLotListData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.dgvLotListData = this.dgvLotListData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    },
    sortChangeHandler2(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.dgvLotProcessListData = this.dgvLotProcessListData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.dgvLotProcessListData = this.dgvLotProcessListData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    },
    sortChangeHandler3(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.dgvFutureActionListData = this.dgvFutureActionListData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.dgvFutureActionListData = this.dgvFutureActionListData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    }
  },
};

const defaultData = {};
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
