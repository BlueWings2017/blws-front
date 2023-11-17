<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>자재관리</li>
      <li>Durable 조회</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody style="height:70px;">
            <v-row>
              <v-col :sm="9" :lg="10" align="left">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>Durable ID</label>
                    <InputText
                      ref="durableid"
                      :boxWidth="'90%'"
                      :dataNm="'durableid'"
                      :disabled="false"
                      :searchOption=searchOption
                      :searchFunc="searchBtn"
                      @input-text-set="searchInputValSet"
                      :defaultValue="durableid"
                    />
                  </div>
                  <div class="form-group">
                    <label>Durable 구분</label>
                    <MesSelectBox
                      :enumID="'durableType'"
                      :allYN="true"
                      :dataNm="'durableType'"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>Durable 상태</label>
                    <MesSelectBox
                      :enumID="'durableState'"
                      :allYN="true"
                      :dataNm="'durableState'"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn(durableid)"
                  >조회
                </Button>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <div ref="contents">
      <v-row :style="{height : '50%'}">
        <v-col :cols="12" :class="'divList1'" :style="{height : '100%'}">
          <Card :style="{height : '100%'}">
            <CardBody :style="{width:'100%', height : '100%'}">
              <v-row>
                <v-col :cols="12" align="left">
                  <CardTitle>Durable 목록</CardTitle>
                </v-col>
              </v-row>
              <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                  ref="durableGrid"
                  :gridHeight="gridHeight"
                  :gridItems="durableGridItems"
                  :sortable="true"
                  :columns="durableListHeaderParam.gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  @gridrowclick="durableRowClick"
                  :isPaging="true"
                  @pageChangeEvent=pageChangeEvent
                  @sortChangeHandler="sortChangeHandler"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
      <v-row :style="{height : '50%'}">
        <v-col :cols="12" :class="'divList2'" :style="{height : '100%'}">
          <Card :style="{height : '100%'}">
            <CardBody :style="{width:'100%', height : '100%'}">
              <v-row>
                <v-col :sm="2" :lg="1" align="left">
                  <CardTitle>Lot 목록</CardTitle>
                </v-col>
                 <v-col :sm="2" :lg="2" style="padding-top:0px;">
                <InputText
                  :dataNm="LotCarrierid"
                  :disabled="true"
                  :defaultValue="LotCarrierid"
                />
              </v-col>
                <v-col align="right" :sm="8" :lg="9">
                  <Button :theme-color="'secondary'" :size="'small'" @click="showRouting()">공정진행정보</Button>
                </v-col>
              </v-row>
              <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                <KendoGrid
                  ref="lotGrid"
                  :gridItems="durableLotListData"
                  :sortable="true"
                  :columns="lotListHeaderParam.gridHeader"
                  :disabledCheckHeaderArr="disabledCheckHeaderArr"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  @gridrowclick="lotRowClick"
                  @rowdblclick="lotRowDoubleClick"
                  @sortChangeHandler="sortChangeHandler2"
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
      :callBack="() => DurableListModal = true"
    />
  <SelectProcessRouteInfo
      ref="SelectProcessRouteInfo"
      v-if="processRouteInfoModalVisible"
      :visibleDialog="processRouteInfoModalVisible"
      :callBack="() => {}"
      @visibleDialog="(val) => (processRouteInfoModalVisible = val)"
      :gridHeader="routeInfoHeaderParam.gridHeader"
      :gridItems="routerData"
  
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import KendoGrid from "@/components/common/KendoGrid"
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import InputText from "@/components/common/input/InputText";
import SelectProcessRouteInfo from "@/pages/lotTracking/SelectProcessRouteInfo";
import { orderBy } from '@progress/kendo-data-query';

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
    Card,
    Button,
    CardBody, 
    CardTitle,
    KendoGrid,
    InputText,
    MesSelectBox,
    SelectProcessRouteInfo
  },
  data() {
    return {
      gridHeight : '400px',
      gridHeight2 : '550px',
      processRouteInfoModalVisible:false,
      durableListData: [], // Durable 목록
      durableLotListData: [], // Durable Lot 목록
      selectedField:"selected",
      gridHeader: [],
      durableid: '', // durable ID
      LotCarrierid: '' , // default durableListData[0] rowClick시 해당 row Durableid 값
      routerData: [], // 공정진행정보 List
      disabledCheckHeaderArr: ["GOINORDERREQUIRED"], //순차진행여부
      durableListHeaderParam: { // Durable 목록 Grid
        gridid: "dgvDurableInfo", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        noRowstat: true,
        noFirstCheck: true,
      },
      lotListHeaderParam: { // Duralbe Lot 목록 Grid
        gridid: "dgvLotInfo", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        gridHeader: [],
        noRowstat: true,
        noFirstCheck: true,
      },
      routeInfoHeaderParam:{
        gridid: 'dgvRouteInfo',
        noFirstCheck: true,
        noRowstat: true,
        gridHeader: [],
      },
      searchOption:true, // Durable Enter Event
      durableState:'', // Durable 상태
      durableType:'', // Durable 구분
      lotid:'',
      reSetPage:false,
      sortField:[{}],
      selectedID: null,
    };
  },
  created() {
  },
  async mounted() {
    await this.getHeaderMulti(this.durableListHeaderParam, this.$refs.divWrapper);
    await this.getHeaderMulti(this.lotListHeaderParam, this.$refs.divWrapper2);
    await this.getHeaderMulti(this.routeInfoHeaderParam, this.$refs.divWrapper2);
  },
  computed: {
      durableGridItems () {
      return this.durableListData.map((item) => ({ ...item, selected: item.DURABLEID === this.selectedID }));
    },
  },
  watch: {
  },
  methods: { 
     // 페이지 변환시 이벤트
     pageChangeEvent(idx) {
      const capacity = this.durableListData[idx].CAPACITY;
      // 행 durable id -> lot 목록 input 셋팅
      this.LotCarrierid = this.durableListData[idx].DURABLEID;
      this.getDurableLotListData(capacity);

    },
    async searchBtn(){
      this.$refs.durableGrid.sortField = [{}];
      this.$refs.durableGrid.skip = 0;
      await this.getDurableListData();
    },

    //검색 인풋 변경시
    searchInputValSet(nm, val) {
      this[nm] = val;
    },

    comboChange(nm, val) {
      this[nm] = val;
    },

    //Durable 그리드 행 클릭
    durableRowClick (event) {
      const capacity = event.dataItem.CAPACITY;
      // 행 durable id -> lot 목록 input 셋팅
      this.LotCarrierid = event.dataItem.DURABLEID;
      this.selectedID = event.dataItem.DURABLEID;
      this.getDurableLotListData(capacity);
    },

    // lot 그리드 행 클릭
    lotRowClick (event) {
      this.durableLotListData = this.durableLotListData.map((item) => ({ ...item, selected: item.idx === event.dataItem.idx }));
      if(event.dataItem.CARRIERID != '') {
        this.lotid = event.dataItem.LOTID;
      }else{
        this.lotid = '';
      }
    },
    // lot 그리드 행 더블클릭
    lotRowDoubleClick() {
      this.showRouting();
    }, 
    // Durable 목록 조회
    async getDurableListData() {
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetOMDurableInfoList",
        sendParam: {
          plantid: "LS",
          durableid: this.durableid,
          durablestate:this.durableState,
          durabletype:this.durableType
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
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        if(data.length === 0) {
          this.durableListData = [];
          this.durableLotListData = [];  
          return;
        }
        this.durableListData = data;
        this.LotCarrierid = data[0].DURABLEID;
        this.getDurableLotListData(data[0].CAPACITY);
      });
    },
    // lot 목록 조회
    async getDurableLotListData(capacity) {
       this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetDurableSearchList",
        sendParam: {
          plantid: "LS",
          carrierid: this.LotCarrierid,
          loadingDisabled: true
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
        this.durableLotListData = data;
        this.createLotGridRow(capacity);
      });
    },
    async createLotGridRow(data) {
      const capacity = Number(data);
      let lotLenght = Number(this.durableLotListData.length); // durable lot 데이터 수
      let loopIndex = capacity-lotLenght;
      
      // 해당 Durable 용량 - lot 데이터 수만큼 빈 배열 생성 후 grid push
      for(let i=0;i<loopIndex;i++){
        let emptyObj = {CARRIERID:'',idx:++lotLenght,selected:false};
        this.durableLotListData.push(emptyObj);
      }
    },
    showRouting(){
      const lotid = this.lotid; // 선택 lot id 값
      if(lotid == '') {
        return;
      }
      this.routerData = []; // 공정진행정보 리스트 초기화

      // Router 팝업 컬럼 width 설정
      this.routeInfoHeaderParam.gridHeader[0].width = 180;
      this.routeInfoHeaderParam.gridHeader[1].width = 180;


      // 공정진행정보 조회
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetOMDurableProcessRouteProgressList",
        sendParam: {
          plantid: "LS",
          lotid: lotid
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
        this.routerData = data;
      });   
      // 선택한 lotid 있으면 공정진행정보 팝업 조회
      this.processRouteInfoModalVisible = !this.processRouteInfoModalVisible
    },
     // 필터 정렬
    sortChangeHandler(e){
       this.gfn_sortChangeHandler(this.durableListData, e, [
        'CAPACITY',
        'USAGETIME',
        'EXPIRYTIME',
        'LOTCOUNT',
        'USAGECOUNT',
        'USAGELIMIT'
      ]);
    },
    sortChangeHandler2(e){
      this.gfn_sortChangeHandler(this.durableLotListData, e, [
        'CURRENTQUANTITY',
        'ENDDUEDATE',
        'PRIORITY',
        'STARTDUEDATE'
      ]);
    }
  }
};
</script>
<style lang="scss" scoped>
@media (max-width: 1267px) {
  .divList1 {
    height: 234px !important;
  }
  .divList2 {
    height: 234px !important;
  }
}
</style>