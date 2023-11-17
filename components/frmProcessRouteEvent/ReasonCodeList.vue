<template>
  <v-col :cols="12">
    <Card :style="{'margin-top': '10px'}">
      <CardBody :style="{width:'100%'}">
        <v-row>
          <v-col :cols="4">
            <v-row>
              <v-col :cols="3">
                <Label>
                  사유코드
                </Label>
              </v-col>
              <v-col :cols="9">
                <InputText
                  ref="reasonCode"
                  :boxWidth="'90%'"
                  :dataNm="'reasonCode'"
                  @input-text-set="searchInput"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col :cols="3">
          </v-col>

          <v-col :cols="5" align="right">
            <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="search" >조회</Button>
            <Button :theme-color="'primary'" :size="'medium'" icon="save"  @click="select">선택</Button>
          </v-col>
        </v-row>

        <v-row>
          <v-col :cols="12">
            <KendoGrid 
              ref="rowGrid"
              gridHeight="200px"
              :gridItems="gridItems"
              :sortable="true"
              :columns="dgvReasoncodeList"
              :resizable="false"
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
import customGridHeaderMixin from "@/mixin/customGridHeaderMixin";
import mixinGlobal from "@/mixin/global.js";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText"
import { Checkbox } from "@progress/kendo-vue-inputs";
import { Button } from "@progress/kendo-vue-buttons";

export default {
  name: "EquipmentList",
  mixins: [mixinGlobal, customGridHeaderMixin],
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
    dgvReasoncodeList: {
      type: Array,
      default: () => []
    },
    detailtype: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      selectedField: 'selected',
      reasonCode: "",
      equipAll: false,
      gridItems: []
    }
  },
  async mounted() {
  },
  methods: {
    searchInput(nm, val){
      this[nm] = val;
    },
    gridrowclick(event){
      const id = event.dataItem?.REASONCODE
      this.gridItems = this.gridItems.map(x => {
        if(x.REASONCODE === id){
          return {...x, selected: true}
        }
        return {...x, selected: false}
      })
    },
    async search(){
      const data = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetReasoncodeList",
        sendParam: {
          plantid: "Ls",
          reasoncode: this.reasonCode,
          reasoncodetype: "SCRAP"
        }
      });
      this.gridItems = data.map(x => ({...x, selected: false}))
    },
    select(){
      const selectRow = this.gridItems.filter(x => x.selected);
      if(selectRow.length > 0){
        this.$emit('reasonCodeRow', selectRow);
        this.$emit('visible', false)
      }
    },

  }

}
</script>

<style>

</style>