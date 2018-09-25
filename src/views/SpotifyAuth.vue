<template>
  <div>
    <h3>Loading...</h3>
  </div>
</template>

<script>
import queryString from "query-string";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "SpotifyAuth",
  methods: mapActions(["HANDLE_SPOTIFY_AUTH"]),
  computed: mapGetters([
    "AUTHENTICATED_WITH_SPOTIFY",
    "SPOTIFY_TOKEN_HAS_EXPIRED",
    "SPOTIFY_TOKEN_EXPIRES_AT"
  ]),
  created() {
    let authData = {
      access_token: queryString.parse(window.location.search).access_token,
      refresh_token: queryString.parse(window.location.search).refresh_token,
      expires_in: queryString.parse(window.location.search).expires_in
    };
    this.HANDLE_SPOTIFY_AUTH(authData);

    /* let parsed = queryString.parse(window.location.search);
    
    console.log(parsed); */
    if (this.AUTHENTICATED_WITH_SPOTIFY) {
      console.log(Date.now() / 1000);
      console.log(this.SPOTIFY_TOKEN_HAS_EXPIRED);
      console.log(this.SPOTIFY_TOKEN_EXPIRES_AT / 1000);
    }
  }
};
</script>

<style>
</style>
