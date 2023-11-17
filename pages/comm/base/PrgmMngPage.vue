<template>
  <div>
  <v-row ref="searchFilter">
      <v-col :cols="12">
        <kcard>
          <cardBody>
          <v-row>
            <v-col :cols="4">
              <InputText
                label="프로그램명"
                :searchOption="true"
                :labelCols="4"
                :textCols="8"
                :dataNm="'prgmNm'"
                :boxWidth="'90%'"
                @input-text-set="searchInputValSet"
              />
            </v-col>
            <v-col :cols="4">
                <SelectCommCd
                    :label="'사용여부'"
                    :sendParam="{ commGrpCdId: '112', useFg: '1' }"
                    :addAll="true"
                    :searchOption="true"
                    :boxWidth="'90%'"
                    :dataNm="'useFg'"
                    @comm-cd-set="searchSelectValSet"></SelectCommCd>
            </v-col>
            <v-col :cols="4" class="text-right">
                <kbutton :theme-color="'primary'" @click="search">조회</kbutton>
            </v-col>
          </v-row>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="4">
        <kcard ref="gridCard" :style="{height : '100%'}">
          <cardBody>
            <div class="d-flex align-center justify-space-between pa-2">
            <CardTitle>프로그램 리스트</CardTitle>
            <div>
              <kbutton :theme-color="'primary'" @click="insert">추가</kbutton>
              <kbutton :theme-color="'primary'" @click="remove">삭제</kbutton>
              <kbutton :theme-color="'primary'" @click="rowGridSave">저장</kbutton>
            </div>
          </div>
            <div ref="divWrapper">
            <KendoGrid ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridItems"
                  :sortable="true"
                  :columns = "columns"
                  :resizable="false"
                  :selected-field="selectedField"
                  @gridrowclick="onRowClick">
              </KendoGrid>
            </div>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="8">
        <kcard :style="{height : '100%'}">
          <cardBody :style="{width:'100%'}">
            <CardTitle>프로그램 상세</CardTitle>
                <div>
                    <v-row>
                      <v-col :cols="6">
                        <InputText
                          ref="prgmId"
                          label="프로그램ID"
                          :labelCols="4"
                          :textCols="8"
                          :required="true"
                          :boxWidth="'90%'"
                          :dataNm="'prgmId'"
                          :disabled="true"
                          @input-text-set="formInputValSet"
                        />
                      </v-col>
                      <v-col :cols="6">
                        <InputText
                          ref="prgmNm"
                          label="프로그램명"
                          :labelCols="4"
                          :textCols="8"
                          :required="true"
                          :boxWidth="'90%'"
                          :dataNm="'prgmNm'"
                          @input-text-set="formInputValSet"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col :cols="6">
                        <v-row>
                        <v-col :cols="4">
                          <Label>
                            <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                            프로그램구분
                          </Label>
                        </v-col>
                        <v-col :cols="8">
                        <DropDownList ref="prgmTpCd"
                                      :style="{ width: '90%'}" 
                                      :data-items= "prgmTpCdList"
                                      :default-value="'프로그램'"
                                      :value="prgmTpCd"
                                      :rounded="'large'"
                                      :text-field="'text'"
                                      :fill-mode="'outline'"
                                      @change="formSelectValSet"
                                      >
                        </DropDownList>
                      </v-col>
                    </v-row>
                      </v-col>
                      <v-col :cols="6">
                        <Checkbox
                          ref="useFg"
                          :label="'사용여부'"
                          :required="true"
                          :dataNm="'useFg'"
                          :labelCols="4"
                          :textCols="8"
                          @checkbox-set="formCheckValSet"
                          ></Checkbox>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col :cols="12">
                        <InputText
                          ref="url"
                          label="프로그램URL"
                          :labelCols="2"
                          :textCols="10"
                          :required="true"
                          :boxWidth="'95%'"
                          :dataNm="'url'"
                          @input-text-set="formInputValSet"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col :cols="6">
                        <InputText
                          ref="regUserNo"
                          label="등록자NO"
                          :labelCols="4"
                          :textCols="8"
                          :boxWidth="'90%'"
                          :dataNm="'regUserNo'"
                          :disabled="true"
                          @input-text-set="formInputValSet"
                        />
                      </v-col>
                      <v-col :cols="6">
                        <InputText
                          ref="regDttm"
                          label="등록일시"
                          :labelCols="4"
                          :textCols="8"
                          :boxWidth="'90%'"
                          :dataNm="'regDttm'"
                          :disabled="true"
                          @input-text-set="formInputValSet"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col :cols="6">
                        <InputText
                          ref="procUserNo"
                          label="수정자NO"
                          :labelCols="4"
                          :textCols="8"
                          :boxWidth="'90%'"
                          :dataNm="'procUserNo'"
                          :disabled="true"
                          @input-text-set="formInputValSet"
                        />
                      </v-col>
                      <v-col :cols="6">
                        <InputText
                          ref="procDttm"
                          label="수정일시"
                          :labelCols="4"
                          :textCols="8"
                          :boxWidth="'90%'"
                          :dataNm="'procDttm'"
                          :disabled="true"
                          @input-text-set="formInputValSet"
                        />
                      </v-col>
                    </v-row>
                  </div>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";
