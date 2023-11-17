<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="공정 목록"
      width="50%"
      height="600"
      @close="toggleDialog"
    >
      <v-row :style="{'margin-bottom': '10px'}">
        <v-col :cols="8" align="left">
          <v-row class="search-box" align="center" no-gutters>
            <v-col :cols="2">
              <Label>
                공정조건코드
              </Label>
            </v-col>
            <v-col :cols="4">
              <InputText
                ref="recipeparameterid"
                :boxWidth="'90%'"
                :dataNm="'recipeparameterid'"
                :disabled="false"
                @input-text-set="searchInput"
              />
            </v-col>
          </v-row>
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
          :gridItems="gridData"
          :sortable="true"
          :columns="gridHeader"
          :resizable="false"
          :edit-field="'inEdit'"
          :isPaging="true"
          :selected-field="selectedField"
          :disabledCheckHeaderArr="disabledCheckHeaderArr"
          @selectionchange="onSelectionchange"
          @gridrowclick="onRowClick"
          @headerselectionchange="onHeaderSelectionChange"
          @rowdblclick="rowdblclick"
          @sortChangeHandler="sortChangeHandler"
        />
      </div>
      <!-- <DialogActionsBar>
        <Button @click="toggleDialog">No</Button>
        <Button :theme-color="'primary'" @click="toggleDialog">Yes</Button>
      </DialogActionsBar> -->
    </Dialog>
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText";

export default { 
  name: "SearchModal",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText
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
      gridOriData : [],
      gridHeight : '400px',
      selectedField: 'selected',
      headerParam: {
        gridid: "dgvRecipeParameter_pop", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      disabledCheckHeaderArr: [ "ACTIVESTATE", "CONFIRMFLAG", "COMMONFLAG" ],
      noFirstCheck: false,
      noRowstat: true,
      selectedID: null,
      recipeparameterid: "",
    }
  },
  computed: {
    // areAllSelected() {
    //   return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
    // },
    // items () {
    //   return this.gridData.map((item) => ({ ...item, selected: item.RECIPEPARAMETERID === this.selectedID }));
    // },
  },
  async mounted() {
    await this.getGridData();
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData() {
      console.log(this.recipeparameterid)
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetRecipeParameterList",
        sendParam: {
          plantid: "LS",
          recipeparameterid: this.recipeparameterid,
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
        this.gridOriData = data;
        this.gridData = data;
      })
      console.log(this.gridData)
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //그리드 로우 클릭
    onRowClick (event) {
      this.selectedID = event.dataItem.RECIPEPARAMETERID;
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      console.log(event)
    },
    //맨앞 checkBox 클릭
    onSelectionchange (event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange (event) {
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map((item) => {
        return { ...item, selected: checked };
      });
    },
    //그리드 더블 클릭
    rowdblclick(event){
      // this.$emit('searchBtn', event.dataItem);
      // this.$emit('visibleDialog', !this.visibleDialog)
    },
    //row 선택
    selectRow() {
      const rerutnData = this.gridData.filter(x => x.selected);
      this.$emit('addData', rerutnData);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    searchInput(nm, val){
      this[nm] = val;
    },
    sortChangeHandler(e){
      const isAscending = e.sort[0]?.dir == "asc";
      if(isAscending){
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
      }else{
        this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
      }
    },
  },
};
</script>