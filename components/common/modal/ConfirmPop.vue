<template>
  <div>
    <Dialog v-if="visibleDialog" :title="title" @close="toggleDialog">
      <div v-html="message" :class="'modal-msg'"></div>
      <DialogActionsBar>
        <Button :theme-color="'primary'" @click="toggleDialogYes">Yes</Button>
        <Button :theme-color="'secondary'" @click="toggleDialog">No</Button>
      </DialogActionsBar>
    </Dialog>
  </div>
</template>

<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";

export default {
  components: {
    Dialog,
    DialogActionsBar,
    Button,
  },
  props: {
    // callBack: {
    //   type: Function,
    //   default: () => true
    // },
  },
  data() {
    return {
      visibleDialog: false,
      title: "",
      message: "",
      callBack: () => true,
      callBack2: () => true,
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    toggleDialog() {
      this.visibleDialog = !this.visibleDialog;
      this.callBack2();
    },
    toggleDialogYes() {
      this.visibleDialog = !this.visibleDialog;
      this.callBack();
    },
  },
};
</script>
<style scoped lang="scss"></style>
