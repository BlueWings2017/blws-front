<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>Lot조회</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>제품코드</label>
                    <InputText
                      :readonly="true"
                      ref="productid"
                      :searchOption="true"
                      :textVal="productid"
                      :dataNm="'productid'"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInputValSet"
                    />
                    <Button
                      :theme-color="'primary'"
                      :size="'medium'"
                      @click="searchModalVisible = !searchModalVisible"
                      >선택</Button
                    >
                  </div>

                  <div class="form-group">
                    <label>시작 일자</label>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="fromdate"
                        :disabled="!!this.lotstate"
                        :name="'fromdate'"
                        :format="'yyyy-MM-dd'"
                        :default-value="new Date(fromdate)"
                        :searchOption="true"
                        @change="dateChange"
                      />
                    </div>
                    <span class="i_tilde">~</span>
                    <div class="form-datepicker">
                      <DatePicker
                        :disabled="!!this.lotstate"
                        ref="todate"
                        :name="'todate'"
                        :format="'yyyy-MM-dd'"
                        :default-value="new Date()"
                        :searchOption="true"
                        @change="dateChange"
                      />
                    </div>
                  </div>
                  <div class="form-group" style="margin-left: 30px">
                    <div class="form-chk">
                      <Checkbox
                        ref="lotstate"
                        :dataNm="'lotstate'"
                        :required="true"
                        :defaultchecked="true"
                        @checkbox-set="formCheckValSet"
                      />
                      <label>재공 Lot</label>
                    </div>
                  </div>
                </div>
              </v-col>

              <v-col :sm="3" :lg="2" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  icon="search"
                  @click="searchBtn"
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
          <v-col :cols="12" :class="'divList1'" :style="{ height: '50%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="6" align="left">
                    <CardTitle>Lot 목록</CardTitle>
                  </v-col>
                  <v-col cols="6" align="right">
                    <Button
                      :theme-color="'secondary'"
                      :size="'small'"
                      @click="showRouting"
                      >공정진행정보</Button
                    >
                  </v-col>
                </v-row>

                <div ref="divWrapper1" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                    ref="lotListG"
                    :isPaging="true"
                    @notPageReset="notPageReset"
                    :reSetPage="this.reSetPage"
                    :gridHeight="gridHeight"
                    :gridItems="gridData.lotList"
                    @sortChangeHandler="lotListSortChangeHandler"
                    :sortable="true"
                    :columns="lotListHeaderParam.gridHeader"
                    :disabledCheckHeaderArr="
                      lotListHeaderParam.disabledCheckHeaderArr
                    "
                    :resizable="true"
                    :selected-field="selectedField"
                    :edit-field="'inEdit'"
                    @gridrowclick="onLotListRowClick"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>

          <v-col :cols="12" :class="'divList2'" :style="{ height: '50%' }">
            <Card ref="gridCard" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <CardTitle>Lot Tracking</CardTitle>
                <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
                  <KendoGrid
                    :isPaging="true"
                    ref="lotTrackingG'"
                    :gridHeight="gridHeight"
                    :gridItems="gridData.lotTracking"
                    :columns="lotTrackingHeaderParam.gridHeader"
                    :disabledCheckHeaderArr="
                      lotTrackingHeaderParam.disabledCheckHeaderArr
                    "
                    :sortable="true"
                    @sortChangeHandler="lotTrackingSortChangeHandler"
                    :resizable="true"
                    :selected-field="selectedField"
                    :edit-field="'inEdit'"
                    @gridrowclick="onRowClick"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <SelectModelingConfirm
      ref="SelectModelingConfirm"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      @visibleDialog="val => (searchModalVisible = val)"
      @productCode="productCode"
    />
    <SelectProcessRouteInfo
      ref="selectProcessRouteInfo"
      v-if="processRouteInfoModalVisible"
      :visibleDialog="processRouteInfoModalVisible"
      :callBack="() => {}"
      @visibleDialog="val => (processRouteInfoModalVisible = val)"
      @productCode="productCode"
      :gridItems="gridData.routeInfo"
    />
    <AlertPop ref="alertPop" :is="'alertPop'" />
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
import InputText from '../../components/common/input/InputText.vue';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import Checkbox from '@/components/common/input/Checkbox';
import SelectModelingConfirm from '@/pages/lotTracking/SelectModelingConfirm';
import SelectProcessRouteInfo from '@/pages/lotTracking/SelectProcessRouteInfo';
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';

