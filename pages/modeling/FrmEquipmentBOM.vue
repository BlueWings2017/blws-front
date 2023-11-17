<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>설비기준정보</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col cols="12" align="right">
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
                v-if="curTree"
                :treeData="treeData"
                :textField="'EQUIPMENTNAME'"
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
                <CardTitle>{{ gridTitle }}</CardTitle>
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
            <div ref="divWrapper" style="height: calc(100% - 33px)">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="headerParam.enumComboBox"
                :checkHeaderArr="headerParam.checkBox"
                :isPaging="true"
                :reSetPage="this.reSetPage"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @gridrowclick="onRowClick"
                @sortChangeHandler="sortChangeHandler"
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
//import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import KendoTree from '@/components/common/KendoTree';
import utils from '~/plugins/utils2';

let myTitle;
let myMenuId;

export default {
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
    Utility,
    Card,
    kbutton: Button,
    CardBody,
    CardTitle,
    KendoGrid,
    KendoTree,
  },
  data() {
    return {
      treeData: [],
      columns: [],
      gridHeight: '100px',
      gridData: [],
      gridOriData: [],
      gridLastModIdx: null,
      // gridDropDownList: [
      //   {
      //     dataVal: 'EQUIPMENTTYPE',
      //     dataItem: [],
      //   },
      //   {
      //     dataVal: 'EQUIPMENTDETAILTYPE',
      //     dataItem: [],
      //   },
      //   {
      //     dataVal: 'COMMUNICATIONSTATE',
      //     dataItem: [],
      //   },
      //   {
      //     dataVal: 'PMCYCLETYPE',
      //     dataItem: [],
      //   },
      // ],
      selectedField: 'selected',
      expand: {
        ids: [],
        idField: 'EQUIPMENTNAME',
      },
      // checkHeaderArr: ['ACTIVESTATE'],
      equipmentid: '',
      headerParam: {
        gridid: 'dgvEquipmentDefinition', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
        enumComboBox: [],
        checkBox: [],
      },
      treeActiveItem: {},
      reSetPage: false,
      gridTitle: '',
      menu: [],
      curTree: null,
    };
  },
  created() {},
  async mounted() {
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);

    await this.initTree();
    // await this.getGridComboList();
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
      // flag : false
      this.reSetPage = flag;
    },
    // 조회
    searchBtn() {
      this.curTree = null;
      this.reSetPage = true;
      this.initTree();
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

      const validate = this.mesValidation(
        this.headerParam.gridHeader,
        this.gridData
      );
      if (!validate.isValidate) {
        this.$refs.alertPop.show('알림', validate.msg);
        return;
      }

      if (saveData.length > 0) {
        const res = this.mesPost({
          apiKey: 'mes/common/manage',
          messagename: 'TxnEquipmentDefinition',
          sendParam: saveData,
        }).then(result => {
          this.$nextTick(() => {
            this.initTree();
            this.getGridData(this.equipmentid);
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
    //그리드 로우 클릭
    onRowClick(event) {
      this.row = { ...event.dataItem };
      this.gridData.forEach(
        item => (item.selected = item.idx === event.dataItem.idx)
      );
      this.selected = event.dataItem;
    },
    //그리드 데이터 가져오기
    async getGridData(treeId = '') {
      this.gridOriData = [];
      this.gridData = [];
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEquipmentDefinitionList',
        sendParam: {
          equipmentid: treeId,
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
            resizable: true,
          };
        });
        //GIRD input v-model초기화, chkbox초기화 위해 추가
        this.$nuxt.$emit('iccReset');
        this.gridOriData = data;
        if (data !== undefined && data.length > 0) {
          data[0][this.selectedField] = true;
        }
        this.gridData = data;
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
        !this.gfn_ChkOriginalData(
          this.headerParam.gridHeader,
          data,
          this.gridOriData,
          idx
        )
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
        !this.gfn_ChkOriginalData(
          this.headerParam.gridHeader,
          data,
          this.gridOriData,
          idx
        )
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
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEquipmentDefinitionList',
        sendParam: {
          SUPEREQUIPMENTID: '',
          plantid: 'LS',
        },
      });
      res.unshift({
        PLANTID: 'LS',
        EQUIPMENTID: 'LS',
        PARENTEQUIPMENTID: '',
        EQUIPMENTNAME: 'LS [LS]',
        EQUIPMENTTYPE: 'Site',
      });
      this.menu = res;
      const data = res.map(x => ({ ...x, expanded: true }));
      this.treeData = utils.makeTreeData(
        data,
        'EQUIPMENTID',
        'PARENTEQUIPMENTID'
      );

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
    isChanged() {
      const saveData = this.gridData.filter(x => x.rowStat !== 'N');
      return saveData.length > 0;
    },
    onchangeTree(event) {
      let eventData = event;
      if (!eventData) {
        eventData = { item: this.curTree };
      }

      if (eventData.item.PARENTEQUIPMENTID === '') {
        this.equipmentid = '';
        this.getGridData();
      } else {
        this.getGridData(eventData.item.EQUIPMENTID); // 데이터 없을경우 NullPointerException
        this.equipmentid = eventData.item.EQUIPMENTID;
        this.treeActiveItem = event.item;
      }
    },
    // 트리 클릭
    onItemClick(event) {
      this.treeActiveItem = event.item;
      this.curTree = {
        ...event.item,
      };

      if (this.isChanged()) {
        this.$refs['confirmPop'].title = '알림';
        this.$refs['confirmPop'].message =
          '저장이 안된 데이터가 존재합니다. 무시하시겠습니까?';
        this.$refs['confirmPop'].callBack = this.onchangeTree;
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        return;
      } else {
        this.onchangeTree(event);
      }
    },
    // 트리 클릭 시 그리드 타이틀
    setGridTitle() {
      let title = '';
      if (this.curTree.PARENTEQUIPMENTID === '') {
        title = '[' + this.curTree.EQUIPMENTID + '] 설비목록';
      } else {
        title =
          '[' +
          this.curTree.PARENTEQUIPMENTID +
          '] 설비목록 [' +
          this.curTree.EQUIPMENTID +
          '] ' +
          this.curTree.EQUIPMENTNAME;
      }

      this.gridTitle = title;
    },
    //그리드 콤보박스 리스트가져오기
    // async getGridComboList() {
    //   await this.mesGet({
    //     apiKey: 'mes/common/getqueryresult',
    //     queryId: 'GetEnumValue',
    //     sendParam: {
    //       plantid: 'LS',
    //       enumid: 'EquipmentType',
    //     },
    //   }).then(data => {
    //     const combo = data.map(x => {
    //       return {
    //         ENUMVALUE: x.ENUMVALUE,
    //         ENUMVALUENAME: x.ENUMVALUENAME,
    //       };
    //     });
    //     this.gridDropDownList[0].dataItem = combo;
    //   }),
    //     await this.mesGet({
    //       apiKey: 'mes/common/getqueryresult',
    //       queryId: 'GetEnumValue',
    //       sendParam: {
    //         plantid: 'LS',
    //         enumid: 'EquipmentDetailType',
    //       },
    //     }).then(data => {
    //       const combo = data.map(x => {
    //         return {
    //           ENUMVALUE: x.ENUMVALUE,
    //           ENUMVALUENAME: x.ENUMVALUENAME,
    //         };
    //       });
    //       this.gridDropDownList[1].dataItem = combo;
    //     }),
    //     await this.mesGet({
    //       apiKey: 'mes/common/getqueryresult',
    //       queryId: 'GetEnumValue',
    //       sendParam: {
    //         plantid: 'LS',
    //         enumid: 'CommunicationState',
    //       },
    //     }).then(data => {
    //       const combo = data.map(x => {
    //         return {
    //           ENUMVALUE: x.ENUMVALUE,
    //           ENUMVALUENAME: x.ENUMVALUENAME,
    //         };
    //       });
    //       this.gridDropDownList[2].dataItem = combo;
    //     }),
    //     await this.mesGet({
    //       apiKey: 'mes/common/getqueryresult',
    //       queryId: 'GetEnumValue',
    //       sendParam: {
    //         plantid: 'LS',
    //         enumid: 'PMCycleType',
    //       },
    //     }).then(data => {
    //       const combo = data.map(x => {
    //         return {
    //           ENUMVALUE: x.ENUMVALUE,
    //           ENUMVALUENAME: x.ENUMVALUENAME,
    //         };
    //       });
    //       this.gridDropDownList[3].dataItem = combo;
    //     });
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
        SUPEREQUIPMENTID: this.equipmentid || '', // 상위설비코드
        PARENTEQUIPMENTID: this.equipmentid || 'LS',
        EQUIPMENTID: '',
        EQUIPMENTNAME: '',
        EQUIPMENTTYPE: '', // 설비구분
        EQUIPMENTDETAILTYPE: '', //설비 상세구분
        COMMUNICATIONSTATE: '', //통신상태
        ACTIVESTATE: 'Inactive',
        PMCYCLEVALUE: '',
        PMCYCLETYPE: '', //PM주기구분
        MODELNUMBER: '',
        SERIALNUMBER: '',
        LASTMAINTENANCEUSERID: '',
        LASTMAINTENANCETIME: '',
        DESCRIPTION: '',
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
          selectedRow = delData.map(x => x.EQUIPMENTID);
          this.$refs[
            'confirmPop'
          ].message = `선택한 데이터 (${selectedRow}) 를 삭제 하시겠습니까?`;
        }
        this.$refs['confirmPop'].modalWidth = '300px';
        this.$refs['confirmPop'].visibleDialog = true;
        this.$refs['confirmPop'].callBack = this.delBtn;
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
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData,
        e,
        ['PMCYCLEVALUE'],
        ['ACTIVESTATE']
      );
    },
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
