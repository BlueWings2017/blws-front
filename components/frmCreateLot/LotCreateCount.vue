<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="LotCreateCount"
      width="50%"
      height="720"
      @close="toggleDialog"
    >
      <v-row no-gutters>
        <v-col :cols="12" align="right">
          <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveBtn" >저장</Button>
          <!-- <Button :theme-color="'primary'" :size="'small'" icon="close" @click="closeBtn">닫기</Button> -->
        </v-col>
      </v-row>
      <div class="detail-area">
        <div
          class="left-area"
          style="
            display: block;
            float: left;
            width: calc(100% - 5px) !important;
          "
        >
          <div class="area-form">
            <div class="area-th">
              <v-row>
                <v-col cols="12" align="left">
                  <label>P/O 정보</label>
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="area-form">
            <div class="area-th">
              <label>
                P/O ID
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="productorderid"
                :boxWidth="'100%'"
                :dataNm="'productorderid'"
                :readonly = "true"
                :defaultValue="toData.productorderid"
              />
            </div>
            <div class="area-th">
              <label>
                납기일
              </label>
            </div>
            <div class="area-td">
              <inputText
                ref="duedate"
                :boxWidth="'100%'"
                :dataNm="'duedate'"
                :readonly = "true"
                :defaultValue="toData.duedate"
              />
            </div>
          </div>
          <div class="area-form">
            <div class="area-th">
              <label>
              주문수량
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="planorderqty"
                :boxWidth="'100%'"
                :dataNm="'planorderqty'"
                :readonly = "true"
                :defaultValue="toData.planorderqty"
              />
            </div>
            <div class="area-th">
              <label>
                주문단위
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="productunit"
                :boxWidth="'100%'"
                :dataNm="'productunit'"
                :readonly = "true"
                :defaultValue="toData.productunit"
              />
            </div>
          </div>
          <div class="area-form">
            <div class="area-th">
              <label>
                계획시작일
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="planstartdate"
                :boxWidth="'100%'"
                :dataNm="'planstartdate'"
                :readonly = "true"
                :defaultValue="toData.planstartdate"
              />
            </div>
            <div class="area-th">
              <label>
                계획종료일
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="planenddate"
                :boxWidth="'100%'"
                :dataNm="'planenddate'"
                :readonly = "true"
                :defaultValue="toData.planenddate"
              />
            </div>
          </div>
          <div class="area-form">
            <div class="area-th">
              <v-row>
                <v-col cols="12" align="left">
                  <label>라우팅정보</label>
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="area-form">
            <div class="area-th">
              <label>
                제품코드
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="productid"
                :boxWidth="'100%'"
                :dataNm="'productid'"
                :readonly = "true"
                :defaultValue="toData.productid"
              />
            </div>
            <div class="area-th">
              <label>
                라우팅코드
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="processrouteid"
                :boxWidth="'100%'"
                :dataNm="'processrouteid'"
                :readonly = "true"
                :defaultValue="toData.processrouteid"
              />
            </div>
          </div>
          <div class="area-form">
            <div class="area-th">
              <label>
                제품명
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="productname"
                :boxWidth="'100%'"
                :dataNm="'productname'"
                :readonly = "true"
                :defaultValue="toData.productname"
              />
            </div>
            <div class="area-th">
              <label>
                라우팅명
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="processroutename"
                :boxWidth="'100%'"
                :dataNm="'processroutename'"
                :readonly = "true"
                :defaultValue="toData.processroutename"
              />
            </div>
          </div>
          <div class="area-form">
            <div class="area-th">
              <label>
                BOM ID
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="bomid"
                :boxWidth="'100%'"
                :dataNm="'bomid'"
                :readonly = "true"
                :defaultValue="toData.bomid"
              />
            </div>
            <div class="area-th">
              <label>
                BOM Ver
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="bomversion"
                :boxWidth="'100%'"
                :dataNm="'bomversion'"
                :readonly = "true"
                :defaultValue="toData.bomversion"
              />
            </div>
          </div>
          <!-- <div class="area-form">
            <div class="area-th">
              <label>
                생산방법
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="policyname"
                :boxWidth="'100%'"
                :dataNm="'policyname'"
                :readonly = "true"
                :defaultValue="toData.policyname"
              />
            </div>
            <div class="area-th">
              <label>
                조건구분
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="conditiontype"
                :boxWidth="'100%'"
                :dataNm="'conditiontype'"
                :readonly = "true"
                :defaultValue="toData.conditiontype"
              />
            </div>
          </div> -->
          <!-- <div class="area-form">
            <div class="area-th">
              <label>
                작업구분
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="policyvalue"
                :boxWidth="'100%'"
                :dataNm="'policyvalue'"
                :readonly = "true"
                :defaultValue="toData.policyvalue"
              />
            </div>
            <div class="area-th">
              <label>
                조건명
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="conditionid"
                :boxWidth="'100%'"
                :dataNm="'conditionid'"
                :readonly = "true"
                :defaultValue="toData.conditionid"
              />
            </div>
          </div> -->
          <div class="area-form">
            <div class="area-th" style="">
              <v-row>
                <v-col cols="12" align="left">
                  <label>생성 할 Lot의 LotType과 생성수량 및 기준생산량을 입력하여 주세요.</label>
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="area-form">
            <div class="area-th">
              <label>
                생산지역
              </label>
            </div>
            <div class="area-td">
                    <MesVariableSelectBox
                      :ref="'comboDepartment'"
                      :allYN="false"
                      :dataNm="'departmentid'"
                      :queryId="'GetDepartmentComboList'"
                      :inputcol="inputcol"
                      :sendParam="{
                        plantid: 'LS',
                      }"
                      :initChangeEvent ="true"
                      @comboChange="comboChange"
                    ></MesVariableSelectBox>
            </div>
            <div class="area-th">
              <label>
                생산공장
              </label>
            </div>
            <div class="area-td">
                    <MesVariableSelectBox
                      :ref="'comboArea'"
                      :allYN="false"
                      :dataNm="'areaid'"
                      :queryId="'GetAreaComboList'"
                      :inputcol="inputcol2"
                      :sendParam="{
                        plantid: 'LS',
                        department: departmentid
                      }"
                      :initChangeEvent ="true"
                      @comboChange="comboChange"
                    ></MesVariableSelectBox>
            </div>
          </div>
          <div class="area-form">
            <div class="area-th">
              <label>
                공정구분
              </label>
            </div>
            <div class="area-td">
              <MesSelectBox
              :enumID="'lotType'"
              :allYN="false"
              :dataNm="'lotType'"
              @comboChange="comboChange"
              />
            </div>
            <div class="area-th">
              <label>
                기준생산량
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="productquantity"
                :boxWidth="'100%'"
                :dataNm="'productquantity'"
                :disabled="false"
                :defaultValue="toData.productquantity"
                @input-text-set="changeInput"
              />
            </div>
          </div>
          <div class="area-form">
            <div class="area-th">
              <label>
                생산구분
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="producttypename"
                :boxWidth="'100%'"
                :dataNm="'producttypename'"
                :readonly = "true"
                :defaultValue="toData.producttypename"
              />
            </div>
            <div class="area-th">
              <label>
                작업지시수량
              </label>
            </div>
            <div class="area-td">
              <InputText
                ref="startquantity"
                :boxWidth="'100%'"
                :dataNm="'startquantity'"
                :disabled="false"
                :defaultValue="toData.startquantity"
                @input-text-set="changeInput"
              />
            </div>
          </div>
          <div class="area-form">
            <div class="area-th">
              <label> 
              </label>
            </div>
            <div class="area-td">
            </div>
            <div class="area-th">
              <label>
                우선순위
              </label>
            </div>
            <div class="area-td">
              <!-- <MesVariableSelectBox
                ref="lotpriority"
                :boxWidth="'100%'"
                :dataNm="'lotpriority'"
                :disabled="false"
                :defaultValue="toData.lotpriority"
                @input-text-set="changeInput"
              /> -->
              <MesSelectBox
                :enumID="'lotpriority'"
                :allYN="false"
                :dataNm="'priority'"
                :style="{ width: '100%' }"
                @comboChange="comboChange"
              ></MesSelectBox>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import mixinGlobal from "@/mixin/global.js";
