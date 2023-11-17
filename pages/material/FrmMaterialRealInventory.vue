<template>
  <div>
    <ol class="page-navigation">
      <li>홈</li>
      <li>자재관리</li>
      <li>재고실사</li>
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
                    <label>창고</label>
                    <MesVariableSelectBox
                      :ref="'comboArea'"
                      :allYN="true"
                      :dataNm="'areaid'"
                      :queryId="'GetWarehouseList'"
                      :inputcol="inputcol"
                      :defaultvalue="defaultvalue"
                      :sendParam="{
                        plantid: 'LS',
                        warehouse: warehouseid,
                      }"
                      @comboChange="comboChange"
                    ></MesVariableSelectBox>
                  </div>
                  <div class="form-group">
                    <label>자재타입</label>
                    <MesSelectBox
                      :enumID="'MATERIALTYPE'"
                      :allYN="true"
                      :dataNm="'materialtype'"
                      :defaultvalue="defaultvalue"
                      @comboChange="comboChange"
                    ></MesSelectBox>
                  </div>
                </div>
              </v-col>

            </v-row>
            <v-row>
              <v-col :sm="9" :lg="10">
                <div class="form-group-wrap">
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
                  <div class="form-group">
                    <label>자재LotID</label>
                    <InputText
                        ref="materiallotid"
                        :dataNm="'materiallotid'"
                        :disabled="false"
                        :searchOption="true"
                        :searchFunc="searchBtn"  
                        @input-text-set="searchInput"
                      />
                  </div>
                </div>
              </v-col>
              <v-row no-gutters justify="end">
                <v-col :cols="12" align="right">
                  <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="searchBtn">조회</Button>
                </v-col>
              </v-row>
            </v-row>
          </CardBody>
        </Card>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="12" :class="'divList1'" :style="{ height: '100%' }">
        <Card :style="{ height: '100%' }">
          <CardBody :style="{ width: '100%', height: '100%' }">
            <v-row no-gutters>
              <v-col cols="6" align="left">
                <CardTitle>재고실사</CardTitle>
              </v-col>
              <v-col cols="6" align="right">
                <Button :theme-color="'primary'" :size="'small'" icon="save" @click="saveBtn">저장</Button>
                <Button :theme-color="'primary'" :size="'small'" @click="downloadExcel()">엑셀저장</Button>
                <Button class="file-upload-btn" :theme-color="'primary'" :size="'small'" @click="$refs.fileInput.click()">엑셀업로드</Button>
                <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;">
                <kendo-grid :data-source="this.gridData" style="display: none;">
                </kendo-grid>
              </v-col>
            </v-row>
            <div ref="divWrapper" :style="{ height: 'calc(100% - 33px)' }">
              <KendoGrid 
                ref="rowGrid"
                :gridHeight="gridHeight"
                :gridItems="gridData"
                :sortable="true"
                :columns="headerParam.gridHeader"
                :resizable="true"
                :isPaging="true"
                :edit-field="'inEdit'"
                :selected-field="selectedField"
                :gridDropDownList="gridDropDownList"
                @gridrowclick="onRowClick"
                @gridddchang="rowDdChange"
                @griditemchange="griditemchange"
                @rowdblclick="rowdblclick"
                @sortChangeHandler="sortChangeHandler"
              />
            </div>
        </CardBody>
      </Card>
    </v-col>
  </v-row>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    <SearchModal
      ref="SearchModal"
      v-if="searchModalVisible"
      :visibleDialog="searchModalVisible"
      :title="'title'"
      :message="'message'"
      :screenType="'frmWarehouseStockManagement'"
      :data="data"
      :callBack="() => {}"
      @visibleDialog="(val) => (searchModalVisible = val)"
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
import MesVariableSelectBox from "@/components/common/select/MesVariableSelectBox";
import multiGridHeaderMinin from "@/mixin/multiGridHeaderMinin.js";
import XLSX from 'xlsx';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import SearchModal from "@/components/frmWarehouseStockManagement/SearchModal";


let myTitle;
let myMenuId;

