<template>
  <div id="example">
    <link
      rel="stylesheet"
      href="https://kendo.cdn.telerik.com/2023.1.117/styles/kendo.default-nordic.min.css"
    />
    <Chart
      :pannable="{
        lock: 'x',
      }"
      :zoomable="{
        lock: 'x',
      }"
    >
      <ChartTitle :text="'재공조회(주간)'" />
      <ChartLegend :position="'bottom'" :orientation="'horizontal'" />
      <ChartCategoryAxis>
        <ChartCategoryAxisItem
          :categories="categories"
          :labels="{ rotation: 310 }"
        />
      </ChartCategoryAxis>
      <ChartSeries>
        <ChartSeriesItem
          v-for="(item, index) in seriesData"
          :name="item.name"
          :data-items="item.data"
          :type="'bar'"
          :key="index"
          :field="item.field"
          :visual="visual"
          :category-field="item.category"
        >
          <ChartSeriesItemTooltip :format="'{0}'" />
        </ChartSeriesItem>
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
  ChartTitle,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartCategoryAxisTitle,
  ChartLegend,
  ChartSeriesDefaults,
  ChartSeriesItemTooltip,
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
    ChartTitle,
    ChartSeries,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartCategoryAxisTitle,
    ChartLegend,
    ChartSeriesDefaults,
    ChartSeriesItemTooltip,
  },
  data() {
    return {
      reportData: [],
      categories: [],
      seriesData: [],
      chartData: {},
    };
  },
  async created() {
    this.reportData = await this.mesGet({
      apiKey: "mes/common/getqueryresult",
      queryId: "GetProvisionReport",
      sendParam: {
        plantid: "LS",
      },
    });
    window._this = this;
    this.initChart();
  },
  methods: {
    initChart(dataSource) {
      const data = this.reportData;
      this.categories = [];
      this.seriesData = [];

      if (dataSource) {
        const columns = dataSource.columns();
        const rows = dataSource.rows();

        if (columns.length === 0 || rows.length === 0) {
          return;
        }

        const seriesItems = [];

        data.forEach((x) => {
          const category = [];
          columns.forEach((col) => {
            category.push(x[col.name[0]]);
          });
          x.category = category.join("|");

          if (!this.categories.find((y) => y === x.category)) {
            this.categories.push(x.category);
          }

          const seriesName = [];
          rows.forEach((row) => {
            seriesName.push(x[row.name[0]]);
          });
          x.seriesName = seriesName.join(" | ");

          if (!seriesItems.find((y) => y === x.seriesName)) {
            seriesItems.push(x.seriesName);
          }
        });

        this.seriesData = seriesItems.map((x) => {
          const item = data.filter((y) => y.seriesName === x);

          return {
            name: item[0].seriesName,
            data: item,
            field: "tqty",
            category: "category",
          };
        });
      } else {
        data.forEach((x) => {
          if (!this.categories.find((y) => y === x.PRODUCTNAME)) {
            this.categories.push(x.PRODUCTNAME);
          }
        });

        const seriesItems = [];
        data.forEach((x) => {
          if (!seriesItems.find((y) => y === x.PROCESSNAME)) {
            seriesItems.push(x.PROCESSNAME);
          }
        });

        this.seriesData = seriesItems.map((x) => {
          const item = data.filter((y) => y.PROCESSNAME === x);

          return {
            name: item[0].PROCESSNAME,
            data: item,
            field: "tqty",
            category: "PRODUCTNAME",
          };
        });
      }
    },
    visual(e) {
      const BAR_SIZE = 100;
      //create the default visual
      var visual = e.createVisual();
      //scale it so that it has the predefined size
      //visual.transform(kendo.geometry.transform().scale(1, BAR_SIZE / e.rect.size.height, e.rect.center() ));
      return visual;
    },
  },
};
</script>
