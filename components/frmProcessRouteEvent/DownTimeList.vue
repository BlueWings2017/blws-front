<template>
  <v-col :cols="12">
    <Card :style="{'margin-top': '10px'}">
      <CardBody :style="{width:'100%'}">
        <CardTitle>비가동시간</CardTitle>
        <v-row>
          <v-col :cols="6">
            <div ref="divWrapper">
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
                @griditemchange="griditemchange"
              />
            </div>
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
    rowInfo: {
      type: Object,
      default: () => {}
    }
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
        {field: "DESCRIPTION", editable: false, title: "코드", width: 200, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: "Yes", NOTNULLFLAG: null },
        {field: "DOWNTIME", editable: true, title: "분", width: 200, cell: "", className: "gridTextCenter", VISIBLEFLAG: "Yes", PRIMARYKEYFLAG: null, NOTNULLFLAG: null },
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
      this.gridItems = data.map((x, idx) => {
        return {
          ...x,
          rowStat: "N",
          selected: false,
          idx: idx,
          inEdit: true,
          newRow: false,
          DOWNTIME: "",
          LOTID: this.rowInfo.LOTID,
          TIMEKEY: this.rowInfo.TIMEKEY,
          PROCESSID: this.rowInfo.PROCESSID,
          PROCESSSEQUENCE: this.rowInfo.PROCESSSEQUENCE,
          EQUIPMENTID: this.rowInfo.EQUIPMENTID,
          _ROWSTATUS: "C",
        }
      })
    },
    select(){
      // const selectRow = this.gridItems.filter(x => x.selected);
      // if(selectRow.length > 0){
      //   this.$emit('equipmentRow', selectRow);
      //   this.$emit('visible', false)
      // }
    },
    griditemchange(e) {
      console.log(e)
      const data = JSON.parse(JSON.stringify(this.gridItems));
      const idx = data.findIndex(x => x.idx === e.dataItem.idx);
      // console.log("idx ==<>" , idx)
      data[idx] = { ...data[idx], [e.field]: e.value };
      this.gridItems = data;
      // console.log(data)
    },
    async saveDownTime(){
      const saveData = this.gridItems.filter(x => {
        // console.log("x.DOWNTIME ==> ",x.DOWNTIME)
        // console.log("x.DOWNTIME ==> ",!!x.DOWNTIME)
        if(!!x.DOWNTIME){
          return {
            ...x,
            REASONCODE: x.REASONCODE,
            DOWNTIME: x.DOWNTIME,
          }
        }
      });
      console.log("saveData ==> ", JSON.stringify(saveData))
      await this.mesPost({
        apiKey: "mes/common/manage",
        messagename: "TxnEquipmentDownTime",
        sendParam: saveData,
      });
    }

  }

}
</script>

<style>

</style>