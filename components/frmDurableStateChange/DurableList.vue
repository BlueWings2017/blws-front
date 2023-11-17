<template>
  <div :style="{ height: '100%' }">
    <div>
      <v-row ref="contents" >
        <v-col :cols="12">
          <Card ref="gridCard" :style="{width:'100%'}">
            <CardBody :style="{width:'100%'}">
              <v-row :style="{'margin-bottom': '10px'}">
                <v-col cols="12" align="left">
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
                  @gridrowclick="onRowClick"
                  @sortChangeHandler="sortChangeHandler"
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
      // gridHeight : '1200px',
      gridHeader: [],
      gridData: [],
      selectedField: 'selected',
      checkHeaderArr: ["AUTOTRACKIN","AUTOTRACKOUT"],
      headerParam: {
        gridid: "dgvDurableInfo", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      noFirstCheck: true,
      noRowstat: true,
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
    // await this.getGridComboList();
    // await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    // await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    // this.gridHeight = (this.$refs.contents.offsetHeight - 80) +'px';

  },
  computed: {
    // ...mapState({
    //   gridData: state => state.modules.frmPRC.dgvOperation,
    // }),
  },
  methods: {

    async getGridData(data){
      console.log("qweqwe")
      console.log(data)
    await this.mesGet({
      apiKey: "mes/common/getqueryresult",
      queryId: "GetOMDurableInfoList",
      sendParam: {
        plantid: "LS",
        standarddurableid: data.STANDARDDURABLEID
      }
      }).then((res) => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
          }
        });
        this.$nuxt.$emit('iccReset')
        this.gridData = data;
        this.isLoading = false;
      });
    },

    // ...mapActions({
    //   setdgvOperationAction: "modules/frmPRC/setdgvOperationAction",
    //   setDgvRecipeAction: "modules/frmPRC/setDgvRecipeAction",
    //   setTreeDataAction: "modules/frmPRC/setTreeDataAction", 
    //   setRoutingSetSaveAction: "modules/frmPRC/setRoutingSetSaveAction", 
    // }),
    test(){
    },
    //그리드 로우 클릭
    onRowClick (event) {
    },
    initGrid(){
      this.$nuxt.$emit('iccReset');
    },
    sortChangeHandler(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    }  
  },
  watch: {
  },
};

const defaultData = {
};
</script>
<style lang="scss">

</style> 
