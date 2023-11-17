<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>시스템유지</li>
      <li>EnumValue</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row ref="searchFilter" no-gutters>
              <v-col cols="12" align="right">
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
      <v-col
        :sm="3"
        :lg="2"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoTree
                v-if="curTree"
                :treeData="treeData"
                :textField="'DISPLAYMEMBER'"
                :activeItem="treeActiveItem"
                @onExpandChange="onExpandChange"
                @onItemClick="onItemClick"
              >
              </KendoTree>
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col
        :sm="9"
        :lg="10"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <v-row no-gutters>
              <v-col :sm="8" :lg="8" align="left">
                <CardTitle>{{ gridTitle }}</CardTitle>
              </v-col>
              <v-col :sm="4" :lg="4" align="right">
                <Button
                  :theme-color="'primary'"
                  :size="'small'"
                  icon="save"
                  @click="saveBtn"
                  :disabled="!isEditBtnActive"
                  >{{ $t('CommLang.btn.saveBtn') }}</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'add'"
                  @click="addBtn"
                  :disabled="!isEditBtnActive"
                  >{{ $t('CommLang.btn.addBtn') }}</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  icon="delete"
                  @click="confirmDel"
                  :disabled="!isEditBtnActive"
                  >{{ $t('CommLang.btn.removeBtn') }}</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  icon="undo"
                  @click="undoBtn"
                  :disabled="!isEditBtnActive"
                  >undo</Button
                >
              </v-col>
            </v-row>
            <div
              ref="divWrapper"
              style="height: calc(100% - 33px)"
              v-if="headerParam.gridid"
            >
              <KendoGrid
                :isPaging="true"
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :checkHeaderArr="checkHeaderArr"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @notPageReset="notPageReset"
                @sortChangeHandler="sortChangeHandler"
                :reSetPage="this.reSetPage"
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
import { TreeView } from '@progress/kendo-vue-treeview';
import { Button } from '@progress/kendo-vue-buttons';
import utils2 from '~/plugins/utils2';
import KendoTree from '@/components/common/KendoTree';

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
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    TreeView,
    KendoGrid,
    KendoTree,
  },
  data() {
    return {
      treeData: [],
      level: 'PLANT',
      gridHeight: '',
      noFirstCheck: true,
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      checkHeaderArr: ['DEFAULTFLAG', 'CONSTANTFLAG'],
      selectedField: 'selected',
      menu: [],
      curTree: null,
      curRow: {},
      expand: {
        ids: [],
        idField: 'DISPLAYMEMBER',
      },
      headerParam: {
        gridid: 'dgvEnumGroupDefinition',
        rowStat: '',
      },
      queryId: 'GetEnumGroupDefinition',
      params: { plantid: 'LS' },
      gridHeader: [],
      gridTitle: '',
      selected: null,
      isEditBtnActive: false,
      treeActiveItem: {},
      navi: null,
      reSetPage: false,
    };
  },
  created() {},
  computed: {},
  async mounted() {
    await this.initTree();
    await this.getGridData();
    this.isEditBtnActive = true;
  },

  watch: {
    curTree: {
      handler() {
        if (this.curTree) this.setGridTitle();
      },
      deep: true,
    },
  },

  methods: {
    notPageReset(flag) {
      this.reSetPage = flag;
    },

    async searchBtn() {
      this.curTree = null;
      this.reSetPage = true;
      this.headerParam = {
        gridid: 'dgvEnumGroupDefinition',
        rowStat: '',
      };
      this.queryId = 'GetEnumGroupDefinition';
      this.params = { plantid: 'LS' };
      this.getHeader();
      await this.initTree();
      await this.getGridData();
      this.isEditBtnActive = true;
    },

    saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => ({ ...x, _ROWSTATUS: x.rowStat, PLANTID: 'LS' }));

      if (saveData.length === 0) {
        this.$refs['alertPop'].show('', '저장할 데이터가 존재하지 않습니다.');
        return;
      }
      const validate = this.mesValidation(this.gridHeader, this.gridData);
      if (!validate.isValidate) {
        this.$refs['alertPop'].show('', validate.msg);
        return;
      }

      const messagename = {
        PLANT: 'TxnEnumGroupDefinition',
        ENUMGROUP: 'TxnEnumDefinition',
        ENUMID: 'TxnEnumValue',
      }[this.curTree.LEVELMEMBER];

      const params = {
        apiKey: 'mes/common/manage',
        messagename,
        sendParam: saveData,
      };

      this.mesPost(params).then(res => {
        if (res.returncode !== undefined && res.returncode === '0') {
          this.$refs.alertPop.show('알림', '저장되었습니다.');
        } else {
          this.$refs.alertPop.show(`ERROR : ${res.code}`, res.message);
        }

        this.initTree();
        this.getGridData();
      });
    },
    setGridTitle() {
      let title = this.curTree.DISPLAYMEMBER;
      if (this.curTree.PARENTMEMBER) {
        const parent = this.menu.find(
          i => i.VALUEMEMBER === this.curTree.PARENTMEMBER
        );
        title = `${parent ? parent.DISPLAYMEMBER + ' → ' : ''}${title}`;
        if (parent?.PARENTMEMBER) {
          const grandparent = this.menu.find(
            i => i.VALUEMEMBER === parent.PARENTMEMBER
          );
          title = `${
            grandparent ? grandparent.DISPLAYMEMBER + ' → ' : ''
          }${title}`;
        }
      }
      this.gridTitle = title;
    },
    async getGridData() {
      try {
        const res = await this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: this.queryId,
          sendParam: this.params,
        });

        const data = res.map((x, idx) => ({
          ...x,
          rowStat: 'N',
          selected: idx === 0,
          idx: idx,
          inEdit: true,
          newRow: false,
        }));
        this.$nuxt.$emit('iccReset');
        this.gridData = data;
        this.gridOriData = JSON.parse(JSON.stringify(data));
        this.selected = data[0];
      } catch (error) {
        console.log(error);
      }
    },
    //그리드 로우 클릭
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData.forEach(item => {
        item.selected = item.idx === selectedIdx;
      });
      this.selected = event.dataItem;
    },

    changeSelected(dataItem) {
      this.gridData.forEach(item => {
        item.selected = item.idx === dataItem.idx;
      });
      this.selected = dataItem;
    },

    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if (name === 'CONSTANTFLAG') {
        e.value = e.value ? 'Yes' : null;
      }

      if (name === 'DEFAULTFLAG') {
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

    //트리 데이터 가져오기
    async initTree() {
      const res = await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumValueTree',
        sendParam: {
          plantid: 'LS',
        },
      });
      this.menu = res;
      const data = res.map(x => ({ ...x, expanded: true }));

      this.treeData = utils2.makeTreeData(data, 'VALUEMEMBER', 'PARENTMEMBER');

      if (!this.curTree) {
        this.curTree = {
          ...this.treeData[0],
        };
      }
    },

    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },

    onchangeTree() {
      this.getHeader();
      this.getGridData();
    },
    //트리 클릭
    onItemClick(event) {
      const { LEVELMEMBER, VALUEMEMBER } = event.item;
      this.treeActiveItem = event.item;
      this.curTree = {
        ...event.item,
      };

      let gridid;
      this.params = { plantid: 'LS' };

      if (LEVELMEMBER === 'PLANT') {
        gridid = 'dgvEnumGroupDefinition';
        this.queryId = 'GetEnumGroupDefinition';
      } else if (LEVELMEMBER === 'ENUMGROUP') {
        gridid = 'dgvEnumDefinition';
        this.queryId = 'GetEnumDefinition';
        this.params.enumgroupid = VALUEMEMBER;
      } else {
        gridid = 'dgvEnumValue';
        this.queryId = 'GetEnumValue';
        this.params.enumid = VALUEMEMBER;
      }

      this.headerParam = { gridid, rowStat: '' };

      if (this.isChanged()) {
        this.$refs['confirmPop'].title = '알림';
        this.$refs['confirmPop'].message =
          '저장이 안된 데이터가 존재합니다. 무시하시겠습니까?';
        this.$refs['confirmPop'].callBack = this.onchangeTree;
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        return;
      }

      this.onchangeTree();
    },

    isChanged() {
      const saveData = this.gridData.filter(x => x.rowStat !== 'N');
      return saveData.length > 0;
    },

    // undo 버튼 클릭
    undoBtn() {
      this.gridData = this.gridOriData.filter(x => x.newRow !== true);
      this.$nuxt.$emit('iccReset');
      this.changeSelected(this.gridData[0]);
    },

    //추가 버튼 클릭
    addBtn() {
      this.$refs.rowGrid.skip = 0;
      const newRowUUid = Math.round(Math.random() * 1000000000).toString();
      const dataItem = {
        newRowUUid,
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: 'LS',
        rowStat: 'C',
        idx: this.gridData.length,
        ENGLISH: '',
        KOREAN: '',
        NATIVE1: '',
        NATIVE2: '',
        POSITION: '',
      };
      if (this.curTree.LEVELMEMBER === 'PLANT') {
        dataItem.ENUMGROUPID = '';
        dataItem.ENUMGROUPNAME = '';
      } else if (this.curTree.LEVELMEMBER === 'ENUMGROUP') {
        dataItem.ACCESSTYPE = '';
        dataItem.CONSTANTFLAG = null;
        dataItem.ENUMGROUP = this.curTree.id;
        dataItem.ENUMID = '';
        dataItem.ENUMNAME = '';
      } else {
        dataItem.DEFAULTFLAG = 'No';
        dataItem.ENUMID = this.curTree.id;
        dataItem.ENUMVALUE = '';
        dataItem.ENUMVALUENAME = '';
      }
      this.gridData.splice(0, 0, dataItem);
      this.changeSelected(dataItem);
      this.$nuxt.$emit('iccReset');
    },
    confirmDel() {
      const { ENUMGROUPID, ENUMVALUE, ENUMID } = this.selected;
      const level = this.curTree.LEVELMEMBER;

      let message;
      if (level === 'PLANT') message = ENUMGROUPID;
      if (level === 'ENUMGROUP') message = ENUMID;
      if (level === 'ENUMID') message = ENUMVALUE;

      this.$refs['confirmPop'].message = `선택한 데이터${
        message ? `(${message})` : ''
      }를 삭제 하시겠습니까?`;
      this.$refs['confirmPop'].callBack = this.delBtn;
      this.$refs['confirmPop'].modalWidth = '300px';
      this.$refs['confirmPop'].visibleDialog = true;
    },

    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData));
      let deletedIdx;
      data.forEach((x, idex) => {
        if (x.selected) {
          deletedIdx = idex;
        }
      });

      if (this.selected.rowStat === 'C') {
        this.gridData = data.filter(x => !(x.selected && x.rowStat === 'C'));
        this.changeSelected(this.gridData[deletedIdx]);
      } else {
        this.gridData = data.map(x => {
          if (x.selected) {
            return {
              ...x,
              rowStat: 'D',
            };
          }
          return x;
        });
      }
    },
    // sortChangeHandler(e) {
    //   const isAscending = e.sort[0]?.dir == 'asc';
    //   if (isAscending) {
    //     this.gridData = this.gridData.sort((a, b) =>
    //       a[e.event?.field] < b[e.event?.field]
    //         ? -1
    //         : a[e.event?.field] > b[e.event?.field]
    //         ? 1
    //         : 0
    //     );
    //   } else {
    //     this.gridData = this.gridData.sort((a, b) =>
    //       a[e.event?.field] > b[e.event?.field]
    //         ? -1
    //         : a[e.event?.field] < b[e.event?.field]
    //         ? 1
    //         : 0
    //     );
    //   }
    // },
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData,
        e,
        ['POSITION'],
        ['DEFAULTFLAG', 'CONSTANTFLAG']
      );
    },
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
