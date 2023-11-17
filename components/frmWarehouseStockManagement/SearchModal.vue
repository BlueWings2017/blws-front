<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="재고이력"
      width="50%"
      height="600"
      @close="toggleDialog"
    >
    <v-row no-gutters>
      <v-col :sm="9" :lg="9">
        <div class="form-group-wrap">
          <div class="form-group">
              <label>창고</label>
              <MesVariableSelectBox
                :ref="'comboArea'"
                :allYN="false"
                :dataNm="'areaid'"
                :queryId="'GetWarehouseList'"
                :inputcol="inputcol"
                :sendParam="{
                  plantid: 'LS',
                  warehouse: warehouseid,
                }"
                @comboChange="comboChange"
              ></MesVariableSelectBox>
           </div>
        </div>
      </v-col>
      <v-col :sm="3" :lg="3" align="right" v-if="screenType === 'frmMaterialReceive'">
        <Button :theme-color="'primary'" :size="'medium'" @click="receiveDetailCancelBtn()">입고취소</Button>
      </v-col>
    </v-row>
          <div ref="divWrapper" style="height:calc(100% - 44px);">
            <KendoGrid 
              ref="rowGrid"
              :gridHeight="gridHeight"
              :gridItems="gridData"
              :sortable="true"
              :columns="gridHeader"
              :resizable="false"
              :edit-field="'inEdit'"
              :isPaging="true"
              :selected-field="selectedField"
              :disabledCheckHeaderArr="disabledCheckHeaderArr"
              @selectionchange="onSelectionchange"
              @gridrowclick="onRowClick"
            />
          </div>

    </Dialog>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
      :callBack="() => searchModalVisible = true"
    />
    <ConfirmPop :is="'confirmPop'" ref="confirmPop" :visibleDialog="false" :callBack="() => { }" />
  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";

export default { 
  name: "SearchModal",
  mixins: [mixinGlobal, gridHeaderMinin],
  components: {
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    MesVariableSelectBox,
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    callBack: {
      type: Function,
      default: () => true
    },
    screenType: {
      type: String,
      default: "frmMaterialReceive",
    },
    data: {
    	type: Object,
        default: () => {
            return {}
        }
    }
  },
  data() {
    return {
      gridHeader: [],
      gridData : [],
      gridOriData : [],
      gridHeight : '400px',
      selectedField: 'selected',
      headerParam: {
        gridid: "dgvMaterialStockHistory", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
        noFirstCheck: true,
        noRowstat: true,
      },
      disabledCheckHeaderArr: [ "ACTIVESTATE", "CONFIRMFLAG", "COMMONFLAG" ],
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      materiallotid: "",
      warehouseid: "",
      inputcol: ["WAREHOUSEID", "WAREHOUSENAME"],
      selectedRow : null,
    }
  },
  computed: {
    items () {
      return this.gridData.map((item) => ({ ...item, selected: item.MATERIALID === this.selectedID }));
    },

  },
  async mounted() {
    this.warehouseid = this.data.WAREHOUSEID; // 창고콤보 첫번째 고정
    this.materiallotid = this.data.MATERIALLOTID;
    await this.getGridData();
  },
  methods: {
    //그리드 데이터 가져오기
    async getGridData() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetMaterialStockHistory",
        sendParam: {
          plantid: "LS",
          warehouseid: this.warehouseid,
          materiallotid: this.materiallotid,
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
        this.gridOriData = data;
        this.gridData = data;
      })
    },
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //그리드 로우 클릭
    onRowClick (event) {
      this.selectedID = event.dataItem.MATERIALID;
      this.gridData.forEach(x => x.selected = false);
      event.dataItem[this.selectedField] = true;
    },
    //맨앞 checkBox 클릭
    onSelectionchange (event) {
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    searchInput(nm, val){
      this[nm] = val;
    },

    receiveDetailCancelBtn(data){
        console.log("=========== 입고취소 버튼클릭 ============");
        this.$refs['confirmPop'].title = "Warning";
        this.$refs['confirmPop'].message = "해당 데이터를 삭제하시겠습니까?";
        this.$refs['confirmPop'].callBack = this.deleteData;
        this.$refs['confirmPop'].modalWidth = "300px";
        this.$refs['confirmPop'].visibleDialog = true;
    },

    deleteData(){
      const deleteData = this.gridData.filter(x=>x.selected)
      .map(x => {
        return {
            ...x,
            WAREHOUSENAME: x.WAREHOUSENAME,        
            EVENTTIME: x.EVENTTIME,    
            EVENTNAME: x.EVENTNAME,
            EVENTUSERID: x.EVENTUSERID,
            OUTQTY: x.OUTQTY,
            YYYYMM: x.YYYYMM,
            STOCKQTY: x.STOCKQTY,
            RECEIPTDATE: x.RECEIPTDATE,
            QTY: x.QTY,
            REFERENCETIMEKEY: x.REFERENCETIMEKEY,
            WAREHOUSEID:x.WAREHOUSEID,
            CONSUMABLETIMEKEY: x.CONSUMABLETIMEKEY,
            TIMEKEY: x.TIMEKEY,
            HOLDQTY: x.HOLDQTY,
            EVENTCOMMENT: x.EVENTCOMMENT,
            SCRAPQTY: x.SCRAPQTY,
            MATERIALLOTID: x.MATERIALLOTID,
            MATERIALTYPE: x.MATERIALTYPE,
            REASONCODE: x.REASONCODE,
            INQTY: x.INQTY,
            VENDOR: x.VENDOR,
            COMPANYNAME: x.COMPANYNAME,
            MATERIALID: x.MATERIALID,
            CONSUMEQTY: x.CONSUMEQTY,
            OPENINGQTY: x.OPENINGQTY,
            plantid: "LS",
            BONUSQTY: x.BONUSQTY,
            _ROWSTATUS: x._ROWSTATUS,
          }
      });
      if(deleteData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnMaterialReceiveCancel",
          sendParam: deleteData
          
        }).then(() => {
        this.$nextTick(() => {
          this.$refs.alertPop.show("Info", "저장되었습니다.");
          this.getGridData();
          })
        })
      }
    },

    comboChange(nm, val) {
      this.warehouseid = val;
      this.getGridData();
    },      
  },
};
</script>