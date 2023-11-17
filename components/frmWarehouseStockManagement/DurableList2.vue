<template>
  <div :style="{ height: '100%' }">
    <div>
      <v-row ref="contents" >
        <v-col :cols="8">
          <Card ref="gridCard" :style="{width:'100%'}">
            <CardBody :style="{width:'100%'}">
              <v-row :style="{'margin-bottom': '10px'}">
                <v-col cols="8" align="left">
                  <CardTitle>Durable 목록</CardTitle>
                </v-col>
              </v-row>
              <div ref="divWrapper">
                <KendoGrid 
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :gridDropDownList="gridDropDownList"
                  :checkHeaderArr="checkHeaderArr"
                  @gridrowclick="onRowClick"
                  @gridddchang="rowDdChange"
                  @griditemchange="griditemchange"
                  @gridButtonClick="gridButtonClick"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
        <v-col :cols="4">
            <Card ref="gridCard2" :style="{width:'100%'}">
              <CardBody :style="{width:'100%'}">
                <v-row :style="{'margin-bottom': '10px'}">
                  <v-col cols="4" align="left">
                      <CardTitle>사유코드 목록</CardTitle>
                  </v-col>
                  <v-col cols="8" align="left">
                      <p>사유코드 : {{ reasoncodename }}</p>
                  </v-col>
                </v-row>
                <div ref="divWrapper2">
                  <KendoGrid 
                  ref="rowGrid2"
                  :gridHeight="gridHeight2"
                  :gridItems="gridData2"
                  :sortable="true"
                  :columns="headerParam2.gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :disabledCheckHeaderArr="disabledCheckHeaderArr"
                  @selectionchange="onSelectionchange"
                  @gridrowclick="onRowClick2"
                  @gridddchang="rowDdChange"
                  @cellClick="cellClick"
                  @griditemchange="griditemchange"
                  @headerselectionchange="onHeaderSelectionChange"
                  />
                </div>
              </CardBody>
            </Card>
        </v-col>
      </v-row>
    </div>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    <RoutingSetModal
      ref="RoutingSetModal"
      v-if="RoutingSetModalVisible"
      :visibleDialog="RoutingSetModalVisible"
      @routingSet="routingSet"
      @visibleDialog="(val) => RoutingSetModalVisible = val"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
// import { Input } from '@progress/kendo-vue-inputs';
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { mapState, mapMutations, mapActions } from "vuex";
import CurrentSearchModal from "@/components/frmProcessRouteComposition/CurrentSearchModal";
import TextAreaModal from "@/components/frmProcessRouteComposition/TextAreaModal";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";

export default {
  name: "DurableList",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Card,
    Button,
    CardBody, 
    CardTitle,
    KendoGrid,
    InputText,
    Checkbox,
    MesSelectBox,
    DropDownList,
    CurrentSearchModal,
    TextAreaModal,
    multiGridHeaderMinin,
  },
  props:{
    gridHeight: {
      type: String,
      defaultData: "500px"
    },
    gridOriData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      gridHeight : '1200px',
      gridHeader: [],
      selectedField: 'selected',
      checkHeaderArr: ["AUTOTRACKIN","AUTOTRACKOUT"],
      headerParam: {
        gridid: "dgvDurableDefinition", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      headerParam2: {
        gridid: "dgvReasonCode", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noFirstCheck: true
      },
      noFirstCheck: true,
      currentSearchModalVisible: false,
      currentGridData: [],
      inputVal: "",
      btnClickRow: {},
      textAreaModalVisible: false,
      defaultDescription: "",
      RoutingSetModalVisible: false,
      confirmCheck: false
    };
  },
  created() {
  },
  async mounted() {
    await this.getGridComboList();
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    this.gridHeight = (this.$refs.contents.offsetHeight - 80) +'px';

  },
  computed: {
    ...mapState({
      gridData: state => state.modules.frmPRC.dgvOperation,
    }),
  },
  methods: {
    ...mapActions({
      setdgvOperationAction: "modules/frmPRC/setdgvOperationAction",
      setDgvRecipeAction: "modules/frmPRC/setDgvRecipeAction",
      setTreeDataAction: "modules/frmPRC/setTreeDataAction", 
      setRoutingSetSaveAction: "modules/frmPRC/setRoutingSetSaveAction", 
    }),
    test(){
    },
    //그리드 로우 클릭
    onRowClick (event) {
    },
  },
  watch: {
  },
};

const defaultData = {
};
</script>
<style lang="scss">

</style> 
