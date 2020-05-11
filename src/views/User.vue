<template>
<div>
  <b-container>
    <b-row class="mt-2">
      <b-col></b-col>
      <b-col cols="8">
        <UserTabbar />
      </b-col>
      <b-col></b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col></b-col>
      <b-col cols="10">
        <template v-if="prefs === 'settings'">
            <FormSettings />
        </template>
        <template v-if="prefs === 'password'">
            <FormPassword />
        </template>
        <template v-if="prefs === 'children'">
            <DetailsListChildren />
        </template>
        <template v-if="prefs === 'foods'">
            <DetailsListFoods />
        </template>
        <template v-if="prefs === 'diapercontents'">
            <DetailsListDiaperContents />
        </template>
        <template v-else-if="!validType">
            Invalid settings requested.
        </template>
      </b-col>
      <b-col></b-col>
    </b-row>

  </b-container>
</div>
</template>

<script>
import UserTabbar from '../components/UserTabbar.vue';

import DetailsListChildren from '../components/lists/DetailsListChildren.vue';
import DetailsListFoods from '../components/lists/DetailsListFoods.vue';
import DetailsListDiaperContents from '../components/lists/DetailsListDiaperContents.vue';
import FormSettings from '../components/forms/FormSettings.vue';
import FormPassword from '../components/forms/FormPassword.vue';

import moment from 'moment';

export default {
  name: 'Details',

  props: {
      prefs: String,
  },

  data: function() {
    return {
      dateRangeDays: 14,
      dates: {
        from: moment().format("YYYY-MM-DD"),
        to: moment().format("YYYY-MM-DD"),
      },
    };
  },

  components: {
    UserTabbar,
    DetailsListChildren,
    DetailsListFoods,
    DetailsListDiaperContents,
    FormSettings,
    FormPassword,
  },

  methods: {
    validType() {
      switch (this.detail_type) {
      case 'children':
      case 'foods':
      case 'diapercontents':
      case 'settings':
      case 'password':
        return true;
      default:
        return false;
      }
    },
  },
}
</script>