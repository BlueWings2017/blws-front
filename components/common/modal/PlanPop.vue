<template>
  <div>
    <k-dialog
        v-if="visibleDialog"
        :title="planLabel"
        @close="toggleDialog"
    >
    <div style="width: 750px">
    <v-row align="center">
    <v-col :cols="3">
      <Label>
        <v-icon x-small :color="'#fb8200'">mdi-record-circle</v-icon>
        {{$t('CalendarMngPage.PlanPop.label1')}}
      </Label>
    </v-col>
    <v-col :cols="9">
      <DatePicker 
        :style="{ width: '230px' }"
        v-model="strtDt"
        :format="'yyyy-MM-dd'"
        :hide-details="true"
        ></DatePicker>
        <NumericTextBox
          :style="{ width: '150px' }"
          v-model="strtHh"
          :max="23"
          :min="0"
        >
        </NumericTextBox>
        :
        <NumericTextBox
          :style="{ width: '150px' }"
          v-model="strtMm"
          :max="59"
          :min="0"
        >
        </NumericTextBox>
    </v-col>
    </v-row>
    <v-row align="center">
    <v-col :cols="3">
      <Label>
        <v-icon x-small :color="'#fb8200'">mdi-record-circle</v-icon>
        {{$t('CalendarMngPage.PlanPop.label2')}}
      </Label>
    </v-col>
    <v-col :cols="9">
      <DatePicker 
      :style="{ width: '230px' }"
        v-model="endDt"
        :format="'yyyy-MM-dd'"
        :hide-details="true"
        ></DatePicker>
        <NumericTextBox
          :style="{ width: '150px' }"
          v-model="endHh"
          :max="23"
          :min="0"
        >
        </NumericTextBox>
        :
        <NumericTextBox
          :style="{ width: '150px' }"
          v-model="endMm"
          :max="59"
          :min="0"
        >
        </NumericTextBox>
    </v-col>
    </v-row>
    <v-row align="center">
    <v-col :cols="3">
      <Label>
        <v-icon x-small :color="'#fb8200'">mdi-record-circle</v-icon>
        {{$t('CalendarMngPage.PlanPop.label3')}}
      </Label>
    </v-col>
    <v-col :cols="9">
      <KInput 
        :style="{ width: '100%'}" 
        v-model="planTitle"
        outlined
        :hide-details="true"></KInput>
    </v-col>
    </v-row>
    <v-row align="center">
    <v-col :cols="3">
      <Label>
        <v-icon x-small :color="'#fb8200'">mdi-record-circle</v-icon>
        {{$t('CalendarMngPage.PlanPop.label4')}}
      </Label>
    </v-col>
    <v-col :cols="9">
      <ktextarea
          v-model="planCntn"
          :style="{ width: '100%'}"
          :rows="5"
        ></ktextarea>
    </v-col>
    </v-row>
    <v-row align="center">
    <v-col :cols="3">
      <Label>
        <v-icon x-small :color="'#fb8200'">mdi-record-circle</v-icon>
        {{$t('CalendarMngPage.PlanPop.label5')}}
      </Label>
    </v-col>
    <v-col :cols="1">
      <div id="redDiv" class="colPk redBg" @click="colorClick('red')"></div>
    </v-col>
    <v-col :cols="1">
      <div id="blueDiv" class="colPk blueBg" @click="colorClick('blue')" ></div>
    </v-col>
    <v-col :cols="1">
      <div id="pupleDiv" class="colPk pupleBg" @click="colorClick('puple')" ></div>
    </v-col>
    <v-col :cols="1">
      <div id="greenDiv" class="colPk greenBg" @click="colorClick('green')" ></div>
    </v-col>
    <v-col :cols="1">
      <div id="orangeDiv" class="colPk orangeBg" @click="colorClick('orange')" ></div>
    </v-col>
    <v-col :cols="1">
      <div id="pinkDiv" class="colPk pinkBg"  @click="colorClick('pink')"></div>
    </v-col>
    </v-row>
  </div>
    <dialog-actions-bar>
      <kbutton @click="btnAction('save')">{{$t('CommLang.btn.submitBtn')}}</kbutton>
      <kbutton v-show="popUpAction === 'update'" @click="btnAction('delete')">{{$t('CommLang.btn.removeBtn')}}</kbutton>
      <kbutton @click="toggleDialog">{{$t('CommLang.btn.closeBtn')}}</kbutton>
    </dialog-actions-bar>
    </k-dialog>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { Dialog, DialogActionsBar, Window } from "@progress/kendo-vue-dialogs";
