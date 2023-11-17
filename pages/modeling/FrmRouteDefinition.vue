<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>라우팅기준정보</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col cols="12" align="right">
                <Button :theme-color="'primary'" icon="search" @click="searchBtn">조회</Button>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <v-row ref="contents" style="height: 100%">
      <v-col :cols="12" style="height: 100%">
        <Card ref="" style="height: 100%">
          <CardBody :style="{ width: '100%',height: '100%' }">
            <TabStrip
              :selected="selected"
              @select="onSelect"
              :tabs="tabs"
              style="height: 100%"
            >
              <template v-slot:Routing>
                <Routing
                  ref="Routing"
                  :gridHeight="gridHeight"
                  :confirm="routingBtnDis"
                />
              </template>

              <template v-slot:Process>
                <Process
                  v-if="v1"
                  ref="Process"
                  :gridHeight="gridHeight"
                  :confirm="processBtnDis"
                />
              </template>

              <template v-slot:Step>
                <Step
                  v-if="v2"
                  ref="Step"
                  :gridHeight="gridHeight"
                  :confirm="stepBtnDis"
                />
              </template>

              <template v-slot:ProcessConditions>
                <ProcessConditions
                  v-if="v3"
                  ref="ProcessConditions"
                  :gridHeight="gridHeight"
                  :confirm="processConditionsBtnDis"
                />
              </template>

            </TabStrip>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import utils from "~/plugins/utils";
import { TabStrip } from "@progress/kendo-vue-layout";
import Routing from "@/components/frmRouteDefinitionTabs/Routing";
import Process from "@/components/frmRouteDefinitionTabs/Process";
import Step from "@/components/frmRouteDefinitionTabs/Step";
import ProcessConditions from "@/components/frmRouteDefinitionTabs/ProcessConditions";

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal],
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
    TabStrip,
    Routing,
    Process,
    Step,
    ProcessConditions
  },
  data() {
    return {
      selected: 0,
      // ## dgvProcessRoute - 라우팅
      // ## dgvRecipe_Set  -- 스텝
      // ## dgvProcessDefinition - 공정
      // ## dgvParameter -- 공정조건
      tabs: [
        {title: "라우팅",content: "Routing"},
        {title: "공정", content: "Process"},
        {title: "스텝",content: "Step",},
        {title: "공정조건",content: "ProcessConditions",},
      ],
      gridHeight: (window.innerHeight || document.body.clientHeight)/3*2 + "px",
      v1: false,
      v2: false,
      v3: false,
      routingBtnDis: true,
      processBtnDis: true,
      stepBtnDis: true,
      processConditionsBtnDis: true
    };
  },
  created() {
  },
  mounted() {
    this.$refs.Routing.getGridData();
  },
  updated(){
    if(this.selected === 1){
      this.$refs.Process.getGridData();
      this.processBtnDis = false;
    }else if(this.selected === 2){
      this.$refs.Step.getGridData();
      this.stepBtnDis = false;
    }else if(this.selected === 3){
      this.$refs.ProcessConditions.getGridData();
      this.processConditionsBtnDis = false;
    }
  },
  computed: {},
  methods: {
    onSelect(e) {
      this.selected = e.selected;
      if(this.selected === 1 && !this.v1){
        this.v1 = !this.v1
      }
      if(this.selected === 2 && !this.v2){
        this.v2 = !this.v2
      }
      if(this.selected === 3 && !this.v3){
        this.v3 = !this.v3
      }
    },
    searchBtn(){
      if(this.selected === 0){
        this.$refs.Routing.getGridData();
        this.$refs.Routing.$refs.rowGrid.skip = 0;
        this.routingBtnDis = false;
      }else if(this.selected === 1){
        this.$refs.Process.getGridData();
        this.$refs.Process.$refs.rowGrid.skip = 0;
        this.processBtnDis = false;
      }else if(this.selected === 2){
        this.$refs.Step.getGridData();
        this.$refs.Step.$refs.rowGrid.skip = 0;
        this.stepBtnDis = false;
      }else if(this.selected === 3){
        this.$refs.ProcessConditions.getGridData();
        this.$refs.ProcessConditions.$refs.rowGrid.skip = 0;
        this.processConditionsBtnDis = false;
      }
    },
  },
  // watch:{
  //   vmodelReset(newVal, oldVal){
  //   }
  // },
};

const defaultData = {};
</script>
<style lang="scss">
</style>