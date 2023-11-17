<template>
  <div class="search-box">
    <dropdownlist
      :style="{ width: '100%' }"
      :class="readonly ? 'k-readonly' : ''"
      :data-items="codeLists"
      :text-field="'text'"
      :value-field="'id'"
      :value-primitive="true"
      :disabled="disabled"
      v-model="value"
      @change="handleChange"
    ></dropdownlist>
  </div>
</template>
    <!-- v-model="comboVal":default-value="codeLists[0]" -->

<script>

import { mapActions } from "vuex";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
export default {
  props: {
    enumID: {
      type: String,
      require: true,
      default: "",
    },
    allYN: {
      type: Boolean,
      require: false,
      default: false,
    },
    dataNm:{
      type: String,
      require: false,
      default: null
    },
    queryId:{
      type: String,
      require: false,
      default: null
    },
    queryVersion:{
      type: String,
      require: false,
      default: "00001"
    },
    defaultvalue:{
      type: String,
      require: false,
      default: null
    },
    sendParam:{},
    inputcol:[],
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
    initChangeEvent: {
      type: Boolean,
      require: false,
      default: false,
    },
  },
  components: {
    dropdownlist: DropDownList,
  },
  data() {
    return {
      codeLists: [],
      value: "",
      comboVal: "",
    };
  },
  computed: {},
  async created() {
    await this.getComboList();
  },
  async mounted() {
  },
  methods: {
    ...mapActions({
      mesGet: "modules/list/mesGet",
    }),
    getComboList(){
      this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: this.queryId,
          queryVersion: this.queryVersion,
          sendParam: this.sendParam
      }).then((data) => {
        if(this.allYN){
          const obj = {};
          obj[this.inputcol[0]] = "";
          obj[this.inputcol[1]] = "전체";
          data.unshift(obj)
        }
        this.codeLists = data.map(item => {
          return {
            id: item[this.inputcol[0]] === null ? "" : item[this.inputcol[0]],
            text: item[this.inputcol[1]] === null ? "" : item[this.inputcol[1]],
          }
        });
        
        if(this.codeLists.find(x => x.id === this.defaultvalue)) {
          this.value = this.defaultvalue;
        }
        else {
          this.value = this.codeLists[0] === undefined ? "" : this.codeLists[0].id;
        }

        this.befValue = this.value;

        if(this.initChangeEvent) {
          this.handleChange({value: this.value});
        }
      })
    },
    handleChange(event){
      if(this.readonly) {
        this.value = this.befValue;
      }
      else {
        this.befValue = this.value;
        this.$emit('comboChange', this.dataNm, event.value);
      }
    }
  },
};
</script>

<style></style>
