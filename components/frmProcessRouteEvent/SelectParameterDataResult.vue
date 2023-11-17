<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="title"
      width="50%"
      height="600"
      @close="toggleDialog"
    >

      <v-row :style="{'margin-bottom': '10px'}">
        <v-col :cols="8" align="left">
        </v-col>
        <v-col :cols="4" align="right">
          <Button icon="close" @click="toggleDialog">닫기</Button>
        </v-col>
      </v-row>

      <v-row ref="contents" >
        <v-col :cols="12" :style="{ height: '100%' }">
          <div ref="divWrapper" style="height: calc(100% - 133px)">
            <KendoGrid 
              ref="rowGrid"
              :gridHeight="gridHeight"
              :gridItems="items"
              :sortable="true"
              :columns="gridHeader"
              :resizable="false"
              :edit-field="'inEdit'"
              :selected-field="selectedField"
              :isPaging="false"
            />
          </div>
          <v-row align="right" style="margin-top: 10px;">
            <v-col :cols="4" align="right">
              <InputText
                ref="textData"
                :dataNm="'textData'"
                @input-text-set="searchInput"
                @input="onInput"
              />
            </v-col>
            <v-col :cols="6">
              <Button
                :theme-color="'secondary'"
                @click="saveBtn"
                >데이터 입력</Button
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>

    </Dialog>

    <div v-if="isLoading" class="loading-container" :style="{'z-index': '999999', position: 'relative'}">
      <div class="loading">
        <FadeLoader />
      </div>
    </div>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText";
import DatePickerSingle from "@/components/common/input/DatePickerSingle";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import Checkbox from "@/components/common/input/Checkbox";
import moment from "moment";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";

export default { 
  name: "SelectParameterDataResult",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    FadeLoader,
    Checkbox,
    DatePickerSingle,
    Card,
    CardBody, 
    CardTitle,
  },
  props:{
    title: {
      type: String,
      default: "",
    },
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true
    },
    rowInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      gridHeader: [],
      gridData : [],
      gridHeight : '400px',
      selectedField: 'selected',
      headerParam: {
        gridid: "dgvParameterDataResult", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      lotId: "",
      productId: "",
      isLoading: true,
      chkLot: true,
      chkDate: false,
      form: moment().subtract(1, "weeks").format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
      fromdate: "",
      todate: "",
      textData: "",
      numberData:''

    }
  },
  computed: {
    items () {
      return this.gridData.map((item) => ({ ...item, selected: item.LOTID === this.selectedID }));
    },
  },
  async mounted() {
    await this.getGridData();
  },
  watch:{
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData() {
      const data = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetParameterDataResultList",
        sendParam: {
          plantid: "Ls",
          recipeparameterid: this.rowInfo.RECIPEPARAMETERID,
          lotid: this.rowInfo.LOTID,
          relationtimekey: this.rowInfo.TIMEKEY,
        }
      });
      this.$nuxt.$emit('iccReset')
      this.gridData = data.map(x => ({...x, selected: false}));
      this.isLoading = false
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //그리드 로우 클릭
    onRowClick (event) {
      this.selectedID = event.dataItem.LOTID;
    },
    //그리드 더블 클릭
    // rowdblclick(event){
    //   this.$emit('selectLotId', event.dataItem);
    //   this.$emit('visibleDialog', !this.visibleDialog)
    // },
    //row 선택
    selectRow() {
      const retuenData = this.items.filter(x => x.selected);
      this.$emit('selectLotId', retuenData[0]);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    searchInput(nm, val){
      this[nm] = val.replace(/[^0-9]/gi, "");
      
    },
    async saveBtn(){
      const rData = JSON.parse(JSON.stringify(this.rowInfo))
      rData.RESULTVALUE = this.textData;
      rData.RELATIONTIMEKEY = rData.TIMEKEY;

      const saveResult = await this.mesPost({
        apiKey: "mes/common/manage",
        messagename: "TxnProcessDataResult",
        sendParam: [rData],
      });
      if(saveResult?.returncode == "0"){
        this.openAlert("저장", "저장되었습니다.")
        this.getGridData();
        this.$refs.textData._data.textVal = '';
      }else{
      }


    },
    openAlert(title, message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    onInput(e){
      this.$refs.textData._data.textVal = e.target.value.replace(/[^0-9]/g, '')
      
    }
  },
};
</script>