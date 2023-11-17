<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="원료투입"
      width="40%"
      height="570"
      @close="toggleDialog"
    >
      <v-row :style="{'margin-bottom': '10px'}">
        <v-col :cols="8" align="left">
        </v-col>
        <v-col :cols="4" align="right">
          <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveValidation" >투입</Button>
          <Button :theme-color="'primary'" :size="'medium'" icon="close"  @click="toggleDialog">닫기</Button>
        </v-col>
      </v-row>

      <Card>
        <CardBody :style="{width:'100%'}">
          <CardTitle>원료정보</CardTitle>

          <v-row >
            <v-col :cols="6">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    원료코드
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="CONSUMABLEID"
                    :boxWidth="'90%'"
                    :dataNm="'CONSUMABLEID'"
                    :disabled="true"
                    @input-text-set="searchInput"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="6">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    단위
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="UNIT"
                    :boxWidth="'90%'"
                    :dataNm="'UNIT'"
                    :disabled="true"
                    @input-text-set="searchInput"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row >
            <v-col :cols="6">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    원료명
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="CONSUMABLENAME"
                    :boxWidth="'90%'"
                    :dataNm="'CONSUMABLENAME'"
                    :disabled="true"
                    @input-text-set="searchInput"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="6">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    자산유형
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="ACCOUNTTYPE"
                    :boxWidth="'90%'"
                    :dataNm="'ACCOUNTTYPE'"
                    :disabled="true"
                    @input-text-set="searchInput"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row >
            <v-col :cols="6">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    원료종류
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="CONSUMABLETYPENAME"
                    :boxWidth="'90%'"
                    :dataNm="'CONSUMABLETYPENAME'"
                    :disabled="true"
                    @input-text-set="searchInput"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="6">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    자산코드
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="ACCOUNTCODE"
                    :boxWidth="'90%'"
                    :dataNm="'ACCOUNTCODE'"
                    :disabled="true"
                    @input-text-set="searchInput"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

        </CardBody>
      </Card>

      <Card :style="{'margin-top': '10px'}">
        <CardBody :style="{width:'100%'}">
          <CardTitle>시작, 종료시간 및 투입량을 설정하세요.</CardTitle>
          <v-row >
            <v-col :cols="5">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    투입시작
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="startYMD"
                    :boxWidth="'90%'"
                    :dataNm="'startYMD'"
                    @input-text-set="searchInput2"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="5">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    시작시간
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="startHMS"
                    :boxWidth="'90%'"
                    :dataNm="'startHMS'"
                    @input-text-set="searchInput2"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="2"></v-col>
          </v-row>
          <v-row >
            <v-col :cols="5">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    투입종료
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="endYMD"
                    :boxWidth="'90%'"
                    :dataNm="'endYMD'"
                    @input-text-set="searchInput2"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="5">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    종료시간
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="endHMS"
                    :boxWidth="'90%'"
                    :dataNm="'endHMS'"
                    @input-text-set="searchInput2"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="2">
              <Button :theme-color="'primary'" :size="'medium'" @click="setNow" >현재시각</Button>
            </v-col>
          </v-row>

          <v-row >
            <v-col :cols="12">
              <v-row>
                <v-col :cols="2">
                  <Label :style='{"color": "blue", "font-size": "20px"}'>
                    투입지시량
                  </Label>
                </v-col>
                <v-col :cols="10">
                  <InputText
                    ref="TARGET"
                    :boxWidth="'90%'"
                    :dataNm="'TARGET'"
                    :disabled="true"
                    @input-text-set="searchInput"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row >
            <v-col :cols="12">
              <v-row>
                <v-col :cols="2">
                  <Label :style='{"font-size": "20px"}'>
                    원료투입량
                  </Label>
                </v-col>
                <v-col :cols="10">
                  <InputText
                    ref="RESULTVALUE"
                    :boxWidth="'90%'"
                    :dataNm="'RESULTVALUE'"
                    @input-text-set="searchInput"
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
import InputText from "@/components/common/input/InputText";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import moment from "moment";
import { TextArea } from "@progress/kendo-vue-inputs";

