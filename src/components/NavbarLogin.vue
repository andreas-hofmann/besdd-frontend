<template>
  <div id="navbar">
    <b-navbar type="light" variant="light" toggleable="sm">
      <b-navbar-brand href="#">besdd</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" class="ml-auto"></b-navbar-toggle>

      <b-collapse is-nav id="nav-collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right text="Login">
            <b-dropdown-form>
                <b-form-group label="username" label-for="dropdown-form-user" @submit.stop.prevent>
                <b-form-input
                    id="dropdown-form-user"
                    size="sm"
                    v-model="username"
                    placeholder="username"
                ></b-form-input>
                </b-form-group>

                <b-form-group label="password" label-for="dropdown-form-password">
                <b-form-input
                    id="dropdown-form-password"
                    type="password"
                    size="sm"
                    v-model="password"
                    placeholder="password"
                ></b-form-input>
                </b-form-group>
                <b-button variant="primary" size="sm" @click="tryLogin">Sign In</b-button>
            </b-dropdown-form>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button>Sign up</b-dropdown-item-button>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item :to="{ name: 'About' }"> about </b-dropdown-item>
          </b-nav-item-dropdown>
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