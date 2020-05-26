<template>
  <div>
    <b-spinner v-show="requestActive" class="mt-4"/>

    <b-container>
      <b-row>
        <b-col v-if="my_data.avg != null" id="averages" class="mt-3">
          <h5>Average sleep times</h5>
          {{ helpers.secToHHMM(my_data.avg.time) }} hours in
          {{ my_data.avg.phases }} phases.<br />
          Average interval: {{ helpers.secToHHMM(my_data.avg.interval) }} hours.
        </b-col>
        <b-col v-if="my_data.diaperstats" id="diapers" class="mt-3">
          <h5>Used diapers</h5>
          <div v-for="(count, type) in my_data.diaperstats" :key="type">
          {{ type }}: {{ count }}
          </div>
        </b-col>
      </b-row>
    </b-container>
    <template v-if="!requestActive">

      <div id="accordion" role="tablist" class="mt-3">
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

import * as helpers from '../helpers.js';

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
      helpers: helpers,
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