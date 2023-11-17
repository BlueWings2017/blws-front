<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="title"
      width="70%"
      height="600"
      @close="toggleDialog"
    >
      <v-row no-gutters>
        <v-col :sm="9" :lg="9">
          <div class="form-group-wrap">
            <div class="form-group col-lg-3" style="min-width: 220px">
              <label>설비코드</label>
              <InputText
                ref="equipmentid"
                :dataNm="'equipmentid'"
                :disabled="false"
                :style="{ width: '160px' }"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group col-lg-3" style="min-width: 220px">
              <label>설비명</label>
              <InputText
                ref="equipmentname"
                :dataNm="'equipmentname'"
                :disabled="false"
                :style="{ width: '160px' }"
                :searchOption="true"
                :searchFunc="searchBtn"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group col-lg-3" style="min-width: 220px">
              <label>설비구분</label>
              <MesSelectBox
                :enumID="'EquipmentType'"
                :allYN="true"
                :dataNm="'EquipmentType'"
                :style="{ width: '160px' }"
                @comboChange="comboChange"
              ></MesSelectBox>
            </div>
            <div class="form-group col-lg-3" style="min-width: 220px">
              <label>상세구분</label>
              <MesSelectBox
                :enumID="'EquipmentDetailType'"
                :allYN="true"
                :dataNm="'EquipmentDetailType'"
                :style="{ width: '160px' }"
                @comboChange="comboChange"
              ></MesSelectBox>
            </div>
          </div>
        </v-col>
        <v-col :sm="3" :lg="3" align="right">
          <kbutton
            :theme-color="'primary'"
            :size="'medium'"
            :icon="'search'"
            @click="searchBtn"
            >조회</kbutton
          >
          <kbutton
            :theme-color="'primary'"
            :size="'medium'"
            :icon="'save'"
            @click="selectRow"
            >선택</kbutton
          >
        </v-col>
      </v-row>
      <div ref="divWrapper" style="height: calc(100% - 54px)">
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
          :isPaging="true"
          :reSetPage="this.reSetPage"
          @gridrowclick="onRowClick"
          @rowdblclick="rowdblclick"
          @sortChangeHandler="sortChangeHandler"
        />
      </div>
    </Dialog>
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from '@progress/kendo-vue-buttons';
import mixinGlobal from '@/mixin/global.js';
//import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import multiGridHeaderMinin from '@/mixin/multiGridHeaderMinin.js';
import KendoGrid from '@/components/common/KendoGrid';
import InputText from '@/components/common/input/InputText';
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import MesSelectBox from '@/components/common/select/MesSelectBox';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';

export default {
  name: 'SearchModal',
  mixins: [mixinGlobal, multiGridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    kbutton: Button,
    KendoGrid,
    InputText,
    FadeLoader,
    MesSelectBox,
    Card,
    CardBody,
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    callBack: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      gridData: [],
      gridHeader: [],
      gridHeight: '400px',
      selectedField: 'selected',
      checkHeaderArr: ['ACTIVESTATE'],
      headerParam: {
        gridid: 'dgvSelectEquipment', // 그리드 ID
        rowStat: '', //rowStat 표시 여부
        noFirstCheck: true,
        noRowstat: true,
      },
      selectedID: null,
      isLoading: true,
      defaultValue: '',
      processid: '',
      processname: '',
      EquipmentType: '',
      EquipmentDetailType: '',
      reSetPage: false,
    };
  },
  computed: {},
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    await this.getGridData();
  },
  methods: {
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },
    async searchBtn() {
      this.reSetPage = true;
      await this.getGridData();
    },
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: 'mes/common/getqueryresult',
        queryId: 'GetSelectEquipment',
        sendParam: {
          plantid: 'LS',
          equipmentid: this.equipmentid,
          equipmentname: this.equipmentname,
          EquipmentType: this.EquipmentType,
          EquipmentDetailType: this.EquipmentDetailType,
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
        if (data !== undefined && data.length > 0) {
          data[0][this.selectedField] = true;
        }
        this.gridData = data;
        this.isLoading = false;
      });
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.gridData.forEach(x => (x.selected = false));
      event.dataItem[this.selectedField] = true;
    },
    //그리드 더블 클릭
    rowdblclick(event) {
      this.$emit('selectedRow', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //row 선택
    selectRow() {
      const returnData = this.gridData.filter(x => x.selected);
      this.$emit('selectedRow', returnData[0]);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    comboChange(nm, val) {
      this[nm] = val;
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
</script>
