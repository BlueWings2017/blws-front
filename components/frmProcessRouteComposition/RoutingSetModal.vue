<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="라우팅 복사"
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
                  <label>라우팅ID</label>
                  <InputText
                    ref="processrouteid"
                    :boxWidth="'90%'"
                    :dataNm="'processrouteid'"
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
        <v-col :cols="8" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <v-row>
                <v-col :cols="3">
                  <CardTitle>라우팅목록</CardTitle>
                </v-col>
                <v-col :cols="9">
                  <CardTitle :style="{'color': 'red'}">복사할 라우팅을 선택하세요</CardTitle>
                </v-col>
              </v-row>
              <div ref="divWrapper" style="height: calc(100% - 63px)">
                <KendoGrid 
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="items"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :disabledCheckHeaderArr="disabledCheckHeaderArr"
                  @gridrowclick="onRowClick"
                  @rowdblclick="rowdblclick"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
        <v-col :cols="4" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <div ref="divWrapper" :style="{ height: '100%' }">
                <KendoTree
                  :treeData="treeData"
                  :textField="'label'"
                  :icon="'icon'"
                  @onExpandChange="onExpandChange"
                  @onItemClick="onItemClick"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>

    </Dialog>

    <div v-if="isLoading" class="loading-container" :style="{'z-index': '999999', position: 'relative'}">
      <div class="loading">
        <FadeLoader />
      </div>
    </div>

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

export default { 
  name: "SearchModal",
  mixins: [mixinGlobal, gridHeaderMinin],
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
    }
  },
  data() {
    return {
      gridHeader: [],
      gridData : [],
      gridHeight : '450px',
      selectedField: 'selected',
      headerParam: {
        gridid: "dgvSelectProcessRoute", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      disabledCheckHeaderArr: [ "ACTIVESTATE", "CONFIRMFLAG", "COMMONFLAG" ],
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      processrouteid: "",
      isLoading: false,
      processData: [],
      stepData: [],
      selectedRow: [],
      treeData: [],
      treeInit: [],
      plantid: "",
      ccc: true
    }
  },
  computed: {
    items () {
      return this.gridData.map((item) => ({ ...item, selected: item.PROCESSROUTEID === this.selectedID }));
    },
  },
  async mounted() {
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData() {
      this.isLoading = true;
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetSelectProcessRoute",
        sendParam: {
          plantid: "LS",
          processrouteid: this.processrouteid
        }
      }).then(async (res) => {
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
        Object.assign(data[0], {...data[0], selected: true});
        this.gridData = data;
        this.isLoading = false;
      })
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //그리드 로우 클릭
    async onRowClick (event) {
      this.selectedID = event.dataItem.PROCESSROUTEID;
      this.plantid = event.dataItem.PLANTID;
      this.selectedRow = [event.dataItem];
      // await this.getGridData();
      this.isLoading = true;
      await this.processGrid();
      await this.stepGrid();
    },
    //그리드 더블 클릭
    rowdblclick(event){
      this.$emit('routingSet', {process: this.processData, step: this.stepData, tree: this.treeInit});
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //row 선택
    selectRow() {
      this.$emit('routingSet', {process: this.processData, step: this.stepData, tree: this.treeInit});
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    searchInput(nm, val){
      this[nm] = val;
    },
    onExpandChange(event){
      event.item.expanded = !event.item.expanded;
    },
    onItemClick(event){

    },
    async processGrid(){
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetROComposition",
        sendParam: {
          processrouteid: this.selectedID,
          plantid: this.plantid,
        }
      }).then((res) => {
        this.processData = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false
          }
        });
        // this.setdgvOperationAction(this.processData)
      });
    },
    async stepGrid() {
      console.log(this.selectedID)
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetROCComposition",
        sendParam: {
          processrouteid: this.selectedID,
          plantid: this.plantid,
        }
      }).then((res) => {
        this.stepData = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false
          }
        });

        const gd = this.selectedRow.map(x => ({...x, id: "routeGrid", label: x.PROCESSROUTEID, icon: "PROCESSROUTE"}))
        const pd = this.processData.map(x => ({...x, id: x.UIKEY, parentId: "routeGrid", label: x.PROCESSNAME,icon: "PROCESS"}));
        for(let i =0; i<pd.length;i++){
          for(let j =0; j<this.stepData.length; j++) {
            if(pd[i].PROCESSID == this.stepData[j].PROCESSID && pd[i].PROCESSSEQUENCE == this.stepData[j].PROCESSSEQUENCE) {
              this.stepData[j].PROCESSROUTEID = pd[i].UIKEY;
            }
          }
        }
        const sd = this.stepData.map(x => ({...x, parentId: x.PROCESSROUTEID, label: `[${x.RECIPERELATIONCODE}] - ${x.RECIPENAME}[${x.RECIPETYPE || ''}]`,icon: "RECIPE"}));
        const data = [...gd, ...pd, ...sd].map(x => ({...x, expanded: true, selected: false}))
        this.treeInit = data;
        this.treeData = arrayToTree(data, { dataField: null });
        this.isLoading = false;
      })
    },
  },
  watch: {
    gridHeader(){
      if(this.ccc){
        this.gridHeader = this.gridHeader.map(x => {
          return {
            ...x,
            width: x.GRIDCOLUMNSIZE
          }
        });
        this.ccc = false;
      }
    }
  }
};
</script>