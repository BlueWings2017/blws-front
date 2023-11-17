<template>
  <v-col :cols="12">
    <Card :style="{'margin-top': '10px'}">
      <CardBody :style="{width:'100%'}">

        <v-row>
          <v-col :cols="6">
            <KendoGrid 
              ref="rowGrid"
              gridHeight="150px"
              :gridItems="gridItems"
              :sortable="true"
              :columns="header"
              :resizable="true"
              :edit-field="'inEdit'"
              :selected-field="selectedField"
              @gridrowclick="gridrowclick"
              @rowdblclick="select"
            />
          </v-col>
        </v-row>

      </CardBody>
    </Card>
  </v-col>
</template>

<script>
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import mixinGlobal from "@/mixin/global.js";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText"
import { Checkbox } from "@progress/kendo-vue-inputs";
import { Button } from "@progress/kendo-vue-buttons";

export default {
  name: "DownTimeList",
  mixins: [mixinGlobal],
  components: {
    Button,
    KendoGrid,
    InputText,
    Card,
    CardBody,
    CardTitle,
    Checkbox
  },
  props:{
  },
  data() {
    return {
      selectedField: 'selected',
      g_EQUIPMENTID: "",//설비정보 그리드 설비코드
      equipAll: false,
      gridItems: [],
    }
  },
  computed: {
    header(){
      return [
        {field: "DESCRIPTION", editable: true, title: "코드", width: 200, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: "Yes", NOTNULLFLAG: null },
        {field: "PROCESSTIME", editable: true, title: "분", width: 200, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
      ]
    }
  },
  async mounted() {
    this.search();
  },
  methods: {
    searchInput(nm, val){
      this[nm] = val;
    },
    gridrowclick(event){
      // const id = event.dataItem?.EQUIPMENTID
      // this.gridItems = this.gridItems.map(x => {
      //   if(x.EQUIPMENTID === id){
      //     return {...x, selected: true}
      //   }
      //   return {...x, selected: false}
      // })
    },
    async search(){
      const data = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReasoncodeList",
        sendParam: {
          plantid: "Ls",
          reasoncodetype: "DOWNTIME"
        }
      });
      this.gridItems = data.map(x => ({...x, selected: false, PROCESSTIME: "aa",customCell: "PROCESSTIME"}))
    },
    select(){
      // const selectRow = this.gridItems.filter(x => x.selected);
      // if(selectRow.length > 0){
      //   this.$emit('equipmentRow', selectRow);
      //   this.$emit('visible', false)
      // }
    },
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      data[idx] = { ...data[idx], [e.field]: e.value };
      if(data[idx].rowStat === "N"){
        data[idx].rowStat = "U";
      }
      if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
        data[idx].rowStat = "N";
      }

      this.gridData = data;
    },

  }

}
</script>

<style>

</style>