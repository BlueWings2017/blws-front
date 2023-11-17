<template>
    <calendar-cell :style="cellStyle"
    :is-selected="isSelected"
    :is-focused="isFocused"
    :is-today="isToday"
    
    :title="title"
    >
    <div>
    <div style="" @click="handleClick">
       {{formattedValue}}
       {{hldyNm}}
    </div>
    <div>
        <span class="">
            <p v-for="(item, idx) in planNm" :class="item.planColor" @click="updatePlan(item.planSeq)">
                {{ item.planTitle }}
            </p>
        </span>
    </div>
    </div>
    </calendar-cell>
    </template>
    <script>
    import { CalendarCell } from '@progress/kendo-vue-dateinputs';
import { emit } from 'process';
    import Utility from "~/plugins/utility";
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
                    if(Utility.setFormatDate(this.planData[i].dt, 'YYYY-MM-DD') == Utility.setFormatDate(this.value, 'YYYY-MM-DD')){
                        attrArr.push({
                            planTitle : this.planData[i].planTitle,
                            planColor : this.planData[i].planColor,
                            planSeq: this.planData[i].planSeq
                        });
                    }
                }
                return attrArr;
            },
        },
        
        methods: {
            handleClick: function(e){
                this.$emit('click', this.$props.value, e);
                this.$emit('mousedown', this.$props.value, e);
                this.$emit('mouseenter', this.$props.value, e);
                this.$emit('mouseleave', this.$props.value, e);
            },
            updatePlan: function(e){
                this.$emit('updateClick', e);
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