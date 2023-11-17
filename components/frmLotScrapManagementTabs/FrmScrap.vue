<template>
  <div :style="{ height: '100%' }">
    <v-row ref="contents" no-gutters>
      <v-col :cols="12" :style="{ height: '100%' }">
        <v-row no-gutters>
          <v-col cols="12" align="right">
            <Button
              :theme-color="'primary'"
              :size="'small'"
              icon="save"
              @click="toggleDialog"
              >저장</Button
            >
          </v-col>
        </v-row>
        <v-row class="search-box" align="center" no-gutters>
          <v-col :cols="12">
            <div class="form-group-wrap form-group-style2">
              <div class="form-group">
                <Label>현재수량</Label>
                <InputText
                  ref="currentqty"
                  :dataNm="'currentqty'"
                  :readonly="true"
                  :defaultValue="currentqty"
                  @input-text-set="searchInput"
                />
              </div>
              <div class="form-group">
                <Label ref="labelqty"> {{ labelqty }}수량 </Label>
                <InputText
                  ref="workqty"
                  :dataNm="'workqty'"
                  :disabled="false"
                  :defaultValue="workqty"
                  @input="onInput"
                />
              </div>
              <div class="form-group">
                <Label>결과수량</Label>
                <InputText
                  ref="resultqty"
                  :dataNm="'resultqty'"
                  :readonly="true"
                  :defaultValue="resultqty"
                  @input-text-set="searchInput"
                />
              </div>
            </div>
          </v-col>
          <!--
                    <v-col :cols="1">
                        <Label>
                        현재수량
                        </Label>
                    </v-col>
                    <v-col :cols="3">
                    <InputText
                    ref="currentqty"
                    :boxWidth="'98%'"
                    :dataNm="'currentqty'"
                    :disabled="true"
                    :defaultValue="currentqty"
                    @input-text-set="searchInput"
                    />
                    </v-col>
                    <v-col :cols="1">
                        <Label ref="labelqty">
                            {{labelqty}}수량
                        </Label>
                    </v-col>
                    <v-col :cols="3">
                        <InputText
                        ref="workqty"
                        :boxWidth="'98%'"
                        :dataNm="'workqty'"
                        :disabled="false"
                        :defaultValue="workqty"
                        @input="onInput"
                        />
                    </v-col>
                    <v-col :cols="1">
                        <Label>
                        결과수량
                        </Label>
                    </v-col>
                    <v-col :cols="3">
                        <InputText
                        ref="resultqty"
                        :boxWidth="'98%'"
                        :dataNm="'resultqty'"
                        :disabled="true"
                        :defaultValue="resultqty"
                        @input-text-set="searchInput"
                        />
                    </v-col>
                    -->
        </v-row>
        <v-row
          class="divList divList1"
          :style="{ height: 'calc(100% - 374px)' }"
          no-gutters
        >
          <v-col cols="12" class="" align="left">
            <CardTitle
              >사유코드 목록<span class="i-msg"
                >사유코드 : {{ reasoncodename }}</span
              ></CardTitle
            >
          </v-col>
          <v-col cols="12" class="" :style="{ height: 'calc(100% - 33px)' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoGrid
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="items"
                :sortable="true"
                :columns="gridHeader"
                :resizable="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                @gridrowclick="onRowClick"
              />
            </div>
          </v-col>
        </v-row>
        <v-row ref="gridCard2" class="divList" no-gutters>
          <v-col cols="12" align="left">
            <CardTitle>Comment</CardTitle>
          </v-col>
          <v-col cols="12" align="left">
            <TextArea
              ref="comment"
              :style="{ width: '100%', height: '231px' }"
              @input="textAreaChange"
            ></TextArea>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import KendoGrid from "@/components/common/KendoGrid";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from "@progress/kendo-vue-treeview";
