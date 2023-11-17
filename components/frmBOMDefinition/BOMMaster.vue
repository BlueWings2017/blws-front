<template>
  <div :style="{ width: '100%', height: '100%' }">
    <v-row no-gutters>
      <v-col cols="6" align="left">
        <CardTitle>BOM 마스터</CardTitle>
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
          @click="bomMasterAddBtn"
          >추가</kbutton
        >
        <kbutton
          :theme-color="'secondary'"
          :size="'small'"
          :icon="'delete'"
          @click="bomMasterDelBtn"
          >삭제</kbutton
        >
        <kbutton
          :theme-color="'secondary'"
          :size="'small'"
          :icon="'undo'"
          @click="bomMasterUndoBtn"
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
        :gridDropDownList="gridDropDownList"
        :checkHeaderArr="checkHeaderArr"
        :changeCell="changeCell"
        :isPaging="true"
        :reSetPage="this.reSetPage"
        @selectionchange="onSelectionchange"
        @gridrowclick="onRowClick"
        @gridddchang="rowDdChange"
        @griditemchange="griditemchange"
        @gridButtonClick="bomMasterGridButtonClick"
        @headerselectionchange="onHeaderSelectionChange"
        @sortChangeHandler="sortChangeHandler"
      />
    </div>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <SelectProductModal
      ref="SelectProductModal"
      v-if="selectProductModalVisible"
      :visibleDialog="selectProductModalVisible"
      :gridData="selectProductData"
      title="제품조회"
      :inputVal="inputVal"
      @visibleDialog="val => (selectProductModalVisible = val)"
      @selectedRow="selectedRow"
    />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" />
    <BOMDetail ref="BOMDetail" v-show="false" />
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
import SelectProductModal from '@/components/frmBOMDefinition/SelectProductModal';
import utils from '~/plugins/utils2';
import BOMDetail from '@/components/frmBOMDefinition/BOMDetail.vue';

