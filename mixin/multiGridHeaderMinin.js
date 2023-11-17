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
    
  },
  methods: {
    async getHeaderMulti(headerParam, divWrapper, customDropDown = false) {
      let width = 0
      let editable = false;
      if(divWrapper.offsetWidth > 1000){
        width = Math.round(divWrapper.offsetWidth / 100);
      }else{
        width = Math.round(divWrapper.offsetWidth / 50);
      }
      await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetGridInit",
        sendParam: {
          plantid: "LS",
          userid: "manager",
          menugrouptype: "UI",
          gridid: headerParam.gridid
        }
      }).then((res) => {
        const data = res.sort((a, b) => a.POSITION - b.POSITION);
        let totalWidth = 0;
        let realWidth = 0;
        res.filter(x => x.VISIBLEFLAG === "Yes").forEach((x => totalWidth += parseFloat(x.GRIDCOLUMNSIZE)));

        const header = data.filter(x => x.VISIBLEFLAG === "Yes").map((x, idx) => {
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
            if(x.CELLTYPE === "EnumComboBox" || x.CELLTYPE === "ComboBox"){
              cell = x.GRIDCOLUMNID;
            }
          } else if (x.CHANGECELLTYPE){
            console.log("x.CHANGECELLTYPE ==> ", x.CHANGECELLTYPE)
            cell = x.GRIDCOLUMNID
          }
          
          editable = !x.PRIMARYKEYFLAG && x.EDITFLAG === "Yes";

          if(x.PRIMARYKEYFLAG && (x.CELLTYPE === "EnumComboBox" || x.CELLTYPE === "ComboBox")){
            cell = x.GRIDCOLUMNID;
            editable = x.PRIMARYKEYFLAG && x.EDITFLAG === "Yes";
          }
          
          // 상태변경 설정 grid selectbox 생성용... 2023.03.22
          if(customDropDown){
            for(let i = 0; i < headerParam.gridDropDownList.length; i++){
              if(x.PRIMARYKEYFLAG && x.GRIDCOLUMNID === headerParam.gridDropDownList[i].dataVal){
                cell = x.GRIDCOLUMNID;
                editable = x.PRIMARYKEYFLAG && x.EDITFLAG === "Yes";
              }
            }
          }

          //콤보박스 자동생성
          if(x.CELLTYPE === "EnumComboBox") {
            headerParam.enumComboBox = headerParam.enumComboBox? headerParam.enumComboBox: [];
            headerParam.enumComboBox.push(
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
                headerParam.enumComboBox.find(item => item.dataVal === x.GRIDCOLUMNID).dataItem = data;
              })
            }
          }
          //체크박스 자동생성
          else if(x.CELLTYPE === "YesNo" || x.CELLTYPE === "ActiveState" || x.CELLTYPE === "TrueFalse"){
            headerParam.checkBox = headerParam.checkBox? headerParam.checkBox: [];
            headerParam.checkBox.push(x.GRIDCOLUMNID);
          }
          //사용자정의 컬럼 자동생성(화면에서 정의 필요함.)
          else if(x.CELLTYPE === "Custom") {
            headerParam.customCell = headerParam.customCell? headerParam.customCell: [];
            headerParam.customCell.push(x.GRIDCOLUMNID);
            cell = x.GRIDCOLUMNID;
          }
          else if(x.CELLTYPE === "datePicker" || x.CELLTYPE === "searchBtn") {
            cell = x.CELLTYPE;
          }
          
          let sysColWidth = 0;
          if(!headerParam.noRowstat){
            sysColWidth += 70;
          }
          if(!headerParam.noFirstCheck){
            sysColWidth += 40;
          }

          const cellWidth = Math.floor(((divWrapper.offsetWidth - sysColWidth) / 100) * ((x.GRIDCOLUMNSIZE / totalWidth) * 100));
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
            editable: editable,
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
        if(!headerParam.noRowstat){
          const rowstat = { field: 'rowStat', editable: false, title: " ", width: 70, cell:"crudCellTemplate", className: "gridTextCenter"}
          header.unshift(rowstat);
          realWidth += 70;
        }
        if(!headerParam.noFirstCheck){
          const chk = { field: 'selected', editable: true, width: 40, headerSelectionValue: this.areAllSelected, className: "gridTextCenter" };
          header.unshift(chk);
          realWidth += 40;
        }

        header[header.length - 1].width = header[header.length - 1].width + (divWrapper.offsetWidth - 7 - realWidth);

        headerParam.gridHeader = header;
      })
    },
  },
  watch: {
  },
  
}

export default Headers