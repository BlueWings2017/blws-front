<template>
  <div>
    <v-row ref="contents">
      <v-col :cols="4">
        <kcard ref="gridCard" :style="{height : '100%'}">
          <cardBody>
            <div class="d-flex align-center justify-space-between pa-2">
            <CardTitle>{{$t('MenuMngPage.label1')}}</CardTitle>
            <div>
            <kbutton :theme-color="'primary'" @click="insert">{{$t('CommLang.btn.addBtn')}}</kbutton>
            <kbutton :theme-color="'primary'" :disabled="btnDis" @click="remove">{{$t('CommLang.btn.removeBtn')}}</kbutton>
            <kbutton :theme-color="'primary'" @click="rowGridSave">{{$t('CommLang.btn.saveBtn')}}</kbutton>
          </div>
          </div>
            <div ref="divWrapper">
              <TreeList
                :style="{height : gridHeight, overflow: 'auto',}"
                :data-items="gridItems"
                :sub-items-field="subItemsField"
                :expand-field="expandField"
                :columns="columns"
                :selected-field="selectedField"
                @datastatechange="handleDataStateChange"
                @expandchange="onExpandChange"
                @rowclick="onRowClick"
              >
              <template v-slot:crudCellTemplate="{props}">
                <td :style="cellBackground(props.dataItem)">
                    {{props.dataItem[props.field]}} 
                </td>
              </template>
              </TreeList>
            </div>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="8">
        <kcard :style="{height : '100%'}">
          <cardBody :style="{width:'100%'}">
            <CardTitle>{{$t('MenuMngPage.label2')}}</CardTitle>
            <div>
              <v-row>
                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                        {{$t('MenuMngPage.label3')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="menuId"
                        :boxWidth="'90%'"
                        :dataNm="'menuId'"
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
                        {{$t('MenuMngPage.label4')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="upMenuId"
                        :boxWidth="'90%'"
                        :dataNm="'upMenuId'"
                        :disabled="itemDis"
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
                        {{$t('MenuMngPage.label5')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="menuNm"
                        :boxWidth="'90%'"
                        :dataNm="'menuNm'"
                        :disabled="itemDis"
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
                        {{$t('MenuMngPage.label6')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="menuEngNm"
                        :boxWidth="'90%'"
                        :dataNm="'menuEngNm'"
                        :disabled="itemDis"
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
                        {{$t('MenuMngPage.label7')}}
                      </Label>
                    </v-col>
                    <v-col :cols="10">
                      <InputText
                        ref="url"
                        :boxWidth="'95%'"
                        :dataNm="'url'"
                        :disabled="itemDis"
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
                        {{$t('MenuMngPage.label8')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="sortSeq"
                        :boxWidth="'90%'"
                        :dataNm="'sortSeq'"
                        :disabled="itemDis"
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
                        {{$t('CommLang.label.label7')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <Checkbox
                        ref="useFg"
                        :dataNm="'useFg'"
                        :disabled="itemDis"
                        @checkbox-set="formCheckValSet"
                        ></Checkbox>
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

                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                        {{$t('MenuMngPage.label9')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <DropDownList
                        ref="role"
                        :style="{ width: '90%' }"
                        :disabled="itemDis"
                        v-model="role"
                        :value-primitive="true"
                        :text-field="'roleNm'"
                        :value-field="'roleId'"
                        :data-items="roleListList"
                        @change="formInputValSet('roleId', role)"
                      />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                        {{$t('MenuMngPage.label10')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="iconClass"
                        :boxWidth="'90%'"
                        :dataNm="'iconClass'"
                        :disabled="itemDis"
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
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import { TreeList, mapTree, extendDataItem, } from '@progress/kendo-vue-treelist';
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import { DropDownList } from '@progress/kendo-vue-dropdowns';

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
    menuId : myMenuId,
    closable: true
  },
  components: {
    Utility,
    SelectCommCd,
    "kcard" : Card,
    CardBody, 
    CardTitle,
    "kbutton": Button,
    TreeList,
    InputText,
    Checkbox,
    DropDownList
  },
  data() {
    return {
      sysDivCd : null,
      useFgCd : null,
      gridHeight : '0px',
      columns: [],
      gridData : [],
      expanded: ["0"],
      subItemsField: '_children',
      expandField: 'expanded',
      selectedField: 'selected',
      selectedID : 0,
      selectedData : [],
      baseData : [],
      itemDis : false,
      btnDis : false,
      role: {},
      roleListList: [],
      iconClass: "",
      gridColLabel1 : this.$i18n.t('MenuMngPage.label5'),
      gridColLabel2 : this.$i18n.t('CommLang.label.label7'),
    };
  },
  computed: {
    baseItems(){
      return this.baseData;
    },
    gridItems() {
      return this.addExpandField(this.gridData);
    },
  },
  watch: {
    async baseItems(val){
      const setTreeData = await this.setTree({
        treeKey: "MENU_ID",
        value: val
      });

      for(var i=0; i<this.baseData.length; i++){
        this.expanded.push(this.baseData[i].menuId);
      }
      this.gridData = setTreeData.ROOT;
    }
  },
  beforeCreate() {
  },
  mounted(){
    this.gridHeight = (this.$refs.contents.offsetHeight - 90) +'px';
    this.gridInit();
    this.getroleListList();
  },
  methods: {
    async getroleListList(){
      let res = await this.getListReturn({
        apiKey: "common/role/list"
      });
      this.roleListList = res
    },
    search(){
      this.gridDataSelect();
    },
    searchSelectValSet(nm,txt, val){
      this[nm] = val;
      this.search();
    },
    formInputValSet(nm, val){
      this.selectedData[nm] = val;
      const index = this.baseData.findIndex(p => p.idx === this.selectedData.idx);
      if(this.selectedData.rowStat == ''){
        this.selectedData.rowStat = "U";
      }
      this.baseData.splice(index, 1, this.selectedData);
    },
    formSelectValSet(nm,txtNm, val, txt){
      this.selectedData[nm] = val;
      this.selectedData[txtNm] = txt;
      const index = this.baseData.findIndex(p => p.idx === this.selectedData.idx);
      if(this.selectedData.rowStat == ''){
        this.selectedData.rowStat = "U";
      }
      this.baseData.splice(index, 1, this.selectedData);
    },
    formCheckValSet(nm, val){
      this.selectedData[nm] = val?"1":"0";
      this.selectedData.useFgNm = val ?"사용":"미사용";
      const index = this.baseData.findIndex(p => p.idx === this.selectedData.idx);
      if(this.selectedData.rowStat == ''){
        this.selectedData.rowStat = "U";
      }
      this.baseData.splice(index, 1, this.selectedData);
    },
    gridInit(){
      this.columns = [
        { field: '',  editable: false, title: '', width: '50px', cell:"crudCellTemplate"},
        { field: 'menuNm',  editable: false, title: this.gridColLabel1, width: this.setPer("divWrapper",78),  expandable: true,},
        { field: 'useFgNm',  editable: false, title: this.gridColLabel2, width: this.setPer("divWrapper",20)},
      ];
      this.gridDataSelect();
    },
    async gridDataSelect(){
      let res = await this.getListReturn({
        apiKey: "common/menu/list"
      });
      res.menuList.push({
        children : null,
        id : 0,
        idx : res.menuList.length +1,
        level : null,
        menuId : "0",
        menuIdNm : "ROOT",
        menuNm : "ROOT",
        menuEngNm : "ROOT",
        parentId : null,
        parentsId : null,
        procDttm : null,
        procUserNo : null,
        regDttm : null,
        regUserNo : null,
        rowStat : "",
        sortSeq : 0,
        upMenuId : "ROOT",
        url : null,
        useFg : "1",
        useFgNm : "사용"
      })
      
      let tmpResult = res.menuList.map((item,i) => {
        const newItem = {
          ...item,
          menuIdNm: item.menuNm,
          menuId: item.menuId.toString(),
          parentId: item.parentId,
          rowStat: "",
          useFgNm: item.useFg == "1" ? "사용" : "미사용",
          upMenuId: item.upMenuId == null ? "0" : item.upMenuId.toString(),
          idx: i
        };
        return newItem;
      });

      this.baseData = tmpResult;
      this.onRowClick({dataItem : this.baseData[tmpResult.length-1]});
    },
    insert() {
      this.selectedID = "";
      const newRecord = { rowStat:"I", idx:this.baseData.length+1,
        comId : "",
        expanded : false,
        lvl : 1,
        menuId : "",
        menuIdNm : "",
        menuNm : "",
        menuEngNm : "",
        name : "",
        parentId : "",
        url : "",
        procDttm : "",
        procUserNo : "",
        regDttm : "",
        regUserNo : "",
        rmrk : "",
        sortSeq : "",
        sysDivCd : "",
        upMenuId : this.selectedData.menuId.toString(),
        useFg : "1",
        _attributes : [],
        _children : []
      };
      const data = this.baseData.slice();
      data.unshift(newRecord);
      this.baseData = data;
      this.onRowClick({dataItem : newRecord});
    },
    remove(){
      const index = this.baseData.findIndex(p => p.idx === this.selectedData.idx);
      this.selectedData.rowStat = "D";
      this.baseData.splice(index, 1, this.selectedData);
    },
    async rowGridSave(){
      let dataArr = [];
      let insertDataArr = [];
      let updateDataArr = [];
      let deleteDataArr = [];
      var validCheck = true;

      this.baseData.filter(item => {
        if(item.rowStat == "I" || item.rowStat == "U" || item.rowStat == "D"){
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
        if(item.rowStat !== "D"){
          if(item.menuNm == "" || item.sortSeq == ""){
            this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');
            this.$refs['alertPop'].message = this.$i18n.t('CommLang.message.msg2');
            this.$refs['alertPop'].modalWidth = "300px";
            this.$refs['alertPop'].visibleDialog = true;
            validCheck = false;
          }
        }
      });
      if(validCheck && dataArr.length > 0){
        if (insertDataArr.length > 0) {
          await this.postInsertReturn({
            apiKey: "common/menu",
            sendParam: insertDataArr.map(item => ({
              ...item,
              upMenuId : item.upMenuId == "0" ? null : item.upMenuId
            }))
          });
        }

        if (updateDataArr.length > 0) {
          await this.putUpdateReturn({
            apiKey: "common/menu",
            sendParam: updateDataArr.map(item => ({
              ...item,
              upMenuId : item.upMenuId == "0" ? null : item.upMenuId
            }))
          });
        }

        if (deleteDataArr.length > 0) {
          await this.deleteDeleteReturn({
            apiKey: "common/menu",
            sendParam: deleteDataArr
          });
        }
        this.search();
      }else if(dataArr.length ===0){
        this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');;
        this.$refs['alertPop'].message = this.$i18n.t('CommLang.message.msg1');
        this.$refs['alertPop'].modalWidth = "300px";
        this.$refs['alertPop'].visibleDialog = true;
      }
    },
    async onRowClick(event){
      if(event.dataItem){
        this.selectedID = event.dataItem.idx;
        this.selectedData = event.dataItem;

        this.$refs['menuId'].textVal = event.dataItem.menuId;
        this.$refs['upMenuId'].textVal = event.dataItem.upMenuId;
        this.$refs['menuNm'].textVal = event.dataItem.menuNm;
        this.$refs['menuEngNm'].textVal = event.dataItem.menuEngNm;
        this.$refs['url'].textVal = event.dataItem.url;
        this.$refs['sortSeq'].textVal = event.dataItem.sortSeq;
        this.$refs['useFg'].chkValue = event.dataItem.useFg == "1" ? true : false ;
        
        this.$refs['regUserNo'].textVal = event.dataItem.regUserNo;
        this.$refs['regDttm'].textVal = event.dataItem.regDttm;
        this.$refs['procUserNo'].textVal = event.dataItem.procUserNo;
        this.$refs['procDttm'].textVal = event.dataItem.procDttm;
        
        this.$refs['iconClass'].textVal = event.dataItem.iconClass;

        this.role = this.roleListList.filter(x => x.roleId == event.dataItem.roleId)[0]

        if(event.dataItem._children){
          this.btnDis = true;
        }else{
          this.btnDis = false;
        }
        if(event.dataItem.menuId == "0"){
          this.itemDis = true;
          this.btnDis = true;
        }else{
          this.itemDis = false;
        }
      }
    },
    onExpandChange(e) {
      this.expanded = e.value
        ? this.expanded.filter((menuId) => menuId !== e.dataItem.menuId)
        : [...this.expanded, e.dataItem.menuId];
    },
    addExpandField(dataTree) {
      const expanded = this.expanded;
      return mapTree(dataTree, this.subItemsField, (item) =>
        extendDataItem(item, this.subItemsField, {
          [this.expandField]: expanded.includes(item.menuId),
          selected: item.idx === this.selectedID,
        })
      );
    },
    handleDataStateChange: function (event) {
      this.createAppState(event.data);
    },
    cellBackground: function(dataItem){
        if(dataItem.rowStat == "I"){
            return {"background-color" : "rgb(253, 253, 13, 0.32)"}
        }else if(dataItem.rowStat == "U"){
            return {"background-color" : "rgb(55, 180, 0,0.32)"}
        }else if(dataItem.rowStat == "D"){
            return {"background-color" : "rgb(243, 23, 0, 0.32)"}
        }
    },
  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>