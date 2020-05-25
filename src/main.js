import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import $ from 'jquery';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

let userdata = {
  user: null,
  currentChild: null,
  children: [],
};

let usersettings = {};

new Vue({
  router,
  render: h => h(App),
  data: {
    userdata: userdata,
    usersettings: usersettings,
  },
  methods: {
    fetchUserSettings() {
      $.get("/settings/")
        .done( data => {
          this.usersettings = data;
        })
        .fail( () => {
          console.log("Error fetching usersettings!");
        })
    },
  }
}).$mount("#app");
