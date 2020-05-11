<template>
    <b-nav tabs small fill>
      <b-nav-item active-class="active" :to="{ name: 'Details', params: { detail_type: 'meals' } }">Meals</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'Details', params: { detail_type: 'sleep' } }">Sleep</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'Details', params: { detail_type: 'diapers' } }">Diapers</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'Details', params: { detail_type: 'measurements' } }">Measurements</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'Details', params: { detail_type: 'events' } }">Events</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'Details', params: { detail_type: 'diary' } }">Diary</b-nav-item>
    </b-nav>
</template>

<script>
export default {
  name: 'DetailsTabbar',
}
</script>