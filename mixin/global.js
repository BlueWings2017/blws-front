import { mapState, mapMutations, mapActions } from "vuex";
import 'hammerjs';
import AlertPop from "@/components/common/modal/AlertPop";
import ConfirmPop from "@/components/common/modal/ConfirmPop";
export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      drawer: state => state.drawer,
      // gridHeader: state => state.modules.gridHeader
    }),
  },
  watch: {
  },
  components:{
    AlertPop,
    ConfirmPop
  },
  beforeCreate() {},
  created() {
    this.$nuxt.$on('destroyStore', () => {
      this.resetAction()
    });
    this.$nuxt.$on('destroyStoreFPRC', () => {
      this.resetPRCAction()
    });
  },
  mounted() {
    this.layoutInit();
  },
  beforeDestroy() {
  },
  methods: {
    ...mapMutations({
    }),
    ...mapActions({
      postApi: "modules/list/postApi",
      postUpdateApi: "modules/list/postUpdateApi",
      postApiReturn: "modules/list/postApiReturn",
      setTree: "modules/list/setTree",
      getListReturn: "modules/list/getListReturn",
      postInsertReturn: "modules/list/postInsertReturn",
      putUpdateReturn: "modules/list/putUpdateReturn",
      deleteDeleteReturn: "modules/list/deleteDeleteReturn",
      resetAction: "modules/frmRouteEvent/lotInfoAction",
      resetPRCAction: "modules/frmPRC/resetPRCAction"
      // getHader: "modules/gridHeader/getHaderAction",
    }),
    layoutInit() {
      if(this.$refs.searchFilter){
        if(this.$refs.contents){
          const searchFilterHeight = this.$refs.searchFilter.offsetHeight;
          this.$refs.contents.style.height = `calc(100% - ${searchFilterHeight}px)`;
        }
      }else if(this.$refs.contents){
        this.$refs.contents.style.height = `calc(100%)`;
      }
    },
    setPer(warp, percentage){
      return Math.round(this.$refs[warp].offsetWidth / 100) * percentage;
    },
    isEmptyObject(obj) {
      return Object.keys(obj).length === 0;
    },
    isNullOrEmpty(val) {
      if(val === undefined || val === null || val.toString() === "") {
        return true;
      }
      else {
        return false;
      }
    },
    parseChkValToTF(val) {
      if(val === true || val === "Yes" || val === "Active" || val === "True") {
        return true;
      }
      else {
        return false;
      }
    },
    parseTFToYN(val) {
      if(val === true || val === "Yes") {
        return "Yes";
      }
      else {
        return "No";
      }
    },
    parseTFToAIA(val) {
      if(val === true || val === "Active") {
        return "Active";
      }
      else {
        return "Inactive";
      }
    },
    parseNullOrUndefinedToBlank(val) {
      if(val === undefined || val === null) {
        return "";
      }
      else {
        return val;
      }
    },
    init() {}
  }
};
