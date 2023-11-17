<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>자재관리</li>
      <li>창고이동</li>
    </ol>
    <v-row ref="searchFilter" >
      <v-col :cols="12">
        <Card>
          <CardBody>
            <v-row no-gutters>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
                  <!-- <div class="form-group form-calendar-info">
                    <span class="calendar-info"></span>
                    <span class="calendar-info">{{ stockMonthStr }}</span>
                  </div> -->
                  <div class="form-group">
                    <label>From창고</label>
                    <MesVariableSelectBox
                      :ref="'comboArea'"
                      :allYN="false"
                      :dataNm="'warehouseid'"
                      :queryId="'GetWarehouseList'"
                      :defaultValue="warehouseid"
                      :inputcol="inputcol"
                      :sendParam="{
                        plantid: 'LS',
                        warehouse: warehouseid,
                      }"
                      @comboChange="comboChange"
                    ></MesVariableSelectBox>
                  </div>
                  <div class="form-group" style="display: none;">
                    <label>자재타입</label>
                    <MesSelectBox
                      ref="materialtype"
                      :enumID="'MATERIALTYPE'"
                      :allYN="false"
                      :dataNm="'materialtype'"
                      :disabled="true"
                      :defaultValue="materialtype"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                  <div class="form-group">
                    <label>자재코드</label>
                    <InputText
                      ref="materialid"
                      :dataNm="'materialid'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"  
                      @input-text-set="searchInput"
                    />
                  </div>
                  <div class="form-group">
                    <label>자재명</label>
                    <InputText
                      ref="materialname"
                      :dataNm="'materialname'"
                      :disabled="false"
                      :searchOption="true"
                      :searchFunc="searchBtn"  
                      @input-text-set="searchInput"
                    />
                  </div>
                </div>
              </v-col>
              <v-col :sm="3" :lg="2" align="right">
                <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="searchBtn">조회</Button>
              </v-col>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">     
      <v-col :sm="12" :lg="3" :class="'divList1'" :style="{ height: '100%' }">
        <Card ref="gridCard2" :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="6" align="left">
                <CardTitle>자재목록</CardTitle>
              </v-col>
            </v-row>
            <div ref="divWrapper2" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid
                ref="rowGrid"
                :gridItems="gridData.material"
                :gridHeight="gridHeight2"
                :sortable="true"
                :columns="headerParam2.gridHeader"
                :resizable="true"
                :isPaging="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                @gridrowclick="onMaterialRowClick"
                @rowdblclick="rowdblclick"
                @sortChangeHandler="sortChangeHandler"
              />
            </div>
          </CardBody>
        </Card>
      </v-col>
      <v-col
        :sm="12"
        :lg="9"
        :class="'divListWapper'"
        :style="{ height: '100%' }"
      >
        <v-row no-gutters>
          <v-col :cols="12">
            <Card ref="gridCard">
              <CardBody :style="{ width: '100%' }">
                <div class="detail-area area-4">
                  <div class="area-form">
                    <div class="area-th">
                      <label>창고코드</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input1"
                        :boxWidth="'100%'"
                        :dataNm="'warehouseid'"
                        :readonly="true"
                        :defaultValue="warehouseid"
                        @input-text-set="searchInput"
                      />
                    </div>
                    <div class="area-th">
                      <label>창고명</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input2"
                        :boxWidth="'100%'"
                        :dataNm="'input2'"
                        :readonly="true"
                        :defaultValue="input2"
                        @input-text-set="searchInput"
                      />
                    </div>
                    <div class="area-th">
                      <label>자재코드</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input3"
                        :boxWidth="'100%'"
                        :dataNm="'input3'"
                        :readonly="true"
                        :defaultValue="input3"
                        @input-text-set="searchInput"
                      />
                    </div>
                    <div class="area-th">
                      <label>자재명</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input4"
                        :boxWidth="'100%'"
                        :dataNm="'input4'"
                        :readonly="true"
                        :defaultValue="input4"
                        @input-text-set="searchInput"
                      />
                    </div>
                  </div>
                  <div class="area-form">
                    <div class="area-th">
                      <label>자재구분</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input5"
                        :boxWidth="'100%'"
                        :dataNm="'input5'"
                        :readonly="true"
                        :defaultValue="input5"
                        @input-text-set="searchInput"
                      />
                    </div>
                    <div class="area-th">
                      <label>총재고수량</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input6"
                        :boxWidth="'100%'"
                        :dataNm="'input6'"
                        :readonly="true"
                        :defaultValue="input6.toString()"
                        @input-text-set="searchInput"
                      />
                    </div>
                    <div class="area-th">
                      <label>총보류수량</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input7"
                        :boxWidth="'100%'"
                        :dataNm="'input7'"
                        :readonly="true"
                        :defaultValue="input7.toString()"
                        @input-text-set="searchInput"
                      />
                    </div>
                    <div class="area-th">
                      <label>가용수량</label>
                    </div>
                    <div class="area-td">
                      <inputText
                        ref="input8"
                        :boxWidth="'100%'"
                        :dataNm="'input8'"
                        :readonly="true"
                        :defaultValue="input8.toString()"
                        @input-text-set="searchInput"
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
        <v-row :class="'divList2'" :style="{ height: 'calc(100% - 130px)' }">
          <v-col :cols="12" :style="{ height: '100%' }">
            <Card :class="'gridCard'" :style="{ height: '100%' }">
              <CardBody :style="{ height: '100%' }">
                <v-row no-gutters>
                  <v-col cols="2" align="left">
                    <CardTitle>재고목록</CardTitle>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center align-center">
                    <div class="form-group-wrap">
                      <div class="form-group" style="margin-top: 0px">
                        <v-col cols="4">
                          <label>To창고</label>
                        </v-col>
                        <v-col cols="8">
                          <MesVariableSelectBox
                            :ref="'comboArea2'"
                            :allYN="false"
                            :dataNm="'towarehouseid'"
                            :queryId="'GetWarehouseList'"
                            :inputcol="inputcol"
                            :sendParam="{
                              plantid: 'LS',
                              warehouse: warehouseid,
                            }"
                            @comboChange="comboChange"
                          ></MesVariableSelectBox>
                        </v-col>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="7" class="d-flex justify-end align-center">
                    <div class="form-group-wrap">
                      <v-col cols="6">
                        <div class="form-group" style="margin-top: 0px">
                          <label>이동수량</label>
                          <InputText
                            ref="moveqty"
                            :boxWidth="'80%'"
                            :dataNm="'moveqty'"
                            :disabled="false"
                            @input-text-set="searchInput"
                          />
                        </div>
                      </v-col>
                      <v-col cols="4" class="d-flex justify-center align-center">
                        <Button :theme-color="'primary'" :size="'medium'" @click="applymoveqty">적용</Button>
                      </v-col>
                      <v-col cols="2" class="d-flex justify-center align-center">
                        <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveBtn">저장</Button>
                      </v-col>
                    </div>
                  </v-col>
                </v-row>
                <div ref="divWrapper" :style="{ height: 'calc(100% - 34px)' }">
                  <KendoGrid 
                    ref="rowGrid"
                    :gridHeight="gridHeight"
                    :gridItems="gridData.stock"
                    :sortable="true"
                    :columns="headerParam.gridHeader"
                    :resizable="true"
                    :edit-field="'inEdit'"
                    :selected-field="selectedField"
                    :gridDropDownList="gridDropDownList"
                    :isPaging="true"
                    @gridrowclick="onRowClick"
                    @rowdblclick="stockRowdblclick"
                    @sortChangeHandler="sortChangeHandler2"
                  />
                </div>
              </CardBody>
            </Card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AlertPop ref="alertPop" :is="'alertPop'"/>
    <SearchModal
      ref="SearchModal"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :data="data"
      :screenType="'frmWarehouseMigration'"
      :callBack="()=>{}"
      @visibleDialog="(val) => searchModalVisible = val"
      
    />
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import KendoGrid from "@/components/common/KendoGrid"
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView, processTreeViewItems } from '@progress/kendo-vue-treeview';
import { Button } from "@progress/kendo-vue-buttons";
import InputText from '../../components/common/input/InputText.vue';
import { AutoComplete, ComboBox, DropDownList, MultiSelect } from '@progress/kendo-vue-dropdowns';
import { Dialog, DialogActionsBar, Window } from "@progress/kendo-vue-dialogs";
import MesSelectBox from "@/components/common/select/MesSelectBox";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import SearchModal from "@/components/frmWarehouseStockManagement/SearchModal";
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
let myTitle;
let myMenuId;
const d = new Date();
let year = d.getFullYear(); // 년
let month = d.getMonth(); // 월
let day = d.getDate(); // 일
let workFromDate = new Date(year, month, day - 7);

