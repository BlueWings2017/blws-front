<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>Lot이력조회</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>Lot ID</label>
                    <InputText
                      :readonly="true"
                      ref="lotid"
                      :searchOption="true"
                      :dataNm="'lotid'"
                      @input-text-set="searchInputValSet"
                    />
                    <Button
                      ref="searchLot"
                      :theme-color="'primary'"
                      :size="'medium'"
                      @click="searchModalVisible = !searchModalVisible"
                      >선택</Button
                    >
                  </div>
                </div>
              </v-col>

              <v-col :sm="3" :lg="2" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  icon="search"
                  @click="() => searchBtn(null)"
                  >{{ $t('CommLang.btn.selectBtn') }}</Button
                >
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <v-row ref="contents">
      <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
        <v-row :style="{ height: '100%' }">
          <v-col :cols="12" :class="'divList2'" :style="{ height: '100%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <TabStrip
                  :selected="selectedTab"
                  @select="onSelect"
                  :tabs="tabs"
                  :style="{ height: '100%' }"
                >
                  <template v-slot:LotProcessHistory>
                    <div ref="LotProcessHistory" :style="{ height: '100%' }">
                      <KendoGrid
                        :isPaging="true"
                        @notPageReset="notPageReset"
                        :reSetPage="reSetPage"
                        ref="rowGrid"
                        :gridHeight="gridHeight"
                        :gridItems="gridData.LotProcessHistory"
                        :sortable="true"
                        :columns="lotProcessHistoryHeaderParam.gridHeader"
                        :disabledCheckHeaderArr="
                          lotProcessHistoryHeaderParam.disabledCheckHeaderArr
                        "
                        :resizable="true"
                        :selected-field="selectedField"
                        :edit-field="'inEdit'"
                        @gridrowclick="onRowClick"
                        @rowdblclick="lotProcessHistoryDbClick"
                        @sortChangeHandler="lotProcessHistorySortChangeHandler"
                      />
                    </div>
                  </template>
                  <template v-slot:ReworkInformationList>
                    <div
                      ref="ReworkInformationList"
                      :style="{ height: '100%' }"
                    >
                      <KendoGrid
                        @gridrowclick="onRowClick"
                        :isPaging="true"
                        @notPageReset="notPageReset"
                        @sortChangeHandler="reworkInfoSortChangeHandler"
                        :reSetPage="reSetPage"
                        ref="rowGrid"
                        :gridHeight="gridHeight"
                        :gridItems="gridData.ReworkInformationList"
                        :sortable="true"
                        :columns="reworkInforHeaderParam.gridHeader"
                        :disabledCheckHeaderArr="
                          reworkInforHeaderParam.disabledCheckHeaderArr
                        "
                        :resizable="true"
                        :selected-field="selectedField"
                        :edit-field="'inEdit'"
                      />
                    </div>
                  </template>
                </TabStrip>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" :callBack="alertCallBack" />

    <SelectLotID
      ref="SelectLotID"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :selectedLot="selectedLot"
      :callBack="() => {}"
      @visibleDialog="val => (searchModalVisible = val)"
      @searchBtn="searchBtn"
    />

    <SelectConsumableHistory
      ref="SelectConsumableHistory"
      v-if="consumableHistoryModalVisible"
      :visibleDialog="consumableHistoryModalVisible"
      @visibleDialog="val => (consumableHistoryModalVisible = val)"
      :gridItems="gridData.ConsumableHistoryList"
      :columns="consumableHistoryModalParam.gridHeader"
    />

    <DetailView
      ref="detailView"
      :is="'detailView'"
      :header="lotListHeaderParam.gridHeader"
      :item="gridData.LotInfo[0]"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import KendoGrid from '@/components/common/KendoGrid';
import DateUtility from '~/plugins/dateUtility';
import { Button } from '@progress/kendo-vue-buttons';
import { Input } from '@progress/kendo-vue-inputs';
import { TabStrip } from '@progress/kendo-vue-layout';
import InputText from '../../components/common/input/InputText.vue';
import Checkbox from '@/components/common/input/Checkbox';
import AlertPop from '../../components/common/modal/AlertPop.vue';
import SelectLotID from '../../components/popup/SelectLotID.vue';
import SelectConsumableHistory from '../../components/frmLotProcessHistory/SelectConsumableHistory.vue';
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';
import DetailView from '@/components/common/DetailView';

