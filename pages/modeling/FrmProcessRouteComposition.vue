<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>라우팅구성</li>
    </ol>
    <v-row ref="searchFilter" no-gutters>
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row class="search-box" align="center" no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>라우팅ID</label>
                    <InputText
                      ref="processrouteid"
                      :dataNm="'processrouteid'"
                      :readonly="true"
                      :defaultValue="processrouteid"
                    />
                    <Button
                      :theme-color="'primary'"
                      :class="'btn-form'"
                      @click="routingSearchModalVisible = true"
                      >선택</Button
                    >
                  </div>
                  <div class="form-group" style="margin-left: 48px">
                    <InputText
                      ref="processroutetype"
                      :boxWidth="'90%'"
                      :dataNm="'processroutetype'"
                      :readonly="true"
                      :defaultValue="processroutetype"
                    />
                  </div>
                  <div class="form-group" v-if="confirm">
                    <div class="i-msg">
                      * 확정된 데이터이므로 수정할 수 없습니다.
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <!-- <Button
                  :theme-color="'secondary'"
                  :size="'medium'"
                  :class="'btn-modal'"
                  @click="$refs.detailView.show('라우팅 상세보기')"
                ></Button> -->
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  icon="search"
                  @click="routingInfo(initData)"
                  >조회</Button
                >
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :sm="4" :lg="3" :style="{ height: '100%' }">
        <RouterTree></RouterTree>
      </v-col>
      <v-col :sm="8" :lg="9" :style="{ height: '100%' }">
        <v-row :style="{ height: 'calc(50% - 5px)' }" no-gutters>
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <Process
                  ref="Process"
                  :gridHeight="gridHeight"
                  :gridOriData="processData"
                  :confirm="confirm"
                  @saveBtnBefore="saveBtnBefore"
                />
              </CardBody>
            </Card>
          </v-col>
        </v-row>
        <v-row
          :style="{ margin: '10px 0 0 0', height: 'calc(50% - 5px)' }"
          no-gutters
        >
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <Step
                  ref="Step"
                  :gridHeight="gridHeight"
                  :gridOriData="stepData"
                />
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop
      ref="alertPop"
      :is="'alertPop'"
    />
    <ConfirmPop ref="ConfirmPop" :callBack="saveBtn" />
    <RoutingSearchModal
      ref="RoutingSearchModal"
      v-if="routingSearchModalVisible"
      :visibleDialog="routingSearchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="(val) => (routingSearchModalVisible = val)"
      @routingInfo="routingInfo"
    />
    <!-- <AlertPop ref="alertPop" :is="'alertPop'" /> -->
    <DetailView ref="detailView" :is="'detailView'" 
      :header="gridHeader"
      :item="gridData[0]"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import KendoGrid from "@/components/common/KendoGrid";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import InputText from "@/components/common/input/InputText";
import RoutingSearchModal from "@/components/frmProcessRouteComposition/RoutingSearchModal";
import Process from "@/components/frmProcessRouteComposition/Process.vue";
import Step from "@/components/frmProcessRouteComposition/Step.vue";
import RouterTree from "@/components/frmProcessRouteComposition/RouterTree.vue";
import { mapState, mapMutations, mapActions } from "vuex";
import moment from "moment";
import DetailView from "@/components/common/DetailView";
import { arrayToTree } from "performant-array-to-tree";

let myTitle;
let myMenuId;

