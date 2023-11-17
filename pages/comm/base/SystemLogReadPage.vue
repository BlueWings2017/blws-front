<template>
  <div>
  <v-row ref="searchFilter">
      <v-col :cols="12">
        <kcard>
          <cardBody>
          <v-row>
            <v-col :cols="3">
              <DatePickerSingle
              ref="fromDt"
                :label="'조회기간'"
                :boxWidth="'90%'"
                :searchOption="true"
                :labelCols="4"
                :textCols="8"
                :defaultValue="new Date()" 
                :format="'yyyy-MM-dd'"
                :dataNm="'fromDt'"
                @input-date-set="searchDateValSet" >
              </DatePickerSingle>
            </v-col>
            <v-col :cols="3">
              <DatePickerSingle
                ref="toDt"
                :boxWidth="'60%'"
                :searchOption="true"
                :defaultValue="new Date()" 
                :format="'yyyy-MM-dd'"
                :dataNm="'toDt'"
                @input-date-set="searchDateValSet" >
              </DatePickerSingle>
            </v-col>
            <v-col :cols="3">
              <UserModal
                ref="UserModal"
                label="사용자"
                :searchOption="true"
                :labelCols="4"
                :textCols="8"
                :dataNm="'userList'"
                @input-text-set="searchInputValSet"
              ></UserModal>
            </v-col>
            <v-col :cols="3" class="text-right">
                <kbutton :theme-color="'primary'" @click="search">조회</kbutton>
            </v-col>
          </v-row>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12">
        <kcard :style="{height : '100%'}">
          <cardBody :style="{width:'100%'}">
            <TabStrip :selected="selected" @select="onSelect" :tabs="tabs">
              <template v-slot:loginHisTab>
                <div ref="divWrapper">
                  <KendoGrid ref="rowGrid"
                      :gridHeight="gridHeight"
                      :gridItems="gridItems"
                      :sortable="true"
                      :columns = "columns"
                      :resizable="false"
                      :selected-field="'selected'"
                      >
                  </KendoGrid>
                </div>
              </template>
              <template v-slot:menuHisTab>
                <div>
                  <KendoGrid ref="rowGrid2"
                      :gridHeight="gridHeight"
                      :gridItems="gridItems2"
                      :sortable="true"
                      :columns = "columns2"
                      :resizable="false"
                      :selected-field="'selected'"
                      >
                  </KendoGrid>
                </div>
              </template>
            </TabStrip>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
  </div>
  
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import { Card, CardBody, CardTitle, CardActions, TabStrip } from "@progress/kendo-vue-layout";
import KendoGrid from "@/components/common/KendoGrid.vue"
import UserModal from "@/components/common/modal/UserModal.vue"
import DatePickerSingle from "@/components/common/input/DatePickerSingle.vue"
import { Button } from "@progress/kendo-vue-buttons";
//import InputText from "@/components/common/input/InputText";
import { Input } from "@progress/kendo-vue-inputs";
let myTitle;
let myMenuId;
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
    closable: true
  },
  components: {
    CardBody, 
    CardTitle, 
    CardActions,
    KendoGrid,
    "kbutton": Button,
    "kcard" : Card,
    Utility,
    DatePickerSingle,
    TabStrip,
    UserModal,
    //InputText
    Input
  },
  data() {
    return {
      selected: 0,
      gridHeight : '0px',
      gridHeight2 : '0px',
      gridData : [],
      gridData2 : [],
      columns: [],
      columns2: [],
      fromDt: null,
      toDt: null,
      userList:[],
      defaultDate: new Date(),
      tabs: [
          {
            title: '로그인 이력',
            content: 'loginHisTab',
          },
          {
            title: '메뉴 접근 이력',
            content: 'menuHisTab',
          }
      ],
    };
  },
  computed: {
    gridItems() {
      return this.gridData;
    },
    gridItems2() {
      return this.gridData2;
    },
  },
  watch: {
  },
  beforeCreate() {
    
  },
  mounted(){
    var today = new Date();
    this.$refs["fromDt"].textVal = new Date(today.setMonth(today.getMonth() -1));
    this.$refs["toDt"].textVal = new Date();
    this.fromDt = Utility.setFormatDate(new Date(today.setMonth(today.getMonth())),'YYYY-MM-DD');
    this.toDt = Utility.setFormatDate(new Date(),'YYYY-MM-DD');
    this.gridHeight = (this.$refs.contents.offsetHeight - 120) +'px';
    this.gridHeight2 = (this.$refs.contents.offsetHeight - 120) +'px';
    this.gridInit();
  },
  methods: {
    search(){
      this.gridDataSelect();
    },
    searchDateValSet(nm, val){
      this[nm] = Utility.setFormatDate(val,'YYYY-MM-DD');
      
      this.search();
    },
    searchInputValSet(nm, val){
      this[nm] = val;
      this.search();
    },
    onSelect: function (e) {
      this.selected = e.selected;
    },
    gridInit(){
      this.columns = [
        { field: 'userNo',      editable: false, title: '사용자NO',   width: this.setPer("divWrapper",25)},
        { field: 'userLoginId', editable: false, title: '사용자ID',   width: this.setPer("divWrapper",25)},
        { field: 'userNm',      editable: false, title: '사용자명',   width: this.setPer("divWrapper",25)},
        { field: 'loginDttm',   editable: false, title: '로그인일시', width: this.setPer("divWrapper",25)}
      ];

      this.columns2 = [
        { field: 'userNo',        editable: true, title: '사용자NO',      width: this.setPer("divWrapper",20)},
        { field: 'userLoginId',   editable: true, title: '사용자ID',      width: this.setPer("divWrapper",20)},
        { field: 'userNm',        editable: true, title: '사용자명',       width: this.setPer("divWrapper",20)},
        { field: 'menuNm',        editable: true, title: '메뉴명',        width: this.setPer("divWrapper",20)},
        { field: 'menuCnctDttm',  editable: true, title: '메뉴 접근 일시',  width: this.setPer("divWrapper",20)},
      ]
      this.gridDataSelect();
    },
    async gridDataSelect(){
      if(this.fromDt > this.toDt){
         alert("시작일이 종료일보다 클 수 없습니다.");
         return false;
      }
      const sendParam = {
        comId: 'FEMS',
        userList: this.userList,
        frDttm: this.fromDt+" 00:00:00",
        endDttm: this.toDt+ " 23:59:59"
      };
      const resTab1 = await this.postApiReturn({
        apiKey: "selectLoginLog",
        resKey: "loginLogData",
        sendParam
      });
      const resTab2 = await this.postApiReturn({
        apiKey: "selectMenuCnctLog",
        resKey: "menuCnctLogData",
        sendParam
      });
      this.gridData = resTab1;
      this.gridData2 = resTab2;
    },
  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>