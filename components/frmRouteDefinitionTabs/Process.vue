<template>
  <div :style="{ height: '100%' }">
    <v-row ref="contents" no-gutters :style="{ height: '100%' }">
      <v-col :cols="12" :style="{ height: '100%' }">
        <v-row no-gutters>
          <v-col cols="12" align="right">
            <Button
              :theme-color="'primary'"
              :size="'small'"
              icon="save"
              @click="saveValidation"
              >저장</Button
            >
            <Button
              :theme-color="'secondary'"
              :size="'small'"
              icon="add"
              @click="addBtn"
              >추가</Button
            >
            <Button
              :theme-color="'secondary'"
              :size="'small'"
              icon="delete"
              @click="delConfirm"
              >삭제</Button
            >
            <Button
              :theme-color="'secondary'"
              :size="'small'"
              icon="undo"
              @click="undoBtn"
              >undo</Button
            >
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="form-group-wrap form-group-style2">
              <div class="form-group">
                <Label>공정ID</Label>
                <InputText
                  ref="processid"
                  :dataNm="'processid'"
                  :disabled="false"
                  @input-text-set="searchInput"
                  :searchOption="true"
                  :searchFunc="searchBtn"
                />
              </div>
              <div class="form-group">
                <Label>공정명</Label>
                <InputText
                  ref="processname"
                  :dataNm="'processname'"
                  :disabled="false"
                  @input-text-set="searchInput"
                  :searchOption="true"
                  :searchFunc="searchBtn"
                />
              </div>
              <div class="form-group">
                <Label>공정구분</Label>
                <MesSelectBox
                  :enumID="'ProcessType'"
                  :allYN="true"
                  :dataNm="'processtype'"
                  @comboChange="comboChange"
                ></MesSelectBox>
              </div>
              <div class="form-group">
                <Label>종류</Label>
                <MesSelectBox
                  :enumID="'Classification'"
                  :allYN="true"
                  :dataNm="'classification'"
                  @comboChange="comboChange"
                ></MesSelectBox>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row
          no-gutters
          :style="{ margin: '10px 0 0 0', height: 'calc(100% - 92px)' }"
        >
          <v-col cols="12" :style="{ height: '100%' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="gridHeader"
                :resizable="false"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="headerParam.enumComboBox"
                :checkHeaderArr="headerParam.checkBox"
                :changeCell="changeCell"
                :isPaging="true"
                @selectionchange="onSelectionchange"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @sortChangeHandler="sortChangeHandler"
                @headerselectionchange="onHeaderSelectionChange"
              />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop ref="ConfirmPop" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '@/components/common/input/InputText';
