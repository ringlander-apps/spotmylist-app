<template>
  <div>
    <h2>{{msg}}</h2>
    <div v-if="AUTH_USER && USER_PROFILE">
      
     <md-field>
      <label>User Name</label>
      <md-input v-model="USER_PROFILE.userName"></md-input>
    </md-field>
    <md-field>
      <label>User Id</label>
      <md-input v-model="USER_PROFILE.userId" readonly></md-input>
    </md-field>
    <md-field>
      <label>Email</label>
      <md-input v-model="AUTH_USER.email" readonly></md-input>
    </md-field>
    <md-field>
      <label>Spotify User Id</label>
      <md-input v-model="USER_PROFILE.spotifyUserId"></md-input>
    </md-field>
    </div>
  </div>
</template>

<script>
  
  import { mapActions, mapGetters } from "vuex";

  export default {
    name: "UserProfile",
    props:{
      msg: String
    },

    computed:{
       ...mapGetters(["AUTH_USER","USER_PROFILE"])
    },
    data(){
      return{

      }
    },
    created(){

    },
    mounted(){

    }
  }
</script>

<style scoped>

</style>