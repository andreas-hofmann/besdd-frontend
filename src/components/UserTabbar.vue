<template>
    <b-nav tabs small fill>
      <b-nav-item active-class="active" :to="{ name: 'User', params: { prefs: 'settings' } }">Settings</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'User', params: { prefs: 'children' } }">Children</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'User', params: { prefs: 'foods' } }">Foods</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'User', params: { prefs: 'diapercontents' } }">Diaper contents</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'User', params: { prefs: 'diapertypes' } }">Diaper types</b-nav-item>
      <b-nav-item active-class="active" :to="{ name: 'User', params: { prefs: 'password' } }">Cange password</b-nav-item>
    </b-nav>
</template>

<script>
export default {
  name: 'UserTabbar',
}
</script>