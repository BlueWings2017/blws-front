<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="title"
      width="70%"
      height="600"
      @close="toggleDialog"
    >
      <v-row no-gutters>
        <v-col :sm="9" :lg="9">
          <div class="form-group-wrap">
            <div class="form-group">
              <label>제품코드</label>
              <InputText
                ref="productid"
                :dataNm="'productid'"
                :disabled="false"
                :style="{ width: '160px' }"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label>제품명</label>
              <InputText
                ref="productName"
                :dataNm="'productName'"
                :disabled="false"
                :style="{ width: '160px' }"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
          </div>
        </v-col>
        <v-col :sm="3" :lg="3" align="right">
          <kbutton
            :theme-color="'primary'"
            :size="'medium'"
            :icon="'search'"
            @click="searchBtn"
            >조회</kbutton
          >
          <kbutton
            :theme-color="'primary'"
            :size="'medium'"
            :icon="'save'"
            @click="selectRow"
            >선택</kbutton
          >
        </v-col>
      </v-row>
      <div ref="divWrapper" style="height: calc(100% - 44px)">
        <KendoGrid
          ref="rowGrid"
          :gridHeight="gridHeight"
          :gridItems="gridData"
          :sortable="true"
          :columns="headerParam.gridHeader"
          :resizable="true"
          :edit-field="'inEdit'"
          :selected-field="selectedField"
          :disabledCheckHeaderArr="disabledCheckHeaderArr"
          :isPaging="true"
          :reSetPage="this.reSetPage"
          @gridrowclick="onRowClick"
          @rowdblclick="rowdblclick"
          @sortChangeHandler="sortChangeHandler"
        />
      </div>
    </Dialog>
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
//import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid";
import InputText from "@/components/common/input/InputText";
import FadeLoader from "vue-spinner/src/FadeLoader.vue";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";

export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    kbutton: Button,
    KendoGrid,
    InputText,
    FadeLoader,
    Card,
    CardBody,
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '모델링 설정 목록',
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
        gridid: "dgvSelectModelingConfirmList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        noFirstCheck: true,
        noRowstat: true,
      },
      disabledCheckHeaderArr: ["CONFIRMFLAG", "ACTIVESTATE"],
      selectedID: null,
      productid: "",
      productName: "",
      isLoading: true,
      reSetPage: false,
    };
  },
  computed: {},
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getGridData();
  },
  methods: {
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    async searchBtn() {
      this.reSetPage = true;
      await this.getGridData();
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetModelingConfirmDataList",
        sendParam: {
          plantid: "LS",
          productid: this.productid,
          productName: this.productName,
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
            resizable: true,
          };
        });
        this.$nuxt.$emit("iccReset");
        if (data !== undefined && data.length > 0) {
          data[0][this.selectedField] = true;
        }
        this.gridData = data;
        this.isLoading = false;
      });
    },
    toggleDialog() {
      this.$emit("visibleDialog", !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.gridData.forEach((x) => (x.selected = false));
      event.dataItem[this.selectedField] = true;
    },
    //그리드 더블 클릭
    rowdblclick(event) {
      if(event.dataItem.PROCESSROUTEID === null){
        this.$refs['alertPop'].show("알림", "라우팅설정이 안되어 있습니다. 확인해주시기 바랍니다.");
        return;
      }
      this.$emit("searchBtn", event.dataItem);
      this.$emit("visibleDialog", !this.visibleDialog);
    },
    //row 선택
    selectRow() {
      const returnData = this.gridData.filter((x) => x.selected);
      if(returnData.length === 0){
        this.$refs['alertPop'].show("알림", "선택된 제품이 없습니다.");
        return;
      }

      if(returnData.PROCESSROUTEID === null){
        this.$refs['alertPop'].show("알림", "라우팅설정이 안되어 있습니다. 확인해주시기 바랍니다.");
        return;
      }
      this.$emit("searchBtn", returnData[0]);
      this.$emit("visibleDialog", !this.visibleDialog);
    },
    searchInput(nm, val) {
      this[nm] = val;
    },
    sortChangeHandler(e) {
      const isAscending = e.sort[0]?.dir == "asc";
      if (isAscending) {
        this.gridData = this.gridData.sort((a, b) =>
          a[e.event?.field] < b[e.event?.field]
            ? -1
            : a[e.event?.field] > b[e.event?.field]
            ? 1
            : 0
        );
      } else {
        this.gridData = this.gridData.sort((a, b) =>
          a[e.event?.field] > b[e.event?.field]
            ? -1
            : a[e.event?.field] < b[e.event?.field]
            ? 1
            : 0
        );
      }
    },
  },
};
</script>