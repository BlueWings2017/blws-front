<template>
    <div>
        <Dialog
            v-if="visibleDialog"
            title="공장선택"
            width="70%"
            height="700"
            @close="toggleDialog"
        >
            <v-row no-gutters>
                <v-col :sm="9" :lg="10" align="left">
                    <div class="form-group-wrap">
                        <div class="form-group">
                            <label>창고코드</label>
                            <inputText
                                ref="warehouseId"
                                :boxWidth="'100%'"
                                :dataNm="'warehouseId'"
                                :readonly="true"
                                :defaultValue="warehouseId"
                            />
                        </div>
                        <div class="form-group">
                            <label>창고명</label>
                            <inputText
                                ref="warehouseName"
                                :boxWidth="'100%'"
                                :dataNm="'warehouseName'"
                                :readonly="true"
                                :defaultValue="warehouseName"
                            />
                        </div>
                    </div>
                </v-col>
                <v-col :sm="3" :lg="2" align="right">
                    <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">조회</Button>
                </v-col>
            </v-row>
            <v-row :style="{ height: 'calc(100% - 44px)' }">
                <v-col :cols="3" :style="{ height: '100%' }">
                    <Card ref="treeCard" :style="{ height: '100%' }">
                        <CardBody :style="{ height: '100%' }">
                            <div ref="treeWrapper" :style="{ height: '100%' }">
                                <KendoTree
                                    :treeData="treeData"
                                    :textField="'AREANAME'"
                                    :activeItem="treeActiveItem"
                                    @onExpandChange="onExpandChange"
                                    @onItemClick="onItemClick"
                                >
                                </KendoTree>
                            </div>
                        </CardBody>
                    </Card>
                </v-col>
                <v-col :cols="9" :style="{ height: '100%' }">
                    <Card ref="gridCard" :style="{ height: '100%' }">
                        <CardBody :style="{ height: '100%', width: '100%' }">
                            <v-row>
                                <v-col cols="4" align="left" :style="{ width: '100%' }">
                                    <div class="form-group-wrap">
                                        <inputText
                                            ref="selectedDisplay"
                                            :boxWidth="'100%'"
                                            :dataNm="'selectedDisplay'"
                                            :readonly="true"
                                            :defaultValue="selectedDisplay"
                                        />
                                    </div>
                                </v-col>
                                <v-col cols="8" align="right">
                                    <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">저장</Button>
                                    <Button :disabled="addBtnDisabled" :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">추가</Button>
                                    <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delBeforChk" >삭제</Button>
                                    <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn" >undo</Button>
                                </v-col>
                            </v-row>
                            <div ref="divWrapper" :style="{ height: 'calc(100% - 34px)' }">
                                <KendoGrid
                                    ref="rowGrid"
                                    :gridItems="gridData"
                                    :sortable="true"
                                    :columns="headerParam.gridHeader"
                                    :edit-field="'inEdit'"
                                    :selected-field="selectedField"
                                    :gridDropDownList="gridDropDownList"
                                    :checkHeaderArr="checkHeaderArr"
                                    :pkNotEditArr="pkNotEditArr"
                                    @selectionchange="onSelectionchange"
                                    @gridrowclick="onRowClick"
                                    @gridddchang="rowDdChange"
                                    @griditemchange="griditemchange"
                                    @sortChangeHandler="sortChangeHandler"
                                    @headerselectionchange="onHeaderSelectionChange"
                                />
                            </div>
                        </CardBody>
                    </Card>
                </v-col>
            </v-row>
            <AlertPop ref="alertPop" :is="'alertPop'" />
            <ConfirmPop
                :is="'confirmPop'"
                ref="confirmPop"
                :visibleDialog="false"
                :callBack="() => {}"
            />
        </Dialog>
    </div>
