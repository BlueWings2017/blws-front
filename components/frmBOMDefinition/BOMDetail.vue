<template>
  <div :style="{ width: '100%', height: '100%' }">
    <v-row no-gutters>
      <v-col cols="6" align="left">
        <CardTitle>BOM 상세</CardTitle>
      </v-col>
      <v-col cols="6" align="right">
        <kbutton
          :theme-color="'secondary'"
          :size="'small'"
          :icon="'add'"
          @click="bomDetailAddBtn"
          >추가</kbutton
        >
        <kbutton
          :theme-color="'secondary'"
          :size="'small'"
          :icon="'delete'"
          @click="bomDetailDelBtn"
          >삭제</kbutton
        >
        <kbutton
          :theme-color="'secondary'"
          :size="'small'"
          :icon="'undo'"
          @click="bomDetailUndoBtn"
          >UNDO</kbutton
        >
      </v-col>
    </v-row>
    <div ref="divWrapper" style="height: calc(100% - 33px)">
      <KendoGrid
        ref="rowGrid"
        :gridHeight="gridHeight"
        :gridItems="gridData"
        :sortable="true"
        :columns="gridHeader"
        :resizable="true"
        :edit-field="'inEdit'"
        :selected-field="selectedField"
        :gridDropDownList="headerParam.enumComboBox"
        :isPaging="true"
        :reSetPage="this.reSetPage"
        :pkNotEditArr="pkNotEditArr"
        @selectionchange="onSelectionchange"
        @gridrowclick="onRowClick"
        @gridddchang="rowDdChange"
        @griditemchange="griditemchange"
        @gridButtonClick="bomDetailGridButtonClick"
        @headerselectionchange="onHeaderSelectionChange"
        @sortChangeHandler="sortChangeHandler"
      />
    </div>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <SelectConsumableModal
      ref="SelectConsumableModal"
      v-if="selectConsumableModalVisible"
      :visibleDialog="selectConsumableModalVisible"
      :gridData="selectConsumableData"
      title="selectConsumable"
      :inputVal="inputVal"
      @visibleDialog="val => (selectConsumableModalVisible = val)"
      @selectedRow="selectedRow"
    />
    <ConfirmPop
      :is="'confirmPop'"
      ref="confirmPop"
      :visibleDialog="false"
      :callBack="() => {}"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '@/components/common/input/InputText';
import Checkbox from '@/components/common/input/Checkbox';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { mapState, mapMutations, mapActions } from 'vuex';
import SelectConsumableModal from '@/components/frmBOMDefinition/SelectConsumableModal';

