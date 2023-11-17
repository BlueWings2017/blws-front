<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>Lot관리</li>
    </ol>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="8" :lg="9">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <Label>
                      제품코드
                    </Label>
                    <InputText
                      ref="productid"
                      :boxWidth="'98%'"
                      :dataNm="'productid'"
                      :readonly="true"
                      :defaultValue="productid"
                      @input-text-set="searchInput"
                    />
                    <Button :theme-color="'secondary'" :size="'medium'" @click="searchModalVisible = true" >선택</Button>
                  </div>
                  <div class="form-group">
                    <label>시작 일자</label>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="fromdate"
                        :name="'fromdate'"
                        :format="'yyyy-MM-dd'"
                        :default-value="new Date(fromdate)"
                        @change="fromChange"
                      />
                    </div>
                    <span class="i_tilde">~</span>
                    <div class="form-datepicker">
                      <DatePicker
                        ref="todate"
                        :name="'todate'"
                        :format="'yyyy-MM-dd'"
                        :default-value="new Date(todate)"
                        @change="toChange"
                      />
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col :sm="2" :lg="3" align="right">
                <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="searchBtn">조회</Button>
                <!-- <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="saveBtn">저장</Button> -->
                <!-- <Button icon="save" @click="toggleDialog">테스트</Button> -->
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <TabStrip
              :selected="selected"
              @select="onSelect"
              :tabs="tabs"
              :style="{ width: '100%' }"
            >
              <template v-slot:Hold>
                <Hold
                  ref="Hold"
                  :gridHeight="gridHeight"
                  :gridHeight2="gridHeight2"
                  :gridHeight3="gridHeight3"
                  :viewParam="{
                    fromdate: fromdate,
                    todate: todate,
                    lotid: '',
                    productid: productid,
                    holdstate: 'NotOnHold'
                  }"
                  @saveCallBack="saveCallBack"
                />

              </template>

              <template v-slot:Release>
                <Release
                  v-if="v1"
                  ref="Release"
                  :gridHeight="gridHeight"
                  :gridHeight2="gridHeight2"
                  :gridHeight3="gridHeight3"
                  :viewParam="{
                    fromdate:fromdate,
                    todate:todate,
                    lotid:'',
                    productid:productid,
                    holdstate:'OnHold'
                  }"
                  @saveCallBack="saveCallBack"
                />
              </template>

              <template v-slot:LotScrap>
                <LotScrap
                  v-if="v2"
                  ref="LotScrap"
                  :gridHeight="gridHeight"
                  :gridHeight2="gridHeight2"
                  :gridHeight3="gridHeight3"
                  :viewParam="{
                    fromdate:fromdate,
                    todate:todate,
                    lotid:'',
                    productid:productid,
                    holdstate:''
                  }"
                  @saveCallBack="saveCallBack"
                />
              </template>

              <template v-slot:LotUnScrap>
                <LotUnScrap
                  v-if="v3"
                  ref="LotUnScrap"
                  :gridHeight="gridHeight"
                  :gridHeight2="gridHeight2"
                  :gridHeight3="gridHeight3"
                  :viewParam="{
                    fromdate:fromdate,
                    todate:todate,
                    lotid:'',
                    productid:productid,
                    holdstate:''
                  }"
                  @saveCallBack="saveCallBack"
                />
              </template>

            </TabStrip>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
    <ConfirmPop ref="confirmPop" 
      :is="'confirmPop'" 
      :visibleDialog = false />
    <SelectModelingConfirm
      ref="SelectModelingConfirm"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :callBack="()=>{}"
      @visibleDialog="(val) => searchModalVisible = val"
      @productCode="productCode"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import { Card, CardBody, CardTitle, TabStrip } from "@progress/kendo-vue-layout";
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import { Button } from "@progress/kendo-vue-buttons";
import utils from "~/plugins/utils";
import InputText from "@/components/common/input/InputText";
import { DatePicker } from '@progress/kendo-vue-dateinputs';
import SelectModelingConfirm from "@/components/frmLotManagementTabs/SelectModelingConfirm";
import Hold from "@/components/frmLotManagementTabs/Hold";
import Release from "@/components/frmLotManagementTabs/Release";
import LotScrap from "@/components/frmLotManagementTabs/LotScrap";
import LotUnScrap from "@/components/frmLotManagementTabs/LotUnScrap";

let myTitle;
let myMenuId;
const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth();   // 월
let day = d.getDate();      // 일
let fromdate = new Date(year, month, day - 7);
let todate = d;

