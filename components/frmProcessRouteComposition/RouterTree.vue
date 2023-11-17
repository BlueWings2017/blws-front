<template>
  <Card ref="gridCard" :style="{height : '100%'}">
    <CardBody :style="{height : '100%'}">
      <div ref="divWrapper" :style="{height : '100%'}">
        <KendoTree
          ref="KendoTree"
          :treeData="treeData"
          :textField="'label'"
          :icon="'icon'"
          :draggable="false"
          children="items"
          @onExpandChange="onExpandChange"
          @onItemClick="onItemClick"
          @onItemDragOver="onItemDragOver"
          @onItemDragEnd="onItemDragEnd"
        >
        </KendoTree>
      </div>
    </CardBody>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
  </Card>
</template>

<script>
import mixinGlobal from "@/mixin/global.js";
import KendoTree from "@/components/common/KendoTree"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import { TreeView, TreeViewDragAnalyzer, moveTreeViewItem } from '@progress/kendo-vue-treeview';
import { mapState, mapActions } from "vuex";

export default {
  name: "RouterTree",
  mixins: [mixinGlobal],
  components: {
    Card,
    Button,
    CardBody, 
    CardTitle,
    TreeView,
    KendoTree
  },
  props:{
  },
  data() {
    return {
      mvTreeData: []
    };
  },
  created() {
  },
  async mounted() {
  },
  computed: {
    ...mapState({
      dgvOperation: state => state.modules.frmPRC.dgvOperation,
      dgvRecipe: state => state.modules.frmPRC.dgvRecipe,
      treeData: state => state.modules.frmPRC.treeData
    }),
  },
  methods: {
    ...mapActions({
      setdgvOperationAction: "modules/frmPRC/setdgvOperationAction",
      setDgvRecipeAction: "modules/frmPRC/setDgvRecipeAction",
      setMvTreeDataAction: "modules/frmPRC/setMvTreeDataAction",
      setIsTreeChange: "modules/frmPRC/setIsTreeChange",
      setIsTreeClicked: "modules/frmPRC/setIsTreeClicked"
    }),
    onExpandChange(event){
      event.item.expanded = !event.item.expanded;
    },
    onItemClick(event){
      this.setIsTreeClicked(true)
      const UIKEY = event.item.UIKEY
      const oData = this.dgvOperation.map(x => {
        if(UIKEY === x.UIKEY){
          return {...x, selected: true}
        }else{
          return {...x, selected: false}
        }
      });
      const rData = this.dgvRecipe.map(x => {
        if(UIKEY === x.UIKEY){
          return {...x, selected: true}
        }else{
          return {...x, selected: false}
        }
      });
      this.setdgvOperationAction(oData)
      this.setDgvRecipeAction(rData)
      this.$nuxt.$emit('treeTarget', event)
    },
    onItemDragOver(event){
      // console.log("onItemDragOver",event)
    },
    onItemDragEnd(event){
      const eventAnalyzer = new TreeViewDragAnalyzer(event).init();
      if (eventAnalyzer.isDropAllowed) {
        const treeClass = this.$refs.KendoTree.treeClass;
        const destination = (eventAnalyzer.destinationMeta.itemHierarchicalIndex.split("_") || []).length;
        const target = (event.itemHierarchicalIndex.split("_") || []).length;
        const destinationIdx = eventAnalyzer.destinationMeta.itemHierarchicalIndex.replace(/_/gi,"");
        const targetIdx = event.itemHierarchicalIndex.replace(/_/gi,"");;

        let dropOperation ='child';
        let UpDownState = "Up";

        switch(treeClass){
          case "k-i-insert-middle":
            if(target > destination){
              return;
            } 
            if(target == destination){
              dropOperation = destinationIdx < targetIdx ? 'after' : 'before';
              UpDownState =  dropOperation === 'before' ? 'Up' : 'Down';

            } else{
              dropOperation = 'child';
            }
            break;
          case "k-i-plus":
            if(target < destination){
              return;
            } 
            break;
          case "k-i-cancel":
            return;
          default:
            break;
        }

        const updatedTree = moveTreeViewItem(
          event.itemHierarchicalIndex,
          this.treeData,
          dropOperation, 
          eventAnalyzer.destinationMeta.itemHierarchicalIndex
        );
        const dataCopy = JSON.parse(JSON.stringify(updatedTree))
        
        const arrProcess = [];
        let arrStep = [];
        updatedTree[0].items.forEach((x,idx) => {
          const PROCESSSEQUENCE = ((idx + 1) * 100) + 100000;
          arrProcess.push(({...x, PROCESSSEQUENCE: PROCESSSEQUENCE} ));
          arrStep = arrStep.concat(x.items.map(y => ({...y, PROCESSSEQUENCE: PROCESSSEQUENCE})));
        });

        if(eventAnalyzer.event.item?.RECIPETYPE){
          const orgStep = arrStep.filter(x => x.RECIPERELATIONCODE == eventAnalyzer.event.item?.RECIPERELATIONCODE)
          const recipetypeArr = []//['Start', 'Change', 'End']
          orgStep.forEach(x => {
            if(x.RECIPETYPE === "Start"){
              recipetypeArr.push(1)
            }else if(x.RECIPETYPE === "Change"){
              recipetypeArr.push(2)
            }else if(x.RECIPETYPE === "End"){
              recipetypeArr.push(3)
            }
          });
          if(!this.isAscending(recipetypeArr)) return 
        }
        this.setMvTreeDataAction(dataCopy)
        this.setdgvOperationAction(arrProcess)
        this.setDgvRecipeAction(arrStep.filter(x => x));
        this.setIsTreeChange(true);
      }
    },
    isAscending(arr) {
      const sortedArray = [...arr].sort((a, b) => a - b);
      return JSON.stringify(arr) === JSON.stringify(sortedArray);
    },
  },
  watch: {
  },
};

const defaultData = {
};
</script>
<style lang="scss">

</style> 