import Authenticator from '@/lib/authenticator';
import {USER_BY_EMAIL_REQUEST} from '../actions/user';
import { STATUS_CODES } from 'http';
import { stat } from 'fs';

const auth = new Authenticator();

const state = {
  authenticated: !!localStorage.getItem('auth_access_token'),
  accessToken: localStorage.getItem('auth_access_token'),
  idToken: localStorage.getItem('auth_id_token'),
  expiresAt: localStorage.getItem('auth_expires_at'),
  user: JSON.parse(localStorage.getItem('auth_user'))
};

const getters = {
  AUTHENTICATED: state=>{
    return state.authenticated;
  },
  AUTH_USER: state=>{
    return state.user;
  },
  IS_AUTHENTICATED: state=>{

  }

};

const mutations = {
  SET_AUTHENTICATED: (state, authData)=>{
    state.authenticated = true,
    state.accessToken = authData.accessToken,
    state.idToken = authData.idToken,
    state.expiresAt = authData.expiresIn * 1000 + new Date().getTime(),
    state.user = authData.idTokenPayload

    localStorage.setItem('auth_access_token',state.accessToken);
    localStorage.setItem('auth_id_token',state.idToken);
    localStorage.setItem('auth_expires_at',state.expiresAt);
    localStorage.setItem('auth_user', JSON.stringify(state.user));

    
  },
  SET_AUTH_USER: (state, userData)=>{
    state.user = userData;
  },
  SET_NOT_AUTHENTICATED: (state)=>{
    state.authenticated = false,
    state.accessToken = null,
    state.idToken = false,
    state.user = null

    localStorage.removeItem('auth_access_token');
    localStorage.removeItem('auth_id_token');
    localStorage.removeItem('auth_expires_at');
    localStorage.removeItem('auth_user');
  
  }
};

const actions = {
  login(){
    auth.login()
  },
  LOGOUT({commit}){
    commit('SET_NOT_AUTHENTICATED')
  },
  HANDLE_AUTH: ({commit,dispatch})=>{
    return new Promise((resolve, reject)=>{
      auth.handleAuthentication()
        .then((authResult)=>{
          commit('SET_AUTHENTICATED',authResult);
          if(state.user.email){
            dispatch(USER_BY_EMAIL_REQUEST,state.user.email)
            .then(resp=>{
              if(resp!=null){
                resolve(resp);
              }
              else{
                reject(Error("No user profile found in Firestore"));
              }
            })
            .catch(err=>{
              reject(err);
            });
          } 
        })
        .catch(err=>{console.log('This is the err: '+err)});
    });
  }

}
export default{
  state,
  getters,
  mutations,
  actions
}