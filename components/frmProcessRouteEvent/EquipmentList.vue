<template>
  <v-col :cols="12">
    <Card :style="{'margin-top': '10px'}">
      <CardBody :style="{width:'100%'}">
        <v-row>
          <v-col :cols="4">
            <v-row>
              <v-col :cols="3">
                <Label>
                  설비코드
                </Label>
              </v-col>
              <v-col :cols="9">
                <InputText
                  ref="g_EQUIPMENTID"
                  :boxWidth="'90%'"
                  :dataNm="'g_EQUIPMENTID'"
                  @input-text-set="searchInput"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col :cols="3">
            <v-row>
              <v-col :cols="1">
                <Checkbox
                  v-model="equipAll"
                />
              </v-col>
              <v-col :cols="11">
                <Label style="padding-left:5px;">
                  전체
                </Label>
              </v-col>
            </v-row>
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
              :columns="dgvEquipmentList"
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
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

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
    dgvEquipmentList: {
      type: Array,
      default: () => []
    }, 
    detailtype: {
      type: String,
      default: ""
    },
    rowInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState({
      lotInfo: state => state.modules.frmRouteEvent.lotInfo,
    }),
  },
  data() {
    return {
      selectedField: 'selected',
      g_EQUIPMENTID: null,//설비정보 그리드 설비코드
      equipAll: false,
      gridItems: []
    }
  },
  created(){
    this.search();
  },
  async mounted() {
  },
  methods: {
    searchInput(nm, val){
      this[nm] = val;
    },
    gridrowclick(event){
      const id = event.dataItem?.EQUIPMENTID
      this.gridItems = this.gridItems.map(x => {
        if(x.EQUIPMENTID === id){
          return {...x, selected: true}
        }
        return {...x, selected: false}
      })
    },
    async search(){
      const obj1 = {
        plantid: "LS",
        equipmentid: this.g_EQUIPMENTID,
        processid: this.rowInfo.PROCESSID,
        productid: this.lotInfo.PRODUCTID
      }
      const obj2 = {
        plantid: "LS",
        equipmentid: this.g_EQUIPMENTID,
        EquipmentDetailType: "Equipment"
      }
      const send = this.equipAll ? obj2 : obj1
      const qyeryId = this.equipAll ? "GetEquipmentList" : "GetAvailableEquipmentList"
      const data = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: qyeryId,//GetAvailableEquipmentList
        sendParam: send
      });
      this.gridItems = data.map(x => ({...x, selected: false}))
    },
    select(){
      const selectRow = this.gridItems.filter(x => x.selected);
      if(selectRow.length > 0){
        this.$emit('equipmentRow', selectRow);
        this.$emit('visible', false)
      }
    },

  }

}
</script>

<style>

</style>