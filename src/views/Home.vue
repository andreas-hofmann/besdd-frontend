<template>
  <div class="home mt-3">
    <h1>besdd - A babys eat-sleep-diaper diary.</h1>

    <template v-if="childData">
      <h3>Viewing data for {{ childData.name }}:</h3>

      <p> {{ childData.name }} was born on {{ childData.birthday }}. </p>
      <p> Today {{ pronoun }} is {{ ageWeeks }} weeks old (or more precise: {{ ageDays }} days). </p>

      <p> {{ parents }} </p>
    </template>
  </div>
</template>

<script>
import { UrlMixin, LoadingMixin } from "../mixins.js";
import moment from 'moment';

export default {
  name: "Home",

  mixins: [ UrlMixin, LoadingMixin ],

  data: function() {
    return {
      childData: null
    };
  },

  created: function() {
    if (this.$root.userdata.currentChild) {
      this.loadAjax({ url: this.getUrl("child")})
      .done( (data) => {
        console.log(data);
        this.childData = data.child;
      })
    }
  },

  computed: {
    ageSeconds: function() {
      return (moment() - moment(this.childData.birthday))/1000;
    },
    pronoun: function() {
      if (this.childData.gender === 'M')
        return "he";
      else
        return "she";
    },
    parents: function() {
      let str = "";

      if (this.childData.gender === 'M')
        str += "His";
      else
        str += "Her";

      str += " parent";

      if (this.childData.parents.length > 1) {
        str += "s are ";
        let parents = "";
        for (const p of this.childData.parents) {
          if (parents.length)
           parents += " and ";
          parents += p.name;
        }
        str += parents + ".";
      } else {
        str += " is " + this.childData.parents[0].name + ".";
      }

      return str;
    },
    ageDays: function() {
      return Math.floor(this.ageSeconds / 3600 / 24);
    },
    ageWeeks: function() {
      return Math.floor(this.ageDays / 7);
    }
  },
};
</script>
