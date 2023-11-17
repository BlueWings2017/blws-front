<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="공정 삽입"
      width="70%"
      height="700"
      @close="toggleDialog"
    >
      <v-row ref="searchFilter" no-gutters>
        <v-col :cols="12">
          <v-row class="search-box" align="center" no-gutters>
            <v-col :sm="6" :lg="7">
              <div class="form-group-wrap">
                <div class="form-group">
                  <label>공정ID</label>
                  <InputText
                    ref="PROCESSNAME"
                    :boxWidth="'90%'"
                    :dataNm="'PROCESSNAME'"
                    :disabled="false"
                    @input-text-set="searchInput"
                  />
                </div>
                <div class="form-group">
                  <label>공정명</label>
                  <InputText
                    ref="PROCESSID"
                    :boxWidth="'90%'"
                    :dataNm="'PROCESSID'"
                    :disabled="false"
                    @input-text-set="searchInput"
                  />
                </div>
              </div>
            </v-col>
            <v-col :sm="6" :lg="5" align="right">
              <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="getGridData" >조회</Button>
              <Button :theme-color="'primary'" :size="'medium'" icon="check" @click="selectRow">선택</Button>
              <Button :theme-color="'primary'" :size="'medium'" icon="close" @click="toggleDialog">닫기</Button>
            </v-col>
          </v-row>

        </v-col>
      </v-row>


      <v-row ref="contents">
        <v-col :cols="5" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <div ref="divWrapper" style="height: calc(100% - 0px)">
                <KendoGrid 
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="items"
                  :sortable="true"
                  :columns="sourceHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :isPaging="true"
                  :selected-field="selectedField"
                  @gridrowclick="processSelectRowClick"
                  @rowdblclick="rowdblclick"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
        
        <v-col :cols="1" :style="{ height: '100%'}" align="center">
          <div class="between-opt-align" :style="{ height: '100%'}">
            <div>
              <Button :theme-color="'secondary'" :icon="'arrow-chevron-right'" @click="addBtn">추가</Button>
            </div>
            <div>
              <Button :theme-color="'secondary'" :icon="'arrow-chevron-left'" @click="delBtn">삭제</Button>
            </div>
          </div>
        </v-col>

        <v-col :cols="6" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <div ref="divWrapper" style="height: calc(100% - 0px)">
                <KendoGrid 
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="targetData"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  @gridrowclick="onRowClick"
                  @selectionchange="onSelectionchange"
                  @headerselectionchange="onHeaderSelectionChange"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>

    </Dialog>

  </div>
</template>
<script>
import KendoTree from "@/components/common/KendoTree"
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView } from '@progress/kendo-vue-treeview';
import { arrayToTree } from "performant-array-to-tree";
import { mapState, mapMutations, mapActions } from "vuex";
import customGridHeaderMixin from "@/mixin/customGridHeaderMixin";

