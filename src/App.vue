<template>
  <div id="app">
    <cookie-law storage-type="cookies" @accept="checkCookiesAccepted()"></cookie-law>

    <template v-if="!cookiesAccepted">
      <About />
    </template>
    <template v-else-if="!userdata.user">
      <NavbarLogin @logged-in="refreshUserData" />
      <About />
    </template>
    <template v-else>
      <Navbar
        @update="refreshUserData"
        @child="updateCurrentChild"
        @createEntry="createEntry"
        @createEditSleep="createEditSleep"
        :userdata="userdata">
      </Navbar>

      <b-container>
        <b-row>
          <b-col>
            <b-link class="text-muted" id="sleep-status" @click="checkSleepState">
            [ Child status ]
            </b-link>
          </b-col>
        </b-row>
      </b-container>

      <router-view />
    </template>

    <div class="container mt-3">
      <div class="row" style="font-size:11px;">
        <div class="col-xs ml-auto"> </div>
        <div class="col-xs mx-3 text-center">
        <small><a class="text-muted" target="_blank" href="/static/html/imprint.html">Impressum</a></small>
        <small><a class="text-muted mx-2" target="_blank" href="/static/html/disclaimer.html">Disclaimer</a></small>
        <small><a class="text-muted" target="_blank" href="/static/html/privacy.html">Datenschutzerklärung</a></small>
        </div>
        <div class="col-xs mr-auto"> </div>
      </div>
    </div>

    <b-modal
      ref="createModal"
      centered
      hide-footer
      :title="'Create ' + newObject"
      size="lg">
        <template v-if="newObject == 'sleepphase'">
          <FormSleep :id="sleepId" @updated="closeModal" />
        </template>

        <template v-if="newObject == 'diaper'">
          <FormDiaper @updated="closeModal" />
        </template>

        <template v-if="newObject == 'meal'">
          <FormMeal @updated="closeModal" />
        </template>

        <template v-if="newObject == 'measurement'">
          <FormMeasurement @updated="closeModal" />
        </template>

        <template v-if="newObject == 'event'">
          <FormEvent @updated="closeModal" />
        </template>

        <template v-if="newObject == 'diaryentry'">
          <FormDiary @updated="closeModal" />
        </template>
    </b-modal>
  </div>
</template>

<script>
import $ from "jquery";
import Cookie from "js-cookie"

import CookieLaw from "vue-cookie-law";

import Navbar from "./components/Navbar.vue";
import NavbarLogin from "./components/NavbarLogin.vue";
import About from "./views/About.vue";

import FormSleep from './components/forms/FormSleep.vue';
import FormMeal from './components/forms/FormMeal.vue';
import FormDiaper from './components/forms/FormDiaper.vue';
import FormEvent from './components/forms/FormEvent.vue';
import FormDiary from './components/forms/FormDiary.vue';
import FormMeasurement from './components/forms/FormMeasurement.vue';

export default {
  name: "App",

  components: {
    Navbar,
    NavbarLogin,
    CookieLaw,
    About,
    FormSleep,
    FormMeal,
    FormDiaper,
    FormEvent,
    FormDiary,
    FormMeasurement,
  },

  data: function () {
    return {
      userdata: this.$root.userdata,
      cookiesAccepted: false,
      newObject: "",
      sleepId: 0,
    };
  },

  methods: {
    editSettings() {
      this.newObject = "settings";
      this.$refs.createModal.show();
    },
    createEditSleep() {
      $.get({ url: "/" + this.userdata.currentChild.id + "/data/current_phase/" })
        .done( (data) => {
          this.sleepId = data.id;
          this.newObject = "sleepphase";
          this.$refs.createModal.show();
        });
    },
    createEntry(entry) {
      this.sleepId = 0;
      this.newObject = entry;
      this.$refs.createModal.show();
    },
    closeModal() {
      this.$refs.createModal.hide();
    },
    updateCurrentChild(child) {
      this.userdata.currentChild = child;
    },
    refreshUserData() {
      $.get("/index/")
        .done( data => {
          this.userdata.user = data.user;
          this.userdata.id = data.id;
          this.userdata.children = data.children;

          if (data.default_child) {
            this.userdata.currentChild = data.default_child;
          } else {
            var max_id = 0;
            var cur_child = null;

            for (const c of data.children) {
              if (c.id > max_id) {
                max_id = c.id;
                cur_child = c;
              }
            }

            this.userdata.currentChild = cur_child;
          }
        })
        .fail( () => {
          console.log("Error fetching initial data!");
        })
    },
    setupCsrfToken() {
      $.ajax({
          type:"GET",
          url: "/accounts/login/",
        }).done( () => {
          var token = Cookie.get('csrftoken');

          function csrfSafeMethod(method) {
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
          }

          $.ajaxSetup({
            beforeSend: function(xhr, settings) {
              if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRFToken", token);
              }
            }
          });
        })
    },
    checkCookiesAccepted() {
      this.cookiesAccepted = Cookie.get("cookie:accepted");

      if (this.cookiesAccepted) {
        this.setupCsrfToken();
        this.refreshUserData();
      }
    },
    since_str(data) {
      let str = "";

      if (data['since_d'] > 0) {
        str += " " + data['since_d'] + " day"
        if (data['since_d'] > 1) {
          str += "s"
        }
      }
      if (data['since_h'] > 0) {
        str += " " + data['since_h'] + " hour";
        if (data['since_h'] > 1) {
          str += "s"
        }
      }
      if (data['since_m'] > 0) {
        str += " " + data['since_m'] + " minute";
        if (data['since_m'] > 1) {
          str +=  "s"
        }
      }
      return str;
    },
    checkSleepState() {
      if (this.userdata.currentChild) {
        $('#sleep-status').html("Checking...");

        $.get({ url: "/" + this.userdata.currentChild.id + "/data/check/" })
          .done( (data) => {
            let el = $('#sleep-status');
            let state = this.userdata.currentChild.name + " is ";
            let since = "";

            if (data['sleep']['state'] >= 0) {
              if (data['sleep']['state'] == 0) {
                state += "asleep";
              } else {
                state += "awake";
              }

              since = this.since_str(data['sleep']);

              if (since.length > 0) {
                state += " since" + since;
              }

              state += ". ";
            }

            if (data['eat']['state'] > 0) {
              since = this.since_str(data['eat']);
              if (since.length > 0) {
                since += " ago. ";
              } else {
                since = "now. ";
              }
              state += "Last meal was " + since;
            }
            if (data['diaper']['state'] > 0) {
              since = this.since_str(data['diaper']);
              if (since.length > 0) {
                since += " ago.";
              } else {
                since = " now. ";
              }
              state += "Diaper changed " + since;
            }

            el.html(state);
          })
          .fail( () => {
            $('#sleep-status').html("Error getting child info.");
          });
      } else {
        $('#sleep-status').html("No child selected.");
      }
    }
  },
  created: function() {
    this.checkCookiesAccepted();
    this.checkSleepState();
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#sleep-status {
  font-size: 11px;
}
</style>
