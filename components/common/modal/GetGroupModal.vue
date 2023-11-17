<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="작업조 조회"
      width="40%"
      height="500"
      @close="toggleDialog"
    >
      <v-row ref="searchFilter" no-gutters>
        <v-col :cols="12">
          <v-row class="search-box" align="center" no-gutters>
            <v-col :sm="8" :lg="9">
              <div class="form-group-wrap">
                <div class="form-group">
                  <Label>
                    작업조ID
                  </Label>
                  <InputText
                    :searchOption="true"
                    :dataNm="'WORKGROUPIDINP'"
                    :boxWidth="'90%'"
                    @input-text-set="searchInputValSet"
                    :searchFunc="gridDataSelect"
                  />
                </div>
              </div>
            </v-col>
            <v-col :sm="4" :lg="3" align="right">
              <Button :theme-color="'primary'" :icon="'search'" @click="gridDataSelect">조회</Button>
              <Button :theme-color="'primary'" :icon="'check'" @click="selectRow">선택</Button>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row ref="contents">
        <v-col :cols="12" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <!-- <CardBody :style="{ width: '100%', height: '100%' }"> -->
              <div ref="divWrapper" :style="{ height: '100%' }">
                <KendoGrid 
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridItems"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="false"
                  :isPaging="true"
                  :selected-field="selectedField"
                  @gridrowclick="onRowClick"
                  @rowdblclick="rowdblclick"
                  @sortChangeHandler="sortChangeHandler"
                />
              </div>
            <!-- </CardBody> -->
          </Card>
        </v-col>
      </v-row>
    </Dialog>


  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import moment from "moment";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";

export default { 
  name: "GetUserModal",
  mixins: [mixinGlobal],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    FadeLoader,
    Card, 
    CardBody, 
    CardTitle
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true
    }
  },
  data() {
    return {
      selected: 0,
      columns: [],
      gridHeader: [],
      selectedField: 'selected',
      selectedID: null,
      selectedData: [],
      gridHeight : '300px',
      gridData : [],
      searchUserId: "",
      searchUserNm: "",
      WORKGROUPIDINP: "",
    }
  },
  computed: {
    gridItems() {
      return this.gridData.map((item) => ({ ...item, selected: item.WORKGROUPID === this.selectedID }));
    },
  },
  created(){
    this.gridHeader = [
      {field: "WORKGROUPID", editable: false, title: "작업조ID", minWidth: 200, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: "Yes", NOTNULLFLAG: null },
      {field: "WORKGROUPNAME", editable: false, title: "작업조설명", minWidth: 200, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
      {field: "DESCRIPTION", editable: false, title: "비고", minWidth: 200, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
    ];
    this.gridDataSelect();
  },
  async mounted() {
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    searchInputValSet(nm, val){
      this[nm] = val;
    },
    async gridDataSelect(){
      this.gridData = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetWorkGroupList",
        sendParam: {
          workgroupid:  this.WORKGROUPIDINP,
          workgroupname: "",
          plantid: "LS"
        }
      });
    },
    //그리드 로우 클릭
    onRowClick (event) {
      this.selectedID = event.dataItem.WORKGROUPID;
    },
    selectRow() {
      const retuenData = this.gridItems.filter(x => x.selected);
      console.log(retuenData)
      this.$emit('selectGroup', retuenData[0]);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //그리드 더블 클릭
    rowdblclick(event){
      this.$emit('selectGroup', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    sortChangeHandler(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    }
  },
};
</script>