export default {
  name: "Routing",
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
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    RoutingSearchModal,
    Process,
    Step,
    RouterTree,
    DetailView
  },
  props: {},
  data() {
    return {
      gridHeader: [
        {field: "CONFIRMFLAG", editable: false, title: "확정여부", minWidth: 50, cell: "CONFIRMFLAG", className: "gridTextCenter", VISIBLEFLAG: "Yes",},
        {field: "PROCESSROUTEID", editable: false, title: "라우팅ID", minWidth: 50, cell: "PRIMARYKEYFLAG", className: "gridTextCenter", VISIBLEFLAG: "Yes",},
        {field: "PROCESSROUTENAME", editable: false, title: "라우팅명", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes",},
        {field: "PROCESSROUTETYPE", editable: false, title: "구분", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes",},
        {field: "COMMONFLAG", editable: false, title: "공통라우팅", minWidth: 50, cell: "COMMONFLAG", className: "gridTextCenter", VISIBLEFLAG: "Yes",},
        {field: "DESCRIPTION", editable: false, title: "비고", minWidth: 50, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes",},
      ],
      disabledCheckHeaderArr: ["CONFIRMFLAG", "COMMONFLAG"],
      gridData: [],
      gridOriData: [],
      routingSearchModalVisible: false,
      processrouteid: "",
      processroutetype: "",
      gridHeight: (window.innerHeight || document.body.clientHeight) / 4 + "px",
      processData: [],
      stepData: [],
      plantid: "",
      initData: {},
      confirm: false,
      processSeqArr: []
    };
  },
  created() {},
  async mounted() {
  },
  computed: {
    ...mapState({
      frmData: (state) => state.modules.frmPRC,
      dgvOperation: (state) => state.modules.frmPRC.dgvOperation,
      dgvRecipe: (state) => state.modules.frmPRC.dgvRecipe,
      isRoutingSetSave: (state) => state.modules.frmPRC.isRoutingSetSave,
      treeData: state => state.modules.frmPRC.treeData
    }),
  },
  watch: {},
  methods: {
    ...mapActions({
      setDataAction: "modules/frmPRC/setDataAction",
      setdgvOperationAction: "modules/frmPRC/setdgvOperationAction", // 공정
      setDgvRecipeAction: "modules/frmPRC/setDgvRecipeAction", // 스텝
      setTreeDataAction: "modules/frmPRC/setTreeDataAction",
      setRoutingSetSaveAction: "modules/frmPRC/setRoutingSetSaveAction",
      setSeqsAction: "modules/frmPRC/setSeqsAction",
      setIsTreeChange: "modules/frmPRC/setIsTreeChange",
      setIsTreeClicked: "modules/frmPRC/setIsTreeClicked"
    }),
    showModal(){
      this.routingSearchModalVisible = true
    },
    showModal2(){
      this.routingSearchModalVisible = false
    },
    async routingInfo(data) {
      this.setIsTreeClicked(false)
      this.setIsTreeChange(false);
      if (Object.keys(data).length === 0) {
        this.$refs.alertPop.title = "조회";
        this.$refs.alertPop.message = "라우팅코드를 선택 후 조회 하세요";
        this.$refs.alertPop.modalWidth = "330px";
        this.$refs.alertPop.visibleDialog = true;
        this.$refs.alertPop.callBack2 = this.showModal;
        return;
      }
      this.confirm = data.CONFIRMFLAG === "Yes" ? true : false;
      this.$refs.Process.processrouteid = data.PROCESSROUTEID;
      this.$refs.Process.confirmCheck = this.confirm;
      this.$nuxt.$emit("iccReset");
      this.initData = data;
      this.processrouteid = data.PROCESSROUTEID;
      this.processroutetype = data.PROCESSROUTETYPE;
      this.plantid = data.PLANTID;
      this.gridData = [data];
      this.setDataAction([data]);
      this.setRoutingSetSaveAction(false);
      await this.processGrid();
      await this.stepGrid();
    },
    async processGrid() {
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetROComposition",
        sendParam: {
          processrouteid: this.processrouteid,
          plantid: this.plantid,
        },
      }).then((res) => {
        this.processData = res.map((x, idx) => {
          this.processSeqArr.push(x.PROCESSSEQUENCE)
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            parentSeq: `0_${idx}`,
            inEdit: true,
            newRow: false,
            DESCRIPTIONSET: "지시사항등록",
          };
        });
        this.setdgvOperationAction(this.processData);
        this.$refs.Process.initGrid();
      });
    },
    async stepGrid() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetROCComposition",
        sendParam: {
          processrouteid: this.processrouteid,
          plantid: this.plantid,
        },
      }).then((res) => {
        this.stepData = res.map((x, idx) => {
          const processIndx = this.processSeqArr.indexOf(x.PROCESSSEQUENCE)
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            parentSeq: `0_${processIndx}_${idx}`,
            CONCURRENCYPROCESSBUTTON: "검색",
            DESCRIPTIONSET: "지시사항등록",
          };
        });
        this.setDgvRecipeAction(this.stepData);
        this.$refs.Step.initGrid();
        const gd = this.gridData.map((x) => ({
          ...x,
          id: "routeGrid",
          label: x.PROCESSROUTEID,
          icon: "PROCESSROUTE"
        }));
        const pd = this.processData.map((x) => ({
          ...x,
          id: x.UIKEY,
          parentId: "routeGrid",
          label: x.PROCESSNAME,
          icon: "PROCESS"
        }));
        
        for(let i =0; i<pd.length;i++){
          for(let j =0; j<this.stepData.length; j++) {
            if(pd[i].PROCESSID == this.stepData[j].PROCESSID && pd[i].PROCESSSEQUENCE == this.stepData[j].PROCESSSEQUENCE) {
              this.stepData[j].PROCESSROUTEID = pd[i].UIKEY;
            }
          }
        }
        const sd = this.stepData.map((x) => ({
          ...x,
          parentId: x.PROCESSROUTEID,
          label: `[${x.RECIPERELATIONCODE}] - ${x.RECIPENAME}[${x.RECIPETYPE || ''}]`,
          icon: "RECIPE"
        }));
        this.setTreeDataAction([...gd, ...pd, ...sd]);
      });
    },
    saveBtnBefore() {
      this.$refs.ConfirmPop.title = "저장";
      this.$refs.ConfirmPop.message = "저장하시겠습니까?";
      this.$refs.ConfirmPop.modalWidth = "330px";
      this.$refs.ConfirmPop.visibleDialog = true;
      this.$refs.ConfirmPop.callBack = this.saveBtn;
    },
    async saveBtn() {
      const treeData = this.mkTreeData(this.frmData, this.dgvOperation, this.dgvRecipe)
      let dgvOperationData;
      let recipParam;
      const arrProcess = [];
      let arrStep = [];
      // 트리 데이터 있을 경우 저장
      if(treeData[0].items.length > 0) {
        treeData[0].items.forEach((x,idx) => {
          const PROCESSSEQUENCE = ((idx + 1) * 100) + 100000;
          arrProcess.push({...x, PROCESSSEQUENCE: PROCESSSEQUENCE});
          arrStep = arrStep.concat(x.items.map(y => ({...y, PROCESSSEQUENCE: PROCESSSEQUENCE})));
        });
          dgvOperationData = arrProcess.map((x, idx) => {
          let ENDOFROUTE = this.dgvOperation.length -1 === idx ? 'Yes' : 'No';
          return {
            ...x,
            PROCESSROUTEID: this.processrouteid,
            ROCOMPOSITIONID: this.isRoutingSetSave ? "" : x.ROCOMPOSITIONID,
            UIKEY: this.isRoutingSetSave ? x.PROCESSID + moment().format("YYYYmmDDhhmmss") : x.UIKEY,
            ENDOFROUTE: ENDOFROUTE,
            // PROCESSSEQUENCE: ((idx + 1) * 100) + 100000
          };
        });
          recipParam = arrStep.map((x, idx) => {
          let sRecipeTypeCode = "0000";
          if(x.RECIPETYPE == "Start"){
            sRecipeTypeCode = "0000";
          }else if(x.RECIPETYPE == "End"){
            sRecipeTypeCode = "9999";
          }else if(x.RECIPETYPE == "Change"){
            sRecipeTypeCode = "0001";
          }
          return {
            ...x,
            PROCESSROUTEID: this.processrouteid,
            RECIPETYPECODE: sRecipeTypeCode,
            RECIPESEQUENCE: ((idx + 1) * 100) + 100000
          }
        });
          await this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnROComposition",
          sendParam: dgvOperationData,
          params2: { plantid: "LS", eventuser: "manager" },
        });

        await this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnROCComposition",
          sendParam: recipParam,
          params2: { plantid: "LS", eventuser: "manager", processrouteid: this.processrouteid },
        }).then(() => {
          this.openAlert("저장", "저장되었습니다.");
          this.routingInfo(this.initData);
        });
      // 트리 데이터 없을때 (공정 1개도 없을경우)
      }else{
        dgvOperationData = {PLANTID: "LS", EVNETUSER: "manager", PROCESSROUTEID: this.processrouteid };
        recipParam = {PLANTID: "LS", EVNETUSER: "manager", PROCESSROUTEID: this.processrouteid };
        await this.$axios.post(
          '/api/mes/common/manage',
            {
              messagename: "TxnROComposition",
              PLANTID: "LS",
              EVENTUSER: "manager",  
              PROCESSROUTEID: this.processrouteid
            }).then(res => {
        });
       await this.$axios.post('/api/mes/common/manage',{
          messagename: "TxnROComposition",
          PLANTID: "LS",
          EVENTUSER: "manager",  
          PROCESSROUTEID: this.processrouteid
        }).then(res => {
          this.openAlert("저장", "저장되었습니다.");
          this.routingInfo(this.initData);
          });
      }

    },
    openAlert(title, message, visiable = true, width = "350px") {
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
      this.$refs.alertPop.callBack2 = this.showModal2;
    },
    mkTreeData(route, process, step){
      const gd = [route].map((x) => ({
        ...x,
        id: "routeGrid",
        label: x.PROCESSROUTEID,
        icon: "PROCESSROUTE",
      }));
      const pd = process.map((x) => ({
        ...x,
        id: x.PROCESSSEQUENCE,
        parentId: "routeGrid",
        label: x.PROCESSNAME,
        icon: "PROCESS",
      }));
      const sd = step.map((x) => ({
        ...x,
        parentId: x.PROCESSSEQUENCE,
        label: x.ALIASRECIPENAME,
        icon: "RECIPE",
      }));
      return arrayToTree([...gd, ...pd, ...sd], { dataField: null, childrenField: "items"});

    },
  },
  beforeDestroy() {
    console.log("destroyStore");
    this.$nuxt.$emit("destroyStoreFPRC");
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
