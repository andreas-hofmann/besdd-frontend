<template>
    <div>
      <b-aspect aspect="21:9">
      <b-spinner v-show="requestActive" class="mt-4"/>
      <Plotly
        v-show="!requestActive"
        v-bind:data="plot_data"
        v-bind:layout="plot_layout"
        :display-mode-bar="false"
        :responsive="true"
      ></Plotly>
      </b-aspect>
    </div>
</template>

<script>
import { Plotly } from "vue-plotly";

import { LoadingMixin, UrlMixin } from "../mixins.js";

export default {
  name: 'SummaryPlots',

  components: {
      Plotly
  },

  mixins: [
      LoadingMixin,
      UrlMixin
  ],

  props: {
    graph_type: String,
    dates: {},
    childid: Number
  },

  data: function() {
    return {
      plot_data: [],
      plot_layout: {},
      plots_enabled: {
        sleep: true,
        meals: false,
        diapers: false
      },
    };
  },

  created: function() {
    this.updateGraph();
  },

  watch: {
    dates: function() { this.updateGraph(); },
    childid: function() { this.updateGraph(); },
    graph_type: function() { this.updateGraph(); },
  },

  methods: {
    updateGraph() {
      var plots = {
        sleep: this.plots_enabled.sleep === true ? true : "legendonly",
        meals: this.plots_enabled.meals === true ? true : "legendonly",
        diapers: this.plots_enabled.diapers === true ? true : "legendonly"
      };
      if (this.graph_type === "timeline") {
        this.load_time_graph(
          this.getUrl("summary_data_graph"),
          {
            from: this.dates.from,
            to: this.dates.to
          },
          {
            plots: plots
          }
        );
      } else if (this.graph_type === "histogram") {
        this.load_histogram(
          this.getUrl("histogram_data"),
          {
            from: this.dates.from,
            to: this.dates.to
          },
          {
            plots: plots
          }
        );
      } else if (this.graph_type === "measurements") {
        this.load_measurement_graph(
          this.getUrl("measurement_data"),
        );
      } else if (this.graph_type === "height") {
        this.load_percentile_graph(
          this.getUrl("percentile_data", 'height'),
        );
      } else if (this.graph_type === "weight") {
        this.load_percentile_graph(
          this.getUrl("percentile_data", 'weight'),
        );
      }
    },
    load_percentile_graph: function(url, get) {
      this.loadAjax({ url: url, data: get })
        .done(data => {
          this.plot_data = [
            { name: "value", y: data["value"], marker: { color: "blue", size: 10 }, x: data["day"], type: "lines", mode: "markers" },
            { name: "p5", y: data["p5"], x: data["day"],   type: "lines", line: { dash: "dashdot", shape: "spline", width: 1, color: "red" } },
            { name: "p10", y: data["p10"], x: data["day"], type: "lines", line: { dash: "dot", shape: "spline", width: 1, color: "orange" } },
            { name: "p25", y: data["p25"], x: data["day"], type: "lines", line: { dash: "dashdot", shape: "spline", width: 1, color: "grey" } },
            { name: "p50", y: data["p50"], x: data["day"], type: "lines", line: { dash: "solid", shape: "spline", width: 1, color: "black" } },
            { name: "p75", y: data["p75"], x: data["day"], type: "lines", line: { dash: "dashdot", shape: "spline", width: 1, color: "grey" } },
            { name: "p90", y: data["p90"], x: data["day"], type: "lines", line: { dash: "dot", shape: "spline", width: 1, color: "orange" } },
            { name: "p95", y: data["p95"], x: data["day"], type: "lines", line: { dash: "dashdot", shape: "spline", width: 1, color: "red" } }
          ];
          this.plot_layout = {
            yaxis: { showticklabels: true },
            xaxis: { title: "Age (days)" }
          };
        });
    },

    load_measurement_graph: function(url, get) {
      this.loadAjax({ url: url, data: get })
        .done(data => {
          this.plot_data = [
            { name: "Height", y: data["height"], connectgaps: true, marker: { color: "blue" },  x: data["age_weeks"], mode: "lines+markers", line: { dash: "dot", shape: "spline", width: 1, color: "grey" } },
            { name: "Weight", y: data["weight"], connectgaps: true, marker: { color: "green" }, x: data["age_weeks"], mode: "lines+markers", line: { dash: "dot", shape: "spline", width: 1, color: "grey" } },
            { name: "Events", y: data["nr_events"], x: data["age_weeks"], type: "histogram", histfunc: "sum", opacity: 0.3, marker: { color: "red" } }
          ];
          this.plot_layout = {
            yaxis: { showticklabels: true },
            xaxis: { title: "Age (weeks)" }
          };
        });
    },

    load_time_graph: function(url, get, options) {
      this.loadAjax({ url: url, data: get })
        .done(data => {
          this.plot_data = [
            { name: "Night (h)", y: data["night_h"], text: data["night_cnt"],                marker: { color: "rgb(100,000,230)" }, x: data["day"], type: "bar", visible: options.plots.sleep },
            { name: "Day (h)",   y: data["day_h"],   text: data["day_cnt"],                  marker: { color: "rgb(245,200,050)" }, x: data["day"], type: "bar", visible: options.plots.sleep },
            { name: "Total (h)", y: data["sum_h"],   text: data["sum_cnt"], mode: "markers", marker: { color: "rgb(000,000,000)" }, x: data["day"], type: "scatter", visible: options.plots.sleep },
            { name: "Diapers",   y: data["diapers"], mode: "markers", marker: { color: "rgb(0,200,050)" }, x: data["day"], type: "scatter", visible: options.plots.diapers },
            { name: "Meals",     y: data["meals"],   mode: "markers", marker: { color: "rgb(245,0,050)" }, x: data["day"], type: "scatter", visible: options.plots.meals }
          ];
          this.plot_layout = {
            yaxis: { showticklabels: true },
            barmode: "stack"
          };
        });
    },

    load_histogram: function(url, get, options) {
      this.loadAjax({ url: url, data: get })
        .done(data => {
          this.plot_data = [
            { name: "Sleep", type: "histogram", histfunc: "sum", x: data["time"], y: data["sleep"], visible: options.plots.sleep },
            { name: "Meals", type: "histogram", histfunc: "sum", x: data["time"], y: data["meals"], visible: options.plots.meals },
            { name: "Diapers", type: "histogram", histfunc: "sum", x: data["time"], y: data["diapers"], visible: options.plots.diapers }
          ];
          this.plot_layout = {
            xaxis: { autotick: false, tick0: 0, dtick: 6 },
            yaxis: { showticklabels: false }
          };
        });
    }
  }
}
</script>