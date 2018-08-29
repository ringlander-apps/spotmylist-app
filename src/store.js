import Vue from "vue";
import Vuex from "vuex";
import { stat } from "fs";
import { isContext } from "vm";
import Axios from "axios";
import spotifyConfig from "./spotifyConfig";
import spotifyHandler from "./spotifyHandler";


Vue.use(Vuex);

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
  getters:{
    GET_CURRENT_USER: state =>{
      return state.currentUser;
    },
    GET_ACCESS_TOKEN:state=>{
      return state.spotifyAccessToken
    },
    SPOTIFY_USER:state=>{
      return state.spotifyUser;
    },
    SPOTIFY_PLAYLISTS:state=>{
      return state.spotifyPlaylists;
    }
  },
  mutations: {
    SET_ACCESS_TOKEN: (state,payload)=>{
      state.spotifyAccessToken = payload
    },
    SET_SPOTIFY_USER_URL: (state, payload)=>{
      state.spotifyUserUrl = payload
    },
    SET_SPOTIFY_HEADERS: (state, payload)=>{
      state.spotifyHeaders = payload
    },
    SET_SPOTIFY_USER: (state,payload)=>{
      state.spotifyUser = payload
    },
    SET_SPOTIFY_USER_PLAYLISTS:(state, payload)=>{
      state.spotifyPlaylists = payload;
    }
  },
  actions: {
    GET_SPOTIFY_USER: async(context,payload)=>{
      let {data} = await Axios.get(spotifyConfig.userPlaylistsURL,{headers:spotifyConfig.spotifyHeaders(context.state.spotifyAccessToken)});
      context.commit('SET_SPOTIFY_USER',data);
    },
    GET_SPOTIFY_PLAYLISTS: async(context,payload)=>{
      let {data} = await Axios.get(spotifyConfig.userMyPlaylistsURL,{headers:spotifyConfig.spotifyHeaders(context.state.spotifyAccessToken)});
      if(data.next===null){
        const washedList = spotifyHandler.getUserOwnedLists(data.items,context.state.spotifyUser.id);
        context.commit('SET_SPOTIFY_USER_PLAYLISTS',washedList);
      }
    }
  }
});