export default { 
  name: "OperSelectTime",
  mixins: [mixinGlobal],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    InputText,
    FadeLoader,
    Card,
    CardBody,
    CardTitle,
    TextArea,
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
    rowInfo: {
      type: Object,
      default: () => {}
    },
    EventName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isLoading: true,
      material: {
        CONSUMABLEID: "",
        UNIT: "",
        CONSUMABLENAME: "",
        ACCOUNTTYPE: "",
        CONSUMABLETYPENAME: "",
        ACCOUNTCODE: "",
      },
      sdata: {
        CONSUMABLEID: "",
        UNIT: "",
        CONSUMABLENAME: "",
        ACCOUNTTYPE: "",
        CONSUMABLETYPENAME: "",
        ACCOUNTCODE: "",
        TARGET: "",
        RESULTVALUE: "",
        STARTTIME: "",
        ENDTIME: "",
      },
      startYMD: "",
      startHMS: "",
      endYMD: "",
      endHMS: "",

    }
  },
  computed: {
  },
  async mounted() {
    this.getConsumableDefinition();
    this.processInfo();
    // console.log(JSON.stringify(this.rowInfo))
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    saveValidation(){
      //이전작업일시
      this.sdata.STARTTIME = `${this.startYMD} ${this.startHMS}`
      this.sdata.ENDTIME = `${this.endYMD} ${this.endHMS}`

      if(!moment(this.sdata.STARTTIME, "yyyy-MM-DD HH:mm:ss", true).isValid()){
        this.openAlert("원료투입 시작 시간","설정시간 표현이 잘목되었습니다.")
        return;
      }
      if(!moment(this.sdata.ENDTIME, "yyyy-MM-DD HH:mm:ss", true).isValid()){
        // console.log("xxxxxxxxxxxx")
        this.openAlert("원료투입 종료 시간","설정시간 표현이 잘목되었습니다.")
        return;
      }
      if(moment(this.sdata.STARTTIME).isAfter(this.sdata.ENDTIME)){
        this.openAlert("현재작업일시","설정시간이 기준시간보다 작습니다 \n  시간을 다시 설정하세요")
        return;
      }

      this.saveData();
    },
    saveData() {
      this.$emit('saveData', {eventName: this.EventName, data: this.sdata})
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    searchInput(nm, val){
      this.sdata[nm] = val;
    },
    searchInput2(nm, val){
      this[nm] = val;
    },
    async getConsumableDefinition(){
      const res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetConsumableDefinition",
        sendParam: {
          plantid: "Ls",
          consumableid: this.rowInfo.RECIPEPARAMETERID,
        }
      });
      const routeInfo = res[0]
      Object.keys(this.material).forEach(x => {
        this.$refs[x].textVal = routeInfo[x]
        this.sdata[x] = routeInfo[x];
      });

    },
    //진행정보
    processInfo(){
      const ymd = moment().format("yyyy-MM-DD");
      const hms = moment().format("HH:mm:ss");
      this.$refs["startYMD"].textVal = ymd;
      this.$refs["startHMS"].textVal = hms;
      this.$refs["endYMD"].textVal = ymd;
      this.$refs["endHMS"].textVal = hms;
      this.startYMD = ymd
      this.startHMS = hms;
      this.endYMD = ymd;
      this.endHMS = hms;
      
      // console.log(this.rowInfo.TARGET)
      this.sdata.TARGET = this.rowInfo.TARGET;
      this.$refs["TARGET"].textVal = this.rowInfo.TARGET;
    },
    setNow(){
      const ymd = moment().format("yyyy-MM-DD");
      const hms = moment().format("HH:mm:ss");
      this.$refs["endYMD"].textVal = ymd;
      this.$refs["endHMS"].textVal = hms;
      this.endYMD = ymd;
      this.endHMS = hms;
    },

    openAlert(title, message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
  },
};
</script>