export default {
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
    MesVariableSelectBox,
    XLSX,
    saveAs,
    SearchModal,    
  },
  data() {
    return {
      gridHeader: [
        { field: 'yyyymm', headerName: '마감기준일', width: 150 },
        { field: 'materialid', headerName: '자재코드', width: 150 },
        { field: 'materialname', headerName: '자재명', width: 300 }
      ],
      columns: [ ],
      gridOriData : [],
      gridHeight : '100px',
      gridData : [],
      selectedField: 'selected',
      checkHeaderArr: ["ACTIVESTATE"], 
      headerParam: {
      gridid: "dgvMaterialRealInventory", // 그리드 ID
      rowStat: "", //rowStat 표시 여부
      noFirstCheck: true,
      noRowstat: false,
      gridHeader: []
      },
      visibleWindow: false,
      show: false,
      gridDropDownList:[
      {dataVal : 'WAREHOUSENAME', dataItem: []},
      {dataVal : 'MATERIALTYPE', dataItem: []},
      ],
      warehouseid: "",
      warehousename: "",
      materialid : "",
      materialname : "",
      materialtype: "",
      realqty: "",
      materiallotid: "",
      intputStockqty: "",
      intputRealqty: "",
      inputcol: ["WAREHOUSEID", "WAREHOUSENAME"],
      stockMonth: [],
      stockMonthStr: "",
      searchModalVisible: false,
      defaultvalue: "",
    };

  },
  created() {
  },
  async mounted() {
    await this.getHeaderMulti(this.headerParam, this.$refs.divWrapper);
    this.areaid = this.$refs.comboArea.value; // 창고콤보 첫번째 고정
    await this.getStockMonth();
    //this.headerParam.gridHeader[1].hidden = true;
    await this.getGridData();
    
  }
  ,
  computed: {
    buttonText: function(){
       return this.show ? 'Hide' : 'Show';
     }

  },
  watch: {
  },
  methods: {

    handleUploadClick() {
      this.$refs.fileInput.click()
    },
    //검색 인풋 변경시
    searchInput(nm, val){
        this[nm] = val;
    },
    searchBtn(){
     this.$refs.rowGrid.sortField = [{}];
     this.$refs.rowGrid.skip = 0;
     this.getGridData();
    },
    saveBtn(data){
      const saveData = this.gridData.filter(x => x.rowStat !== "N")
      .map(x => {
        return { 
          _ROWSTATUS: x._ROWSTATUS,
          WAREHOUSEID: x.WAREHOUSEID,
          HOLDQTY: x.HOLDQTY,
          MATERIALID: x.MATERIALID,
          CONSUMEQTY: x.CONSUMEQTY,
          RECEIPTDATE: x.RECEIPTDATE,
          PLANTID: x.PLANTID,
          MATERIALNAME: x.MATERIALNAME,
          STOCKQTY: x.STOCKQTY,
          MATERIALTYPE: x.MATERIALTYPE,
          COMPANYNAME: x.COMPANYNAME,
          REALQTY: x.REALQTY,
          VENDOR: x.VENDOR,
          RETURNDETAILMESSAGE: x.RETURNDETAILMESSAGE,
          LASTEVENTTIMEKEY: x.LASTEVENTTIMEKEY,
          SCRAPQTY: x.SCRAPQTY,
          OPENINGQTY: x.OPENINGQTY,
          _ROWSTATUSIMAGE: x._ROWSTATUSIMAGE,
          BONUSQTY: x.BONUSQTY,
          MATERIALTYPENAME: x.MATERIALTYPENAME,
          YYYYMM: x.YYYYMM,
          MATERIALLOTID: x.MATERIALLOTID,
          OUTQTY: x.OUTQTY,
          INQTY: x.INQTY,
          WAREHOUSENAME: x.WAREHOUSENAME
        }
      });
      
      if(saveData.length > 0){
        console.log(saveData)
        const res = this.mesPost({
          apiKey: "mes/common/manage",
          messagename: "TxnMaterialRealInventory",
          sendParam: saveData,
        }).then( result => {
          this.$nextTick(() => {
            if (result.returncode !== undefined && result.returncode === '0') {
            this.getGridData();
            this.$refs.alertPop.show("알림", "저장되었습니다.");
            } else {
              this.$refs.alertPop.show(
                'ERROR : ' + result.code,
                result.message
              );
            }
          })
        })
      }
    },
    onClick () {
        this.show = !this.show;
    },

    //재고실사 그리드 데이터 가져오기
    async getGridData() {
      
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetMaterialRealInventory",
        sendParam: {
          plantid: "LS",
          yyyymm: "202201",
          warehouseid: this.areaid,
          materialid: this.materialid,
          materialname: this.materialname,
          materialtype: this.materialtype,
          materiallotid: this.materiallotid,
        }
      }).then((res) => {
         const data = res.map((x, idx) => {
          console.log("----------",x,idx)
          return {
            ...x,
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false
          }
        });
        console.log("data ====== ", data)
        this.$nuxt.$emit('iccReset')
        // gridHeader Customations
        //this.headerParam.gridHeader[1].hidden = true;
        this.gridOriData = data;
        this.gridData = data;
      })
    },
 
    //그리드 로우 클릭
    onRowClick (event) {
      console.log("===========onRowClick==============");
      //그리드 로우 클릭시 라인표시 유무 확인필요
       this.gridData.forEach(x => x.selected = false);
      event.dataItem[this.selectedField] = true;
    },
    //맨앞 checkBox 클릭
    onSelectionchange (event) {
      console.log("===========onSelectionchange==============")
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
    },
    //그리드 콤보박스 리스트가져오기
    async getGridComboList(){
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetEnumValue",
        sendParam: {
          plantid: "LS",
          enumid: "WarehouseName"
        }
      }).then((data) => {
        this.gridDropDownList[0].dataItem = data;
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
    comboChange(nm, val){
      this[nm] = val;
    },
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem) {
      const idx = this.gridData.findIndex((x) => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));

      data[idx] = { ...data[idx], [name]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }

      this.gridData = data;
    },
    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const idx = data.findIndex((x) => x.idx === e.dataItem.idx);
      console.log(idx)
      data[idx] = { ...data[idx], [e.field]: e.value };
      if (data[idx].rowStat === "N") {
        data[idx].rowStat = "U";
      }
      if (data[idx].rowStat === "U" && !this.chkOriginalData(data, idx)) {
        data[idx].rowStat = "N";
      }
        this.gridData = data;
      },
    //데이터 원상복구시 "수정" 항목 제거
    chkOriginalData(gridData, idx) {
      const data = JSON.parse(JSON.stringify(gridData));
      const keys = Object.keys(data[idx]);
      const chkArr = keys.filter((x) => {
        return data[idx][x] !== this.gridOriData[idx][x] && x !== "rowStat";
      });
      return chkArr.length > 0;
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
    downloadExcel() {
      const header = {
        'PLANTID': '공장코드',
        'YYYYMM': '마감기준일',
        'MATERIALID': '자재코드',
        'MATERIALNAME': '자재명',
        'MATERIALLOTID': '자재LotID',
        'WAREHOUSEID': '창고코드',
        'WAREHOUSENAME': '창고이름',
        'MATERIALTYPE': '자재구분',
        'MATERIALTYPENAME': '자재구분명',
        'VENDOR': '공급업체코드',
        'LASTEVENTTIMEKEY': '마지막 EventTimekey',
        'RECEIPTDATE': '입고일자',
        'OPENINGQTY': '초기재고수량',
        'STOCKQTY': '현재고수량',    
        'REALQTY': '실사수량',
        'INQTY': '입고수량',
        'BONUSQTY': 'Bonus수량',
        'CONSUMEQTY': '사용수량',
        'SCRAPQTY': 'Scrap수량',
        'OUTQTY': '출고수량',
        'HOLDQTY': '보류수량',
        'COMPANYNAME': '공급업체',
        'ERRORMESSAGE': '오류메시지',
      };

      // Header의 Key 값으로 배열 생성
      const headerKeys = Object.keys(header).slice(0, 22);
      
      // Header의 Key 값으로 Header 객체 새로 생성
      const newHeader = headerKeys.reduce((acc, key) => {
        acc[key] = header[key];
        return acc;
      }, {});

      // 기존 gridData의 header를 한글로 변경하고 21개 이상인 필드는 삭제
      const newGridData = this.gridData.map(row => {
        const newRow = {};
        for (let key in row) {
          if (newHeader.hasOwnProperty(key)) {
            newRow[newHeader[key]] = row[key];
          }
        }
        return newRow;
      });

    // 시트 생성
    const sheet = XLSX.utils.json_to_sheet(newGridData, { header: Object.values(header) });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, sheet, '현황리스트');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(excelBlob, '재고실사 현황리스트.xlsx');
    },

    //엑셀 업로드
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const gridData = json.slice(1).map((row,idx) => {
        return {
          PLANTID: row[0],
          YYYYMM: row[1],
          MATERIALID: row[2],
          MATERIALNAME: row[3],
          MATERIALLOTID: row[4],
          WAREHOUSEID: row[5],
          WAREHOUSENAME: row[6],
          MATERIALTYPE: row[7],
          MATERIALTYPENAME: row[8],
          VENDOR:row[9],
          LASTEVENTTIMEKEY:row[10],
          RECEIPTDATE: row[11],
          OPENINGQTY: row[12],
          STOCKQTY: row[13],
          REALQTY: row[14],
          INQTY: row[15],
          BONUSQTY: row[16],
          CONSUMEQTY: row[17],
          SCRAPQTY: row[18],
          OUTQTY: row[19],
          HOLDQTY: row[20],
          COMPANYNAME: row[21],
          ERRORMESSAGE: row[22],

          rowStat : "N",
           selected: false,
            inEdit: true,
            newRow: false,
            idx:idx
        };
      });
         if (gridData.length > 0) {
        this.gridData = gridData;
         }
      };
      reader.readAsBinaryString(file);
    },

    // 그리드 더블 클릭
    rowdblclick(e) {
      this.data = e.dataItem;
      this.searchModalVisible = true;
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
      this.gfn_sortChangeHandler(this.gridData, e);
    }
  },

  }



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