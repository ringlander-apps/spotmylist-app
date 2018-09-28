<template>
  <div class="container">
    <div class="source-container md-elevation-4" id="playlistContainer">
      <div class="list-tree-container">
        <h3>Playlists</h3>
        <md-list v-if="PLAYLISTS"></md-list>
        <div v-else>Tree listing should go here...</div>
      </div>
    </div>
    <div class="source-container md-elevation-4" id="firebaseContainer">
      <div class="list-tree-container">
        <h3>Local playlists</h3>
        <md-list v-if="FIRESTORE_PLAYLISTS">
          <md-list-item @click="onSelectedFirestorePlaylist(pl)" v-for="pl in FIRESTORE_PLAYLISTS" :key="pl.id">
            <div class="md-list-item-text">
              <span>{{pl.name}}</span>
              <span v-if="pl.tracks.length>0">Number of tracks: {{pl.tracks.length}}</span>
            </div>
          </md-list-item>
        </md-list>
      </div>
      <div class="list-explorer-container">
        <md-table md-card v-if="SELECTED_FIRESTORE_PLAYLIST">
          <md-table-toolbar>
            <h3>{{SELECTED_FIRESTORE_PLAYLIST.name}}</h3>
          </md-table-toolbar>
          <md-table-row>
            <md-table-head>Title</md-table-head>
            <md-table-head>Artist</md-table-head>
            <md-table-head>Album</md-table-head>
            <md-table-head>Released</md-table-head>
            <md-table-head>Duration</md-table-head>
            <md-table-head>Tempo</md-table-head>
          </md-table-row>
          <md-table-row v-for="(track, index) in SELECTED_FIRESTORE_PLAYLIST.tracks" :key="id">
            <md-table-cell>{{track.name}}</md-table-cell>
            <md-table-cell>{{track.artist.name}}</md-table-cell>
            <md-table-cell>{{track.album.name}}</md-table-cell>
            <md-table-cell></md-table-cell>
            <md-table-cell>{{track.duration}}</md-table-cell>
            <md-table-cell>{{track.tempo}}</md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </div>
    <div class="source-container md-elevation-4" id="spotifyContainer">
      <div class="list-tree-container">
        <h3>Spotify playlists</h3>
        <md-list class="md-triple-line" v-if="SPOTIFY_PLAYLISTS">
          <md-list-item @click="onSelectedSpotifyPlaylist(pl)" v-for="(pl, index) in SPOTIFY_PLAYLISTS" :key="pl.spotifyId">
            <md-avatar>
              <img :src="pl.image.url" alt="">
            </md-avatar>
            <div class="md-list-item-text">
              <span>{{pl.name.length>20?pl.name.substring(0,20).padEnd(25,'.'):pl.name}}</span>
              <span v-if="pl.tracksCount>0">Number of tracks: {{pl.tracksCount}}</span>
            </div>
            <md-icon>update</md-icon>
            
          </md-list-item>
          <md-divider></md-divider>
        </md-list>
      </div>
      <div class="list-explorer-container" v-if="SELECTED_SPOTIFY_PLAYLIST">
        <md-table md-card md-fixed-header md-sort="artist.name" md-sort-order="desc" v-model="SELECTED_SPOTIFY_PLAYLIST.tracks">
          <md-table-toolbar>
            <h3>{{SELECTED_SPOTIFY_PLAYLIST.name}}</h3>
          </md-table-toolbar>
          <md-table-row slot="md-table-row" slot-scope="{item}">
            <md-table-cell class="table-cell" md-label="Title">{{item.name}}</md-table-cell>
            <md-table-cell class="table-cell" md-label="Artist" md-sort-by="artist.name">{{item.artist.name}}</md-table-cell>
            <md-table-cell class="table-cell" md-label="Album">{{item.album.name}}</md-table-cell>
            <md-table-cell md-label="Duration">{{item.duration}}</md-table-cell>
            <md-table-cell md-label="Tempo">{{item.tempo}}</md-table-cell>
            <md-table-cell md-label="Added At" md-sort-by="spotifyAddedAt">{{item.spotfiyAddedAt}}</md-table-cell>
          </md-table-row>
          <!-- <md-table-row>
            <md-table-head>Title</md-table-head>
            <md-table-head>Artist</md-table-head>
            <md-table-head>Album</md-table-head>
            <md-table-head>Released</md-table-head>
            <md-table-head>Duration</md-table-head>
            <md-table-head>Tempo</md-table-head>
          </md-table-row> -->
          <!-- <md-table-row v-for="(track, index) in SELECTED_SPOTIFY_PLAYLIST.tracks" :key="spotifyTrackID">
            <md-table-cell>{{track.name}}</md-table-cell>
            <md-table-cell>{{track.artist.name}}</md-table-cell>
            <md-table-cell>{{track.album.name}}</md-table-cell>
            <md-table-cell></md-table-cell>
            <md-table-cell>{{track.duration}}</md-table-cell>
            <md-table-cell>{{track.tempo}}</md-table-cell>
          </md-table-row> -->
        </md-table>
        
      </div>
    </div>

    
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "PlaylistExplorer",
  props: {
    headerCaption: String
  },
  data() {
    return {
      fbPlaylists: []
    };
  },
  methods: {
    onSelectedFirestorePlaylist(e) {
      //console.log(e);
      this.SELECT_FIRESTORE_PLAYLIST_REQUEST(e.spotifyId);
    },
    onSelectedSpotifyPlaylist(e) {
      //console.log(e);
      this.SELECT_SPOTIFY_PLAYLIST_REQUEST(e.spotifyId);
    },
    ...mapActions([
      "GET_FIRESTORE_PLAYLISTS_REQUEST",
      "GET_FIRESTORE_PLAYLISTS_TRACKS_REQUEST",
      "GET_SPOTIFY_PLAYLISTS_REQUEST",
      "SELECT_FIRESTORE_PLAYLIST_REQUEST",
      "SELECT_SPOTIFY_PLAYLIST_REQUEST",
      "GET_SPOTIFY_PLAYLISTS",
      "GET_PLAYLISTS"
    ])
  },
  computed: mapGetters([
    "USER_PROFILE",
    "FIRESTORE_PLAYLISTS",
    "AUTH_USER",
    "AUTHENTICATED_WITH_SPOTIFY",
    "SPOTIFY_USER_PROFILE",
    "SPOTIFY_ACCESS_TOKEN",
    "SPOTIFY_TOKEN_HAS_EXPIRED",
    "SPOTIFY_TOKEN_EXPIRES_AT",
    "SPOTIFY_PLAYLISTS",
    "SELECTED_FIRESTORE_PLAYLIST",
    "SELECTED_SPOTIFY_PLAYLIST",
    "SPOTIFY_PLAYLIST_STATUS",
    "FIRESTORE_PLAYLIST_STATUS",
    "PLAYLISTS"
  ]),

  async created() {
    let playlistRequests = [];
    let playlistPayload = {
      spotifyUserId: null,
      access_token: null,
      firestoreUserId: null
    };

    if (this.USER_PROFILE) {
      playlistPayload.firestoreUserId = this.USER_PROFILE.userId;
      /* if (!this.FIRESTORE_PLAYLISTS) {
        let response = null;
        let response2 = await this.GET_FIRESTORE_PLAYLISTS_REQUEST(
          this.USER_PROFILE.userId
        );
        console.log(response2.status);
        if (response2.status === 401) {
          response = await this.GET_FIRESTORE_PLAYLISTS_TRACKS_REQUEST();
          console.log(response);

        }
      } */
      if (this.SPOTIFY_TOKEN_EXPIRES_AT / 1000 < Date.now() / 1000) {
        console.log(`Spotify token has expired`);
        //logout
        //get refresh token
      } else {
        playlistPayload.spotifyUserId = this.USER_PROFILE.spotifySettings.spotifyUserId;
        playlistPayload.access_token = this.SPOTIFY_ACCESS_TOKEN;

        /* if (!this.SPOTIFY_PLAYLISTS && !this.FIRESTORE_PLAYLISTS) {
          playlistRequests.push(
            this.GET_SPOTIFY_PLAYLISTS({
              id: this.USER_PROFILE.spotifySettings.spotifyUserId,
              token: this.SPOTIFY_ACCESS_TOKEN
            })
          );
          playlistRequests.push(
            this.GET_FIRESTORE_PLAYLISTS_REQUEST(this.USER_PROFILE.userId)
          );
          let requestResult = await Promise.all(playlistRequests);
          console.log(requestResult); */
        /* let result = await this.GET_SPOTIFY_PLAYLISTS({
            id: this.USER_PROFILE.spotifySettings.spotifyUserId,
            token: this.SPOTIFY_ACCESS_TOKEN
          }); */
        //console.log(result.status);
        //console.log(this.FIRESTORE_PLAYLIST_STATUS.status);
      }
      let result = await this.GET_PLAYLISTS(playlistPayload);
    }
  }
};
</script>

<style scoped>
.container {
  width: 80vw;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 1fr 1fr;
}
.source-container {
  display: grid;
  grid-template-columns: auto 1fr;
}
#firebaseContainer {
  /* background-color: red; */
  grid-row: 1 / span 2;
}
.table-cell {
  text-align: left;
  padding: 0px;
}
</style>