let myTitle;
let myMenuId;
export default {
  name: 'LotProcessHistory',
  mixins: [mixinGlobal, multiGridHeaderMinin],
  async asyncData(context) {
    const myState = context.store.state;
    myMenuId = context.route.query.menuId;
    await context.store.commit('setActiveMenuInfo', myState.menuData[myMenuId]);
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
    SelectConsumableHistory,
    AlertPop,
    Input,
    Button,
    CardBody,
    CardTitle,
    Card,
    InputText,
    KendoGrid,
    TabStrip,
    Checkbox,
    Utility,
    DateUtility,
    SelectLotID,
    ConfirmPop,
    DetailView,
  },

  data() {
    return {
      //grid
      gridHeight: '100px',
      gridData: {
        LotProcessHistory: [],
        ReworkInformationList: [],
        LotInfo: [],
        ConsumableHistory: [],
      },
      gridOriData: {
        LotProcessHistory: [],
        ReworkInformationList: [],
        LotInfo: [],
        ConsumableHistory: [],
      },
      lotListHeaderParam: {
        gridid: 'dgvLotInfo',
        gridHeader: [],
        noFirstCheck: true,
        disabledCheckHeaderArr: ['GOINORDERREQUIRED'],
        noRowstat: true,
      },
      lotProcessHistoryHeaderParam: {
        gridid: 'dgvLotProcessHistory',
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      reworkInforHeaderParam: {
        gridid: 'dgvReworkInfo_LotProcessHistory',
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      consumableHistoryModalParam: {
        gridid: 'dgvConsumableHistory',
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      selectedField: 'selected',
      selected: { LotProcessHistory: null },
      //select
      productid: '',
      lotProcessHistoryRow: null,
      selectedLot: null,
      //input
      lotid: null,
      chkDesc: 'asc',
      //popup
      alertCallBack: () => {},
      searchModalVisible: false,
      consumableHistoryModalVisible: false,
      //etc
      reSetPage: false,
      plantid: 'LS',
      tabs: [
        { title: 'Lot 이력', content: 'LotProcessHistory' },
        { title: '재작업 이력', content: 'ReworkInformationList' },
      ],
      selectedTab: 0,
    };
  },

  async mounted() {
    await this.getHeaderMulti(
      this.lotListHeaderParam,
      this.$refs.LotProcessHistory
    );
    await this.getHeaderMulti(
      this.lotProcessHistoryHeaderParam,
      this.$refs.LotProcessHistory
    );
    await this.getHeaderMulti(
      this.reworkInforHeaderParam,
      this.$refs.LotProcessHistory
    );
    await this.getHeaderMulti(
      this.consumableHistoryModalParam,
      this.$refs.LotProcessHistory
    );
  },

  computed: {
    lotInfoGet() {
      return {
        id: 'LotInfo',
        queryId: 'GetLotInfo',
        params: {
          lotid: this.lotid,
          plantid: this.plantid,
        },
      };
    },

    lotProcessHistoryGet() {
      return {
        id: 'LotProcessHistory',
        queryId: 'GetLotProcessHistory',
        params: {
          lotid: this.lotid,
          plantid: this.plantid,
        },
      };
    },

    reworkInformationListGet() {
      return {
        id: 'ReworkInformationList',
        queryId: 'GetReworkInformationList',
        params: {
          lotid: this.lotid,
          plantid: this.plantid,
        },
      };
    },
    consumableHistoryListGet() {
      return {
        id: 'ConsumableHistoryList',
        queryId: 'GetConsumableHistoryList',
        params: {
          lotid: this.lotProcessHistoryRow.LOTID,
          timekey: this.lotProcessHistoryRow.TIMEKEY,
        },
      };
    },
  },

  methods: {
    async getGridData(_id) {
      try {
        const res = await this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: _id.queryId,
          sendParam: _id.params,
        });
        const data = res.map((x, idx) => {
          return {
            ...x,
            selected: idx === 0,
            idx: idx,
            inEdit: true,
            newRow: false,
          };
        });
        this.$nuxt.$emit('iccReset');
        this.gridOriData[_id.id] = data;
        this.gridData[_id.id] = data;

        return data.length;
      } catch (error) {
        console.log(error);
      }
    },

    notPageReset(flag) {
      this.reSetPage = flag;
    },

    lotProcessHistorySortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData.LotProcessHistory, e);
    },
    reworkInfoSortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData.ReworkInformationList, e, [
        'REWORKCOUNT',
      ]);
    },

    popDetailView() {
      if (!this.selectedLot) {
        this.$refs.alertPop.show('', 'Lot을 선택 후 조회하세요');
        this.alertCallBack = () => {};
        return;
      }
      this.$refs.detailView.show('Lot 상세보기');
    },
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      if (this.selectedTab === 1) {
        this.gridData.ReworkInformationList.forEach(item => {
          item.selected = item.idx === selectedIdx;
        });
        this.selected.ReworkInformationList = event.dataItem;
      }
      if (this.selectedTab === 0) {
        this.gridData.LotProcessHistory.forEach(
          i => (i.selected = i.idx === selectedIdx)
        );
        this.selected.LotProcessHistory = event.dataItem;
      }
    },
    async lotProcessHistoryDbClick(e) {
      if (e.dataItem.EVENTNAME === 'TxnConsumable') {
        this.lotProcessHistoryRow = e.dataItem;
        await this.getGridData(this.consumableHistoryListGet);
        this.consumableHistoryModalVisible = true;
      }
    },
    onSelect(e) {
      this.selectedTab = e.selected;
      this.getGridData(this.lotProcessHistoryGet);
      this.getGridData(this.reworkInformationListGet);
    },

    //btn
    async searchBtn(data) {
      if (data) {
        this.reSetPage = true;
        this.selectedLot = data;
        this.$refs.lotid.textVal = data.LOTID;
        this.lotid = data.LOTID;
        await this.getGridData(this.lotInfoGet) //
          .then(res => {
            if (!res) {
              this.alertCallBack = () => {};
              this.$refs.alertPop.show(
                '',
                '존재하지 않는 Lot입니다. LotID를 확인해 주시기 바랍니다.'
              );
              return;
            }
          });
        this.getGridData(this.lotProcessHistoryGet);
        this.getGridData(this.reworkInformationListGet);
      } else {
        if (this.selectedLot) {
          return;
        }
        this.$refs.alertPop.show('', 'Lot을 선택 후 조회하세요');
        this.alertCallBack = () => {
          this.$refs.searchLot.$listeners.click();
        };
      }
    },

    searchInputValSet(nm, val) {
      this[nm] = val;
    },

    formCheckValSet(nm, val) {
      const sortFunc = val ? (a, b) => a - b : (a, b) => b - a;
      this.gridData.LotProcessHistory = [
        ...this.gridData.LotProcessHistory,
      ].sort((a, b) => sortFunc(b.TIMEKEY, a.TIMEKEY));
      this.gridData.ReworkInformationList = [
        ...this.gridData.ReworkInformationList,
      ].sort((a, b) => sortFunc(b.REWORKCOUNT, a.REWORKCOUNT));
    },
  },
};
</script>
<style lang="scss"></style>
