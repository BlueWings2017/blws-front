<template>
    <div>
      <span v-if="!visibleDialog">
        <Button @click="toggleDialog">Open Dialog</Button>
      </span>
      <Dialog
        v-if="visibleDialog"
        title="SetDescription"
        width="25%"
        height="280"
        @close="toggleDialog"
      >
        <v-row :style="{'margin-bottom': '10px'}">
          <v-col :cols="12" align="left">
            <v-row class="search-box" align="center" no-gutters>
                <v-col :cols="12" align="right">
                    <Button :theme-color="'primary'" :size="'medium'" icon="save" @click="save" >저장</Button>
                    <Button :theme-color="'primary'" :size="'medium'" icon="close"  @click="toggleDialog">닫기</Button>
                </v-col>
            </v-row>
            <v-row class="search-box" align="center" no-gutters>
              <v-col :cols="12">
                <TextArea 
                    :style="{ height: '140px', width: '100%', float:'left', marginTop:'20px' }"  
                    :auto-size="true" 
                    :rows="5"
                    :disabled="false"
                    v-model="descriptionTextArea"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </Dialog>
    </div>
  </template>
  <script>
  import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
  import { Button } from "@progress/kendo-vue-buttons";
  import mixinGlobal from "@/mixin/global.js";
  import { TextArea } from "@progress/kendo-vue-inputs";
  
  export default { 
    name: "SetDescriptionModal",
    mixins: [mixinGlobal],
    components: {
      Dialog,
      DialogActionsBar,
      Button,
      TextArea
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
        descriptionTextArea:"",
        descriptionTextAreaDefault:"취소사유를 입력해주세요",
      }
    },
    computed: {
      
    },
    async mounted() {
      this.descriptionTextArea = this.descriptionTextAreaDefault;

    //   await this.getGridData();
    },
    methods: {
        toggleDialog() {
            this.$emit('visibleDialog', !this.visibleDialog);
        },
        save() {
            console.log("사유::::::::", this.descriptionTextArea);
            this.$emit('visibleDialog', !this.visibleDialog);
            this.$emit('setComment', this.descriptionTextArea);
        },
      searchInput(nm, val){
        this[nm] = val;
      },
    },
  };
  </script>