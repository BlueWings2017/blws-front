<template>
  <div class="l-layout">
   {{myTitle}}
  </div>
</template>
<script>
import mixinGlobal from "@/mixin/global.js";
import Utility from "~/plugins/utility";

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

const defaultData = {
};
</script>
<style lang="scss">

</style>