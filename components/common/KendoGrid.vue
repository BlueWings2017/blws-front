<template>
  <div :style="{height : '100%'}">
    <Tooltip
      style="height: 100%;"
      :position="'top'"
      :anchor-element="'target'"
      :filter="filterElements"
    >
      <Grid 
        style="height: 100%;"
        :data-items="items"
        :columns = "columns"
        :resizable="true"
        :sortable="sortable"
        :skip="skip"
        :take="take"
        :total="gridItems ? gridItems.length : 0"
        :pageable="pageable"
        :page-size="pageSize"
        :selected-field="selectedField"
        :edit-field="'inEdit'"
        :rowHeight="37"
        :sort="sortField"
        :loader="loader"
        :toolbar="['create']"
        @rowclick="rowSelected"
        @itemchange="rowItemChange"
        @selectionchange="onSelectionChange"
        @headerselectionchange="onHeaderSelectionChange"
        @rowdblclick="rowdblclick"
        @cellclick="cellClick"
        @pagechange="pageChangeHandler"
        @sortchange="sortChangeHandler"
      >
        <template v-slot:crudCellTemplate="{props}">
          <td>
            <Button v-if="getRowStatClass(props.dataItem[props.field]) !== ''" :class="getRowStatClass(props.dataItem[props.field])"></Button>
          </td>
        </template>
        <template v-slot:datePicker="{props}">
          <td>
            <div class="form-datepicker">
              <DatePicker
                v-if="chkboxBol"
                :value="new Date(props.dataItem[props.field])"
                :format="'yyyy-MM-dd'"
                @change="(e) => rowDdChange(e, props.field, props.dataItem)"
              />
            </div>
          </td>
        </template>
        <template v-slot:[gridDropDownList[idx].dataVal]="{ props }" v-for="(item,idx) in gridDropDownList">
          <td v-if="!props.dataItem.inEdit" :class="'String'">{{ props.dataItem[item.dataVal] }}</td>
          <td v-else :class="props.className">
            <DropDownList
              :rounded="'large'"
              :data-items="item.dataItem"
              :data-item-key="'ENUMVALUE'"
              :text-field="'ENUMVALUENAME'"
              :value-field="'ENUMVALUE'"
              :value-primitive="true"
              :disabled="item.disable"
              :value="props.dataItem[item.dataVal]"
              @change="(e) => rowDdChange(e, props.field, props.dataItem)"
            ></DropDownList>
          </td>
        </template>
        
        <template v-slot:[changeCell[idx].cellName]="{ props }" v-for="(item,idx) in changeCell">
          <td v-if="props.dataItem.changeCellType === 'combo'" :class="props.className">
            <DropDownList
              :rounded="'large'"
              :data-items="props.dataItem.changeCellDataItem === undefined ? item.dataItem : props.dataItem.changeCellDataItem"
              :data-item-key="'ENUMVALUE'"
              :text-field="'ENUMVALUENAME'"
              :value-field="'ENUMVALUE'"
              :value-primitive="true"
              :disabled="props.dataItem.disable ? item.disable : false"
              :value="props.dataItem[item.cellName]"
              @change="(e) => rowDdChange(e, props.field, props.dataItem)"
            ></DropDownList>
          </td>
          
          <td v-else-if="props.dataItem.changeCellType === 'button'" :class="props.className">
            <Button
              @click="e => gridButtonClick(e, props.field, props.dataItem)"
            >
              {{props.dataItem[item.cellName]}}
            </Button>
          </td>
          <td v-else-if="props.dataItem.changeCellType === 'input'" :class="props.className">
            <Input 
              v-if="chkboxBol"
              v-model="props.dataItem[item.cellName]"
              @change="e => rowDdChange(e, props.field, props.dataItem)"
            />
          </td>
          <td v-else :class="props.className">
            {{props.dataItem[item.cellName]}}
          </td>
        </template>

        <template v-slot:[customCell[idx]]="{ props }" v-for="(item,idx) in customCell">
          <td v-if="props.dataItem.customCell[item].type === 'combo'" :class="props.className">
            <DropDownList
              :class="props.dataItem.customCell[item].readonly ? 'k-readonly' : ''"
              :rounded="'large'"
              :data-items="props.dataItem.customCell[item].dataItem"
              :data-item-key="'ENUMVALUE'"
              :text-field="'ENUMVALUENAME'"
              :value-field="'ENUMVALUE'"
              :value-primitive="true"
              :disabled="props.dataItem.customCell[item].disable"
              :value="props.dataItem[item]"
              @change="(e) => {
                if (!props.dataItem.customCell[item].readonly) {
                  rowDdChange(e, props.field, props.dataItem);
                }
              }"
            ></DropDownList>
          </td>
          <td v-else-if="props.dataItem.customCell[item].type === 'date'" :class="props.className">
            <div class="form-datepicker">
              <DatePicker
                :class="props.dataItem.customCell[item].readonly ? 'k-readonly' : ''"
                :value="new Date(props.dataItem[props.field])"
                :format="'yyyy-MM-dd'"
                @change="(e) => {
                  if (!props.dataItem.customCell[item].readonly) {
                    rowDdChange(e, props.field, props.dataItem);
                  }
                }"
              />
            </div>
          </td>
          <td v-else-if="props.dataItem.customCell[item].type === 'button'" :class="props.className">
            <Button v-if="props.dataItem[item] !== undefined && props.dataItem[item] !== null && props.dataItem[item] !== ''"
              :disabled="props.dataItem.customCell[item].disable"
              @click="e => gridButtonClick(e, props.field, props.dataItem)"
            >
              {{props.dataItem[item]}}
            </Button>
          </td>
          <td v-else-if="props.dataItem.customCell[item].type === 'input'" :class="props.className">
            <Input 
              v-if="chkboxBol"
              v-model="props.dataItem[item]"
              :class="props.dataItem.customCell[item].readonly ? 'k-readonly' : ''"
              :disabled="props.dataItem.customCell[item].disable"
              :readonly="props.dataItem.customCell[item].readonly"
              @change="e => rowDdChange(e, props.field, props.dataItem)"
            />
          </td>
          <td v-else :class="props.className">
            {{props.dataItem[item]}}
          </td>
        </template>

        <template v-slot:PRIMARYKEYFLAG="{props}">
          <td v-if="!props.dataItem.newRow || pkNotEditArr.includes(props.field)" :class="props.className">
            {{props.dataItem[props.field]}}
          </td>
          <td v-else-if="props.dataItem[props.field] === undefined" :class="props.className">
            <Input 
              v-if="chkboxBol"
              v-model="tempObj[props.dataItem.newRowUUid+props.field]"
              @change="e => rowDdChange(e, props.field, props.dataItem)"
            />
          </td>
          <td v-else :class="props.className">
            <Input 
              v-if="chkboxBol"
              v-model="props.dataItem[props.field]"
              @change="e => rowDdChange(e, props.field, props.dataItem)"
            />
          </td>
        </template>

        <template v-slot:[checkHeaderArr[idx]]="{ props }" v-for="(item,idx) in checkHeaderArr">
          <td v-if="chkboxBol" :class="props.className">
            <Checkbox 
              :class="props.className"
              :value="props.dataItem[item] === 'Yes' || props.dataItem[item] === 'Active'"
              @change="e => rowDdChange(e, props.field, props.dataItem)"
              :disabled="props.dataItem.disabled"
            />
          </td>
        </template>

        <template v-slot:[disabledCheckHeaderArr[idx]]="{ props }" v-for="(item,idx) in disabledCheckHeaderArr">
          <td v-if="chkboxBol" :class="props.className">
            <Checkbox 
              :class="props.className"
              :value="props.dataItem[item] === 'Yes' || props.dataItem[item] === 'Active'"
              :disabled="true"
            />
          </td>
        </template>

        <template v-slot:Button="{props}" >
          <td :class="props.className">
            <Button v-if="props.dataItem[props.field] !== undefined && props.dataItem[props.field] !== null && props.dataItem[props.field] !== ''"
              @click="e => gridButtonClick(e, props.field, props.dataItem)"
            >
              {{props.dataItem[props.field]}}
            </Button>
          </td>
        </template>

        <template v-slot:ACTIONBUTTON="{props}" >
          <td :class="props.className">
            <Button
              v-if="!!props.dataItem['ACTIONBUTTON']"
              @click="e => gridButtonClick(e, props.field, props.dataItem)"
            >
              {{props.dataItem['ACTIONBUTTON']}}
            </Button>
            <div
              v-if="!props.dataItem['ACTIONBUTTON']"
            >{{props.dataItem['ACTIONBUTTON']}}</div>
          </td>
        </template>
        
        <template v-slot:searchBtn="{props}">
          <td :class="props.className">
            <v-row>
              <v-col cols="9">
                <Input 
                  v-if="chkboxBol"
                  v-model="props.dataItem[props.field]"
                  :readonly = "true"
                />
              </v-col>
              <v-col cols="3">
                <Button
                  v-if="props.dataItem.change"
                  @click="e => gridButtonClick(e, props.field, props.dataItem)"
                >
                  검색
                </Button>
              </v-col>
            </v-row>
          </td>
        </template>

      </Grid>

    </Tooltip>
  </div>
