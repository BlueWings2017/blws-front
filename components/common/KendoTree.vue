<template>
  <div class="grid-tree" :style="{height : '100%'}">
    <TreeView
      :style="{height : treeHeight}"
      :animate="false"
      :dataItems="treeData"
      :expandIcons="true"
      :children-field="children"
      :text-field="textField"
      :draggable="draggable"
      :item="'item'"
      @expandchange="onExpandChange"
      @itemclick="onItemClick"
      @itemdragover="onItemDragOver"
      @itemdragend="onItemDragEnd"
    >
      <template v-slot:item="{ props }">
        <span :class="props.item.depthValue + ' level-' + props.item.depth">
          <span v-if="icon !== '' && props.item[icon]" class="tree-icon" :class="iconClass[props.item[icon]]"></span>
          <span class="treeLeefText" :class="props.item.id === activeItem.id ? 'on' : ''">
            {{ props.item[textField] }}
          </span>
        </span>
      </template>
    </TreeView>
    <TreeViewDragClue ref="dragClue" />
  </div>
</template>
<script>

import { TreeView, TreeViewDragClue, processTreeViewItems, moveTreeViewItem, TreeViewDragAnalyzer, } from '@progress/kendo-vue-treeview';
import { mapState, mapMutations } from "vuex";
const SEPARATOR = '_';
function getSiblings(itemIndex, data) {
  let result = data;
  let result2 = data;
  const indices = itemIndex.split(SEPARATOR).map((index) => Number(index));
  for (let i = 0; i < indices.length - 1; i++) {
    // result = result[indices[i]]?.children || [];
    result = result[indices[i]]?.items || [];
  }

  return result;
}
export default {
  name:"kendoT",
  components: {
    TreeView,
    TreeViewDragClue
  },
  props: {
    treeData: {
      type: Array,
      require: false,
      default: () => {
        return [];
      }
    },
    textField: {
      type: String,
      require: false,
      default: () =>{
        return "";
      }
    },
    activeItem: {
      type: Object,
      require: false,
      default: () =>{
        return {};
      }
    },
    treeHeight: {
      type: String,
      require: false,
      default : '100%'   
    },
    icon: {
      type: String,
      require: false,
      default: ""
    },
    draggable: {
      type: Boolean,
      default : false
    },
    children: {
      type: String,
      default : "children"
    },
    
  },
  created(){

  },
  computed: {
    ...mapState({
      drawer: state => state.drawer,
      activeMenuId(state) {
        if(state.activeMenuInfo)
        return state.activeMenuInfo.menuId;
      }
    }),
  },
  watch:{
    
  },
  data(){
    return{
      //각 화면 트리 아이콘 세팅부분 참조
      iconClass: {
        Product : "ic-mes-product",
        'Half-Product' : "ic-mes-halfprod",
        MATERIAL : "ic-mes-matr",
        PROCESSROUTE: "ic-mes-route",
        PROCESS: "ic-mes-process",
        RECIPE: "ic-mes-step",
        CONSUMABLE: "ic-mes-inmatr",
        RECIPEPARAMETER: "ic-mes-proccond"
      },
      dragOverCnt: 0,
      treeClass: ""
    }
  },
  async mounted() {

  },
  methods:{
    onExpandChange(event){
      this.$emit('onExpandChange', event)
    },
    onItemClick(event){
      this.$emit('onItemClick', event)
    },
    onItemDragOver(event){
      this.dragOverCnt++;
      const idx = event.itemHierarchicalIndex;
      let label = ""
      if(idx.length === 5){
        label = event.item.ALIASRECIPENAME || `[${event.item.PROCESSSEQUENCE}] - ${event.item.RECIPENAME}[${event.item.RECIPETYPE || ''}]`
      }else{
        label = event.item.PROCESSNAME
      }
      // console.log(this.getClueClassName(event))
      this.treeClass =  this.getClueClassName(event)
      this.$refs.dragClue.show(
        event.pageY - 180,
        event.pageX - 250,
        label,
        this.treeClass
      );
      this.$emit('onItemDragOver', event)
    },
    onItemDragEnd(event){
      this.isDragDrop = this.dragOverCnt > 0;
      this.dragOverCnt = 0;
      this.$emit('onItemDragEnd', event);
      this.$refs.dragClue.hide();
    },
    getClueClassName(event) {
      const eventAnalyzer = new TreeViewDragAnalyzer(event).init();
      const { itemHierarchicalIndex: itemIndex } = eventAnalyzer.destinationMeta;
      // console.log("itemIndex",itemIndex) //목적지
      // console.log("event.itemHierarchicalIndex",event.itemHierarchicalIndex)//대상
      // if(itemIndex === '0'){
      //   return 'k-i-cancel'; 
      // }
      // if()
      
      if(event.itemHierarchicalIndex === '0' || itemIndex === '0'){
        return 'k-i-cancel';
      }
        
      if (eventAnalyzer.isDropAllowed) {
        
        const target = (event.itemHierarchicalIndex.split("_") || []).length;
        const destination = itemIndex.split("_").length;

        if(target < destination){
          return 'k-i-cancel';
        }else if(target == destination){
          return 'k-i-insert-middle';
        }
      
        switch (eventAnalyzer.getDropOperation()) {
          case 'child':
            return 'k-i-plus';
          case 'before':
            return itemIndex === '0' || itemIndex.endsWith(`${SEPARATOR}0`)
              ? 'k-i-cancel'
              : 'k-i-insert-middle';
          case 'after': 
            const siblings = getSiblings(itemIndex, this.treeData);
            const lastIndex = Number(itemIndex.split(SEPARATOR).pop());
            return lastIndex < siblings.length - 1
              ? 'k-i-insert-middle'
              : 'k-i-cancel';
          default:
            break;
        }
      } 
      
    },
  }
}
</script>
