<template>
  <div>
    <div v-if="AUTH_USER && USER_PROFILE" id="userProfile" class="card md-elevation-4">
      <div class="card-header">
        <div class="card-header-content">
          <div class="profile-heading-firstName">{{USER_PROFILE.name.firstName}}</div>
          <div class="profile-heading-lastName">{{USER_PROFILE.name.lastName}}</div>
          <div class="profile-heading-title">{{AUTH_USER.email}}</div>
        </div>
        <div class="card-header-image">
          <img :src=USER_PROFILE.userImage.url class="md-elevation-2" alt="" srcset="">
        </div>
        
      </div>
      <div class="card-content">
        <md-tabs>
          <md-tab md-label="APP DETAILS">
            <section class="card-content-section" id="detailsContentSection">
          <div class="card-content-section-header">
            <h4>Details</h4>
          </div>
          <div class="card-content-section-form">
            <div class="form-left">
              <p><label for="inputUserName">Username:</label></p>
              <p><label for="inputFirstName">First Name:</label></p>
              <p><label for="inputLastName">Last Name:</label></p>
              <p><label for="inputEmail">Email:</label></p>
            </div>
            <div class="form-right">
              <p>
                <input type="text" name="" id="inputUserName" v-model="userName">
              </p>
              <p><input type="text" name="" id="inputFirstName" v-model="firstName"></p>
              <p><input type="text" name="" id="inputLastName" v-model="lastName"></p>
              <p><input type="text" name="" id="inputEmail" readonly v-model="userEmail"></p>
            </div>
          </div>
        </section>
        <section class="card-content-section" id="settingsContentSection">
          <div class="card-content-section-header">
            <h4>User settings</h4>
          </div>
          <div class="card-content-section-form">
            <div class="form-left">
              <p><label for="">Connect To Spotify:</label></p>
              <p><label for="">Spotify User ID:</label></p>
              <p><label for="">Automatic sign-in To Spotify:</label></p>
            </div>
            <div class="form-right">
              <p><md-switch v-model="connectToSpotify"></md-switch></p>
              <p><input type="text" v-model="spotifyUserId"></p>
              <p><md-switch v-model="autoConnectToSpotify"></md-switch></p>
            </div>
          </div>
        </section>
        <section class="card-action-section">
          <div class="card-action-section-controls">
            <md-button @click="updateUserProfile">Update</md-button>
          </div>
        </section>
          </md-tab>
          <md-tab v-if="SPOTIFY_USER_PROFILE" md-label="SPOTIFY USER DETAILS">
            <section>
              <h3>{{SPOTIFY_USER_PROFILE.id}}</h3>
              <p></p>
              <img :src="SPOTIFY_USER_PROFILE.images[0]" alt="">
            </section>
          </md-tab>
          
        </md-tabs>
        
      </div> 
    
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { USER_GET_SPOTIFY_USER_REQUEST } from "@/store/actions/user";

