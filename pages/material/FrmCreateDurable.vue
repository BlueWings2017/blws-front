<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>자재관리</li>
      <li>Durable생성</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row>
              <v-col cols="3" align="left">
                <v-row class="search-box" align="center" no-gutters>
                  <v-col :cols="4">
                    <Label>
                      기준 Durable ID
                    </Label>
                  </v-col>
                  <v-col :cols="6">
                    <InputText
                      ref="standarddurableid"
                      :boxWidth="'90%'"
                      :dataNm="'standarddurableid'"
                      :readonly="true"
                      :defaultValue="standarddurableid"
                      @input-text-set="searchInput"
                    />
                  </v-col>
                  <v-col :cols="2">
                    <Button :theme-color="'primary'" :size="'medium'" @click="durableSearchModalVisible = true">선택</Button>
                  </v-col>
                </v-row>
                </v-col>
                <v-col cols="9" align="right">
                  <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="durableInfo(initData)">조회</Button>
                </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <v-row ref="contents">
      <v-col :cols="12" :style="{height : '100%'}">
        <v-row :style="{ height: '100%' }">
          <v-col :cols="12" :class="'divList1'" :style="{ height: '40%' }">
            <Card ref="gridCard" :style="{height : '100%'}">
              <CardBody :style="{width:'100%', height : '100%'}">
                <v-row>
                  <v-col cols="6" align="left">
                    <CardTitle>기준Durable</CardTitle>
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button :theme-color="'primary'" :size="'small'" icon="undo"  @click="createBtn">생성</Button>
                  </v-col>
                </v-row>
                <div ref="divWrapper1" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid 
                    ref="rowGrid"
                    :gridItems="gridData"
                    :sortable="true"
                    :columns="headerParam.gridHeader"
                    :disabledCheckHeaderArr="headerParam.disabledCheckHeaderArr"
                    :isPaging="true"
                    :resizable="false"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :gridDropDownList="gridDropDownList"
                    :checkHeaderArr="checkHeaderArr"
                    @sortChangeHandler="sortChangeHandler"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
          <v-col :cols="12" :class="'divList2'" :style="{ height: '60%' }">
            <Card ref="gridCard2" :style="{height : '100%'}">
              <CardBody :style="{width:'100%', height : '100%'}">
                <v-row>
                  <v-col cols="12" align="left">
                    <CardTitle>Durable 목록</CardTitle>
                  </v-col>
                </v-row>
                <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid 
                    ref="rowGrid2"
                    :gridItems="gridData2"
                    :sortable="true"
                    :columns="headerParam2.gridHeader"
                    :resizable="false"
                    :isPaging="true"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :gridDropDownList="gridDropDownList"
                    :checkHeaderArr="checkHeaderArr"
                    @sortChangeHandler="sortChangeHandler2"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
      :callBack="() => durableSearchModalVisible = true"
    />
    <DurableSearchModal
      ref="DurableSearchModal"
      v-if="durableSearchModalVisible"
      :visibleDialog="durableSearchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="(val) => (durableSearchModalVisible = val)"
      @durableInfo="durableInfo"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
