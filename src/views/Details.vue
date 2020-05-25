<template>
<div>
  <b-container>
    <b-row class="mt-2">
      <b-col></b-col>
      <b-col cols="8">
        <DetailsTabbar />
      </b-col>
      <b-col></b-col>
    </b-row>

    <template v-if="detail_type === 'sleep'">
      <DetailsListSleep :dates="dates" :childid="childid" />
    </template>
    <template v-else-if="detail_type === 'meals'">
      <DetailsListMeals :dates="dates" :childid="childid" />
    </template>
    <template v-else-if="detail_type === 'diapers'">
      <DetailsListDiapers :dates="dates" :childid="childid" />
    </template>
    <template v-else-if="detail_type === 'measurements'">
      <DetailsListMeasurements :dates="dates" :childid="childid" />
    </template>
    <template v-else-if="detail_type === 'events'">
      <DetailsListEvents :dates="dates" :childid="childid" />
    </template>
    <template v-else-if="detail_type === 'diary'">
      <DetailsListDiary :dates="dates" :childid="childid" />
    </template>
    <template v-else-if="validType">
      <DetailsList :dates="dates" :childid="childid" :type="detail_type" />
    </template>
    <template v-else>
        Invalid details requested.
    </template>

    <b-row id="dateselector">
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
</div>
</template>

<script>
import DateRangeSelector from "../components/DateRangeSelector.vue";
import DetailsTabbar from '../components/DetailsTabbar.vue';

import DetailsList from '../components/lists/DetailsList.vue';
import DetailsListSleep from '../components/lists/DetailsListSleep.vue';
import DetailsListMeals from '../components/lists/DetailsListMeals.vue';
import DetailsListDiapers from '../components/lists/DetailsListDiapers.vue';
import DetailsListMeasurements from '../components/lists/DetailsListMeasurements.vue';
import DetailsListEvents from '../components/lists/DetailsListEvents.vue';
import DetailsListDiary from '../components/lists/DetailsListDiary.vue';

import moment from 'moment';

export default {
  name: 'Details',

  props: {
      detail_type: String,
  },

  data: function() {
    return {
      dateRangeDays: 7,
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

  components: {
    DateRangeSelector,
    DetailsTabbar,
    DetailsListSleep,
    DetailsListMeals,
    DetailsListDiapers,
    DetailsListMeasurements,
    DetailsListEvents,
    DetailsListDiary,
    DetailsList
  },

  methods: {
    receiveDates(dates) {
      this.dates = dates;
    },
    validType() {
      switch (this.detail_type) {
      case 'meals':
      case 'sleep':
      case 'diapers':
      case 'measurements':
      case 'events':
      case 'diary':
        return true;
      default:
        return false;
      }
    },
  },
}
</script>