export default {
  mixins: [mixinGlobal, multiGridHeaderMinin],
  async asyncData(context) {
    const myState = context.store.state;
    myMenuId = context.route.query.menuId;
    await context.store.commit("setActiveMenuInfo", myState.menuData[myMenuId]);
    myTitle = await myState.activeMenuInfo.menuNm;
  },
  props:{
    gridHeight:{
      type: String,
      defaultData: "150px"
    },
    gridHeight2:{
      type: String,
      defaultData: "500px"
    },
    gridHeight3:{
      type: String,
      defaultData: "250px"
    },
    gridHeight4:{
    type: String,
      defaultData: "250px"
    },
  },

  meta: {
    title: () => {
      return myTitle;
    },
    menuId : myMenuId,
    closable: true
  },
  components: {
    Utility,
    Card,
    Button,
    CardBody, 
    window: Window,
    CardTitle,
    TreeView,
    KendoGrid,
    InputText,
    'dropdownlist': DropDownList,
    'kbutton': Button,
    MesSelectBox,
    SearchModal,
    MesVariableSelectBox,
  },
  data() {
    return {
      columns: [],
      gridData: { stock: [] , material: []},
      gridOriData : { stock: [] , material: []},
      // gridHeight : '10px',
      gridDataStockHistory : [],
      selectedField: 'selected',
      stockGetParams: {
      yyyymm: "202201",
        // fromdate: this.fromdate,
        // todate: this.todate,
        warehouseid: this.warehouseid,
        towarehouseid: this.towarehouseid,
        materialtype: this.materialtype,
        plantid: 'LS',
        materialid: this.materialid,
      },
      materialGetParams: {
        plantid: 'LS',
      },
      checkHeaderArr: ["ACTIVESTATE"], 
      headerParam: {
      gridid: "dgvStockFromToList", // 그리드 ID
      rowStat: "", //rowStat 표시 여부
      noFirstCheck: true,
      gridHeader: [],
      },
      headerParam2: {
      gridid: "dgvMaterialList", // 그리드 ID
      rowStat: "", //rowStat 표시 여부
      noFirstCheck: true,
      noRowstat: true,
      gridHeader: []
      },
      visibleWindow: false,
      searchModalVisible: false,
      show: false,
    gridDropDownList:[
      {dataVal : 'TOWAREHOUSENAME', dataItem: []},
      {dataVal : 'MATERIALTYPE', dataItem: []},
      ],
      warehouseid: "",
      warehousename: "",
      materialid : "",
      materialname : "",
      materialtype: "",
      selectedID: null,
      curMaterial: [],
      curStock: [],
      inputcol: ["WAREHOUSEID", "WAREHOUSENAME"],
      warehouse: "",
      moveqty: '', //이동수량
      fromdate: Utility.setFormatDate(new Date(), "YYYYMMDD"),
      todate: Utility.setFormatDate(new Date(), "YYYYMMDD"),
      workFromDate: Utility.setFormatDate(
        workFromDate.toLocaleDateString(),
        "YYYY-MM-DD"
      ),
      workToDate: Utility.setFormatDate(new Date(), "YYYYMMDD"),      
      stockMonth: [],
      stockMonthStr: "",      
      input2: "", // 창고명
      input3: "", // 자재코드
      input4: "", // 자재명
      input5: "", // 자재구분
      input6: "", // 총재고수량
      input7: "", // 총보유수량
      input8: "", // 가용수량
      data: {},
    };

  },
  created() {
  },
  async mounted() {
    
    //재고목록
    await this.getHeaderMulti(this.headerParam , this.$refs.divWrapper);
    //자재목록
    await this.getHeaderMulti(this.headerParam2, this.$refs.divWrapper2);
    await this.getStockMonth();
    await this.getGridComboList();
    const inputEl1 = this.$refs.input6.$el.querySelector('input');
    const inputEl2 = this.$refs.input7.$el.querySelector('input');
    const inputEl3 = this.$refs.input8.$el.querySelector('input');
    inputEl1.style.textAlign = 'right';
    inputEl2.style.textAlign = 'right';
    inputEl3.style.textAlign = 'right';
    this.warehouseid = this.$refs.comboArea.value; // From창고콤보 첫번째 고정
    this.towarehouseid = this.$refs.comboArea2.value; // To창고콤보 첫번째 고정
    this.input2 = this.$refs.comboArea.codeLists.find(x => x.id === this.warehouseid).text;
  }
  ,
  computed: {
    buttonText: function(){
       return this.show ? 'Hide' : 'Show';
     },
    items () {
      return this.gridData.map((item) => ({ ...item, selected: item.MATERIALID === this.selectedID }));
    },

  },
  watch: {
  },
  methods: {

    applymoveqty(){
      if(this.warehouseid === this.towarehouseid){
        this.$refs.alertPop.show(
          "알림",
           "From창고와 To창고가 같습니다."
          );
          return;
      } 

      let totalQty = 0;
      this.gridData.stock.forEach(function (item) {
        totalQty += parseFloat(item.AVAILABLEQTY);
      })

      if (isNaN(this.moveqty) || parseFloat(this.moveqty) < 0) {
        // 0 이하 값 또는 문자열 입력 에러
        this.$refs.alertPop.show("알림", "이동수량을 0 이상으로 입력해주세요.");
        return;
      } else if (parseFloat(this.moveqty) == 0){
          item.MOVEQTY = ""
      }

      if(this.input6 < this.moveqty) {
        //수량 초과 에러
        this.$refs.alertPop.show(
          "알림",
           "입력한 이동수량이 현 재고수량의 합을 초과하였습니다."
          );
          return;
      }
      
      let remainQty = parseFloat(this.moveqty);
      this.gridData.stock.some(function (item) {
        if(remainQty <= 0) {
          return true;
        }
        if(remainQty >= item.AVAILABLEQTY) {
          remainQty -= item.AVAILABLEQTY;
          item.MOVEQTY = item.AVAILABLEQTY;
          item.rowStat = 'U';
        }
        else {
          item.MOVEQTY = remainQty;
          remainQty = 0;
          item.rowStat = 'U';
        }
      })
    },
    
    comboChange(nm, val){
      //창고정보 세팅
      if(nm == 'warehouseid') {
        this.input2 = this.$refs.comboArea.codeLists.find(x => x.id === val).text;
      }

      this[nm] = val;
    },
    //검색 인풋 변경시
    searchInput(nm, val){
      this[nm] = val;
    },
    searchBtn(){
        const params = {
        yyyymm: "202201",
        materialname: this.materialname,
        plantid: "LS",
        materialid: this.materialid,
        materialtype: this.materialtype,
        warehouseid: this.warehouseid,
        fromdate: this.fromdate,
        todate: this.todate,
      };
      this.getGridData('material', 'GetMaterialList', params);
    },

    // 저장버튼 클릭
    saveBtn(){
    if (this.moveqty === 0 || this.moveqty === "") {
      this.$refs.alertPop.show("알림", "저장할 데이터가 없습니다.");
      return;
    }

      const saveData = this.gridData.stock.filter(x => x.rowStat !== "")
      .map(x => {
        return { 
          ...x,
          _ROWSTATUS: x.rowStat,
          moveqty: x.moveqty,
          towarehousename: this.towarehouseid
        }
      });
  
      if(saveData.length > 0) {
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnStockTransfer",
          sendParam: saveData
        }).then(() => {
        this.$nextTick(() => {
          this.$refs.alertPop.show("알림", "저장되었습니다.");
          this.onMaterialRowClick({ dataItem: this.curMaterial }); // 이벤트 발생시키기
          
          // moveqty InputText의 값을 초기화
          this.$refs.moveqty.$el.querySelector('input').value = '';
          })
        })
      } else {
      this.$refs.alertPop.show("알림", "저장할 데이터가 존재하지 않습니다.");
      return;
      }
    },

    holdBtn() {
      this.visibleWindow = !this.visibleWindow;
      this.getStockHistoryGridData();
    },
    onClick () {
      this.show = !this.show;
    },

       //그리드 데이터 가져오기
    async getGridData(id, queryId, params, queryVersion) {
           try {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: queryId,
        sendParam: params,
        queryVersion: queryVersion
      }).then((res) => {
         const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            MOVEQTY: 0
          }
        });
      this.$nuxt.$emit('iccReset');
      this.gridOriData[id] = data;
      this.gridData[id] = data;

      if (id === "stock") {
        this.gridData.stock.forEach((item) => {
              item.RECEIPTDATE = Utility.setFormatDate(item.RECEIPTDATE.slice(0, 10), "YYYY-MM-DD");
            });  
        if (this.gridData[id].length > 0) {
            // this.input1 = this.gridData[id][0].WAREHOUSEID; // 창고코드
            // this.input2 = this.gridData[id][0].WAREHOUSENAME; // 창고명
            this.input3 = this.gridData[id][0].MATERIALID; // 자재코드
            this.input4 = this.gridData[id][0].MATERIALNAME; // 자재명
            this.input5 = this.gridData[id][0].MATERIALTYPE; // 자재구분
          let sum = 0;
          for (let i = 0; i < this.gridData[id].length; i++) {
            sum += Number(this.gridData[id][i].STOCKQTY);
          }
          this.input6 = sum; // 총재고수량

          let sum2 = 0;
          for (let i = 0; i < this.gridData[id].length; i++) {
            sum2 += Number(this.gridData[id][i].HOLDQTY);
          }
          this.input7 = sum2; // 총보류수량
          this.input8 = Number(this.input6) - Number(this.input7); // 가용수량
        } else{
            this.input3 = this.curMaterial.MATERIALID; // 자재코드
            this.input4 = this.curMaterial.CONSUMABLENAME; // 자재명
            this.input5 = this.curMaterial.MATERIALTYPE; // 자재구분
            this.input6 = "0"; // 총재고수량
            this.input7 = "0"; // 총보류수량
            this.input8 = "0"; // 가용수량
          }
      }
      else {
        if(data.length > 0) {
          this.curMaterial = this.gridData[id][0];
          this.input1 = this.gridData[id][0].WAREHOUSEID; // 창고코드
          this.input2 = this.gridData[id][0].WAREHOUSENAME; // 창고명
          this.input3 = this.gridData[id][0].MATERIALID; // 자재코드
          this.input4 = this.gridData[id][0].MATERIALNAME; // 자재명
          this.input5 = this.gridData[id][0].MATERIALTYPE; // 자재구분

          const paramsStock = {
            yyyymm: "202201",
            plantid: "LS",
            materialid: data[0].MATERIALID,
            materialtype: data[0].MATERIALTYPE,
            warehouseid: data[0].WAREHOUSEID,
            fromdate: '00000000',
            todate: '99999999',
          };

          this.getGridData('stock', 'GetStockList', paramsStock, '00002');
        } else{
          const paramsStock = {
            yyyymm: "202201",
            plantid: "LS",
            materialid: data.MATERIALID,
            materialtype: data.MATERIALTYPE,
            warehouseid: data.WAREHOUSEID,
            fromdate: '00000000',
            todate: '99999999',
          };

          this.getGridData('stock', 'GetStockList', paramsStock, '00002');
        }
      }
      });
      } catch (error) {
        console.log(error);
      }
    },

    //그리드 로우 클릭
    onMaterialRowClick (event) {
      this.gridData.material.forEach(x => x.selected = false);
      event.dataItem[this.selectedField] = true;
      this.curMaterial = event.dataItem;

      this.input1 = this.curMaterial.WAREHOUSEID; // 창고코드
      this.input2 = this.curMaterial.WAREHOUSENAME; // 창고명
      this.input3 = this.curMaterial.MATERIALID; // 자재코드
      this.input4 = this.curMaterial.MATERIALNAME; // 자재명
      this.input5 = this.curMaterial.MATERIALTYPE; // 자재구분

      const params = {
        plantid: 'LS',
        yyyymm : '202201',
        warehouseid : this.curMaterial.WAREHOUSEID,
        materialtype : this.curMaterial.MATERIALTYPE,
        materialid : this.curMaterial.MATERIALID,
        fromdate: '00000000',
        todate : '99999999'
      };
      
      this.getGridData('stock', 'GetStockList', params, '00002');
    },

    //그리드 더블 클릭
    rowdblclick(event){
        console.log("===========rowdblclick==============")
    },
    showRowInfo (event, { item } ) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
    },

    //그리드 인풋 제외 데이터 변경시(*콤보박스는 저장할때 데이터 변경후 저장)
    rowDdChange(e, name, dataItem){
      console.log("===rowDdChange===",e)
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));
      console.log("name",name)
      if(name === "AREATYPE") {
      }
      if(name === "GOINORDERREQUIRED") {
        e.value = e.value ? "Yes" : "No";
      }

      data[idx] = {...data[idx], [name]: e.value}

      if(data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }

      if(data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)){
        data[idx].rowStat = "N";
      }

      this.gridData = data;
    },

    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      console.log("===griditemchange===");
      const data = JSON.parse(JSON.stringify(this.gridData));
      const index = data.findIndex((x) => x.idx === e.dataItem.idx);
      data[index] = { ...data[index], [e.field]: e.value };
      if (data[index].rowStat === "N") {
        data[index].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }
      this.gridData = data;
    },

    
    //그리드 콤보박스 리스트가져오기
    async getGridComboList(){
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "zGetWarehouseCombo",
        sendParam: {
           plantid: 'LS',
        }
      }).then((data) => {
        const combo = data.map(x => {
            return {
              ENUMVALUE: x.WAREHOUSEID,
              ENUMVALUENAME: x.WAREHOUSENAME,
            }
          })
          this.gridDropDownList[0].dataItem = combo;
      })
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValue",
        sendParam: {
          plantid: "LS",
          enumid: "MATERIALTYPE"
        }
      }).then((data) => {
        this.gridDropDownList[1].dataItem = data;
      })
    },

    onRowClick (event) {
      console.log("===========onRowClick==============")
      //그리드 로우 클릭시 라인표시 유무 확인필요
       this.gridData.stock.forEach(x => x.selected = false);
      event.dataItem[this.selectedField] = true;
      this.initData = event.dataItem;
    },

    //재고목록 그리드 더블 클릭
    stockRowdblclick(e) {
      console.log(e);
      this.data = e.dataItem;
      this.searchModalVisible = true;
    },

    // 년월목록
    async getStockMonth() {
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetStockMonth",
        sendParam: {
          plantid: "LS",
        },
      }).then((res) => {
        const data = res.map((x, idx) => {
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: false,
          };
        });
        this.stockMonth = data;

        console.log(this.stockMonth);
        this.stockMonthStr =
          this.stockMonth[0].YYYYMM + "-" + this.stockMonth[0].STATENAME;
      });
    },
    // sortChangeHandler(e){
    //   const isAscending = e.sort[0]?.dir == "asc";
    //   if(isAscending){
    //     this.gridData.material = this.gridData.material.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
    //     this.gridData.stock = this.gridData.stock.sort((a,b) => a[e.event?.field] < b[e.event?.field] ? -1 : a[e.event?.field] > b[e.event?.field] ? 1 : 0)
    //   }else{
    //     this.gridData.material = this.gridData.material.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
    //     this.gridData.stock = this.gridData.stock.sort((a,b) => a[e.event?.field] > b[e.event?.field] ? -1 : a[e.event?.field] < b[e.event?.field] ? 1 : 0)
    //   }
    // }
    sortChangeHandler(e){
      this.gfn_sortChangeHandler(this.gridData.material, e);
    },
    sortChangeHandler2(e){
      this.gfn_sortChangeHandler(this.gridData.stock, e);
    }   
  }
};

const defaultData = {
};
</script>
<style lang="scss">
    .windowContent {
        width: 1300px !important;
        height: 1300px !important;
    }
    .calendar-info {
      display: inline-block;  /* inline-block으로 변경 */
      width: 166px;  /* 원하는 가로 넓이 설정 */
    }
</style>