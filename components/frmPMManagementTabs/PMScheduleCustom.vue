<template>
    <calendar-cell :style="cellStyle"
    :is-selected="isSelected"
    :is-focused="isFocused"
    :is-today="isToday"
    :title="title"
    v-on:mousedown="cellRightClick"
    v-on:contextmenu.prevent="onContextMenu"
    @click="cellClick"
    ref="cell"
    >
        <div>
            <div style="" @click="handleClick">
            {{formattedValue}}
            {{hldyNm}}
            </div>
            <div>
                <span class="">
                    <div v-for="(item) in planNm" 
                    v-on:mousedown="handleMouseDown($event, item.pmscheduleid)"
                    v-on:contextmenu.prevent
                    :class="item.planColor" 
                    @click="updatePlan(item.pmscheduleid)">
                    {{ item.planTitle }}
                    </div>
                </span>
            </div>
        </div>
    </calendar-cell>
</template>
    <script>
    import { CalendarCell } from '@progress/kendo-vue-dateinputs';
    // import '@progress/kendo-ui/js/kendo.menu';
    import { emit } from 'process';
    import Utility from "~/plugins/utility";
    let mouseEventFlag = "";
    export default {
        name: 'CustomCalendarCell',
        props: {
            isWeekend: Boolean,
            isSelected: Boolean,
            isFocused: Boolean,
            formattedValue: String,
            isToday: Boolean,
            title: String,
            value: Date,
            // value2: String,
            gridData: Array,
            planData: Array,
            calCellWidth: String,
            calCellHeight: String
        },

        components: {
            'calendar-cell': CalendarCell,
            Utility
        },
        computed: {
            cellStyle: function(){
                let cell = this.$props.isWeekend ? {  color:'red', fontWeight: 'bold', width: this.calCellWidth, height:this.calCellHeight } : { fontWeight: 'bold', width: this.calCellWidth, height:this.calCellHeight };
                for(var i=0; i<this.gridData.length; i++){
                    if(this.gridData[i].dt == Utility.setFormatDate(this.value, 'YYYY-MM-DD')){
                        if(this.gridData[i].hldyFg == "1"){
                            cell = { color:'red', width: this.calCellWidth, height:this.calCellHeight, fontWeight: 'bold' }
                        }else{
                            if(this.gridData[i].hldyNm == "토요일"){
                                cell =  { fontWeight: 'bold', width: this.calCellWidth, height:this.calCellHeight, color: 'blue', }
                            }else{
                                cell =  { fontWeight: 'bold', width: this.calCellWidth, height:this.calCellHeight }
                            }
                        }
                    }
                }
                return cell;
            },
            hldyNm: function(){

                for(var i=0; i<this.gridData.length; i++){
                    if(this.gridData[i].dt == Utility.setFormatDate(this.value, 'YYYY-MM-DD'))
                    if(!(this.gridData[i].hldyNm == '토요일' || this.gridData[i].hldyNm == '일요일'))
                    return this.gridData[i].hldyNm
                }
            },
            planNm: function() {
                let attrArr = [];
                for(var i=0; i<this.planData.length; i++){
                    // console.log("planData[i]::::::", this.planData[i]);
                    if(Utility.setFormatDate(this.planData[i].PMPLANNEDTIME, 'YYYY-MM-DD') == Utility.setFormatDate(this.value, 'YYYY-MM-DD')){
                        let setPlanColor = "";
                        if ( this.planData[i].PMSTATE == "완료" ) {
                            setPlanColor = "green";
                        } else if ( this.planData[i].PMSTATE == "진행중" ) {
                            setPlanColor = "blue";
                        } else if ( this.planData[i].PMSTATE == "미진행" ) {
                            setPlanColor = "red";
                        } else if ( this.planData[i].PMSTATE == "예정" ) {
                            setPlanColor = "yellow";
                        }
                        attrArr.push({
                            planTitle               :this.planData[i].PMPLANNEDTIME.substring(11,16) + " " + this.planData[i].EQUIPMENTID, // EQUIPMENTID
                            planColor               :setPlanColor, // blue
                            planSeq                 :this.planData[i].PMCYCLEVALUE,
                            nowDate                 :this.value,
                            equipmentdetailtype     :this.planData[i].EQUIPMENTDETAILTYPE,
                            equipmentdetailtypename :this.planData[i].EQUIPMENTDETAILTYPENAME,
                            equipmentid             :this.planData[i].EQUIPMENTID,
                            equipmentname           :this.planData[i].EQUIPMENTNAME,
                            equipmentstate          :this.planData[i].EQUIPMENTSTATE,
                            equipmentstatename      :this.planData[i].EQUIPMENTSTATENAME,
                            equipmenttype           :this.planData[i].EQUIPMENTTYPE,
                            equipmenttypename       :this.planData[i].EQUIPMENTTYPENAME,
                            lastmaintenancetime     :this.planData[i].LASTMAINTENANCETIME,
                            manageruserid           :this.planData[i].MANAGERUSERID,
                            plantid                 :this.planData[i].PLANTID,
                            pmcycletype             :this.planData[i].PMCYCLETYPE,
                            pmcycletypename         :this.planData[i].PMCYCLETYPENAME,
                            pmcyclevalue            :this.planData[i].PMCYCLEVALUE,
                            pmendtime               :this.planData[i].PMENDTIME,
                            pmplannedtime           :this.planData[i].PMPLANNEDTIME,
                            pmscheduleid            :this.planData[i].PMSCHEDULEID,
                            pmscheduletype          :this.planData[i].PMSCHEDULETYPE,
                            pmscheduletypename      :this.planData[i].PMSCHEDULETYPENAME,
                            pmstarttime             :this.planData[i].PMSTARTTIME,
                            pmstate                 :this.planData[i].PMSTATE,
                            referencetype           :this.planData[i].REFERENCETYPE,
                            referencevalue          :this.planData[i].REFERENCEVALUE,
                            workcomment             :this.planData[i].WORKCOMMENT,
                            workeruserid            :this.planData[i].WORKERUSERID,
                            workresult              :this.planData[i].WORKRESULT
                            
                        });
                    }
                }
                return attrArr;
            },
        },
        mounted() {
            const cellElement = this.$refs.cell.$el;
            cellElement.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            });
        },
        methods: {
            cellClick: function(e) {
                console.log("셀 좌클릭", e);
            },
            handleClick: function(e){
                console.log("handleClick");
            },
            updatePlan: function(e){
                console.log("updatePlan");
                console.log("planData:::::", this.planData);
                this.$emit('updateClick', e);
            },
            onContextMenu(event) {
                event.preventDefault();
            },
            cellRightClick(e) {
                // console.log("오오오오!!", this.gridData);
                // console.log("mouseEventFlag!!", mouseEventFlag);
                // console.log("클릭한날짜 !!:::", this.formattedValue);

                let cellClickData = [];
                for(var i=0; i<this.gridData.length; i++) {
                    if(this.gridData[i].idx == this.formattedValue-1) {
                        cellClickData.push(this.gridData[i]);
                    }
                }
                console.log("cellClickData::::::::", cellClickData);

                if (mouseEventFlag != "P") {
                    // console.log("cellRightClick:::::::::::::::::::::::::",e);
                    var isRightButton;
                    e = e || window.event;

                    if ("which" in e) {  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                        isRightButton = e.which == 3; 
                    } else if ("button" in e) {  // IE, Opera 
                        isRightButton = e.button == 2; 
                    }

                    if (isRightButton == true) {    // true = 우클릭
                        // alert("right");
                        this.$emit('onRightClick', e, cellClickData, "");

                    } else if(isRightButton == false) {     // false = 좌클릭
                        this.$emit('onLeftClick', e, cellClickData);
                    }
                } else {
                    mouseEventFlag = "";
                }
            },

            // 마우스 클릭이벤트 
            handleMouseDown: function(e, pmscheduleid) {
                mouseEventFlag = "P";
                // console.log("handleMouseDown::::::::::::::", e);
                // console.log("handleMouseDown::::::planNm:::::::", this.planNm);
                // console.log("handleMouseDown::::::pmscheduleid:::::::", pmscheduleid);
                
                let clickData = [];
                for(var i=0; i<this.planNm.length; i++){
                    // console.log("planData:::::::::::::", this.planData);
                    if(this.planNm[i].pmscheduleid == pmscheduleid){
                        clickData.push(this.planNm[i]);
                    }
                }
                console.log("clickData::::::::", clickData);

                // this.$emit('handleMouseDown', e);
                var isRightButton;
                e = e || window.event;

                if ("which" in e) {  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                    isRightButton = e.which == 3; 
                } else if ("button" in e) {  // IE, Opera 
                    isRightButton = e.button == 2; 
                }
                console.log("isRightButton::::::::", isRightButton);

                if (isRightButton == true) {    // true = 우클릭
                    // alert("right");
                    console.log("this.value::::::::", this.value);
                    console.log("진행상태 스케줄커스텀뷰::::::::", clickData[0].pmstate);
                    this.$emit('onRightClick', e, clickData, clickData[0].pmstate);

                } else if(isRightButton == false) {     // false = 좌클릭
                    this.$emit('onLeftClick', e, clickData);
                }
            }
        }
    }
    </script>
    
