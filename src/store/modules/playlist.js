import {
  firebaseService
} from "@/lib/firebaseService";
import {
  spotifyService
} from "@/lib/spotifyService";
import {
  GET_SPOTIFY_PLAYLISTS_REQUEST,
  GET_FIRESTORE_PLAYLISTS_REQUEST,
  GET_SPOTIFY_PLAYLISTS_TRACKS_REQUEST,
  GET_FIRESTORE_PLAYLISTS_TRACKS_REQUEST,
  SELECT_FIRESTORE_PLAYLIST_REQUEST,
  SELECT_SPOTIFY_PLAYLIST_REQUEST,
  CHECK_SYNC_NEEDED_REQUEST
} from "../actions/playlist";
import * as constants from "../constants";
import {
  session
} from "./session";

const state = {
  spotifyPlaylists: null,
  firestorePlaylists: null,
  selectedSpotifyPlaylist: null,
  selectedFirestorePlaylist: null,
  spotifyPlaylistStatus: null,
  firestorePlaylistStatus: null,
  mergedPlaylists: null
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
  },
  SPOTIFY_PLAYLIST_STATUS: state => {
    return state.spotifyPlaylistStatus;
  },
  FIRESTORE_PLAYLIST_STATUS: state => {
    return state.firestorePlaylistStatus;
  },
  PLAYLISTS: state => {
    return state.mergedPlaylists;
  }
};
const mutations = {
  SET_SPOTIFY_PLAYLISTS: (state, payload) => {
    state.spotifyPlaylists = payload;
  },
  SET_FIRESTORE_PLAYLISTS: (state, payload) => {
    state.firestorePlaylists = payload;
  },
  SET_PLAYLISTS: (state, payload) => {
    state.mergedPlaylists = payload;
  },
  SET_SELECTED_SPOTIFY_PLAYLIST: (state, payload) => {
    state.selectedSpotifyPlaylist = payload;
  },
  SET_SELECTED_FIRESTORE_PLAYLIST: (state, payload) => {
    state.selectedFirestorePlaylist = payload;
  },
  SET_SPOTIFY_PLAYLIST_STATUS: (state, payload) => {
    state.spotifyPlaylistStatus = payload;
  },
  SET_FIRESTORE_PLAYLIST_STATUS: (state, payload) => {
    state.firestorePlaylistStatus = payload;
  }
};
const actions = {
  [CHECK_SYNC_NEEDED_REQUEST]: ({
    commit
  }) => {
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
        console.log(obj.source);
        console.log(obj.playlistHash);
        console.log(pl.source);
        console.log(pl.playlistHash);
        if (
          obj.playlistHash !== "" &&
          pl.playlistHash !== "" &&
          obj.playlistHash !== pl.playlistHash
        ) {
          console.log("Firestore playlist object hash: " + obj.playlistHash);
          console.log("Spotify playlist object hash: " + pl.playlistHash);
        }
        /* if (obj.playlistHash !== pl.playlistHash) {
          console.log(
            "Object need sync: " + obj.name + ", source: " + obj.source
          );
        } */
      });
    }
  },
  /**
   *
   */
  [GET_FIRESTORE_PLAYLISTS_REQUEST]: ({
    commit
  }, userId) => {
    return new Promise((resolve, reject) => {
      commit(
        "SET_FIRESTORE_PLAYLIST_STATUS",
        constants.FIRESTORE_LOADING_PLAYLISTS
      );
      firebaseService
        .getPlaylistsByUser(userId)
        .then(resp => {
          commit(
            "SET_FIRESTORE_PLAYLIST_STATUS",
            constants.FIRESTORE_LOADING_PLAYLISTS_DONE
          );
          commit("SET_FIRESTORE_PLAYLISTS", resp);
          resolve(constants.FIRESTORE_LOADING_PLAYLISTS_DONE);
        })
        .catch(err => reject(err));
    });
  },
  [SELECT_FIRESTORE_PLAYLIST_REQUEST]: ({
    commit
  }, playlistId) => {
    let pl = state.firestorePlaylists.find(p => p.spotifyId === playlistId);
    commit("SET_SELECTED_FIRESTORE_PLAYLIST", pl);
  },
  /**
   *
   */
  [GET_FIRESTORE_PLAYLISTS_TRACKS_REQUEST]: ({
    commit
  }) => {
    return new Promise((resolve, reject) => {
      commit(
        "SET_FIRESTORE_PLAYLIST_STATUS",
        constants.FIRESTORE_LOADING_PLAYLISTS_TRACKS
      );
      let tracks = [];
      state.firestorePlaylists.forEach(pl => {
        firebaseService
          .getTracksForPlaylist(pl.id)
          .then(res => {
            tracks = res;
            commit(
              "SET_FIRESTORE_PLAYLIST_STATUS",
              constants.FIRESTORE_ADDING_TRACKS_TO_PLAYLIST
            );
            pl.tracks = tracks;
          })
          .catch(err => reject(err));
      });
      commit(
        "SET_FIRESTORE_PLAYLIST_STATUS",
        constants.FIRESTORE_LOADING_PLAYLISTS_TRACKS_DONE
      );
      resolve(constants.FIRESTORE_LOADING_PLAYLISTS_TRACKS_DONE);
    });
  },
  /**
   *
   */
  [GET_SPOTIFY_PLAYLISTS_REQUEST]: ({
    commit,
    dispatch
  }, payload) => {
    return new Promise((resolve, reject) => {
      commit("SET_PLAYLIST_STATUS", "Loading playlists from SPOTIFY");
      spotifyService
        .getPlaylists(payload.id, payload.token)
        .then(resp => {
          commit("SET_PLAYLIST_STATUS", "Playlists from SPOTIFY loaded");
          commit("SET_SPOTIFY_PLAYLISTS", resp);
          dispatch("GET_SPOTIFY_PLAYLISTS_TRACKS_REQUEST", payload).then(
            result => {
              if (result.status === 100) {
                resolve({
                  status: 100,
                  message: "All Spotify playlists and containing tracks loaded"
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
  /**
   *
   */
  [SELECT_SPOTIFY_PLAYLIST_REQUEST]: ({
    commit
  }, playlistId) => {
    let pl = state.spotifyPlaylists.find(pl => pl.spotifyId === playlistId);
    commit("SET_SELECTED_SPOTIFY_PLAYLIST", pl);
  },
  GET_PLAYLISTS: async ({
      commit,
      dispatch
    }, payload) => {
      let playlistRequests = [];
      if (payload.firestoreUserId) {
        playlistRequests.push(
          dispatch("GET_FIRESTORE_PLAYLISTS_REQUEST", payload.firestoreUserId)
        );
      }
      if (payload.spotifyUserId && payload.access_token) {
        playlistRequests.push(
          dispatch("GET_SPOTIFY_PLAYLISTS", {
            id: payload.spotifyUserId,
            token: payload.access_token
          })
        );
      }
      let requestResult = await Promise.all(playlistRequests);
      ///console.log(requestResult.forEach(res => res.status));
      requestResult.forEach(result => {
        console.log(result.status);
      });
      let valid = requestResult.filter(result => {
        return result.status === 201 || result.status === 401;
      });
      console.log(valid);
    },
    /**
     *
     */
    GET_SPOTIFY_PLAYLISTS: async ({
        commit
      }, payload) => {
        let response = {
          status: null,
          message: null
        };
        try {
          commit(
            "SET_SPOTIFY_PLAYLIST_STATUS",
            constants.SPOTIFY_LOADING_PLAYLISTS
          );
          let playlists = await spotifyService.getPlaylists(
            payload.id,
            payload.token
          );

          if (playlists) {
            commit("SET_SPOTIFY_PLAYLISTS", playlists);
            commit(
              "SET_SPOTIFY_PLAYLIST_STATUS",
              constants.SPOTIFY_LOADING_PLAYLISTS_DONE
            );
            /* commit(
                                    "SET_SPOTIFY_PLAYLIST_STATUS",
                                    constants.SPOTIFY_LOADING_PLAYLISTS_TRACKS
                                  );
                                  for (let playlist of state.spotifyPlaylists) {
                                    if (playlist.tracksCount <= 100) {
                                      let tracks = await spotifyService.getTracksForPlaylist(
                                        payload.id,
                                        playlist.spotifyId,
                                        payload.token
                                      );
                                      let tempTracks = tracks.items;
                                      for (let track of tempTracks) {
                                        playlist.tracks.push(
                                          spotifyService.createFirebaseTrackObject(track)
                                        );
                                      }
                                      commit(
                                        "SET_SPOTIFY_PLAYLIST_STATUS",
                                        constants.SPOTIFY_LOADING_AUDIO_FEATURES
                                      );
                                      let audioResponse = await spotifyService.getAudioFeatures(
                                        spotifyService.getTrackIds(playlist.tracks).toString(),
                                        payload.token
                                      );
                                      commit(
                                        "SET_SPOTIFY_PLAYLIST_STATUS",
                                        constants.SPOTIFY_LOADING_AUDIO_FEATURES_DONE
                                      );
                                      commit(
                                        "SET_SPOTIFY_PLAYLIST_STATUS",
                                        constants.SPOTIFY_MERGING_TRACKS_AUDIO_FEATURES
                                      );
                                      let mergedTracks = spotifyService.mergeAudioDetailsAndTracks(
                                        audioResponse.data.audio_features,
                                        playlist.tracks
                                      );
                                      playlist.tracks = mergedTracks;
                                      commit(
                                        "SET_SPOTIFY_PLAYLIST_STATUS",
                                        constants.SPOTIFY_MERGING_TRACKS_AUDIO_FEATURES_DONE
                                      );
                                      let hash = spotifyService.calculateHash(
                                        spotifyService.getTrackIds(playlist.tracks)
                                      );
                                      playlist.playlistHash = hash;
                                    }
                                  } */
            response = constants.SPOTIFY_LOADING_PLAYLISTS_DONE;
          }
        } catch (error) {
          response.status = 500;
          response.message = error;
        }
        return response;
      },
      /**
       *
       */
      /**
       *
       */
      [GET_SPOTIFY_PLAYLISTS_TRACKS_REQUEST]: ({
        commit,
        dispatch
      }, payload) => {
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