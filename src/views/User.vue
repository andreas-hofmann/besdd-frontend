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
          <b-link href="/accounts/password_change/">Change password (legacy UI)</b-link>
        </template>
        <template v-if="prefs === 'children'">
            <DetailsListChildren ref="child" />
            <b-button variant="primary" @click="$emit('createEntry', 'child')" >Add</b-button>
        </template>
        <template v-if="prefs === 'foods'">
            <DetailsListFoods ref="food" />
            <b-button variant="primary" @click="$emit('createEntry', 'food')" >Add</b-button>
        </template>
        <template v-if="prefs === 'diapercontents'">
            <DetailsListDiaperContents ref="diapercontent" />
            <b-button variant="primary" @click="$emit('createEntry', 'diapercontent')" >Add</b-button>
        </template>
        <template v-if="prefs === 'diapertypes'">
            <DetailsListDiaperTypes ref="diapertype" />
            <b-button variant="primary" @click="$emit('createEntry', 'diapertype')" >Add</b-button>
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
import DetailsListDiaperTypes from '../components/lists/DetailsListDiaperTypes.vue';
import FormSettings from '../components/forms/FormSettings.vue';

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
    DetailsListDiaperTypes,
    FormSettings,
  },

  methods: {
    updateData(type) {
      switch (type) {
      case 'child':
      case 'food':
      case 'diapercontent':
      case 'diapertype':
        this.$refs[type].fetchData();
        break;

      default:
        break;
      }
    },
    validType() {
      switch (this.detail_type) {
      case 'children':
      case 'foods':
      case 'diapercontents':
      case 'diapertypes':
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