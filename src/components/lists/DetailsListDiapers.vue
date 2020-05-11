<template>
  <div>
    <b-table ref="table" primary-key="id" :busy="requestActive" small head-variant="light" outlined :items="data" responsive="sm" :fields="['date', 'time', 'contents', 'actions']">
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
        </div>
      </template>
      <template v-slot:cell(date)="row">
        {{ helpers.localdate(row.item.time) }}
      </template>
      <template v-slot:cell(time)="row">
        {{ helpers.localtime(row.item.time) }}
      </template>
      <template v-slot:cell(contents)="row">
        {{ allContents(row.item.contents) }}
      </template>

      <template v-slot:cell(actions)="row">
        <b-button size="sm" @click="accordion(row)" class="mr-2">
          {{ row.detailsShowing ? 'Cancel' : 'Edit'}}
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-container>
          <b-row>
            <b-col />
            <b-col cols=10>
              <b-card>
                <FormDiaper :id="row.item.id" @updated="fetchData" @deleted="fetchData" />
              </b-card>
            </b-col>
            <b-col />
          </b-row>
        </b-container>
      </template>
    </b-table>
  </div>
</template>

<script>
import { UrlMixin, LoadingMixin, TableAccordionMixin } from "../../mixins.js";
import * as helpers from '../../helpers.js';

import FormDiaper from '../forms/FormDiaper.vue';

export default {
  name: 'DetailsListDiapers',

  components: {
    FormDiaper,
  },

  mixins: [
      UrlMixin,
      LoadingMixin,
      TableAccordionMixin
  ],

  props: {
    dates: {},
    childid: Number,
  },

  data: function() {
    return {
        helpers: helpers
    };
  },

  watch: {
    dates:    function() { this.fetchData(); },
    childid: function() { this.fetchData(); },
  },

  created:   function() { this.fetchData(); },

  methods: {
    allContents(contents) {
      let ret = ""
      for (const i in contents) {
        if (i > 0)
          ret += ", ";
        ret += String(contents[i])
      }
      return ret;
    },
    fetchData() {
      this.loadAjax({ url: this.getUrl("diapers"), data: { from: this.dates.from, to: this.dates.to } })
      .done(data => {
        this.initAccordion(data);
      })
      .fail(() => {
          console.log("Error fetching data.");
      });
    },
  },
}
</script>