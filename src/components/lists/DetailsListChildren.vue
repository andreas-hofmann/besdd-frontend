<template>
  <div>
    <b-table ref="table" primary-key="id"
          :busy="requestActive"
          small
          head-variant="light"
          outlined
          responsive="sm"
          :items="data"
          :fields="['name', 'birthday', 'gender', 'parents', 'actions']">
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
        </div>
      </template>
      <template v-slot:cell(name)="row">
        {{ row.item.name }}
      </template>
      <template v-slot:cell(birthday)="row">
        {{ helpers.localdate(row.item.birthday) }}
      </template>
      <template v-slot:cell(gender)="row">
        {{ row.item.gender }}
      </template>
      <template v-slot:cell(parents)="row">
        {{ helpers.allItemsString(row.item.parents) }}
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
                <FormChild :id="row.item.id" @updated="fetchData" @deleted="fetchData" />
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

import FormChild from '../forms/FormChild.vue';

export default {
  name: 'DetailsListChildren',

  components: {
    FormChild,
  },

  mixins: [
      UrlMixin,
      LoadingMixin,
      TableAccordionMixin
  ],

  props: {
    dates: {},
  },

  data: function() {
    return {
        helpers: helpers
    };
  },

  watch: {
    dates:   function() { this.fetchData(); },
  },

  created:   function() { this.fetchData(); },

  methods: {
    fetchData() {
      this.loadAjax({ url: this.getUrl("children")})
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