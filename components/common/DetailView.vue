<template>
  <k-dialog 
    v-if="visibleDialog" 
    :title="title" 
    @close="hide"
  >
    <v-row align="center" :style="{ width: modalWidth, height: modalHeight }">
      <v-col :cols="12">
        <div v-if="!isEmptyObject(item)" class="detail-area area-2">
          <template v-for="item in gridItem">
            <div class="area-form">
              <div class="area-th">
                <label>{{item.title1}}</label>
              </div>
              <div class="area-td">
                <span style="font-size: 14px">{{ item.contents1 }}</span>
              </div>

              <div class="area-th">
                <label>{{item.title2}}</label>
              </div>
              <div class="area-td">
                <span style="font-size: 14px">{{ item.contents2 }}</span>
              </div>
            </div>
          </template>
        </div>
        <div v-else>
          <p :style="{ margin: '25px', textAlign: 'center' }">
            선택된 항목이 없습니다.
          </p>
        </div>
        
      </v-col>
    </v-row>
    <dialog-actions-bar>
      <kbutton 
        @keydown.enter="hide" 
        @click="hide"
      >
        {{$t("CommLang.btn.closeBtn")}}
      </kbutton>
    </dialog-actions-bar>
  </k-dialog>
</template>
<script>

import { mapState, mapMutations } from "vuex";
import { Dialog, DialogActionsBar } from "@progress/kendo-vue-dialogs";
import { Button } from "@progress/kendo-vue-buttons";
import InputText from "../../components/common/input/InputText.vue";

export default {
  name:"DetailView",
  components: {
    "k-dialog": Dialog,
    "dialog-actions-bar": DialogActionsBar,
    kbutton: Button,
    InputText
  },
  props: {
    header: {
      type: Array,
      require: false,
      default: () => {
        return [];
      }
    },
    item:{
      type: Object,
      require: false,
      default: () =>{
        return {};
      }
    }
  },
  created(){

  },
  computed: {
    ...mapState({

    }),
    gridItem: {
      get: function () {
        if(!this.isEmptyObject(this.item)) {
          let tempObj = {};

          const gridItems = this.header.filter(x => x.field !== 'rowStat' && x.field !== 'selected').map((x, idx) => {
            //홀수 컬럼
            if(idx % 2 === 0) {
              tempObj.title1 = x.title;
              tempObj.contents1 = this.item[x.field] ? this.item[x.field] : '';

              if(this.header.length === idx + 1) {
                tempObj.title2 = '';
                tempObj.contents2 = '';

                const temp = JSON.parse(JSON.stringify(tempObj));
                tempObj = {};
                return temp;
              }
            }
            //짝수 컬럼
            else {
              tempObj.title2 = x.title;
              tempObj.contents2 = this.item[x.field] ? this.item[x.field] : '';

              const temp = JSON.parse(JSON.stringify(tempObj));
              tempObj = {};
              return temp;
            }
          });

          return gridItems.filter(x => x !== undefined);
        }
        else {
          return [];
        }
      }
    }
  },
  watch:{
    
  },
  data(){
    return{
      visibleDialog: false,
      title: null,
      modalWidth: "700px",
      modalHeight: "500px"
    }
  },
  async mounted() {

  },
  methods:{
    show(title, modalWidth = "700px", modalHeight = "500px") {
      this.title = title;
      this.modalWidth = modalWidth;
      this.modalHeight = modalHeight;
      this.visibleDialog = true;
    },
    hide() {
      this.visibleDialog = false;
    },
    isEmptyObject(obj) {
      return Object.keys(obj).length === 0;
    }
  }
}
</script>