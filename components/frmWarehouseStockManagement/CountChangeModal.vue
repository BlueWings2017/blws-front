<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="수량변경"
      width="32%"
      height="300"
      @close="toggleDialog"
    >
      <v-row>
      <v-col :cols="12" align="right">
        <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveBtn3" >저장</Button>
      </v-col>
      </v-row>
      <v-row class="search-box" >
        <v-col :cols="2">
          <Label>
            자재코드
          </Label>
        </v-col>
        <v-col :cols="4">
          <InputText
            ref="materialid"
            :boxWidth="'100%'"
            :dataNm="'materialid'"
            :readonly="true"
            :defaultValue="toData.materialid"
          />
        </v-col>
         <v-col :cols="2">
          <Label>
            공급업체
          </Label>
        </v-col>
        <v-col :cols="4">
          <InputText
            ref="vendor"
            :boxWidth="'98%'"
            :dataNm="'vendor'"
            :readonly="true"
            :defaultValue="toData.vendor"
          />
        </v-col>
      </v-row>
      <v-row class="search-box" >
           <v-col :cols="2">
          <Label>
            자재Lot
          </Label>
        </v-col>
        <v-col :cols="4">
          <InputText
            ref="materiallotid"
            :boxWidth="'100%'"
            :dataNm="'materiallotid'"
            :readonly="true"
            :defaultValue="toData.materiallotid"
          />
        </v-col>
         <v-col :cols="2">
          <Label>
            현 수량
          </Label>
        </v-col>
        <v-col :cols="4">
          <InputText
            ref="stockqty"
            :boxWidth="'98%'"
            :dataNm="'stockqty'"
            :readonly="true"
            :defaultValue="toData.stockqty"
            @input="onInput"
          />
        </v-col>
      </v-row>
      <v-row class="search-box" >
        <v-col :cols="2">
          <Label>
            자재명
          </Label>
        </v-col>
        <v-col :cols="4">
          <InputText
            ref="materialname"
            :boxWidth="'100%'"
            :dataNm="'materialname'"
            :readonly="true"
            :defaultValue="toData.materialname"
          />
        </v-col>
        <v-col :cols="2">
          <Label>
            가용수량
          </Label>
        </v-col>
        <v-col :cols="4">
          <InputText
            ref="availableqty"
            :boxWidth="'98%'"
            :dataNm="'availableqty'"
            :readonly="true"
            :defaultValue="toData.availableqty"
            @input="onInput"
          />
        </v-col>
      </v-row>
      <v-row class="search-box" >
        <v-col :cols="2">
          <Label>
            사유
          </Label>
        </v-col>
        <v-col :cols="4">
              <MesVariableSelectBox
                :ref="'reasoncode'"
                :allYN="false"
                :inputcol=inputcol
                :dataNm="'reasoncode'"
                :queryId="'GetReasoncodeList'"
                :sendParam="{
                  plantid: 'LS',
                  reasoncodetype : 'STOCK',
                }"
                @comboChange="comboChange"
            ></MesVariableSelectBox>
        </v-col>
        <v-col :cols="2">
          <Label>
            변경수량
          </Label>
        </v-col>
        <v-col :cols="2">
          <InputText
            ref="hold"
            :boxWidth="'98%'"
            :dataNm="'hold'"
            :readonly="false"
            @input="onInput"
          />
        </v-col>
        <v-col :cols="2">
          <InputText
            ref="EA"
            :type="text"
            :placeholder="'EA'"
            :boxWidth="'100%'"
            :readonly="true"
          />
        </v-col>
      </v-row>

    </Dialog>
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";

export default { 
  name: "HoldModal",
  mixins: [mixinGlobal],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    InputText,
    MesSelectBox,
    MesVariableSelectBox,
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
    initData: {

    }
  },
  data() {
    return {
      toData:{
        materialid: "",
        vendor:"",
        materiallotid:"",
        stockqty:"",
        holdqty:"",
        materialname:"",
        reasoncode:"",
        hold:"",
        availableqty:"",
      },
      inputcol: ["REASONCODE", "DESCRIPTION"],
    }
  },
  computed: {
  },
  async mounted() {
      console.log("this.initData")
      console.log(this.initData)
      this.toData.materialid = this.initData.MATERIALID; // 자재코드
      this.toData.vendor = this.initData.VENDOR; // 공급업체
      this.toData.materiallotid = this.initData.MATERIALLOTID; //자재LOT아이디
      this.toData.stockqty = this.initData.STOCKQTY; //현 재고수량
      this.toData.holdqty = this.initData.HOLDQTY; //현 보류수량
      this.toData.materialname = this.initData.MATERIALNAME; // 자재명
      this.toData.reasoncode = this.initData.REASONCODE; // 사유
      this.toData.availableqty = this.initData.AVAILABLEQTY; // 사유
      const inputEl1 = this.$refs.stockqty.$el.querySelector('input');
      const inputEl2 = this.$refs.availableqty.$el.querySelector('input');
      inputEl1.style.textAlign = 'right';
      inputEl2.style.textAlign = 'right';       
      
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    changeInput(nm, val){
      this.toData[nm] = val;
    },
    comboChange(nm, val){
      this.toData[nm] = val;
    },
    onInput(e){
      this.toData.hold = e.value;
    },
    saveBtn3(){
      this.$emit('saveBtn3', this.toData);
      this.$emit('visibleDialog', !this.visibleDialog);
    },
    closeBtn(){
      this.$emit('visibleDialog', !this.visibleDialog)
    },
  },
};
</script>