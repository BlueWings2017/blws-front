<template>
  <div>
    <v-row ref="contents">
      <v-col :cols="4">
        <kcard ref="gridCard" :style="{height : '100%'}">
          <cardBody>
            <div class="d-flex align-center justify-space-between pa-2">
            <CardTitle>{{$t('DeptMngPage.label1')}}</CardTitle>
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
            <CardTitle>{{$t('DeptMngPage.label2')}}</CardTitle>
            <div>
              <v-row>
                <v-col :cols="6">
                  <v-row class="search-box" align="center" no-gutters>
                    <v-col :cols="4">
                      <Label>
                        <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                        {{$t('DeptMngPage.label3')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="id"
                        :boxWidth="'90%'"
                        :dataNm="'id'"
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
                        {{$t('DeptMngPage.label4')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="parentsId"
                        :boxWidth="'90%'"
                        :dataNm="'parentsId'"
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
                        {{$t('DeptMngPage.label5')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="deptIdNm"
                        :boxWidth="'90%'"
                        :dataNm="'deptIdNm'"
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
                        <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                        {{$t('CommLang.label.label2')}}
                      </Label>
                    </v-col>
                    <v-col :cols="8">
                      <InputText
                        ref="createdBy"
                        :boxWidth="'90%'"
                        :dataNm="'createdBy'"
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
                        ref="createdDate"
                        :boxWidth="'90%'"
                        :dataNm="'createdDate'"
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
                        ref="lastModifiedBy"
                        :boxWidth="'90%'"
                        :dataNm="'lastModifiedBy'"
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
                        ref="lastModifiedDate"
                        :boxWidth="'90%'"
                        :dataNm="'lastModifiedDate'"
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
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import { TreeList, mapTree, extendDataItem, } from '@progress/kendo-vue-treelist';
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
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
    Checkbox
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
      btnDis : false
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
        treeKey: "DEPT_ID",
        value: val
      });
      for(var i=0; i<this.baseData.length; i++){
        this.expanded.push(this.baseData[i].id);
      }
      this.gridData = setTreeData.ROOT;
    }
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
        { field: 'name',  editable: false, title: this.$i18n.t('DeptMngPage.label5'), width: this.setPer("divWrapper",78),  expandable: true,},
      ];
      this.gridDataSelect();
    },
    async gridDataSelect(){
      let res = await this.getListReturn({
        apiKey: "common/dept/list"
      });
      res.push({
        children : null,
        id : "0",
        deptId: "0",
        idx : res.length +1,
        level : null,
        name : "ROOT",
        parentId : "ROOT",
        parentsId : "ROOT",
        procDttm : null,
        procUserNo : null,
        regDttm : null,
        regUserNo : null,
        rowStat : "",
        upDeptId : "ROOT",
      })
      
      let tmpResult = res.map((item,i) => {
        const newItem = {
          ...item,
          deptIdNm: item.name,
          id: item.id.toString(),
          deptId: item.id.toString(),
          parentsId: item.parentsId == null ? "0" : item.parentsId.toString(),
          rowStat: "",
          upDeptId: item.parentsId == null ? "0" : item.parentsId.toString(),
          idx: i
        };
        return newItem;
      });
      // const setTreeData = await this.setTree({
      //   treeKey: "MENU_ID",
      //   value: res
      // });
      this.baseData = tmpResult;
      this.onRowClick({dataItem : this.baseData[tmpResult.length-1]});
    },
    insert() {
      this.selectedID = "";
      const newRecord = { rowStat:"I", idx:this.baseData.length+1,
        expanded : false,
        lvl : 1,
        id : "",
        deptIdNm : "",
        name : "",
        parentsId : this.selectedData.id.toString(),
        deptId : "",
        procDttm : "",
        procUserNo : "",
        regDttm : "",
        regUserNo : "",
        upDeptId : this.selectedData.id.toString(),
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
          if(item.deptIdNm == ""){
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
            apiKey: "common/dept",
            sendParam: insertDataArr.map(item => ({
              ...item,
              name : item.deptIdNm,
              parentsId : item.upDeptId == "0" ? null : item.upDeptId
            }))
          });
        }

        if (updateDataArr.length > 0) {
          await this.putUpdateReturn({
            apiKey: "common/dept",
            sendParam: updateDataArr.map(item => ({
              ...item,
              name : item.deptIdNm,
              parentsId : item.upDpetId == "0" ? null : item.upDeptId
            }))
          });
        }

        if (deleteDataArr.length > 0) {
          await this.deleteDeleteReturn({
            apiKey: "common/dept",
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

        this.$refs['id'].textVal = event.dataItem.id;
        this.$refs['parentsId'].textVal = event.dataItem.parentsId;
        this.$refs['deptIdNm'].textVal = event.dataItem.name;

        this.$refs['createdBy'].textVal = event.dataItem.createdBy;
        this.$refs['createdDate'].textVal = event.dataItem.createdDate;
        this.$refs['lastModifiedBy'].textVal = event.dataItem.lastModifiedBy;
        this.$refs['lastModifiedDate'].textVal = event.dataItem.lastModifiedDate;

        if(event.dataItem._children){
          this.btnDis = true;
        }else{
          this.btnDis = false;
        }
        if(event.dataItem.id == "0"){
          this.itemDis = true;
          this.btnDis = true;
        }else{
          this.itemDis = false;
          //this.btnDis = false;
        }
      }
    },
    onExpandChange(e) {
      this.expanded = e.value
        ? this.expanded.filter((id) => id !== e.dataItem.id)
        : [...this.expanded, e.dataItem.id];
    },
    addExpandField(dataTree) {
      const expanded = this.expanded;
      return mapTree(dataTree, this.subItemsField, (item) =>
        extendDataItem(item, this.subItemsField, {
          [this.expandField]: expanded.includes(item.id),
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