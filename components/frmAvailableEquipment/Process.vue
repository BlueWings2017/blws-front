<template>
  <v-col :cols="12" :class="'divList1'" :style="{ height: '50%' }">
    <Card ref="gridCard" :style="{ height: '100%' }">
      <CardBody :style="{ height: '100%' }">
        <CardTitle>공정목록</CardTitle>
        <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
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
            @sortChangeHandler="sortChangeHandler"
          />
        </div>
      </CardBody>
    </Card>
  </v-col>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
//import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "Process",
  mixins: [mixinGlobal, multiGridHeaderMinin],
  components: {
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    Checkbox,
    MesSelectBox,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: "250px",
    },
    gridOriData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      columns: [],
      gridHeader: [],
      selectedField: "selected",
      disabledCheckHeaderArr: ["ACTIVESTATE"],
      headerParam: {
        gridid: "dgvProcessList_Available", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        noFirstCheck: true,
        noRowstat: true,
      },
      noFirstCheck: true,
      inputVal: "",
      btnClickRow: {},
      defaultDescription: "",
      reSetPage: false,
    };
  },
  created() {},
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
  },
  computed: {
    ...mapState({
      gridData: (state) => state.modules.frmAE.dgvProcessList_Available,
      selectedProduct: (state) => state.modules.frmAE.selectedProduct,
      processData: (state) => state.modules.frmAE.selectedProcess,
      equipmentData: (state) => state.modules.frmAE.dgvEquipmentList_Available,
    }),
  },
  watch: {},
  methods: {
    ...mapActions({
      setDgvProcessListAction: "modules/frmAE/setDgvProcessListAction",
      setDgvEquipmentListAction: "modules/frmAE/setDgvEquipmentListAction",
      setModelingSetSaveAction: "modules/frmAE/setModelingSetSaveAction",
      setSelectedProcessAction: "modules/frmAE/setSelectedProcessAction",
    }),
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    //그리드 로우 클릭
    onRowClick(event) {
      const gridData = this.gridData.map((item) => {
        if (item === event.dataItem) {
          return { ...item, selected: true };
        } else {
          return { ...item, selected: false };
        }
      });

      this.setDgvProcessListAction(gridData);

      this.setSelectedProcessAction(event.dataItem);

      this.equipmentGrid();
      this.$nuxt.$emit("iccReset");
    },
    initGrid() {
      this.$nuxt.$emit("iccReset");
    },
    async equipmentGrid() {
      if (this.processData !== undefined && this.processData !== {}) {
        this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: "GetAvailableEquipment",
          sendParam: {
            plantid: "LS",
            productid: this.selectedProduct.PRODUCTID, // 제품코드
            processid: this.processData.PROCESSID,
          },
        }).then((res) => {
          const equipmentData = res.map((x, idx) => {
            return {
              ...x,
              rowStat: "N",
              selected: false,
              idx: idx,
              inEdit: true,
              newRow: false,
              resizable: true,
              EQUIPMENTBUTTON: "",
            };
          });
          this.setDgvEquipmentListAction(equipmentData);
        });
      }
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
  watch: {},
};

const defaultData = {};
</script>
<style lang="scss"></style> 
