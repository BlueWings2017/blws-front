<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>생산관리</li>
      <li>Lot추적</li>
    </ol>
    <v-row ref="searchFilter" no-gutters>
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <div class="form-group">
                    <label>Lot ID</label>
                    <InputText
                      ref="lotid"
                      :searchOption="true"
                      :searchFunc="searchBtn"
                      :dataNm="'lotid'"
                      :readonly="true"
                      @input-text-set="searchInputValSet"
                    />
                    <Button
                      ref="searchLot"
                      :theme-color="'primary'"
                      :size="'medium'"
                      @click="searchModalVisible = !searchModalVisible"
                      >선택</Button
                    >
                  </div>
                  <div class="form-group" style="margin-left: 30px">
                    <div class="form-chk">
                      <Checkbox
                        ref="chkDesc"
                        :value="true"
                        :dataNm="'chkDesc'"
                        :required="true"
                        :searchOption="true"
                        @checkbox-set="formCheckValSet"
                      ></Checkbox>
                      <label>역순 조회</label>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <!-- <Button
                  :theme-color="'secondary'"
                  :size="'medium'"
                  :class="'btn-modal'"
                  @click="popDetailView()"
                ></Button> -->
                <Button
                  :theme-color="'primary'"
                  :size="'medium'"
                  icon="search"
                  @click="() => searchBtn(null)"
                  >{{ $t('CommLang.btn.selectBtn') }}</Button
                >
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>

    <v-row ref="contents">
      <v-col :cols="2" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%' }">
            <div ref="divWrapper" :style="{ height: '100%' }">
              <KendoTree
                v-if="curTree"
                :treeData="treeData"
                :isPaging="true"
                :textField="textField"
                :activeItem="treeActiveItem"
                @onExpandChange="onExpandChange"
                @onItemClick="onItemClick"
              >
              </KendoTree>
            </div>
          </CardBody>
        </Card>
      </v-col>

      <v-col :cols="10" :class="'divListWapper'" :style="{ height: '100%' }">
        <Card ref="gridCard" :style="{ height: '100%' }">
          <CardBody :style="{ height: '100%' }">
            <!-- <TabStrip
              :selected="selectedTab"
              @select="onSelect"
              :tabs="tabs"
              :style="{ height: '100%' }"
            > -->
            
            <v-row>
              <v-col :sm="9" :lg="9" align="left">
                <CardTitle>Lot 이력</CardTitle>
              </v-col>
            </v-row>
             <!--  <template v-slot:LotProcessHistory> -->
                <div ref="LotProcessHistory" :style="{ height: '100%' }">
                  <KendoGrid
                    :isPaging="true"
                    @notPageReset="notPageReset"
                    :reSetPage="reSetPage"
                    ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData.LotProcessHistory"
                    :sortable="true"
                    :sort="LotProcessHistorySort"
                    :columns="lotProcessHistoryHeaderParam.gridHeader"
                    :disabledCheckHeaderArr="
                      lotProcessHistoryHeaderParam.disabledCheckHeaderArr
                    "
                    :resizable="true"
                    :selected-field="selectedField"
                    :edit-field="'inEdit'"
                    @gridrowclick="onRowClick"
                    @rowdblclick="lotProcessHistoryDbClick"
                  />
                </div>
              <!-- </template> -->
              <!-- <template v-slot:ReworkInformationList>
                <div ref="ReworkInformationList" :style="{ height: '100%' }">
                  <KendoGrid
                    :isPaging="true"
                    @notPageReset="notPageReset"
                    :reSetPage="reSetPage"
                    ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData.ReworkInformationList"
                    :sortable="true"
                    :sort="ReworkInformationListSort"
                    :columns="reworkInforHeaderParam.gridHeader"
                    :disabledCheckHeaderArr="
                      reworkInforHeaderParam.disabledCheckHeaderArr
                    "
                    :resizable="true"
                    :selected-field="selectedField"
                    :edit-field="'inEdit'"
                  />
                </div>
              </template> -->
            <!-- </TabStrip> -->
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'" :callBack="alertCallBack" />

    <SelectLotID
      ref="SelectModelingConfirm"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :selectedLot="selectedLot"
      :callBack="() => {}"
      @visibleDialog="val => (searchModalVisible = val)"
      @searchBtn="searchBtn"
    />

    <SelectConsumableHistory
      ref="SelectConsumableHistory"
      v-if="consumableHistoryModalVisible"
      :visibleDialog="consumableHistoryModalVisible"
      @visibleDialog="(val) => (consumableHistoryModalVisible = val)"
      :gridItems="gridData.ConsumableHistoryList"
      :columns="consumableHistoryModalParam.gridHeader"
    />
    <DetailView
      ref="detailView"
      :is="'detailView'"
      :header="lotListHeaderParam.gridHeader"
      :item="gridData.LotInfo[0]"
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import KendoGrid from "@/components/common/KendoGrid";
import KendoTree from "@/components/common/KendoTree";
import { TreeView, processTreeViewItems } from "@progress/kendo-vue-treeview";
import DateUtility from "~/plugins/dateUtility";
import { Button } from "@progress/kendo-vue-buttons";
import { Input } from "@progress/kendo-vue-inputs";
import InputText from "../../components/common/input/InputText.vue";
import SelectLotID from '../../components/popup/SelectLotID.vue';
import Checkbox from "@/components/common/input/Checkbox";
import SelectModelingConfirm from "@/components/frmLotTrackingTabs/SelectModelingConfirm";
import SelectConsumableHistory from "../../components/frmLotTrackingTabs/SelectConsumableHistory.vue";
import ConfirmPop from "../../components/common/modal/ConfirmPop.vue";
import utils2 from "~/plugins/utils2";
import DetailView from "@/components/common/DetailView";

