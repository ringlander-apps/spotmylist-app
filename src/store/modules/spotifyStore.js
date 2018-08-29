import {
  ss
} from "@/lib/spotifyService";
import {
  stat
} from "fs";
import {
  isContext
} from "vm";
import Axios from "axios";

const state = {
  spotifyAccessToken: "",
  spotifyUserUrl: "",
  spotifyHeaders: null,
  spotifyUser: null,
  loggedInToSpotify: false,
  spotifyPlaylists: null
};

const getters = {
  SPOTIFY_ACCESS_TOKEN: state => {
    return state.spotifyAccessToken;
  },
  SPOTIFY_USER: state => {
    return state.spotifyUser;
  }
};

const mutations = {
  SET_SPOTIFY_ACCESS_TOKEN: (state, payload) => {
    state.spotifyAccessToken = payload;
    
  },
  SET_SPOTIFY_USER: (state, payload) => {
    state.spotifyUser = payload;
  }
};

const actions = {
  GET_SPOTIFY_USER: async (context, payload) => {
    let {
      data
    } = await Axios.get(spotifyConfig.userPlaylistsURL, {
      headers: spotifyConfig.spotifyHeaders(context.state.spotifyAccessToken)
    });
    context.commit('SET_SPOTIFY_USER', data);
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};