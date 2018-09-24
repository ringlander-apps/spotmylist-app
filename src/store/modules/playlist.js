import { firebaseService } from "@/lib/firebaseService";
import { spotifyService } from "@/lib/spotifyService";
import {
  GET_SPOTIFY_PLAYLISTS_REQUEST,
  GET_FIRESTORE_PLAYLISTS_REQUEST,
  GET_SPOTIFY_PLAYLISTS_TRACKS_REQUEST,
  SELECT_FIRESTORE_PLAYLIST_REQUEST,
  SELECT_SPOTIFY_PLAYLIST_REQUEST,
  CHECK_SYNC_NEEDED_REQUEST
} from "../actions/playlist";
import { session } from "./session";

const state = {
  spotifyPlaylists: null,
  firestorePlaylists: null,
  selectedSpotifyPlaylist: null,
  selectedFirestorePlaylist: null
};
const getters = {
  SPOTIFY_PLAYLISTS: state => {
    return state.spotifyPlaylists;
  },
  FIRESTORE_PLAYLISTS: state => {
    return state.firestorePlaylists;
  },
  SELECTED_SPOTIFY_PLAYLIST: state => {
    return state.selectedSpotifyPlaylist;
  },
  SELECTED_FIRESTORE_PLAYLIST: state => {
    return state.selectedFirestorePlaylist;
  }
};
const mutations = {
  SET_SPOTIFY_PLAYLISTS: (state, payload) => {
    state.spotifyPlaylists = payload;
  },
  SET_FIRESTORE_PLAYLISTS: (state, payload) => {
    state.firestorePlaylists = payload;
  },
  SET_SELECTED_SPOTIFY_PLAYLIST: (state, payload) => {
    state.selectedSpotifyPlaylist = payload;
  },
  SET_SELECTED_FIRESTORE_PLAYLIST: (state, payload) => {
    state.selectedFirestorePlaylist = payload;
  }
};
const actions = {
  [CHECK_SYNC_NEEDED_REQUEST]: ({ commit }) => {
    if (state.spotifyPlaylists && state.firestorePlaylists) {
      console.log("We should check if sync is needed");
      //get the duplicate objects
      let uniques = state.spotifyPlaylists.filter(pl => {
        return !state.firestorePlaylists.some(pl2 => {
          return pl2.spotifyId === pl.spotifyId;
        });
      });
      let dupes = state.spotifyPlaylists.filter(pl => {
        return state.firestorePlaylists.some(pl2 => {
          return pl2.spotifyId === pl.spotifyId;
        });
      });
      console.log(uniques);
      console.log(dupes);

      dupes.forEach(pl => {
        let obj = state.firestorePlaylists.find(pl2 => {
          return pl2.spotifyId === pl.spotifyId;
        });

        /* if (obj.playlistHash !== pl.playlistHash) {
          console.log(
            "Object need sync: " + obj.name + ", source: " + obj.source
          );
        } */
      });
      state.firestorePlaylists.forEach(pl => {
        console.log(pl.tracks[0]);
      });
    }
  },
  [GET_FIRESTORE_PLAYLISTS_REQUEST]: ({ commit, dispatch }, userId) => {
    return new Promise((resolve, reject) => {
      firebaseService
        .getPlaylistsByUser(userId)
        .then(resp => {
          commit("SET_FIRESTORE_PLAYLISTS", resp);
          dispatch("CHECK_SYNC_NEEDED_REQUEST");
          resolve("OK");
        })
        .catch(err => console.log(err));
    });
  },
  [SELECT_FIRESTORE_PLAYLIST_REQUEST]: ({ commit }, playlistId) => {
    let pl = state.firestorePlaylists.find(p => p.spotifyId === playlistId);
    commit("SET_SELECTED_FIRESTORE_PLAYLIST", pl);
  },
  [GET_SPOTIFY_PLAYLISTS_REQUEST]: ({ commit, dispatch }, payload) => {
    return new Promise((resolve, reject) => {
      spotifyService
        .getPlaylists(payload.id, payload.token)
        .then(resp => {
          //console.log(resp[0].image);
          commit("SET_SPOTIFY_PLAYLISTS", resp);
          dispatch("GET_SPOTIFY_PLAYLISTS_TRACKS_REQUEST", payload).then(
            result => {
              if (result.status === 100) {
                dispatch("CHECK_SYNC_NEEDED_REQUEST");
                resolve({
                  status: 100,
                  message: "All playlists and containing tracks loaded"
                });
              }
            }
          );
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  [SELECT_SPOTIFY_PLAYLIST_REQUEST]: ({ commit }, playlistId) => {
    //console.log(playlistId);
    //console.log(state.spotifyPlaylists);
    let pl = state.spotifyPlaylists.find(pl => pl.spotifyId === playlistId);
    commit("SET_SELECTED_SPOTIFY_PLAYLIST", pl);
  },
  [GET_SPOTIFY_PLAYLISTS_TRACKS_REQUEST]: ({ commit, dispatch }, payload) => {
    return new Promise((resolve, reject) => {
      let tempTracks;
      let nextURL;
      let mergedTracks = [];
      state.spotifyPlaylists.forEach(pl => {
        //if playlist have more than 100 tracks
        if (pl.tracksCount > 100) {
          let rounds = Math.ceil(pl.tracksCount / 100);
          for (let index = 0; index < rounds; index++) {
            if (index === 0) {
              spotifyService
                .getTracksForPlaylist(payload.id, pl.spotifyId, payload.token)
                .then(tracks => {
                  tempTracks = tracks.items;
                  nextURL = tracks.next;
                  tempTracks.forEach(t => {
                    pl.tracks.push(spotifyService.createFirebaseTrackObject(t));
                  });
                })
                .catch(err => console.log(err));
            }
          }
        } else {
          spotifyService
            .getTracksForPlaylist(payload.id, pl.spotifyId, payload.token)
            .then(tracks => {
              tempTracks = tracks.items;
              tempTracks.forEach(t => {
                pl.tracks.push(spotifyService.createFirebaseTrackObject(t));
              });
              spotifyService
                .getAudioFeatures(
                  spotifyService.getTrackIds(pl.tracks).toString(),
                  payload.token
                )
                .then(audioResponse => {
                  mergedTracks = spotifyService.mergeAudioDetailsAndTracks(
                    audioResponse.data.audio_features,
                    pl.tracks
                  );
                  pl.tracks = mergedTracks;
                  let hash = spotifyService.calculateHash(
                    spotifyService.getTrackIds(pl.tracks)
                  );
                  pl.playlistHash = hash;
                })
                .catch(err => {
                  reject("Error getting audio features for track" + err);
                });
            })
            .catch(err => {
              reject("Error getting tracks" + err);
            });
        }
      });
      resolve({
        status: 100,
        message: "Tracks loaded for all playlists"
      });
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
