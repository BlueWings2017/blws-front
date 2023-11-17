<template>
  <div>
    <v-row ref="searchFilter">
      <v-col :cols="12">
        <kcard>
          <cardBody>
            <CardTitle>검색조건 영역</CardTitle>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row ref="contents">
      <v-col :cols="6">
        <kcard  :style="{height : '100%'}">
          <cardBody>
            <CardTitle>컨텐츠1 영역</CardTitle>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="6">
        <kcard  :style="{height : '100%'}">
          <cardBody>
            <CardTitle>컨텐츠2 영역</CardTitle>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
  </div>
</template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import Utility from "~/plugins/utility";
  import { Card, CardBody, CardTitle, CardActions } from "@progress/kendo-vue-layout";
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
        CardBody, 
        CardTitle, 
        CardActions,
        "kcard" : Card,
    },
    data() {
      return {
      };
    },
    computed: {
    },
    watch: {
    },
    beforeCreate() {
    },
    methods: {
    }
  };
  </script>
  <style lang="scss">
  
  </style>