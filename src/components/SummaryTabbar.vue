<template>
    <b-nav tabs small fill>
      <b-nav-item active-class="active" :to="{ name: 'Summary', params: { graph_type: 'list' } }">List</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'Summary', params: { graph_type: 'timeline' } }">Timeline</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'Summary', params: { graph_type: 'histogram' } }">Histogram</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'Summary', params: { graph_type: 'measurements' } }">Measurements</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'Summary', params: { graph_type: 'height' } }">Height</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'Summary', params: { graph_type: 'weight' } }">Weight</b-nav-item>
    </b-nav>
</template>

<script>
export default {
  name: 'SummaryTabbar',
}
</script>