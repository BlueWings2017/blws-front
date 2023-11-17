<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      title="작업조 조회"
      width="40%"
      height="600"
      @close="toggleDialog"
    >

      <v-row ref="searchFilter" no-gutters>
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row class="search-box" align="center" no-gutters>
                <v-col :sm="8" :lg="9">
                  <div class="form-group-wrap">
                    <div class="form-group">
                      <Label>
                        {{$t('UserRoleMngPage.label1')}}
                      </Label>
                      <InputText
                        :searchOption="true"
                        :searchFunc="gridDataSelect"
                        :dataNm="'searchUserNm'"
                        :boxWidth="'90%'"
                        @input-text-set="searchInputValSet"
                      />
                    </div>
                    <div class="form-group">
                      <Label>
                        {{$t('UserRoleMngPage.label2')}}
                      </Label>
                      <InputText
                        :searchOption="true"
                        :searchFunc="gridDataSelect"
                        :dataNm="'searchUserId'"
                        :boxWidth="'90%'"
                        @input-text-set="searchInputValSet"
                      />
                    </div>
                  </div>
                </v-col>
                <v-col :sm="4" :lg="3" align="right">
                  <Button :theme-color="'primary'" icon="search" @click="gridDataSelect" >조회</Button>
                  <Button :theme-color="'primary'" icon="check"  @click="selectRow">선택</Button>
                </v-col>
              </v-row>
            </CardBody>
          </Card>
        </v-col>
      </v-row>

      <v-row ref="contents">
        <v-col :cols="12" :style="{ height: '100%' }">
          <Card ref="gridCard" :style="{ height: '100%' }">
            <CardBody :style="{ width: '100%', height: '100%' }">
              <div ref="divWrapper" :style="{ height: '100%' }">
                <KendoGrid 
                  ref="rowGrid"
                  :gridHeight="gridHeight"
                  :gridItems="gridItems"
                  :sortable="true"
                  :columns="columns"
                  :resizable="false"
                  :isPaging="true"
                  :selected-field="selectedField"
                  @gridrowclick="onRowClick"
                  @rowdblclick="rowdblclick"
                />
              </div>
            </CardBody>
          </Card>
        </v-col>
      </v-row>

    </Dialog>


  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
import moment from "moment";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";

export default { 
  name: "GetUserModal",
  mixins: [mixinGlobal],
  components: {
    Card,
    CardBody,
    CardTitle,
    Dialog,
    DialogActionsBar,
    Button,
    KendoGrid,
    InputText,
    FadeLoader,
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
      selected: 0,
      columns: [],
      selectedField: 'selected',
      selectedID: null,
      selectedData: [],
      gridHeight : '300px',
      gridData : [],
      searchUserId: "",
      searchUserNm: "",
    }
  },
  computed: {
    gridItems() {
      return this.gridData.map((item) => ({ ...item, selected: item.userId === this.selectedID }));
    },
  },
  async mounted() {
    this.gridInit();
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    searchInputValSet(nm, val){
      this[nm] = val;
    },
    gridInit(){
      this.columns = [
        { field: 'name',  editable: false, title: this.$i18n.t('UserRoleMngPage.label1'),   width: this.setPer("divWrapper",45)},
        { field: 'userId',  editable: false, title: this.$i18n.t('UserRoleMngPage.label2'),   width: this.setPer("divWrapper",45)},
      ];
      this.gridDataSelect();
    },
    async gridDataSelect(){
      let sendParam = {
        name : this.searchUserNm,
        userId : this.searchUserId
      }
      let res = await this.getListReturn({
        apiKey: "common/user/search",
        sendParam : sendParam
      });
      res = res.map((item,i)=> {
        const newItem = {
          ...item,
          rowStat: null,
          selected: false,
          idx: i,
          idChangFg : 'N',
          rowStat: ""
        };
        return newItem;
      });
      this.gridData = res;
    },
    //그리드 로우 클릭
    onRowClick (event) {
      this.selectedID = event.dataItem.userId;
      this.selectedData = event.dataItem;
    },
    selectRow() {
      this.$emit('selectUser', this.selectedData);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //그리드 더블 클릭
    rowdblclick(event){
      this.$emit('selectUser', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
  },
};
</script>