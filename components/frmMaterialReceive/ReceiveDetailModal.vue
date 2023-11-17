<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="입고"
      width="350px"
      height="350px"
      @close="toggleDialog"
    >
    <v-row no-gutters style="margin-bottom : 6px">
      <v-col :cols="11" align="right">
        <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveBtn" >저장</Button>
      </v-col>
    </v-row>
      <v-row no-gutters >
        <div class="form-group-wrap">
          <div class="form-group">
            <Label>
              자재코드
            </Label>
            <InputText
              ref="consumableid"
              :boxWidth="'100%'"
              :dataNm="'consumableid'"
              :readonly="true"
              :defaultValue="toData.CONSUMABLEID"
            />
          </div>
          <div class="form-group">
              <Label>
                자재명
              </Label>
              <InputText
                ref="consumablename"
                :boxWidth="'100%'"
                :dataNm="'consumablename'"
                :readonly="true"
                :defaultValue="toData.CONSUMABLENAME"
              />
          </div>
          <div class="form-group">
            <Label>
              입고일
            </Label>
          <div class="form-chk">
          <v-col class="form-datepicker">
            <DatePicker 
              ref="receiptdate"
              :style="{ width: '162px'}"
              :default-value="new Date()"
              :dataNm="'receiptdate'"
              :format="'yyyy-MM-dd'"
              @change="dateChange"
            />
          </v-col>
          </div>
          </div>
          <div class="form-group">
            <Label>
              공급업체
            </Label>
            <MesVariableSelectBox
              :ref="'vendor'"
              :allYN="false"
              :dataNm="'vendor'"
              :queryId="'GetCompanyDefinitionList'"
              :inputcol="inputcol"
              :sendParam="{
                plantid: 'LS',
              }"
              @comboChange="comboChange"
            ></MesVariableSelectBox>
          </div>
         <v-row no-gutters>
          <div style="display: flex; align-items: center; margin-left: 38px; margin-top: 10px;">
            <Label class="receiveLabel" style="margin-right: 10px; font-weight: bold; color: #475663;">
              입고수량
            </Label>
            <InputText
              ref="openingqty"
              :boxWidth="'95%'"
              :dataNm="'openingqty'"
              :disabled="false"
              @input-text-set="searchInput"
            ></InputText>
            <InputText
              :boxWidth="'65px'"
              :dataNm="'unit'"
              :readonly="true"
              :defaultValue="toData.UNIT"
            ></InputText>
          </div>
         </v-row>
        </div>
      </v-row>


    </Dialog>
  </div>
</template>
<script>

import Utility from '~/plugins/utility';
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import { DatePicker } from '@progress/kendo-vue-dateinputs';

export default { 
  name: "LotCreateCount",
  mixins: [mixinGlobal],
  components: {
    Utility,
    Dialog,
    DialogActionsBar,
    Button,
    InputText,
    MesSelectBox,
    MesVariableSelectBox,
    DatePicker,
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true
    },
    curMaterial: {

    }
  },
  data() {
    return {
      toData:{
        consumableid: "",
        consumablename:"",
        vendor:"",
        openingqty:"",
        unit:"",
        receiptdate: new Date()
      },
      inputcol: ["COMPANYID", "COMPANYNAME"],
      vendor: "",
      openingqty: "",
      receiptdate: Utility.setFormatDate(new Date(), 'YYYYMMDD')
    }
  },
  computed: {
  },
  async mounted() {
      this.toData = Object.assign(this.curMaterial, {
        _ROWSTATUS: this.curMaterial._ROWSTATUS,
        receiptdate: this.receiptdate,
        vendor : this.vendor,
        openingqty : this.openingqty,
        unit: this.unit
      })
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    changeInput(nm, val){
      this.toData[nm] = val;
    },
    saveBtn(){
      this.toData.vendor = this.$refs.vendor.value;
      this.toData.openingqty = this.openingqty;
      this.toData.receiptdate = this.receiptdate;

      this.$emit('saveBtn', this.toData);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    closeBtn(){
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    comboChange(nm, val) {
      this[nm] = val;
    },
    dateChange(e) {
      this.receiptdate = Utility.setFormatDate(e.value, 'YYYYMMDD');
    },
    chkVal(nm, val) {
      this[nm] = val ? "Yes" : "";
    },
  },
};
</script>
