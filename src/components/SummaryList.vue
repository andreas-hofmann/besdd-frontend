<template>
  <div>
    <b-spinner v-show="requestActive" class="mt-4"/>

    <template v-if="!requestActive">
      <p v-if="my_data.avg != null" id="averages" class="mt-3">
        Average sleep time: {{ my_data.avg.time }} hours in
        {{ my_data.avg.phases }} phases.<br />
        Average interval between sleeps: {{ my_data.avg.interval }} hours.
      </p>
      <div id="accordion" role="tablist">
        <summary-entry
          v-for="(data, idx) in my_data.data"
          :key="data.day"
          :idx="idx"
          :day="data.day"
          :summary="data.data"
        ></summary-entry>
      </div>
    </template>
  </div>
</template>

<script>
import SummaryEntry from "./SummaryEntry.vue";

import { LoadingMixin, UrlMixin } from "../mixins.js";

export default {
  name: 'SummaryList',

  props: {
      childid: Number,
      dates: {},
  },

  components: {
    SummaryEntry,
  },

  mixins: [
      LoadingMixin,
      UrlMixin
  ],

  data: function() {
    return {
      my_data: [],
    };
  },

  watch: {
      dates: function() { this.updateData(); },
      childid: function() { this.updateData(); },
  },

  created: function() {
    this.updateData();
  },

  methods: {
    updateData() {
      this.loadAjax(
      {
        url: this.getUrl("summary_data_list"),
        data: { from: this.dates.from, to: this.dates.to }
      })
      .done(data => {
        this.my_data = data;
      })
      .fail(() => {
        console.log("Error fetching list data");
      });
    },
  },
}
</script>