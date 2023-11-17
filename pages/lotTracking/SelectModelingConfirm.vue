<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="PO 생산계획 목록"
      width="70%"
      height="600"
      @close="toggleDialog"
    >
      <v-row ref="searchFilter" class="search-box">
        <v-col :sm="6" :lg="8" align="left">
          <div class="form-group-wrap">
            <div class="form-group">
              <Label> 제품코드 </Label>

              <InputText
                ref="productid"
                :boxWidth="'98%'"
                :dataNm="'productid'"
                :disabled="false"
                :searchOption="true"
                :searchFunc="getGridData"
                @input-text-set="searchInput"
              />
            </div>
          </div>
        </v-col>
        <v-col :sm="6" :lg="4" align="right">
          <Button
            :theme-color="'primary'"
            :size="'medium'"
            icon="search"
            @click="getGridData"
            >조회</Button
          >
          <Button
            :theme-color="'primary'"
            :size="'medium'"
            icon="check"
            @click="selectRow"
            >선택</Button
          >
        </v-col>
      </v-row>
      <v-row ref="contents">
        <v-col
          :cols="12"
          :class="'divListWapper'"
          :style="{ height: 'calc(100% - 33px)' }"
        >
          <div ref="divWrapper" :style="{ height: '100%' }">
            <KendoGrid
              :isPaging="true"
              ref="rowGrid"
              :gridHeight="gridHeight"
              :gridItems="gridData"
              :sortable="true"
              :columns="gridHeader"
              :resizable="false"
              :edit-field="'inEdit'"
              :selected-field="selectedField"
              @gridrowclick="onRowClick"
              @rowdblclick="rowdblclick"
            />
          </div>
        </v-col>
      </v-row>
    </Dialog>
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';

export default {
  name: 'SearchModal',
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
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
      gridHeader: [],
      gridData: [],
      gridOriData: [],
      gridHeight: '',
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvConfirmList',
        rowStat: '',
      },
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      productid: '',
      lotid: '',
      selected: null,
    };
  },
  computed: {
    areAllSelected() {
      return (
        this.gridData.findIndex(x => x.checked === false) === -1 &&
        this.gridData.length !== 0
      );
    },
    items() {
      return this.gridData.map(item => ({
        ...item,
        selected: item.PRODUCTID === this.selectedID,
      }));
    },
  },
  async mounted() {
    await this.getGridData();
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetLotCreateModelingConfirmList',
        sendParam: {
          plantid: 'LS',
          processroutetype: 'Main',
          productid: this.productid,
        },
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
      });
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData.forEach(item => {
        item.selected = item.idx === selectedIdx;
      });
      this.selectedID = event.dataItem.PRODUCTID;
    },

    //그리드 더블 클릭
    rowdblclick(event) {
      this.$emit('productCode', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //선택
    selectRow() {
      const returnData = this.gridData.filter(x => x.selected);
      this.$emit('productCode', returnData[0]);
      this.$emit('visibleDialog', !this.visibleDialog);
      console.log(returnData[0]);
    },
    searchInput(nm, val) {
      this[nm] = val;
    },
  },
};
</script>
