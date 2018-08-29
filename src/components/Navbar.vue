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
            <md-avatar v-if="AUTH_USER">
              <img :src=AUTH_USER.picture alt="" srcset="">
            </md-avatar>
        </md-button>
        <div>
          <span v-if="AUTH_USER && USER_PROFILE">Hi, {{USER_PROFILE.userName}}</span>
        </div>
        <md-button v-if="AUTHENTICATED" @click="LOGOUT()">Log Out</md-button>
      </div>
    </md-toolbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Navbar",

  methods: mapActions(["login","LOGOUT"]),
 
  computed: mapGetters(["AUTHENTICATED","AUTH_USER","USER_PROFILE"]),

  created(){
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
  a{
    text-decoration: none;
  }
  .nav-item{
    display: inline;
  }
 
</style>