let myTitle;
let myMenuId;

export default {
  name: 'LotInfoSearch',
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
    Input,
    Button,
    CardBody,
    CardTitle,
    Card,
    InputText,
    KendoGrid,
    DatePicker,
    Checkbox,
    Utility,
    DateUtility,
    SelectModelingConfirm,
    SelectProcessRouteInfo,
    ConfirmPop,
  },

  data() {
    return {
      //grid
      gridHeight: '',
      gridData: { lotList: [], lotTracking: [], routeInfo: [] },
      gridOriData: { lotList: [], lotTracking: [], routeInfo: [] },
      selectedField: 'selected',
      selected: { lotList: null, lotTracking: null },
      lotListHeaderParam: {
        gridid: 'dgvLotInfo',
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
        disabledCheckHeaderArr: ['GOINORDERREQUIRED'],
      },
      lotTrackingHeaderParam: {
        gridid: 'dgvLotTracking',
        noFirstCheck: true,
        noRowstat: true,
        gridHeader: [],
      },
      //select
      curLotID: '',
      curLot: { LOTID: '' },
      //input
      productid: '',
      fromdate: '',
      todate: '',
      lotstate: 'Released',
      plantid: 'LS',
      //popup
      searchModalVisible: false,
      processRouteInfoModalVisible: false,
      //etc
      reSetPage: false,
    };
  },

  created() {
    this.todate = Utility.setFormatDate(new Date(), 'YYYY-MM-DD');
    this.fromdate = Utility.setFormatDate(
      DateUtility.addDate(-7, null, new Date()),
      'YYYY-MM-DD'
    );
  },

  async mounted() {
    await this.getHeaderMulti(this.lotListHeaderParam, this.$refs.divWrapper1);
    await this.getHeaderMulti(
      this.lotTrackingHeaderParam,
      this.$refs.divWrapper2
    );

    this.reSetPage = true;
    this.getGridData(this.lotListGet);
  },

  computed: {
    lotListGet() {
      return {
        id: 'lotList',
        queryId: 'GetLotSearchList',
        params: {
          lotstate: this.lotstate,
          todate: Utility.setFormatDate(this.todate, 'YYYYMMDD'),
          productid: this.productid,
          plantid: this.plantid,
          fromdate: Utility.setFormatDate(this.fromdate, 'YYYYMMDD'),
        },
      };
    },

    lotTrackingGet() {
      return {
        id: 'lotTracking',
        queryId: 'GetViewLotTracking',
        params: {
          lotid: this.curLotID,
          plantid: this.plantid,
        },
      };
    },

    routeInfoGet() {
      return {
        id: 'routeInfo',
        queryId: 'GetOMDurableProcessRouteProgressList',
        params: {
          lotid: this.curLotID,
          plantid: this.plantid,
        },
      };
    },
  },

  watch: {
    curLotID: {
      handler(val) {
        this.lotTrackingGet.params.lotid = val;
        this.getGridData(this.lotTrackingGet);
        this.getGridData(this.routeInfoGet);
      },
      deep: true,
    },
  },

  methods: {
    resetData() {
      this.gridData = { lotList: [], lotTracking: [], routeInfo: [] };
      this.curLotID = '';
      this.curLot = { LOTID: '' };
    },
    included(e, ref) {
      let parent = e.target.$parent;
      while (parent) {
        if (parent === this.$refs[ref]) {
          return true;
        }
        parent = parent.$parent;
      }
      return false;
    },

    // this.gridData = { lotList: [], lotTracking: [], routeInfo: [] };

    lotListSortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData.lotList, e, [
        'CURRENTQUANTITY',
        'PRIORITY',
      ]);
    },
    lotTrackingSortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData.lotTracking, e, [
        'TARGET',
        'RESULTVALUE',
        'LOWERSPECLIMIT',
        'UPPERSPECLIMIT',
      ]);
    },

    // sortChangeHandler(e) {
    //   const isAscending = e.sort[0]?.dir == 'asc';

    //   let sortTarget = (() => {
    //     if (this.included(e, 'lotListG')) {
    //       return this.gridData.lotList;
    //     }
    //     return this.gridData.lotTracking;
    //   })();

    //   if (isAscending) {
    //     sortTarget = sortTarget.sort((a, b) =>
    //       a[e.event?.field] < b[e.event?.field]
    //         ? -1
    //         : a[e.event?.field] > b[e.event?.field]
    //         ? 1
    //         : 0
    //     );
    //   } else {
    //     sortTarget = sortTarget.sort((a, b) =>
    //       a[e.event?.field] > b[e.event?.field]
    //         ? -1
    //         : a[e.event?.field] < b[e.event?.field]
    //         ? 1
    //         : 0
    //     );
    //   }
    // },
    notPageReset(flag) {
      this.reSetPage = flag;
    },
    showRouting() {
      if (this.gridData.lotList.length > 0) {
        this.processRouteInfoModalVisible = !this.processRouteInfoModalVisible;
      } else {
        this.$refs['alertPop'].show(
          '',
          'Lot을 조회 후 라우팅 정보를 조회하세요.'
        );
      }
    },
    searchBtn() {
      if (!this.validateDates()) return;
      this.reSetPage = true;
      this.getGridData(this.lotListGet);
    },

    searchInputValSet(nm, val) {
      this[nm] = val;
    },

    validateDates() {
      this.todate = this.todate.replace(/-/g, '');
      this.fromdate = this.fromdate.replace(/-/g, '');
      if (this.todate && this.fromdate > this.todate) {
        this.$refs.alertPop.show('', 'From 날짜가 To날짜보다 큽니다.');
        return false;
      }
      return true;
    },
    dateChange(e) {
      this[e.target.name] = Utility.setFormatDate(e.value, 'YYYYMMDD');
    },

    formCheckValSet(nm, val) {
      this[nm] = val ? 'Released' : '';
    },

    async getGridData(_id) {
      try {
        this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: _id.queryId,
          sendParam: _id.params,
        }).then(res => {
          if (_id.id === 'lotList') {
            if (res.length === 0) {
              this.$refs['alertPop'].show('', '로트목록이 존재하지 않습니다.');
              this.resetData();
            } else {
              const data = res.map((x, idx) => {
                return {
                  ...x,
                  rowStat: 'N',
                  selected: idx === 0,
                  idx: idx,
                  inEdit: true,
                  newRow: false,
                };
              });

              this.$nuxt.$emit('iccReset');
              this.gridOriData[_id.id] = data;
              this.gridData[_id.id] = data;
              this.curLot = data[0];
              this.curLotID = data[0].LOTID;
            }
          } else {
            const data = res.map((x, idx) => {
              return {
                ...x,
                rowStat: 'N',
                selected: idx === 0,
                idx: idx,
                inEdit: true,
                newRow: false,
              };
            });

            this.$nuxt.$emit('iccReset');
            this.gridOriData[_id.id] = data;
            this.gridData[_id.id] = data;
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    //그리드 로우 클릭
    onLotListRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData.lotList.forEach(item => {
        item.selected = item.idx === selectedIdx;
      });
      this.selected.lotList = event.dataItem;
      this.curLot = event.dataItem;
      this.curLotID = event.dataItem.LOTID;
    },

    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData.lotTracking.forEach(item => {
        item.selected = item.idx === selectedIdx;
      });
      this.selected.lotTracking = event.dataItem;
    },

    productCode(data) {
      this.productid = data.PRODUCTID;
      this.$refs['productid'].textVal = data.PRODUCTID;
      this.searchBtn();
    },
  },
};
</script>
<style lang="scss"></style>