<style lang="scss">
.k-link {
    align-items: baseline !important;
    justify-content: flex-start !important;
    overflow-y: auto;
    overflow-x: hidden;
    text-align: left;
}
.red{
    //background-color: rgba(229,62,62,var(--bg-opacity));
    background-color: #e53e3e !important;
    color: #fff;
    border-radius: .125rem;
    font-size: .75rem;
    line-height: 1.25;
    text-align: left;
    margin-bottom: .25rem !important;
    max-width: 110px;
    min-width: 110px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
  .blue{
    //background-color: rgba(66,153,225,var(--bg-opacity));
    background-color: #4299e1 !important;
    color: #fff;
    border-radius: .125rem;
    font-size: .75rem;
    line-height: 1.25;
    text-align: left;
    margin-bottom: .25rem !important;
    max-width: 110px;
    min-width: 110px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
  .puple{
    //background-color: rgba(102,126,234,var(--bg-opacity));
    background-color: #667eea !important;
    color: #fff;
    border-radius: .125rem;
    font-size: .75rem;
    line-height: 1.25;
    text-align: left;
    margin-bottom: .25rem !important;
    max-width: 110px;
    min-width: 110px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
  .green{
    //background-color: rgba(56,178,172,var(--bg-opacity));
    background-color: #38b2ac !important;
    color: #fff;
    border-radius: .125rem;
    font-size: .75rem;
    line-height: 1.25;
    text-align: left;
    margin-bottom: .25rem !important;
    max-width: 110px;
    min-width: 110px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
  .orange{
    //background-color: rgba(237,137,54,var(--bg-opacity));
    background-color: #ed8936 !important;
    color: #fff;
    border-radius: .125rem;
    font-size: .75rem;
    line-height: 1.25;
    text-align: left;
    margin-bottom: .25rem !important;
    max-width: 110px;
    min-width: 110px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
  .pink{
    //background-color: rgba(237,100,166,var(--bg-opacity));
    background-color: #ed64a6 !important;
    color: #fff;
    border-radius: .125rem;
    font-size: .75rem;
    line-height: 1.25;
    text-align: left;
    margin-bottom: .25rem !important;
    max-width: 110px;
    min-width: 110px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
  .grey{
    background-color: #6d6d6d;
    color: #fff;
    border-radius: .125rem;
    font-size: .75rem;
    line-height: 1.25;
    text-align: left;
    margin-bottom: .25rem !important;
    max-width: 110px;
    min-width: 110px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
</style>