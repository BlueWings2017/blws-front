<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>공장기본설정</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col cols="12" align="right">
                <Button
                  :theme-color="'primary'"
                  icon="search"
                  @click="searchBtn"
                  >조회</Button
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
          <CardBody :style="{ height: '100%' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoTree
                :treeData="treeData"
                :textField="'AREANAME'"
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
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="6" align="left">
                <CardTitle>&nbsp;</CardTitle>
              </v-col>
              <v-col cols="6" align="right">
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
                  :icon="'add'"
                  @click="addBtn"
                  >추가</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'delete'"
                  @click="delConfirm"
                  >삭제</Button
                >
                <Button
                  :theme-color="'secondary'"
                  :size="'small'"
                  :icon="'undo'"
                  @click="undoBtn"
                  >UNDO</Button
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
                :isPaging="true"
                :selected-field="selectedField"
                :gridDropDownList="headerParam.enumComboBox"
                :checkHeaderArr="headerParam.checkBox"
                @selectionchange="onSelectionchange"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @sortChangeHandler="sortChangeHandler"
                @headerselectionchange="onHeaderSelectionChange"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop ref="ConfirmPop" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import KendoTree from '@/components/common/KendoTree';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import utils from '~/plugins/utils';

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
    KendoTree,
    KendoGrid,
  },
  data() {
    return {
      treeData: [],
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'AREANAME',
      },
      parentAreaId: '',
      headerParam: {
        gridid: 'dgvPlantModeling', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        enumComboBox: [],
        checkBox: [],
      },
      gridHeader: [],
      treeActiveItem: {},
    };
  },

  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    await this.initTree();
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
  methods: {
    searchBtn() {
      this.initTree();
      this.getGridData();
    },
    saveValidation() {
      const validation = this.gridData.filter(
        x => x.rowStat !== 'N' && !x.AREAID
      );
      if (validation.length > 0) {
        this.openAlert('저장', 'AREAID값은 필수 입력값입니다.');
        return;
      }

      const dupChk = [];
      this.gridData.forEach(x => {
        if (x.rowStat !== 'N') {
          dupChk.push(x.AREAID);
        }
      });
      const dupArr = this.gridData.filter(
        x => x.rowStat === 'N' && dupChk.indexOf(x.AREAID) > -1
      );
      if (dupArr.length > 0) {
        this.openAlert('저장', 'AREAID값이 중복 되었습니다.');
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
          messagename: 'TxnArea',
          sendParam: saveData,
        });

        if (res?.returncode == '0') {
          this.openAlert('저장', '저장되었습니다.');
          this.initTree();
          this.getGridData(this.parentAreaId);
        } else {
          this.openAlert('error', '오류가 발생했습니다.');
        }
      } else {
        this.openAlert('저장', '저장할 데이터가 존재하지 않습니다.');
      }
    },
    //그리드 데이터 가져오기
    async getGridData(treeId = '') {
      this.mesGet({
        apiKey: 'mes/common/getqueryresultforreturn',
        queryId: 'GetAreaListDetail',
        sendParam: {
          parentareaid: treeId,
          plantid: 'LS',
        },
      }).then(res => {
        if (res.returncode != '0') {
             this.$refs.alertPop.show(
                'ERROR : ' + res.returncode,
                res.returnmessage);
        }
        else { 
        const data = res.body.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
          };
        });
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        this.gridData = data;
        // this.$refs.rowGrid.sortField = [{ field: 'PLANTID', dir: 'asc' }]
      }});
    },
    //그리드 로우 클릭
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
      // console.log("===rowDdChange===",e)
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      if (name === 'GOINORDERREQUIRED') {
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
      if (e.field === 'POSITION') {
        e.value = e.value.replace(/[^0-9]/gi, '');
      }
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

    //트리 데이터 가져오기
    async initTree() {
      const res = await this.mesGet({
        apiKey: 'mes/common/getqueryresultforreturn',
        queryId: 'GetAreaList',
        sendParam: {
          SUPERAREAID: '',
          plantid: 'LS',
        },
      });

      const data = res.body
        .map(x => ({ ...x, expanded: true }))
        .sort((a, b) => (a.POSITION || '').localeCompare(b.POSITION || ''));

      this.treeData = utils.makeTreeData(data);
    },
    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },
    //트리 클릭
    onItemClick(event) {
      this.getGridData(event.item.AREAID); // 데이터 없을경우 NullPointerException
      this.parentAreaId = event.item.AREAID;
      this.treeActiveItem = event.item;
    },
    // //그리드 콤보박스 리스트가져오기
    // async getGridComboList() {
    //   await this.mesGet({
    //     apiKey: 'mes/common/getqueryresult',
    //     queryId: 'GetEnumValue',
    //     sendParam: {
    //       plantid: 'LS',
    //       enumid: 'AreaType',
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
      const newRowUUid = Math.round(Math.random() * 1000000000).toString();
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: 'LS',
        rowStat: 'C',
        PARENTAREAID: this.parentAreaId ? this.parentAreaId : null,
        _ROWSTATUS: 'C',
        newRowUUid: newRowUUid,
        KOREAN: '',
        DESCRIPTION: '',
        NATIVE2: '',
        GOINORDERREQUIRED: 'Yes',
        NATIVE1: '',
        ENGLISH: '',
        AREANAME: '',
        AREATYPE: '',
        AREAID: '',
        SUPERAREAID: this.parentAreaId || 'LS',
        POSITION: '',
        idx: this.gridData.length,
      };
      this.gridData.splice(0, 0, dataItem);
      this.$nuxt.$emit('iccReset');
    },
    //삭제버튼
    delConfirm() {
      const chk = [];
      this.gridData.forEach(e => {
        if (e.selected) {
          chk.push(e.AREAID);
        }
      });

      this.$refs.ConfirmPop.title = '삭제';
      this.$refs.ConfirmPop.message = `선택한 데이터(${chk.join()})를 삭제 하시겠습니까?`;
      this.$refs.ConfirmPop.modalWidth = '330px';
      this.$refs.ConfirmPop.visibleDialog = true;
      this.$refs.ConfirmPop.callBack = this.delBtn;
    },
    delBtn() {
      const data = JSON.parse(JSON.stringify(this.gridData));

      this.gridData = data.filter(x => !(x.selected && x.rowStat === 'C'));
      this.gridData = this.gridData.map(x => {
        if (x.selected) {
          return {
            ...x,
            rowStat: 'D',
          };
        }
        return x;
      });
    },
    openAlert(title, message, visiable = true, width = '350px') {
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData,
        e,
        ['POSITION'],
        ['GOINORDERREQUIRED']
      );
    },
  },
};

const defaultData = {};
</script>
<style lang="scss">
.textRight {
  text-align: right;
}
.textLeft {
  text-align: left;
}
.textCenter {
  text-align: center;
}
</style>