import InputText from "@/components/common/input/InputText";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";

export default { 
  name: "LotCreateCount",
  mixins: [mixinGlobal],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    InputText,
    MesSelectBox,
    CardTitle,
    MesVariableSelectBox
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
        productorderid: "",
        duedate: "",
        planorderqty: "",
        productunit: "",
        planstartdate: "",
        planenddate: "",
        productid: "",
        processrouteid:"",
        productname:"",
        processroutename:"",
        bomid:"",
        bomversion:"",
        policyname:"",
        policyvalue:"",
        conditiontype:"",
        conditionid:"",
        startquantity:"",
        producttypename:"",
        productquantity:"",
        lotType:"",
        workorder:"",
        priority:5,

        departmentid: "",
        departmentname:"",
        areaid: "",
        areaname: "",
      },
      departmentid: "",
      areaid: "",
      expand: {
        ids: [],
        idField: 'AREANAME',
      },
      inputcol: ["DEPARTMENT", "DEPARTMENTNAME"],
      inputcol2: ["AREAID", "AREANAME"],
    }
  },
  computed: {
  },
  async mounted() {
      console.log(this.initData);
      this.toData.productorderid = this.initData.PRODUCTORDERID; // P/O ID
      this.toData.duedate = this.initData.DUEDATE; // 납기일
      this.toData.planorderqty = this.initData.PLANORDERQTY; // 주문수량
      this.toData.productunit = this.initData.PRODUCTUNIT; // 주문단위
      this.toData.planstartdate = this.initData.PLANSTARTDATE; // 계획시작일
      this.toData.planenddate = this.initData.PLANENDDATE; // 계획종료일
      this.toData.productid = this.initData.PRODUCTID; // 제품코드
      this.toData.processrouteid = this.initData.PROCESSROUTEID; // 라우팅코드
      this.toData.productname = this.initData.PRODUCTNAME; // 제품명
      this.toData.processroutename = this.initData.PROCESSROUTENAME; // 라우팅명
      this.toData.bomid = this.initData.BOMID; // BOM ID
      this.toData.bomversion = this.initData.BOMVERSION; // BOM Ver
      this.toData.policyname = this.initData.POLICYNAME; // 생산방법
      this.toData.policyvalue = this.initData.POLICYVALUE; // 조건구분
      this.toData.conditiontype = this.initData.CONDITIONTYPE; // 작업구분
      this.toData.conditionid = this.initData.CONDITIONID; // 조건명
      this.toData.startquantity = this.initData.STARTQUANTITY; // 생성수량
      this.toData.producttypename = this.initData.PRODUCTTYPENAME; //생산구분
      this.toData.productquantity = this.initData.PRODUCTQUANTITY; // 기준생산량 >> 작업지시수량 명칭변경 2023.03.28
      this.toData.workorder = this.initData.WORKORDER; // W/O ID

      this.departmentid = this.$refs.comboDepartment.value;
      this.$refs.comboArea.sendParam.department = this.departmentid;
      await this.$refs.comboArea.getComboList();
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    changeInput(nm, val){
      this.toData[nm] = val;
    },
    comboChange(nm, val){
      console.log("comboChange")
      this.toData[nm] = val;
      if(nm === "departmentid" ){
        this.$refs.comboArea.sendParam.department = this.toData.departmentid;
        this.$refs.comboArea.getComboList();
      }
    },
    saveBtn(){
      // console.log(this.toData)
      console.log(this.toData)
      this.$emit('saveBtn', this.toData);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    closeBtn(){
      this.$emit('visibleDialog', !this.visibleDialog)
    },
  },
};
</script>
<style lang="scss">
  .search-box {
    width: 100%;
  }
</style>