<template>
  <div id="navbar">
    <b-navbar type="light" variant="light" toggleable="sm">
      <b-navbar-brand href="#">besdd</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" class="ml-auto"></b-navbar-toggle>

      <b-collapse is-nav id="nav-collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="/accounts/login/">Log in</b-nav-item>
          <b-nav-item href="/accounts/register/">Sign up</b-nav-item>
          <b-nav-item :to="{ name: 'About' }"> about </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import $ from "jquery"

export default {
  name: "NavbarLogin",
  data: function() {
    return {
      username: null,
      password: null
    }
  },
  watch: {
    credentials: function() {
      this.tryLogin(this.credentials);
    }
  },
  methods: {
    tryLogin: function() {
      $.ajax({
          type:"POST",
          url: "/accounts/login/",
          data: {
            'username': this.username,
            'password': this.password
          }
        })
        .done( () => {
          this.$emit('logged-in');
        })
        .fail( () => {
          console.log("Error logging in");
        })
        .always( () => {
          console.log("Done logging in.")
        });
    },
  }
}
</script>