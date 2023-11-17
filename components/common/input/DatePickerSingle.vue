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
      <div class="form-datepicker">
        <DatePicker
          :style="{ width: boxWidth }"
          v-model="textVal"
          :default-value="defaultValue"
          :format="format"
          :hide-details="true"
          @change="inputText"
          @keyup.enter="search"
        ></DatePicker>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import { Label } from "@progress/kendo-vue-labels";
import { IntlProvider, load, loadMessages, LocalizationProvider, } from "@progress/kendo-vue-intl";

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
    defaultValue: {
      type: Date,
      require: false,
      default: new Date(),
    },
    format: {
      type: String,
      require: false,
      default: "yyyy-MM-dd",
    },
  },
  components: {
    DatePicker,
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
  created() {},
  methods: {
    search() {
      if (this.searchOption === true) {
        this.$emit("input-date-set", this.dataNm, this.textVal);
      }
    },
    inputText(val) {
      this.$emit("input-date-set", this.dataNm, this.textVal);
    },
  },
  watch: {
    defaultValue(){
      this.textVal = this.defaultValue;
    }
  }
};
</script>

<style></style>
