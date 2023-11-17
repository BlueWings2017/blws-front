<template>
    <div>
      <v-row>
      <v-col :cols="12">
        <kcard>
          <cardBody>
            <Chart>
              <ChartTitle :text="'Area'" />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  :categories="areaCategories"
                  :title="{
                    text: 'Months',
                  }"
                />
              </ChartCategoryAxis>
              <ChartSeries>
                <ChartSeriesItem :type="'area'" :data-items="areaFirstSeries" />
                <ChartSeriesItem :type="'area'" :data-items="areaSecondSeries" />
                <ChartSeriesItem :type="'area'" :data-items="areaThirdSeries" />
              </ChartSeries>
            </Chart>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="12">
        <kcard>
          <cardBody>
            <Chart>
              <ChartTitle :text="'Bar'" />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem :categories="barCategories">
                  <ChartCategoryAxisTitle :text="'Months'" />
                </ChartCategoryAxisItem>
              </ChartCategoryAxis>
              <ChartSeries>
                <ChartSeriesItem
                  :type="'bar'"
                  :gap="2"
                  :spacing="0.25"
                  :data-items="barFirstSeries"
                />
                <ChartSeriesItem :type="'bar'" :data-items="barSecondSeries" />
                <ChartSeriesItem :type="'bar'" :data-items="barThirdSeries" />
                <ChartSeriesItem :type="'bar'" :data-items="barFourthSeries" />
              </ChartSeries>
            </Chart>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="12">
        <kcard>
          <cardBody>
            <Chart>
              <ChartTitle :text="'Box Plot'" />
              <ChartSeries>
                <ChartSeriesItem
                  :type="'boxPlot'"
                  :lower-field="'lower'"
                  :q1-field="'q1'"
                  :median-field="'median'"
                  :q3-field="'q3'"
                  :upper-field="'upper'"
                  :outliers-field="'outliers'"
                  :mean-field="'mean'"
                  :category-field="'year'"
                  :data-items="baxPlotData"
                />
              </ChartSeries>
            </Chart>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="12">
        <kcard>
          <cardBody>
            <Chart>
              <ChartTitle :text="'Bubble'" />
              <ChartSeries>
                <ChartSeriesItem
                  :type="'bubble'"
                  :x-field="'x'"
                  :y-field="'y'"
                  :size-field="'size'"
                  :category-field="'category'"
                  :data-items="bubbleData"
                />
              </ChartSeries>
              <ChartXAxis>
                <ChartXAxisItem
                  :axis-crossing-value="-5000"
                  :major-unit="2000"
                  :plot-bands="bubblexPlotBands"
                  :labels="{ format: '{0:N0}', skip: 1, rotation: 'auto' }"
                />
              </ChartXAxis>
              <ChartYAxis>
                <ChartYAxisItem :labels="{ format: '{0:N0}' }" />
              </ChartYAxis>
              <ChartLegend :visible="true" />
              <ChartTooltip :format="'{3}: {2:N0} applications'" :opacity="1" />
            </Chart>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="12">
        <kcard>
          <cardBody>
            <Chart :style="{ height: '120px' }">
              <ChartTitle :text="'Temperature [&deg;C]'" />
              <ChartSeries>
                <ChartSeriesItem :type="'bullet'" :color="'#fff'" :data-items="bulletTemp" />
              </ChartSeries>
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  :major-grid-lines="hidden"
                  :minor-grid-lines="hidden"
                />
              </ChartCategoryAxis>
              <ChartValueAxis>
                <ChartValueAxisItem
                  :major-grid-lines="hidden"
                  :minor-ticks="hidden"
                  :min="-10"
                  :max="45"
                  :plot-bands="bulletTempPlotBands"
                />
              </ChartValueAxis>
              <ChartTooltip :render="'tooltipRender'">
                <template v-slot:tooltipRender="{ props }">
                  <span>
                    Maximum: {{ props.point.value.target }}
                    <br />
                    Average: {{ props.point.value.current }}
                  </span>
                </template>
              </ChartTooltip>
            </Chart>
            <Chart :style="{ height: '120px' }">
              <ChartTitle :text="'Humidity [%]'" />
              <ChartSeries>
                <ChartSeriesItem
                  :type="'bullet'"
                  :color="'#0058e9'"
                  :data-items="bulletHum"
                />
              </ChartSeries>
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  :major-grid-lines="hidden"
                  :minor-grid-lines="hidden"
                />
              </ChartCategoryAxis>
              <ChartValueAxis>
                <ChartValueAxisItem
                  :major-grid-lines="hidden"
                  :minor-ticks="hidden"
                  :min="0"
                  :max="100"
                  :plot-bands="bulletHumPlotBands"
                />
              </ChartValueAxis>
              <ChartTooltip :render="'tooltipRender'">
                <template v-slot:tooltipRender="{ props }">
                  <span>
                    Maximum: {{ props.point.value.target }}
                    <br />
                    Average: {{ props.point.value.current }}
                  </span>
                </template>
              </ChartTooltip>
            </Chart>
            <Chart :style="{ height: '120px' }">
              <ChartTitle :text="'Atmospheric pressure [mmHg]'" />
              <ChartSeries>
                <ChartSeriesItem :type="'bullet'" :color="'#111'" :data-items="bulletMmhg" />
              </ChartSeries>
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  :major-grid-lines="hidden"
                  :minor-grid-lines="hidden"
                />
              </ChartCategoryAxis>
              <ChartValueAxis>
                <ChartValueAxisItem
                  :major-grid-lines="hidden"
                  :minor-ticks="hidden"
                  :min="715"
                  :max="795"
                  :plot-bands="bulletMmhgPlotBands"
                />
              </ChartValueAxis>
              <ChartTooltip :render="'tooltipRender'">
                <template v-slot:tooltipRender="{ props }">
                  <span>
                    Maximum: {{ props.point.value.target }}
                    <br />
                    Average: {{ props.point.value.current }}
                  </span>
                </template>
              </ChartTooltip>
            </Chart>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <Chart>
              <ChartTitle :text="'Donut'" />
              <ChartSeries>
                <ChartSeriesItem
                  :type="'donut'"
                  :data-items="donutData"
                  :category-field="'kind'"
                  :field="'share'"
                >
                  <ChartSeriesLabels
                    :color="'#fff'"
                    :background="'none'"
                    :content="donutLabelContent"
                  />
                </ChartSeriesItem>
              </ChartSeries>
              <ChartLegend :visible="false" />
            </Chart>
          </cardBody>
        </kcard>
      </v-col>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <Chart>
              <ChartTitle :text="'Pie'" />
              <ChartLegend :position="'bottom'" />
              <ChartSeries>
                <ChartSeriesItem
                  :type="'pie'"
                  :data-items="pieData"
                  :field="'value'"
                  :category-field="'category'"
                  :labels="{ visible: true, content: pieLabelContent }"
                />
              </ChartSeries>
            </Chart>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="6">
        <kcard>
          <cardBody>
            <Chart>
              <ChartTitle text="Radar" />
              <ChartSeries>
                <ChartSeriesItem
                  :type="'radarLine'"
                  :data-items="radarData"
                  :field="'pre'"
                  :category-field="'name'"
                  :name="'Market value as of 2007'"
                />
                <ChartSeriesItem
                  :type="'radarLine'"
                  :data-items="radarData"
                  :field="'post'"
                  :category-field="'name'"
                  :name="'Market value as of 2009'"
                />
              </ChartSeries>
              <ChartValueAxis>
                <ChartValueAxisItem
                  :labels="{
                    format: 'C0',
                  }"
                />
              </ChartValueAxis>
              <ChartLegend :position="'bottom'" />
            </Chart>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="12">
        <kcard>
          <cardBody>
            <Chart>
              <ChartTitle :text="'Scatter'" />
              <ChartSeries>
                <ChartSeriesItem
                  :type="'scatter'"
                  :data-items="scatterData"
                  :x-field="'rainfall'"
                  :y-field="'windSpeed'"
                />
              </ChartSeries>
              <ChartXAxis>
                <ChartXAxisItem :title="{ text: 'Wind Speed [km/h]' }" />
              </ChartXAxis>
              <ChartYAxis>
                <ChartYAxisItem
                  :title="{
                    text: 'Rainfall [mm]',
                  }"
                />
              </ChartYAxis>
            </Chart>
          </cardBody>
        </kcard>
      </v-col>
    </v-row>
  </div>
