<template>
  <div :style="{ height: '100%' }">
    <div>
      <v-row ref="contents" >
        <v-col :cols="12">
          <Card ref="gridCard" :style="{width:'100%'}">
            <CardBody :style="{width:'100%'}">
              <v-row :style="{'margin-bottom': '10px'}">
                <v-col cols="8" align="left">
                  <CardTitle>기준Durable</CardTitle>
                </v-col>
                <v-col cols="4" align="right">
                  <Button :theme-color="'primary'" :size="'medium'" @click="createBtn">생성</Button>
                </v-col>
              </v-row>
              <div ref="divWrapper">
                <KendoGrid 
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="true"
                  :edit-field="'inEdit'"
                  :selected-field="selectedField"
                  :checkHeaderArr="checkHeaderArr"
                  @gridrowclick="onRowClick"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>
    </div>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import InputText from "@/components/common/input/InputText";
import Checkbox from "@/components/common/input/Checkbox";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import { DropDownList } from "@progress/kendo-vue-dropdowns";
import { mapState, mapMutations, mapActions } from "vuex";
import TextAreaModal from "@/components/frmProcessRouteComposition/TextAreaModal";
import RoutingSetModal from "@/components/frmProcessRouteComposition/RoutingSetModal";

export default {
  name: "StandardDurable",
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
    TextAreaModal,
    RoutingSetModal
  },
  props:{
    gridHeight: {
      type: String,
      defaultData: "500px"
    },
    standarddurableid: {
      type: String,
    },
    gridOriData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      gridHeader: [],
      gridData:[],
      selectedField: 'selected',
      checkHeaderArr: ["AUTOTRACKIN","AUTOTRACKOUT"],
      headerParam: {
        gridid: "dgvDurableDefinition_View", // 그리드 ID
        noRowstat: "", //rowStat 표시 여부
      },
      noFirstCheck: true,
      noRowstat: true,
      currentGridData: [],
      inputVal: "",
      btnClickRow: {},
      textAreaModalVisible: false,
      defaultDescription: "",
      RoutingSetModalVisible: false,
      confirmCheck: false
    };
  },
  created() {
  },
  async mounted() {
  },
  computed: {
    ...mapState({
      gridData: state => state.modules.frmPRC.dgvOperation,
    }),
  },
  methods: {
    ...mapActions({
    setdgvOperationAction: "modules/frmPRC/setdgvOperationAction",
    setDgvRecipeAction: "modules/frmPRC/setDgvRecipeAction",
    setTreeDataAction: "modules/frmPRC/setTreeDataAction", 
    setRoutingSetSaveAction: "modules/frmPRC/setRoutingSetSaveAction", 
    }),
     //그리드 데이터 가져오기
    async getGridData(data) {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetOMDurableDefinitionList",
        sendParam: {
          plantid: "LS",
          standarddurableid: data.STANDARDDURABLEID
        }
      }).then((res) => {
         const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false
          }
        });
        this.$nuxt.$emit('iccReset')
        this.gridData = data;

        this.isLoading = false
      })
    },
    
    //그리드 로우 클릭
    onRowClick (event) {
    },

    createBtn(data){
      const saveData = this.gridData
      .map(x => {
        return { 
       DESCRIPTION: x.DESCRIPTION,
       CREATEUSERID: x.CREATEUSERID,
       _ROWSTATUS: x._ROWSTATUS,
       EXPIRYTIME: x.EXPIRYTIME,
       USAGELIMIT: x.USAGELIMIT,
       PLANTID: x.PLANTID,
       ACTIVESTAT: x.ACTIVESTAT,
       STANDARDDURABLEID: x.STANDARDDURABLEID,
       CAPACITY: x.CAPACITY,
       STANDARDDURABLENAME: x.STANDARDDURABLENAME,
       DURABLETYPE: x.DURABLETYPE,
        }
      });
      if(saveData.length > 0){
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnCreateDurable",
          sendParam: saveData
        }).then(() => {
          this.$nextTick(() => {
            durableInfo(initData)
          })
        })
      }
    },
    initGrid(){
      this.$nuxt.$emit('iccReset');
    },

  },
  watch: {
  },
};

const defaultData = {
};
</script>
<style lang="scss">

</style> 
