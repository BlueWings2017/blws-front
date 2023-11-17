<template>
  <div ref="contents">
    <k-dialog
      v-if="visibleDialog"
      title="자재투입내역"
      width="50%"
      height="300"
      @close="toggleDialog"
    >
      <v-row align="center">
        <v-col>
          <div ref="divWrapper">
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
        </v-col>
      </v-row>
    </k-dialog>
  </div>
</template>

<script>
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import mixinGlobal from '@/mixin/global.js';
import { Button } from '@progress/kendo-vue-buttons';
import KendoGrid from '@/components/common/KendoGrid';

export default {
  name: 'SelectComsumableHistory',
  mixins: [mixinGlobal],
  components: {
    'k-dialog': Dialog,
    'dialog-actions-bar': DialogActionsBar,
    kbutton: Button,
    KendoGrid,
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    columns: {
      type: Array,
      default: [],
    },
    gridItems: {
      type: Array,
      default: [],
    },

    callBack: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      gridHeight: '400px',
      selectedField: 'selected',
    };
  },
  computed: {},

  // mounted() {
  //   this.gridHeight = this.$refs.contents.offsetHeight - 180 + 'px';
  // },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
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
