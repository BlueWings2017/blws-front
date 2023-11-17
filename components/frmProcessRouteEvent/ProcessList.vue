<template>
  <div :style="{ height: '100%' }">
    <v-row ref="contents" >
      <v-col :cols="12">
        <Card ref="gridCard" :style="{height:'100%'}">
          <CardBody :style="{height:'100%'}">
            <v-row no-gutters>
              <v-col cols="8" align="left">
                <CardTitle>공정목록</CardTitle>
              </v-col>
            </v-row>
            <div style="height: calc(100% - 33px)">
              <div id="dgvProcessList" ref="divWrapper" :style="{ height: '100%' }">
                <KendoGrid 
                  ref="rowGrid"
                  v-if="gridShow"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="processHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :gridDropDownList="gridDropDownList"
                  @gridrowclick="onRowClick"
                  @gridddchang="rowDdChange"
                  @griditemchange="griditemchange"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "ProcessList",
  mixins: [mixinGlobal],
  components: {
    Card,
    Button,
    CardBody, 
    CardTitle,
    KendoGrid,
  },
  props:{
    gridHeight: {
      type: String,
      default: "600px"
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
      gridHeader: [],
      gridDropDownList:[{
        dataVal : 'PROCESSMODE',
        dataItem: []
      }],
      selectedField: 'selected',
      noFirstCheck: true,
      noRowstat: true,
      gridShow: true,
    };
  },
  created() {
    // this.$nuxt.$on('changTab', () => {
    //   this.gridShow = false;
    //   this.$nextTick(() => {
    //     this.gridShow = true;
    //   })
    // });
  },
  async mounted() {
    
  },
  computed: {
    ...mapState({
      process: state => state.modules.frmRouteEvent.process,
      nowTab: state => state.modules.frmRouteEvent.nowTab,
      processHeader: state => state.modules.frmRouteEvent.processHeader,
    }),
    gridData(){
      return this.process[this.nowTab];
    }
  },
  methods: {
    ...mapActions({
      processAction: "modules/frmRouteEvent/processAction",
      eventRowIdAction: "modules/frmRouteEvent/eventRowIdAction",
    }),
    onRowClick (event) {
      const data = this.process[this.nowTab].map(x => {
        if(x.PROCESSSEQUENCE !== event.dataItem.PROCESSSEQUENCE){
          return {...x, selected: false}
        }
        return x
      })
      const stateChg = this.process;
      stateChg[this.nowTab] = data;
      this.processAction(stateChg);
      const row = event.dataItem;
      const key = `${row.PROCESSID}_${row.ROUTERELATIONSEQUENCE}`
      this.eventRowIdAction(key);
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    rowDdChange(e, name, dataItem){
    },
    griditemchange(e) {
    },
    chkOriginalData(gridData, idx){
    },
    //그리드 버튼 클릭
    selectedRow(row){
    },
    //동시진행공정 취소
    cancelRow(){
    },
  },
  updated() {

  },
  watch: {
  },
};

</script>
<style lang="scss">

</style> 
