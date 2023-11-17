<template>
  <div ref="contents">
    <k-dialog 
      v-if="visibleDialog" 
      title='SelectProcessRouteInfo'
      width="50%"
      height="600"
      @close="toggleDialog"
    >
      <v-row align="center">
        <div ref="divWrapper" >
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridItems"
                :columns="columns"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
              />
            </div>

      </v-row>
      <dialog-actions-bar>
        <kbutton 
          @keydown.enter="toggleDialog" 
          @click="toggleDialog"
        >
          {{$t("CommLang.btn.closeBtn")}}
        </kbutton>
      </dialog-actions-bar>
    </k-dialog>
  </div>
</template>

<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import mixinGlobal from "@/mixin/global.js";
import { Button } from "@progress/kendo-vue-buttons";
import KendoGrid from '@/components/common/KendoGrid';

export default {
  name: "SelectComsumableHistory", 
   mixins: [mixinGlobal],
  components: {
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
    kbutton: Button,
    KendoGrid
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    columns:{
      type:Array ,
      default:[]
    },
    gridItems:{
      type:Array ,
      default:[]
    },

    callBack: {
      type: Function,
      default: () => true
    },
  },
  data() {
    return {
      gridHeight:'400px',
      selectedField: "selected",
    };
  },
  computed: {},

  mounted() { 
    this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
  },
  methods: {
    toggleDialog() {
      this.$emit("visibleDialog", !this.visibleDialog);
    },
  },
};
</script>

<style scoped lang="scss">
.k-window-titlebar {
  border-color: inherit !important;
  color: white !important;
  background-color: #e7607b !important;
}
</style>