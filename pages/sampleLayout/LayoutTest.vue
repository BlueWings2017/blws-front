<template>
  <div>
    <v-row ref="contents">
      <v-col :cols="2">
        <kcard ref="gridCard" :style="{height : '100%'}">
          <cardBody>
            <div ref="divWrapper">
              <!-- 트리위치  -->
              <!-- <TreeView
                :dataItems="treeData"
                :expandIcons="true"
                @expandchange="onExpandChange"
              /> -->
            </div>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="10">
        <kcard :style="{height : '100%'}">
          <cardBody :style="{width:'100%'}">
            <CardTitle>테스트 그리드</CardTitle>
            <div>
              <v-row>
                <KendoGrid ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridData"
                  :sortable="true"
                  :columns="columns"
                  :resizable="false"
                  :selected-field="selectedField"
                  :gridDropDownList="gridDropDownList"
                  @selectionchange="onSelectionchange"
                  @gridrowclick="onRowClick"
                  @gridddchang="rowDdChange"
                  @griditemchange="griditemchange"
                  @headerselectionchange="onHeaderSelectionChange"
                />
              </v-row>
            </div>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <AlertPop 
      ref="alertPop"
      :is="'alertPop'"
    />
    </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { TreeView } from '@progress/kendo-vue-treeview';
import KendoGrid from "@/components/common/KendoGrid"

let myTitle;
let myMenuId;

export default {
  mixins: [mixinGlobal],
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
    "kcard" : Card,
    CardBody, 
    CardTitle,
    TreeView,
    KendoGrid
  },
  data() {
    return {
      treeData: [],
      columns: [],
      gridHeight : '100px',
      gridData : [],
      gridDropDownList:[{
        dataVal : 'hldyFg',
        dataItem: ['평일', '휴일']
      }],
      selectedField: 'selected',
    };
  },
  computed: {
    areAllSelected() {
      return this.gridData.findIndex((item) => item.checked === false) === -1 && this.gridData.length !== 0
    },
    // gridItem() {
    //   return this.gridData.map(x => {
    //     return { ...x, inEdit: x.selected }
    //   })
    // }
  },
  mounted(){
    this.gridHeight = (this.$refs.contents.offsetHeight - 90) +'px';
  },
  created() {
    this.gridInit().then(() => {
      this.getGridData();
    })
  },
  methods: {
    //그리드 인풋 제외 데이터 변경시
    rowDdChange(e, name, dataItem){
      console.log("eeeeee",e)
      const idx = this.gridData.findIndex(x => x.idx === dataItem.idx);
      const data = JSON.parse(JSON.stringify(this.gridData));
      if(name == "hldyFg") {
        e.value = e.value == "휴일" ? "1" : "0"
      }
      data[idx] = {...data[idx], [name]: e.value}
      if(data[idx].rowStat == '') {
        data[idx].rowStat = "U";
      }
      this.gridData = data;
    },
    //그리드 인풋 데이터 변경시
    griditemchange(e) {
      const data = JSON.parse(JSON.stringify(this.gridData));
      const index = data.findIndex(d => d.idx === e.dataItem.idx);
      data[index] = { ...data[index], [e.field]: e.value };
      if(data[index].rowStat == ''){
        data[index].rowStat = "U";
      }
      this.gridData = data;
    },
    //그리드 헤더 가져오기
    async gridInit(){
      this.columns = [
        { field: 'selected', width: '50px', headerSelectionValue: this.areAllSelected },
        { field: 'dt',  editable: false, title: "일자", width: this.setPer("divWrapper",25), className: "gridTextCenter"  },
        { field: 'rowStat', editable: false, title: " ", width: 150, cell:"crudCellTemplate", className: "gridTextCenter"},
        { field: 'dtNm', editable: false, title: "요일", width: 100, className: "gridTextCenter"},
        { field: 'chkboxxx', editable: true, title: "chkbox", width: 70, cell: "checkbox" ,className: "gridTextCenter"},
        { field: 'hldyFg', editable: true, title: "구분", width: 150, cell:'hldyFg', className: "gridTextCenter"},
        { field: 'hldyNm', editable: true, title: "휴일명", width: 250, className: "gridTextLeft"}
      ];
    },
    //그리드 데이터 가져오기
    async getGridData() {
      await this.getListReturn({
        apiKey: "common/calendar/search",
        sendParam : {
          yyyymm: Utility.setFormatDate(new Date(),'YYYYMM')
        }
      }).then((res) => {
        this.gridData = res.map((item,i) => {
          const dt = this.$dayjs(item.dt.split(" ")[0]); // YYYY-MM-DD
          const dtNm = dt.format("ddd"); // 요일
          const newItem = {
            ...item,
            dtNm: dtNm,
            dt : Utility.setFormatDate(item.dt, 'YYYY-MM-DD'),
            hldyNm: item.hldyNm ? item.hldyNm : "",
            hldyFg: item.hldyFg == "1" ? "휴일" : "평일",
            rowStat: null,
            selected: false,
            inEdit: true,
            idx: i,
            rowStat: "",
          };
          return newItem;
        });
      })
    },
    //그리드 로우 클릭
    onRowClick (event) {
      console.log("===========onRowClick==============")
      // event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      // event.dataItem["inEdit"] = event.dataItem[this.selectedField];
    },
    //맨앞 checkBox 클릭
    onSelectionchange (event) {
      console.log("===========onSelectionchange==============")
      event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      // event.dataItem["inEdit"] = event.dataItem[this.selectedField];
    },
    //header checkbox 클릭
    onHeaderSelectionChange (event) {
      console.log("===========onHeaderSelectionChange==============")
      let checked = event.event.target.checked;
      this.gridData = this.gridData.map((item) => {
        return { ...item, selected: checked };
      });
    }
  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>