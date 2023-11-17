<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="Lot ID 조회"
      width="70%"
      height="600"
      @close="toggleDialog"
    >
      <v-row no-gutters>
        <v-col :sm="9" :lg="10">
          <div class="form-group-wrap">
            <div class="form-group">
              <label> Lot ID </label>
              <InputText
                ref="lotid"
                dataNm="lotid"
                :disabled="false"
                :defaultValue="lotid"
                :searchOption="true"
                :searchFunc="getGridData"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label> 제품코드 </label>
              <InputText
                ref="productid"
                :boxWidth="'98%'"
                dataNm="productid"
                :disabled="false"
                :defaultValue="productid"
                :searchOption="true"
                :searchFunc="getGridData"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label> 시작일자 </label>
              <div class="form-datepicker">
                <DatePicker
                  ref="fromdate"
                  :default-value="new Date(fromdate)"
                  :dataNm="'fromdate'"
                  :format="'yyyy-MM-dd'"
                  @change="fromChange"
                />
              </div>
              <span class="i_tilde">~</span>
              <div class="form-datepicker">
                <DatePicker
                  ref="todate"
                  :default-value="new Date(todate)"
                  :dataNm="'todate'"
                  :format="'yyyy-MM-dd'"
                  @change="toChange"
                />
              </div>
            </div>
            <v-col cols="1" align="left">
              <v-row class="search-box" align="center" no-gutters>
                <div class="form-group">
                  <label> 재공 Lot </label>
                  <Checkbox
                    ref="lotstate"
                    :dataNm="'lotstate'"
                    :disabled="false"
                    :defaultchecked="true"
                    @checkbox-set="chkVal"
                  ></Checkbox>
                </div>
              </v-row>
            </v-col>
          </div>
        </v-col>
        <v-col :sm="3" :lg="2" align="right">
          <Button
            :theme-color="'primary'"
            :size="'medium'"
            :icon="'search'"
            @click="searchBtn"
            >조회</Button
          >
          <Button
            :theme-color="'primary'"
            :size="'medium'"
            :icon="'check'"
            @click="selectRow"
            >선택</Button
          >
        </v-col>
      </v-row>
      <div ref="divWrapper" style="height: calc(100% - 44px)">
        <KendoGrid
          ref="rowGrid"
          :gridHeight="gridHeight"
          :gridItems="items"
          :sortable="true"
          :columns="gridHeader"
          :resizable="true"
          :isPaging="true"
          :edit-field="'inEdit'"
          :selected-field="selectedField"
          :disabledCheckHeaderArr="disabledCheckHeaderArr"
          @gridrowclick="onRowClick"
          @rowdblclick="rowdblclick"
          @sortChangeHandler="sortChangeHandler"
        />
      </div>
    </Dialog>

    <div
      v-if="isLoading"
      class="loading-container"
      :style="{ 'z-index': '999999', position: 'relative' }"
    >
      <div class="loading">
        <FadeLoader />
      </div>
    </div>
  </div>
</template>
<script>
import Utility from "~/plugins/utility";
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid";
import InputText from "@/components/common/input/InputText";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import Checkbox from "@/components/common/input/Checkbox";
import moment from "moment";
import { orderBy } from "@progress/kendo-data-query";

export default {
  name: "LotSearchModal",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Utility,
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    FadeLoader,
    Checkbox,
    DatePicker,
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      gridHeight: "400px",
      selectedField: "selected",
      headerParam: {
        gridid: "dgvLotList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      disabledCheckHeaderArr: ["ACTIVESTATE", "CONFIRMFLAG", "COMMONFLAG"],
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      lotid: "",
      productid: "",
      isLoading: true,
      chkLot: true,
      chkDate: false,

      fromdate: moment().subtract(1, "weeks").format("YYYY-MM-DD"),
      todate: moment().format("YYYY-MM-DD"),
      sortField: [{}],
    };
  },
  computed: {
    items() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.LOTID === this.selectedID,
      }));
    },
  },
  async mounted() {
    this.fromdate = Utility.setFormatDate(this.fromdate, "YYYYMMDD");
    this.todate = Utility.setFormatDate(this.todate, "YYYYMMDD");
    await this.getGridData();
  },
  methods: {
    async searchBtn() {
      this.$refs.rowGrid.sortField = [{}];
      this.$refs.rowGrid.skip = 0;
      await this.getGridData();
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetLotSearchList",
        sendParam: {
          plantid: "Ls",
          lotid: this.lotid,
          lotstate: this.chkLot ? "Released" : "",
          productid: this.productid,
          fromdate: this.fromdate,
          todate: this.todate,
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
        this.$nuxt.$emit("iccReset");
        this.gridData = data;
        this.isLoading = false;
      });
    },
    toggleDialog() {
      this.$emit("visibleDialog", !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.selectedID = event.dataItem.LOTID;
    },
    //그리드 더블 클릭
    rowdblclick(event) {
      this.$emit("selectLotId", event.dataItem);
      this.$emit("searchBtn", event.dataItem);
      this.$emit("visibleDialog", !this.visibleDialog);
    },
    //row 선택
    selectRow(event) {
      const returnData = this.items.filter((x) => x.selected);
      this.$emit("selectLotId", returnData[0]);
      this.$emit("searchBtn", returnData[0]);
      this.$emit("visibleDialog", !this.visibleDialog);
    },
    searchInput(nm, val) {
      this[nm] = val;
    },
    toChange(e) {
      this.todate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    fromChange(e) {
      this.fromdate = Utility.setFormatDate(e.value, "YYYYMMDD");
    },
    chkVal(nm, val) {
      this[nm] = val ? "Released" : "";
    },
    // 필터 정렬
    // sortChangeHandler(e) {
    //   this.gridData = orderBy(this.gridData, e.sort);
    // },
    sortChangeHandler(e){
      this.gfn_sortChangeHandler(this.gridData, e);
    },
  },
};
</script>
