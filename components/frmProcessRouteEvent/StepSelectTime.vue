<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="스텝"
      width="40%"
      height="700"
      @close="toggleDialog"
    >
      <v-row :style="{'margin-bottom': '10px'}">
        <v-col :cols="8" align="left">
        </v-col>
        <v-col :cols="4" align="right">
          <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveValidation" >저장</Button>
          <Button :theme-color="'primary'" :size="'medium'" icon="close"  @click="toggleDialog">닫기</Button>
        </v-col>
      </v-row>

      <Card>
        <CardBody :style="{width:'100%'}">
          <v-row >
            <v-col :cols="6">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    작지번호
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="WORKORDER"
                    :boxWidth="'90%'"
                    :dataNm="'WORKORDER'"
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
                    제품코드
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="PRODUCTID"
                    :boxWidth="'90%'"
                    :dataNm="'PRODUCTID'"
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
                    제품명
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="PRODUCTNAME"
                    :boxWidth="'90%'"
                    :dataNm="'PRODUCTNAME'"
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
                    라우팅코드
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="PROCESSROUTEID"
                    :boxWidth="'90%'"
                    :dataNm="'PROCESSROUTEID'"
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
                    라우팅명
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="PROCESSROUTENAME"
                    :boxWidth="'90%'"
                    :dataNm="'PROCESSROUTENAME'"
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
                    BOM ID
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="BOMID"
                    :boxWidth="'90%'"
                    :dataNm="'BOMID'"
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
                    BOM Ver.
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="BOMVERSION"
                    :boxWidth="'90%'"
                    :dataNm="'BOMVERSION'"
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
                    계획수량
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="PRODUCTUNITQUANTITY"
                    :boxWidth="'90%'"
                    :dataNm="'PRODUCTUNITQUANTITY'"
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
                    현재수량
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="CURRENTQUANTITY"
                    :boxWidth="'90%'"
                    :dataNm="'CURRENTQUANTITY'"
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
          <CardTitle>진행정보</CardTitle>
          <v-row >
            <v-col :cols="5">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    공정
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="PROCESSNAME"
                    :boxWidth="'90%'"
                    :dataNm="'PROCESSNAME'"
                    :disabled="true"
                    @input-text-set="searchInput"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="7">
              <v-row>
                <v-col :cols="2">
                  <Label>
                    이전작업일시
                  </Label>
                </v-col>
                <v-col :cols="5">
                  <InputText
                    ref="BEFORERELATIONTIME_D"
                    :boxWidth="'90%'"
                    :dataNm="'BEFORERELATIONTIME_D'"
                    :disabled="true"
                    @input-text-set="searchInput"
                  />
                </v-col>
                <v-col :cols="5">
                  <InputText
                    ref="BEFORERELATIONTIME_T"
                    :boxWidth="'90%'"
                    :dataNm="'BEFORERELATIONTIME_T'"
                    :disabled="true"
                    @input-text-set="searchInput"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          
          <v-row >
            <v-col :cols="5">
              <v-row>
                <v-col :cols="3">
                  <Label>
                    현재작업
                  </Label>
                </v-col>
                <v-col :cols="9">
                  <InputText
                    ref="RECIPETYPENAME"
                    :boxWidth="'90%'"
                    :dataNm="'RECIPETYPENAME'"
                    :disabled="true"
                    @input-text-set="searchInput"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="7">
              <v-row>
                <v-col :cols="2">
                  <Label>
                    현재작업일시
                  </Label>
                </v-col>
                <v-col :cols="5">
                  <InputText
                    ref="now_d"
                    :boxWidth="'90%'"
                    :dataNm="'now_d'"
                    :disabled="false"
                    @input-text-set="searchInput2"
                  />
                </v-col>
                <v-col :cols="5">
                  <InputText
                    ref="now_t"
                    :boxWidth="'90%'"
                    :dataNm="'now_t'"
                    :disabled="false"
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
          <v-row >
            <v-col :cols="12">
              <v-row>
                <v-col :cols="1">
                  <Label>
                    비고
                  </Label>
                </v-col>
                <v-col :cols="11">
                  <TextArea
                    :style="{ height: '100px' }"  
                    :auto-size="true" 
                    :rows="5"
                    v-model="sdata.COMMENT"
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
      sdata: {
        WORKORDER: "",
        PRODUCTID: "",
        PRODUCTNAME: "",
        PROCESSROUTEID: "",
        PROCESSROUTENAME: "",
        BOMID: "",
        BOMVERSION: "",
        PRODUCTUNITQUANTITY: "",
        CURRENTQUANTITY: "",
        PROCESSNAME: "",
        BEFORERELATIONTIME: "",
        RECIPETYPENAME: "",
        RELATIONTIME: "",
        COMMENT: ""
      }
    }
  },
  computed: {
  },
  async mounted() {
    this.getProcessRouteInfo();
    this.processInfo();
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
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

      // console.log(moment().isBefore(ntime))

      if(!btime && moment().isBefore(ntime)){
        this.openAlert("현재작업일시","설정시간이 현재시각 보다 큽니다.\n\n시간을 다시 설정하세요.")
        return;
      }

      //StandardTime === btime
      //ComparisonTime === ntime
      // > isAfter
      // < isBefore
      if(moment(btime).isAfter(moment())){
        if(!(moment().isSameOrAfter(ntime) && moment(btime).isSameOrBefore(ntime))){
          if(moment().isBefore(ntime)){
            this.openAlert("현재작업일시","설정시간이 현재시간보다 작습니다.\n\n시간을 다시 설정하세요.")
            return;
          }else if(moment(btime).isAfter(ntime)){
            this.openAlert("현재작업일시","기준시간보다 큽니다.\n\n시간을 다시 설정하세요.")
            return;
          }
        }
      }else if(moment(btime).isBefore(moment())){
        if(!(moment().isSameOrAfter(ntime) && moment(btime).isSameOrBefore(ntime))){
          if(moment().isBefore(moment(ntime))){
            this.openAlert("현재작업일시","설정시간이 현재시간보다 큽니다.\n\n시간을 다시 설정하세요.")
            return;
          }else if(moment(btime).isAfter(ntime)){
            this.openAlert("설정시간이 기준시간보다 작습니다.\n\n시간을 다시 설정하세요.")
            return;
          }
        }
      }else{
        if(!(moment(btime).isSame(ntime))){
          this.openAlert("기준시간과 현재시각이 같으므로 설정시간은 같은값으로 설정하여야합니다.")
          return; 
        }
      }
      this.saveData();
    },
    saveData() {
      this.sdata.RELATIONTIME = `${this.now_d} ${this.now_t}`
      this.$emit('saveData', {eventName: this.EventName, data: this.sdata})
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    searchInput(nm, val){
      this.sdata[nm] = val;
    },
    searchInput2(nm, val){
      this[nm] = val;
    },
    //ProcessRoute 정보
    async getProcessRouteInfo(){
      const res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProcessRouteInfo",
        sendParam: {plantid: "Ls",lotid: this.rowInfo.LOTID}
      });
      const routeInfo = res[0]
      Object.keys(routeInfo).forEach(x => {
        this.$refs[x].textVal = routeInfo[x]
        this.sdata[x] = routeInfo[x];
      });
      this.$refs.CURRENTQUANTITY.textVal = this.rowInfo.CURRENTQUANTITY;
      this.sdata.CURRENTQUANTITY = this.rowInfo.CURRENTQUANTITY;

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
    openAlert(title, message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
  },
};
</script>

