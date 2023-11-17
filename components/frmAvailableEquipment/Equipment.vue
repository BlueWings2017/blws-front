<template>
  <div :style="{ width: '100%', height: '50%' }">
    <v-col :cols="12" :class="'divList3'" :style="{ height: '100%' }">
      <Card :style="{ height: '100%' }">
        <CardBody :style="{ height: '100%' }">
          <v-row no-gutters>
            <v-col cols="6" align="left">
              <CardTitle>가능설비목록</CardTitle>
            </v-col>
            <v-col cols="6" align="right">
              <kbutton
                :theme-color="'primary'"
                :size="'small'"
                :icon="'save'"
                @click="saveBtn"
                >저장</kbutton
              >
              <kbutton
                :theme-color="'secondary'"
                :size="'small'"
                :icon="'add'"
                @click="addBtn"
                >추가
              </kbutton>
              <kbutton
                :theme-color="'secondary'"
                :size="'small'"
                :icon="'delete'"
                @click="confirmDel"
                >삭제</kbutton
              >
              <kbutton
                :theme-color="'secondary'"
                :size="'small'"
                :icon="'undo'"
                @click="undoBtn"
                >UNDO
              </kbutton>
            </v-col>
          </v-row>
          <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
            <KendoGrid
              ref="rowGrid"
              :gridHeight="gridHeight"
              :gridItems="gridData"
              :sortable="true"
              :columns="headerParam.gridHeader"
              :resizable="true"
              :edit-field="'inEdit'"
              :selected-field="selectedField"
              :checkHeaderArr="checkHeaderArr"
              :changeCell="changeCell"
              :isPaging="true"
              :reSetPage="this.reSetPage"
              :pkNotEditArr="pkNotEditArr"
              @gridrowclick="onRowClick"
              @gridButtonClick="gridButtonClick"
              @sortChangeHandler="sortChangeHandler"
            />
          </div>
        </CardBody>
      </Card>
    </v-col>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    <SelectEquipmentModal
      ref="SelectEquipmentModal"
      v-if="selectEquipmentModalVisible"
      :visibleDialog="selectEquipmentModalVisible"
      :gridData="selectEquipmentGridData"
      title="설비목록"
      :inputVal="inputVal"
      :checkHeaderArr="checkHeaderArr"
      :selected-field="selectedField"
      @visibleDialog="val => (selectEquipmentModalVisible = val)"
      @selectedRow="selectedRow"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
//import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '@/components/common/input/InputText';
import Checkbox from '@/components/common/input/Checkbox';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { mapState, mapMutations, mapActions } from 'vuex';
import SelectEquipmentModal from '@/components/frmAvailableEquipment/SelectEquipmentModal.vue';
import { currencyDisplay } from '@progress/kendo-intl';

