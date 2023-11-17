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
    defaultValue: {
      type: String,
      require: true,
      default: "",
    }
  },
  components: {
    dropdownlist: DropDownList,
  },
  data() {
    return {
      codeLists: [],
      value: "",
      befValue: "",
    };
  },
  computed: {},
  async created() {
    await this.mesGet({
      apiKey: "mes/common/getqueryresult",
      queryId: "GetEnumValue",
      sendParam: {
        plantid: "LS",
        enumid: this.enumID
      }
    }).then((data) => {
      if(this.allYN){
        data.unshift({ENUMVALUE: "", ENUMVALUENAME: "전체"})
      }
      this.codeLists = data.map(item => {
        return {
          id: item.ENUMVALUE,
          text: item.ENUMVALUENAME,
        }
      });

      if(this.codeLists.find(x => x.id === this.defaultValue)) {
        this.value = this.defaultValue;
      }
      else {
        this.value = this.codeLists[0] === undefined ? "" : this.codeLists[0].id;
      }
      this.befValue = this.value;
    });
  },
  methods: {
    ...mapActions({
      mesGet: "modules/list/mesGet",
    }),
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
