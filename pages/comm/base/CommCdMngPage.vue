-<template>
  <div>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <kcard>
          <cardBody>
          <v-row>
            <v-col :cols="5">
              <v-row class="search-box" align="center" no-gutters>
                <v-col :cols="4">
                  <Label>
                    <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                    {{$t('CommCdMngPage.label1')}}
                  </Label>
                </v-col>
                <v-col :cols="8">
                  <InputText
                    :searchOption="true"
                    :dataNm="'commGrpCd'"
                    :boxWidth="'90%'"
                    @input-text-set="searchInputValSet"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="5">
              <v-row class="search-box" align="center" no-gutters>
                <v-col :cols="4">
                  <Label>
                    <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                    {{$t('CommCdMngPage.label2')}}
                  </Label>
                </v-col>
                <v-col :cols="8">
                  <InputText
                    :searchOption="true"
                    :dataNm="'commGrpCdNm'"
                    :boxWidth="'90%'"
                    @input-text-set="searchInputValSet"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="2" class="text-right">
                <kbutton :theme-color="'primary'" @click="search">{{$t('CommLang.btn.selectBtn')}}</kbutton>
            </v-col>
          </v-row>
          <v-row>
            <v-col :cols="5">
              <v-row class="search-box" align="center" no-gutters>
                <v-col :cols="4">
                  <Label>
                    <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                    {{$t('CommLang.label.label7')}}
                  </Label>
                </v-col>
                <v-col :cols="8">
                  <SelectCommCd
                      :sendParam="{ commGrpCdId: '112', useFg: '1' }"
                      :addAll="true"
                      :searchOption="true"
                      :boxWidth="'90%'"
                      :dataNm="'useFgCd'"
                      @comm-cd-set="searchSelectValSet"></SelectCommCd>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="4">
        <kcard ref="gridCard" :style="{height : '100%'}">
          <cardBody>
            <div class="d-flex align-center justify-space-between pa-2">
            <CardTitle>{{$t('CommCdMngPage.label5')}}</CardTitle>
            <div>
            <kbutton :theme-color="'primary'" @click="insert">{{$t('CommLang.btn.addBtn')}}</kbutton>
            <kbutton :theme-color="'primary'" @click="remove">{{$t('CommLang.btn.removeBtn')}}</kbutton>
            <kbutton :theme-color="'primary'" @click="rowGridSave">{{$t('CommLang.btn.saveBtn')}}</kbutton>
          </div>
          </div>
            <div ref="divWrapper">
            <KendoGrid ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridItems"
                  :sortable="true"
                  :columns = "columns"
                  :resizable="false"
                  :selected-field="selectedField"
                  @gridrowclick="onRowClick">
              </KendoGrid>
            </div>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="8">
        <kcard :style="{height : '100%'}">
          <cardBody :style="{width:'100%'}">
            <CardTitle>{{$t('CommCdMngPage.label6')}}</CardTitle>
            <TabStrip :selected="selected" @select="onSelect" :tabs="tabs">
              <template v-slot:grpCdInfoTab>
                  <div>
                    <v-row>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('CommCdMngPage.label1')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <InputText
                              ref="commGrpCd"
                              :required="true"
                              :boxWidth="'90%'"
                              :dataNm="'commGrpCd'"
                              @input-text-set="formInputValSet"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('CommCdMngPage.label2')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <InputText
                              ref="commGrpCdNm"
                              :required="true"
                              :boxWidth="'90%'"
                              :dataNm="'commGrpNm'"
                              @input-text-set="formInputValSet"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('CommLang.label.label7')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <Checkbox
                            ref="useFg"
                            :required="true"
                            :dataNm="'useFg'"
                            @checkbox-set="formCheckValSet"
                            ></Checkbox>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col :cols="12">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="2">
                            <Label>
                              <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('CommLang.label.label1')}}
                            </Label>
                          </v-col>
                          <v-col :cols="10">
                            <InputText
                              ref="rmrk"
                              :dataNm="'rmrk'"
                              @input-text-set="formInputValSet"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </div>
              </template>
              <template v-slot:commCdTab>
                <div>
                <div class="d-flex align-center justify-space-between pa-2">
                  <CardTitle>{{$t('CommCdMngPage.label7')}}</CardTitle>
                  <div>
                    <kbutton :theme-color="'primary'" @click="insert2">{{$t('CommLang.btn.addBtn')}}</kbutton>
                    <kbutton :theme-color="'primary'" @click="remove2">{{$t('CommLang.btn.removeBtn')}}</kbutton>
                    <kbutton :theme-color="'primary'" @click="rowGridSave2">{{$t('CommLang.btn.saveBtn')}}</kbutton>
                  </div>
                </div>
                <div ref="divWrapper2">
                  <KendoGrid ref="rowGrid2"
                        :gridHeight="gridHeight2"
                        :gridItems="gridItems2"
                        :gridData="gridData2"
                        :columns = "columns2"
                        :resizable="true"
                        :selected-field="selectedField2"
                        :edit-field="'inEdit'"
                        :gridIdx="1"
                        :gridDropDownList="gridDropDownList"
                        @griditemchange="itemChange"
                        @gridrowclick="onRowClick2"
                        @gridddchang="ddChange">
                    </KendoGrid>
                  </div>
                </div>
              </template>
            </TabStrip>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import { Card, CardBody, CardTitle, CardActions, TabStrip} from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import SelectCommCd from "@/components/common/search/SelectCommCd.vue"
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import KendoGrid from "@/components/common/KendoGrid.vue"
import Utility from "~/plugins/utility";

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
    "kbutton": Button,
    "kcard" : Card,
    CardBody,
    CardTitle,
    CardActions,
    SelectCommCd,
    InputText,
    TabStrip,
    Checkbox,
    DropDownList,
    KendoGrid,
    Utility
  },
  data() {
    return {
      selected: 0,
      // sysDivCd : null,
      useFgCd : null,
      commGrpCd : null,
      commGrpCdNm : null,
      columns: [],
      columns2: [],
      selectedField: 'selected',
      selectedID: 0,
      selectedData: [],
      selectedField2: 'selected',
      selectedID2: 0,
      selectedData2: [],
      sort: [
        { field: 'sysDiv', dir: 'asc' }
      ],
      gridHeight : '0px',
      gridHeight2 : '0px',
      gridData : [],
      gridData2 : [],
      tabs: [
          {
            title: this.$i18n.t('CommCdMngPage.label1'),
            content: 'grpCdInfoTab',
          },
          {
            title: this.$i18n.t('CommCdMngPage.label3'),
            content: 'commCdTab',
          }
      ],
      gridDropDownList:[
        {
          dataVal : 'useFg',
          dataItem: ['사용', '사용안함']
        }
      ]
    };
  },
  computed: {
    gridItems() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.idx === this.selectedID,
      }));
    },
    gridItems2() {
      return this.gridData2.map((item) => ({
        ...item,
        selected: item.idx === this.selectedID2,
        inEdit: item.idx === this.selectedID2,
        useFg: item.useFg == "1" ? "사용" : "사용안함"
      }));
    },
  },
  watch: {
  },
  beforeCreate() {
  },
  mounted(){
    this.gridHeight = (this.$refs.contents.offsetHeight - 90) +'px';
    this.gridHeight2 = (this.$refs.contents.offsetHeight - 250) +'px';
    this.gridInit();
  },
  methods: {
    search(){
      this.gridDataSelect();
    },
    searchInputValSet(nm, val){
      this[nm] = val;
      this.search();
    },
    searchSelectValSet(nm,txt, val){
      this[nm] = val;
      this.search();
    },
    formInputValSet(nm, val){
      this.selectedData[nm] = val;
      const index = this.gridData.findIndex(p => p.idx === this.selectedData.idx);
      if(this.selectedData.rowStat == ''){
        this.selectedData.rowStat = "U";
      }
      this.gridData.splice(index, 1, this.selectedData);
    },
    formSelectValSet(nm,txtNm, val, txt){
      this.selectedData[nm] = val;
      this.selectedData[txtNm] = txt;
      const index = this.gridData.findIndex(p => p.idx === this.selectedData.idx);
      if(this.selectedData.rowStat == ''){
        this.selectedData.rowStat = "U";
      }
      this.gridData.splice(index, 1, this.selectedData);
    },
    formCheckValSet(nm, val){
      this.selectedData[nm] = val?"사용":"사용안함";
      const index = this.gridData.findIndex(p => p.idx === this.selectedData.idx);
      if(this.selectedData.rowStat == ''){
        this.selectedData.rowStat = "U";
      }
      this.gridData.splice(index, 1, this.selectedData);
    },
    gridInit(){
      this.columns = [
        { field: 'commGrpCd', editable: false, title: this.$i18n.t('CommCdMngPage.label1'),   width: this.setPer("divWrapper",30), cell:"crudCellTemplate"},
        { field: 'commGrpNm', editable: false, title: this.$i18n.t('CommCdMngPage.label2'), width: this.setPer("divWrapper",40)},
        { field: 'useFg',     editable: false, title: this.$i18n.t('CommLang.label.label7'),    width: this.setPer("divWrapper",20)}
      ];

      this.columns2 = [
        { field: 'commGrpCd',     editable: true, title: this.$i18n.t('CommCdMngPage.label1'),     width: this.setPer("divWrapper",20), cell:"crudCellTemplate"},
        { field: 'commCd',        editable: true, title: this.$i18n.t('CommCdMngPage.label3'),        width: this.setPer("divWrapper",30)},
        { field: 'commCdNm',      editable: true, title: this.$i18n.t('CommCdMngPage.label4'),      width: this.setPer("divWrapper", 50)},
        { field: 'sortSeq',       editable: true, title: this.$i18n.t('CommCdMngPage.label8'),     width: this.setPer("divWrapper",20)},
        { field: 'useFg',         editable: true, title: this.$i18n.t('CommCdMngPage.label8'),     width: this.setPer("divWrapper", 30), cell:'useFg'},
        { field: 'rmrk',          editable: true, title: this.$i18n.t('CommLang.label.label1'),        width: this.setPer("divWrapper", 50)},
      ]

      this.gridDataSelect();
    },
    async onRowClick(event){
      if(event.dataItem){
        this.selectedID = event.dataItem.idx;
        this.selectedData = event.dataItem;
        this.$refs['commGrpCd'].textVal = event.dataItem.commGrpCd;
        this.$refs['commGrpCdNm'].textVal = event.dataItem.commGrpNm;
        //this.$refs['sysDiv'].setCommCd(event.dataItem.sysDiv);
        this.$refs['rmrk'].textVal = event.dataItem.rmrk ? event.dataItem.rmrk : "";
        this.$refs['useFg'].chkValue = event.dataItem.useFg == "사용" ? true : false ;
        if(event.dataItem.commGrpCd != ""){
          const res = await this.getListReturn({
            apiKey: "common/code/search",
            resKey: "commCdData",
            sendParam: {
              commGrpCdId: this.selectedData.commGrpCdId
            }
          });
          const newRes = res.map(item => {
            const newObj = {
              ...item,
              commCd: item.commCd || "",
              commCdNm: item.commCdNm || "",
              commCdAbbrnm: item.commCdAbbrnm || "",
              sortSeq: item.sortSeq || "",
              useFg: item.useFg || "",
              userDefVal1: item.userDefVal1 || "",
              userDefVal2: item.userDefVal2 || "",
              userDefVal3: item.userDefVal3 || "",
              rmrk: item.rmrk || "",
              rowStat: null
            };
            return newObj;
          });
          this.gridData2 = newRes.map((item,i) => ({
            ...item,
            selected: i === this.selectedID2,
            idx: i,
            rowStat: ""
          }));
          this.onRowClick2({dataItem : this.gridData2[0]});
        }
      }
    },
    async onRowClick2(event){
      if(event.dataItem){
      this.selectedID2 = event.dataItem.idx;
      this.selectedData2 = event.dataItem;
      event.dataItem.inEdit = true;
      }
    },
    insert() {
      this.selectedID = "";
      const newRecord = { sysDiv:"", commGrpCd:"", commGrpNm:"", useFg:"사용", rowStat:"I", idx:this.gridData.length+1 };
      const data = this.gridData.slice();
      data.unshift(newRecord);
      this.gridData = data;
      this.onRowClick({dataItem : newRecord});
    },
    remove(){
      const index = this.gridData.findIndex(p => p.idx === this.selectedData.idx);
      this.selectedData.rowStat = "D";
      this.gridData.splice(index, 1, this.selectedData);
    },
    insert2() {
      this.selectedID2 = "";
      const newRecord = { commGrpCdId:this.selectedData.commGrpCdId,
          commGrpCd:this.selectedData.commGrpCd,
          commCd:"",
          commCdNm:"",
          commCdAbbrnm:"",
          sortSeq:"",
          useFg:"1",
          userDefVal1:"",
          userDefVal2:"",
          userDefVal3:"",
          rmrk:"",
         rowStat:"I", idx:this.gridData2.length+1 };
      const data = this.gridData2.slice();
      data.unshift(newRecord);
      this.gridData2 = data;
      this.onRowClick2({dataItem : newRecord});
    },
    remove2(){
      const index = this.gridData2.findIndex(p => p.idx === this.selectedData2.idx);
      this.selectedData2.rowStat = "D";
      this.gridData2.splice(index, 1, this.selectedData2);
    },
    async gridDataSelect(){
      const res = await this.getListReturn({
        apiKey: "common/group-code/search",
        resKey: "commGrpCdData",
        sendParam: {
          commGrpCd: this.commGrpCd,
          commGrpNm: this.commGrpCdNm,
          // sysDivCd: this.sysDivCd,
          useFg: this.useFgCd
        }
      });
      this.gridData = res.map((item,i) => ({
        ...item,
        selected: i === this.selectedID,
        idx: i,
        useFg : item.useFg == "1" ? "사용" : "사용안함",
        rowStat: ""
      }));
      if(this.gridData.length > 0);
      this.onRowClick({dataItem : this.gridData[0]});
    },
    async rowGridSave(){
      let dataArr = [];
      let insertDataArr = [];
      let updateDataArr = [];
      let deleteDataArr = [];
      let validCheck = true;
      this.gridData.filter(item => {
        if(item.rowStat == "I" || item.rowStat == "U"){
          dataArr.push(item);
        }
        if(item.rowStat == "I"){
          insertDataArr.push(item);
        }
        if(item.rowStat == "U"){
          updateDataArr.push(item);
        }
        if(item.rowStat == "D"){
          deleteDataArr.push(item);
        }
      });
      dataArr.filter(item =>{
        if(item.commGrpCd == "" || item.commGrpNm == ""){
          this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');
          this.$refs['alertPop'].message = this.$i18n.t('CommLang.message.msg2');
          this.$refs['alertPop'].modalWidth = "300px";
          this.$refs['alertPop'].visibleDialog = true;
          validCheck = false;
        }
      });
      if (validCheck) {
        if (insertDataArr.length > 0) {
          await this.postInsertReturn({
            apiKey: "common/group-code",
            sendParam: insertDataArr.map(item => ({
                ...item,
                useFg : item.useFg == "사용" ? "1" : "0"
              })
            )
          });
        }

        if (updateDataArr.length > 0) {
          await this.putUpdateReturn({
            apiKey: "common/group-code",
            sendParam: updateDataArr.map(item => ({
                ...item,
                useFg : item.useFg == "사용" ? "1" : "0"
              })
            )
          });
        }

        if (deleteDataArr.length > 0) {
          await this.deleteDeleteReturn({
            apiKey: "common/group-code",
            sendParam: deleteDataArr
          });
        }
        this.search();
      } else {
        this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');;
        this.$refs['alertPop'].message = this.$i18n.t('CommLang.message.msg1');
        this.$refs['alertPop'].modalWidth = "300px";
        this.$refs['alertPop'].visibleDialog = true;
      }
    },
    async rowGridSave2(){
      let dataArr = [];
      let insertDataArr = [];
      let updateDataArr = [];
      let deleteDataArr = [];
      let validCheck = true;
      this.gridData2.filter(item => {
        if(item.rowStat == "I" || item.rowStat == "U"){
          dataArr.push(item);
        }
        if(item.rowStat == "I"){
          insertDataArr.push(item);
        }
        if(item.rowStat == "U"){
          updateDataArr.push(item);
        }
        if(item.rowStat == "D"){
          deleteDataArr.push(item);
        }
      });
      dataArr.filter(item =>{
        if(item.commCd == "" || item.commCdNm == ""){
          this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');
          this.$refs['alertPop'].message = this.$i18n.t('CommLang.message.msg2');
          this.$refs['alertPop'].modalWidth = "300px";
          this.$refs['alertPop'].visibleDialog = true;
          validCheck = false;
        }
      });
      if (validCheck) {
        if (insertDataArr.length > 0) {
          await this.postInsertReturn({
            apiKey: "common/code",
            sendParam: insertDataArr
          });
        }

        if (updateDataArr.length > 0) {
          await this.putUpdateReturn({
            apiKey: "common/code",
            sendParam: updateDataArr
          });
        }

        if (deleteDataArr.length > 0) {
          await this.deleteDeleteReturn({
            apiKey: "common/code",
            sendParam: deleteDataArr
          });
        }
        this.search();
      } else {
        this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');;
        this.$refs['alertPop'].message = this.$i18n.t('CommLang.message.msg1');
        this.$refs['alertPop'].modalWidth = "300px";
        this.$refs['alertPop'].visibleDialog = true;
      }
    },
    onSelect: function (e) {
      this.selected = e.selected;
    },
    itemChange: function (e) {
        const data = this.gridData2.slice();
        const index = data.findIndex(d => d.idx === e.dataItem.idx);
        data[index] = { ...data[index], [e.field]: e.value };
        if(data[index].rowStat == ''){
          data[index].rowStat = "U";
        }
        this.gridData2 = data;
    },
    ddChange: function (e, name, dataItem) {
      const data = this.gridData2.slice();
      const index = data.findIndex(d => d.idx === dataItem.idx);
      if(name == "useFg"){
        e.value = e.value == "사용" ? "1" : "0"
      }
      data[index] = { ...data[index], [name]: e.value };
      if(data[index].rowStat == ''){
          data[index].rowStat = "U";
      }
      this.gridData2 = data;
    },
  }
};
</script>
<style lang="scss">

</style>
