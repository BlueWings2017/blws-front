<template>
  <div>
  <v-row ref="searchFilter">
      <v-col :cols="12">
        <kcard>
          <cardBody>
          <v-row>
            <v-col :cols="4">
              <v-row class="search-box" align="center" no-gutters>
                <v-col :cols="4">
                  <Label>
                    <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                    {{$t('UserRoleMngPage.label1')}}
                  </Label>
                </v-col>
                <v-col :cols="8">
                  <InputText
                    :searchOption="true"
                    :dataNm="'searchUserNm'"
                    :boxWidth="'90%'"
                    @input-text-set="searchInputValSet"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="4">
              <v-row class="search-box" align="center" no-gutters>
                <v-col :cols="4">
                  <Label>
                    <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                    {{$t('UserRoleMngPage.label2')}}
                  </Label>
                </v-col>
                <v-col :cols="8">
                  <InputText
                    :searchOption="true"
                    :dataNm="'searchUserId'"
                    :boxWidth="'90%'"
                    @input-text-set="searchInputValSet"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col :cols="4" class="text-right">
                <kbutton :theme-color="'primary'" @click="search">{{$t('CommLang.btn.selectBtn')}}</kbutton>
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
            <CardTitle>{{$t('UserRoleMngPage.label3')}}</CardTitle>
            <div>
              <kbutton :theme-color="'primary'" @click="insert">{{$t('CommLang.btn.addBtn')}}</kbutton>
              <kbutton :theme-color="'primary'" @click="remove">{{$t('CommLang.btn.removeBtn')}}</kbutton>
              <kbutton :theme-color="'primary'" @click="rowGridSave">{{$t('CommLang.btn.saveBtn')}}</kbutton>
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
            <CardTitle>{{$t('UserRoleMngPage.label8')}}</CardTitle>
                <div>
                    <v-row>
                      <v-col :cols="4">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="6">
                            <Label>
                              <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('UserRoleMngPage.label2')}}
                            </Label>
                          </v-col>
                          <v-col :cols="6">
                            <InputText
                              ref="userId"
                              :required="true"
                              :boxWidth="'90%'"
                              :dataNm="'userId'"
                              @input-text-set="formInputValSet"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col :cols="2">
                        <kbutton ref="userIdChkBtn"
                        :disabled="idChangFg =='Y' ? false : true"
                        :theme-color="'primary'" @click="userIdChk">{{$t('UserRoleMngPage.label5')}}</kbutton>
                      </v-col>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('UserRoleMngPage.label4')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <InputText
                              :type="'password'"
                              ref="password"
                              :boxWidth="'90%'"
                              :dataNm="'password'"
                              @input-text-set="formInputValSet"
                            ></InputText>
                          </v-col>
                        </v-row>
                      </v-col>
                      </v-row>
                      <v-row>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'#fb8200'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('UserRoleMngPage.label1')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <InputText
                              ref="name"
                              :boxWidth="'90%'"
                              :dataNm="'name'"
                              @input-text-set="formInputValSet"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('UserRoleMngPage.label3')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <DropDownList
                              ref="role"
                              :style="{ width: '90%' }"
                              v-model="role"
                              :value-primitive="true"
                              :text-field="'roleNm'"
                              :value-field="'roleId'"
                              :data-items="roleListList"
                              @change="formInputValSet('roleId', role)"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('UserRoleMngPage.label6')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <InputText
                              ref="email"
                              :boxWidth="'90%'"
                              :dataNm="'email'"
                              @input-text-set="formInputValSet"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('UserRoleMngPage.label7')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <InputText
                              ref="phoneNumber"
                              :dataNm="'phoneNumber'"
                              :boxWidth="'90%'"
                              @input-text-set="formInputValSet"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('CommLang.label.label2')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <InputText
                              ref="createdBy"
                              :boxWidth="'90%'"
                              :dataNm="'createdBy'"
                              :disabled="true"
                              @input-text-set="formInputValSet"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('CommLang.label.label3')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <InputText
                              ref="createdDate"
                              :boxWidth="'90%'"
                              :dataNm="'createdDate'"
                              :disabled="true"
                              @input-text-set="formInputValSet"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('CommLang.label.label4')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <InputText
                              ref="lastModifiedBy"
                              :boxWidth="'90%'"
                              :dataNm="'lastModifiedBy'"
                              :disabled="true"
                              @input-text-set="formInputValSet"
                            />
                          </v-col>
                        </v-row>
                      </v-col>
                      <v-col :cols="6">
                        <v-row class="search-box" align="center" no-gutters>
                          <v-col :cols="4">
                            <Label>
                              <v-icon x-small :color="'primary'" class="mr-1">mdi-record-circle</v-icon>
                              {{$t('CommLang.label.label5')}}
                            </Label>
                          </v-col>
                          <v-col :cols="8">
                            <InputText
                              ref="lastModifiedDate"
                              :boxWidth="'90%'"
                              :dataNm="'lastModifiedDate'"
                              :disabled="true"
                              @input-text-set="formInputValSet"
                            />
                          </v-col>
                        </v-row>
                      </v-col>


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
import SelectCommCd from "@/components/common/search/SelectCommCd.vue"
import InputText from "@/components/common/input/InputText";
import { Card, CardBody, CardTitle, CardActions } from "@progress/kendo-vue-layout";
import KendoGrid from "@/components/common/KendoGrid.vue"
import { Button } from "@progress/kendo-vue-buttons";
import Checkbox from "@/components/common/input/Checkbox";
import { DropDownList } from '@progress/kendo-vue-dropdowns';

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
    DropDownList
  },
  data() {
    return {
      searchPhoneNumber : null,
      searchUserNm : null,
      // useFg : null,
      selected: 0,
      columns: [],
      selectedField: 'selected',
      selectedID: 0,
      selectedData: [],
      gridHeight : '0px',
      gridData : [],
      idChangFg : 'N',
      roleListList: [],
      role: {},
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
    this.getroleListList();
  },
  methods: {
    search(){
      this.gridDataSelect();
    },
    async getroleListList(){
      let res = await this.getListReturn({
        apiKey: "common/role/list"
      });
      this.roleListList = res
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
      if(nm == 'userId'){
        this.selectedData.idChangFg = 'Y';
        this.idChangFg = 'Y'
      }
      if(this.selectedData.rowStat == ''){
        this.selectedData.rowStat = "U";
      }
      this.gridData.splice(index, 1, this.selectedData);
    },
    formSelectValSet(nm,txtNm, val, txt){
      this.selectedData[nm] = val;
      this.selectedData[txtNm] = txt;
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
        { field: 'id',      editable: false, title: this.$i18n.t('UserRoleMngPage.label9'), width: this.setPer("divWrapper",20), cell:"crudCellTemplate"},
        { field: 'userId',  editable: false, title: this.$i18n.t('UserRoleMngPage.label2'),   width: this.setPer("divWrapper",39)},
        { field: 'name',  editable: false, title: this.$i18n.t('UserRoleMngPage.label1'),   width: this.setPer("divWrapper",39)},
        // { field: 'role',  editable: false, title: this.$i18n.t('UserRoleMngPage.label3'),   width: this.setPer("divWrapper",39)},
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
          selected: i === this.selectedID,
          idx: i,
          idChangFg : 'N',
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
        this.$refs['userId'].textVal = event.dataItem.userId;
        this.$refs['name'].textVal = event.dataItem.name;
        this.$refs['email'].textVal = event.dataItem.email;
        this.$refs['phoneNumber'].textVal = event.dataItem.phoneNumber;
        this.$refs['password'].textVal = "";

        this.$refs['createdBy'].textVal = event.dataItem.createdBy;
        this.$refs['createdDate'].textVal = event.dataItem.createdDate;
        this.$refs['lastModifiedBy'].textVal = event.dataItem.lastModifiedBy;
        this.$refs['lastModifiedDate'].textVal = event.dataItem.lastModifiedDate;
        this.idChangFg = event.dataItem.idChangFg;
        this.role = this.roleListList.filter(x => x.roleId == event.dataItem.roleId)[0]
      }
    },
    insert() {
      this.selectedID = "";
      const newRecord = { id:"", userId:"", name:"", email:"",phoneNumber:"", password:"",idChangFg:"Y", rowStat:"I", idx:this.gridData.length+1, roleId: "1" };
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
      let insertDataArr = [];
      let updateDataArr = [];
      let deleteDataArr = [];
      var validCheck = true;
      this.gridData.filter(item => {
        if(item.rowStat == "I" || item.rowStat == "U"){
          dataArr.push(item);
        }
        if(item.rowStat == "I"){
          insertDataArr.push(item);
        }
        if(item.rowStat == "U"){
          updateDataArr.push(item);
        }
        if(item.rowStat == "D"){
          deleteDataArr.push(item);
        }
      });

      dataArr.filter(item =>{
          if(item.idChangFg == 'Y'){
            this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');
            this.$refs['alertPop'].message = this.$i18n.t('UserRoleMngPage.msg1');
            this.$refs['alertPop'].modalWidth = "300px";
            this.$refs['alertPop'].visibleDialog = true;
            validCheck = false;
            return false;
          }
          if(item.userId == "" || item.name == "" || (item.rowStat == 'I' && item.password=="")){
            this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');
            this.$refs['alertPop'].message = this.$i18n.t('CommLang.message.msg2');
            this.$refs['alertPop'].modalWidth = "300px";
            this.$refs['alertPop'].visibleDialog = true;
            validCheck = false;
          }
      });
      if(validCheck){
        if (insertDataArr.length > 0) {
          await this.postInsertReturn({
            apiKey: "common/user",
            sendParam: insertDataArr
          });
        }

        if (updateDataArr.length > 0) {
          await this.putUpdateReturn({
            apiKey: "common/user",
            sendParam: updateDataArr
          });
        }

        if (deleteDataArr.length > 0) {
          await this.deleteDeleteReturn({
            apiKey: "common/user",
            sendParam: deleteDataArr
          });
        }
        this.search();
      }
    },
    async userIdChk(){
      let sendParam = {
        userId : this.selectedData.userId
      }
      let res = await this.getListReturn({
        apiKey: "common/user/info",
        sendParam : sendParam
      });
      
      if(res.userId){
        this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');
        this.$refs['alertPop'].message = this.$i18n.t('UserRoleMngPage.msg2');
        this.$refs['alertPop'].modalWidth = "300px";
        this.$refs['alertPop'].visibleDialog = true;
      }else{
        this.$refs['alertPop'].title = this.$i18n.t('CommLang.label.label6');
        this.$refs['alertPop'].message = this.$i18n.t('UserRoleMngPage.msg3');
        this.$refs['alertPop'].modalWidth = "300px";
        this.$refs['alertPop'].visibleDialog = true;

        const index = this.gridData.findIndex(p => p.idx === this.selectedData.idx);
        this.selectedData.idChangFg = 'N';
        this.idChangFg = 'N'
        this.gridData.splice(index, 1, this.selectedData);
      }
    }
  }
};

const defaultData = {
};
</script>
<style lang="scss">

</style>