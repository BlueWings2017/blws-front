const Headers = {
  props:{
  },
  data() {
    return {
      gridHeader: [],
    }
  },
  created() {
  },
  async mounted() {
    // await this.getHeader();
  },
  methods: {
    async getCustomHeader(gridId, noRowstat=false, noFirstCheck=false) {
      let header = [];

      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetGridInit",
        sendParam: {
          plantid: "LS",
          userid: "manager",
          menugrouptype: "UI",
          gridid: gridId
        }
      }).then((res) => {
        let realWidth = 0;
        let totalWidth = 0;
        let offsetWidth = 800;
        
        if(this.$refs.divWrapper?.offsetWidth){
          offsetWidth = this.$refs.divWrapper.offsetWidth;
        }
        else if($('#' + gridId)[0]?.offsetWidth) {
          offsetWidth = $('#' + gridId)[0].offsetWidth;
        }

        res.filter(x => x.VISIBLEFLAG === "Yes").forEach((x => totalWidth += parseFloat(x.GRIDCOLUMNSIZE)));

        const data = res.sort((a, b) => a.POSITION - b.POSITION);
        header = data.filter(x => x.VISIBLEFLAG === "Yes").map((x) => {
          let cell = "";          
          
          //CELL_TYPE 정의
          if(!x.PRIMARYKEYFLAG && x.EDITFLAG === "Yes"){
            if(x.CELLTYPE === "EnumComboBox" || x.CELLTYPE === "ComboBox"){
              //ComboBox
              cell = x.GRIDCOLUMNID;
            }else if(x.CELLTYPE === "YesNo" || x.CELLTYPE === "ActiveState"){
              //CheckBox
              cell = x.GRIDCOLUMNID
            }else if(x.CELLTYPE === "Button"){
              // Button
              cell = x.CELLTYPE
            }
          }

          //수정불가 체크박스
          if(!x.PRIMARYKEYFLAG && x.EDITFLAG === "No"){
            if(x.CELLTYPE === "YesNo" || x.CELLTYPE === "ActiveState"){
              cell = x.GRIDCOLUMNID
            }
          }

          if(x.PRIMARYKEYFLAG){
            cell = "PRIMARYKEYFLAG"
          } else if (x.CHANGECELLTYPE){
            cell = x.GRIDCOLUMNID
          }

          //콤보박스 자동생성
          if(x.CELLTYPE === "EnumComboBox") {
            this.headerParam.enumComboBox = this.headerParam.enumComboBox? this.headerParam.enumComboBox: [];
            this.headerParam.enumComboBox.push(
              {
                dataVal: x.GRIDCOLUMNID,
                dataItem: [],
              }
            );

            if(!this.isNullOrEmpty(x.COMBOENUMID)) {
              this.mesGet({
                apiKey: "mes/common/getqueryresult",
                queryId: "GetEnumValue",
                sendParam: {
                  plantid: "LS",
                  enumid: x.COMBOENUMID
                }
              }).then((data) => {
                this.headerParam.enumComboBox.find(item => item.dataVal === x.GRIDCOLUMNID).dataItem = data;
              })
            }
          }
          //체크박스 자동생성
          else if(x.CELLTYPE === "YesNo" || x.CELLTYPE === "ActiveState" || x.CELLTYPE === "TrueFalse"){
            this.headerParam.checkBox = this.headerParam.checkBox? this.headerParam.checkBox: [];
            this.headerParam.checkBox.push(x.GRIDCOLUMNID);
          }
          //사용자정의 컬럼 자동생성(화면에서 정의 필요함.)
          else if(x.CELLTYPE === "Custom") {
            this.headerParam.customCell = this.headerParam.customCell? this.headerParam.customCell: [];
            this.headerParam.customCell.push(x.GRIDCOLUMNID);
            cell = x.GRIDCOLUMNID;
          }
          else if(x.CELLTYPE === "datePicker" || x.CELLTYPE === "searchBtn") {
            cell = x.CELLTYPE;
          }

          let sysColWidth = 0;
          if(!noRowstat){
            sysColWidth += 70;
          }
          if(!noFirstCheck){
            sysColWidth += 40;
          }
          
          const cellWidth = Math.floor(((offsetWidth - sysColWidth - 10) / 100) * ((x.GRIDCOLUMNSIZE / totalWidth) * 100));
          realWidth += cellWidth;

          let align = "";
          if(x.ALIGN == "Center"){
            align = "gridTextCenter"
          }else if(x.ALIGN == "Right"){
            align = "gridTextRight"
          }else{
            align = "gridTextLeft"
          }

          return {
            field: x.GRIDCOLUMNID,
            editable: !x.PRIMARYKEYFLAG && x.EDITFLAG === "Yes",
            title: x.GRIDCOLUMNNAME,
            width: cellWidth,
            cell: cell,
            className: align,
            VISIBLEFLAG: x.VISIBLEFLAG,
            GRIDCOLUMNSIZE: x.GRIDCOLUMNSIZE,
            IsBoolean: x.CELLTYPE === "YesNo" || x.CELLTYPE === "ActiveState"
          }
        });
        if(!noRowstat){
          const rowstat = { field: 'rowStat', editable: false, title: " ", width: 70, cell:"crudCellTemplate", className: "gridTextCenter"}
          header.unshift(rowstat);
          realWidth += 70;
        }
        if(!noFirstCheck){
          const chk = { field: 'selected', editable: true, width: 40, headerSelectionValue: this.areAllSelected, className: "gridTextCenter" };
          header.unshift(chk);
          realWidth += 40;
        }

        header[header.length - 1].width = header[header.length - 1].width + (offsetWidth - 7 - realWidth);
      })
      
      return header;
    },
  },
  watch: {
  },
  
}

export default Headers