import Checkbox from '@/components/common/input/Checkbox';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
export default {
  name: 'Routing',
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Card,
    Button,
    CardBody,
    CardTitle,
    TreeView,
    KendoGrid,
    InputText,
    Checkbox,
    MesSelectBox,
    DropDownList,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: '500px',
    },
    confirm: {
      type: Boolean,
      defaultData: false,
    },
  },
  data() {
    return {
      gridHeader: [],
      gridData: [],
      gridOriData: [],
      // gridDropDownList: [
      //   { dataVal: 'PROCESSTYPE', dataItem: [] },
      //   { dataVal: 'DETAILPROCESSTYPE', dataItem: [] },
      //   { dataVal: 'CLASSIFICATION', dataItem: [] },
      // ],
      selectedField: 'selected',
      // checkHeaderArr: ['ACTIVESTATE'],
      changeCell: [
        {
          cellName: 'PACKINGFLAG',
          upperCell: 'PROCESSTYPE',
          condition: false,
          dataItem: [],
        },
      ],
      processid: '',
      processname: '',
      classification: '',
      processtype: '',
      headerParam: {
        gridid: 'dgvProcessDefinition', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        enumComboBox: [],
        checkBox: [],
      },
      newRowChk: [],
    };
  },
  created() {},
  async mounted() {
    // await this.getGridComboList();
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
  methods: {
    routingId() {},
    searchBtn() {
      this.getGridData();
    },
    saveValidation() {
      const validation = this.gridData.filter(
        x => x.rowStat !== 'N' && !x.PROCESSID
      );
      if (validation.length > 0) {
        this.openAlert('저장', '공정ID 값은 필수 입력값입니다.');
        return;
      }
      const validation2 = this.gridData.filter(
        x => x.rowStat !== 'N' && !x.PROCESSNAME
      );
      if (validation2.length > 0) {
        this.openAlert('저장', '공정명 값은 필수 입력값입니다.');
        return;
      }

      const dupChk = [];
      this.gridData.forEach(x => {
        if (x.rowStat !== 'N') {
          dupChk.push(x.PROCESSID);
        }
      });
      const dupArr = this.gridData.filter(
        x => x.rowStat === 'N' && dupChk.indexOf(x.PROCESSID) > -1
      );
      if (dupArr.length > 0) {
        this.openAlert('저장', '공정ID 값이 중복 되었습니다.');
        return;
      }
      this.saveBtn();
    },
    async saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

      if (saveData.length > 0) {
        const res = await this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnProcessDefinition',
          sendParam: saveData,
        });
        if (res?.returncode == '0') {
          this.openAlert('저장', '저장되었습니다.');
          this.getGridData();
        } else {
          this.openAlert('error', '오류가 발생했습니다.');
        }
      } else {
        this.openAlert('저장', '저장할 데이터가 존재하지 않습니다.');
      }
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetProcessList',
        sendParam: {
          processid: this.processid,
          classification: this.classification,
          processtype: this.processtype,
          processname: this.processname,
          plantid: 'LS',
        },
      }).then(res => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            //포장구분 콤보or인풋
            changeCellType: x.PROCESSTYPE === 'Packing' ? 'combo' : 'input',
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        this.gridData = data;
      });
    },
    //그리드 로우 클릭
    onRowClick(event) {
      //그리드 로우 클릭시 라인표시 유무 확인필요
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
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
      if (name === 'ACTIVESTATE') {
        e.value = e.value ? 'Active' : 'Inactive';
      }

      //PROCESSTYPE: "Packing"
      //PROCESSTYPE 공정구분 에따라
      //PACKINGFLAG	포장구분 변하는것 추가
      if (name === 'PROCESSTYPE') {
        if (e.value === 'Packing') {
          data[idx] = { ...data[idx], changeCellType: 'combo' };
        } else {
          data[idx] = { ...data[idx], changeCellType: 'input' };
        }
      }
      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === 'N') {
        data[idx].rowStat = 'U';
      }
      if (data[idx].rowStat === 'U' && !this.chkOriginalData(data, idx)) {
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
      if (data[idx].rowStat === 'U' && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = 'N';
      }
      this.gridData = data;
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter(x => {
        return data[idx][x] !== this.gridOriData[idx][x] && x !== 'rowStat';
      });
      return chkArr.length > 0;
    },

    //그리드 콤보박스 리스트가져오기
    // async getGridComboList() {
    //   this.mesGet({
    //     apiKey: 'mes/common/getqueryresult',
    //     queryId: 'GetEnumValue',
    //     sendParam: {
    //       plantid: 'LS',
    //       enumid: 'ProcessType',
    //     },
    //   }).then(data => {
    //     this.gridDropDownList[0].dataItem = data;
    //   });
    //   this.mesGet({
    //     apiKey: 'mes/common/getqueryresult',
    //     queryId: 'GetEnumValue',
    //     sendParam: {
    //       plantid: 'LS',
    //       enumid: 'DetailProcessType',
    //     },
    //   }).then(data => {
    //     this.gridDropDownList[1].dataItem = data;
    //   });
    //   this.mesGet({
    //     apiKey: 'mes/common/getqueryresult',
    //     queryId: 'GetEnumValue',
    //     sendParam: {
    //       plantid: 'LS',
    //       enumid: 'Classification',
    //     },
    //   }).then(data => {
    //     this.gridDropDownList[2].dataItem = data;
    //   });
    //   this.mesGet({
    //     apiKey: 'mes/common/getqueryresult',
    //     queryId: 'GetEnumValue',
    //     sendParam: {
    //       plantid: 'LS',
    //       enumid: 'PackingFlag',
    //     },
    //   }).then(data => {
    //     this.changeCell[0].dataItem = data;
    //   });
    // },
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = JSON.parse(JSON.stringify(this.gridOriData));
      this.$nuxt.$emit('iccReset');
    },
    //추가 버튼 클릭
    addBtn() {
      this.$refs.rowGrid.skip = 0;
      const newRowUUid = Math.round(Math.random() * 1000000000).toString();
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: 'LS',
        rowStat: 'C',
        _ROWSTATUS: 'C',
        newRowUUid: newRowUUid,
        idx: this.gridData.length,
        PROCESSID: '',
        PACKINGFLAG: '',
        AVAILABLEEQUIPMENTBUTTON: '',
        PROCESSTYPE: 'Process',
        DESCRIPTION: '',
        DETAILPROCESSTYPE: 'Normal',
        BASICPROCESSIDBUTTON: '',
        BASICPROCESSID: '',
        PROCESSNAME: '',
        CLASSIFICATION: '',
        ACTIVESTATE: 'Active',
        changeCellType: 'input',
      };
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },
    delConfirm() {
      const chk = [];
      this.newRowChk = [];
      let message;
      this.gridData.forEach(e => {
        if (e.selected) {
          if (e.PROCESSID != '') {
            chk.push(e.PROCESSID);
          } else {
            this.newRowChk.push(e.idx);
          }
        }
      });

      if (chk.length == 0 && this.newRowChk.length == 0) {
        // 체크한 행 없을 때
        this.$refs.alertPop.title = '삭제';
        this.$refs.alertPop.message =
          '선택한 데이터가 없습니다. 삭제할 데이터를 선택해 주시기 바랍니다.';
        this.$refs.alertPop.visibleDialog = true;
      } else {
        if (chk.length != 0) {
          // 기존 행 삭제시에만 ID 값 Set
          message = `(${chk.join()})`;
        } else {
          message = '';
        }
        this.$refs.ConfirmPop.title = '삭제';
        this.$refs.ConfirmPop.message =
          '선택한 데이터' + message + '를 삭제 하시겠습니까?';
        this.$refs.ConfirmPop.modalWidth = '330px';
        this.$refs.ConfirmPop.visibleDialog = true;
        this.$refs.ConfirmPop.callBack = this.delBtn;
      }
    },
    //삭제버튼
    delBtn() {
      let data = JSON.parse(JSON.stringify(this.gridData));
      data = data.filter((data, index, source) => {
        // 새로운 행은 Grid 에서 바로 삭제 처리
        return this.newRowChk.indexOf(data.idx) < 0;
      });
      this.gridData = data
        .map(x => {
          if (x.selected) {
            return {
              ...x,
              rowStat: 'D',
            };
          }
          return x;
        })
        .filter(x => !!x);
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    comboChange(nm, val) {
      this[nm] = val;
    },
    chkVal(nm, val) {
      this[nm] = val ? 'Yes' : '';
    },
    openAlert(title, message, visiable = true, width = '350px') {
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(this.gridData, e, undefined, ['ACTIVESTATE']);
    },
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