import utils from "~/plugins/utils";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import DurableSearchModal from "@/components/frmWarehouseStockManagement/DurableSearchModal";
import { mapState, mapMutations, mapActions } from "vuex";
import RoutingSearchModal from "@/components/frmProcessRouteComposition/RoutingSearchModal";
import InputText from "@/components/common/input/InputText";

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
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
    Utility,
    Card,
    Button,
    CardBody, 
    CardTitle,
    TreeView,
    KendoGrid,
    DurableSearchModal,
    RoutingSearchModal,
    InputText
  },
  data() {
    return {
      treeData: [],
      columns: [],
      gridHeight : '400px',
      gridHeight2 : '100px',
      gridData : [],
      gridData2 : [],
      gridOriData : [],
      initData: {},
      standardDurableData:[],
      duralbeListData: [],
      standarddurableid: "",
      durableSearchModalVisible: false,
      searchModalVisible: false,
      gridLastModIdx: null,
      gridDropDownList:[{
        dataVal : 'AREATYPE',
        dataItem: []
      }],
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'AREANAME',
      },
      checkHeaderArr: ["ACTIVESTATE"],
      parentAreaId: "",
      gridHeader: [],
      headerParam: {
      gridid: "dgvDurableDefinition_View", // 그리드 ID
      gridHeader: [],
      noFirstCheck: true,
      noRowstat: true,
      disabledCheckHeaderArr: ['ACTIVESTATE'],
      },
      headerParam2: {
      gridid: "dgvDurableInfo", // 그리드 ID
      gridHeader: [],
      noFirstCheck: true,
      noRowstat: true,
      searchBtn: false,
      disabledCheckHeaderArr: [ "ACTIVESTATE", "CONFIRMFLAG", "COMMONFLAG" ],
      visibleDialog: false,

      },
    };
  },
  created() {
  },
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper1);
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
  },
  computed: {
  },
  watch: {
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData(data) {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetOMDurableDefinitionList",
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
            newRow: false
          }
        });
        this.$nuxt.$emit('iccReset')
        this.gridData = data;
        this.isLoading = false
        this.$refs.rowGrid.skip = 0;

        // console.log(this.gridData[0])
        // if (this.gridData[0].ACTIVESTATE === "Inactive") {
        //   this.$refs.alertPop.title = "";
        //   this.$refs.alertPop.message = "사용가능한 상태가아닙니다. 확인해주시기 바랍니다.";
        //   this.$refs.alertPop.modalWidth = "330px";
        //   this.$refs.alertPop.visibleDialog = true;
        //   return;
        // }
      })
    },

    async getGridData2(){
    await this.mesGet({
      apiKey: "mes/common/getqueryresult",
      queryId: "GetOMDurableInfoList",
      sendParam: {
        plantid: "LS",
        standarddurableid: this.standarddurableid
      }
      }).then((res) => {
        // res를 역순으로 뒤집기
        res = res.reverse();
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
        this.gridData2 = data;
        this.isLoading = false;
        this.$refs.rowGrid2.skip = 0;
      });
    },

    async durableInfo(data){
      if(Object.keys(data).length === 0){
        this.$refs.alertPop.title = ""
        this.$refs.alertPop.message = "기준 Durable을 먼저 선택하시기 바랍니다.";
        this.$refs.alertPop.modalWidth = "330px";
        this.$refs.alertPop.visibleDialog = true;
        return;
      }
      // if(data.dataItem.ACTIVESTATE === "Inactive"){
      //   this.$refs['alertPop'].show("알림", "사용불가입니다. 확인해주시기 바랍니다.");
      //   return;
      // }
      this.standarddurableid = data.STANDARDDURABLEID;
      this.$nuxt.$emit('iccReset');
      this.initData = data;
      this.getGridData(data);
      this.getGridData2();
    },

    searchBtn(){
      this.getGridData();
    },

    searchInput(nm, val){
      this[nm] = val;
    },
    createBtn(data){
      const saveData = this.gridData
      .map(x => {
        return { 
       DESCRIPTION: x.DESCRIPTION,
       CREATEUSERID: x.CREATEUSERID,
       _ROWSTATUS: x._ROWSTATUS,
       EXPIRYTIME: x.EXPIRYTIME,
       USAGELIMIT: x.USAGELIMIT,
       PLANTID: x.PLANTID,
       ACTIVESTAT: x.ACTIVESTAT,
       STANDARDDURABLEID: x.STANDARDDURABLEID,
       CAPACITY: x.CAPACITY,
       STANDARDDURABLENAME: x.STANDARDDURABLENAME,
       DURABLETYPE: x.DURABLETYPE,
        }
      });
      if(saveData.length > 0){
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnCreateDurable",
          sendParam: saveData
        }).then(() => {
          this.$nextTick(() => {
            this.durableInfo(this.initData);
          })
        })
      }
    },

    // sortChangeHandler(e){
    //   const isAscending = e.sort[0]?.dir == "asc";
    //   if(isAscending){
    //     this.gridData2 = this.gridData2.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
    //   }else{
    //     this.gridData2 = this.gridData2.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
    //   }
    // }, 
    sortChangeHandler(e){
      this.gfn_sortChangeHandler(this.gridData, e);
    },
    sortChangeHandler2(e){
      this.gfn_sortChangeHandler(this.gridData2, e);
    }   

  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>