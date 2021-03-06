<template>
  <div>
    <b-table ref="table" primary-key="id" :busy="requestActive" small head-variant="light" outlined :items="data" responsive="sm" :fields="fields">
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
        </div>
      </template>
      <template v-slot:cell(date)="row">
        {{ helpers.localdate(row.item.dt) }}
      </template>
      <template v-slot:cell(from)="row">
        {{ helpers.localtime(row.item.dt) }}
      </template>
      <template v-slot:cell(to)="row">
        {{ helpers.localtime(row.item.dt_end) }}
      </template>
      <template v-slot:cell(duration)="row">
        {{ helpers.durationHours(row.item.dt, row.item.dt_end) }}
      </template>
      <template v-slot:cell(comment)="row">
        {{ row.item.comment }}
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
                <FormSleep :id="row.item.id" @updated="fetchData" @deleted="fetchData" />
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

import FormSleep from '../forms/FormSleep.vue';

import _ from 'lodash';

export default {
  name: 'DetailsListSleep',

  components: {
    FormSleep,
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

  computed: {
    fields: function() {
      let my_fields = ['date', 'from', 'to', 'duration', 'comment', 'actions'];

      if (!this.data.find( d => d.comment )) {
        _.pull(my_fields, 'comment');
      }

      return my_fields;
    }
  },

  watch: {
    dates:   function() { this.fetchData(); },
    childid: function() { this.fetchData(); },
  },

  created:   function() { this.fetchData(); },

  methods: {
    fetchData() {
      this.loadAjax({url: this.getUrl("sleepphases"), data: { from: this.dates.from, to: this.dates.to } })
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