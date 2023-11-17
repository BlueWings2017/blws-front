<template>
    <!--
    <v-row class="search-box" align="center" no-gutters>
    <v-col v-if="label" :cols="labelCols">
      <Label>
        -->
        <!-- <v-icon x-small :color="required ? '#fb8200' : 'primary'" class="mr-1"
          >mdi-record-circle</v-icon
        > -->
        <!--
        {{ label }}
      </Label>
    </v-col>
    -->
    <!-- v-model="chkValue" -->
    <!--
    <v-col :cols="label ? textCols : ''">
      <Checkbox
        :disabled="disabled"
        :readonly="readonly || false"
        :required="required || false"
        :default-checked="defaultchecked"
        :false-value="false"
        :color="isDarkMode ? '#fff' : '#4777d9'"
        @change="modifyValue"
      ></Checkbox>
    </v-col>
  </v-row>
  -->

    <Checkbox
    :class="readonly ? 'k-readonly' : ''"
    :disabled="disabled"
    :readonly="readonly || false"
    :required="required || false"
    :default-checked="defaultchecked"
    :false-value="false"
    @change="modifyValue"
    ></Checkbox>
  
</template>
  
<script>
  import { mapState, mapMutations } from "vuex";
  import { Checkbox } from "@progress/kendo-vue-inputs";
  import { Label } from "@progress/kendo-vue-labels";
  export default {
    props: {
      label: {
        type: String,
        require: true,
      },
      isDarkMode: {
        type: Boolean,
        require: false,
        default: false,
      },
      required: {
        type: Boolean,
        require: false,
        default: false,
      },

      disabled: {
        type: Boolean,
        require: false,
        default: false,
      },
      readonly: {
        type: Boolean,
        require: false,
        default: false,
      },
      valueNm: {
        type: String,
        require: true,
      },
      labelCols: {
        type: Number,
        require: false,
        default: 4,
      },
      textCols: {
        type: Number,
        require: false,
        default: 7,
      },
      dataNm: {
        type: String,
        require: false,
        default: null,
      },
      defaultchecked: {
        type: Boolean,
        require: false,
        default: false,
      },
    },
    components: {
      Checkbox,
      Label,
    },
    data() {
      return {
        chkValue: false,
        testData: false,
        disabledFlag: false,
      };
    },

    computed: {
      ...mapState({}),
    },
    watch: {},
    created() {},
    methods: {
      ...mapMutations({}),
      modifyValue(val) {
        this.$emit("checkbox-set", this.dataNm, val.value);
      },
    },
  };
</script>
  
<style></style>
  