<template>
  <b-container>
    <b-row class="mt-2">
      <b-col></b-col>
      <b-col cols="8">
        <SummaryTabbar />
      </b-col>
      <b-col></b-col>
    </b-row>

    <b-row>
      <b-col></b-col>
      <b-col cols="12">
        <div v-if="graph_type == 'list'" id="my-list">
          <SummaryList :dates="dates" :childid="childid" />
        </div>
        <div v-else-if="validGraphType()">
          <SummaryPlots :dates="dates" :childid="childid" :graph_type="graph_type" />
        </div>
        <div v-else>
          Invalid graph type selected!
        </div>
      </b-col>
      <b-col></b-col>
    </b-row>

    <b-row v-show="selectRange == true" id="dateselector">
      <b-col></b-col>
      <b-col>
        <date-range-selector
          :date-range-days="dateRangeDays"
          @dates="receiveDates"
        >
        </date-range-selector>
      </b-col>
      <b-col></b-col>
    </b-row>
  </b-container>
</template>

<script>
import SummaryList from "../components/SummaryList.vue";
import SummaryPlots from "../components/SummaryPlots.vue";
import SummaryTabbar from "../components/SummaryTabbar.vue";
import DateRangeSelector from "../components/DateRangeSelector.vue";

import moment from 'moment';

export default {
  name: "summary-view",

  components: {
    SummaryTabbar,
    SummaryList,
    SummaryPlots,
    DateRangeSelector,
  },

  props: {
    child_id: Number,
    graph_type: String
  },

  data: function() {
    return {
      selectRange: true,
      plot_data: [],
      plot_layout: {},
      plots_enabled: {
        sleep: true,
        meals: false,
        diapers: false
      },
      dateRangeDays: this.$root.usersettings.date_range_days,
      dates: {
        from: moment().format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
      },
    };
  },

  computed: {
    childid: function() {
      return this.$root.userdata.currentChild.id;
    }
  },

  watch: {
    graph_type: function() {
      this.updateTimeSelector();
    },
  },

  created: function() {
    this.updateTimeSelector();
  },

  methods: {
    receiveDates(dates) {
      this.dates = dates;
    },
    validGraphType() {
      switch (this.graph_type) {
        case 'list':
        case 'timeline':
        case 'histogram':
        case 'measurements':
        case 'weight':
        case 'height':
          return true;
        default:
          return false;
      }
    },
    updateTimeSelector() {
      if (this.graph_type === "list") {
        this.selectRange = true;
      } else if (this.graph_type === "histogram") {
        this.selectRange = true;
      } else if (this.graph_type === "timeline") {
        this.selectRange = true;
      } else {
        this.selectRange = false;
      }
    },
  }
};
</script>
