<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="스텝 삽입"
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
                  <label>스텝ID</label>
                  <InputText
                    ref="RECIPEID"
                    :boxWidth="'90%'"
                    :dataNm="'RECIPEID'"
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
                  :gridHeight="sourceHeader"
                  :gridItems="items"
                  :sortable="true"
                  :columns="sourceHeader"
                  :resizable="false"
                  :edit-field="'inEdit'"
                  :isPaging="true"
                  :selected-field="selectedField"
                  @gridrowclick="onSourceRowClick"
                  @rowdblclick="stepRowDbClick"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
        
        <v-col :cols="1" :style="{ height: '100%'}" align="center">
            <div class="between-opt-align align-items-center" :style="{ height: '100%'}">
              <div :class="'btn-cell-move'">
                <Button :theme-color="'secondary'" :class="'btn-cell-right'" @click="selectDataInsert"></Button>
                <Button :theme-color="'secondary'" :class="'btn-cell-left'" @click="delBtn"></Button>
              </div>
              <div class="form-chk">
                <Checkbox
                  ref="start"
                  dataNm="start"
                  v-model="start"
                  :disabled="chkStart"
                  @change="searchInput"
                />
                <Label>시작</Label>
              </div>
              <div class="form-chk">
                <Checkbox
                  ref="change"
                  dataNm="change"
                  v-model="change"
                  :disabled="chkChange"
                  @change="searchInput"
                />
                <Label>변경</Label>
              </div>
              <div class="form-chk">
                <Checkbox
                  ref="end"
                  dataNm="end"
                  v-model="end"
                  :disabled="chkEnd"
                  @change="searchInput"
                />
                <Label>종료</Label>
              </div>
            </div>
        </v-col>

        <v-col :cols="5" :style="{ height: '100%' }">
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
        <v-col :cols="1" :style="{ height: '100%' }">
          <div class="between-opt-align" :style="{ height: '100%'}">
            <div>
              <Button :icon="'plus'" :theme-color="'secondary'" @click="btnChange">변경추가</Button>
            </div>
            <div>
              <Button :icon="'chevron-up'" :theme-color="'secondary'" @click="btnUp">위로</Button>
            </div>
            <div>
              <Button :icon="'chevron-down'" :theme-color="'secondary'" @click="btnDown">아래로</Button>
            </div>
          </div>
        </v-col>
      </v-row>

    </Dialog>
    <ConfirmPop
      ref="ConfirmPop"
    />
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
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
import { Checkbox } from "@progress/kendo-vue-inputs";
import { Label } from "@progress/kendo-vue-labels";
import customGridHeaderMixin from "@/mixin/customGridHeaderMixin";

