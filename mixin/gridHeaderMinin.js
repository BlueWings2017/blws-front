const Headers = {
  props:{
  },
  data() {
    return {
      gridHeaderData: [],
    }
  },
  created() {
  },
  async mounted() {
    await this.getHeader();
  },
  methods: {
    async getHeader() {
      let width = 0
      if(this.$refs.divWrapper.offsetWidth > 1000){
        width = Math.round(this.$refs.divWrapper.offsetWidth / 100);
      }else{
        width = Math.round(this.$refs.divWrapper.offsetWidth / 50);
      }

      let noRowStat = false;
      let noFirstCheck = false;
      if((this.headerParam.noRowstat !== undefined && this.headerParam.noRowstat) || (this.noRowstat !== undefined && this.noRowstat)){
        noRowStat = true;
      }
      if((this.headerParam.noFirstCheck !== undefined && this.headerParam.noFirstCheck) || (this.noFirstCheck !== undefined && this.noFirstCheck)){
        noFirstCheck = true;
      }

      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetGridInit",
        sendParam: {
          plantid: "LS",
          userid: "manager",
          menugrouptype: "UI",
          gridid: this.headerParam.gridid
        }
      }).then((res) => {
        const data = res.sort((a, b) => a.POSITION - b.POSITION);
        let totalWidth = 0;
        let realWidth = 0;
        res.filter(x => x.VISIBLEFLAG === "Yes").forEach((x => totalWidth += parseFloat(x.GRIDCOLUMNSIZE)));

        const header = data.filter(x => x.VISIBLEFLAG === "Yes").map((x) => {
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
            console.log("x.CHANGECELLTYPE ==> ", x.CHANGECELLTYPE)
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
          if(!noRowStat){
            sysColWidth += 70;
          }
          if(!noFirstCheck){
            sysColWidth += 40;
          }

          const cellWidth = Math.floor(((this.$refs.divWrapper.offsetWidth - sysColWidth) / 100) * ((x.GRIDCOLUMNSIZE / totalWidth) * 100));
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
            PRIMARYKEYFLAG: x.PRIMARYKEYFLAG,
            NOTNULLFLAG: x.NOTNULLFLAG,
            GRIDCOLUMNSIZE: x.GRIDCOLUMNSIZE,
            IsBoolean: x.CELLTYPE === "YesNo" || x.CELLTYPE === "ActiveState"
          }
        });
        if(!noRowStat){
          const rowstat = { field: 'rowStat', editable: false, title: " ", width: 70, cell:"crudCellTemplate", className: "gridTextCenter"}
          header.unshift(rowstat);
          realWidth += 70;
        }
        if(!noFirstCheck){
          const chk = { field: 'selected', editable: true, width: 40, headerSelectionValue: this.areAllSelected, className: "gridTextCenter" };
          header.unshift(chk);
          realWidth += 40;
        }

        header[header.length - 1].width = header[header.length - 1].width + (this.$refs.divWrapper.offsetWidth - 7 - realWidth);

        this.gridHeader = header;
        this.headerParam.gridHeader = header;
      })
    }
  },
  watch: {
  },
  
}

export default Headers