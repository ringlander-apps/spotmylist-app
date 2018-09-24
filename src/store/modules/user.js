import { firebaseService } from "@/lib/firebaseService";
import { spotifyService } from "@/lib/spotifyService";
import {
  USER_BY_EMAIL_REQUEST,
  USER_UPDATE_REQUEST,
  USER_GET_SPOTIFY_USER_REQUEST
} from "../actions/user";

const state = {
  profile: null,
  status: "",
  spotifyProfile: null
};

const getters = {
  USER_PROFILE: state => {
    return state.profile;
  },
  SPOTIFY_USER_PROFILE: state => {
    return state.spotifyProfile;
  }
};
const mutations = {
  SET_USER_PROFILE: (state, payload) => {
    state.profile = payload;
  },
  SET_SPOTIFY_USER_PROFILE: (state, payload) => {
    state.spotifyProfile = payload;
  },
  SET_STATUS: (state, payload) => {
    state.status = payload;
  },
  SET_USER_PROFILE_USERNAME: (state, payload) => {
    state.profile.userName = payload;
  },
  SET_USER_PROFILE_FIRSTNAME: (state, payload) => {
    state.profile.name.firstName = payload;
    state.profile.fullName =
      state.profile.name.firstName + " " + state.profile.name.lastName;
  },
  SET_USER_PROFILE_LASTNAME: (state, payload) => {
    state.profile.name.lastName = payload;
    state.profile.fullName =
      state.profile.name.firstName + " " + state.profile.name.lastName;
  },
  SET_USER_PROFILE_EMAIL: (state, payload) => {
    state.profile.userEmail = payload;
  },
  SET_CONNECT_TO_SPOTIFY: (state, payload) => {
    state.profile.spotifySettings.connectedToSpotify = payload;
  },
  SET_USER_PROFILE_SPOTIFY_ID: (state, payload) => {
    state.profile.spotifySettings.spotifyUserId = payload;
  },
  SET_AUTO_SIGNIN_TO_SPOTIFY: (state, payload) => {
    state.profile.spotifySettings.autoConnectToSpotify = payload;
  }
};
const actions = {
  [USER_BY_EMAIL_REQUEST]: ({ commit }, userEmail) => {
    return new Promise((resolve, reject) => {
      firebaseService
        .getUserByEmail(userEmail)
        .then(userData => {
          if (userData != null) {
            commit("SET_USER_PROFILE", userData);
            resolve(state.profile);
          } else {
            reject(new Error("10, No User Profile found"));
          }
        })
        .catch(err => reject(err));
    });
  },
  [USER_GET_SPOTIFY_USER_REQUEST]: ({ commit }, access_token) => {
    return new Promise((resolve, reject) => {
      spotifyService
        .getCurrentUser(access_token)
        .then(resp => {
          commit("SET_SPOTIFY_USER_PROFILE", resp);
          resolve({
            status: 100,
            message: "Spotify profile loaded"
          });
        })
        .catch(err => {
          reject({
            status: 500,
            message: err
          });
        });
    });
  },
  [USER_UPDATE_REQUEST]: ({ commit }) => {
    return new Promise((resolve, reject) => {
      firebaseService
        .updateUser(state.profile)
        .then(resp => {
          commit("SET_STATUS", resp);
          resolve(state.status);
        })
        .catch(err => reject(err));
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
