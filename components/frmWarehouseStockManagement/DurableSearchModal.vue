<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="기준 Durable 목록"
      width="70%"
      height="600"
      @close="toggleDialog"
    >
      <v-row no-gutters> 
        <v-col :cols="8" align="left">
          <div class="form-group-wrap">
            <div class="form-group">
              <Label>
                기준 Durable ID
              </Label>
              <InputText
                ref="standarddurableid"
                :boxWidth="'90%'"
                :dataNm="'standarddurableid'"
                :disabled="false"
                :searchOption="true"
                :searchFunc="getGridData"         
                @input-text-set="searchInput"
              />
            </div>
          </div>
        </v-col>
        <v-col :cols="4" align="right">
            <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="getGridData" >조회</Button>
            <Button :theme-color="'primary'" :size="'medium'" icon="check"  @click="selectRow">선택</Button>
        </v-col>
      </v-row>
      <div ref="divWrapper" style="height:calc(100% - 44px);">
          <KendoGrid 
            ref="rowGrid"
            :gridHeight="gridHeight"
            :gridItems="this.gridData"
            :sortable="true"
            :columns="gridHeader"
            :resizable="false"
            :isPaging="true"
            :edit-field="'inEdit'"
            :selected-field="selectedField"
            :disabledCheckHeaderArr="disabledCheckHeaderArr"
            @gridrowclick="onRowClick"
            @rowdblclick="rowdblclick"
            @sortChangeHandler="sortChangeHandler"
          />
      </div>
    </Dialog>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    <div v-if="isLoading" class="loading-container" :style="{'z-index': '999999', position: 'relative'}">
      <div class="loading">
        <FadeLoader />
      </div>
    </div>

  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';

export default { 
  name: "SearchModal",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    FadeLoader
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
      gridHeader: [],
      gridData : [],
      gridHeight : '600px',
      selectedField: 'selected',
      headerParam: {
        gridid: "dgvDurableDefinition_View", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      disabledCheckHeaderArr: [ "ACTIVESTATE", "CONFIRMFLAG", "COMMONFLAG" ],
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      standarddurableid: "",
      isLoading: true,
      searchBtn: false
    }
  },
  computed: {
    items () {
      return this.gridData.map((item) => ({ ...item, selected: item.STANDARDDURABLEID === this.selectedID }));
    },
  },
  async mounted() {
    await this.getGridData();
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetOMDurableDefinitionList",
        sendParam: {
          plantid: "LS",
          standarddurableid: this.standarddurableid
        }
      }).then((res) => {
         const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false
          }
        });
        this.$nuxt.$emit('iccReset')
        this.gridData = data;
        this.isLoading = false
      })
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //그리드 로우 클릭
    onRowClick (event) {
      this.selectedID = event.dataItem.STANDARDDURABLEID;
      this.gridData.forEach(x => x.selected = false);
      event.dataItem[this.selectedField] = true;
    },
    //그리드 더블 클릭
    rowdblclick(event){
      if(event.dataItem.ACTIVESTATE === "Inactive"){
        this.$refs['alertPop'].show("알림", "사용불가 상태입니다. 확인해주시기 바랍니다.");
        return;
      }
      this.$emit('durableInfo', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //row 선택
    selectRow() {
      const retuenData = this.items.filter(x => x.selected);
      if(retuenData[0].ACTIVESTATE === "Inactive"){
        this.$refs['alertPop'].show("알림", "사용불가 상태입니다. 확인해주시기 바랍니다.");
        return;
      }
      this.$emit('durableInfo', retuenData[0]);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    searchInput(nm, val){
      this[nm] = val;
    },
    // sortChangeHandler(e){
    //   const isAscending = e.sort[0]?.dir == "asc";
    //   if(isAscending){
    //     this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
    //   }else{
    //     this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
    //   }
    // }   
    sortChangeHandler(e){
      this.gfn_sortChangeHandler(this.gridData, e);
    },   
  },
};
</script>