export default { 
  name: "InsertStep",
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
    KendoTree,
    Checkbox,
    Label
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
        gridid: "dgvSelectStep", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      selectedID: null,
      selectedRow: [],
      plantid: "",
      RECIPEID: "",
      PROCESSID: "",
      targetData: [],
      noRowstat: true,
      sourceHeader: [],
      start: false,
      change: false,
      end: false,
      chkStart: true,
      chkEnd: true,
      chkChange: true,
      RelationCode: 0,
      targetData: [],
      targetUid: 0,
      lastCheckItem: 0,
    }
  },
  computed: {
    ...mapState({
      dgvOperation: (state) => state.modules.frmPRC.dgvOperation,
      dgvRecipe: (state) => state.modules.frmPRC.dgvRecipe,
      frmPRC_Data: state => state.modules.frmPRC.frmPRC_Data,
    }),
    areAllSelected() {
      return (
        this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
      );
    },
    items () {
      return this.gridData.map((item) => ({ ...item, selected: item.RECIPEID === this.selectedID }));
    },
  },
  async mounted() {
    this.RelationCode = this.dgvRecipe.length;
    this.sourceHeader = await this.getCustomHeader("dgvStep",true,true)
    this.getGridData();
  },
  methods: {
    ...mapActions({
      setDgvRecipeAction: "modules/frmPRC/setDgvRecipeAction",
      setTreeDataAction: "modules/frmPRC/setTreeDataAction",
      setSeqsAction: "modules/frmPRC/setSeqsAction",
    }),
    //그리드 데이터 가져오기
    async getGridData() {
      this.isLoading = true;
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetRecipeListAll",
        sendParam: {
          plantid: "LS",
          recipeid: this.RECIPEID
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
        this.gridData = data;
      })
    },
    //맨앞 checkBox 클릭
    onSelectionchange(event) {
      // console.log(event)
      this.targetData = this.targetData.map((x) => {
        if(event.dataItem.UUID === x.UUID){
          return { ...x, selected: !x.selected };
        }
        return x;
      });
      this.lastCheckItem = event.dataItem.UUID;
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
    onSourceRowClick (event) {
      if(event.dataItem?.RECIPEDEFTYPE == "Event"){
        this.chkStart = false; 
        this.chkEnd = false;
        this.chkChange = false;
        this.start = true;
        this.end = true;
      }else{
        this.chkStart = true; 
        this.chkEnd = true;
        this.chkChange = true;
        this.start = false;
        this.change = false;
        this.end = false;
      }
      this.selectedID = event.dataItem.RECIPEID;
    },
    onRowClick (event) {
      this.selectedID = event.dataItem.RECIPEID;
    },
    searchInput(nm, val){
      this[nm] = val;
    },
    onExpandChange(event){
      event.item.expanded = !event.item.expanded;
    },
    onItemClick(event){
    },
    //추가
    selectDataInsert(){
      this.selectStepDataSet();
    },
    delBtn(){
      const delTarget = this.targetData.filter(x => x.selected);
      const seCheck = delTarget.some(x => x.RECIPETYPE == "Start" || x.RECIPETYPE == "End");
      if(seCheck){
        this.$refs.ConfirmPop.title = "삭제"
        this.$refs.ConfirmPop.message = `시작, 종료 Step 삭제시 \n\n관련된 Step이 삭제됩니다.\n\n삭제하시겠습니까?`;
        this.$refs.ConfirmPop.modalWidth = "330px";
        this.$refs.ConfirmPop.visibleDialog = true;
        this.$refs.ConfirmPop.callBack = this.delStep;
      }else{
        this.delStep();
      }
    },
    delStep(){
      const target = this.targetData.filter(x => x.selected);
      const targetArr = [];
      target.forEach(x => {
        targetArr.push(x.RECIPERELATIONCODE)
      })
      const uniqueArr = [...new Set(targetArr)];
      this.targetData = this.targetData.filter(x => !(uniqueArr.indexOf(x.RECIPERELATIONCODE) > -1));
    },
    //변경추가
    btnChange(){
      const copyTarget = JSON.parse(JSON.stringify(this.targetData.filter(x => x.UUID == this.lastCheckItem)[0]));
      copyTarget.RECIPERELATIONCODE
      let insetIdx = 0;
      this.targetData.forEach((x, idx) => {
        if(x.RECIPERELATIONCODE == copyTarget.RECIPERELATIONCODE && x.RECIPETYPE == "End"){
          insetIdx = idx;
        }
      });

      if(copyTarget.RECIPETYPE == "Start" || copyTarget.RECIPETYPE == "End" || copyTarget.RECIPETYPE == "Change"){
        copyTarget.RECIPETYPE = "Change"
        copyTarget.selected = true;
        copyTarget.UUID = Math.round(Math.random() * 1000000000);;
        this.targetData.splice(insetIdx, 0, copyTarget);
      }
    },
    btnUp(){
      let moveIdx = 0;
      const target = this.targetData.filter((x, idx) => {
        if(x.UUID == this.lastCheckItem){
          moveIdx = idx;
          return x;
        }
        return x;
      })
      const val = this.recipeTypeValidation("Up", moveIdx);
      if(val){
        this.targetData = this.arrayMove(this.targetData, moveIdx, -1)
      }
    },
    btnDown(){
      let moveIdx = 0;
      const target = this.targetData.filter((x, idx) => {
        if(x.UUID == this.lastCheckItem){
          moveIdx = idx;
          return x;
        }
        return x;
      })
      const val = this.recipeTypeValidation("Down", moveIdx);
      if(val){
        this.targetData = this.arrayMove(this.targetData, moveIdx, 1)
      }
    },
    arrayMove(list, targetIdx, moveValue){
      if (list.length < 0) return;
      const newPosition = targetIdx + moveValue;
      if (newPosition < 0 || newPosition >= list.length) return;
      const tempList = JSON.parse(JSON.stringify(list));
      const target = tempList.splice(targetIdx, 1)[0];
      tempList.splice(newPosition, 0, target);
      return tempList;
    },

    recipeTypeValidation(UpDownState , ActiveRow){
      let RecipeID = this.targetData[ActiveRow].RECIPEID
      let RecipeType = this.targetData[ActiveRow].RECIPETYPE
      let RecipeRelationCode = this.targetData[ActiveRow].RECIPERELATIONCODE
      if(UpDownState == "Up"){
        if(ActiveRow == 0){
          return false
        }
        if(RecipeType == "End"){
          if (this.targetData[ActiveRow - 1]["RECIPEID"] == RecipeID && this.targetData[ActiveRow - 1]["RECIPERELATIONCODE"] == RecipeRelationCode){
            if (this.targetData[ActiveRow - 1]["RECIPETYPE"] == "Start"){
              this.openAlert("", `현재 스탭 [${this.targetData[ActiveRow]["RECIPENAME"]}]은 \n\n종료이므로 시작 위로 설정할 수 없습니다.`);
              return false;
            }else if(this.targetData[ActiveRow - 1]["RECIPETYPE"] == "Change"){
              this.openAlert("", `현재 스탭 [${this.targetData[ActiveRow]["RECIPENAME"]}]은 \n\n종료이므로 변경 위로 설정할 수 없습니다.`);
              return false;
            }
          }
        }else if (RecipeType == "Change"){
          if (this.targetData[ActiveRow - 1]["RECIPEID"] == RecipeID && this.targetData[ActiveRow - 1]["RECIPERELATIONCODE"] == RecipeRelationCode){
            if (this.targetData[ActiveRow - 1]["RECIPETYPE"] == "Start"){
              this.openAlert("", `현재 스탭 [${this.targetData[ActiveRow]["RECIPENAME"]}]은 \n\n변경이므로 시작 위로 설정할 수 없습니다.`);
              return false;
            }
          }
        }
      }else if (UpDownState == "Down"){
        if (ActiveRow == this.targetData.length - 1){
          return false;
        }
        if (RecipeType == "Start"){
          if (this.targetData[ActiveRow + 1]["RECIPEID"] == RecipeID && this.targetData[ActiveRow + 1]["RECIPERELATIONCODE"] == RecipeRelationCode){
            if (this.targetData[ActiveRow + 1]["RECIPETYPE"] == "End"){
              this.openAlert("", `현재 스탭 [${this.targetData[ActiveRow]["RECIPENAME"]}]은 \n\n시작이므로 종료 밑으로 설정할 수 없습니다.`);
              return false;
            }else if (this.targetData[ActiveRow + 1]["RECIPETYPE"] == "Change"){
              this.openAlert("", `현재 스탭 [${this.targetData[ActiveRow]["RECIPENAME"]}]은 \n\n시작이므로 변경 밑으로 설정할 수 없습니다.`);
              return false;
            }
          }
        }else if (RecipeType == "Change"){
          if (this.targetData[ActiveRow + 1]["RECIPEID"] == RecipeID && this.targetData[ActiveRow + 1]["RECIPERELATIONCODE"] == RecipeRelationCode){
            if (this.targetData[ActiveRow + 1]["RECIPETYPE"] == "End"){
              this.openAlert("", `현재 스탭 [${this.targetData[ActiveRow]["RECIPENAME"]}]은 \n\n변경이므로 종료 밑으로 설정할 수 없습니다.`);
              return false;
            }
          }
        }
      }
      return true;
    },
    //row 선택
    selectRow() {
      const org = this.insertHierarchi;
      // console.log("ORG => ", this.insertHierarchi)
      // console.log("org.PROCESSSEQUENCE",org.PROCESSSEQUENCE)
      const target = this.targetData.map((x,idx) => {
        
        return {
          ...x, 
          DESCRIPTIONSET: "지시사항등록", 
          CONCURRENCYPROCESSBUTTON: "검색",
          UIKEY: Math.round(Math.random() * 1000000000),
          idx: idx,
          selected: false,
          CONCURRENCYPROCESSUIKEY: "",
          CONCURRENCYPROCESSNAME: "",
          RECIPETYPECODE: "",
          ROCCOMPOSITIONID: "",
          CONSUMEID: "",
          CONSUMETYPE: "",
          PROCESSNAME: `[${org.PROCESSSEQUENCE}] - ${org.PROCESSID}`,
          LASTUPDATETIME: "",
          LASTUPDATEUSERID: "",
          PROCESSSEQUENCE: org.PROCESSSEQUENCE,
          CONCURRENCYSEQUENCE: "",
          CONCURRENCYPROCESSID: "",
          PROCESSROUTEID: org.PROCESSROUTEID,
          PROCESSID: org.PROCESSID,
          RECIPEMODE: "",
          RECIPESEQUENCE: ((this.dgvRecipe.length + idx) * 100) + 100000,
          PLANTID: "LS",
          DESCRIPTION: "",
          // RECIPERELATIONCODE: (this.dgvRecipe.length + 1 + idx) *10, // 같은종류스텝(start, end..) 같은값필요
          ALIASRECIPENAME: `[${org.PROCESSSEQUENCE}] - ${x.RECIPENAME}[${x.RECIPETYPE || ''}]`
          
        }
      })
      const result = this.dgvRecipe.concat(target);
      this.setDgvRecipeAction(result);
      const gd = this.frmPRC_Data.map((x) => ({
        ...x,
        id: "routeGrid",
        label: x.PROCESSROUTEID,
        icon: "PROCESSROUTE",
      }));
      const pd = this.dgvOperation.map((x) => ({
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
        CONCURRENCYPROCESSBUTTON: "검색", DESCRIPTIONSET: "지시사항등록"
      }));
      this.setTreeDataAction([...gd, ...pd, ...sd]);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    openAlert(title, message, visiable=true, width="350px"){
      this.$refs.alertPop.title = title;
      this.$refs.alertPop.message = message;
      this.$refs.alertPop.visibleDialog = visiable;
      this.$refs.alertPop.modalWidth = width;
    },
    stepRowDbClick(e){
      this.selectStepDataSet();
    },

    selectStepDataSet(){
      const target = this.items.filter(x => x.selected).map(x => ({...x, selected: false}))[0]
      this.RelationCode++;
      if (target["RECIPEDEFTYPE"] == "Event"){
        if (this.start){
          let tar1 = JSON.parse(JSON.stringify(target))
          tar1["RECIPERELATIONCODE"] = (this.RelationCode * 10)
          tar1["RECIPETYPE"] = "Start";
          tar1["UUID"] = Math.round(Math.random() * 1000000000);
          this.targetData.push(tar1)
        }
        if (this.change){
          if (target["RECIPEDEFTYPE"] == "Event"){
            let tar2 = JSON.parse(JSON.stringify(target))
            tar2["RECIPERELATIONCODE"] = (this.RelationCode * 10)
            tar2["RECIPETYPE"] = "Change";
            tar2["UUID"] = Math.round(Math.random() * 1000000000);
            this.targetData.push(tar2)
          }
        }

        if (this.end){
          let tar3 = JSON.parse(JSON.stringify(target))
          tar3["RECIPERELATIONCODE"] = (this.RelationCode * 10)
          tar3["RECIPETYPE"] = "End";
          tar3["UUID"] = Math.round(Math.random() * 1000000000);
          this.targetData.push(tar3)
        }
      }
      else{
        let tar4 = JSON.parse(JSON.stringify(target))
        tar4["RECIPERELATIONCODE"] = (this.RelationCode * 10)
        tar4["RECIPETYPE"] = target["RECIPEDEFTYPE"];
        tar4["UUID"] = Math.round(Math.random() * 1000000000);
        this.targetData.push(tar4)
      }

    }
  },
};
</script>