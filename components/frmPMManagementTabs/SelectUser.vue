<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="사용자 목록"
      width="70%"
      height="600"
      @close="toggleDialog"
    >
      <v-row no-gutters>
        <v-col :sm="9" :lg="9">
          <div class="form-group-wrap">
            <div class="form-group">
              <label>사용자아이디</label>
              <InputText
                ref="userid"
                :boxWidth="'90%'"
                :dataNm="'userid'"
                :disabled="false"
                @input-text-set="searchInput"
              />
            </div>
            <div class="form-group">
              <label>사용자명</label>
              <InputText
                ref="username"
                :boxWidth="'90%'"
                :dataNm="'username'"
                :disabled="false"
                @input-text-set="searchInput"
              />
            </div>
          </div>
        </v-col>
        <v-col :sm="3" :lg="3" align="right">
          <Button :theme-color="'primary'" :size="'medium'" icon="search" @click="searchBtn">조회</Button>
          <Button :theme-color="'primary'" :size="'medium'" icon="check" :style="{'marginRight': '10px'}" @click="selectRow">선택</Button>
        </v-col>
      </v-row>
      <div ref="divWrapper" style="height: calc(100% - 44px)">
        <KendoGrid 
          ref="rowGrid"
          :gridHeight="gridHeight"
          :gridItems="items"
          :sortable="true"
          :columns="headerParam.gridHeader"
          :resizable="true"
          :edit-field="'inEdit'"
          :selected-field="selectedField"
          :disabledCheckHeaderArr="disabledCheckHeaderArr"
          :isPaging="true"
          :customCell="headerParam.customCell"
          @selectionchange="onSelectionchange"
          @gridrowclick="onRowClick"
          @headerselectionchange="onHeaderSelectionChange"
          @rowdblclick="rowdblclick"
          @sortChangeHandler="sortChangeHandler"
        />
      </div>
    </Dialog>
  </div>
</template>
  <script>
  import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
  import { Button } from "@progress/kendo-vue-buttons";
  import mixinGlobal from "@/mixin/global.js";
  import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
  import KendoGrid from "@/components/common/KendoGrid"
  import InputText from "@/components/common/input/InputText";
  import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
  
  export default { 
    name: "SearchModal",
    mixins: [mixinGlobal, gridHeaderMinin],
    components: {
      Dialog,
      DialogActionsBar,
      Button,
      KendoGrid,
      InputText,
      Card,
      CardBody,
      CardTitle
      

    },
    props:{
      visibleDialog: {
        type: Boolean,
        default: false,
      },
      callBack: {
        type: Function,
        default: () => true
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
            gridid: "dgvUserSearch", // 그리드 ID
            rowStat: "", //rowStat 표시 여부
        },
        disabledCheckHeaderArr: ["CONFIRMFLAG", "ACTIVESTATE"],
        noFirstCheck: true,
        noRowstat: true,
        selectedID: null,
        userid: "",
        username:"",
        roleList: []
      }
    },
    computed: {
      areAllSelected() {
        return this.gridData.findIndex((x) => x.checked === false) === -1 && this.gridData.length !== 0
      },
      items () {
        return this.gridData.map((item) => ({ ...item, selected: item.USERID === this.selectedID }));
      },
    },
    async mounted() {
      await this.getroleList();
      await this.getGridData();
    },
    methods: {
      searchBtn () {
        this.$refs.rowGrid.sortField = [{}];
        this.$refs.rowGrid.skip = 0;
        
        this.getGridData();
      },
      //그리드 데이터 가져오기
      async getGridData() {
        // this.mesGet({
        //   apiKey: "mes/common/getqueryresult",
        //   queryId: "GetUserList",
        //   sendParam: {
        //     plantid: "LS",
        //     processroutetype: "Main",
        //     userid: this.userid
        //   }
        // }).then((res) => {
        //    const data = res.map((x, idx) => {
        //     return {
        //       ...x,
        //       rowStat: "N",
        //       selected: false,
        //       idx: idx,
        //       inEdit: true,
        //       newRow: false
        //     }
        //   });
        //   this.$nuxt.$emit('iccReset')
        //   this.gridOriData = data;
        //   this.gridData = data;
        // })
        // console.log(this.gridData)
        let sendParam = {
          name : this.username,
          userId : this.userid
        }
        let res = await this.getListReturn({
          apiKey: "common/user/search",
          sendParam : sendParam
        });

        const data = res.map((x, idx) => {
          return {
            ...x,
            USERID: x.userId,
            roleId: x.roleId.toString(),
            rowStat: "N",
            selected: false,
            idx: idx,
            inEdit: true,
            newRow: false,
            customCell: {
              roleId: {
                type: 'combo',
                dataItem: this.roleList,
                readonly: true
              }
            }
          };
        });

        this.gridOriData = data;
        this.gridData = data;
      },
      async getroleList(){
        let res = await this.getListReturn({
          apiKey: "common/role/list"
        });

        this.roleList = res.map((x, idx) => {
          return {
            ENUMVALUE: x.roleId,
            ENUMVALUENAME: x.roleNm
          };
        });
      },
      toggleDialog() {
        this.$emit('visibleDialog', !this.visibleDialog)
      },
      //그리드 로우 클릭
      onRowClick (event) {
        this.selectedID = event.dataItem.USERID;
        console.log(this.selectedID)
      },
      //맨앞 checkBox 클릭
      onSelectionchange (event) {
        event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
      },
      //header checkbox 클릭
      onHeaderSelectionChange (event) {
        let checked = event.event.target.checked;
        this.gridData = this.gridData.map((item) => {
          return { ...item, selected: checked };
        });
      },
      //그리드 더블 클릭
      rowdblclick(event){
        this.$emit('workuserid', rerutnData[0]);
        this.$emit('visibleDialog', !this.visibleDialog)
      },
      //row 선택
      selectRow() {
        const rerutnData = this.items.filter(x => x.selected);
        this.$emit('workuserid', rerutnData[0]);
        this.$emit('visibleDialog', !this.visibleDialog)
      },
      searchInput(nm, val){
        this[nm] = val;
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
  </script>