<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>BOM기준정보</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row class="search-box" align="center" no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>제품 ID</label>
                    <InputText
                      ref="productid"
                      :dataNm="'productid'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>제품명</label>
                    <InputText
                      ref="productName"
                      :dataNm="'productName'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>BOM ID</label>
                    <InputText
                      ref="bomid"
                      :dataNm="'bomid'"
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
      <v-col :sm="9" :lg="10" :style="{ height: '100%' }">
        <v-row :style="{ height: 'calc(50% - 5px)' }" no-gutters>
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <BOMMaster
                  ref="BOMMaster"
                  :gridHeight="gridHeight"
                  @getBOMMasterGridData="getBOMMasterGridData"
                  @getBOMDetailGridData="getBOMDetailGridData"
                />
              </CardBody>
            </Card>
          </v-col>
        </v-row>
        <v-row
          :style="{ margin: '10px 0 0 0', height: 'calc(50% - 5px)' }"
          no-gutters
        >
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <BOMDetail ref="BOMDetail" :gridHeight="gridHeight" />
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
      <v-col :sm="3" :lg="2" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoTree
                ref="treeView"
                :treeData="treeData"
                :textField="'label'"
                :icon="'icon'"
                @onExpandChange="onExpandChange"
                @onItemClick="onItemClick"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '@/components/common/input/InputText';
import BOMMaster from '@/components/frmBOMDefinition/BOMMaster.vue';
import BOMDetail from '@/components/frmBOMDefinition/BOMDetail.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
// import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
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
    InputText,
    BOMMaster,
    BOMDetail,
    //TreeView,
    KendoTree,
  },
  data() {
    return {
      gridHeight: '250px',
      treeActiveItem: {},
    };
  },
  created() {},
  async mounted() {
    this.getBOMMasterGridData();
  },
  computed: {
    ...mapState({
      frmData: state => state.modules.frmBOMD,
      dgvBomDefinition: state => state.modules.frmBOMD.dgvBomDefinition,
      dgvBomDetail: state => state.modules.frmBOMD.dgvBomDetail,
      selectedProduct: state => state.modules.frmBOMD.selectedProduct,
      treeData: state => state.modules.frmBOMD.treeData,
      bomOriMasterData: state => state.modules.frmBOMD.bomOriMasterData,
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
      setTreeDataAction: 'modules/frmBOMD/setTreeDataAction',
      setBomOriMasterDataAction: 'modules/frmBOMD/setBomOriMasterDataAction',
      setBomOriDetailDataAction: 'modules/frmBOMD/setBomOriDetailDataAction',
    }),
    searchBtn() {
      this.$refs.BOMMaster.reSetPage = true;
      this.$refs.BOMDetail.reSetPage = true;
      this.getBOMMasterGridData();
    },
    //그리드 데이터 가져오기
    async getBOMMasterGridData(treeId = '') {
      await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetBomDefinition',
        sendParam: {
          parentareaid: treeId,
          plantid: 'LS',
          productid: this.productid,
          productName: this.productName,
          bomid: this.bomid,
        },
      }).then(res => {
        this.BOMMasterData = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: idx === 0,
            idx: idx,
            inEdit: true,
            resizable: true,
            PRODUCTIDBUTTON: '',
          };
        });

        if (this.BOMMasterData !== undefined && this.BOMMasterData.length > 0) {
          this.setSelectedProductAction(this.BOMMasterData[0]);
          this.getBOMDetailGridData();
        }

        this.setDgvBomDefinitionListAction(this.BOMMasterData);
        this.setBomOriMasterDataAction(
          JSON.parse(JSON.stringify(this.BOMMasterData))
        );
        this.$refs.BOMMaster.initGrid();
      });
    },
    async getBOMDetailGridData(treeId = '') {
      await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetBomDetail',
        sendParam: {
          parentareaid: treeId,
          plantid: 'LS',
          productName: this.productName,
          productid: this.selectedProduct.PRODUCTID, // 제품코드
        },
        queryVersion: '00002',
      }).then(res => {
        this.BOMDetailData = res
          .filter(
            x =>
              x.PRODUCTID === this.selectedProduct.PRODUCTID &&
              x.BOMID === this.selectedProduct.BOMID &&
              x.BOMVERSION === this.selectedProduct.BOMVERSION
          )
          .map((x, idx) => {
            return {
              ...x,
              rowStat: 'N',
              selected: idx === 0,
              idx: idx,
              inEdit: true,
              resizable: true,
              CONSUMABLEIDBUTTON: '검색', //BOM상세
            };
          });

        const BOMDetailData = this.BOMDetailData;
        this.setDgvBomDetailListAction(BOMDetailData);
        this.setBomOriDetailDataAction(
          JSON.parse(JSON.stringify(BOMDetailData))
        );

        this.$refs.BOMDetail.initGrid();
        const md = this.BOMMasterData.filter(
          x =>
            x.PRODUCTID === this.selectedProduct.PRODUCTID &&
            x.BOMID === this.selectedProduct.BOMID &&
            x.BOMVERSION === this.selectedProduct.BOMVERSION
        ).map(x => ({
          ...x,
          id: x.BOMID,
          label: x.PRODUCTNAME + '(' + x.PRODUCTID + ')',
          icon: x.PRODUCTIONTYPE,
        }));
        const dd = this.BOMDetailData.map(x => ({
          ...x,
          id: x.BOMID + '|' + x.CONSUMABLEID,
          parentId: x.BOMID,
          label:
            x.CONSUMABLENAME +
            '(' +
            x.CONSUMABLEID +
            ') ( 투입량 : ' +
            x.CONSUMABLEVALUE +
            x.CONSUMABLEUNIT +
            ' )',
          icon:
            this.BOMMasterData.find(m => m.PRODUCTID === x.CONSUMABLEID) ===
            undefined
              ? 'MATERIAL'
              : 'Half-Product',
        }));
        this.setTreeDataAction([...md, ...dd]);
      });
    },
    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },
    //트리 클릭
    onItemClick(event) {
      const CONSUMABLEID = event.item.CONSUMABLEID;
      const PRODUCTID = event.item.PRODUCTID;
      const mData = this.dgvBomDefinition.map(x => {
        if (PRODUCTID === x.PRODUCTID) {
          return { ...x, selected: true };
        } else {
          return { ...x, selected: false };
        }
      });
      const dData = this.dgvBomDetail.map(x => {
        if (CONSUMABLEID === x.CONSUMABLEID) {
          return { ...x, selected: true };
        } else {
          return { ...x, selected: false };
        }
      });
      this.setDgvBomDefinitionListAction(mData);
      this.setDgvBomDetailListAction(dData);
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
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
