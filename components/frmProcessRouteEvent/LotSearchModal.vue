<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="Lot ID 조회"
      width="70%"
      height="800"
      @close="toggleDialog"
    >

      <v-row ref="searchFilter">
        <v-col :cols="12">
          <v-row>
            <v-col :sm="10" :lg="10">
              <div class="form-group-wrap">
                <div class="form-group">
                  <label style="">Lot ID</label>
                  <InputText
                    ref="lotId"
                    :boxWidth="'90%'"
                    dataNm="lotId"
                    :disabled="false"
                    @input-text-set="searchInput"
                  />
                </div>
                <div class="form-group">
                  <label style="">제품코드</label>
                  <InputText
                    ref="lotId"
                    :boxWidth="'90%'"
                    dataNm="productId"
                    :disabled="false"
                    @input-text-set="searchInput"
                  />
                </div>
                <div class="form-group">
                  <label style="">재공Lot</label>
                  <Checkbox
                    ref="commonflag"
                    dataNm="chkLot"
                    :defaultchecked="chkLot"
                    @checkbox-set="searchInput"
                  />
                </div>
              </div>

              <div class="form-group-wrap">
                <div class="form-group">
                  <label style="">시작일자</label>
                  <DatePickerSingle
                    :defaultValue="new Date(form)"
                    boxWidth="100%"
                    dataNm="fromdate"
                    @input-date-set="searchInput"
                  />
                </div>
                <span class="i_tilde">~</span>
                <div class="form-group">
                  <DatePickerSingle
                    :defaultValue="new Date(to)"
                    dataNm="todate"
                    boxWidth="100%"
                    @input-date-set="searchInput"
                  />
                </div>
                <div class="form-group">
                  <Checkbox
                    ref="commonflag"
                    dataNm="chkDate"
                    @checkbox-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :sm="2" :lg="2" align="right">
              <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="searchBtn" >조회</Button>
              <Button :theme-color="'primary'" :size="'medium'" icon="check"  @click="selectRow">선택</Button>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row ref="contents">
        <v-col :cols="12" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <div ref="divWrapper" :style="{ height: '100%' }">
                <KendoGrid 
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="items"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :disabledCheckHeaderArr="disabledCheckHeaderArr"
                  :isPaging="true"
                  @gridrowclick="onRowClick"
                  @rowdblclick="rowdblclick"
                  @sortChangeHandler="sortChangeHandler"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>

    </Dialog>

    <div v-if="isLoading" class="loading-container" :style="{'z-index': '999999', position: 'relative'}">
      <div class="loading">
        <FadeLoader />
      </div>
    </div>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />

  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText";
import DatePickerSingle from "@/components/common/input/DatePickerSingle";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import Checkbox from "@/components/common/input/Checkbox";
import moment from "moment";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";

export default { 
  name: "LotSearchModal",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    FadeLoader,
    Checkbox,
    DatePickerSingle,
    Card,
    CardBody, 
    CardTitle,
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true
    }
  },
  data() {
    return {
      gridHeader: [],
      gridData : [],
      gridHeight : '400px',
      selectedField: 'selected',
      headerParam: {
        gridid: "dgvLotList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      disabledCheckHeaderArr: [ "ACTIVESTATE", "CONFIRMFLAG", "COMMONFLAG" ],
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      lotId: "",
      productId: "",
      isLoading: true,
      chkLot: true,
      chkDate: false,
      form: moment().subtract(1, "weeks").format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      fromdate: "",
      todate: "",
    }
  },
  computed: {
    items () {
      return this.gridData.map((item) => ({ ...item, selected: item.LOTID === this.selectedID }));
    },
  },
  async mounted() {
    await this.getGridData();
  },
  methods: {
    searchBtn(){
      if(!this.chkLot && !this.chkDate) {
        this.openAlert("조회","너무 많은 Lot이 조회되어 시스템에 문제가 발생될수 있습니다. 조회조건을 확인하세요.")
        return;
      }
      this.getGridData();
    },
    //그리드 데이터 가져오기
    async getGridData() {
      console.log(this.fromdate)
      console.log(this.todate)
      const fdate = moment(this.fromdate).format("YYYY-MM-DD") === "Invalid date"
        ? moment(this.form).format("YYYY-MM-DD")
        : moment(this.fromdate).format("YYYY-MM-DD");

      const tdate = moment(this.todate).format("YYYY-MM-DD") === "Invalid date"
        ? moment(this.to).format("YYYY-MM-DD")
        : moment(this.todate).format("YYYY-MM-DD");
      

      console.log(fdate)
      console.log(tdate)
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotSearchList",
        sendParam: {
          plantid: "Ls",
          lotid: this.lotId,
          lotstate: this.chkLot ? "Released" : "",
          productid: this.productId,
          fromdate: this.chkDate ? fdate.replace(/-/gi,"") : "00000000",
          todate: this.chkDate ? tdate.replace(/-/gi,"") : "99999999",
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
        this.gridData = data;
        this.isLoading = false
      })
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //그리드 로우 클릭
    onRowClick (event) {
      this.selectedID = event.dataItem.LOTID;
    },
    //그리드 더블 클릭
    rowdblclick(event){
      this.$emit('selectLotId', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //row 선택
    selectRow() {
      const retuenData = this.items.filter(x => x.selected);
      this.$emit('selectLotId', retuenData[0]);
      this.$emit('visibleDialog', !this.visibleDialog)
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
    openAlert(title, message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
  },
};
</script>