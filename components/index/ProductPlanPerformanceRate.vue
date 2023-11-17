<template>
    <div>
    <link rel="stylesheet" href="https://kendo.cdn.telerik.com/2023.1.117/styles/kendo.default-nordic.min.css">
    <Chart
        :value-axis="axis"
    >
      <ChartTitle :text="'생산계획대비실적(주간)'" />
      <ChartCategoryAxis>
        <ChartCategoryAxisItem 
            :categories="categories" 
            :labels="{visible: true, visual: visual}"
        />
      </ChartCategoryAxis>
      <ChartSeries>
        <ChartSeriesItem 
            :data-items="seriesData"
        />
      </ChartSeries>
    </Chart>
    </div>
  </template>

  <script>
  let myTitle;
  let myMenuId;
  import mixinGlobal from "@/mixin/global.js";
  import {
    Chart,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartSeries,
    ChartSeriesItem,
    ChartTitle,
  } from "@progress/kendo-vue-charts";
  
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
      closable: true,
    },
    components: {
      Chart,
      ChartCategoryAxis,
      ChartCategoryAxisItem,
      ChartSeries,
      ChartSeriesItem,
      ChartTitle,
    },
    data() {
      return {
        seriesData: [],
        categories: [],
        axis: [
          {
              name: "humidity",
              labels: {
                  format: "{0}%"
              }
          }
        ]
      };
    },
  async created(){
      this.searchData();
  },
  methods: {
    async searchData(){
      this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetProductionPlanPerformanceRate",
        sendParam: {}
      }).then((res) => {
        res.forEach(x => {
            this.seriesData.push(x.rate);
            this.categories.push((x.WOSTARTDATE).substr(0,4)+'-'+(x.WOSTARTDATE).substr(4,2)+'-'+(x.WOSTARTDATE).substr(6,2));
        });
      });
    },
    visual(e) {
      const BAR_SIZE = 30;
      //create the default visual
      var visual = e.createVisual();
      //scale it so that it has the predefined size
      //visual.transform(kendo.geometry.transform().scale(1, BAR_SIZE / e.rect.size.height, e.rect.center() ));
      return visual;
    },
  },
  };
  </script>