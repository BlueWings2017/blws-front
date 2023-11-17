<template>
  <div>
    <ol class="page-navigation">
        <li>홈</li>
        <li>기준정보</li>
        <li>설비별작업조관리</li>
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
                      설비코드
                    </Label>
                    <InputText
                      ref="EQUIPMENTID"
                      :boxWidth="'90%'"
                      dataNm="EQUIPMENTID"
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
                <!-- <Button :theme-color="'primary'" icon="save" @click="saveBtn">저장</Button> -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>


    <v-row ref="contents">
      <v-col :cols="5" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="6" align="left">
                <CardTitle>설비목록</CardTitle>
              </v-col>
            </v-row>
            <div ref="divWrapper" style="height: calc(100% - 33px)">
              <KendoGrid 
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="gridHeader"
                :resizable="false"
                :edit-field="'inEdit'"
                :isPaging="true"
                :selected-field="selectedField"
                @gridrowclick="onRowClick"
                @sortChangeHandler="sortChangeHandler"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col :cols="7"  style="height: calc(100%)" >
        <WorkerGroup
          ref="WorkerGroup"
          @saveBtn="saveBtn"
        />
      </v-col>
    </v-row>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    <ConfirmPop
      ref="ConfirmPop"
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
import WorkerGroup from "@/components/frmEquipmentWorker/WorkerGroup"
import InputText from "@/components/common/input/InputText";

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, customGridHeaderMixin],
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
    CardTitle
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
      EQUIPMENTID: "",
      gridGRPHeight: "50%",
      rowInfo: {},
      headerParam: {},
    };
  },
  created() {
  },
  async mounted() {
    this.getHaeder();
    this.searchBtn();
  },
  computed: {
    areAllSelected() {
      return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
    },
  },
  watch: {
  },
  methods: {
    async getHaeder(){
      this.gridHeader = await this.getCustomHeader("dgvEquipmentStateChangeList",true,true);
    },
    async searchBtn(){
      const res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEquipmentList",
        sendParam: {
          equipmentid: this.EQUIPMENTID,
          equipmentstate: "",
          equipmentdetailtype: "Equipment",
          plantid: "LS"
        }
      });
      this.gridData = res.map(x => ({...x, selected: false}))
      this.onRowClick({dataItem: this.gridData[0]})
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
      this.$refs.WorkerGroup.searchData();
    },
    searchInput(nm, val){
      this[nm] = val;
    },
    sortChangeHandler(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    },


  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>