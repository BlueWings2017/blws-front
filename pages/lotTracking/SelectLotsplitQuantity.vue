<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="분할"
      width="25%"
      height="350"
      @close="close"
    >
          <v-col  align="right">
            <Button :theme-color="'primary'" :size="'small'"  @click="splitBtn">저장</Button>
          </v-col>
      <v-row :style="{ 'margin-bottom': '10px' }">
        <v-col align="left">
          <v-row :style="{ 'margin-bottom': '10px' }" align="center" no-gutters>
            <v-col :cols="3" style="text-align:right">
              <Label > LotID :&nbsp; </Label>
            </v-col>
            
            <v-col style="text-align:left">
              <InputText
                ref="lotid"
                :dataNm="'lotid'"
                :readonly = "true"
                :boxWidth="'98%'"
                :defaultValue="toData.lotid"
              />
            </v-col>
          </v-row>
          <v-row :style="{ 'margin-bottom': '10px' }" align="center" no-gutters>
            <v-col :cols="3" style="text-align:right">
              <Label> 제품코드 :&nbsp; </Label>
            </v-col>
            <v-col style="text-align:left">
              <InputText
                ref="productid"
                :dataNm="'productid'"
                :readonly = "true"
                :boxWidth="'98%'"
                :defaultValue="toData.productid"
              />
            </v-col>
          </v-row>
          <v-row :style="{ 'margin-bottom': '30px' }" align="center" no-gutters>
            <v-col :cols="3" style="text-align:right" >
              <Label> 현재수량 :&nbsp; </Label>
            </v-col>
            <v-col style="text-align:left" >
              <InputText
                ref="currentquantity"
                :dataNm="'currentquantity'"
                :readonly = "true"
                :boxWidth="'98%'"
                :defaultValue="toData.currentquantity"
                 dir="rtl"
              />
            </v-col>
          </v-row>
          <v-row :style="{ 'margin-bottom': '30px' }" align="center" no-gutters>
            <v-col :cols="3" style="text-align:right">
              <Label> 분할량 :&nbsp; </Label>
            </v-col>
            <v-col style="text-align:left">
              <InputText
                ref=""
                type="number"
                :dataNm="'splitquantity'"
                :disabled="false"
                :boxWidth="'98%'"
                :defaultValue="toData.splitquantity"
                @input-text-set="quantityInput"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </Dialog>
    <AlertPop ref="alertPop" :is="'alertPop'" :callBack="alertCallBack" />
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";

export default {
  name: "SearchModal",
  mixins: [mixinGlobal],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    InputText,
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true,
    },
    fromData: {},
    initData: {},
    gridDataModal: [],
    gridHeaderModal: [],
  },
  data() {
    return {
      selectedField: "selected",
      disabledCheckHeaderArr: ["ACTIVESTATE", "CONFIRMFLAG", "COMMONFLAG"],
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      processrouteid: "",
      toData: {
        lotid: "", //lotID
        productid: "", //제품id
        productunitquantity: "", //배치사이즈수량
        currentquantity: "", //현재수량
        splitquantity: "", //분할량
      },
      alertCallBack: () => {},
    };
  },
  computed: {
    areAllSelected() {},
    items() {},
  },
  async mounted() {
    console.log(this.fromData);
    this.toData.lotid = this.fromData.LOTID;
    this.toData.productid = this.fromData.PRODUCTID;
    this.toData.currentquantity = this.fromData.CURRENTQUANTITY;
    this.toData.splitquantity = this.fromData.SPLITQUANTITY;
    //this.toData.splitquantity = "0";
  },
  methods: {
    //닫기
    close() {
      this.$emit("visibleDialog", !this.visibleDialog);
    },

    quantityInput(nm, val) {
      this.toData[nm] = val;
    },

    test() {
      this.close();
    },

    //분할
    splitBtn() {
      // this.$emit("splitBtn", this.toData);
      // this.$emit("visibleDialog", !this.visibleDialog);
      this.selectedID = this.toData.lotid;
      const saveData = this.gridDataModal
        .filter((x) => x.LOTID === this.selectedID)
        .map((x) => {
          return {
            ...x,
            _ROWSTATUS: x.rowStat,
            SPLITQUANTITY: this.toData.splitquantity,
          };
        });
      console.log("saveData");
      console.log(saveData);
      // 입력값 유효성 검사
      const validateResult = this.mesValidation(this.gridHeaderModal, saveData);
      if (!validateResult.isValidate) {
        this.$refs.alertPop.message = validateResult.msg;
        this.$refs.alertPop.modalWidth = "330px";
        this.$refs.alertPop.visibleDialog = true;
        return;
      }
      if (
        this.toData.splitquantity == "" ||
        this.toData.splitquantity == undefined ||
        this.toData.splitquantity <= 0
      ) {
        this.$refs.alertPop.title = "Info";
        this.$refs.alertPop.message = "분할수량을 확인해 주시길 바랍니다.";
        this.$refs.alertPop.modalWidth = "330px";
        this.$refs.alertPop.visibleDialog = true;
        return;
      }
      if (
        Number(this.toData.currentquantity) > Number(this.toData.splitquantity)
      ) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnLotSplit",
          sendParam: saveData,
        }).then((result) => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === "0") {
              this.$refs.alertPop.show("알림", "저장되었습니다.");

              this.alertCallBack = () => {
                this.close();
                this.$emit("reLoadEvent");
              };
            } else {
              this.$refs.alertPop.show(
                "ERROR : " + result.code,
                result.message
              );
              return;
            }
          });
        });
      } else {
        this.$refs.alertPop.title = "Info";
        this.$refs.alertPop.message =
          "분할수량은 현재 수량보다" +
          "\n" +
          "같거나 작아야합니다. 확인해주시길 바랍니다.";
        this.$refs.alertPop.modalWidth = "330px";
        this.$refs.alertPop.visibleDialog = true;
        return false;
      }
    },
  },
};
</script>
