<template>
  <div>
    <Dialog
      v-if="visibleDialog"
      title="Lot ID 조회"
      width="70%"
      height="600"
      @close="toggleDialog"
    >
      <v-row no-gutters>
        <v-col :sm="9" :lg="10">
          <div class="form-group-wrap">
            <div class="form-group">
              <label>Lot Id</label>
              <InputText
                ref="lotid"
                :searchOption="true"
                :searchFunc="searchBtn"
                :dataNm="'lotid'"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label>제품코드</label>
              <InputText
                ref="productid"
                :searchOption="true"
                :searchFunc="searchBtn"
                :dataNm="'productid'"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group" style="margin-left: 30px">
              <div class="form-chk">
                <Checkbox
                  ref="releaseTime"
                  :dataNm="'releaseTime'"
                  :disabled="false"
                  :required="true"
                  :defaultchecked="false"
                  @checkbox-set="chkReleaseTime"
                />
                <label>시작 일자</label>
              </div>

              <div class="form-datepicker">
                <DatePicker
                  ref="fromdate"
                  :name="'fromdate'"
                  :default-value="new Date(fromdate)"
                  :format="'yyyy-MM-dd'"
                  @change="dateChange"
                />
              </div>
              <span class="i_tilde">~</span>
              <div class="form-datepicker">
                <DatePicker
                  ref="todate"
                  :name="'todate'"
                  :default-value="new Date()"
                  :format="'yyyy-MM-dd'"
                  @change="dateChange"
                />
              </div>
            </div>
            <div class="form-group" style="margin-left: 30px">
              <div class="form-chk">
                <Checkbox
                  ref="lotstate"
                  :dataNm="'lotstate'"
                  :disabled="false"
                  :required="true"
                  :defaultchecked="true"
                  @checkbox-set="chkReleased"
                />
                <label>재공 Lot</label>
              </div>
            </div>
          </div>
        </v-col>
        <v-col :sm="3" :lg="2" align="right">
          <Button
            icon="search"
            :theme-color="'primary'"
            :size="'medium'"
            @click="searchBtn"
            >조회</Button
          >
          <Button
            icon="check"
            :theme-color="'primary'"
            :size="'medium'"
            @click="selectRow"
            >선택</Button
          >
        </v-col>
      </v-row>
      <div ref="divWrapper" style="height: calc(100% - 44px)">
        <KendoGrid
          :isPaging="true"
          @notPageReset="notPageReset"
          :reSetPage="this.reSetPage"
          ref="rowGrid"
          :gridHeight="gridHeight"
          :gridItems="gridData"
          :sortable="true"
          :columns="gridHeader"
          :resizable="true"
          :edit-field="'inEdit'"
          :selected-field="selectedField"
          :disabledCheckHeaderArr="disabledCheckHeaderArr"
          @gridrowclick="onRowClick"
          @rowdblclick="rowdblclick"
          @sortChangeHandler="sortChangeHandler"
        />
      </div>
    </Dialog>
    <AlertPop ref="alertPop" :is="'alertPop'" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import Utility from '~/plugins/utility';
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';
import Checkbox from '@/components/common/input/Checkbox';
import DateUtility from '~/plugins/dateUtility';
import AlertPop from '../../components/../components/common/modal/AlertPop.vue';

export default {
  name: 'SearchModal',
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Utility,
    DateUtility,
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    DatePicker,
    Checkbox,
    AlertPop,
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      //grid
      gridHeader: [],
      gridData: [],
      gridOriData: [],
      gridHeight: '',
      selectedField: 'selected',
      selected: null,
      disabledCheckHeaderArr: ['ACTIVESTATE', 'CONFIRMFLAG', 'COMMONFLAG'],
      headerParam: {
        gridid: 'dgvLotList',
      },
      noRowstat: true,
      noFirstCheck: true,
      //input
      lotid: '',
      productid: '',
      fromdate: '',
      todate: '',
      lotstate: 'Released',
      releaseTime: false,
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

  computed: {
    params() {
      if (!this.releaseTime) {
        return {
          plantid: 'LS',
          lotid: this.lotid,
          productid: this.productid,
          fromdate: '000000',
          todate: '999999',
          lotstate: this.lotstate,
        };
      } else {
        return {
          plantid: 'LS',
          lotid: this.lotid,
          productid: this.productid,
          fromdate: Utility.setFormatDate(this.fromdate, 'YYYYMMDD'),
          todate: Utility.setFormatDate(this.todate, 'YYYYMMDD'),
          lotstate: this.lotstate,
        };
      }
    },
  },

  async mounted() {
    await this.getGridData();
  },

  methods: {
    async getGridData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetLotSearchList',
        sendParam: this.params,
      }).then(res => {
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
        this.gridOriData = data;
        this.gridData = data;
        this.selected = data[0];
      });
    },

    sortChangeHandler(e) {
      const isAscending = e.sort[0]?.dir == 'asc';
      if (isAscending) {
        this.gridData = this.gridData.sort((a, b) =>
          a[e.event?.field] < b[e.event?.field]
            ? -1
            : a[e.event?.field] > b[e.event?.field]
            ? 1
            : 0
        );
      } else {
        this.gridData = this.gridData.sort((a, b) =>
          a[e.event?.field] > b[e.event?.field]
            ? -1
            : a[e.event?.field] < b[e.event?.field]
            ? 1
            : 0
        );
      }
    },

    notPageReset(flag) {
      this.reSetPage = flag;
    },

    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
    },

    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData.forEach(item => {
        item.selected = item.idx === selectedIdx;
      });
      this.selected = event.dataItem;
    },

    rowdblclick(event) {
      this.$emit('searchBtn', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog);
    },

    selectRow() {
      this.$emit('searchBtn', this.selected);
      this.$emit('visibleDialog', !this.visibleDialog);
    },

    //input
    searchInput(nm, val) {
      this[nm] = val;
    },

    dateChange(e) {
      this[e.target.name] = Utility.setFormatDate(e.value, 'YYYYMMDD');
      this.validateDates();
    },

    validateDates() {
      this.todate = this.todate.replace(/-/g, '');
      this.fromdate = this.fromdate.replace(/-/g, '');
      if (this.todate && this.fromdate > this.todate) {
        this.$refs.alertPop.show('', 'From 날짜가 To날짜보다 큽니다.');
      }
    },
    chkReleased(nm, val) {
      this.lotstate = val ? 'Released' : '';
    },
    chkReleaseTime(nm, val) {
      this.releaseTime = val;
    },

    //btn
    searchBtn() {
      if (!this.releaseTime && !this.lotstate && !this.lotid) {
        this.$refs.alertPop.show(
          'info',
          '너무 많은 Lot이 조회되어 시스템에 문제가 발생될수 있습니다.  조회조건을 확인해 주세요'
        );
        return;
      }
      this.reSetPage = true;
      this.getGridData();
    },
  },
};
</script>
