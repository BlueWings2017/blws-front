<template>
  <div>
    <k-dialog
        v-if="visibleDialog"
        :title="$i18n.t('CommLang.label.label8')"
        @close="toggleDialog"
    >
    <v-row align="center" :style="{width : '500px'}">
    <v-col :cols="12">
      <KInput
        type="password"
        :label="$i18n.t('CommLang.message.msg3')"
        :style="{width : '100%'}"
        height="44"
      ></KInput>
    </v-col>
    </v-row>
    <v-row align="center" :style="{width : '500px'}">
    <v-col :cols="12">
      <KInput
        type="password"
        :style="{width : '100%'}"
        :label="$i18n.t('CommLang.message.msg4')"
        height="44"
      ></KInput>
    </v-col>
    </v-row>
    <v-row align="center" :style="{width : '500px'}">
    <v-col :cols="12">
      <KInput
        type="password"
        :label="$i18n.t('CommLang.message.msg5')"
        :style="{width : '100%'}"
        height="44"
      ></KInput>
    </v-col>
    </v-row>        
    <dialog-actions-bar>
      <kbutton :theme-color="'primary'" @click="toggleDialog">{{$t('CommLang.btn.submitBtn')}}</kbutton>
      <kbutton @click="toggleDialog">{{$t('CommLang.btn.closeBtn')}}</kbutton>
    </dialog-actions-bar>
    </k-dialog>
  </div>
</template>

<script>

import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from '@progress/kendo-vue-buttons';
import {
  Input,
} from "@progress/kendo-vue-inputs";
export default {
  components: {
      "k-dialog": Dialog,
      "dialog-actions-bar": DialogActionsBar,
      'kbutton': Button,
      KInput: Input,
  },
  props: {

  },
  data: function() {
    return {
      visibleDialog: false,
      message: null
    };
  },
  computed:{
  },
  watch:{
  },
  mounted(){},
  methods: {
    toggleDialog() {
        this.visibleDialog = !this.visibleDialog;
    },
  } 
}
</script>
<style scoped lang="scss">
.k-window-titlebar {
  border-color: inherit !important;
  color: white !important;
  background-color: #e7607b !important;
}
</style>