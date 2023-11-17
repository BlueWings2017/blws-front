<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>공정진행</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row class="search-box" align="center" no-gutters>
              <v-col :cols="10">
                <!-- <v-row>
                  <v-col :cols="1">
                    <Label>
                      LotID
                    </Label>
                  </v-col>
                  <v-col :cols="3">
                    <InputText
                      ref="LotID"
                      :boxWidth="'90%'"
                      :dataNm="'LotID'"
                      :disabled="false"
                      @input-text-set="searchInput"
                    />
                    <Button
                      :theme-color="'secondary'"
                      :class="'btn-form'"
                      @click="lotSearchModalVisible = true"
                      >...</Button
                    >
                  </v-col>
                </v-row> -->
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>Lot ID</label>
                    <InputText
                      ref="LotID"
                      :dataNm="'LotID'"
                      :disabled="true"
                      @input-text-set="searchInput"
                    />
                    <Button :theme-color="'primary'" :size="'medium'" @click="lotSearchModalVisible = true">선택</Button>
                  </div>
                </div>
              </v-col>
              <v-col :cols="2" align="right">
                <!-- <Button
                  :theme-color="'secondary'"
                  :size="'medium'"
                  :class="'btn-modal'"
                  @click="$refs.detailView.show('Lot 상세보기');"
                ></Button> -->
                <Button 
                  :theme-color="'primary'" 
                  icon="search" 
                  @click="lotInfoClick"
                >조회</Button>
              </v-col>
            </v-row>
            <!-- <div ref="divWrapper" :style="{'margin-top': '10px'}">
              <KendoGrid 
                ref="rowGrid"
                gridHeight="100px"
                :gridItems="gridData"
                :sortable="true"
                :columns="gridHeader"
                :resizable="false"
                :edit-field="'inEdit'"
                :selected-field="'selected'"
                :disabledCheckHeaderArr="disabledCheckHeaderArr"
              />
            </div>  -->
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <!-- <CardBody :style="{ width: '100%' }"> -->
    <TabStrip
      :selected="selected"
      :tabs="tabs"
      :style="{ width:'100%', 'margin-top':'10px', height:'calc(100% - 60px)' }"
      @select="onTabSelect"
    >
      <template v-slot:[item.content]="{ props }" v-for="(item,idx) in tabs">
        <ProcessTab
          :propData="props"
          :key="idx"
        />
      </template>
    </TabStrip>
    <!-- </CardBody> -->

    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
      :callBack="() => lotSearchModalVisible = true"
    />
    <ConfirmPop
      ref="ConfirmPop"
    />

    <LotSearchModal
      ref="LotSearchModalVisible"
      v-if="lotSearchModalVisible"
      :visibleDialog="lotSearchModalVisible"
      @visibleDialog="(val) => lotSearchModalVisible = val"
      @searchBtn="searchBtn"
    />
    <DetailView ref="detailView" :is="'detailView'" 
      :header="gridHeader"
      :item="gridData[0]"
    />
  </div>
</template>
<script>

import mixinGlobal from "@/mixin/global.js";
import customGridHeaderMixin from "@/mixin/customGridHeaderMixin";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import InputText from "@/components/common/input/InputText";
import { mapState, mapMutations, mapActions } from "vuex";
import utils from "@/plugins/utils";
import moment from "moment";
import { TabStrip } from "@progress/kendo-vue-layout"

import ProcessTab from "@/components/frmProcessRouteEvent/ProcessTab.vue";
import LotSearchModal from '../../components/popup/SelectLotID.vue';
import DetailView from "@/components/common/DetailView";
let myTitle;
let myMenuId;