export default {
  name: 'BOMMaster',
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
    SelectProductModal,
    BOMDetail,
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
        gridid: 'dgvBomDefinition', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
      },
      inputVal: '',
      btnClickRow: {},
      defaultDescription: '',
      gridDropDownList: [
        {
          dataVal: 'BOMTYPE',
          dataItem: [],
        },
        {
          dataVal: 'CONDITIONTYPE',
          dataItem: [],
        },
        {
          dataVal: 'STANDARDUNIT',
          dataItem: [],
        },
      ],
      changeCell: [
        {
          cellName: 'PRODUCTIDBUTTON',
          upperCell: '',
          condition: false,
          dataItem: [],
        },
        { cellName: 'BOMID', upperCell: '', condition: false, dataItem: [] },
      ],
      selectProductModalVisible: false, // BOM마스터 검색버튼 팝업
      reSetPage: false,
    };
  },
  created() {},
  async mounted() {
    await this.getGridComboList();
  },
  computed: {
    ...mapState({
      gridData: state => state.modules.frmBOMD.dgvBomDefinition,
      dgvBomDetail: state => state.modules.frmBOMD.dgvBomDetail,
      selectedProduct: state => state.modules.frmBOMD.selectedProduct,
      treeData: state => state.modules.frmBOMD.treeData,
      bomOriMasterData: state => state.modules.frmBOMD.bomOriMasterData,
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
      setTreeDataAction: 'modules/frmBOMD/setTreeDataAction',
      setBomOriMasterDataAction: 'modules/frmBOMD/setBomOriMasterDataAction',
      setBomOriDetailDataAction: 'modules/frmBOMD/setBomOriDetailDataAction',
    }),
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    //그리드 버튼 클릭 (BOM마스터 - 추가 - 검색)
    bomMasterGridButtonClick(e, field, dataItem) {
      if (field === 'PRODUCTIDBUTTON') {
        this.selectProductData = this.gridData.filter(
          x => x.idx > dataItem.idx
        );
        this.btnClickRow = dataItem;
        this.inputVal = dataItem.PRODUCTNAME;
        this.selectProductModalVisible = true;
      }
    },
    //검색버튼 선택 (BOM마스터)
    selectedRow(row) {
      const data = this.gridData.map(x => {
        if (this.btnClickRow?.PRODUCTID === x.PRODUCTID) {
          return {
            ...x,
            PRODUCTID: row.PRODUCTID, // 제품코드
            PRODUCTNAME: row.PRODUCTNAME, // 제품명
            STANDARDVALUE: row.PRODUCTQUANTITY, // 기준생산량
            STANDARDUNIT: row.PRODUCTUNIT, // 기준단위
          };
        }
        return x;
      });
      this.setDgvBomDefinitionListAction(data);
    },
    saveBtn() {
      const saveData = this.gridData
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
            _ROWSTATUSIMAGE: 'System.Drawing.Bitmap',
          };
        });

      if (saveData.find(x => x.PRODUCTID === '')) {
        this.$refs.alertPop.show('알림', 'PRODUCTID값은 필수 입력 항목입니다.');
        return;
      }

      const saveDetailData = this.dgvBomDetail
        .filter(x => x.rowStat !== 'N')
        .map(x => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
            _ROWSTATUSIMAGE: 'System.Drawing.Bitmap',
            _CHK: '',
          };
        });

      const bomMasterValidate = this.mesValidation(
        this.gridHeader,
        this.gridData
      );
      if (!bomMasterValidate.isValidate) {
        this.$refs.alertPop.show('알림', bomMasterValidate.msg);
        return;
      }

      const bomDetailValidate = this.mesValidation(
        //this.$refs.BOMDetail.gridHeader,
        this.dgvBomDetail
      );
      if (!bomDetailValidate.isValidate) {
        this.$refs.alertPop.show('알림', bomDetailValidate.msg);
        return;
      }

      if (
        saveDetailData.find(
          x => x.CONSUMABLEID === '' || x.CONSUMABLEID === null
        )
      ) {
        this.$refs.alertPop.show('알림', '자재코드는 필수 입력 항목입니다.');
        return;
      }
      if (
        saveDetailData.find(
          x => x.CONSUMABLENAME === '' || x.CONSUMABLENAME === null
        )
      ) {
        this.$refs.alertPop.show('알림', '자재명은 필수 입력 항목입니다.');
        return;
      }
      if (
        saveDetailData.find(
          x => x.CONSUMABLEUNIT === '' || x.CONSUMABLEUNIT === null
        )
      ) {
        this.$refs.alertPop.show('알림', '투입단위는 필수 입력 항목입니다.');
        return;
      }

      if (saveDetailData.find(x => x.CONSUMABLEVALUE === '')) {
        const consuNameData = saveDetailData.find(x => x.CONSUMABLENAME);
        if (consuNameData === '' || consuNameData === undefined) {
          this.$refs.alertPop.show('알림', '()의 투입량을 입력해주세요.');
          return;
        } else {
          this.$refs.alertPop.show(
            '알림',
            consuNameData.CONSUMABLENAME +
              '(' +
              saveDetailData.find(x => x.CONSUMABLEID).CONSUMABLEID +
              ')의 투입량을 입력해주세요.'
          );
          return;
        }
      }

      const updateCnt = saveData.length + saveDetailData.length;
      if (updateCnt > 0) {
        if (saveData.length > 0) {
          const res = this.mesPost({
            apiKey: 'mes/common/manage',
            messagename: 'TxnBomDefinition',
            sendParam: saveData,
          }).then(result => {
            if (result.returncode === '0') {
              if (saveDetailData.length > 0) {
                const res = this.mesPost({
                  apiKey: 'mes/common/manage',
                  messagename: 'TxnBomDetail',
                  sendParam: saveDetailData,
                }).then(result => {
                  if (
                    result.returncode !== undefined &&
                    result.returncode === '0'
                  ) {
                    this.$emit('getBOMMasterGridData', '');
                    this.$emit('getBOMDetailGridData', '');
                    this.$refs.alertPop.show('알림', '저장되었습니다');
                    // this.getBOMMasterGridData();

                    // this.getBOMDetailGridData();
                  } else {
                    this.$refs.alertPop.show(
                      'ERROR : ' + result.code,
                      result.message
                    );
                  }
                });
              } else {
                this.$emit('getBOMMasterGridData', '');
                this.$emit('getBOMDetailGridData', '');
                this.$refs.alertPop.show('알림', '저장되었습니다.');
                // this.getBOMMasterGridData();

                // this.getBOMDetailGridData();
              }
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                result.message
              );
            }
          });
        } else {
          if (saveDetailData.length > 0) {
            const res = this.mesPost({
              apiKey: 'mes/common/manage',
              messagename: 'TxnBomDetail',
              sendParam: saveDetailData,
            }).then(result => {
              this.$nextTick(() => {
                if (
                  result.returncode !== undefined &&
                  result.returncode === '0'
                ) {
                  this.$refs.alertPop.show('알림', '저장되었습니다');
                  // this.getBOMMasterGridData();
                  this.$emit('getBOMMasterGridData');

                  // this.getBOMDetailGridData();
                  this.$emit('getBOMDetailGridData');
                } else {
                  this.$refs.alertPop.show(
                    'ERROR : ' + result.code,
                    result.message
                  );
                }
              });
            });
          }
        }
      } else {
        this.$refs.alertPop.show('알림', '저장할 데이터가 존재하지 않습니다.');
        return;
      }
    },
    //추가 버튼 클릭
    bomMasterAddBtn(row) {
      this.$refs.rowGrid.skip = 0;
      const newRowUUid = Math.round(Math.random() * 1000000000).toString();
      const dataItem = {
        inEdit: true,
        newRow: true,
        selected: false,
        PLANTID: 'LS',
        rowStat: 'C',
        newRowUUid: newRowUUid,
        idx: this.gridData.length,
        PRODUCTID: '', // 제품코드
        PRODUCTNAME: '', // 제품명
        changeCellType: 'button', // 검색 버튼 나오도록
        PRODUCTIDBUTTON: '검색', // 검색
        ACTIVESTATE: 'Inactive', // 사용상태
        BOMID: '', // BOM ID
        BOMVERSION: '00001', // VERSION
        BOMTYPE: '', // BOM타입
        CONDITIONTYPE: '', // 조건구분
        CONDITIONID: 'None', // 조건값
        STANDARDVALUE: '', // 기준생산량
        STANDARDUNIT: '', // 기준단위
        DESCRIPTION: '', // 비고
        CREATEUSERID: '',
        CREATETIME: '',
      };
      this.gridData.splice(0, 0, dataItem);
      const addEvent = { dataItem: dataItem };
      this.onRowClick(addEvent);
      this.$nuxt.$emit('iccReset');
    },
    //삭제버튼
    bomMasterDelBtn() {
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
            .map(x => x.PRODUCTID);
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
      this.setDgvBomDefinitionListAction(
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
      this.setSelectedProductAction({});
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
          this.gridHeader,
          data,
          this.bomOriMasterData,
          idx
        )
      ) {
        data[idx].rowStat = 'N';
      }

      this.setDgvBomDefinitionListAction(data);
      this.setSelectedProductAction(data);
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
          this.bomOriMasterData,
          idx
        )
      ) {
        data[idx].rowStat = 'N';
      }
      this.setDgvBomDefinitionListAction(data);
    },
    //데이터 원상복구시 "수정" 항목 제거
    // chkOriginalData(gridData, idx) {
    //   const data = JSON.parse(JSON.stringify(gridData));
    //   const keys = Object.keys(data[idx]);
    //   const chkArr = keys.filter((x) => {
    //     return (
    //       this.parseNullOrUndefinedToBlank(data[idx][x]) !==
    //         this.parseNullOrUndefinedToBlank(this.bomOriMasterData[idx][x]) &&
    //       x !== "selected" &&
    //       x !== "rowStat"
    //     );
    //   });
    //   return chkArr.length > 0;
    // },
    //undo 버튼 클릭
    bomMasterUndoBtn() {
      const data = JSON.parse(JSON.stringify(this.bomOriMasterData));
      this.setDgvBomDefinitionListAction(data);
      this.setSelectedProductAction({});
      this.$nuxt.$emit('iccReset');
    },
    //그리드 로우 클릭
    onRowClick(event) {
      const gridData = this.gridData.map(item => {
        if (item === event.dataItem) {
          return { ...item, selected: true };
        } else {
          return { ...item, selected: false };
        }
      });
      this.setDgvBomDefinitionListAction(gridData);
      if (event.dataItem.newRow) {
        this.setDgvBomDetailListAction([]);
        this.setTreeDataAction([]);
      } else {
        this.$emit('getBOMDetailGridData');
        // this.getBOMDetailGridData();
      }
      this.setSelectedProductAction(event.dataItem);
      // this.$nuxt.$emit('iccReset');
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      const data = JSON.parse(JSON.stringify(this.gridData));
      this.setDgvBomDefinitionListAction(
        data.map(item => {
          return { ...item, selected: checked };
        })
      );
    },
    //그리드 콤보박스 리스트가져오기
    async getGridComboList() {
      await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetEnumValue',
        sendParam: {
          plantid: 'LS',
          enumid: 'BomType',
        },
      }).then(data => {
        const combo = data.map(x => {
          return {
            ENUMVALUE: x.ENUMVALUE,
            ENUMVALUENAME: x.ENUMVALUENAME,
          };
        });
        this.gridDropDownList[0].dataItem = combo;
      }),
        await this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetEnumValue',
          sendParam: {
            plantid: 'LS',
            enumid: 'ConditionType',
          },
        }).then(data => {
          const combo = data.map(x => {
            return {
              ENUMVALUE: x.ENUMVALUE,
              ENUMVALUENAME: x.ENUMVALUENAME,
            };
          });
          this.gridDropDownList[1].dataItem = combo;
        }),
        await this.mesGet({
          apiKey: 'mes/common/getqueryresult',
          queryId: 'GetEnumValue',
          sendParam: {
            plantid: 'LS',
            enumid: 'ProductUnit',
          },
        }).then(data => {
          const combo = data.map(x => {
            return {
              ENUMVALUE: x.ENUMVALUE,
              ENUMVALUENAME: x.ENUMVALUENAME,
            };
          });
          this.gridDropDownList[2].dataItem = combo;
        });
    },
    // async getBOMMasterGridData(treeId = '') {
    //   this.setDgvBomDefinitionListAction([]);
    //   this.setDgvBomDetailListAction([]);
    //   await this.mesGet({
    //     apiKey: 'mes/common/getqueryresult',
    //     queryId: 'GetBomDefinition',
    //     sendParam: {
    //       parentareaid: treeId,
    //       plantid: 'LS',
    //       productid: this.productid,
    //       productName: this.productName,
    //       bomid: this.bomid,
    //     },
    //   }).then(res => {
    //     this.BOMMasterData = res.map((x, idx) => {
    //       return {
    //         ...x,
    //         rowStat: 'N',
    //         selected: false,
    //         idx: idx,
    //         inEdit: true,
    //         resizable: true,
    //         PRODUCTIDBUTTON: '',
    //       };
    //     });

    //     if (this.BOMMasterData !== undefined && this.BOMMasterData.length > 0) {
    //       this.setSelectedProductAction(this.BOMMasterData[0]);
    //       this.getBOMDetailGridData();
    //     }

    //     this.setDgvBomDefinitionListAction(this.BOMMasterData);
    //     this.setBomOriMasterDataAction(
    //       JSON.parse(JSON.stringify(this.BOMMasterData))
    //     );

    //     this.initGrid();
    //   });
    // },
    // async getBOMDetailGridData(treeId = '') {
    //   if (this.selectedProduct !== undefined && this.selectedProduct !== {}) {
    //     this.mesGet({
    //       apiKey: 'mes/common/getqueryresult',
    //       queryId: 'GetBomDetail',
    //       sendParam: {
    //         parentareaid: treeId,
    //         plantid: 'LS',
    //       },
    //       queryVersion: '00002',
    //     }).then(res => {
    //       const BOMDetailData = res
    //         .filter(
    //           x =>
    //             x.PRODUCTID === this.selectedProduct.PRODUCTID &&
    //             x.BOMID === this.selectedProduct.BOMID &&
    //             x.BOMVERSION === this.selectedProduct.BOMVERSION
    //         )
    //         .map((x, idx) => {
    //           return {
    //             ...x,
    //             rowStat: 'N',
    //             selected: false,
    //             idx: idx,
    //             inEdit: true,
    //             resizable: true,
    //             CONSUMABLEIDBUTTON: '검색', //BOM상세
    //           };
    //         });
    //       this.setDgvBomDetailListAction(BOMDetailData);
    //       this.setBomOriDetailDataAction(
    //         JSON.parse(JSON.stringify(BOMDetailData))
    //       );

    //       const md = this.gridData
    //         .filter(
    //           x =>
    //             x.PRODUCTID === this.selectedProduct.PRODUCTID &&
    //             x.BOMID === this.selectedProduct.BOMID &&
    //             x.BOMVERSION === this.selectedProduct.BOMVERSION
    //         )
    //         .map(x => ({
    //           ...x,
    //           id: x.BOMID,
    //           label: x.PRODUCTNAME + '(' + x.PRODUCTID + ')',
    //           icon: x.PRODUCTIONTYPE,
    //         }));
    //       const dd = BOMDetailData.map(x => ({
    //         ...x,
    //         id: x.BOMID + '|' + x.CONSUMABLEID,
    //         parentId: x.BOMID,
    //         label:
    //           x.CONSUMABLENAME +
    //           '(' +
    //           x.CONSUMABLEID +
    //           ') ( 투입량 : ' +
    //           x.CONSUMABLEVALUE +
    //           x.CONSUMABLEUNIT +
    //           ' )',
    //         icon:
    //           this.gridData.find(m => m.PRODUCTID === x.CONSUMABLEID) ===
    //           undefined
    //             ? 'MATERIAL'
    //             : 'Half-Product',
    //       }));
    //       this.setTreeDataAction([...md, ...dd]);
    //     });
    //   }
    // },
    initGrid() {
      this.$nuxt.$emit('iccReset');
    },
    sortChangeHandler(e) {
      this.gfn_sortChangeHandler(
        this.gridData,
        e,
        ['STANDARDVALUE'],
        ['ACTIVESTATE']
      );
    },
  },
  watch: {},
};

const defaultData = {};
</script>
<style lang="scss"></style>
