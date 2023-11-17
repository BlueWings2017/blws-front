<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="title"
      width="50%"
      height="800"
      @close="toggleDialog"
    >
      <v-row :style="{'margin-bottom': '10px'}">
        <v-col :cols="8" align="left">

          <!-- <v-row class="search-box" align="center" no-gutters>
            <v-col :cols="3">
              <Label>
                라우팅ID
              </Label>
            </v-col>
            <v-col :cols="5">
              <InputText
                ref="processrouteid"
                :boxWidth="'90%'"
                :dataNm="'processrouteid'"
                :disabled="false"
                @input-text-set="searchInput"
              />
            </v-col>
          </v-row> -->
        </v-col>
        <v-col :cols="4" align="right">
          <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveValidation" >저장</Button>
          <Button :theme-color="'primary'" :size="'medium'" icon="close"  @click="toggleDialog">닫기</Button>
        </v-col>
      </v-row>

      <Card>
        <CardBody :style="{width:'100%'}">
          <v-row >
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    제품코드
                  </Label>
                  <InputText
                    ref="PRODUCTID"
                    :boxWidth="'90%'"
                    :dataNm="'PRODUCTID'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
               </div>
              </div>
            </v-col>
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    라우팅코드
                  </Label>
                  <InputText
                    ref="PROCESSROUTEID"
                    :boxWidth="'90%'"
                    :dataNm="'PROCESSROUTEID'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="4">
             <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    BOM ID
                  </Label>
                  <InputText
                    ref="BOMID"
                    :boxWidth="'90%'"
                    :dataNm="'BOMID'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
             </div>
            </v-col>
          </v-row>

          <v-row >
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    제품명
                  </Label>
                  <InputText
                    ref="PRODUCTNAME"
                    :boxWidth="'90%'"
                    :dataNm="'PRODUCTNAME'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    라우팅명
                  </Label>
                  <InputText
                    ref="PROCESSROUTENAME"
                    :boxWidth="'90%'"
                    :dataNm="'PROCESSROUTENAME'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    BOM Ver
                  </Label>
                  <InputText
                    ref="BOMVERSION"
                    :boxWidth="'90%'"
                    :dataNm="'BOMVERSION'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row >
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    작지번호
                  </Label>
                  <InputText
                    ref="WORKORDER"
                    :boxWidth="'90%'"
                    :dataNm="'WORKORDER'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    계획수량
                  </Label>
                  <InputText
                    ref="PRODUCTUNITQUANTITY"
                    :boxWidth="'90%'"
                    :dataNm="'PRODUCTUNITQUANTITY'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="4">

            </v-col>
          </v-row>
        </CardBody>
      </Card>

      <Card :style="{'margin-top': '10px'}">
        <CardBody :style="{width:'100%'}">
          <CardTitle>진행정보</CardTitle>
          <v-row >
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    공정
                  </Label>
                  <InputText
                    ref="PROCESSNAME"
                    :boxWidth="'90%'"
                    :dataNm="'PROCESSNAME'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="8">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    이전작업일시
                  </Label>
                  <InputText
                    ref="BEFORERELATIONTIME_D"
                    :boxWidth="'90%'"
                    :dataNm="'BEFORERELATIONTIME_D'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                  <InputText
                    ref="BEFORERELATIONTIME_T"
                    :boxWidth="'90%'"
                    :dataNm="'BEFORERELATIONTIME_T'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
          </v-row>
          
          <v-row >
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    현재작업
                  </Label>
                  <InputText
                    ref="RECIPETYPENAME"
                    :boxWidth="'90%'"
                    :dataNm="'RECIPETYPENAME'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="8">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    현재작업일시
                  </Label>
                  <InputText
                    ref="now_d"
                    :boxWidth="'90%'"
                    :dataNm="'now_d'"
                    :disabled="false"
                    @input-text-set="searchInput2"
                  />
                  <InputText
                    ref="now_t"
                    :boxWidth="'90%'"
                    :dataNm="'now_t'"
                    :disabled="false"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
          </v-row>
        </CardBody>
      </Card>

      <Card :style="{'margin-top': '10px'}">
        <CardBody :style="{width:'100%'}">
          <CardTitle>설비정보</CardTitle>
          <v-row >
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    진행설비
                  </Label>
                    <InputText
                      ref="EQUIPMENTID"
                      :boxWidth="'90%'"
                      :dataNm="'EQUIPMENTID'"
                      :readonly="true"
                      @input-text-set="searchInput"
                    />    
                    <Button 
                      v-if="modealType === 'Start'"
                      :theme-color="'primary'" 
                      :size="'small'"
                      @click="isEquipListGrid = !isEquipListGrid"
                    >
                        {{!isEquipListGrid? '선택':'닫기'}}
                      </Button>
                </div>
              </div>
            </v-col>
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    설비구분
                  </Label>
                  <InputText
                    ref="EQUIPMENTTYPENAME"
                    :boxWidth="'90%'"
                    :dataNm="'EQUIPMENTTYPENAME'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    설비상태
                  </Label>
                  <InputText
                    ref="EQUIPMENTSTATENAME"
                    :boxWidth="'90%'"
                    :dataNm="'EQUIPMENTSTATENAME'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row v-if="isEquipListGrid">
            <EquipmentList
              ref="EquipmentList"
              :dgvEquipmentList="dgvEquipmentList"
              :detailtype="equipmentDetailType"
              :rowInfo="rowInfo"
              @visible="val => isEquipListGrid = val"
              @equipmentRow="equipmentRow"
            />
          </v-row>
          
          <v-row >
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    설비명
                  </Label>
                                  <InputText
                    ref="EQUIPMENTNAME"
                    :boxWidth="'90%'"
                    :dataNm="'EQUIPMENTNAME'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    통신상태
                  </Label>
                  <InputText
                    ref="COMMUNICATIONSTATENAME"
                    :boxWidth="'90%'"
                    :dataNm="'COMMUNICATIONSTATENAME'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="4">
            </v-col>
          </v-row>
        </CardBody>
      </Card>

      <!-- 비가동시간 -->
      <DownTimeList
        ref="DownTimeList"
        :rowInfo="rowInfo"
        v-if="modealType === 'End'"
      />

      <Card :style="{'margin-top': '10px'}" v-if="!durableFlag">
        <CardBody :style="{width:'100%'}">
          <v-row >
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    현재수량
                  </Label>
                  <InputText
                    ref="CURRENTQUANTITY"
                    :boxWidth="'90%'"
                    :dataNm="'CURRENTQUANTITY'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    변경수량
                  </Label>
                  <NumericTextBox
                    :style="{ width: '90%' }"
                    :max="maxNum"
                    :min="0"
                    v-model="numericTextBox"
                    @change="event => numbericChg(event)"
                    @blur="numbericBlur"
                  />
                </div>
              </div>
            </v-col>
            <v-col :cols="4">
            </v-col>
          </v-row>
          
          <v-row >
            <v-col :cols="4">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    사유코드
                  </Label>
                  <InputText
                    ref="REASONCODE"
                    :boxWidth="'90%'"
                    :dataNm="'REASONCODE'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                   <Button 
                    :theme-color="'primary'" 
                    :size="'small'"
                    v-if="isReasonCode"
                    @click="isReasonCodeGrid = !isReasonCodeGrid"
                  >
                    {{!isReasonCodeGrid? '선택':'닫기'}}
                  </Button>    
                </div>
              </div>
            </v-col>

            <v-col :cols="5">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                  </Label>
                  <InputText
                    ref="REASONCODENM"
                    :boxWidth="'90%'"
                    :dataNm="'REASONCODENM'"
                    :readonly="true"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
          </v-row>

          <v-row v-if="isReasonCodeGrid">
            <ReasonCodeList
              :dgvReasoncodeList="dgvReasoncodeList"
              @visible="val => isReasonCodeGrid = val"
              @reasonCodeRow="reasonCodeRow"
            />
          </v-row>

          <v-row >
            <v-col :cols="12">
              <v-row>
                <v-col :cols="1">
                  <div class="form-group-wrap">
                    <div class="form-group">
                        <Label>
                          비고
                        </Label>
                    </div>
                  </div>
                </v-col>
                <v-col :cols="11" style="padding-left:4%;">
                  <TextArea
                    :style="{ height: '100px' }"  
                    :auto-size="true" 
                    :rows="5"
                    :disabled="textAtesDis"
                    v-model="sdata.DESCRIPTION"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </CardBody>
      </Card>
    </Dialog>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    <ConfirmPop
      ref="ConfirmPop"
    />


  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import customGridHeaderMixin from "@/mixin/customGridHeaderMixin";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import moment from "moment";
