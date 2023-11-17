<template>
  <v-row class="search-box" align="center" no-gutters>
    <v-col v-if="label" :cols="labelCols">
      <Label>
        <v-icon x-small :color="required ? '#fb8200' : 'primary'" class="mr-1"
          >mdi-record-circle</v-icon
        >
        {{ label }}
      </Label>
    </v-col>
    <v-col :cols="label ? textCols : ''">
      <Input
        :style="{ width: boxWidth }"
        v-model="textVal"
        class="v-input__custom"
        :class="readonly ? 'k-readonly' : ''"
        :disabled="disabled"
        :readonly="readonly"
        :type="type"
        :placeholder="placeholder"
        outlined
        :hide-details="true"
        @change="inputText"
        @input="onInput"
        @keyup.enter="search"
      >
      </Input>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { Input } from "@progress/kendo-vue-inputs";
import { Label } from "@progress/kendo-vue-labels";
export default {
  props: {
    diffModel: {
      type: String,
      require: false,
    },
    label: {
      type: String,
      require: true,
    },
    valueNm: {
      type: String,
      require: true,
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
    searchOption: {
      type: Boolean,
      require: false,
    },
    required: {
      type: Boolean,
      require: false,
      default: false,
    },
    boxWidth: {
      type: String,
      require: false,
      default: "100%",
    },
    dataNm: {
      type: String,
      require: false,
      default: null,
    },
    type: {
      type: String,
      require: false,
      default: "text",
    },
    defaultValue: {
      type: String,
      require: false,
      default: "",
    },
    searchFunc: {
      type: Function,
      require: false,
      default: undefined,
    },
    placeholder: {
      type: String,
      require: false,
    },
  },
  components: {
    Input,
    Label,
  },
  data() {
    return {
      textVal: null,
    };
  },
  computed: {
    ...mapState({}),
  },
  created() {
  },
  methods: {
    search() {
      if (this.searchOption === true) {
        if(this.searchFunc) {
          this.searchFunc();
        }
        else {
          this.$emit("input-text-set", this.dataNm, this.textVal);
        }
      }
    },
    inputText(val) {
      this.$emit("input-text-set", this.dataNm, this.textVal);
    },
    onInput(e) {
      this.$emit("input", e, this.dataNm);
    },
    
  },
  watch: {
    defaultValue(newVal, oldVal){
      this.textVal = newVal;
    }
  }
};
</script>

<style></style>
