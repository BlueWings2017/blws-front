<template>
  <div>
    <k-dialog
      v-if="visibleDialog"
      title="공정진행정보"
      width="20%"
      height="360"
      @close="toggleDialog"
    >
      <div ref="divWrapper" style="height:80%">
        <KendoGrid
          v-if="gridHeader.length > 0"
          ref="rowGrid"
          :gridHeight="gridHeight"
          :gridItems="gridItems"
          :columns="gridHeader"
          :resizable="true"
          :selected-field="selectedField"
          @gridrowclick="onRowClick"
        />
      </div>
    </k-dialog>
  </div>
</template>

<script>
import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
import mixinGlobal from '@/mixin/global.js';
import { Button } from '@progress/kendo-vue-buttons';
import KendoGrid from '@/components/common/KendoGrid';
import gridHeaderMinin from '@/mixin/gridHeaderMinin.js';
import { Card, CardBody, CardTitle } from '@progress/kendo-vue-layout';
export default {
  name: 'SelectProcessRouteInfo',
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    'k-dialog': Dialog,
    'dialog-actions-bar': DialogActionsBar,
    kbutton: Button,
    KendoGrid,
    Card,
    CardBody,
    CardTitle,
  },
  props: {
    visibleDialog: {
      type: Boolean,
      default: false,
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
      gridHeight: '200px',
      selectedField: 'selected',
      headerParam: {
        gridid: 'dgvRouteInfo',
      },
      gridHeader: [],
      noFirstCheck: true,
      noRowstat: true,
      selected: null,
    };
  },
  computed: {},

  mounted() {},
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog);
      this.callBack();
    },
    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      this.gridData.forEach(item => {
        item.selected = item.idx === selectedIdx;
      });
      this.selected = event.dataItem;
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