export default { 
  name: "InsertOperation",
  mixins: [mixinGlobal, gridHeaderMinin, customGridHeaderMixin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    FadeLoader,
    CardTitle,
    TreeView,
    Card, 
    CardBody,
    KendoTree
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true
    },
    itemHierarchicalIndex: {
      type: String,
      require: true
    },
    insertHierarchi: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      gridHeader: [],
      gridData : [],
      gridHeight : '450px',
      selectedField: 'selected',
      headerParam: {
        gridid: "dgvProcess", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      selectedID: null,
      selectedRow: [],
      plantid: "",
      PROCESSNAME: "",
      PROCESSID: "",
      targetData: [],
      noRowstat: true,
      sourceHeader: [],
      rowIdx:0,
      
    }
  },
  computed: {
    ...mapState({
      dgvOperation: (state) => state.modules.frmPRC.dgvOperation,
      dgvRecipe: (state) => state.modules.frmPRC.dgvRecipe,
      frmPRC_Data: state => state.modules.frmPRC.frmPRC_Data,
      seq: state => state.modules.frmPRC.seq
    }),
    areAllSelected() {
      return (
        this.targetData.findIndex((x) => x.checked === false) === -1 && this.targetData.length !== 0
      );
    },
     items () {
      return this.gridData.map((item) => ({ ...item, selected: item.PROCESSID === this.selectedID }));
    },
  },
  async mounted() {
    this.sourceHeader = await this.getCustomHeader("dgvProcess",true,true)
    this.getGridData();
  },
  methods: {
    ...mapActions({
      setdgvOperationAction: "modules/frmPRC/setdgvOperationAction",
      setTreeDataAction: "modules/frmPRC/setTreeDataAction",
      setSeqsAction: "modules/frmPRC/setSeqsAction",
    }),
    //그리드 데이터 가져오기
    async getGridData() {
      this.isLoading = true;
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProcessList",
        sendParam: {
          plantid: "LS",
          processid: this.PROCESSID,
          processname: this.PROCESSNAME
        }
      }).then(async (res) => {
         const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            rowIdx: 0
          }
        });
        this.$nuxt.$emit('iccReset')
        this.gridData = data;
      })
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
        this.targetData = this.targetData.map((x) => {
        if(event.dataItem.UUID === x.UUID){
          return { ...x, selected: !x.selected };
        }
        return x;
      });
    },
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      this.targetData = this.targetData.map((item) => {
        return { ...item, selected: checked };
      });
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //그리드 로우 클릭
    processSelectRowClick (event) {
      this.selectedID = event.dataItem.PROCESSID;
      this.plantid = event.dataItem.PLANTID;
      this.selectedRow = event.dataItem;
    },
    onRowClick (event) {
      this.selectedID = event.dataItem.rowIdx;
    },
    //그리드 더블 클릭
    rowdblclick(event){
      this.processDataSet();
    },
    searchInput(nm, val){
      this[nm] = val;
    },
    onExpandChange(event){
      event.item.expanded = !event.item.expanded;
    },
    onItemClick(event){
    },
    addBtn(){
      if(this.selectedRow.length === 0) {
        return;
      }
      //const target = this.gridData.filter(x => x.selected).map(x => ({...x, selected: true}))
      this.processDataSet();
    },
    delBtn(){
      this.targetData = this.targetData.filter(x => !x.selected)
    },
    //row 선택
    selectRow() {
      const target = this.targetData.map((x, idx) => {
        return {
          ...x,
          CONCURRENCYSEQUENCE: this.seq + (idx +1)*100+"",
          PROCESSSEQUENCE: this.seq + (idx +1)*100+"",
        }
      })
      let data = [];
      if(this.itemHierarchicalIndex == "0"){
        data = target.concat(this.dgvOperation);
      }else{ 
        // "0_0".split("_")[]
        const orid = JSON.parse(JSON.stringify(this.dgvOperation));
        const arr = this.itemHierarchicalIndex.split("_")
        const idx = arr[arr.length-1];
        target.forEach(x => {
          orid.splice(idx, 0, x);
        })
        
        data = orid;
      }
      // itemHierarchicalIndex

      const opData = data.map((x, idx) => {
        return {
          ...x, 
          DESCRIPTIONSET: "지시사항등록", 
          CONCURRENCYPROCESSBUTTON: "검색",
          UIKEY: Math.round(Math.random() * 1000000000).toString(),
          PROCESSROUTEID: this.frmPRC_Data[0]?.PROCESSROUTEID,
          idx: idx,
          CURRENTPROCESSROW: "",
          ROCOMPOSITIONID: "",
          PROCESSMODE: "Manual",
          CREATELOTFLAG: "",
          CREATELOTRULE: "",
          COSTCENTER: "",
          ENDOFROUTE: "No",
          AUTOTRACKIN: "No",
          AUTOTRACKOUT: "No",
          DESCRIPTION: "",
          selected: false
        }
      });
      this.setdgvOperationAction(opData);
      // this.setSeqsAction(seqChk)

      const gd = this.frmPRC_Data.map((x) => ({
        ...x,
        id: "routeGrid",
        label: x.PROCESSROUTEID,
        icon: "PROCESSROUTE",
      }));
      const pd = opData.map((x) => ({
        ...x,
        id: x.PROCESSSEQUENCE,
        parentId: "routeGrid",
        label: x.PROCESSNAME,
        icon: "PROCESS",
      }));

      for(let i =0; i<pd.length;i++){
          for(let j =0; j<this.dgvRecipe.length; j++) {
            if(pd[i].PROCESSID == this.dgvRecipe[j].PROCESSID && pd[i].PROCESSSEQUENCE == this.dgvRecipe[j].PROCESSSEQUENCE) {
              this.dgvRecipe[j].PROCESSROUTEID = pd[i].UIKEY;
            }
          }
        }
        
      const sd = this.dgvRecipe.map((x) => ({
        ...x,
        parentId: x.PROCESSSEQUENCE,
        label: `[${x.RECIPERELATIONCODE}] - ${x.RECIPENAME}[${x.RECIPETYPE || ''}]`,
        icon: "RECIPE",
        // CONCURRENCYPROCESSBUTTON: "검색", DESCRIPTIONSET: "지시사항등록"
      }));
      this.setTreeDataAction([...gd, ...pd, ...sd]);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    processDataSet() {
      const target = this.items.filter(x => x.selected).map(x => ({...x, selected: false}))[0]
      let tar1 = JSON.parse(JSON.stringify(target))
          tar1["UUID"] = Math.round(Math.random() * 1000000000);
      this.targetData.push(tar1);
    }
  },
};
</script>