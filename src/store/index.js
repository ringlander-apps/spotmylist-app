import Vue from 'vue';
import Vuex from 'vuex';
import { stat } from "fs";
import { isContext } from "vm";
import Axios from "axios";
import spotifyConfig from "../spotifyConfig";

import session from "./modules/session";
import spotifyStore from "./modules/spotifyStore";
import firebaseStore from "./modules/firebaseStore";
import user from "./modules/user";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    spotifyAccessToken: '',
    spotifyUserUrl: '',
    spotifyHeaders: null,
    spotifyUser: null,
    currentUser: null,
    loggedInToSpotify: false,
    spotifyPlaylists: null
  },

  modules:{
    session,
    spotifyStore,
    firebaseStore,
    user
  }
});