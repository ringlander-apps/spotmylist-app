
import {firebaseService} from "@/lib/firebaseService";
import { USER_BY_EMAIL_REQUEST } from '../actions/user';

const state = {
  profile: null
};

const getters = {
  USER_PROFILE: state=>{
    return state.profile;
  }   
};
const mutations = {
  SET_USER_PROFILE: (state, payload)=>{
    state.profile = payload;
  }
};
const actions = {
  [USER_BY_EMAIL_REQUEST]:({commit},userEmail)=>{
    return new Promise((resolve,reject)=>{
      firebaseService.getUserByEmail(userEmail)
      .then(userData=>{
        if(userData!=null){
          commit('SET_USER_PROFILE',userData);
          resolve(state.profile);
        }
        else{
          reject(new Error("10, No User Profile found"));
        }
      })
      .catch(err=>console.log(err));
    });
  }
  
}

export default{
  state,
  getters,
  mutations,
  actions,
}