export default {
  mixins: [mixinGlobal],
  async asyncData(context) {
    const myState = context.store.state;
    myMenuId = context.route.query.menuId;
    await context.store.commit("setActiveMenuInfo", myState.menuData[myMenuId]);
    myTitle = await myState.activeMenuInfo.menuNm;
  },
  meta: {
    title: () => {
      return myTitle;
    },
    menuId: myMenuId,
    closable: true,
  },
  components: {
    Utility,
    Card,
    Button,
    CardBody,
    CardTitle,
    TabStrip,
    InputText,
    DatePicker,
    SelectModelingConfirm,
    Hold,
    Release,
    LotScrap,
    LotUnScrap,
    Window,
    Dialog,
    DialogActionsBar
  },
  data() {
    return {
      selected: 0,
      tabs: [
        {title: "Hold",content: "Hold"},
        {title: "Release", content: "Release"},
        {title: "LotScrap",content: "LotScrap",},
        {title: "LotUnScrap",content: "LotUnScrap",},
      ],
      gridHeight: (window.innerHeight || document.body.clientHeight)/3*2 + "px",
      gridHeight2: (window.innerHeight || document.body.clientHeight)/6*2 + "px",
      gridHeight3: (window.innerHeight || document.body.clientHeight)/9*2 + "px",
      v1: false,
      v2: false,
      v3: false,
      searchModalVisible: false,
      productid: "",
      fromdate: Utility.setFormatDate(fromdate.toLocaleDateString(), 'YYYY-MM-DD'),
      todate: Utility.setFormatDate(todate, 'YYYY-MM-DD'),
      visibleDialog: false
    };
  },
  created() {
  },
  async mounted() {
    this.fromdate = Utility.setFormatDate(this.fromdate, 'YYYYMMDD');
    this.todate = Utility.setFormatDate(this.todate, 'YYYYMMDD');
  },
  computed: {
    // ...mapState({
    //   frmPRC_Data: state => state.modules.frmPRC.frmPRC_Data
    // }),
  },
  watch: {},
  methods: {
    // ...mapActions({
    //   frmPRC: "modules/frmPRC/setDataAction",
    // }),
    onSelect(e) {
      this.selected = e.selected;
      if(this.selected === 1){
        if(this.v1){
          this.$refs.Release.searchBtn();
        } else {
          this.v1 = !this.v1
        }
      } else if(this.selected === 2){
        if(this.v2){
          this.$refs.Release.searchBtn();
        } else {
          this.v2 = !this.v2
        }
      } else if(this.selected === 3){
        if(this.v3){
          this.$refs.LotUnScrap.searchBtn();
        } else {
          this.v3 = !this.v3
        }
      } else {
        this.$refs.Hold.searchBtn();
      }
    },
    selectBtn(){
    },
    searchBtn(){
      if(this.selected === 0){
        this.$refs.Hold.searchBtn();
      }else if(this.selected === 1){
        this.$refs.Release.searchBtn();
      }else if(this.selected === 2){
        this.$refs.LotScrap.searchBtn();
      }else if(this.selected === 3){
        this.$refs.LotUnScrap.searchBtn();
      }
    },
    // saveBtn(){
    //   if(this.selected === 0){
    //     this.$refs.Hold.saveBtn();
    //   }else if(this.selected === 1){
    //     this.$refs.Release.saveBtn();
    //   }else if(this.selected === 2){
    //     this.$refs.LotScrap.saveBtn();
    //   }else if(this.selected === 3){
    //     this.$refs.LotUnScrap.saveBtn();
    //   }
      
    // },
    searchInput(nm, val){
      this[nm] = val;
    },
    toChange(e){
      this.todate = Utility.setFormatDate(e.value, 'YYYYMMDD');
    },
    fromChange(e){
      this.fromdate = Utility.setFormatDate(e.value, 'YYYYMMDD');
    },
    productCode(data){
      this.productid = data.PRODUCTID;
      // this.frmPRC(JSON.parse(JSON.stringify(data)));
      // this.$nuxt.$emit('iccReset');
      if(this.selected === 0){
        this.$refs.Hold.viewParam.productid = this.productid;
        this.$refs.Hold.searchBtn();
      }else if(this.selected === 1){
        this.$refs.Release.viewParam.productid = this.productid;
        this.$refs.Release.searchBtn();
      }else if(this.selected === 2){
        this.$refs.LotScrap.viewParam.productid = this.productid;
        this.$refs.LotScrap.searchBtn();
      }else if(this.selected === 3){
        this.$refs.LotUnScrap.viewParam.productid = this.productid;
        this.$refs.LotUnScrap.searchBtn();
      }
    },
    saveCallBack(callback) {
      if(callback){
        this.$refs.alertPop.show("Info", "저장되었습니다.");
      } else {
        this.$refs.alertPop.show("알림", "저장할 데이터가 존재하지 않습니다.");
      } 
      return;
    },
    toggleDialog() {
      // this.visibleDialog = !this.visibleDialog;
      this.$refs['confirmPop'].title = "confirm";
      this.$refs['confirmPop'].message = "message ~~"
      this.$refs['confirmPop'].callBack = this.searchBtn;
      this.$refs['confirmPop'].modalWidth = "300px";
      this.$refs['confirmPop'].visibleDialog = true;
    }
  },
  // watch:{
  //   vmodelReset(newVal, oldVal){
  //   }
  // },
};

const defaultData = {};
</script>
<style lang="scss">
.popup-content {
    padding: 30px !important;
    color: #787878 !important;
    background-color: #fcf7f8 !important;
    border: 1px solid rgba(0,0,0,.05) !important;
    width: 1000px !important;
    height: 500px !important;
}
</style>