<template>
  <div>
  <b-table :items="data" :fields="fields">
  </b-table>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  name: 'DetailsList',

  props: {
    dates: {},
    childid: Number,
    type: String
  },

  data: function() {
    return {
        data: [],
        fields: [],
    };
  },

  watch: {
    cates:    function() { this.fetchData(); },
    childid: function() { this.fetchData(); },
    type:    function() { this.fetchData(); },
  },

  created:   function() { this.fetchData(); },

  methods: {
    fetchData() {
      $.get("/" + this.childid + "/" + this.type + "/", { from: this.dates.from, to: this.dates.to })
      .done(data => {
        this.data = data;

        switch (this.type) {
        case 'sleep':
          this.fields = ['from', 'to', 'duration'];
          break;
        case 'meals':
          this.fields = ['time', 'food'];
          break;
        case 'diapers':
          this.fields = ['time', 'contents'];
          break;
        case 'measurements':
          this.fields = ['time', 'height', 'weight'];
          break;
        case 'events':
          this.fields = ['time', 'event', 'description'];
          break;
        case 'diary':
          this.fields = ['time', 'title', 'content'];
          break;

        default:
          this.fields = null;
          this.data = [];
          break;
        }
      })
      .fail(() => {
          console.log("Error fetching data.");
      });
    },
  },
}
</script>