import { Button } from "@progress/kendo-vue-buttons";
import { TextArea } from "@progress/kendo-vue-inputs";
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
export default {
  name: "FrmScrap",
  mixins: [mixinGlobal],
  components: {
    Card,
    Button,
    CardBody,
    CardTitle,
    TreeView,
    KendoGrid,
    InputText,
    Checkbox,
    MesSelectBox,
    DropDownList,
    TextArea,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: "500px",
    },
    gridHeight2: {
      type: String,
      defaultData: "250px",
    },
    viewParam: {
      currentqty: "",
      workqty: "",
      resultqty: "",
    },
  },
  data() {
    return {
      gridHeader: [
        {field: "LOTID", editable: false, width: 150},
        {field: "PRODUCTID", editable: false, title: "제품코드", width: 130, cell: "", className: "gridTextCenter" },
        {field: "REASONCODE", editable: false, title: "사유코드", width: 450, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: "Yes", NOTNULLFLAG: null },
        {field: "DESCRIPTION", editable: false, title: "사유코드명", width: 450, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null }
      ],
      gridData: [],
      gridOriData: [],
      gridDropDownList: [],
      selectedField: "selected",
      // checkHeaderArr: ["GOINORDERREQUIRED"],
      comment: "",
      reasoncodename: "",
      reasoncode: "",
      reasoncodetype: "",
      noFirstCheck: true,
      noRowstat: true,
      headerParam: {
        gridid: "dgvReasonCode", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      selectedID: null,
      labelqty: "Scrap",
      currentqty: "",
      workqty: "",
      resultqty: "",
    };
  },
  created() {},
  async mounted() {
    this.currentqty = this.viewParam.currentqty;
    this.workqty = this.viewParam.workqty;
    this.resultqty = this.viewParam.resultqty;

    await this.getGridData();
  },
  computed: {
    items() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.REASONCODE === this.selectedID,
      }));
    },
  },
  watch: {
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReasoncodeList",
        sendParam: {
          plantid: "LS",
          reasoncode: "",
          reasoncodetype: "",
        },
      }).then((res) => {
        const data = res
          .filter((x) => x.REASONCODETYPE === "SCRAP")
          .sort((a, b) => a.POSITION - b.POSITION)
          .map((x, idx) => {
            return {
              ...x,
              rowStat: "N",
              selected: false,
              idx: idx,
              inEdit: true,
              newRow: false,
              LOTID: '',
              PRODUCTID: ''
            };
          });
        this.$nuxt.$emit("iccReset");
        this.gridOriData = data;
        this.gridData = data;
        this.reasoncodename = data[0].DESCRIPTION;
        this.reasoncode = data[0].REASONCODE;
        this.reasoncodetype = data[0].REASONCODETYPE;
      });
    },
    //그리드 로우 클릭
    onRowClick(event) {
      this.selectedID = event.dataItem.REASONCODE;
      this.reasoncodename = event.dataItem.DESCRIPTION;
      this.reasoncode = event.dataItem.REASONCODE;
      this.reasoncodetype = event.dataItem.REASONCODETYPE;
      //그리드 로우 클릭시 라인표시 유무 확인필요
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },

    //검색 인풋 변경시
    searchInput(nm, val) {
      this[nm] = val;
    },
    comboChange(nm, val) {
      this[nm] = val;
    },
    chkVal(nm, val) {
      this[nm] = val ? "Yes" : "";
    },
    textAreaChange(e) {
      this.comment = e.value;
    },

    onInput(e) {
      this.workqty = e.value;
      if (Number.isInteger(Number(this.workqty))) {
        let sumqty = 0;
        sumqty = Number(this.currentqty) - Number(e.value);
        this.resultqty = sumqty.toFixed(3);
        // currentqty: "", // 현재수량
        // workqty: "", // Scrap수량
        // resultqty: "", // 결과수량
        // console.log(nm) // workqty
      }
    },
    toggleDialog() {
      const param = {
        currentqty: this.currentqty,
        workqty: this.workqty,
        resultqty: this.resultqty,
        labelqty: this.labelqty,
      };
      this.$emit("toggleDialog", param);
    },
  },
};

const defaultData = {};
</script>
<style lang="scss" scoped>
@media (max-width: 1267px) {
  .divList1 {
    height: 234px !important;
  }
}
</style>
