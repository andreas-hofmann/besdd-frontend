<template>
  <div class="home mt-3">
    <h1>besdd - A babys eat-sleep-diaper diary.</h1>

    <template v-if="childData">
      <h3>Viewing data for {{ childData.name }}:</h3>

      <p> {{ childData.name }} was born on {{ childData.birthday }}. </p>
      <p> Today {{ pronoun }} is {{ ageWeeks }} weeks old (or more precise: {{ ageDays }} days). </p>

       <p v-if="measurementValid">
         {{ measurementTime }} {{ pronoun }}
         <template v-if="measurementWeight">
          weighed {{ measurementWeight }} kilos
         </template>
         <template v-if="measurementWeight && measurementHeight">
          and
         </template>
         <template v-if="measurementHeight">
          was {{ measurementHeight }} cm tall
         </template>
         .
       </p>

      <p> {{ parents }} </p>

      <p>
         In total, {{ pronoun }} has soiled {{ childData.totals.diapers }} diapers,
         eaten {{ childData.totals.meals }} meals
         and slept {{ childData.totals.sleep }} times
       </p>
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

  methods: {
    fetchData() {
      if (this.$root.userdata.currentChild) {
        this.loadAjax({ url: this.getUrl("child")})
        .done( (data) => {
          this.childData = data.child;
        })
      }
    }
  },

  created: function() {
    this.fetchData();
  },

  watch: {
    childId: function() {
      this.fetchData();
    }
  },

  computed: {
    childId: function() {
      return this.$root.userdata.currentChild.id;
    },
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
    },
    measurementTime: function() {
      return moment(this.childData.last_measurement.dt).fromNow();
    },
    measurementWeight: function() {
      return this.childData.last_measurement.weight;
    },
    measurementHeight: function() {
      return this.childData.last_measurement.height;
    },
    measurementValid: function() {
      return this.childData.last_measurement.dt &&
        (this.childData.last_measurement.weight || this.childData.last_measurement.height);
    }
  },
};
</script>
