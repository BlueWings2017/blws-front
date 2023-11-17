<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>기준정보</li>
      <li>제품/공정별 가능설비등록</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>제품코드</label>
                    <InputText
                      ref="productid"
                      :dataNm="'productid'"
                      :readonly="true"
                      :defaultValue="productid"
                    />
                    <Button
                      :size="'medium'"
                      :theme-color="'primary'"
                      @click="modelingSearchModalVisible = true"
                      >선택</Button
                    >
                  </div>
                  <div class="form-group" style="margin-left: 66px">
                    <InputText
                      ref="productName"
                      :dataNm="'productName'"
                      :readonly="true"
                      :defaultValue="productName"
                    />
                  </div>
                </div>
                <div class="form-group-wrap" style="margin-top: 0">
                  <div class="form-group">
                    <label>공정ID</label>
                    <InputText
                      ref="processid"
                      :dataNm="'processid'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>공정명</label>
                    <InputText
                      ref="processname"
                      :dataNm="'processname'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>공정구분</label>
                    <MesSelectBox
                      :enumID="'ProcessType'"
                      :allYN="true"
                      :dataNm="'processtype'"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>종류</label>
                    <MesSelectBox
                      :enumID="'Classification'"
                      :allYN="true"
                      :dataNm="'classification'"
                      @comboChange="comboChange"
                    ></MesSelectBox>
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
        <v-row :style="{ height: '100%' }">
          <Process
            ref="Process"
            :gridHeight="gridHeight"
            :reSetPage="this.reSetPage"
          />
          <Equipment
            ref="Equipment"
            :gridHeight="gridHeight"
            :selected-field="selectedField"
            :reSetPage="this.reSetPage"
          />
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <StartPop
      ref="startPop"
      :is="'startPop'"
      :callBack="() => (modelingSearchModalVisible = true)"
    />
    <ModelingSearchModal
      ref="ModelingSearchModal"
      v-if="modelingSearchModalVisible"
      :visibleDialog="modelingSearchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="() => {}"
      :selected-field="selectedField"
      @visibleDialog="val => (modelingSearchModalVisible = val)"
      @modelingInfo="modelingInfo"
    />
  </div>
</template>
<script>
import mixinGlobal from '@/mixin/global.js';
import Utility from '~/plugins/utility';
import KendoGrid from '@/components/common/KendoGrid';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
import { Button } from '@progress/kendo-vue-buttons';
import InputText from '../../components/common/input/InputText.vue';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { mapState, mapMutations, mapActions } from 'vuex';
import ModelingSearchModal from '@/components/frmAvailableEquipment/ModelingSearchModal';
import Process from '@/components/frmAvailableEquipment/Process.vue';
import Equipment from '@/components/frmAvailableEquipment/Equipment.vue';
import StartPop from '@/components/common/modal/StartPop';

let myTitle;
let myMenuId;

