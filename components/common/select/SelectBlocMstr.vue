<template>
  <v-row class="search-box" align="center" no-gutters>
    <v-col v-if="label" :cols="labelCols">
      <Label>
        <v-icon x-small :color="required ? '#fb8200' : 'primary'" class="mr-1">
          mdi-record-circle
        </v-icon>
        {{ label }}
      </Label>
    </v-col>
    <v-col :cols="label ? textCols : ''">
      <DropDownList
        ref="selectBox"
        :style="{ width: boxWidth }"
        :data-items="blocCodeLists"
        :default-value="blocCodeLists[0]"
        :text-field="'text'"
        :value="value"
        :rounded="'large'"
        :fill-mode="'outline'"
        @change="selectCommCd"
      >
      </DropDownList>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { Label } from "@progress/kendo-vue-labels";
export default {
  props: {
    label: {
      type: String,
      require: false,
      default: "사업장",
    },
    sendParam: {
      type: Object,
      require: false,
      default: () => {
        return {};
      },
    },
    addAll: {
      type: Boolean,
      require: false,
      default: false,
    },
    required: {
      type: Boolean,
      require: false,
      default: false,
    },
    textCols: {
      type: Number,
      require: false,
      default: 8,
    },
    labelCols: {
      type: Number,
      require: false,
      default: 4,
    },
    boxWidth: {
      type: String,
      require: false,
      default: "100%",
    },
    searchOption: {
      type: Boolean,
      require: false,
    },
    dataNm: {
      type: String,
      require: false,
      default: null,
    },
    dataTextNm: {
      type: String,
      require: false,
      default: null,
    },
  },
  components: {
    DropDownList,
    Label,
  },
  data() {
    return {
      blocCodeLists: [],
      value: {},
    };
  },
  computed: {},
  async created() {
    const DOMAIN = "/api/";
    const params = { params: this.sendParam };
    const res = await this.$axios.post(
      DOMAIN + "comm/base/CommCtr/selectBlocMstrCodeList",
      params
    );
    let newList = res.data.dataset.blocCodeLists;
    if (this.addAll) newList.unshift({ blocId: "", blocNm: "전체" });
    this.blocCodeLists = newList.map((item) => ({
      text: item.blocNm,
      id: item.blocId,
    }));
    if (this.searchOption) {
      this.value = newList.map((item) => ({
        text: item.blocNm,
        id: item.blocId,
      }))[0];
    }
    this.$emit(
      "comm-cd-set",
      this.dataNm,
      this.dataTextNm,
      newList[0].blocId,
      newList[0].blocNm
    );
  },
  methods: {
    selectCommCd(val) {
      this.value = { text: val.value.text, id: val.value.id };
      this.$emit(
        "comm-cd-set",
        this.dataNm,
        this.dataTextNm,
        val.value.id,
        val.value.text
      );
    },
    setCommCd(val) {
      let tmp = {};
      this.blocCodeLists.filter((item, i) => {
        if (item.id == val) {
          tmp = item;
        }
      });
      this.value = tmp;
    },
  },
};
</script>

<style></style>
