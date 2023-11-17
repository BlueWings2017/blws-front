<template>
  <div>
  <v-row ref="searchFilter">
      <v-col :cols="12">
        <kcard>
          <cardBody>
          <v-row>
            <v-col :cols="4">
              <v-row class="search-box" align="center" no-gutters>
              <v-col :cols="4">
              <Label>
                <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                {{$t('RoleMngPage.label1')}}
              </Label>
              </v-col>
              <v-col :cols="8">
              <InputText
                :searchOption="true"
                :dataNm="'roleId'"
                :boxWidth="'90%'"
                @input-text-set="searchInputValSet"
              />
              </v-col>
              </v-row>
            </v-col>
            <v-col :cols="4">
              <v-row class="search-box" align="center" no-gutters>
              <v-col :cols="4">
              <Label>
                <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                {{$t('RoleMngPage.label2')}}
              </Label>
              </v-col>
              <v-col :cols="8">
              <InputText
                :searchOption="true"
                :dataNm="'roleNm'"
                :boxWidth="'90%'"
                @input-text-set="searchInputValSet"
              />
              </v-col>
              </v-row>
            </v-col>
            <v-col :cols="4" class="text-right">
                <kbutton :theme-color="'primary'" @click="search">{{$t('CommLang.btn.selectBtn')}}</kbutton>
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
            <CardTitle>{{$t('RoleMngPage.label3')}}</CardTitle>
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
            <CardTitle>{{$t('RoleMngPage.label4')}}</CardTitle>
                <div>
                    <v-row>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="4">
                        <Label>
                          <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                          {{$t('RoleMngPage.label1')}}
                        </Label>
                        </v-col>
                        <v-col :cols="8">
                        <InputText
                          ref="roleId"
                          :required="true"
                          :boxWidth="'90%'"
                          :dataNm="'roleId'"
                          :disabled="true"
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
                          {{$t('RoleMngPage.label2')}}
                        </Label>
                        </v-col>
                        <v-col :cols="8">
                        <InputText
                          ref="roleNm"
                          :required="true"
                          :boxWidth="'90%'"
                          :dataNm="'roleNm'"
                          @input-text-set="formInputValSet"
                        />
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
                          :boxWidth="'90%'"
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
                          <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                          {{$t('CommLang.label.label2')}}
                        </Label>
                        </v-col>
                        <v-col :cols="8">
                        <InputText
                          ref="regUserNo"
                          :boxWidth="'90%'"
                          :dataNm="'regUserNo'"
                          :disabled="true"
                          @input-text-set="formInputValSet"
                        />
                        </v-col>
                        </v-row>
                      </v-col>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="4">
                        <Label>
                          <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                          {{$t('CommLang.label.label3')}}
                        </Label>
                        </v-col>
                        <v-col :cols="8">
                        <InputText
                          ref="regDttm"
                          :boxWidth="'90%'"
                          :dataNm="'regDttm'"
                          :disabled="true"
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
                          <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                          {{$t('CommLang.label.label4')}}
                        </Label>
                        </v-col>
                        <v-col :cols="8">
                        <InputText
                          ref="procUserNo"
                          :boxWidth="'90%'"
                          :dataNm="'procUserNo'"
                          :disabled="true"
                          @input-text-set="formInputValSet"
                        />
                        </v-col>
                        </v-row>
                      </v-col>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                        <v-col :cols="4">
                        <Label>
                          <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                          {{$t('CommLang.label.label5')}}
                        </Label>
                        </v-col>
                        <v-col :cols="8">
                        <InputText
                          ref="procDttm"
                          :boxWidth="'90%'"
                          :dataNm="'procDttm'"
                          :disabled="true"
                          @input-text-set="formInputValSet"
                        />
                        </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </div>
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
import Utility from "~/plugins/utility";
import SelectCommCd from "@/components/common/search/SelectCommCd.vue"
import InputText from "@/components/common/input/InputText";
import { Card, CardBody, CardTitle, CardActions } from "@progress/kendo-vue-layout";
import KendoGrid from "@/components/common/KendoGrid.vue"
import { Button } from "@progress/kendo-vue-buttons";
import Checkbox from "@/components/common/input/Checkbox";
import { Label } from "@progress/kendo-vue-labels";
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
    SelectCommCd,
    InputText,
    CardBody, 
    CardTitle, 
    CardActions,
    KendoGrid,
    "kbutton": Button,
    "kcard" : Card,
    Utility,
    Checkbox,
    Label
  },
  data() {
    return {
      roleNm : null,
      roleId : null,
      // useFg : null,
      selected: 0,
      columns: [],
      selectedField: 'selected',
      selectedID: 0,
      selectedData: [],
      gridHeight : '0px',
      gridData : [],
      label1 : this.$i18n.t('RoleMngPage.label1'),
      label2 : this.$i18n.t('RoleMngPage.label2')
    };
  },
  computed: {
    gridItems() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.idx === this.selectedID,
      }));
    },
  },
  watch: {
  },
  beforeCreate() {
  },
  mounted(){
    this.gridHeight = (this.$refs.contents.offsetHeight - 90) +'px';
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
        { field: 'roleId',  editable: false, title: this.label1, width: this.setPer("divWrapper",48), cell:"crudCellTemplate"},
        { field: 'roleNm', editable: false, title: this.label2,   width: this.setPer("divWrapper",48)},
        // { field: 'roleId',  editable: false, title: '권한코드', width: this.setPer("divWrapper",48), cell:"crudCellTemplate"},
        // { field: 'roleNm', editable: false, title: '권한명',   width: this.setPer("divWrapper",48)},
        // { field: 'useFg', editable: false, title: '사용여부', width: this.setPer("divWrapper",33)},
      ];
      this.gridDataSelect();
    },
    async gridDataSelect(){
      let sendParam = {
        roleId : this.roleId,
        roleNm : this.roleNm
      }
      let res = await this.getListReturn({
        apiKey: "common/role/search",
        sendParam : sendParam
      });
      res = res.map((item,i)=> {
        const newItem = {
          ...item,
          rowStat: null,
          selected: i === this.selectedID,
          idx: i,
          rowStat: ""
        };
        return newItem;
      });
      this.gridData = res;
      if(this.gridData.length > 0);
      this.onRowClick({dataItem : this.gridData[0]});
    },
    async onRowClick(event){
      if(event.dataItem){
        this.selectedID = event.dataItem.idx;
        this.selectedData = event.dataItem;
        this.$refs['roleId'].textVal = event.dataItem.roleId;
        this.$refs['roleNm'].textVal = event.dataItem.roleNm;
        this.$refs['rmrk'].textVal = event.dataItem.rmrk ? event.dataItem.rmrk : "";
        // this.$refs['useFg'].chkValue = event.dataItem.useFg == "사용" ? true : false ;

        this.$refs['regUserNo'].textVal = event.dataItem.regUserNo;
        this.$refs['regDttm'].textVal = event.dataItem.regDttm;
        this.$refs['procUserNo'].textVal = event.dataItem.procUserNo;
        this.$refs['procDttm'].textVal = event.dataItem.procDttm;
      }
    },
    insert() {
      this.selectedID = "";
      const newRecord = { roleId:"", roleNm:"", rmrk:"", rowStat:"I", idx:this.gridData.length+1 };
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
    async rowGridSave(){
      let dataArr = [];
      let insertDataArr = [];
      let updateDataArr = [];
      let deleteDataArr = [];
      var validCheck = true;
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
          if(item.roleNm == ""){
            this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');
            this.$refs['alertPop'].message = this.$i18n.t('CommLang.message.msg2');
            this.$refs['alertPop'].modalWidth = "300px";
            this.$refs['alertPop'].visibleDialog = true;
            validCheck = false;
          }
      });
      if(validCheck){
        if (insertDataArr.length > 0) {
          await this.postInsertReturn({
            apiKey: "common/role",
            sendParam: insertDataArr
          });
        }

        if (updateDataArr.length > 0) {
          await this.putUpdateReturn({
            apiKey: "common/role",
            sendParam: updateDataArr
          });
        }

        if (deleteDataArr.length > 0) {
          await this.deleteDeleteReturn({
            apiKey: "common/role",
            sendParam: deleteDataArr
          });
        }
        this.search();
      }
    },
  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>