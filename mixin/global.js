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
      mesGet: "modules/list/mesGet",
      mesPost: "modules/list/mesPost",
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
    //mes 저장시 정합성 체크 함수
    //input : gridHeader(그리드 헤더/columns), gridData(그리드 데이터/gridItems)
    mesValidation(gridHeader, gridData){
      let result = {
        isValidate: true,
        code: "0",
        msg: "",
        field: [],
        title: []
      };

      const pkCol = gridHeader.filter(x => x.PRIMARYKEYFLAG);
      const notNullCol = gridHeader.filter(x => x.NOTNULLFLAG);

      //검사할 컬럼이 없음
      if((pkCol === undefined || pkCol.lenght === 0)
       && (notNullCol === undefined || notNullCol.lenght === 0)){
        return result;
      }

      //검사할 데이터가 없음
      if(gridData === undefined || gridData.lenght === 0){
        return result;
      }
  
      gridData.filter(x => x.rowStat === "C" || x.rowStat === "U").some(function (item) {
        pkCol.some(function (col) {
          //pk항목이 없거나 데이터 세팅이 되지 않음
          if(item[col.field] === undefined || item[col.field] === null || item[col.field].toString() === "") {
            result.isValidate = false;
            result.code = "1";
            result.msg = col.title + "은(는) 필수 입력 값입니다.";
            result.field.push(col.field);
            result.title.push(col.title);
  
            return true;
          }
        });
  
        if(!result.isValidate) {
          return true;
        }
  
        notNullCol.some(function (col) {
          //not null 항목이 없거나 데이터 세팅이 되지 않음
          if(item[col.field] === undefined || item[col.field] === null || item[col.field].toString() === "") {
            result.isValidate = false;
            result.code = "2";
            result.msg = col.title + "은(는) 필수 입력 값입니다.";
            result.field.push(col.field);
            result.title.push(col.title);
  
            return true;
          }
        });
  
        if(!result.isValidate) {
          return true;
        }
        
        //pk중복 체크는 pk컬럼이 있어야 수행한다.
        if(pkCol.lenght === 0) {
          return true;
        }

        gridData.filter(x => x.rowStat !== "D").some(function (item2) {
          if(item !== item2){
            let temp = {
              field: [],
              title: []
            };
            pkCol.some(function (col) {
              //pk항목의 값이 동일한 경우
              if(item[col.field] === item2[col.field]) {
                temp.field.push(col.field);
                temp.title.push(col.title);
              }
            });
  
            //총 pk컬럼의 수와 중복되는 pk컬럼의 수가 동일한 경우
            if(pkCol.length === temp.field.length) {
              result.isValidate = false;
              result.code = "3";
  
              result.msg = temp.title.join("/ ") + "의 값은 중복될 수 없습니다.";
              result.field = temp.field;
              result.title = temp.title;
  
              return true;
            }
          }
          
        });
      });
  
      return result;
    },
    resizeGridWidth(gridRef, headerParam) {
      let totalWidth = 0;
      const offsetWidth = gridRef.offsetWidth;

      const data = headerParam.gridHeader.filter(x => x.field !== "rowStat" && x.field !== "selected");
      data.forEach((x => totalWidth += parseFloat(x.GRIDCOLUMNSIZE)));

      data.forEach((x) => {
        
        let sysColWidth = 0;
        if(!headerParam.noRowstat){
          sysColWidth += 70;
        }
        if(!headerParam.noFirstCheck){
          sysColWidth += 40;
        }
        
        const cellWidth = Math.floor(((offsetWidth - sysColWidth - 10) / 100) * ((x.GRIDCOLUMNSIZE / totalWidth) * 100));

        x.width = cellWidth;
      });
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
