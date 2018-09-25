import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Explorer from "./views/Explorer.vue";
import Auth from "./views/Auth.vue";
import User from "./views/User.vue";
import SpotifyAuth from "./views/SpotifyAuth.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/explorer",
      name: "explorer",
      component: Explorer
    },
    {
      path: "/auth",
      name: "auth",
      component: Auth
    },
    {
      path: "/spotify-auth",
      name: "spotifyAuth",
      component: SpotifyAuth
    },
    {
      path: "/user",
      name: "user",
      component: User
    },

    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
