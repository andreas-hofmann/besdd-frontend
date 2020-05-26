<template>
  <div>
    <b-table ref="table" primary-key="id" :busy="requestActive" small head-variant="light" outlined :items="data" responsive="sm" :fields="fields">
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
      <template v-slot:cell(height)="row">
        {{ row.item.height }}
      </template>
      <template v-slot:cell(weight)="row">
        {{ row.item.weight }}
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
                <FormMeasurement :id="row.item.id" @updated="fetchData" @deleted="fetchData" />
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

import FormMeasurement from '../forms/FormMeasurement.vue';

import _ from 'lodash';

export default {
  name: 'DetailsListMeasurements',

  components: {
    FormMeasurement,
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
      let my_fields = ['date', 'time', 'height', 'weight', 'comment', 'actions'];

      if (!this.data.find( d => d.comment )) {
        _.pull(my_fields, 'comment');
      }
      if (!this.data.find( d => d.height )) {
        _.pull(my_fields, 'height');
      }
      if (!this.data.find( d => d.weight )) {
        _.pull(my_fields, 'weight');
      }

      return my_fields;
    }
  },

  watch: {
    dates:    function() { this.fetchData(); },
    childid: function() { this.fetchData(); },
  },

  created:   function() { this.fetchData(); },

  methods: {
    fetchData() {
      this.loadAjax({ url: this.getUrl("measurements"), data: { from: this.dates.from, to: this.dates.to } })
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