export default {
  name: "Routing",
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
    Card,
    Button,
    CardBody, 
    CardTitle,
    KendoGrid,
    InputText,
    TabStrip,
    ProcessTab,
    LotSearchModal,
    DetailView
  },
  props:{

  },
  data() {
    return {
      gridHeader: [],
      disabledCheckHeaderArr: ["GOINORDERREQUIRED"],
      gridData : [],
      gridOriData : [],
      gridHeight: (window.innerHeight || document.body.clientHeight)/4 + "px",
      LotID: "",
      selected: 0,
      tabs: [
        {title: "Main",content: "Main"},
      ],
      lotSearchModalVisible: false,
      headerParam: {
        gridid: "dgvLotInfo", // 그리드 ID
        rowStat: "" 
      },
      noFirstCheck: true,
      noRowstat: true,
    };
  },
  async created() {
    this.gridHeader = await this.getCustomHeader("dgvLotInfo",true,true)
    this.getCustomHeader("dgvProcessList",true,true).then((res) => {
      this.processHeaderAction(res)
    });
    this.getCustomHeader("dgvEventList",true,true).then((res) => {
      //2023-04-13 그리드 컬럼 너비 조정: ACTIONBUTTON GRIDDETAIL CELLTYPE > CUSTOM
      // const header = res.map(x => {
      //   if(x.field === "ACTIONBUTTON")  {
      //     return {...x, width: "140", cell: "ACTIONBUTTON"}
      //   }
      //   return x
      // })
      this.eventHeaderAction(res)
    });

    this.$nuxt.$on('reSearch', () => {
      this.lotInfoClick();
    });
  },
  async mounted() {
  },
  computed: {
    ...mapState({
      stateRotId: state => state.modules.frmRouteEvent.rotId,
      nowTab: state => state.modules.frmRouteEvent.nowTab,
      process: state => state.modules.frmRouteEvent.process,
    }),
  },
  watch: {
  },
  methods: {
    ...mapActions({
      rotIdAction: "modules/frmRouteEvent/rotIdAction",
      nowTabAction: "modules/frmRouteEvent/nowTabAction",
      processAction: "modules/frmRouteEvent/processAction",
      tabTypeAction: "modules/frmRouteEvent/tabTypeAction",
      eventRowIdAction: "modules/frmRouteEvent/eventRowIdAction",
      eventHeaderAction: "modules/frmRouteEvent/eventHeaderAction",
      processHeaderAction: "modules/frmRouteEvent/processHeaderAction",
      curProcessAction: "modules/frmRouteEvent/curProcessAction",
      lotInfoAction: "modules/frmRouteEvent/lotInfoAction",
      resetAction: "modules/frmRouteEvent/resetAction",
    }),
    onTabSelect(e) {
      this.selected = e.selected;
      this.tabs.forEach(x => {
        if(x.idx == e.selected){
          this.tabTypeAction(x.tabType)
        }
      });
      this.nowTabAction(e.selected);
      this.defaultEventSelect();
      this.$nuxt.$emit('changTab')
    },
    defaultEventSelect(){
      // this.process[this.nowTab]
      if(this.process[this.nowTab]){
        const defSel = this.process[this.nowTab].filter(x => !!x.PROCESSSTATUS)
        const row = defSel.length === 0 ? this.process[this.nowTab][0] : defSel[0]
        const key = `${row.PROCESSID}_${row.ROUTERELATIONSEQUENCE}`
        this.eventRowIdAction(key);
      }
    },
    searchInput(nm, val){
      this[nm] = val;
    },
    //버튼클릭
    lotInfoClick(){
      this.searchBtn({LOTID: this.LotID});
      // this.selectLotId({LOTID: "TDEPT23030023"}); // 시작종료 4번탭
      // this.selectLotId({LOTID: "SDEPT22010004"}); // 시작종료 main 번탭 설비o
      // this.selectLotId({LOTID: "SDEPT22010001"}); // 시ㅊ작종료 main 번탭 설비x
      // this.selectLotId({LOTID: "PDEPT23020003"}); //hold
      // this.selectLotId({LOTID: "PDEPT21120004"}); // 취소 
      // this.selectLotId({LOTID: "PDEPT23020002_01"}); // 많음

      // 공정조건, 원료투입 ==> PDEPT23030009
      // 스텝 => PDEPT23020002_01
      // this.selectLotId({LOTID: "PDEPT23020002_01"}); // 스텝
      // this.selectLotId({LOTID: "PDEPT23030009"}); // 공정조건, 원료투입
    },
    //조회
    async searchBtn(row){
      // this.gridData = [row]
      if(this.$refs?.LotID){
        this.$refs.LotID.textVal = row.LOTID;
      }
      this.LotID = row.LOTID;
      if(!row.LOTID){
        this.$refs.alertPop.title = '조회';
        this.$refs.alertPop.message = 'Lot ID를 검색하여 조회하세요';
        this.$refs.alertPop.visibleDialog = true;
        this.$refs.alertPop.modalWidth = "350px";
        return
      }
      this.selected = 0;
      await this.rotIdAction(row.LOTID)
      await this.tabSetting();
      this.getLotRow();
      this.$nuxt.$emit('changTab')
    },
    async getLotRow(){
      this.gridData = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProcessRouteEventLotPSearch",
        sendParam: {
          plantid: "Ls",
          lotid: this.stateRotId,
        }
      });
      this.lotInfoAction(this.gridData[0])
    },
    async tabSetting(){
      const tabInit = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetTabCountSelection",
        sendParam: {
          plantid: "Ls",
          lotid: this.stateRotId,
        }
      });
      this.tabs = tabInit.map(x => {
        const obj = {content: `${x.TABSEQ}_tab`, idx: x.TABSEQ, tabType: x.PROCESSROUTETYPE}
        if(x.PROCESSROUTETYPE === "Main"){
          return { title: x.PROCESSROUTETYPE, ...obj}
        }else{
          return { title: `${x.TABSEQ}번 ${x.PROCESSROUTETYPE}`, ...obj}
        }
      });
      this.curProcessAction(tabInit[0].CURRENTPROCESSING)
      this.onTabSelect({selected: Number(tabInit[0].CURRENTPROCESSING)})
    },
    async stepRouteProgressList(){
      const tabInit = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetStepRouteProgressList",
        sendParam: {
          plantid: "Ls",
          lotid: this.stateRotId,
        }
      });
    },
  },
  beforeDestroy() {
    this.$nuxt.$emit('destroyStore');
  }
};

</script>
<style lang="scss">

</style>