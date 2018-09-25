import Vue from "vue";
import Vuex from "vuex";

import session from "./modules/session";
import user from "./modules/user";
import playlist from "./modules/playlist";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},

  modules: {
    session,
    user,
    playlist
  }
});
