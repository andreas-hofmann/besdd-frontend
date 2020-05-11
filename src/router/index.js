import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Summary from "../views/Summary.vue"
import Details from "../views/Details.vue"
import User from "../views/User.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/summary/:graph_type",
    name: "Summary",
    component: Summary,
    props: true
  },
  {
    path: "/user/:prefs",
    name: "User",
    component: User,
    props: true
  },
  {
    path: "/details/:detail_type",
    name: "Details",
    component: Details,
    props: true,
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
