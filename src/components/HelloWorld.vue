<template>
  <div class="hello">
    <!-- <h1>{{ msg }}</h1>
    <a v-if="!spotifyUser" href="https://wt-528cf0f2960f63b4d651b3859d2fbb9a-0.sandbox.auth0-extend.com/spotify_auth/login">Login to spotify here</a>
    <div v-if="spotifyUser">
      <h3>{{spotifyUser.id}}</h3>
      <button @click="getSpotifyPlaylists">Get playlists</button>
      <ul v-if="spotifyPlaylists">
        <li v-for="(playlist, index) in spotifyPlaylists" :key="index">
          {{playlist.name}}
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import { db } from '../main'
import axios from 'axios';
import queryString from 'query-string';
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';

export default {
  name: "HelloWorld",
  props: {
    msg: String,
    isLoggedInWithSpotify: Boolean
  },
  data(){
    return {
      
    }
  },
  computed:{
    spotifyUser(){
      return this.$store.getters.SPOTIFY_USER;
    },
    spotifyPlaylists(){
      return this.$store.getters.SPOTIFY_PLAYLISTS;
    }
  },
  methods :{
    getSpotifyPlaylists: function(event){
      this.$store.dispatch('GET_SPOTIFY_PLAYLISTS');
    }
  },
  created(){
    // let parsed = queryString.parse(window.location.search);
    // let access_token = queryString.parse(window.location.search).access_token;
    // if(access_token){
    //   let spotifyHeaders = {
    //     'Authorization': 'Bearer ' + access_token
    // }
    // this.getSpotifyUser(spotifyHeaders,'https://api.spotify.com/v1/me');
    // console.log(this.theSpotifyUser); 
    // }
    //this.isLoggedInWithSpotify = this.$store.getters.GetIsLoggedInWithSpotify;
    //console.log(this.isLoggedInWithSpotify);
    
    // if(access_token){
    //   console.log('We got a token: '+access_token);
    //   //Pass the token to the store:
    //   this.$store.commit("SET_ACCESS_TOKEN",access_token);

    //   console.log('Access Token in store: '+this.$store.getters.GET_ACCESS_TOKEN);
    //   //Now get the user
      

    // }
    // else{
    //   console.log('No token today!!!');
    // }
      
  },
  mounted(){
    let access_token = queryString.parse(window.location.search).access_token;
    if(!access_token){
      //login flow
    }else{
      //get the user
      this.$store.commit('spotifyStore/SET_SPOTIFY_ACCESS_TOKEN',access_token);
      // if(!this.spotifyUser){
      //   this.$store.dispatch('GET_SPOTIFY_USER');
      // } 
    }
    
    
  },
  
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
