<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>Durable기준정보</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>기준 Durable ID</label>
                    <InputText
                      ref="standarddurableid"
                      :dataNm="'standarddurableid'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <kbutton
                  :theme-color="'primary'"
                  :size="'medium'"
                  :icon="'search'"
                  @click="searchBtn"
                  >조회</kbutton
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
              <v-col cols="6" align="left">
                <CardTitle>Durable 기준정보</CardTitle>
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
                  >추가</kbutton
                >
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
                  >UNDO</kbutton
                >
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
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
                :checkHeaderArr="headerParam.checkBox"
                :isPaging="true"
                :reSetPage="this.reSetPage"
                @selectionchange="onSelectionchange"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @headerselectionchange="onHeaderSelectionChange"
                @sortChangeHandler="sortChangeHandler"
                @gridrowclick="onRowClick"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '@/components/common/input/InputText';
import MesSelectBox from '@/components/common/select/MesSelectBox';

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
    InputText,
    MesSelectBox,
    Utility,
    Card,
    kbutton: Button,
    CardBody,
    CardTitle,
    KendoGrid,
  },
  data() {
    return {
      standarddurableid: '', // 기준 Durable ID 검색
      treeData: [],
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      // gridDropDownList: [
      //   {
      //     dataVal: 'DURABLETYPE',
      //     dataItem: [],
      //   },
      // ],
      selectedField: 'selected',
      // checkHeaderArr: ['ACTIVESTATE'],
      headerParam: {
        gridid: 'dgvDurableDefinition', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        enumComboBox: [],
        checkBox: [],
      },
      gridHeader: [],
      reSetPage: false,
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';

    // await this.getGridComboList();
    this.getGridData();
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
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData = this.gridData.map(item => {
        return {
          ...item,
          selected: item.idx === selectedIdx ? !item.selected : item.selected,
        };
      });
      this.selected = event.dataItem;
    },
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    // 조회
    searchBtn() {
      this.reSetPage = true;
      this.getGridData();
    },
    // 저장
    saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
          };
        });

      const validate = this.mesValidation(this.gridHeader, this.gridData);
      if (!validate.isValidate) {
        this.$refs.alertPop.show('알림', validate.msg);
        return;
      }

      if (saveData.find(x => x.CAPACITY === '')) {
        this.$refs.alertPop.show(
          '알림',
          saveData.find(x => x.STANDARDDURABLEID).STANDARDDURABLEID +
            '의 용량을 입력해주세요'
        );
        return;
      }

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnDurableDefinition',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            this.getGridData();
            if (result.returncode !== undefined && result.returncode === '0') {
              this.$refs.alertPop.show('알림', '저장되었습니다');
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
    //그리드 데이터 가져오기
    async getGridData() {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetDurableDefinitionList',
        sendParam: {
          plantid: 'LS',
          standarddurableid: this.standarddurableid,
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
            resizable: true,
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        this.gridData = data;
      });
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
    // chkOriginalData(gridData, idx) {
    //   const data = JSON.parse(JSON.stringify(gridData));
    //   const keys = Object.keys(data[idx]);
    //   const chkArr = keys.filter((x) => {
    //     return (
    //       this.parseNullOrUndefinedToBlank(data[idx][x]) !==
    //         this.parseNullOrUndefinedToBlank(this.gridOriData[idx][x]) &&
    //       x !== "selected" &&
    //       x !== "rowStat"
    //     );
    //   });
    //   return chkArr.length > 0;
    // },
    //그리드 콤보박스 리스트가져오기
    // async getGridComboList() {
    //   await this.mesGet({
    //     apiKey: 'mes/common/getqueryresult',
    //     queryId: 'GetEnumValue',
    //     sendParam: {
    //       plantid: 'LS',
    //       enumid: 'DurableType',
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
    //unbo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
    },
    //추가 버튼 클릭
    addBtn() {
      this.$refs.rowGrid.skip = 0;

      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: 'LS',
        rowStat: 'C',
        STANDARDDURABLEID: '',
        STANDARDDURABLENAME: '',
        ACTIVESTATE: 'Inactive',
        DURABLETYPE: '', // 구분
        EXPIRYTIME: '',
        USAGELIMIT: '',
        CAPACITY: '',
        DESCRIPTION: '',
        CREATEUSERID: '', // 생성자
        CREATETIME: '', // 생성일시
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
        if (delData.filter(x => x.rowStat !== 'C').length >= 1) {
          var selectedRow = {};
          selectedRow = delData
            .filter(x => x.rowStat !== 'C')
            .map(x => x.STANDARDDURABLEID);
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
      this.gridData = data
        .filter(x => !(x.selected && x.rowStat === 'C'))
        .map(x => {
          if (x.selected) {
            return {
              ...x,
              rowStat: 'D',
            };
          }
          return x;
        });
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
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData,
        e,
        ['EXPIRYTIME', 'USAGELIMIT', 'CAPACITY'],
        ['ACTIVESTATE']
      );
    },
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
