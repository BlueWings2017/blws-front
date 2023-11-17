<template>
  <div>
    <span v-if="!visibleDialog">
      <Button @click="toggleDialog">Open Dialog</Button>
    </span>
    <Dialog
      v-if="visibleDialog"
      :title="title"
      width="50%"
      height="600"
      @close="toggleDialog"
    > 
      <v-row ref="searchFilter" no-gutters>
        <v-col :cols="12">
          <Card>
            <CardBody>
              <v-row class="search-box" align="center" no-gutters>
                <v-col :sm="6" :lg="7">
                  <div class="form-group-wrap">
                    <div class="form-group">
                      <label>현재공정</label>
                      <InputText
                        :boxWidth="'90%'"
                        :disabled="true"
                        :defaultValue="defaultValue"
                      />
                    </div>
                    <!-- <div class="form-group" v-if="confirm">
                      <div class="i-msg">
                        * 확정된 데이터이므로 수정할 수 없습니다.
                      </div>
                    </div> -->
                  </div>
                </v-col>
                <v-col :sm="6" :lg="5" align="right">
                  <Button :theme-color="'primary'" :size="'medium'" icon="cancel" @click="cancel">선택취소</Button>
                  <Button :theme-color="'primary'" :size="'medium'" icon="check"  @click="selectRow">선택</Button>
                  <Button :theme-color="'primary'" :size="'medium'" icon="close" @click="toggleDialog">닫기</Button>
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
                  :gridItems="citems"
                  :sortable="true"
                  :columns="gridHeader"
                  :resizable="false"
                  :isPaging="true"
                  :edit-field="'inEdit'"
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

    <div v-if="isLoading" class="loading-container" :style="{'z-index': '999999', position: 'relative'}">
      <div class="loading">
        <FadeLoader />
      </div>
    </div>

  </div>
</template>
<script>
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import gridHeaderMinin from "@/mixin/gridHeaderMinin.js";
import KendoGrid from "@/components/common/KendoGrid"
import InputText from "@/components/common/input/InputText";
import FadeLoader from 'vue-spinner/src/FadeLoader.vue';
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
    FadeLoader,
    Card,
    CardBody,
    CardTitle,
  },
  props:{
    visibleDialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    inputVal: {
      type: String,
      default: "",
    },
    callBack: {
      type: Function,
      default: () => true
    },
    gridData: {
      type: Array,
      default: () => []
    },

  },
  data() {
    return {
      gridHeader: [],
      gridHeight : '400px',
      selectedField: 'selected',
      headerParam: {
        gridid: "dgvConcurrencyProcessList", // 그리드 ID
        rowStat: "", //rowStat 표시 여부
      },
      noFirstCheck: true,
      noRowstat: true,
      selectedID: null,
      isLoading: true,
      items: [],
      defaultValue: ""
    }
  },
  computed: {
    citems () {
      return this.items.map((item) => ({ ...item, selected: item.UIKEY === this.selectedID }));
    },
  },
  async mounted() {
  },
  methods: {
    toggleDialog() {
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //그리드 로우 클릭
    onRowClick (event) {
      this.selectedID = event.dataItem.UIKEY;
    },
    //그리드 더블 클릭
    rowdblclick(event){
      this.$emit('selectedRow', event.dataItem);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    //row 선택
    selectRow() {
      const retuenData = this.citems.filter(x => x.selected);
      this.$emit('selectedRow', retuenData[0]);
      this.$emit('visibleDialog', !this.visibleDialog)
    },
    cancel(){
      this.$emit('cancelRow');
      this.$emit('visibleDialog', !this.visibleDialog)
    },
  },
  watch: {
    gridHeader(){
      this.items = this.gridData;
      this.isLoading = false;
      this.defaultValue = this.inputVal;
    }
  }
};
</script>