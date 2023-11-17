<template>
    <div>
        <ol class="page-navigation">
            <li>홈</li>
            <li>기준정보</li>
            <li>창고기준정보</li>
        </ol>
        <v-row ref="searchFilter">
            <v-col :cols="12">
                <Card>
                    <CardBody>
                        <v-row>
                            <v-col :sm="9" :lg="10" align="left">
                                <div class="form-group-wrap">
                                    <div class="form-group">
                                        <label>창고코드</label>
                                        <inputText
                                            ref="warehouseId"
                                            :boxWidth="'100%'"
                                            :dataNm="'warehouseId'"
                                            :disabled="false"
                                            :searchOption="true"
                                            :searchFunc="searchBtn"
                                            @input-text-set="searchInput"
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label>창고명</label>
                                        <inputText
                                            ref="warehouseName"
                                            :boxWidth="'100%'"
                                            :dataNm="'warehouseName'"
                                            :disabled="false"
                                            :searchOption="true"
                                            :searchFunc="searchBtn"
                                            @input-text-set="searchInput"
                                        />
                                    </div>
                                    <div class="form-group">
                                        <label>창고구분</label>
                                        <MesSelectBox
                                            :enumID="'warehouseType'"
                                            :allYN="true"
                                            :dataNm="'warehouseType'"
                                            @comboChange="comboChange"
                                        ></MesSelectBox>
                                    </div>
                                </div>
                            </v-col>
                            <v-col :sm="3" :lg="2" align="right">
                                <Button :theme-color="'primary'" :size="'medium'" :icon="'search'" @click="searchBtn">조회</Button>
                                
                            </v-col>
                        </v-row>
                    </CardBody>
                </Card>
            </v-col>
        </v-row>
        <v-row ref="contents">
            <v-col :cols="12" :style="{ height: '100%' }">
                <Card ref="gridCard" :style="{ height: '100%' }">
                    <CardBody :style="{ width: '100%' }">
                        <v-row>
                            <v-col cols="6" align="left">
                                <CardTitle>창고목록</CardTitle>
                            </v-col>
                            <v-col cols="6" align="right">
                                <Button :theme-color="'primary'" :size="'small'" :icon="'save'" @click="saveBtn">저장</Button>
                                <Button :theme-color="'secondary'" :size="'small'" :icon="'add'" @click="addBtn">추가</Button>
                                <Button :theme-color="'secondary'" :size="'small'" :icon="'delete'" @click="delBeforChk" >삭제</Button>
                                <Button :theme-color="'secondary'" :size="'small'" :icon="'undo'" @click="undoBtn" >undo</Button>
                            </v-col>
                        </v-row>
                        <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
                            <KendoGrid
                                ref="rowGrid"
                                :gridItems="gridData"
                                :sortable="true"
                                :columns="headerParam.gridHeader"
                                :edit-field="'inEdit'"
                                :selected-field="selectedField"
                                :gridDropDownList="headerParam.enumComboBox"
                                :checkHeaderArr="headerParam.checkBox"
                                :isPaging="true"
                                @selectionchange="onSelectionchange"
                                @gridrowclick="onRowClick"
                                @gridddchang="rowDdChange"
                                @griditemchange="griditemchange"
                                @gridButtonClick="gridButtonClick"
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
        <WarehouseMAPSetting
            v-if="warehouseMapVisible"
            ref="WarehouseMAPSetting"
            :visibleDialog="warehouseMapVisible"
            :warehouseItem="warehouseMapSettingItem"
            @visibleDialog="(val) => (warehouseMapVisible = val)"
            :callBack="callBackWarehouseMapSetting"
        />
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
  import WarehouseMAPSetting from "@/components/FrmWarehouseDefinition/WarehouseMAPSetting";
  // import utils from "~/plugins/utils";
  
  let myTitle;
  let myMenuId;
  
  export default {
    mixins: [mixinGlobal, gridHeaderMinin],
    async asyncData(context) {
      const myState = context.store.state;
      myMenuId = context.route.query.menuId;
      await context.store.commit("setActiveMenuInfo", myState.menuData[myMenuId]);
      myTitle = await myState.activeMenuInfo.menuNm;
    },
    meta: {
      title: () => {
        return myTitle;
      },
      menuId: myMenuId,
      closable: true,
    },
    components: {
      Utility,
      Card,
      Button,
      CardBody,
      CardTitle,
      KendoGrid,
      InputText,
      MesSelectBox,
      WarehouseMAPSetting
    },
    data() {
      return {
        gridData: [],
        gridOriData: [],
        selectedField: "selected",
        headerParam: {
          gridid: "dgvWarehouse", // 그리드 ID
          gridHeader: [],
          enumComboBox: [],
          checkBox: []
        },
        warehouseId: "",
        warehouseName: "",
        warehouseType: "",
        warehouseMapSettingItem: {},
        warehouseMapVisible: false
      };
    },
    created() {},
    async mounted() {
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
            this.getGridData();
        },
        // 저장버튼 클릭
        saveBtn() {
            const validate = this.mesValidation(this.headerParam.gridHeader, this.gridData);
            if (!validate.isValidate) {
                this.$refs.alertPop.show("알림", validate.msg);
                return;
            }

            const saveData = this.gridData
                .filter((x) => x.rowStat !== "N")
                .map((x) => {
                    return {
                    ...x,
                    plantid: "LS",
                    _rowstatus: x.rowStat,
                    _rowstatusimage: "System.Drawing.Bitmap",
                    };
                });

            if (saveData.length > 0) {
                const res = this.mesPost({
                    apiKey: "mes/common/manage",
                    messagename: "TxnWarehouse",
                    sendParam: saveData,
                }).then((result) => {
                    this.$nextTick(() => {
                        if(result.returncode !== undefined){
                            if(result.returncode === "0") {
                                this.getGridData();
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
        //그리드 데이터 가져오기
        async getGridData() {
            this.gridOriData = [];
            this.gridData = [];
            
            this.mesGet({
            apiKey: "mes/common/getqueryresult",
            queryId: "GetWarehouseList",
            sendParam: {
                plantid: "LS",
                warehouseid: this.warehouseId,
                warehousename: this.warehouseName,
                warehousetype: this.warehouseType
            },
            }).then((res) => {
                const data = res.map((x, idx) => {
                    return {
                        ...x,
                        rowStat: "N",
                        selected: false,
                        idx: idx,
                        inEdit: true,
                        newRow: false,
                        WAREHOUSEMAPBUTTON: "검색"
                    };
                });

                this.gridOriData = JSON.parse(JSON.stringify(data))
                this.gridData = data;
                this.$refs.rowGrid.skip = 0;
            });
        },
        //그리드 콤보박스 리스트가져오기
        async getGridComboList() {
            await this.mesGet({
                apiKey: "mes/common/getqueryresult",
                queryId: "GetEnumValue",
                sendParam: {
                    plantid: "LS",
                    enumid: "warehouseType"
                }
                }).then((data) => {
                    this.gridDropDownList[0].dataItem = data;
                })
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

            if (name === "STOCKCHECKFLAG") {
                e.value = e.value ? "Yes" : "No";
            }
    
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
            this.onSelectionchange(event);
        },
        //unbo 버튼 클릭
        undoBtn() {
            this.gridData = JSON.parse(JSON.stringify(this.gridOriData));
            this.$nuxt.$emit("iccReset");
        },
        //추가 버튼 클릭
        addBtn() {
            const newRowUUid = Math.round(Math.random() * 1000000000).toString();
            const dataItem = {
                WAREHOUSEID: "",
                WAREHOUSENAME: "",
                WAREHOUSETYPE: "",
                STOCKCHECKFLAG: "No",
                PLANTID: "LS",
                DESCRIPTION: "",
                inEdit: true,
                newRow: true,
                selected: true,
                PLANTID: "LS",
                rowStat: "C",
                idx: this.gridData.length,
                newRowUUid: newRowUUid,
            };

            this.gridData.splice(0, 0, dataItem);
            this.$refs.rowGrid.skip = 0;
            this.$nuxt.$emit("iccReset");
        },
        //삭제버튼
        delBeforChk () {
            if (this.gridData.filter(x => x.selected).length > 0) {
                if(this.gridData.filter(x => x.selected && !x.newRow).length > 0) {
                    const selectedTitle = this.gridData.filter(x => x.selected && !x.newRow).map((x) => {
                        return x.WAREHOUSEID;
                    }).join(', ');

                    this.$refs['confirmPop'].title = "Info";
                    this.$refs['confirmPop'].message = "선택된 데이터(" + selectedTitle + ")를 삭제하시겠습니까?";
                    this.$refs['confirmPop'].callBack = this.delBtn;
                    this.$refs['confirmPop'].modalWidth = "300px";
                    this.$refs['confirmPop'].visibleDialog = true;
                }
                else {
                    this.delBtn();
                }
            } else {
                this.$refs.alertPop.show("알림", "삭제할 데이터가 존재하지 않습니다.");
                return;
            }
        },
        delBtn() {
            const data = JSON.parse(JSON.stringify(this.gridData));
            this.gridData = data.map(x => {
                if(x.selected){
                    if(x.rowStat !== "C"){
                        return {
                            ...x,
                            rowStat: "D"
                        }
                    }
                }
                else {
                    return x;
                }
            }).filter(x => x !== undefined);
            
            this.$nuxt.$emit('iccReset')
        },
        gridButtonClick(e, field, dataItem) {
            this.warehouseMapSettingItem = dataItem;
            this.warehouseMapVisible = true;
        },
        callBackWarehouseMapSetting(mapGridData) {
            const mapList = mapGridData.map((x) => {
                return x.AREAID + '[' + x.AREANAME + ']';
            });

            this.warehouseMapSettingItem.WAREHOUSEMAP = mapList.join(',');
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
  