</template>
<script>
  import mixinGlobal from "@/mixin/global.js";
  import InputText from "@/components/common/input/InputText";
  import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
  import Utility from "~/plugins/utility";
  import KendoGrid from "@/components/common/KendoGrid";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  import MesSelectBox from "@/components/common/select/MesSelectBox";
  import { Button } from "@progress/kendo-vue-buttons";
  import { Dialog, DialogActionsBar } from '@progress/kendo-vue-dialogs';
  import KendoTree from "@/components/common/KendoTree";
  import utils from "~/plugins/utils";
  
  let myTitle;
  let myMenuId;
  
  export default {
    name: 'WarehouseMAPSetting',
    mixins: [mixinGlobal, gridHeaderMinin],
    props: {
        visibleDialog: {
            type: Boolean,
            default: false,
        },
        callBack: {
            type: Function,
            default: () => true
        },
        warehouseItem: {

        }
    },
    components: {
      Utility,
      Card,
      Button,
      CardBody,
      CardTitle,
      KendoGrid,
      KendoTree,
      InputText,
      MesSelectBox,
      Dialog,
      utils
    },
    data() {
      return {
        gridData: [],
        gridOriData: [],
        gridDropDownList: [],
        treeData: [],
        treeActiveItem: {},
        selectedField: "selected",
        checkHeaderArr: [],
        headerParam: {
          gridid: "dgvWarehouseMAPSetting", // 그리드 ID
          gridHeader: []
        },
        pkNotEditArr: ["WAREHOUSEID", "AREAID", "AREANAME"],
        warehouseId: "",
        warehouseName: "",
        selectedDisplay: "",
        addBtnDisabled: false,
      };
    },
    created() {},
    async mounted() {
        this.warehouseId = this.warehouseItem.WAREHOUSEID;
        this.warehouseName = this.warehouseItem.WAREHOUSENAME;

        await this.initTree();
        await this.getGridData();
    },
    computed: {
      areAllSelected() {
        return (
          this.gridData.findIndex((x) => x.checked === false) === -1 &&
          this.gridData.length !== 0
        );
      },
    },
    watch: {},
    methods: {
        // 조회버튼 클릭
        searchBtn() {
            this.initTree();
            this.getGridData();
        },
        // 저장버튼 클릭
        saveBtn() {
            const saveData = this.gridData
            .filter((x) => x.rowStat !== "N")
            .map((x) => {
                return {
                ...x,
                _rowstatus: x.rowStat,
                _rowstatusimage: "System.Drawing.Bitmap",
                };
            });

            if (saveData.length > 0) {
                const res = this.mesPost({
                    apiKey: "mes/common/manage",
                    messagename: "TxnWarehouseMAP",
                    sendParam: saveData,
                }).then((result) => {
                    this.$nextTick(() => {
                        if(result.returncode !== undefined){
                            if(result.returncode === "0") {
                                this.getGridData(true);
                                this.$refs.alertPop.show("알림", "저장되었습니다");
                            }
                            else {
                                this.$refs.alertPop.show("ERROR : " + result.returncode, result.returnmessage);
                            }
                        }
                        else{
                            this.$refs.alertPop.show("ERROR : " + result.code, result.message);
                        }
                    })
                })
            }
        },
        //트리 데이터 가져오기
        async initTree() {
            const res = await this.mesGet({
                apiKey: "mes/common/getqueryresult",
                queryId: "GetWarehouseAreaList",
                sendParam: {
                    SUPERAREAID: "",
                    plantid: "LS",
                },
            });
            const data = res.map((x) => ({ ...x, expanded: true }));
            this.treeData = utils.makeTreeData(data);

            console.log(this.treeData);
            this.onItemClick({item:this.treeData[0]});
        },
        //그리드 데이터 가져오기
        async getGridData(reload = false) {
            this.gridOriData = [];
            this.gridData = [];
            this.mesGet({
            apiKey: "mes/common/getqueryresult",
            queryId: "GetWarehouseMAPList",
            sendParam: {
                plantid: "LS",
                warehouseid: this.warehouseId
            },
            }).then((res) => {
                const data = res.map((x, idx) => {
                    return {
                        ...x,
                        rowStat: "N",
                        selected: false,
                        idx: idx,
                        inEdit: true,
                        newRow: false
                    };
                });

                this.gridOriData = JSON.parse(JSON.stringify(data))
                this.gridData = data;

                if(reload) {
                    this.callBack(data);
                }
            });
        },
        //트리 확장
        onExpandChange(event) {
            event.item.expanded = !event.item.expanded;
        },
        //트리 클릭
        onItemClick(event) {
            this.treeActiveItem = event.item;
            if(this.treeActiveItem.depth === 0) {
                this.addBtnDisabled = true;
            }
            else {
                this.addBtnDisabled = false;
            }

            this.selectedDisplay = "[" + this.treeActiveItem.AREAID + "] " + this.treeActiveItem.AREANAME;
            this.$nuxt.$emit("iccReset");
        },
        //맨앞 checkBox 클릭
        onSelectionchange(event) {
            // console.log("===========onSelectionchange==============");
            event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
        },
        //header checkbox 클릭
        onHeaderSelectionChange(event) {
            this.gridData.forEach(x => x.selected = event.event.target.checked);
        },
        //그리드 인풋 제외 데이터 변경시
        rowDdChange(e, name, dataItem) {
            // console.log("===rowDdChange===", e);
            const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
            const data = JSON.parse(JSON.stringify(this.gridData));
    
            data[idx] = { ...data[idx], [name]: e.value };
            if (data[idx].rowStat === "N") {
                data[idx].rowStat = "U";
            }
            if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.gridOriData, idx)) {
                data[idx].rowStat = "N";
            }
    
            this.gridData = data;
        },
        //그리드 인풋 데이터 변경시
        griditemchange(e) {
            const data = JSON.parse(JSON.stringify(this.gridData));
            const idx = data.findIndex((x) => x.idx === e.dataItem.idx);

            data[idx] = { ...data[idx], [e.field]: e.value };
            if (data[idx].rowStat === "N") {
                data[idx].rowStat = "U";
            }
            if (data[idx].rowStat === "U" && !this.gfn_ChkOriginalData(this.headerParam.gridHeader, data, this.gridOriData, idx)) {
                data[idx].rowStat = "N";
            }
    
            this.gridData = data;
        },    
        onRowClick(event) {
            this.gridData.forEach(
                (item) => (item.selected = item.idx === event.dataItem.idx)
                );
        },
        //unbo 버튼 클릭
        undoBtn() {
            this.gridData = JSON.parse(JSON.stringify(this.gridOriData));
            this.$nuxt.$emit("iccReset");
        },
        //추가 버튼 클릭
        addBtn() {
            if(this.treeActiveItem.depth !== 0) {
                if(!this.isNullOrEmpty(this.treeActiveItem.WAREHOUSENAME)) {
                    this.$refs.alertPop.show("알림", "해당 Area (" + this.treeActiveItem.AREANAME + ") 는 아래 WareHouse로 설정되어 있습니다.<br/>확인해 주시기 바랍니다.<br/><br/>Warehouse : " + this.treeActiveItem.WAREHOUSENAME);
                    return;
                }
                else {
                    const newRowUUid = Math.round(Math.random() * 1000000000).toString();
                    const dataItem = {
                        inEdit: true,
                        newRow: true,
                        selected: true,
                        PLANTID: "LS",
                        rowStat: "C",
                        WAREHOUSEID: this.warehouseId,
                        AREAID: this.treeActiveItem.AREAID,
                        AREANAME: this.treeActiveItem.AREANAME,
                        idx: this.gridData.length,
                        newRowUUid: newRowUUid,
                    };

                    this.gridData.splice(0, 0, dataItem);
                    this.$nuxt.$emit("iccReset");
                }
            }
        },
        //삭제버튼
        delBeforChk () {
            if (this.gridData.filter(x => x.selected).length > 0) {
                const selectedTitle = this.gridData.filter(x => x.selected).map((x) => {
                    return x.AREAID;
                }).join(', ');

                this.$refs['confirmPop'].title = "Info";
                this.$refs['confirmPop'].message = "선택된 데이터(" + selectedTitle + ")를 삭제하시겠습니까?";
                this.$refs['confirmPop'].callBack = this.delBtn;
                this.$refs['confirmPop'].modalWidth = "300px";
                this.$refs['confirmPop'].visibleDialog = true;
            } else {
                this.$refs.alertPop.show("알림", "삭제할 데이터가 존재하지 않습니다.");
                return;
            }
        },
        delBtn() {
            const data = JSON.parse(JSON.stringify(this.gridData));
            this.gridData = data.map((x) => {
            if (x.selected) {
                return {
                ...x,
                rowStat: "D",
                };
            }
                return x;
            });
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
        toggleDialog() {
            this.$emit('visibleDialog', !this.visibleDialog);
        },
        sortChangeHandler(e){
            const isAscending = e.sort[0]?.dir == "asc";
            if(isAscending){
                this.gridData = this.gridData.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
            }else{
                this.gridData = this.gridData.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
            }
        }
    },
};
  
  const defaultData = {};
  </script>
  <style lang="scss" scoped>
  @media (max-width: 1267px) {
    .divList1 {
      height: 339px !important;
    }
  }
  </style>
  