<template>
  <div id="example">
    <link
      rel="stylesheet"
      href="https://kendo.cdn.telerik.com/2023.1.117/styles/kendo.default-nordic.min.css"
    />
    <ol class="page-navigation">
      <li>홈</li>
      <li>리포트</li>
      <li>재공조회</li>
    </ol>
    <v-row>
      <v-col :cols="12" class="k-pivotgrid-wrapper">
        <div id="configurator" class="k-card-style hidden-on-narrow"></div>
        <div id="pivotgrid" class="k-card-style"></div>
      </v-col>
    </v-row>
    <div
      id="chart"
      class="k-card-style"
      style="margin-top: 10px; height: 700px"
    >
      <Chart
        style="height: 100%"
        :pannable="{
          lock: 'x',
        }"
        :zoomable="{
          lock: 'x',
        }"
      >
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
  </div>
</template>
<script>
let myTitle;
let myMenuId;
import mixinGlobal from '@/mixin/global.js';
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartCategoryAxisTitle,
  ChartLegend,
  ChartSeriesDefaults,
  ChartSeriesItemTooltip,
} from '@progress/kendo-vue-charts';

export default {
  mixins: [mixinGlobal],
  async asyncData(context) {
    const myState = context.store.state;
    myMenuId = context.route.query.menuId;
    await context.store.commit('setActiveMenuInfo', myState.menuData[myMenuId]);
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
      apiKey: 'mes/common/getqueryresult',
      queryId: 'GetProvisionReport',
      sendParam: {
        plantid: 'LS',
      },
    });
    window._this = this;

    var collapsed = {
      columns: [],
      rows: [],
    };

    var pivotgrid = $('#pivotgrid')
      .kendoPivotGrid({
        filterable: true,
        sortable: true,
        collapseMember: function (e) {
          var axis = collapsed[e.axis];
          var path = e.path;

          if (_this.indexOfPath(path, axis) === -1) {
            axis.push(path);
          }
        },
        expandMember: function (e) {
          var axis = collapsed[e.axis];
          var index = _this.indexOfPath(e.path, axis);

          if (index !== -1) {
            axis.splice(index, 1);
          }
        },
        columnWidth: 100,
        //height: 700,
        height: '100%',
        dataSource: {
          data: _this.reportData,
          schema: {
            model: {
              fields: {
                PLANTID: { type: 'string' },
                PRODUCTID: { type: 'string' },
                PRODUCTNAME: { type: 'string' },
                PROCESSNAME: { type: 'string' },
                tqty: { type: 'number' },
              },
            },
            cube: {
              dimensions: {
                PLANTID: { caption: '공장' },
                PRODUCTID: { caption: '제품ID' },
                PRODUCTNAME: { caption: '제품명' },
                PROCESSNAME: { caption: '프로세스명' },
              },
              measures: {
                합계: {
                  field: 'tqty',
                  format: '{0:###,###,###,###}',
                  aggregate: 'sum',
                },
                평균: {
                  field: 'tqty',
                  format: '{0:###,###,###,###}',
                  aggregate: 'average',
                },
              },
            },
          },
          columns: [{ name: 'PRODUCTNAME' }],
          rows: [{ name: 'PROCESSNAME' }],
          measures: ['합계', '평균'],
          error: function (e) {
            alert('error: ' + kendo.stringify(e.errors[0]));
          },
        },
        dataBound: function () {
          _this.initChart(this.dataSource);
        },
      })
      .data('kendoPivotGrid');

    $('#configurator').kendoPivotConfigurator({
      dataSource: pivotgrid.dataSource,
      filterable: true,
      sortable: true,
      //height: 700,
      height: '100%',
    });

    this.initChart();
  },
  methods: {
    flattenTree(tuples) {
      tuples = tuples.slice();
      var result = [];
      var tuple = tuples.shift();
      var idx, length, spliceIndex, children, member;

      while (tuple) {
        if (tuple.dataIndex !== undefined) {
          result.push(tuple);
        }

        spliceIndex = 0;
        for (idx = 0, length = tuple.members.length; idx < length; idx++) {
          member = tuple.members[idx];
          children = member.children;
          if (member.measure) {
            [].splice.apply(
              tuples,
              [0, 0].concat(this.expandMeasures(children, tuple))
            );
          } else {
            [].splice.apply(tuples, [spliceIndex, 0].concat(children));
          }
          spliceIndex += children.length;
        }

        tuple = tuples.shift();
      }

      return result;
    },

    clone(tuple, dataIndex) {
      var members = tuple.members.slice();

      return {
        dataIndex: dataIndex,
        members: $.map(members, function (m) {
          return $.extend({}, m, { children: [] });
        }),
      };
    },

    replaceLastMember(tuple, member) {
      tuple.members[tuple.members.length - 1] = member;
      return tuple;
    },

    expandMeasures(measures, tuple) {
      return $.map(measures, function (measure) {
        return _this.replaceLastMember(
          _this.clone(tuple, measure.dataIndex),
          measure
        );
      });
    },

    isCollapsed(tuple, collapsed) {
      var members = tuple.members;

      for (var idx = 0, length = collapsed.length; idx < length; idx++) {
        var collapsedPath = collapsed[idx];
        if (
          this.indexOfPath(this.fullPath(members, collapsedPath.length - 1), [
            collapsedPath,
          ]) !== -1
        ) {
          return true;
        }
      }

      return false;
    },

    indexOfPath(path, paths) {
      var path = path.join(',');

      for (var idx = 0; idx < paths.length; idx++) {
        if (paths[idx].join(',') === path) {
          return idx;
        }
      }

      return -1;
    },

    fullPath(members, idx) {
      var path = [];
      var parentName = members[idx].parentName;

      idx -= 1;

      while (idx > -1) {
        path.push(members[idx].name);
        idx -= 1;
      }

      path.push(parentName);

      return path;
    },

    memberCaption(member) {
      return member.caption;
    },

    extractCaption(members) {
      return $.map(members, function (members) {
        return members.caption;
      }).join(' ');
    },

    fullPathCaptionName(members, dLength, idx) {
      var result = this.extractCaption(members.slice(0, idx + 1));
      var measureName = this.extractCaption(
        members.slice(dLength, members.mLength)
      );

      if (measureName) {
        result += ' - ' + measureName;
      }

      return result;
    },

    convertData(dataSource, collapsed) {
      var columnDimensionsLength = dataSource.columns().length;
      var rowDimensionsLength = dataSource.rows().length;

      var columnTuples = this.flattenTree(
        dataSource.axes().columns.tuples || [],
        collapsed.columns
      );
      var rowTuples = this.flattenTree(
        dataSource.axes().rows.tuples || [],
        collapsed.rows
      );
      var data = dataSource.data();
      var rowTuple, columnTuple;

      var idx = 0;
      var result = [];
      var columnsLength = columnTuples.length;

      for (var i = 0; i < rowTuples.length; i++) {
        rowTuple = rowTuples[i];

        if (!this.isCollapsed(rowTuple, collapsed.rows)) {
          for (var j = 0; j < columnsLength; j++) {
            columnTuple = columnTuples[j];

            if (!this.isCollapsed(columnTuple, collapsed.columns)) {
              if (idx > columnsLength && idx % columnsLength !== 0) {
                for (var ri = 0; ri < rowTuple.members.length; ri++) {
                  for (var ci = 0; ci < columnTuple.members.length; ci++) {
                    if (
                      !columnTuple.members[ci].parentName ||
                      !rowTuple.members[ri].parentName
                    ) {
                      continue;
                    }

                    result.push({
                      measure: Number(data[idx].value),
                      column: this.fullPathCaptionName(
                        columnTuple.members,
                        columnDimensionsLength,
                        ci
                      ),
                      row: this.fullPathCaptionName(
                        rowTuple.members,
                        rowDimensionsLength,
                        ri
                      ),
                    });
                  }
                }
              }
            }
            idx += 1;
          }
        }
      }

      return result;
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

        data.forEach(x => {
          const category = [];
          columns.forEach(col => {
            category.push(x[col.name[0]]);
          });
          x.category = category.join('|');

          if (!this.categories.find(y => y === x.category)) {
            this.categories.push(x.category);
          }

          const seriesName = [];
          rows.forEach(row => {
            seriesName.push(x[row.name[0]]);
          });
          x.seriesName = seriesName.join(' | ');

          if (!seriesItems.find(y => y === x.seriesName)) {
            seriesItems.push(x.seriesName);
          }
        });

        this.seriesData = seriesItems.map(x => {
          const item = data.filter(y => y.seriesName === x);

          return {
            name: item[0].seriesName,
            data: item,
            field: 'tqty',
            category: 'category',
          };
        });
      } else {
        data.forEach(x => {
          if (!this.categories.find(y => y === x.PRODUCTNAME)) {
            this.categories.push(x.PRODUCTNAME);
          }
        });

        const seriesItems = [];
        data.forEach(x => {
          if (!seriesItems.find(y => y === x.PROCESSNAME)) {
            seriesItems.push(x.PROCESSNAME);
          }
        });

        this.seriesData = seriesItems.map(x => {
          const item = data.filter(y => y.PROCESSNAME === x);

          return {
            name: item[0].PROCESSNAME,
            data: item,
            field: 'tqty',
            category: 'PRODUCTNAME',
          };
        });
      }

      //   var chart = $("#chart").data("kendoChart");

      //   if (!chart) {
      //     $("#chart").kendoChart({
      //       dataSource: {
      //         data: data,
      //         group: "row",
      //       },
      //       series: [
      //         {
      //           type: "bar",
      //           field: "measure",
      //           name: "#= group.value # ",
      //           categoryField: "column",
      //         },
      //       ],
      //       legend: {
      //         position: "bottom",
      //       },
      //       categoryAxis: {
      //         labels: {
      //           rotation: 310,
      //         },
      //       },
      //       valueAxis: {
      //         labels: {
      //           format: "{0}",
      //         },
      //       },
      //       dataBound: function (e) {
      //         var categoryAxis = e.sender.options.categoryAxis;
      //         if (categoryAxis && categoryAxis.categories) {
      //           categoryAxis.categories.sort();
      //         }
      //       },
      //     });
      //   } else {
      //     chart.dataSource.data(data);
      //   }
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
