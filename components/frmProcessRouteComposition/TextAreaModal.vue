<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="title"
      width="40%"
      height="400"
      @close="toggleDialog"
    >
      <v-row :style="{'margin-bottom': '10px'}">
        <v-col :cols="8" align="left">
        </v-col>
        <v-col :cols="4" align="right">
          <Button icon="save" @click="save">저장</Button>
          <Button icon="close" @click="toggleDialog">닫기</Button>
        </v-col>
      </v-row>
      <v-row :style="{'margin-bottom': '10px'}">
        <v-col :cols="12" align="left">
          <TextArea
            :style="{ height: '220px' }"  
            :auto-size="true" 
            :rows="5"
            v-model="textAreaData"
          />
        </v-col>
      </v-row>
        
    </Dialog>

    <!-- <div v-if="isLoading" class="loading-container" :style="{'z-index': '999999', position: 'relative'}">
      <div class="loading">
        <FadeLoader />
      </div>
    </div> -->

  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import { TextArea } from "@progress/kendo-vue-inputs";

export default { 
  name: "SearchModal",
  mixins: [mixinGlobal],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    FadeLoader,
    TextArea
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    defaultValue: {
      type: String,
      default: "",
    },
    callBack: {
      type: Function,
      default: () => true
    },
  },
  data() {
    return {
      textAreaData: ""
    }
  },
  computed: {
  },
  mounted() {
    this.textAreaData = this.defaultValue
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    save() {
      this.$emit('visibleDialog', !this.visibleDialog)
      this.$emit('descriptionSave', this.textAreaData)
    },
  },
  watch: {
  }
};
</script>