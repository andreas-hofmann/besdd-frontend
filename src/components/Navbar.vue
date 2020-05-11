<template>
  <div id="navbar">
    <b-navbar type="light" variant="light" toggleable="sm">
      <b-navbar-brand to="/">besdd</b-navbar-brand>

      <b-nav>
        <b-nav-item @click="emitCreateEntry('meal')">+ eat</b-nav-item>
        <b-nav-item @click="emitCreateEditSleep">+ sleep</b-nav-item>
        <b-nav-item @click="emitCreateEntry('diaper')">+ diaper</b-nav-item>
      </b-nav>

      <b-navbar-toggle target="nav-collapse" class="ml-auto"></b-navbar-toggle>

      <b-collapse is-nav id="nav-collapse">
        <b-navbar-nav class="ml-auto">
          <template v-if="userdata.currentChild" >
            <b-nav-item :to="{ name: 'Summary', params: { graph_type: 'list' } }"> summary </b-nav-item>
            <b-nav-item :to="{ name: 'Details', params: { detail_type: 'sleep' } }"> details </b-nav-item>
          </template>

          <b-nav-item-dropdown v-if="userdata.currentChild" right :text="userdata.currentChild.name">
            <b-dropdown-item @click="emitCreateEntry('meal')">+ eat</b-dropdown-item>
            <b-dropdown-item @click="emitCreateEntry('sleepphase')">+ sleep</b-dropdown-item>
            <b-dropdown-item @click="emitCreateEntry('diaper')">+ diaper</b-dropdown-item>
            <b-dropdown-item @click="emitCreateEntry('measurement')">+ measurement</b-dropdown-item>
            <b-dropdown-item @click="emitCreateEntry('event')">+ event</b-dropdown-item>
            <b-dropdown-item @click="emitCreateEntry('diaryentry')">+ diary</b-dropdown-item>
            <b-dropdown-divider v-if="userdata.children.length > 0"></b-dropdown-divider>
            <b-dropdown-text v-if="userdata.children.length > 0"><small>All children</small></b-dropdown-text>
            <b-dropdown-item
                v-for="c in userdata.children"
                :key="c.id"
                @click="$emit('child', c)" >
              {{ c.name }}
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right :text="'Hi ' + userdata.user + '!'">
            <b-dropdown-item :to="{ name: 'User', params: { prefs: 'settings' } }"> settings </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'About' }"> about </b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item @click="doLogout">logout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  name: "Navbar",
  props: {
    userdata: Object,
  },

  methods: {
    emitCreateEntry(entry) {
      this.$emit("createEntry", entry)
    },
    emitCreateEditSleep() {
      this.$emit("createEditSleep")
    },
    doLogout() {
      $.ajax({ url: "/accounts/logout/" }).always(
        () => { this.$emit("update"); }
      );
    }
  }
}
</script>