import SelectCommCd from "@/components/common/search/SelectCommCd.vue"
import InputText from "@/components/common/input/InputText";
import { Card, CardBody, CardTitle, CardActions } from "@progress/kendo-vue-layout";
import KendoGrid from "@/components/common/KendoGrid.vue"
import { Button } from "@progress/kendo-vue-buttons";
import Checkbox from "@/components/common/input/Checkbox";
import { DropDownList } from '@progress/kendo-vue-dropdowns';
  import { Label } from "@progress/kendo-vue-labels";
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
    menuId: myMenuId,
    closable: true
  },
  components: {
    SelectCommCd,
    InputText,
    CardBody, 
    CardTitle, 
    CardActions,
    KendoGrid,
    "kbutton": Button,
    "kcard" : Card,
    Utility,
    Checkbox,
    DropDownList,
    Label
  },
  data() {
    return {
      roleNm : null,
      roleId : null,
      useFg : null,
      selected: 0,
      columns: [],
      selectedField: 'selected',
      selectedID: 0,
      selectedData: [],
      gridHeight : '0px',
      gridData : [],
      prgmTpCd: null,
      prgmTpCdList: [{ text: "프로그램", id: "1" },{ text: "팝업", id: "2" }]
    };
  },
  computed: {
    gridItems() {
      return this.gridData.map((item) => ({
        ...item,
        selected: item.idx === this.selectedID,
      }));
    },
  },
  watch: {
  },
  beforeCreate() {
  },
  mounted(){
    this.gridHeight = (this.$refs.contents.offsetHeight - 90) +'px';
    this.gridInit();
  },
  methods: {
    search(){
      this.gridDataSelect();
    },
    searchInputValSet(nm, val){
      this[nm] = val;
      this.search();
    },
    searchSelectValSet(nm,txt, val){
      this[nm] = val;
      this.search();
    },
    formInputValSet(nm, val){
      this.selectedData[nm] = val;
      const index = this.gridData.findIndex(p => p.idx === this.selectedData.idx);
      if(this.selectedData.rowStat == ''){
        this.selectedData.rowStat = "U";
      }
      this.gridData.splice(index, 1, this.selectedData);
    },
    formSelectValSet(event){
      this.prgmTpCd = {text: event.value.text, id:event.value.id}
      this.selectedData.prgmTpCd = event.value.id;
      this.selectedData.prgmTpCdNm = event.value.text;
      const index = this.gridData.findIndex(p => p.idx === this.selectedData.idx);
      if(this.selectedData.rowStat == ''){
        this.selectedData.rowStat = "U";
      }
      this.gridData.splice(index, 1, this.selectedData);
    },
    formCheckValSet(nm, val){
      this.selectedData[nm] = val?"사용":"사용안함";
      const index = this.gridData.findIndex(p => p.idx === this.selectedData.idx);
      if(this.selectedData.rowStat == ''){
        this.selectedData.rowStat = "U";
      }
      this.gridData.splice(index, 1, this.selectedData);
    },
    gridInit(){
      this.columns = [
        { field: 'prgmId',  editable: false, title: '프로그램ID', width: this.setPer("divWrapper",25), cell:"crudCellTemplate"},
        { field: 'prgmNm', editable: false, title: '프로그램명',   width: this.setPer("divWrapper",25)},
        { field: 'prgmTpCdNm', editable: false, title: '타입', width: this.setPer("divWrapper",25)},
        { field: 'useFg', editable: false, title: '사용여부', width: this.setPer("divWrapper",25)}
      ];
      this.gridDataSelect();
    },
    async gridDataSelect(){
      let res = await this.postApiReturn({
        apiKey: "selectPrgm",
        resKey: "prgmData",
        sendParam: {
          useFg: this.useFg,
          prgmNm: this.prgmNm
        }
      });
      res = res.map((item,i)=> {
        const newItem = {
          ...item,
          rowStat: null,
          selected: i === this.selectedID,
          idx: i,
          useFg : item.useFg == "1" ? "사용" : "사용안함",
          rowStat: ""
        };
        return newItem;
      });
      this.gridData = res;
      if(this.gridData.length > 0);
      this.onRowClick({dataItem : this.gridData[0]});
    },
    async onRowClick(event){
      if(event.dataItem){
        this.selectedID = event.dataItem.idx;
        this.selectedData = event.dataItem;
        this.$refs['prgmId'].textVal = event.dataItem.prgmId;
        this.$refs['prgmNm'].textVal = event.dataItem.prgmNm;
        this.$refs['url'].textVal = event.dataItem.url;
        this.$refs['useFg'].chkValue = event.dataItem.useFg == "사용" ? true : false ;
        this.prgmTpCdList.filter((item,i) => {
          if(item.id == event.dataItem.prgmTpCd){
            this.prgmTpCd = item;
          }
        })
        this.$refs['regUserNo'].textVal = event.dataItem.regUserNo;
        this.$refs['regDttm'].textVal = event.dataItem.regDttm;
        this.$refs['procUserNo'].textVal = event.dataItem.procUserNo;
        this.$refs['procDttm'].textVal = event.dataItem.procDttm;
      }
    },
    insert() {
      this.selectedID = "";
      const newRecord = { rowStat:"I", idx:this.gridData.length+1,
      childeVo: [],
      prgmId : "",
      prgmNm : "",
      prgmTpCd : "1",
      prgmTpCdNm : "프로그램",
      procDttm : "",
      procUserNo : "",
      regDttm : "",
      regUserNo : "",
      session : "",
      useFg:"사용",
      url : "",
      };
      const data = this.gridData.slice();
      data.unshift(newRecord);
      this.gridData = data;
      this.onRowClick({dataItem : newRecord});
    },
    remove(){
      const index = this.gridData.findIndex(p => p.idx === this.selectedData.idx);
      this.selectedData.rowStat = "D";
      this.gridData.splice(index, 1, this.selectedData);
    },
    async rowGridSave(){
      let dataArr = [];
      var validCheck = true;
      this.gridData.filter(item => {
        if(item.rowStat == "I" || item.rowStat == "U" || item.rowStat == "D"){
          dataArr.push(item);
        }
      });

      dataArr.filter(item =>{
        if(item.rowStat !== "D"){
          if(item.prgmNm == "" || item.url == "" || item.prgmTpCd == "" ){
            alert("필수 입력값을 입력해주세요.");
            validCheck = false;
          }
        }
      });
      
      if(validCheck){
        if (dataArr.length > 0) {
          const sendParam = {
              datas: {
                dsPrgm: dataArr.map(item => ({
                  ...item,
                  useFg: item.useFg == "사용" ? "1" : "0"
                }))
              },
              params: {}
          };
          await this.postUpdateApi({
            apiKey: "savePrgm",
            sendParam: sendParam
          });
          this.gridDataSelect();
        } else {
          alert("저장할 내용이 없습니다.");
        }
      }
    },
  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>