export default {
  name: 'Equipment',
  mixins: [mixinGlobal, multiGridHeaderMinin],
  components: {
    Card,
    kbutton: Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    Checkbox,
    MesSelectBox,
    SelectEquipmentModal,
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
      checkHeaderArr: ['ACTIVESTATE'],
      headerParam: {
        gridid: 'dgvEquipmentList_Available', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
      },
      inputVal: '',
      btnClickRow: {},
      defaultDescription: '',
      changeCell: [
        {
          cellName: 'EQUIPMENTBUTTON',
          upperCell: '',
          condition: false,
          dataItem: [],
        },
      ],
      selectEquipmentModalVisible: false,
      reSetPage: false,
      pkNotEditArr: [
        'PRODUCTID',
        'PRODUCTNAME',
        'PROCESSID',
        'PROCESSNAME',
        'EQUIPMENTID',
      ],
    };
  },
  created() {},
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
  },
  computed: {
    ...mapState({
      gridData: state => state.modules.frmAE.dgvEquipmentList_Available,
      productData: state => state.modules.frmAE.selectedProduct,
      processData: state => state.modules.frmAE.selectedProcess,
      selectedEquipment: state => state.modules.frmAE.selectedEquipment,
      equipmentOriData: state => state.modules.frmAE.equipmentOriData,
    }),
  },
  watch: {},
  methods: {
    ...mapActions({
      setDgvEquipmentListAction: 'modules/frmAE/setDgvEquipmentListAction',
      setModelingSetSaveAction: 'modules/frmAE/setModelingSetSaveAction',
      setSelectedProductAction: 'modules/frmAE/setSelectedProductAction',
      setSelectedProcessAction: 'modules/frmAE/setSelectedProcessAction',
      setSelectedEquipmentAction: 'modules/frmAE/setSelectedEquipmentAction',
      setsetEquipmentOriDataAction:
        'modules/frmAE/setsetEquipmentOriDataAction',
    }),
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.row = { ...event.dataItem };
      this.gridData.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
    },
    initGrid() {
      this.$nuxt.$emit('iccReset');
    },
    saveBtn() {
      const dgvEquipmentListData = this.selectedEquipment
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });
      const validate = this.mesValidation(
        this.headerParam.gridHeader,
        this.gridData
      );
      if (!validate.isValidate) {
        this.$refs.alertPop.show('알림', validate.msg);
        return;
      }
      if (dgvEquipmentListData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnAvailableEquipment',
          sendParam: dgvEquipmentListData,
        }).then(result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show('알림', '저장되었습니다');
              this.equipmentGrid();
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                result.message
              );
            }
          });
        });
      } else {
        this.$refs.alertPop.show('알림', '저장할 데이터가 존재하지 않습니다.');
        return;
      }
    },
    async equipmentGrid() {
      const sendParam = {
        plantid: 'LS',
        productid: this.productData.PRODUCTID, // 제품코드
        processid: this.processData.PROCESSID,
      };
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAvailableEquipment',
        sendParam: sendParam,
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
            EQUIPMENTBUTTON: '',
          };
        });
        this.setDgvEquipmentListAction(data);
        if (data !== undefined && data.length > 0) {
          data[0][this.selectedField] = true;
        }
        this.initGrid();
      });
    },
    //unbo 버튼 클릭
    undoBtn() {
      const data = JSON.parse(JSON.stringify(this.equipmentOriData));
      this.setDgvEquipmentListAction(data);
      this.$nuxt.$emit('iccReset');
    },
    //추가 버튼 클릭
    addBtn() {
      const newRowUUid = Math.round(Math.random() * 1000000000).toString();
      const dataItem = {
        newRowUUid,
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: 'LS',
        rowStat: 'C',
        PRODUCTID: this.productData.PRODUCTID, // 제품
        PRODUCTNAME: this.productData.PRODUCTNAME, // 제품명
        PROCESSID: this.processData.PROCESSID, // 공정
        PROCESSNAME: this.processData.PROCESSNAME, // 공정명
        EQUIPMENTID: '', // 설비코드
        EQUIPMENTNAME: '', // 설비명
        changeCellType: 'button', // 검색 버튼 나오도록
        EQUIPMENTBUTTON: '검색', // 검색
        CREATEUSERID: '',
        CREATETIME: '',
        idx: this.gridData.length,
      };

      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },
    //삭제버튼
    confirmDel() {
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
        if (
          delData.filter(x => x.rowStat !== 'C' && x.EQUIPMENTNAME !== '')
            .length >= 1
        ) {
          var selectedRow = {};
          selectedRow = delData.map(x => x.EQUIPMENTNAME);
          this.$refs[
            'confirmPop'
          ].message = `선택한 데이터 (${selectedRow}) 를 삭제 하시겠습니까?`;
        }
        this.$refs['confirmPop'].callBack = this.delBtn;
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
      } else {
        this.$refs.alertPop.show(
          '확인',
          '선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.'
        );
        return;
      }
    },
    //삭제
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.setDgvEquipmentListAction(
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
      this.setSelectedEquipmentAction(
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
    //그리드 버튼 클릭 (가능설비목록 - 추가 후 검색버튼)
    gridButtonClick(e, field, dataItem) {
      if (field === 'EQUIPMENTBUTTON') {
        this.selectEquipmentGridData = this.gridData.filter(
          x => x.idx > dataItem.idx
        );
        this.btnClickRow = dataItem;
        this.inputVal = dataItem.CONSUMABLENAME;
        this.selectEquipmentModalVisible = true;
      }
    },
    //검색버튼 선택
    selectedRow(row) {
      const data = this.gridData.map(x => {
        if (this.btnClickRow?.newRowUUid === x.newRowUUid) {
          return {
            ...x,
            EQUIPMENTID: row.EQUIPMENTID, // 설비코드
            EQUIPMENTNAME: row.EQUIPMENTNAME, // 설비명
          };
        }
        return x;
      });
      this.setDgvEquipmentListAction(data);
      this.setSelectedEquipmentAction(data);
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
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