</template>
<script>
import { Grid } from '@progress/kendo-vue-grid'
import { mapState, mapMutations } from "vuex";
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { Checkbox } from "@progress/kendo-vue-inputs";
import { Button } from "@progress/kendo-vue-buttons";
import { Input } from '@progress/kendo-vue-inputs';
import { DatePicker } from "@progress/kendo-vue-dateinputs";
import { Tooltip } from '@progress/kendo-vue-tooltip';

export default {
  name:"kendoG",
  components: {
    Grid,
    DropDownList,
    Checkbox,
    Button,
    Input,
    DatePicker,
    Tooltip
  },
  props: {
    columns: {
      type: Array,
      require: false,
      default: () => {
        return [];
      }
    },
    gridDropDownList:{
      type: Array,
      require: false,
      default: () =>{
        return [];
      }
    },
    selectedField: {
      type: String,
      require: false,
      default : null
    },
    gridItems: {
      type: Array,
      require: false,
      default: () => {
        return [];
      }   
    },
    gridData: {
      type: Array,
      require: false,
      default: () => {
        return [];
      }   
    },
    sortable:{
      type: Boolean,
      require: false,
      default : false
    },
    resizable:{
      type: Boolean,
      require: false,
      default : false
    },
    gridIdx:{
      type: Number,
      default: 0 
    },
    checkHeaderArr:{
      type: Array,
      default: () => {
        return [];
      }
    },
    disabledCheckHeaderArr:{
      type: Array,
      default: () => {
        return [];
      }
    },
    changeCell: {
      type: Array,
      default: () => {
        return []
      }
    },
    customCell: {
      type: Array,
      default: () => {
        return []
      }
    },
    // sortField: {
    //   type: Array,
    //   default: () => {
    //     return []
    //   }
    // },
    isPaging:{
      type: Boolean,
      require: false,
      default : false
    },
    reSetPage:{
      type: Boolean,
      require: false,
      default : false
    },
    pkNotEditArr: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  created(){
    //input,check,combo 가 새로만들어지는 항목에 복사되는 현상이있어
    //newRow 으로 만들어지는경우 reRendering
    this.$nuxt.$on('iccReset', () => {
      this.chkboxBol = false;
      this.$nextTick(() => {
        this.chkboxBol = true;
      })
    });
  },
  computed: {
    ...mapState({
      drawer: state => state.drawer,
      activeMenuId(state) {
        if(state.activeMenuInfo)
        return state.activeMenuInfo.menuId;
      }
    }),
    pageable() {
      if(this.isPaging) {
        return {
          buttonCount: this.pagerButtons,
          info: this.pagerInfo,
          type: this.pagerType,
          pageSizes: this.pagerSizes ? [10, 15, 20, 'all'] : undefined,
          previousNext: this.pagePrevNext,
          pageSizeValue: this.pageSizeValue,
        };
      }
      else {
        return undefined;
      }
      
    },
    items: {
      get: function () {
        if(this.isPaging) {
          if(this.reSetPage) {
            this.skip = 0;
          }
          return this.gridItems.slice(this.skip, this.take + this.skip);
        }
        else {
          return this.gridItems;
        }
      },
    },
  },
  watch:{
    activeMenuId(val) {
      if(val){
        const _this = this;
        setTimeout(() => {
          _this.scrollBody.scrollTop = _this.gridScrollTop;
          _this.scrollBody.scrollLeft = _this.gridScrollLeft
        }, 700);
      }
    },
    // vmodelReset(newVal, oldVal){
    //   console.log(newVal)
    //   console.log(oldVal)
    // }
  },
  data(){
    return{
      scrollBody: null,
      gridScrollTop: 0,
      gridScrollLeft: 0,
      test: "",
      tempObj: {},
      chkboxBol: true,
      loader: false,
      pagerType: 'numeric',
      pagerButtons: 5,
      pagerInfo: true,
      pagerSizes: true,
      pagePrevNext: true,
      skip: 0,
      take: 10,
      pageSize: 10,
      pageSizeValue: 10,
      sortField: []
    }
  },
  async mounted() {
    this.scrollBody = document.getElementsByClassName("k-virtual-content")[this.gridIdx];
    this.scrollBody.addEventListener("scroll", e => {
      this.gridScrollTop = e.target.scrollTop;
      this.gridScrollLeft = e.target.scrollLeft;
    });
  },
  methods:{
    filterElements(e) {
      if (e.className.includes('k-column-title') || e.tagName === 'TD') {
        $(e).attr('title', e.textContent);
        return true;
      }
      return false;
    },
    cellBackground (dataItem){
      if(dataItem.rowStat == "C"){
        return {"background-color" : "rgb(253, 253, 13, 0.32)"}
      }else if(dataItem.rowStat == "U"){
        return {"background-color" : "rgb(55, 180, 0,0.32)"}
      }else if(dataItem.rowStat == "D"){
        return {"background-color" : "rgb(243, 23, 0, 0.32)"}
      }
    },
    getRowStatClass (rowStat){
      if(rowStat === "C"){
        return "k-button-solid-new";
      }else if(rowStat === "U"){
        return "k-button-solid-modify";
      }else if(rowStat === "D"){
        return "k-button-solid-delete";
      }else {
        return "";
      }
    },
    rowSelected(event){
      //인풋 또는 버튼이 아닌경우 셀 클릭 처리
      if(!(event.event.target.className.includes('input') || event.event.target.className.includes('button'))) {
        this.$emit('gridrowclick', event)
      }
    },
    rowItemChange(event){
      this.$emit('griditemchange', event)
    },
    rowDdChange(e, name, dataItem) {
      this.$emit('gridddchang', e, name, dataItem)
    },
    onSelectionChange(event){
      this.$emit('selectionchange', event)
    },
    onHeaderSelectionChange(event){
      this.$emit('headerselectionchange', event)
    },
    sortChangeHandler(e) {
      this.sortField = e.sort;
      this.$emit('sortChangeHandler', e)
    },
    rowdblclick(event) {
      this.$emit('rowdblclick', event);
    },
    cellClick(event) {
      this.$emit('cellClick', event);
    },
    gridButtonClick(e, field, dataItem) {
      this.$emit('gridButtonClick', e, field, dataItem);
    },
    pageChangeHandler(event) {
      this.loader = true;
      // The idea behind using the following setTimeout method is to
      // demonstrate how we can show a loader while fetching data.
      // In a real-life scenarios with remote data binding, the 'loader'
      // property should be updated before making a server request
      // and after the request completes.
      setTimeout(() => {
        this.loader = false;
        this.skip = event.page.skip;
        this.take = event.event.value === 'all' ? 99999999 : event.page.take;
        this.pageSizeValue = event.event.value;
        this.$emit('notPageReset',false);
        this.$emit('pageChangeEvent',this.skip); // 페이지 이동시 첫번째행 Data 조회시 사용
        this.$nuxt.$emit('iccReset');
      }, 300);
    },
  }
}
</script>