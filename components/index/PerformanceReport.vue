<template>
  <div>
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
      <ChartTitle :text="'실적조회(주간)'" />
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
          :type="'column'"
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
import InputText from "@/components/common/input/InputText";
import { Card, CardBody, CardTitle } from "@progress/kendo-vue-layout";
import { Button } from "@progress/kendo-vue-buttons";
import mixinGlobal from "@/mixin/global.js";
import DatePickerSingle from "@/components/common/input/DatePickerSingle";
import moment from "moment";
import { DatePicker } from "@progress/kendo-vue-dateinputs";
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
    Card,
    Button,
    CardBody,
    CardTitle,
    InputText,
    DatePickerSingle,
    DatePicker,
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
      fromDate: new Date(moment().subtract(1, "weeks").format("YYYY-MM-DD")),
      toDate: new Date(moment().format("YYYY-MM-DD")),
      PRODUCTID: "",
      reFresh: true,
      categories: [],
      seriesData: [],
      chartData: {},
    };
  },
  async created() {
    this.searchData();
  },
  methods: {
    searchBtn() {
      this.reFresh = false;
      this.$nextTick(() => {
        this.reFresh = true;
        this.searchData();
      });
    },
    async searchData() {
      this.reportData = await this.mesGet({
        apiKey: "mes/common/getqueryresult",
        queryId: "GetPerformanceReport",
        sendParam: {
          plantid: "LS",
          productid: this.PRODUCTID,
          fromdate: moment(this.fromDate).format("YYYYMMDD"),
          todate: moment(this.toDate).format("YYYYMMDD"),
        },
      });
      window._this = this;
      this.initChart();
    },
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
            field: "inqty",
            category: "STIME",
          };
        });
      } else {
        data.forEach((x) => {
          if (!this.categories.find((y) => y === x.column)) {
            this.categories.push(x.column);
          }
        });

        const seriesItems = [];
        data.forEach((x) => {
          if (!seriesItems.find((y) => y === x.PROCESSID)) {
            seriesItems.push(x.PROCESSID);
          }
        });

        this.seriesData = seriesItems.map((x) => {
          const item = data.filter((y) => y.PROCESSID === x);

          return {
            name: item[0].PROCESSNAME,
            data: item,
            field: "inqty",
            category: "STIME",
          };
        });
      }
    },
    visual(e) {
      const BAR_SIZE = 30;
      //create the default visual
      var visual = e.createVisual();
      //scale it so that it has the predefined size
      //visual.transform(kendo.geometry.transform().scale(1, BAR_SIZE / e.rect.size.height, e.rect.center() ));
      return visual;
    },
    searchInput(nm, val) {
      // console.log(nm)
      this[nm] = val;
      // console.log(this.fromdate)
    },
  },
};
</script>
<style lang="scss"></style>