export default {
  name: 'BOMDetail',
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Card,
    kbutton: Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    Checkbox,
    MesSelectBox,
    DropDownList,
    SelectConsumableModal,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: '250px',
    },
  },
  data() {
    return {
      columns: [],
      gridHeader: [],
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvBomDetail', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        enumComboBox: [],
      },
      inputVal: '',
      btnClickRow: {},
      defaultDescription: '',
      // gridDropDownList: [
      //   {
      //     dataVal: 'CONSUMABLEUNIT',
      //     dataItem: [],
      //   },
      // ],
      pkNotEditArr: ['CONSUMABLEID', 'CONSUMABLENAME'],
      selectConsumableModalVisible: false, // BOM상세 검색버튼 팝업
      reSetPage: false,
      selected: '',
    };
  },
  created() {},
  async mounted() {
    // await this.getGridComboList();
  },
  computed: {
    ...mapState({
      gridData: state => state.modules.frmBOMD.dgvBomDetail,
      selectedProduct: state => state.modules.frmBOMD.selectedProduct,
      dgvBomDefinition: state => state.modules.frmBOMD.dgvBomDefinition,
      bomOriDetailData: state => state.modules.frmBOMD.bomOriDetailData,
    }),
  },
  watch: {},
  methods: {
    ...mapActions({
      setDataAction: 'modules/frmBOMD/setDataAction',
      setDgvBomDefinitionListAction:
        'modules/frmBOMD/setDgvBomDefinitionListAction',
      setDgvBomDetailListAction: 'modules/frmBOMD/setDgvBomDetailListAction',
      setSelectedProductAction: 'modules/frmBOMD/setSelectedProductAction',
    }),
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    //그리드 버튼 클릭 (BOM상세 - 검색)
    bomDetailGridButtonClick(e, field, dataItem) {
      if (field === 'CONSUMABLEIDBUTTON') {
        this.selectConsumableData = this.gridData.filter(
          x => x.idx > dataItem.idx
        );
        this.btnClickRow = dataItem;
        this.inputVal = dataItem.CONSUMABLENAME;
        this.selectConsumableModalVisible = true;
      }
    },
    //검색버튼 선택 (BOM상세)
    selectedRow(row) {
      const data = this.gridData.map(x => {
        if (this.btnClickRow?.newRowUUid === x.newRowUUid) {
          return {
            ...x,
            CONSUMABLEID: row.CONSUMABLEID, // 자재코드
            CONSUMABLENAME: row.CONSUMABLENAME, // 자재명
            CONSUMABLEUNIT: row.UNIT, // 투입단위
          };
        }
        return x;
      });
      this.setDgvBomDetailListAction(data);
    },
    //추가 버튼 클릭
    bomDetailAddBtn() {
      this.$refs.rowGrid.skip = 0;

      const newRowUUid = this.selectedProduct.newRowUUid; // 신규로우 중 가장 위 newRowUUid

      // BOMINDEX
      const bomIndexData = this.gridData.map(x => Math.max(x.BOMINDEX));

      if (
        bomIndexData === null ||
        bomIndexData.length === 0 ||
        bomIndexData === []
      ) {
        var iAddBOMIndex = 1;
      } else {
        var iAddBOMIndex = Math.max(...bomIndexData) + 1;
      }

      if (newRowUUid !== '') {
        // 신규이면
        const productid = this.selectedProduct.PRODUCTID;
        const bomid = this.selectedProduct.BOMID;

        if (productid === '' || bomid === '') {
          this.$refs.alertPop.show(
            '알림',
            'BOM 마스터의 제품코드, BOMIID 항목을 입력 후 추가하세요.'
          );
          return;
        } else {
          const newRowUUid = Math.round(Math.random() * 1000000000).toString();

          const dataItem = {
            newRowUUid,
            inEdit: true,
            newRow: true,
            selected: false,
            PLANTID: 'LS',
            rowStat: 'C',
            idx: this.gridData.length,
            BOMINDEX: iAddBOMIndex, // 투입순서
            CONSUMABLEID: '', //자재코드
            CONSUMABLENAME: '', //자재명
            CONSUMABLEIDBUTTON: '검색', // 검색버튼
            CONSUMABLEVALUE: '', // 투입량
            CONSUMABLEUNIT: '', // 투입단위
            CONSUMABLEACCOUNT: '', // 투입계정
            DESCRIPTION: '', // 비고
            PRODUCTID: this.selectedProduct.PRODUCTID,
            BOMID: this.selectedProduct.BOMID,
            BOMVERSION: this.selectedProduct.BOMVERSION,
          };
          this.gridData.splice(0, 0, dataItem);
        }
        this.$nuxt.$emit('iccReset');
      }
    },
    //삭제버튼
    bomDetailDelBtn() {
      const delData = this.gridData
        .filter(x => x.selected === true)
        .map(x => {
          return {
            ...x,
          };
        });
      if (delData.length > 0) {
        this.$refs['confirmPop'].title = 'info';
        this.$refs['confirmPop'].message = `선택한 데이터를 삭제 하시겠습니까?`;
        if (delData.filter(x => x.rowStat !== 'C').length >= 1) {
          var selectedRow = {};
          selectedRow = delData
            .filter(x => x.rowStat !== 'C')
            .map(x => x.CONSUMABLEID);
          this.$refs[
            'confirmPop'
          ].message = `선택한 데이터 (${selectedRow}) 를 삭제 하시겠습니까?`;
        }
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        this.$refs['confirmPop'].callBack = this.delBtn;
      } else {
        this.$refs.alertPop.show(
          '알림',
          '선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.'
        );
        return;
      }
    },
    //삭제
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.setDgvBomDetailListAction(
        data
          .filter(x => !(x.selected && x.rowStat === 'C'))
          .map(x => {
            if (x.selected) {
              return {
                ...x,
                rowStat: 'D',
              };
            }
            return x;
          })
      );
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (
        data[idx].rowStat === 'U' &&
        !this.gfn_ChkOriginalData(
          this.gridHeader,
          data,
          this.bomOriDetailData,
          idx
        )
      ) {
        data[idx].rowStat = 'N';
      }

      this.setDgvBomDetailListAction(data);
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
        !this.gfn_ChkOriginalData(
          this.gridHeader,
          data,
          this.bomOriDetailData,
          idx
        )
      ) {
        data[idx].rowStat = 'N';
      }

      this.setDgvBomDetailListAction(data);
    },

    bomDetailUndoBtn() {
      const data = JSON.parse(JSON.stringify(this.bomOriDetailData));
      this.setDgvBomDetailListAction(data);
      this.$nuxt.$emit('iccReset');
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.setDgvBomDetailListAction(
        data.map(item => {
          return { ...item, selected: checked };
        })
      );
    },
    //그리드 콤보박스 리스트가져오기
    // async getGridComboList() {
    //   await this.mesGet({
    //     apiKey: 'mes/common/getqueryresult',
    //     queryId: 'GetEnumValue',
    //     sendParam: {
    //       plantid: 'LS',
    //       enumid: 'ConsumableUnit',
    //     },
    //   }).then(data => {
    //     const combo = data.map(x => {
    //       return {
    //         ENUMVALUE: x.ENUMVALUE,
    //         ENUMVALUENAME: x.ENUMVALUENAME,
    //       };
    //     });
    //     this.gridDropDownList[0].dataItem = combo;
    //   });
    // },
    //그리드 로우 클릭
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.setDgvBomDetailListAction(
        this.gridData.map(item => {
          return {
            ...item,
            selected: item.idx === selectedIdx ? !item.selected : item.selected,
          };
        })
      );
    },

    initGrid() {
      this.$nuxt.$emit('iccReset');
    },
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData, e, ['CONSUMABLEVALUE']);
    },
  },
  watch: {},
};

const defaultData = {};
</script>
<style lang="scss"></style>