let myTitle;
let myMenuId;

export default {
  name: "LotTrackingTree",
  mixins: [mixinGlobal, multiGridHeaderMinin],
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
    SelectLotID,
    SelectConsumableHistory,
    Input,
    Button,
    CardBody,
    CardTitle,
    Card,
    InputText,
    KendoGrid,
    Checkbox,
    DateUtility,
    SelectModelingConfirm,
    ConfirmPop,
    KendoTree,
    TreeView,
    DetailView,
  },

  data() {
    return {
      treeData: [],
      textField: "LOTID",
      chkDesc: "asc",
      selected: 0,
      searchModalVisible: false,
      consumableHistoryModalVisible: false,
      lotid: null,
      curTree: null,
      productid: "",
      plantid: "LS",
      processroutetype: "",
      gridHeight: "100px",
      gridData: {
        LotProcessHistory: [],
        ReworkInformationList: [],
        LotInfo: [],
        ConsumableHistory: [],
      },
      LotProcessHistorySort: [{ field: '"TIMEKEY"', dir: "asc" }],
      ReworkInformationListSort: [{ field: "REWORKCOUNT", dir: "asc" }],
      gridOriData: {
        LotProcessHistory: [],
        ReworkInformationList: [],
        LotInfo: [],
        ConsumableHistory: [],
      },
      selectedField: "selected",
      selected: { LotProcessHistory: null },
      lotListHeaderParam: {
        gridid: "dgvLotInfo",
        gridHeader: [],
        disabledCheckHeaderArr: ["GOINORDERREQUIRED"],
        noFirstCheck: true,
        noRowstat: true,
      },
      lotProcessHistoryHeaderParam: {
        gridid: "dgvLotProcessHistory",
        gridHeader: [],
        disabledCheckHeaderArr: ["GOINORDERREQUIRED"],
        noFirstCheck: true,
        noRowstat: true,
      },
      reworkInforHeaderParam: {
        gridid: "dgvReworkInfo_LotProcessHistory",
        gridHeader: [],
        disabledCheckHeaderArr: ["GOINORDERREQUIRED"],
        noFirstCheck: true,
        noRowstat: true,
      },
      consumableHistoryModalParam: {
        gridid: "dgvConsumableHistory",
        gridHeader: [],
        noFirstCheck: true,
        noRowstat: true,
      },
      expand: {
        ids: [],
        idField: "DISPLAYMEMBER",
      },
      selectedLot: null,
      treeActiveItem: {},
      alertCallBack: () => {},
      selectedTab: 0,
      lotProcessHistoryRow: null,
      reSetPage: false,
    };
  },

  async mounted() {
    await this.getHeaderMulti(
      this.lotListHeaderParam,
      this.$refs.LotProcessHistory
    );
    await this.getHeaderMulti(
      this.lotProcessHistoryHeaderParam,
      this.$refs.LotProcessHistory
    );
    await this.getHeaderMulti(
      this.reworkInforHeaderParam,
      this.$refs.LotProcessHistory
    );
    await this.getHeaderMulti(
      this.consumableHistoryModalParam,
      this.$refs.LotProcessHistory
    );
  },

  computed: {
    lotInfoGet() {
      return {
        id: "LotInfo",
        queryId: "GetLotInfo",
        params: {
          lotid: this.lotid,
          plantid: this.plantid,
        },
      };
    },

    lotProcessHistoryGet() {
      return {
        id: "LotProcessHistory",
        queryId: "GetLotProcessHistory",
        params: {
          lotid: this.lotid,
          plantid: this.plantid,
        },
      };
    },

    lotTrackingTreeGet() {
      return {
        id: "lotTrackingTreeGet",
        queryId: "GetLotTrackingTree",
        params: {
          lotid: this.lotid,
        },
      };
    },

    lotTrackingDescTreeGet() {
      return {
        id: "lotTrackingDescTreeGet",
        queryId: "GetLotTrackingDescTree",
        params: {
          lotid: this.lotid,
        },
      };
    },

    reworkInformationListGet() {
      return {
        id: "ReworkInformationList",
        queryId: "GetReworkInformationList",
        params: {
          lotid: this.lotid,
          plantid: this.plantid,
        },
      };
    },

    consumableHistoryListGet() {
      return {
        id: "ConsumableHistoryList",
        queryId: "GetConsumableHistoryList",
        params: {
          lotid: this.lotProcessHistoryRow.LOTID,
          timekey: this.lotProcessHistoryRow.TIMEKEY,
        },
      };
    },
  },

  watch: {
    LotProcessHistorySort() {},
    ReworkInformationListSort() {},
  },

  methods: {
    notPageReset(flag) {
      // flag : false
      this.reSetPage = flag;
    },

    onSelect(e) {
      this.selectedTab = e.selected;
    },

    //트리 확장
    onExpandChange(event) {
      event.item.expanded = !event.item.expanded;
    },

    //트리 클릭
    onItemClick(event) {
      this.$refs.lotid.textVal = event.item.LOTID;
      this.lotid = event.item.LOTID;
      this.getGridData(this.lotInfoGet);
      if (this.chkDesc == "desc") {
        const sortFunc =
          this.chkDesc == "asc" ? (a, b) => a - b : (a, b) => b - a;
        this.gridData.LotProcessHistory = [
          ...this.gridData.LotProcessHistory,
        ].sort((a, b) => sortFunc(b.TIMEKEY, a.TIMEKEY));
        this.gridData.ReworkInformationList = [
          ...this.gridData.ReworkInformationList,
        ].sort((a, b) => sortFunc(b.REWORKCOUNT, a.REWORKCOUNT));
      } else {
        this.getGridData(this.lotProcessHistoryGet);
        this.getGridData(this.reworkInformationListGet);
      }

      // 페이징 초기화
      this.reSetPage = true;
    },

    onRowClick(event) {
      const selectedIdx = event.dataItem.idx;
      if (this.selectedTab === 1) {
        this.gridData.ReworkInformationList.forEach((item) => {
          item.selected = item.idx === selectedIdx;
        });
        this.selected.ReworkInformationList = event.dataItem;
      }
      if (this.selectedTab === 0) {
        this.gridData.LotProcessHistory.forEach(
          (i) => (i.selected = i.idx === selectedIdx)
        );
        this.selected.LotProcessHistory = event.dataItem;
      }
    },

    popDetailView() {
      if (!this.lotid) {
        this.$refs.alertPop.show("", "Lot을 선택 후 조회하세요");
        this.alertCallBack = () => {};
        return;
      }
      this.$refs.detailView.show("Lot 상세보기");
    },

    async searchBtn(data) {
      if (data) {
        this.reSetPage = true;
        this.selectedLot = data;
        this.$refs.lotid.textVal = data.LOTID;
        this.lotid = data.LOTID;
        await this.getGridData(this.lotInfoGet) //
          .then(res => {
            if (!res) {
              this.alertCallBack = () => {};
              this.$refs.alertPop.show(
                '',
                '존재하지 않는 Lot입니다. LotID를 확인해 주시기 바랍니다.'
              );
              return;
            }
          });
        this.getGridData(this.lotProcessHistoryGet);
        this.getGridData(this.reworkInformationListGet);
       //역순조회 체크박스 선택유무에 따른 데이터 조회
        if (this.chkDesc == "desc") {
          // 트리 정방향/역방향 뿌리기
          this.queryId = "GetLotTrackingDescTree";
        } else {
          this.queryId = "GetLotTrackingTree";
        }
        this.initTree(this.queryId, this.lotid, this.chkDesc);
      } else {
        if (this.selectedLot) {
          return;
        }
        this.$refs.alertPop.show('', 'Lot을 선택 후 조회하세요');
        this.alertCallBack = () => {
          this.$refs.searchLot.$listeners.click();
        };
      }
    },

    searchInputValSet(nm, val) {
      this[nm] = val;
    },

    async lotProcessHistoryDbClick(e) {
      if (e.dataItem.EVENTNAME === "TxnConsumable") {
        this.lotProcessHistoryRow = e.dataItem;
        await this.getGridData(this.consumableHistoryListGet);
        this.consumableHistoryModalVisible = true;
      }
    },

    //역순조회 체크박스
    formCheckValSet(nm, val) {
      const sortFunc = val ? (a, b) => a - b : (a, b) => b - a;
      this.gridData.LotProcessHistory = [
        ...this.gridData.LotProcessHistory,
      ].sort((a, b) => sortFunc(b.TIMEKEY, a.TIMEKEY));
      this.gridData.ReworkInformationList = [
        ...this.gridData.ReworkInformationList,
      ].sort((a, b) => sortFunc(b.REWORKCOUNT, a.REWORKCOUNT));

      if (val) {
        this.chkDesc = "desc";
        this.queryId = "GetLotTrackingDescTree";
      } else {
        this.chkDesc = "asc";
        this.queryId = "GetLotTrackingTree";
      }
      this.initTree(this.queryId, this.lotid, this.chkDesc);
    },

    //트리 데이터 가져오기
    async initTree(queryId, lotId, chkDesc) {
      const res = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: queryId,
        sendParam: {
          lotid: lotId,
        },
      });
      this.menu = res;
      const treeMapRes = res.map((x) => ({ ...x, expanded: true }));

      this.treeData = utils2.makeTreeData(treeMapRes, "ID", "PARENTID");
      if (!this.curTree) {
        this.curTree = {
          ...this.treeData[0],
        };
      }
    },

    async getGridData(_id) {
      try {
        const res = await this.mesGet({
          apiKey: "mes/common/getqueryresult",
          queryId: _id.queryId,
          sendParam: _id.params,
        });
        if (
          _id.queryId == "GetLotTrackingTree" ||
          _id.queryId == "GetLotTrackingDescTree"
        ) {
          //트리 데이터
          const treeMapRes = res.map((x) => ({ ...x, expanded: true }));
          // console.log("TreeData ==> ", treeMapRes);
          this.treeData = utils2.makeTreeData(treeMapRes, "ID", "PARENTID");
        } else {
          const data = res.map((x, idx) => {
            return {
              ...x,
              selected: false,
              idx: idx,
              inEdit: true,
              newRow: false,
            };
          });
          this.$nuxt.$emit("iccReset");
          this.gridOriData[_id.id] = data;
          this.gridData[_id.id] = data;

          return data.length;
        }
      } catch (error) {
        this.$refs.alertPop.show("ERROR : " + res.code, res.message);
      }
    },
  },
};
</script>
<style lang="scss"></style>