</template>
  <script>
  import mixinGlobal from "@/mixin/global.js";
  import Utility from "~/plugins/utility";
  import {
    Chart,
    ChartTooltip,
    ChartTitle,
    ChartLegend,
    ChartSeries,
    ChartSeriesItem,
    ChartXAxis,
    ChartXAxisItem,
    ChartYAxis,
    ChartYAxisItem,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartCategoryAxisTitle,
    ChartValueAxis,
    ChartValueAxisItem,
    ChartSeriesLabels
  } from "@progress/kendo-vue-charts";
  import { Card, CardBody, CardTitle, CardActions } from "@progress/kendo-vue-layout";
  let myTitle;
  let myMenuId;
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
      closable: true
    },
    components: {
      Chart,
      ChartTooltip,
      ChartTitle,
      ChartLegend,
      ChartSeries,
      ChartSeriesItem,
      ChartXAxis,
      ChartXAxisItem,
      ChartYAxis,
      ChartYAxisItem,
      ChartCategoryAxis,
      ChartCategoryAxisItem,
      ChartCategoryAxisTitle,
      ChartValueAxis,
      ChartValueAxisItem,
      ChartSeriesLabels,

      CardBody, 
      CardTitle, 
      CardActions,
      "kcard" : Card,
    },
    data() {
      return {
        areaCategories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        areaFirstSeries: [123, 276, 310, 212, 240, 156, 98],
        areaSecondSeries: [165, 210, 287, 144, 190, 167, 212],
        areaThirdSeries: [56, 140, 195, 46, 123, 78, 95],

        barFirstSeries: [100, 123, 234, 343],
        barSecondSeries: [120, 67, 231, 196],
        barThirdSeries: [45, 124, 189, 143],
        barFourthSeries: [87, 154, 210, 215],
        barCategories: ["Q1", "Q2", "Q3", "Q4"],

        baxPlotData: [{
            "lower": 1.3,
            "q1": 2.15,
            "median": 2.95,
            "q3": 3.725,
            "upper": 4.7,
            "mean": 2.9,
            "outliers": [1, 9],
            "year": "1996"
        }, {
            "lower": 2,
            "q1": 3.825,
            "median": 5.45,
            "q3": 6.425,
            "upper": 8.2,
            "mean": 5.2,
            "outliers": [1.5, 2, 8.9],
            "year": "1997"
        }, {
            "lower": 3.8,
            "q1": 4.725,
            "median": 5.55,
            "q3": 5.75,
            "upper": 8.7,
            "mean": 5.5,
            "year": "1998"
        }, {
            "lower": 3,
            "q1": 4.375,
            "median": 4.95,
            "q3": 5.85,
            "upper": 8,
            "mean": 5.2,
            "outliers": [3, 9.5],
            "year": "1999"
        }, {
            "lower": 2.5,
            "q1": 3.925,
            "median": 4.15,
            "q3": 4.45,
            "upper": 5.1,
            "mean": 4.1,
            "year": "2000"
        }, {
            "lower": 2.4,
            "q1": 3.725,
            "median": 4.95,
            "q3": 5.85,
            "upper": 7.7,
            "mean": 4.9,
            "outliers": [2.1, 8.3, 9.8],
            "year": "2001"
        }, {
            "lower": 1.7,
            "q1": 2.3,
            "median": 3.9,
            "q3": 5,
            "upper": 5.5,
            "mean": 3.7,
            "outliers": [1.1, 9.1],
            "year": "2002"
        }, {
            "lower": 2.2,
            "q1": 2.5,
            "median": 3.1,
            "q3": 3.975,
            "upper": 4.3,
            "mean": 3.2,
            "outliers": [1.6, 1.8, 9.8],
            "year": "2003"
        }, {
          "lower": 1.9,
          "q1": 2.7,
          "median": 3.35,
          "q3": 4.575,
          "upper": 5.7,
          "mean": 3.6,
          "outliers": [1.1, 8.3],
          "year": "2004"
        }, {
            "lower": 1.7,
            "q1": 2.65,
            "median": 3.3,
            "q3": 4.05,
            "upper": 5,
            "mean": 3.4,
            "year": "2005"
        }, {
            "lower": 1.4,
            "q1": 2.25,
            "median": 3.3,
            "q3": 4.65,
            "upper": 5.7,
            "mean": 3.4,
            "year": "2006"
        }, {
            "lower": 1.9,
            "q1": 2.85,
            "median": 4,
            "q3": 4.45,
            "upper": 6.1,
            "mean": 3.9,
            "outliers": [1, 1.2],
            "year": "2007"
        }, {
            "lower": 1.5,
            "q1": 2.35,
            "median": 4.1,
            "q3": 5.225,
            "upper": 5.7,
            "mean": 3.9,
            "outliers": [9, 9.5],
            "year": "2008"
        }, {
            "lower": 1.8,
            "q1": 2.325,
            "median": 3.35,
            "q3": 4,
            "upper": 5.4,
            "mean": 3.3,
            "outliers": [1, 6],
            "year": "2009"
        }, {
          "lower": 1.8,
          "q1": 2.75,
          "median": 3.35,
          "q3": 3.825,
          "upper": 4.9,
          "mean": 3.4,
          "year": "2010"
        }, {
            "lower": 1.7,
            "q1": 2.275,
            "median": 3.2,
            "q3": 3.825,
            "upper": 5.5,
            "mean": 3.2,
            "outliers": [0.5, 6.7],
            "year": "2011"
        }, {
            "lower": 1.2,
            "q1": 1.95,
            "median": 2.45,
            "q3": 3.075,
            "upper": 3.5,
            "mean": 2.5,
            "year": "2012"
        }, {
            "lower": 1.3,
            "q1": 1.9,
            "median": 3.05,
            "q3": 3.425,
            "upper": 4,
            "mean": 2.7,
            "outliers": [7, 8.5],
            "year": "2013"
        }],
        bubblexPlotBands : [
          {
            from: -5000,
            to: 0,
            color: "#00f",
            opacity: 0.05,
          },
        ],
        bubbleData : [{
            "x": -2500,
            "y": 50000,
            "size": 500000,
            "category": "Microsoft"
        }, {
            "x": 500,
            "y": 110000,
            "size": 7600000,
            "category": "Starbucks"
        }, {
            "x": 7000,
            "y": 19000,
            "size": 700000,
            "category": "Google"
        }, {
            "x": 1400,
            "y": 150000,
            "size": 700000,
            "category": "Publix Super Markets"
        }, {
            "x": 2400,
            "y": 30000,
            "size": 300000,
            "category": "PricewaterhouseCoopers"
        }, {
            "x": 2450,
            "y": 34000,
            "size": 90000,
            "category": "Cisco"
        }, {
            "x": 2700,
            "y": 34000,
            "size": 400000,
            "category": "Accenture"
        }, {
            "x": 2900,
            "y": 40000,
            "size": 450000,
            "category": "Deloitte"
        }, {
            "x": 3000,
            "y": 55000,
            "size": 900000,
            "category": "Whole Foods Market"
        }],
        hidden: { visible: false },
        bulletTempPlotBands: [
          {
            from: 30,
            to: 45,
            color: "#e62325",
            opacity: 1,
          },
          {
            from: 15,
            to: 30,
            color: "#ffc000",
            opacity: 1,
          },
          {
            from: 0,
            to: 15,
            color: "#37b400",
            opacity: 1,
          },
          {
            from: -10,
            to: 0,
            color: "#5392ff",
            opacity: 1,
          },
        ],
        bulletHumPlotBands: [
          {
            from: 0,
            to: 33,
            color: "#ccc",
            opacity: 0.6,
          },
          {
            from: 33,
            to: 66,
            color: "#ccc",
            opacity: 0.3,
          },
        ],
        bulletMmhgPlotBands: [
          {
            from: 715,
            to: 752,
            color: "#ccc",
            opacity: 0.6,
          },
          {
            from: 752,
            to: 772,
            color: "#ccc",
            opacity: 0.3,
          },
        ],
        bulletTemp: [[25, 22]],
        bulletHum: [[45, 60]],
        bulletMmhg: [[750, 762]],
        donutLabelContent: labelContent,
        donutData: [ 
          { "kind": "Hydroelectric", "share": 0.175}, 
          { "kind": "Nuclear", "share": 0.238}, 
          { "kind": "Coal", "share": 0.118}, 
          { "kind": "Solar", "share": 0.052}, 
          { "kind": "Wind", "share": 0.225}, 
          { "kind": "Other", "share": 0.192}
        ],
        pieData: [
          {
            category: "0-14",
            value: 0.2545,
          },
          {
            category: "15-24",
            value: 0.1552,
          },
          {
            category: "25-54",
            value: 0.4059,
          },
          {
            category: "55-64",
            value: 0.0911,
          },
          {
            category: "65+",
            value: 0.0933,
          },
        ],
        radarData: [
            { "name": "JP Morgan", "pre": 116, "post": 64 },
            { "name": "HSBC", "pre": 165, "post": 85 },
            { "name": "Credit Suisse", "pre": 215, "post": 97 },
            { "name": "Goldman Sachs", "pre": 75, "post": 27 },
            { "name": "Morgan Stanley", "pre": 100, "post": 16 },
            { "name": "Societe Generale", "pre": 49, "post": 26 },
            { "name": "UBS", "pre": 80, "post": 35 },
            { "name": "BNP Paribas", "pre": 116, "post": 32 },
            { "name": "Unicredit", "pre": 108, "post": 26 },
            { "name": "Credit Agricole", "pre": 90, "post": 17 },
            { "name": "Deutsche Bank", "pre": 67, "post": 10 },
            { "name": "Barclays", "pre": 76, "post": 7 },
            { "name": "Citigroup",  "pre": 91, "post": 19 },
            { "name": "RBS", "pre": 255, "post": 5 }
        ],
        scatterData: [
            { "windSpeed": 16.4, "rainfall": 5.4 },
            { "windSpeed": 21.7, "rainfall": 2 },
            { "windSpeed": 25.4, "rainfall": 3 },
            { "windSpeed": 19, "rainfall": 2 },
            { "windSpeed": 10.9, "rainfall": 1 },
            { "windSpeed": 13.6, "rainfall": 3.2 },
            { "windSpeed": 10.9, "rainfall": 7.4 },
            { "windSpeed": 10.9, "rainfall": 0 },
            { "windSpeed": 10.9, "rainfall": 8.2 },
            { "windSpeed": 16.4, "rainfall": 0 },
            { "windSpeed": 16.4, "rainfall": 1.8 },
            { "windSpeed": 13.6, "rainfall": 0.3 },
            { "windSpeed": 29.9, "rainfall": 0 },
            { "windSpeed": 27.1, "rainfall": 2.3 },
            { "windSpeed": 16.4, "rainfall": 0 }
        ]
      }
    },
    computed: {
    },
    watch: {
    },
    beforeCreate() {
    },
    methods: {
      pieLabelContent(props) {
        let formatedNumber = Number(props.dataItem.value).toLocaleString(
          undefined,
          {
            style: "percent",
            minimumFractionDigits: 2,
          }
        );
        return `${props.dataItem.category} years old: ${formatedNumber}`;
      },
    }
  };
  const labelContent = (e) => e.category;
  const defaultData = {
  };
  </script>
  <style lang="scss">

  </style>