import { TextArea } from "@progress/kendo-vue-inputs";
import { NumericTextBox } from '@progress/kendo-vue-inputs';
import { Checkbox } from "@progress/kendo-vue-inputs";
import EquipmentList from "./EquipmentList"
import ReasonCodeList from "./ReasonCodeList"
import DownTimeList from "./DownTimeList"
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default { 
  name: "OperSelectTime",
  mixins: [mixinGlobal, customGridHeaderMixin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    FadeLoader,
    Card,
    CardBody,
    CardTitle,
    TextArea,
    NumericTextBox,
    EquipmentList,
    ReasonCodeList,
    DownTimeList
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
    title: {
      type: String,
      default: "",
    },
    EventName: {
      type: String,
      default: "",
    },
    modealType: {
      type: String,
      default: "Start",
    },
    defaultEquipment: {
      type: Array,
      default: () => []
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
      isLoading: true,
      now_d: "", //현재작업일
      now_t: "", //현재작업시
      durableFlag: false,
      maxNum: 0,
      isReasonCode: false,
      isReasonCodeGrid: false,
      dgvReasoncodeList: [],
      isEquipListGrid: false,
      dgvEquipmentList: [],
      equipmentDetailType: "",
      textAtesDis: true,
      sdata: {
        PRODUCTID: "",
        PROCESSROUTEID: "",
        BOMID: "",
        PRODUCTNAME: "",
        PROCESSROUTENAME: "",
        BOMVERSION: "",
        WORKORDER: "",
        PRODUCTUNITQUANTITY: "",
        //진행정보
        PROCESSNAME: "",
        RECIPETYPENAME: "",
        BEFORERELATIONTIME: "",
        RELATIONTIME: "", //현재 작업일시
        //설비정보
        CHANGEEQUIPMENTID: "",
        CHANGEEQUIPMENTTYPENAME: "",
        CHANGEEQUIPMENTSTATENAME: "",
        CHANGEEQUIPMENTNAME: "",
        CHANGECOMMUNICATIONSTATENAME: "",
        //사유
        CURRENTQUANTITY: "",
        CHANGEQUANTITY: 0,
        REASONCODE: "",
        REASONCODETYPE:"",
        REASONCODENM:"",
        DESCRIPTION: "",
      },
      numericTextBox: null
    }
  },
  computed: {
    ...mapState({
      lotInfo: state => state.modules.frmRouteEvent.lotInfo,
    }),
  },
  async mounted() {
    this.searchProcessRouteInfo();
    this.processInfo();
    this.searchEquipmentInfo();
    this.reasonInfo();
    this.getGridHeaders();
    
    if(this.defaultEquipment.length > 0){
      this.equipmentRow(this.defaultEquipment)
    }

  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
      this.$emit("equipmentReset")
    },
    saveValidation(){
      //이전작업일시
      const btime = this.sdata.BEFORERELATIONTIME;
      const ntime = `${this.now_d} ${this.now_t}`;
      // console.log(ntime)
      // console.log(moment(ntime, "yyyy-MM-DD HH:mm:ss").isValid())//.format("yyyy-MM-DD HH:mm:ss"))
      if(!moment(ntime, "yyyy-MM-DD HH:mm:ss", true).isValid()){
        this.openAlert("현재작업일시","설정시간 표현이 잘목되었습니다.")
        return;
      }

      if(!!btime && !moment(btime).isBefore(ntime)){
        this.openAlert("현재작업일시","설정시간이 기준시간보다 작습니다 \n  시간을 다시 설정하세요")
        return;
      }

      if(this.sdata.CHANGEEQUIPMENTID == ""){
        if(this.rowInfo["ACTIONTYPE"] == "Start" && this.rowInfo["INPUTMODE"] == "Operation"){
          this.openAlert("진행설비","진행설비가 미선택 되었습니다. 설비를 선택하여 주시기 바랍니다.")
          return;
        }
      }
      if(!this.durableFlag){
        if(this.rowInfo["PRODUCTTYPE"] == "Lot"){
          if(this.sdata.CURRENTQUANTITY != this.numericTextBox){
            if(this.sdata.REASONCODE == ""){
              this.openAlert("사유코드","현재수량과 다른 값을 입력시에는 \n\n사유코드를 선택하셔야합니다.")
              return;
            }
            const difference = this.sdata.CURRENTQUANTITY - this.numericTextBox
            if(difference > 0){
              this.$refs.ConfirmPop.title = "저장"
              this.$refs.ConfirmPop.message = `현재 수량보다 ${difference} 작습니다.\n\n저장 하시겠습니까?`
              this.$refs.ConfirmPop.modalWidth = "330px";
              this.$refs.ConfirmPop.visibleDialog = true;
              this.$refs.ConfirmPop.callBack = this.saveData;
              return 
            }else if(difference < 0){
              this.openAlert("사유코드","asdasd")
              this.$refs.ConfirmPop.title = "저장"
              this.$refs.ConfirmPop.message = `현재 수량보다 ${difference*-1} 큽니다.\n\n저장 하시겠습니까?`
              this.$refs.ConfirmPop.modalWidth = "330px";
              this.$refs.ConfirmPop.visibleDialog = true;
              this.$refs.ConfirmPop.callBack = this.saveData;
              return;
            }
          }
        }
      }
      this.saveData()

    },
    saveData() {
      this.sdata.RELATIONTIME = `${this.now_d} ${this.now_t}`
      this.$emit('saveData', {eventName: this.EventName, data: this.sdata})
      this.$emit('visibleDialog', !this.visibleDialog)
      this.$emit("equipmentReset")
      if(this.modealType === 'End'){
        this.$refs.DownTimeList.saveDownTime();
      }
    },
    numbericChg(e){
      this.sdata.CHANGEQUANTITY = Math.floor(e.value)
    },
    numbericBlur(){
      if(this.sdata.CHANGEQUANTITY < this.maxNum){
        this.isReasonCode = true;
        this.textAtesDis = false;
        this.sdata.CHANGEQUANTITY = this.numericTextBox;
      }
      if(this.sdata.CHANGEQUANTITY == this.rowInfo["CURRENTQUANTITY"]){
        this.isReasonCode = false;
        this.textAtesDis = true;
        this.$refs["REASONCODE"].textVal = "";
        // this.$refs["DESCRIPTION"].textVal = "";
        this.sdata.DESCRIPTION = ""
      }
      console.log(this.sdata)
    },
    searchInput(nm, val){
      this.sdata[nm] = val;
    },
    searchInput2(nm, val){
      this[nm] = val;
    },
    //ProcessRoute 정보
    async searchProcessRouteInfo(){
      const res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProcessRouteInfo",
        sendParam: {plantid: "Ls",lotid: this.rowInfo.LOTID}
      });
      const routeInfo = res[0]
      const keys = Object.keys(routeInfo);
      keys.forEach(x => {
        this.$refs[x].textVal = routeInfo[x]
        this.sdata[x] = routeInfo[x];
      })
    },
    //진행정보
    processInfo(){
      this.$refs["PROCESSNAME"].textVal = this.rowInfo["PROCESSNAME"];
      this.$refs["RECIPETYPENAME"].textVal = this.rowInfo["RECIPETYPENAME"];
      this.$refs["now_d"].textVal = moment().format("yyyy-MM-DD");
      this.$refs["now_t"].textVal = moment().format("HH:mm:ss");
      this.now_d = moment().format("yyyy-MM-DD");
      this.now_t = moment().format("HH:mm:ss");
      if(this.rowInfo["BEFORERELATIONTIME"]){
        this.$refs["BEFORERELATIONTIME_D"].textVal = moment(this.rowInfo["BEFORERELATIONTIME"]).format("yyyy-MM-DD");
        this.$refs["BEFORERELATIONTIME_T"].textVal = moment(this.rowInfo["BEFORERELATIONTIME"]).format("HH:mm:ss")
      }
      this.sdata.PROCESSNAME = this.rowInfo["PROCESSNAME"];
      this.sdata.RECIPETYPENAME = this.rowInfo["RECIPETYPENAME"];
      this.sdata.BEFORERELATIONTIME = this.rowInfo["BEFORERELATIONTIME"];
    },
    //설비정보
    //SDEPT22010003 설비 o
    //SDEPT22010001 설비 x
    //GetEquipmentInfo 설비정보
    async searchEquipmentInfo(){
      // console.log("EQUIPMENTID ==> ",this.rowInfo.EQUIPMENTID)
      const res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEquipmentInfo",
        sendParam: {plantid: "Ls",equipmentid: this.rowInfo.EQUIPMENTID}
      });
      // console.log(res)
      if(res.length === 0){
        return;
      }
      const equipInfo = res[0];
      this.$refs["EQUIPMENTID"].textVal = equipInfo["EQUIPMENTID"];
      this.$refs["EQUIPMENTNAME"].textVal = equipInfo["EQUIPMENTNAME"];
      this.$refs["EQUIPMENTTYPENAME"].textVal = equipInfo["EQUIPMENTTYPENAME"];
      this.$refs["COMMUNICATIONSTATENAME"].textVal = equipInfo["COMMUNICATIONSTATENAME"];
      this.$refs["EQUIPMENTSTATENAME"].textVal = equipInfo["EQUIPMENTSTATENAME"];

      this.sdata.CHANGEEQUIPMENTID = this.rowInfo["EQUIPMENTID"];
      this.sdata.CHANGEEQUIPMENTNAME = this.rowInfo["EQUIPMENTNAME"];
      this.sdata.CHANGEEQUIPMENTTYPENAME = this.rowInfo["EQUIPMENTTYPENAME"];
      this.sdata.CHANGECOMMUNICATIONSTATENAME = this.rowInfo["COMMUNICATIONSTATENAME"];
      this.sdata.CHANGEEQUIPMENTSTATENAME = this.rowInfo["EQUIPMENTSTATENAME"];

      this.equipmentDetailType = equipInfo["EQUIPMENTID"];
      // console.log("this.equipmentDetailType", this.equipmentDetailType)
    },

    //사유
    reasonInfo(){
      if(this.rowInfo["DURABLEFLAG"] == "Yes"){
        // CURRENTQUANTITY
        this.durableFlag = true
        return;
      }
      this.$refs["CURRENTQUANTITY"].textVal = this.rowInfo["CURRENTQUANTITY"];
      this.maxNum = Number(this.rowInfo["CURRENTQUANTITY"]);
      this.numericTextBox = Number(this.rowInfo["CURRENTQUANTITY"]);

      this.sdata.CURRENTQUANTITY = this.rowInfo["CURRENTQUANTITY"];
      this.sdata.CHANGEQUANTITY = Number(this.rowInfo["CURRENTQUANTITY"]);
    },
    async getGridHeaders(){
      //설비정보
      this.getCustomHeader("dgvEquipmentList",true,true).then((res) => {
        this.dgvEquipmentList = res;
      });
      //사유코드
      this.getCustomHeader("dgvReasoncodeList",true,true).then((res) => {
        this.dgvReasoncodeList = res;
      });
    },
    //설비정보 데이터 변경
    equipmentRow(data){
      if(data.length === 0){
        return;
      }
      const equipInfo = data[0];
      this.$refs["EQUIPMENTID"].textVal = equipInfo["EQUIPMENTID"];
      this.$refs["EQUIPMENTNAME"].textVal = equipInfo["EQUIPMENTNAME"];
      this.$refs["EQUIPMENTTYPENAME"].textVal = equipInfo["EQUIPMENTTYPENAME"];
      this.$refs["COMMUNICATIONSTATENAME"].textVal = equipInfo["COMMUNICATIONSTATENAME"];
      this.$refs["EQUIPMENTSTATENAME"].textVal = equipInfo["EQUIPMENTSTATENAME"];
      this.equipmentDetailType = equipInfo["EQUIPMENTID"];

      this.sdata.CHANGEEQUIPMENTID = equipInfo["EQUIPMENTID"];
      this.sdata.CHANGEEQUIPMENTNAME = equipInfo["EQUIPMENTNAME"];
      this.sdata.CHANGEEQUIPMENTTYPENAME = equipInfo["EQUIPMENTTYPENAME"];
      this.sdata.CHANGECOMMUNICATIONSTATENAME = equipInfo["COMMUNICATIONSTATENAME"];
      this.sdata.CHANGEEQUIPMENTSTATENAME = equipInfo["EQUIPMENTSTATENAME"];
    },
    //사유코드 데이터 변경
    reasonCodeRow(data){
      const reason = data[0];
      this.$refs["REASONCODE"].textVal = reason.REASONCODE;
      this.$refs["REASONCODENM"].textVal = reason.DESCRIPTION;
      this.sdata.REASONCODE = reason.REASONCODE;
      this.sdata.REASONCODETYPE = reason.REASONCODETYPE
    },
    openAlert(title, message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
  },
};

// REASONCODE
// CHANGEQUANTITY
// REASONCODETYPE
</script>

