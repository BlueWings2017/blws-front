<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>제품라우팅확정</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col :md="9" :sm="8">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>제품코드</label>
                    <InputText
                      ref="productid"
                      :searchOption="true"
                      :dataNm="'productid'"
                      @input-text-set="searchInputValSet"
                    />
                  </div>
                  <div class="form-group">
                    <label>제품명</label>
                    <InputText
                      ref="productname"
                      :searchOption="true"
                      :dataNm="'productname'"
                      @input-text-set="searchInputValSet"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :md="3" :sm="4" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
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
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="12" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  :icon="'save'"
                  @click="saveBtn"
                  :style="{ marginBottom: '8px' }"
                  >{{ $t('CommLang.btn.saveBtn') }}</Button
                >
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
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
                :selected-field="selectedField"
                :edit-field="'inEdit'"
                :checkHeaderArr="checkHeaderArr"
                :disabledCheckHeaderArr="disabledCheckHeaderArr"
                @sortChangeHandler="sortChangeHandler"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @headerselectionchange="onHeaderSelectionChange"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop
      v-if="showModal"
      title="Confirm Item"
      message="Are you sure you want to confirm this item?"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Button } from '@progress/kendo-vue-buttons';
import { Input } from '@progress/kendo-vue-inputs';
import InputText from '../../components/common/input/InputText.vue';
import ConfirmPop from '../../components/common/modal/ConfirmPop.vue';

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal, gridHeaderMinin],
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
    ConfirmPop,
    Input,
    gridLastModIdx: null,
    Utility,
    Button,
    CardBody,
    CardTitle,
    Card,
    InputText,
    KendoGrid,
  },

  data() {
    return {
      gridHeight: '',
      noFirstCheck: true,
      showModal: false,
      parentAreaId: '',
      columns: [],
      gridData: [],
      selected: null,
      selectedField: 'selected',
      gridOriData: [],
      productid: '',
      productname: '',
      checkHeaderArr: ['CONFIRMFLAG'],
      disabledCheckHeaderArr: ['ACTIVESTATE'],
      gridHeader: [],
      headerParam: {
        gridid: 'dgvModelingConfirm', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
      },
      reSetPage: false,
    };
  },
  created() {},
  async mounted() {
    await this.getGridData();
  },

  computed: {
    areAllSelected() {
      return (
        this.gridData.findIndex(x => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    },
  },
  watch: {},
  beforeCreate() {},

  methods: {
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData, e, undefined, [
        'CONFIRMFLAG',
        'ACTIVESTATE',
      ]);
    },
    notPageReset(flag) {
      this.reSetPage = flag;
    },
    async getGridData() {
      const params = {
        plantid: 'LS',
        productid: this.productid,
        productName: this.productname,
      };
      try {
        const res = await this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetModelingConfirmDataList',
          sendParam: params,
        });
        const data = res.map((x, idx) => {
          const isInactive =
            x.ACTIVESTATE === 'Inactive' || x.POLICYNAME === null;
          return {
            ...x,
            rowStat: 'N',
            selected: idx === 0,
            idx: idx,
            inEdit: true,
            newRow: false,
            disabled: isInactive,
          };
        });
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        this.gridData = data;
      } catch (error) {
        console.log(error);
      }
    },

    searchInputValSet(nm, val) {
      this[nm] = val;
      this.searchBtn();
    },

    //그리드 로우 클릭
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData.forEach(item => {
        item.selected = item.idx === selectedIdx;
      });
      this.selected = event.dataItem;
    },

    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map(item => {
        return { ...item, selected: checked };
      });
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if (name === 'CONFIRMFLAG') {
        e.value = e.value ? 'Yes' : 'No';
      }
      data[idx] = { ...data[idx], [name]: e.value };

      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)
      ) {
        data[idx].rowStat = 'N';
      }
      this.gridData = data;
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)
      ) {
        data[idx].rowStat = 'N';
      }
      this.gridData = data;
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      keys.forEach(e => {
        data[idx][e] = data[idx][e] === '' ? null : data[idx][e];
      });
      const chkArr = keys.filter(x => {
        return (
          data[idx][x] !== this.gridOriData[idx][x] &&
          x !== 'rowStat' &&
          x !== 'selected'
        );
      });
      return chkArr.length > 0;
    },

    async searchBtn() {
      this.reSetPage = true;
      await this.getGridData();
    },

    async saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => ({ ...x, _ROWSTATUS: x.rowStat }));

      if (!saveData.length) {
        return this.$refs.alertPop.show(
          '',
          '저장할 데이터가 존재하지 않습니다.'
        );
      }

      const res = await this.mesPost({
        apiKey: 'mes/common/manage',
        messagename: 'TxnModelingConfirm',
        sendParam: saveData,
      });

      this.$refs.alertPop.show(
        res.returncode !== undefined && res.returncode === '0'
          ? '알림'
          : `ERROR : ${res.code}`,
        res.returncode !== undefined && res.returncode === '0'
          ? '저장되었습니다'
          : res.message
      );
      await this.$nextTick();
      await this.getGridData();
    },
  },
};
</script>
<style lang="scss"></style>
