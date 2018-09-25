<template>

  <!-- <nav class="navbar">
    
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item">
        <router-link class="nav-link" to="/">Home </router-link> |
      </li>
      <li class="nav-item">
        <router-link v-if="AUTHENTICATED" class="nav-link" to="/explorer">Playlist Explorer</router-link> |
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/about">About</router-link>
      </li>
      <li class="nav-item">
        <router-link v-if="AUTHENTICATED" class="nav-link" to="/user">User</router-link>
      </li>
      
      <li class="nav-item">
        <button v-if="!AUTHENTICATED" class="btn btn-primary" @click="login()">Sign-in</button>
        <a v-if="AUTHENTICATED" class="nav-link" href="#" @click="LOGOUT()">Log Out</a>
      </li>
    </ul>
  </div>
    
  </nav> -->
  <div>
    <md-toolbar>
      <div class="md-toolbar-section-start">
        <md-button class="md-icon-button">
          <md-icon>menu</md-icon>
        </md-button>
        <h3 class="md-title">SpotMyLists</h3>
      </div>
      <div>
        <md-button to="/">Home</md-button>
        <md-button to="/about">What is Spotmylists?</md-button>
        <md-button v-if="AUTHENTICATED" to="/explorer">Open Playlist Explorer</md-button>
      </div>
      <div class="md-toolbar-section-end">
        <md-button v-if="!AUTHENTICATED" @click="login()">
          <md-icon>input</md-icon>
          Sign-in
        </md-button>
        <md-button v-if="AUTHENTICATED" class="md-icon-button" to="/user">
            <md-icon v-if="!AUTH_USER">person</md-icon>
            <md-avatar v-if="AUTH_USER && USER_PROFILE">
              <img :src=USER_PROFILE.userImage.url alt="" srcset="">
            </md-avatar>
        </md-button>
        <div>
          <span v-if="AUTH_USER && USER_PROFILE">Hi, {{USER_PROFILE.fullName}}</span>
        </div>
        <div v-if="AUTH_USER && USER_PROFILE && USER_PROFILE.spotifySettings.connectedToSpotify">
          <span v-if="!AUTHENTICATED_WITH_SPOTIFY">

          </span>
          <span v-else>
            <md-button class="md-icon-button" @click="LOGOUT_FROM_SPOTIFY()">
              <md-icon><img src="../assets/Spotify_Icon_RGB_Green.png" alt="Signed in to Spotify"></md-icon>
            </md-button>
            
          </span>
        </div>
        <a v-if="AUTH_USER && USER_PROFILE && USER_PROFILE.spotifySettings.connectedToSpotify && !AUTHENTICATED_WITH_SPOTIFY" 
          href="https://wt-528cf0f2960f63b4d651b3859d2fbb9a-0.sandbox.auth0-extend.com/spotify_auth/login" class="button">Sign-in to Spotify</a>
        <md-button v-if="AUTHENTICATED" @click="LOGOUT()">Log Out</md-button>
      </div>
    </md-toolbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Navbar",

  methods: mapActions(["login", "LOGOUT", "LOGOUT_FROM_SPOTIFY"]),

  computed: mapGetters([
    "AUTHENTICATED",
    "AUTH_USER",
    "USER_PROFILE",
    "AUTHENTICATED_WITH_SPOTIFY"
  ]),
  checkUserConnectionWithSpotify: {
    get() {
      return this.USER_PROFILE.connectedToSpotify;
    }
  },

  created() {
    // if(this.$store.getters.AUTHENTICATED){
    //   const user = this.$store.getters.AUTH_USER;
    //   this.GET_FIRESTORE_USER_BY_EMAIL(this.AUTH_USER.email);
    // }
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
}
a {
  text-decoration: none;
}
.nav-item {
  display: inline;
}
</style>
