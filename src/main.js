import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

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
  }
}).$mount("#app");
