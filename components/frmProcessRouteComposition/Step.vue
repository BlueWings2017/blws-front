<template>
  <div :style="{ height: '100%' }">
    <v-row no-gutters>
      <v-col cols="8" align="left">
        <CardTitle>스텝</CardTitle>
      </v-col>
    </v-row>
    <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
      <KendoGrid
        ref="rowGrid"
        :gridHeight="gridHeight"
        :gridItems="gridData"
        :sortable="true"
        :columns="gridHeader"
        :resizable="false"
        :edit-field="'inEdit'"
        :selected-field="selectedField"
        :gridDropDownList="gridDropDownList"
        :checkHeaderArr="checkHeaderArr"
        @gridrowclick="onRowClick"
        @gridddchang="rowDdChange"
        @griditemchange="griditemchange"
        @gridButtonClick="gridButtonClick"
      />
    </div>

    <AlertPop ref="alertPop" :is="'alertPop'" />
    <CurrentSearchModal
      ref="CurrentSearchModal"
      v-if="currentSearchModalVisible"
      :visibleDialog="currentSearchModalVisible"
      :gridData="currentGridData"
      title="동시 진행스텝"
      :inputVal="inputVal"
      @visibleDialog="(val) => (currentSearchModalVisible = val)"
      @selectedRow="selectedRow"
      @cancelRow="cancelRow"
    />
    <TextAreaModal
      ref="TextAreaModal"
      v-if="textAreaModalVisible"
      :visibleDialog="textAreaModalVisible"
      title="지시사항등록"
      :defaultValue="defaultDescription"
      @visibleDialog="(val) => (textAreaModalVisible = val)"
      @descriptionSave="descriptionSave"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
// import { Input } from '@progress/kendo-vue-inputs';
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { mapState, mapMutations, mapActions } from "vuex";
import CurrentSearchModal from "@/components/frmProcessRouteComposition/CurrentSearchModal";
import TextAreaModal from "@/components/frmProcessRouteComposition/TextAreaModal";

export default {
  name: "Step",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Card,
    Button,
    CardBody,
    CardTitle,
    KendoGrid,
    InputText,
    Checkbox,
    MesSelectBox,
    DropDownList,
    CurrentSearchModal,
    TextAreaModal,
  },
  props: {
    gridHeight: {
      type: String,
      defaultData: "500px",
    },
    gridOriData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      gridHeader: [],
      gridDropDownList: [
        {
          dataVal: "RECIPEMODE",
          dataItem: [],
        },
      ],
      selectedField: "selected",
      checkHeaderArr: ["AUTOTRACKIN", "AUTOTRACKOUT"],
      headerParam: {
        gridid: "dgvRecipe", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      noFirstCheck: true,
      currentSearchModalVisible: false,
      currentGridData: [],
      inputVal: "",
      btnClickRow: {},
      textAreaModalVisible: false,
      defaultDescription: "",
    };
  },
  created() {},
  async mounted() {
    await this.getGridComboList();
  },
  computed: {
    ...mapState({
      gridData: (state) => state.modules.frmPRC.dgvRecipe,
    }),
  },
  watch: {},
  methods: {
    ...mapActions({
      setDgvRecipeAction: "modules/frmPRC/setDgvRecipeAction",
    }),
    //그리드 로우 클릭
    onRowClick(event) {},
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex((x) => x.RECIPESEQUENCE === dataItem.RECIPESEQUENCE);
      // const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));
      console.log()
      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.gridHeader, data, this.gridOriData, idx)) {
        data[idx].rowStat = "N";
      }

      this.setDgvRecipeAction(data);
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }

      this.setDgvRecipeAction(data);
    },

    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter((x) => {
        return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
    },

    //그리드 콤보박스 리스트가져오기
    async getGridComboList() {
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValue",
        sendParam: {
          plantid: "LS",
          enumid: "RecipeMode",
        },
      }).then((data) => {
        this.gridDropDownList[0].dataItem = data;
      });
    },
    //그리드 버튼 클릭
    gridButtonClick(e, field, dataItem) {
      if (field === "CONCURRENCYPROCESSBUTTON") {
        this.currentGridData = this.gridData.filter(
          (x) => x.idx > dataItem.idx
        );
        if (this.currentGridData.length === 0) {
          this.$refs.alertPop.title = "";
          this.$refs.alertPop.message = "현재 마지막 공정입니다.";
          this.$refs.alertPop.modalWidth = "330px";
          this.$refs.alertPop.visibleDialog = true;
          return;
        }
        this.btnClickRow = dataItem;
        this.inputVal = dataItem.PROCESSNAME;
        this.currentSearchModalVisible = true;
      } else {
        this.btnClickRow = dataItem;
        this.defaultDescription = dataItem.DESCRIPTION;
        this.textAreaModalVisible = true;
      }
    },
    //동시진행공정 선택
    selectedRow(row) {
      const data = this.gridData.map((x) => {
        if (this.btnClickRow?.UIKEY === x.UIKEY) {
          return {
            ...x,
            CONCURRENCYPROCESSID: row.PROCESSID,
            CONCURRENCYPROCESSNAME: `[${row.PROCESSSEQUENCE}] - ${row.PROCESSID}`,
            CONCURRENCYPROCESSUIKEY: row.UIKEY,
            CONCURRENCYSEQUENCE: row.PROCESSSEQUENCE,
            rowStat: "U",
          };
        }
        return x;
      });
      this.setDgvRecipeAction(data);
    },
    //동시진행공정 취소
    cancelRow() {
      const data = this.gridData.map((x) => {
        if (this.btnClickRow?.UIKEY === x.UIKEY) {
          return {
            ...x,
            CONCURRENCYPROCESSID: null,
            CONCURRENCYPROCESSNAME: null,
            CONCURRENCYPROCESSUIKEY: null,
            CONCURRENCYSEQUENCE: null,
            rowStat: "N",
          };
        }
        return x;
      });
      this.setDgvRecipeAction(data);
    },
    //지시사항등록
    descriptionSave(text) {
      const data = this.gridData.map((x) => {
        if (this.btnClickRow?.UIKEY === x.UIKEY) {
          return { ...x, DESCRIPTION: text, rowStat: "U" };
        }
        return x;
      });
      this.setDgvRecipeAction(data);
    },
    initGrid() {
      this.$nuxt.$emit("iccReset");
    },
  },
};
</script>
<style lang="scss">
</style>