export default {
  name: 'AvailableEquipment',
  mixins: [mixinGlobal],
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
    MesSelectBox,
    ModelingSearchModal,
    Process,
    Equipment,
    StartPop,
    Button,
  },
  props: {},
  data() {
    return {
      modelingSearchModalVisible: false,
      processid: '',
      productid: '',
      productName: '',
      gridHeight: '250px',
      processData: [],
      equipmentData: [],
      selectedField: 'selected',
      reSetPage: false,
    };
  },
  created() {},
  async mounted() {
    this.setDataAction([]);
    this.setDgvProcessListAction([]);
    this.setDgvEquipmentListAction([]);
    this.setModelingSetSaveAction(false);
    this.setSelectedProductAction({});
    this.setSelectedProcessAction({});
    this.firstPopUp();
  },
  computed: {
    ...mapState({
      frmData: state => state.modules.frmAE,
      dgvProcessList_Available: state =>
        state.modules.frmAE.dgvProcessList_Available,
      dgvEquipmentList_Available: state =>
        state.modules.frmAE.dgvEquipmentList_Available,
      isModelingSetSave: state => state.modules.frmAE.isModelingSetSave, // ?
      selectedProduct: state => state.modules.frmAE.selectedProduct,
      selectedProcess: state => state.modules.frmAE.selectedProcess,
      selectedEquipment: state => state.modules.frmAE.selectedEquipment,
      equipmentOriData: state => state.modules.frmAE.equipmentOriData,
    }),
  },
  watch: {},
  methods: {
    ...mapActions({
      setDataAction: 'modules/frmAE/setDataAction',
      setDgvProcessListAction: 'modules/frmAE/setDgvProcessListAction', // 공정목록
      setDgvEquipmentListAction: 'modules/frmAE/setDgvEquipmentListAction', // 가능설비목록
      setModelingSetSaveAction: 'modules/frmAE/setModelingSetSaveAction',
      setSelectedProductAction: 'modules/frmAE/setSelectedProductAction',
      setSelectedProcessAction: 'modules/frmAE/setSelectedProcessAction',
      setSelectedEquipmentAction: 'modules/frmAE/setSelectedEquipmentAction',
      setsetEquipmentOriDataAction:
        'modules/frmAE/setsetEquipmentOriDataAction',
    }),
    async firstPopUp() {
      this.$refs.startPop.show('', '제품정보를 먼저 선택해 주시기 바랍니다.');
      this.$refs.startPop.modalWidth = '330px';
      this.$refs.startPop.visibleDialog = true;
      this.$refs.startPop.modelingInfo = 'modelingInfo';
      return;
    },
    async modelingInfo(data) {
      this.$nuxt.$emit('iccReset');
      this.productid = data.PRODUCTID;
      this.productName = data.PRODUCTNAME;
      this.setDataAction([data]);

      this.setSelectedProductAction(data);
      this.setModelingSetSaveAction(false);
      await this.processGrid();
    },

    searchBtn() {
      const searchData = this.selectedProduct.PRODUCTID;
      if (!searchData) {
        this.firstPopUp();
      } else {
        this.$refs.Process.reSetPage = true;
        this.$refs.Equipment.reSetPage = true;
        this.processGrid();
      }
    },

    async processGrid() {
      await this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAvailableEquipmentProcessList',
        queryVersion: '00002',
        sendParam: {
          productid: this.selectedProduct.PRODUCTID, // 제품코드
          plantid: 'LS',
          processid: this.processid,
          processname: this.processname,
          processtype: this.processtype,
          classification: this.classification,
        },
      }).then(res => {
        this.processData = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: idx === 0,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
          };
        });
        if (this.processData !== undefined && this.processData.length > 0) {
          this.setSelectedProcessAction(this.processData[0]);
          this.equipmentGrid();
        } else {
          this.setDgvEquipmentListAction([]);
          this.setsetEquipmentOriDataAction([]);
        }

        this.setDgvProcessListAction(this.processData);
        this.$refs.Process.initGrid();
      });
    },
    async equipmentGrid() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetAvailableEquipment',
        sendParam: {
          plantid: 'LS',
          productid: this.selectedProduct.PRODUCTID, // 제품코드
          processid: this.selectedProcess.PROCESSID,
        },
      }).then(res => {
        this.equipmentData = res.map((x, idx) => {
          return {
            ...x,
            rowStat: 'N',
            selected: idx === 0,
            idx: idx,
            inEdit: true,
            newRow: false,
            resizable: true,
            EQUIPMENTBUTTON: '',
          };
        });
        this.setDgvEquipmentListAction(this.equipmentData);
        this.setsetEquipmentOriDataAction(
          JSON.parse(JSON.stringify(this.equipmentData))
        );
        if (this.equipmentData !== undefined && this.equipmentData.length > 0) {
          this.equipmentData[0][this.selectedField] = true;
        }
        this.$refs.Equipment.initGrid();
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
  },
};

const defaultData = {};
</script>
<style lang="scss"></style>