export default {
  name: "UserProfile",
  props: {
    msg: String
  },

  computed: {
    ...mapGetters([
      "AUTH_USER",
      "USER_PROFILE",
      "AUTHENTICATED_WITH_SPOTIFY",
      "SPOTIFY_USER_PROFILE",
      "SPOTIFY_ACCESS_TOKEN",
      "SPOTIFY_TOKEN_HAS_EXPIRED",
      "SPOTIFY_TOKEN_EXPIRES_AT"
    ]),
    userEmail: {
      get() {
        return this.AUTH_USER.email;
      }
    },
    connectToSpotify: {
      get() {
        return this.USER_PROFILE.spotifySettings.connectedToSpotify;
      },
      set(value) {
        this.$store.commit("SET_CONNECT_TO_SPOTIFY", value);
      }
    },
    spotifyUserId: {
      get() {
        return this.USER_PROFILE.spotifySettings.spotifyUserId;
      },
      set(value) {
        this.$store.commit("SET_USER_PROFILE_SPOTIFY_ID", value);
      }
    },
    autoConnectToSpotify: {
      get() {
        return this.USER_PROFILE.spotifySettings.autoConnectToSpotify;
      },
      set(value) {
        this.$store.commit("SET_AUTO_SIGNIN_TO_SPOTIFY", value);
      }
    },
    userName: {
      get() {
        return this.USER_PROFILE.userName;
      },
      set(value) {
        this.$store.commit("SET_USER_PROFILE_USERNAME", value);
      }
    },
    lastName: {
      get() {
        return this.USER_PROFILE.name.lastName;
      },
      set(value) {
        this.$store.commit("SET_USER_PROFILE_LASTNAME", value);
      }
    },
    firstName: {
      get() {
        return this.USER_PROFILE.name.firstName;
      },
      set(value) {
        this.$store.commit("SET_USER_PROFILE_FIRSTNAME", value);
      }
    }
  },
  data() {
    return {};
  },
  created() {
    if (this.SPOTIFY_ACCESS_TOKEN) {
      if (this.SPOTIFY_TOKEN_HAS_EXPIRED) {
      } else {
        if (this.SPOTIFY_USER_PROFILE) {
          console.log(this.SPOTIFY_USER_PROFILE);
          console.log(this.SPOTIFY_USER_PROFILE.images);
        } else {
          this.$store
            .dispatch(
              "USER_GET_SPOTIFY_USER_REQUEST",
              this.SPOTIFY_ACCESS_TOKEN
            )
            .then(resp => {
              alert(resp.message);
            });
        }
      }
    }
    /* if (this.AUTHENTICATED_WITH_SPOTIFY) {
      console.log("User is authenticated with spotify");
      if (this.SPOTIFY_USER_PROFILE) {
        console.log("We have a profile");
      } else {
        console.log("We don't have a spotify user profile loaded");
        //
        this.$store.dispatch(
          "USER_GET_SPOTIFY_USER_REQUEST",
          this.SPOTIFY_ACCESS_TOKEN
        );
      }
    } */
  },
  mounted() {},
  methods: {
    updateUserProfile() {
      this.USER_UPDATE_REQUEST()
        .then(resp => {
          alert(resp.message);
        })
        .catch();
    },
    ...mapActions(["USER_UPDATE_REQUEST", USER_GET_SPOTIFY_USER_REQUEST])
  }
};
</script>

<style scoped>
#userProfile {
  width: 50vw;
  margin: auto;
  margin-top: 50px;
}
.card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 200px auto auto;
  background-color: lightpink;
  padding: 10px 30px;
  height: 100vh;
}
.card-header {
  grid-column: 1 / span 2;
  grid-row: 1/2;
  display: grid;
  border-bottom: rgba(0, 0, 0, 0.2) solid 2px;
  margin-bottom: 10px;
}
.card-header-content {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  grid-column: 1/2;
  margin-top: auto;
  margin-bottom: auto;
}
.profile-heading-firstName {
  font-size: 2.9em;
  color: #666;
  letter-spacing: 0.03em;
  line-height: 1.4em;
}
.profile-heading-lastName {
  font-size: 2.9em;
  color: #555;
  letter-spacing: 0.03em;
}
.profile-heading-title {
  font-size: 1em;
  color: #555;
  letter-spacing: 0.08em;
  font-style: italic;
  line-height: 1.99em;
  margin-top: 3px;
}

.card-header-image {
  grid-column: 2/3;
  display: flex;
  align-items: flex-end;
  flex-flow: column;
  margin-top: auto;
  margin-bottom: auto;
}

.card-content {
  /* background-color: yellow; */
  grid-row: 2 / span 2;
  grid-column: 1 / span 2;
  display: grid;
  grid-template-rows: 1fr 1fr 50px;
  grid-gap: 10px;
  height: auto;
  max-height: 100%;
}
.card-content-section {
  display: grid;
  grid-template-rows: 50px 1fr;
  grid-template-columns: 1fr 1fr;
  border-bottom: rgba(0, 0, 0, 0.2) solid 2px;
}
.card-content-section-header {
  grid-column: 1 / span 2;
  grid-row: 1 / span 1;
  display: flex;
}
.card-content-section-header h4 {
  font-size: 1.2em;
  text-transform: uppercase;
  color: #444;
}
.card-content-section-form {
  grid-column: 1 / span 2;
  grid-row: 2 / span 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  color: #777;
  text-transform: uppercase;
}
.form-left {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
}
.form-right {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
}
#detailsContentSection {
  grid-row: 1 / span 1;
}
#settingsContentSection {
  grid-row: 2 / span 1;
}
.card-action-section {
  grid-row: 3 / span 1;
}
.details-section h4 {
  color: #555;
}
</style>