import { Button } from '@progress/kendo-vue-buttons';
import { Label } from "@progress/kendo-vue-labels";
import { Input, NumericTextBox, TextArea } from "@progress/kendo-vue-inputs";
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import AlertPop from "@/components/common/modal/AlertPop";
import Utility from "~/plugins/utility";
export default {
  components: {
      "k-dialog": Dialog,
      "dialog-actions-bar": DialogActionsBar,
      'kbutton': Button,
      Label,
      KInput: Input,
      DatePicker,
      NumericTextBox,
      ktextarea: TextArea,
      AlertPop
  },
  props: {
    label: {
      type: String,
      require: true
    },
    valueNm: {
      type: String,
      require: true
    },
    disabled: {
      type: Boolean,
      require: false,
      default: false
    },
    labelCols:{
      type: Number,
      require: false,
      default: 4
    },
    textCols:{
      type: Number,
      require: false,
      default: 7
    },
    searchOption:{
      type:Boolean,
      require:false
    },
    required:{
      type:Boolean,
      require:false,
      default:false
    },
    boxWidth:{
        type: String,
        require: false,
        default: '100%'
    },
    dataNm:{
        type: String,
        require: false,
        default: null
    },
    comId:{
        type: String,
        require: false,
        default: null
    }
    },
    data: function() {
      return {
        visibleDialog: false,
        popUpAction: "",
        textVal: null,
        strtDt: null,
        strtHh: 0,
        strtMm: 0,
        endDt: null,
        endHh: 0,
        endMm: 0,
        blocId: null,
        planLabel: null,
        planTitle: null,
        planCntn: null,
        planColor: null,
        planSeq: null
      };
    },
    computed:{
      chkDialog(){
        return this.visibleDialog;
      }
    },
    watch:{
      async chkDialog(val) {
        if(val){
          this.openDialog();

          this.$nextTick(() => {
          
          });
        }else{
          
        }
      },
    },
    emits:["search"],
    methods: {
      ...mapActions({
          getListReturn: "modules/list/getListReturn",
          postInsertReturn: "modules/list/postInsertReturn",
          putUpdateReturn: "modules/list/putUpdateReturn",
          deleteDeleteReturn: "modules/list/deleteDeleteReturn",
      }),
      toggleDialog() {
          this.visibleDialog = !this.visibleDialog;
      },
      setUpdate(){
      },
      openDialog(){
        this.$nextTick(() => {
        switch(this.popUpAction){
          case "read":
            // this.strtDt = this.convertStringToDateFormat(this.searchParam.rowGridSelectData.chkDd);
            // this.endDt = this.convertStringToDateFormat(this.searchParam.rowGridSelectData.chkDd);
            break;
          case "insert":
            // this.strtDt = this.convertStringToDateFormat(this.strtDt);
            // this.endDt = this.convertStringToDateFormat(this.endDt);
            this.strtHh = 0;
            this.strtMm = 0;
            this.endHh = 0;
            this.endMm = 0;
            this.planTitle = "";
            this.planCntn = "";
            this.planColor = "";
            document.getElementById("redDiv").classList.remove('colPkSelect');
            document.getElementById("blueDiv").classList.remove('colPkSelect');
            document.getElementById("pupleDiv").classList.remove('colPkSelect');
            document.getElementById("greenDiv").classList.remove('colPkSelect');
            document.getElementById("orangeDiv").classList.remove('colPkSelect');
            document.getElementById("pinkDiv").classList.remove('colPkSelect');
            break;
          case "update":
            this.getPlanData();
            break;
        }
        });
      },
      async getPlanData(){
        let res = await this.getListReturn({
          apiKey: "common/plan/info",
          sendParam : {
            planSeq: this.planSeq
          }
        });

        this.strtDt = new Date(res.strtDt);
        this.endDt = new Date(res.endDt);
        this.strtHh = parseInt(res.strtHh);
        this.strtMm = parseInt(res.strtMm);
        this.endHh = parseInt(res.endHh);
        this.endMm = parseInt(res.endMm);
        this.planTitle = res.planTitle;
        this.planCntn = res.planCntn;
        this.planColor = res.planColor;
        this.colorClick(this.planColor);
        
      },
      async btnAction(action){
        switch(action){
          case "close":
            this.visibleDialog = !this.visibleDialog;
            break;
          case "save":
            if(this.popUpAction === 'insert'){
              if(this.strtDt == "" ||
                this.endDt  == ""||
                // this.strtHh == ""||
                // this.strtMm == ""||
                // this.endHh == ""||
                // this.endMm == ""||
                this.planTitle == ""||
                this.planCntn == ""||
                this.planColor == ""){
                  this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');
                  this.$refs['alertPop'].message = this.$i18n.t('CommLang.message.msg2');
                  this.$refs['alertPop'].modalWidth = "300px";
                  this.$refs['alertPop'].visibleDialog = true;
                }else{
                  this.visibleDialog = !this.visibleDialog;
                  await this.insertDetail();
                }
            }else if(this.popUpAction === 'update'){
              if(this.strtDt == "" ||
                this.endDt  == ""||
                // this.strtHh == ""||
                // this.strtMm == ""||
                // this.endHh == ""||
                // this.endMm == ""||
                this.planTitle == ""||
                this.planCntn == ""||
                this.planColor == ""){
                  this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');
                  this.$refs['alertPop'].message = this.$i18n.t('CommLang.message.msg2');
                  this.$refs['alertPop'].modalWidth = "300px";
                  this.$refs['alertPop'].visibleDialog = true;
                }else{
                  this.visibleDialog = !this.visibleDialog;
                  await this.updateDetail();
                }
            }
            break;
          case "delete":
            this.visibleDialog = !this.visibleDialog;
            await this.deleteDetail();
            break;
        }
      },
      async insertDetail(){
        var params = {
          strtDt : Utility.setFormatDate(this.strtDt, 'YYYY-MM-DD'),
          endDt : Utility.setFormatDate(this.endDt, 'YYYY-MM-DD'),
          strtHh : this.strtHh.toString(),
          strtMm : this.strtMm.toString(),
          endHh : this.endHh.toString(),
          endMm : this.endMm.toString(),
          planTitle : this.planTitle,
          planCntn : this.planCntn,
          planColor : this.planColor
        }

        await this.postInsertReturn({
          apiKey: "common/plan",
          sendParam: params
        });
        this.$emit("search")
        
      },
      async updateDetail(){
        var params = {
          strtDt : Utility.setFormatDate(this.strtDt, 'YYYY-MM-DD'),
          endDt : Utility.setFormatDate(this.endDt, 'YYYY-MM-DD'),
          strtHh : this.strtHh.toString(),
          strtMm : this.strtMm.toString(),
          endHh : this.endHh.toString(),
          endMm : this.endMm.toString(),
          planTitle : this.planTitle,
          planCntn : this.planCntn,
          planColor : this.planColor,
          planSeq : this.planSeq
        }
 
        await this.putUpdateReturn({
          apiKey: "common/plan",
          sendParam: params
        });
        this.$emit("search")
      },
      async deleteDetail(){
        await this.deleteDeleteReturn({
          apiKey: "common/plan",
          sendParam: {
            planSeq : this.planSeq
          }
        });
        this.$emit("search")
      },
      colorClick(t){
        if(t =="red"){
          document.getElementById("redDiv").classList.add('colPkSelect');
          document.getElementById("blueDiv").classList.remove('colPkSelect');
          document.getElementById("pupleDiv").classList.remove('colPkSelect');
          document.getElementById("greenDiv").classList.remove('colPkSelect');
          document.getElementById("orangeDiv").classList.remove('colPkSelect');
          document.getElementById("pinkDiv").classList.remove('colPkSelect');

          this.planColor = "red";
        }else if(t =="blue"){
          document.getElementById("redDiv").classList.remove('colPkSelect');
          document.getElementById("blueDiv").classList.add('colPkSelect');
          document.getElementById("pupleDiv").classList.remove('colPkSelect');
          document.getElementById("greenDiv").classList.remove('colPkSelect');
          document.getElementById("orangeDiv").classList.remove('colPkSelect');
          document.getElementById("pinkDiv").classList.remove('colPkSelect');

          this.planColor = "blue";
        }else if(t =="puple"){
          document.getElementById("redDiv").classList.remove('colPkSelect');
          document.getElementById("blueDiv").classList.remove('colPkSelect');
          document.getElementById("pupleDiv").classList.add('colPkSelect');
          document.getElementById("greenDiv").classList.remove('colPkSelect');
          document.getElementById("orangeDiv").classList.remove('colPkSelect');
          document.getElementById("pinkDiv").classList.remove('colPkSelect');

          this.planColor = "puple";
        }else if(t =="green"){
          document.getElementById("redDiv").classList.remove('colPkSelect');
          document.getElementById("blueDiv").classList.remove('colPkSelect');
          document.getElementById("pupleDiv").classList.remove('colPkSelect');
          document.getElementById("greenDiv").classList.add('colPkSelect');
          document.getElementById("orangeDiv").classList.remove('colPkSelect');
          document.getElementById("pinkDiv").classList.remove('colPkSelect');

          this.planColor = "green";
        }else if(t =="orange"){
          document.getElementById("redDiv").classList.remove('colPkSelect');
          document.getElementById("blueDiv").classList.remove('colPkSelect');
          document.getElementById("pupleDiv").classList.remove('colPkSelect');
          document.getElementById("greenDiv").classList.remove('colPkSelect');
          document.getElementById("orangeDiv").classList.add('colPkSelect');
          document.getElementById("pinkDiv").classList.remove('colPkSelect');

          this.planColor = "orange";
        }else if(t =="pink"){
          document.getElementById("redDiv").classList.remove('colPkSelect');
          document.getElementById("blueDiv").classList.remove('colPkSelect');
          document.getElementById("pupleDiv").classList.remove('colPkSelect');
          document.getElementById("greenDiv").classList.remove('colPkSelect');
          document.getElementById("orangeDiv").classList.remove('colPkSelect');
          document.getElementById("pinkDiv").classList.add('colPkSelect');

          this.planColor = "pink";
        }
    }
    }
    
}
</script>
<style scoped lang="scss">
  .colPk{
    width: 25px;
    height: 25px;
    text-align: center;
    border-radius: 5px 5px;
    cursor: pointer;
  }
  .colPkSelect{
    border: 2px solid;
  }
  .redBg{
    background-color: rgba(229,62,62,var(--bg-opacity));
    background-color: #e53e3e;
  }
  .blueBg{
    background-color: rgba(66,153,225,var(--bg-opacity));
    background-color: #4299e1;
  }
  .pupleBg{
    background-color: rgba(102,126,234,var(--bg-opacity));
    background-color: #667eea;
  }
  .greenBg{
    background-color: rgba(56,178,172,var(--bg-opacity));
    background-color: #38b2ac;
  }
  .orangeBg{
    background-color: rgba(237,137,54,var(--bg-opacity));
    background-color: #ed8936;
  }
  .pinkBg{
    background-color: rgba(237,100,166,var(--bg-opacity));
    background-color: #ed64a6;
  }
</style>