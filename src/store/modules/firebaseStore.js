import {firebaseService} from "@/lib/firebaseService";

const state = {
  user: null,
  playlists: null,

};

const getters = {
  FIRESTORE_USER: state=>{
    return state.user;
  },
  FIRESTORE_PLAYLISTS: state=>{
    return state.playlists;
  }
};

const mutations = {
  SET_FIRESTORE_USER: (state, payload)=>{
    state.user = payload;
  }
};

const actions = {
  GET_FIRESTORE_USER_BY_EMAIL: async (context, email)=>{
    let {data} = await firebaseService.getUserByEmail(email);
    context.commit("SET_FIRESTORE_USER",data);
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
