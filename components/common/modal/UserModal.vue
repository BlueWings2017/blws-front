<template>
    <div>
        <v-row class="search-box" align="center" no-gutters>
            <v-col v-if="label" :cols="labelCols">
            <Label>
                <v-icon x-small :color="required ? '#fb8200' : 'primary'" class="mr-1">mdi-record-circle</v-icon>
                {{ label }}
            </Label>
            </v-col>
            <v-col :cols="label ? textCols : ''">
            <KInput :style="{ width: boxWidth}" 
                v-model="textVal"
                class="v-input__custom"
                :readonly="true"
                outlined
                :hide-details="true"
                @focus="visibleDialog = true"></KInput>
            </v-col>
        </v-row>
      <k-dialog
        v-if="visibleDialog"
        :title="$i18n.t('UserRoleMngPage.UserModal.label1')"
        @close="toggleDialog"
      >
        <div style="margin-bottom: 10px;">
            <KInput :style="{ width: boxWidth}" 
                v-model="searchWord"
                :hide-details="true"
                @keyup.enter = "typeEnterKey"></KInput>
        </div>
        <div style="width: 600px;">
        <KendoGrid
            :gridHeight="'300px'"
            :gridItems="gridItems"
            :columns = "columns"
            :sortable="true"
            :resizable="false"
            :selected-field="'selected'"
            @selectionchange="onSelectionChange"
            @headerselectionchange="onHeaderSelectionChange"
            @gridrowclick="onRowClick"
            >
        </KendoGrid>
        </div>
        <dialog-actions-bar>
          <kbutton @click="setUpdate">{{$t('CommLang.btn.submitBtn')}}</kbutton>
          <kbutton @click="toggleDialog">{{$t('CommLang.btn.closeBtn')}}</kbutton>
        </dialog-actions-bar>
      </k-dialog>
    </div>
  </template>
  <script>
    import { mapState, mapMutations, mapActions } from "vuex";
  import { Dialog, DialogActionsBar, Window } from "@progress/kendo-vue-dialogs";
  import { Button } from '@progress/kendo-vue-buttons';
  import { Label } from "@progress/kendo-vue-labels";
  import { Input } from "@progress/kendo-vue-inputs";
  import KendoGrid from "@/components/common/KendoGrid.vue"
  export default {
    components: {
        "k-dialog": Dialog,
        "dialog-actions-bar": DialogActionsBar,
        'kbutton': Button,
        Label,
        KInput: Input,
        KendoGrid
    },
    props: {
    label: {
      type: String,
      require: true
    },
    valueNm: {
      type: String,
      require: true
    },
    disabled: {
      type: Boolean,
      require: false,
      default: false
    },
    labelCols:{
      type: Number,
      require: false,
      default: 4
    },
    textCols:{
      type: Number,
      require: false,
      default: 7
    },
    searchOption:{
      type:Boolean,
      require:false
    },
    required:{
      type:Boolean,
      require:false,
      default:false
    },
    boxWidth:{
        type: String,
        require: false,
        default: '100%'
    },
    dataNm:{
        type: String,
        require: false,
        default: null
    }
    },
    data: function() {
      return {
        visibleDialog: false,
        textVal: null,
        columns: [],
        gridData : [],
        searchWord: null,
        selectedID: 0,
      };
    },
    computed:{
        gridItems() {
            return this.gridData;
        },
        chkVisible(){
            return this.visibleDialog;
        },
        areAllSelected () {
            if(this.gridData.length == 0){
                return false;
            }else{
                return this.gridData.findIndex(item => item.selected === false) === -1;    
            }
            
        },
    },
    watch:{
        async chkVisible(val){
            if(val){
                this.columns = [
                { field: 'selected',    width: '50px',      headerSelectionValue: this.areAllSelected },
                { field: 'userNo',      title: '사용자NO',   width: '150px'},
                { field: 'userLoginId', title: '사용자ID',   width: '150px'},
                { field: 'userNm',      title: '사용자명',   width: '150px'},
                { field: 'deptNm',      title: '부서명',   width: '100px'},
                ],
                await this.getData();
            }
        }
    },
    emit:['input-text-set'],
    methods: {
        ...mapActions({
            postApiReturn: "modules/list/postApiReturn"
        }),
        toggleDialog() {
            this.visibleDialog = !this.visibleDialog;
        },
        async getData() {
            let sendParams = {
                userNm: this.searchWord,
                userNo: '',
                userLoginId: '',
                deptId: ''
            };

            const res = await this.postApiReturn({
                apiKey: "selectUserPop",
                resKey: "userData",
                sendParam: sendParams
            });

            this.gridData = res.map((item,i) => ({
                ...item,
                idx : i,
                selected: false
            }));
        },
        typeEnterKey() {    
            this.getData();

        },
        onRowClick (event) {
            const index = this.gridData.findIndex(p => p.idx === event.dataItem.idx);
            event.dataItem.selected = !event.dataItem.selected;
            this.gridData.splice(index, 1, event.dataItem);
            //event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
        },
        onHeaderSelectionChange (event) {
            let checked = event.event.target.checked;
            this.gridData = this.gridData.map((item) => { return {...item, selected: checked} });
        },
        onSelectionChange (event) {
            const index = this.gridData.findIndex(p => p.idx === event.dataItem.idx);
            event.dataItem.selected = !event.dataItem.selected;
            this.gridData.splice(index, 1, event.dataItem);
            //event.dataItem[this.selectedField] = !event.dataItem[this.selectedField];
        },
        setUpdate(){
            let dataArr = [];
            let dataNm = [];
            var validCheck = true;
            this.gridData.filter(item => {
                if(item.selected){
                    dataArr.push(item.userNo);
                    dataNm.push(item.userNm);
                }
            });
            if(dataArr.length == 0){
                alert("사용자를 선택해주세요.");
                return false;
            }else{
                this.textVal = dataNm.toString();
                this.$emit('input-text-set', this.dataNm, dataArr);
                this.visibleDialog = !this.visibleDialog;
            }
        }
    }
  };
  </script>