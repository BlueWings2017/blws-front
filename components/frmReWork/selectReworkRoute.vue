<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="selectModelingConfirm"
      width="50%"
      height="600"
      @close="toggleDialog"
    >
      <v-row :style="{ 'margin-bottom': '10px' }">
        <v-col :sm="7" :lg="8" align="left">
          <v-row class="search-box" align="center" no-gutters>
            <Label>
              <!-- <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon> -->
              라우팅 ID
            </Label>

            <v-col :cols="5">
              <InputText
                ref="processrouteid"
                :boxWidth="'90%'"
                :dataNm="'processrouteid'"
                :disabled="false"
                @input-text-set="searchInput"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col :sm="5" :lg="4" align="right">
          <Button
            :theme-color="'primary'"
            :size="'medium'"
            :icon="'search'"
            @click="getGridData"
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
      <div ref="divWrapper">
        <KendoGrid
          ref="rowGrid"
          :gridHeight="gridHeight"
          :gridItems="items"
          :sortable="true"
          :columns="gridHeader"
          :resizable="true"
          :edit-field="'inEdit'"
          :selected-field="selectedField"
          :gridDropDownList="gridDropDownList"
          :checkHeaderArr="checkHeaderArr"
          @selectionchange="onSelectionchange"
          @gridrowclick="onRowClick"
          @headerselectionchange="onHeaderSelectionChange"
          @rowdblclick="rowdblclick"
        />
      </div>
      <!-- <DialogActionsBar>
        <Button @click="toggleDialog">No</Button>
        <Button :theme-color="'primary'" @click="toggleDialog">Yes</Button>
      </DialogActionsBar> -->
    </Dialog>
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid";
import InputText from "@/components/common/input/InputText";

export default {
  name: "SearchModal",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
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
      gridOriData: [],
      gridHeight: "400px",
      selectedField: "selected",
      headerParam: {
        gridid: "dgvProcessRoute", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      gridDropDownList: [
        {
          dataVal: "PROCESSROUTETYPE",
          dataItem: [],
        },
      ],
      checkHeaderArr: ["ACTIVESTATE", "CONFIRMFLAG", "COMMONFLAG"],
      //disabledCheckHeaderArr: ["ACTIVESTATE", "CONFIRMFLAG", "COMMONFLAG"],
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      processrouteid: "",
      lotid: "",
    };
  },
  computed: {
    areAllSelected() {
      return (
        this.gridData.findIndex((x) => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    },
    items() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.PROCESSROUTEID === this.selectedID,
      }));
    },
  },
  mounted() {
    this.getGridComboList();
  },
  methods: {
    //그리드 콤보박스 리스트가져오기
    getGridComboList() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValue",
        sendParam: {
          plantid: "LS",
          enumid: "ProcessRouteType",
        },
      }).then((data) => {
        this.gridDropDownList[0].dataItem = data;
        this.getGridData();
      });
    },
    //그리드 데이터 가져오기
    getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReworkRouteListPop ",
        sendParam: {
          plantid: "LS",
          PROCESSROUTEID: this.processrouteid,
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

        // grid Header Customations
        this.gridHeader[1].editable = false;
        this.gridHeader[5].editable = false;
        this.gridHeader[2].width = 120;

        this.gridData = data;
      });
    },
    toggleDialog() {
      this.$emit("visibleDialog", !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.selectedID = event.dataItem.PROCESSROUTEID;
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map((item) => {
        return { ...item, selected: checked };
      });
    },
    //그리드 더블 클릭
    rowdblclick(event) {
      this.$emit("popupRouteData", event.dataItem);
      this.$emit("visibleDialog", !this.visibleDialog);
    },
    //선택
    selectRow() {
      const returnData = this.items.filter((x) => x.selected);
      this.$emit("productCode", returnData[0]);
      this.$emit("popupRouteData", returnData[0]);
      this.$emit("visibleDialog", !this.visibleDialog);
    },
    searchInput(nm, val) {
      this[nm] = val;
    },
  },
};
</script>
