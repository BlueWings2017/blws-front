import Vue from "vue";
import { use } from "echarts/core";
import VChart from "vue-echarts";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import { PieChart, LineChart, BarChart, GaugeChart, SankeyChart, SunburstChart, TreemapChart, TreeChart, ScatterChart  } from "echarts/charts";
import 'echarts/lib/component/markArea'
import "echarts/lib/component/markLine";
import "echarts/lib/component/markPoint";

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  ToolboxComponent,
  VisualMapComponent
  // ToolboxComponent, // 그래프 이미지 save
} from "echarts/components";

use([
  PieChart,
  LineChart,
  BarChart,
  GaugeChart,
  SankeyChart,
  SunburstChart,
  TreemapChart,
  TreeChart,
  ScatterChart,
  CanvasRenderer,
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  ToolboxComponent,
  VisualMapComponent
  // ToolboxComponent, // 그래프 이미지 save
]);

Vue.component("VChart", VChart);

