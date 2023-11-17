<template>
  <!-- gusalnim TODO popup 노출할때 active -->
  <div class="modal-wrap" :class="visibleDialog? 'active': ''">
    <div class="modal menu-modal">
      <div class="pop_boxs">
        <h3 class="pop_tit">메뉴검색</h3>
        <div class="contents">contents area...</div>
      </div>
      <div class="btns">
        <button class="button" @click="toggleDialog()">닫기</button>
      </div>
    </div>
    <div class="back" @click="toggleDialog()">&nbsp;</div>
  </div>
</template>

<script>
import { Button } from "@progress/kendo-vue-buttons";

export default {
  components: {
    //kbutton: Button,
  },
  props: {
    callBack: {
      type: Function,
      default: () => true,
    },
  },
  data: function () {
    return {
      visibleDialog: false,
      message: null,
      title: null,
      modalWidth: "300px",
      callBack2: () => true,
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    toggleDialog() {
      this.visibleDialog = !this.visibleDialog;
      //this.callBack();
      //this.callBack2();
    },
    show(title, message, modalWidth = "300px", visibleDialog = true) {
      this.title = title;
      this.message = message;
      this.modalWidth = modalWidth;
      this.visibleDialog = visibleDialog;
    },
  },
};
</script>
