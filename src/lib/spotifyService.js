import spotifyConfig from "@/spotifyConfig";
import Axios from "axios";
import md5 from "md5";

class SpotifyService {
  constructor() {}
  /**
   *
   */
  async getCurrentUser(access_token) {
    let { data } = await Axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + access_token
      }
    });
    return data;
  }
  /**
   *
   * @param {*} trackIds
   * @param {*} access_token
   */
  getAudioFeatures(trackIds, access_token) {
    return new Promise((resolve, reject) => {
      Axios.get(`${spotifyConfig.audioURL}${trackIds}`, {
        headers: spotifyConfig.spotifyHeaders(access_token)
      })
        .then(resp => {
          resolve(resp);
        })
        .catch(err => reject(err));
    });
  }

  /**
   *
   * @param {*} nextUrl
   * @param {*} access_token
   */
  getNextTracksForPlaylist(nextUrl, access_token) {
    return new Promise((resolve, reject) => {
      console.log(`Next URL: ${nextUrl}`);
      Axios.get(`${nextUrl}`, {
        headers: spotifyConfig.spotifyHeaders(access_token)
      })
        .then(resp => {
          resolve(resp.data);
        })
        .catch(err => reject(err));
    });
  }
  /**
   *
   * @param {*} userId
   * @param {*} playlistId
   * @param {*} access_token
   */
  getTracksForPlaylist(userId, playlistId, access_token) {
    return new Promise((resolve, reject) => {
      Axios.get(spotifyConfig.playlistTracksEndpoint(userId, playlistId), {
        headers: spotifyConfig.spotifyHeaders(access_token)
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => reject(err));
    });
  }
  async getPlaylistTracks(userId, playlistId, access_token) {
    try {
      let { data } = await Axios.get(
        spotifyConfig.playlistTracksEndpoint(userId, playlistId),
        {
          headers: spotifyConfig.spotifyHeaders(access_token)
        }
      );
      if (data.items) {
        return data;
      }
    } catch (error) {
      return error;
    }
  }
  /**
   *
   * @param {*} trackIds
   */
  calculateHash(trackIds) {
    return md5(trackIds.toString());
  }
  /**
   *
   * @param {*} tracks
   */
  getTrackIds(tracks) {
    return tracks.map(t => t.spotifyTrackID);
  }
  /**
   *
   * @param {*} spotifyTrackObj
   */
  createFirebaseTrackObject(spotifyTrackObj) {
    return {
      spotifyTrackID: spotifyTrackObj.track.id,
      name: spotifyTrackObj.track.name,
      spotifyAddedAt: spotifyTrackObj.added_at,
      album: {
        spotifyAlbumId: spotifyTrackObj.track.album.id,
        name: spotifyTrackObj.track.album.name,
        released: spotifyTrackObj.track.album.released
      },
      artist: {
        spotifyArtistId: spotifyTrackObj.track.artists[0].id,
        name: spotifyTrackObj.track.artists[0].name,
        spotifyArtistURL: spotifyTrackObj.track.artists[0].href
      },
      tempo: null,
      duration: null,
      key: null,
      timeSignature: null
    };
  }
  /**
   *
   * @param {*} audio_features
   * @param {*} tracksArray
   */
  mergeAudioDetailsAndTracks(audio_features, tracksArray) {
    tracksArray.forEach(track => {
      const audio_obj = audio_features.find(af => {
        return af !== null && af !== undefined
          ? af.id === track.spotifyTrackID
          : null;
      });

      if (audio_obj !== null && audio_obj !== undefined) {
        track.tempo = audio_obj.tempo;
        track.key = audio_obj.key;
        track.timeSignature = audio_obj.time_signature;
        track.duration = audio_obj.duration_ms;
      }
    });
    return tracksArray;
  }
  /**
   *
   * @param {*} userId
   * @param {*} playlist
   * @param {*} access_token
   */
  attachTracksToPlaylist(userId, playlist, access_token) {
    return new Promise((resolve, reject) => {
      let tempTracks;
      let audioFeatures;
      let tracks = [];
      let nextUrl = "";
      let mergedTracks = [];
      let restTracks;

      if (playlist.tracksCount > 100) {
        let rounds = Math.ceil(playlist.tracksCount / 100);
        //let store = "";
        for (let index = 0; index < rounds; index++) {
          if (index === 0) {
            this.getTracksForPlaylist(userId, playlist.spotifyID, access_token)
              .then(data => {
                tempTracks = data;
                nextUrl = tempTracks.next;
                tempTracks.items.forEach(t => {
                  let fbTrack = {
                    spotifyTrackID: t.track.id,
                    name: t.track.name,
                    album: {
                      spotifyAlbumId: t.track.album.id,
                      name: t.track.album.name,
                      released: t.track.album.released
                    },
                    artist: {
                      spotifyArtistId: t.track.artists[0].id,
                      name: t.track.artists[0].name,
                      spotifyArtistURL: t.track.artists[0].href
                    }
                  };
                  tracks.push(fbTrack);
                  playlist.tracks = tracks;
                  let hash = this.calculateHash(this.getTrackIds(tracks));
                  playlist.playlistHash = hash;
                });
                //Fetch the audio features
                this.getAudioFeatures(
                  this.getTrackIds(playlist.tracks).toString(),
                  access_token
                )
                  .then(audioResponse => {
                    mergedTracks = this.mergeAudioDetailsAndTracks(
                      audioResponse.audio_features,
                      playlist.tracks
                    );
                    playlist.tracks = mergedTracks;
                  })
                  .catch(err =>
                    console.log("Error in getting audio features: " + err)
                  );
              })
              .catch(err => console.log(err));
          } else {
            /* console.log(`Else statement: ${store}`);
            this.getNextTracksForPlaylist(nextUrl, access_token)
              .then(response => {})
              .catch(err => console.log(`Error getting next tracks: ${err}`)); */
          }
        }
      }
      console.log(`Soon to be returned playlist: ${playlist}`);
      resolve(playlist);
    });
  }
  /**
   *
   * @param {*} userId
   * @param {*} access_token
   */
  getPlaylists(userId, access_token) {
    return new Promise((resolve, reject) => {
      let userList = new Array();
      let plCopies = new Array();
      Axios.get(spotifyConfig.userMyPlaylistsURL, {
        headers: spotifyConfig.spotifyHeaders(access_token)
      })
        .then(resp => {
          userList = this.getUserOwnedLists(resp.data.items, userId);
          userList.forEach(list => {
            plCopies.push(this.mapToFirebasePlaylist(list));
          });
          resolve(plCopies);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  /**
   *
   * @param {*} origPL
   */
  mapToFirebasePlaylist(origPL) {
    return {
      spotifyId: origPL.id,
      href: origPL.href,
      image: origPL.images.length === 0 ? "" : origPL.images[0],
      name: origPL.name,
      owner: origPL.owner.id,
      playlistHash: "",
      tracksCount: origPL.tracks.total,
      tracks: new Array(),
      source: "SPOTIFY"
    };
  }
  /**
   *
   * @param {*} fullist
   * @param {*} userId
   */
  getUserOwnedLists(fullist, userId) {
    let userOwnedList = new Array();
    fullist.forEach(item => {
      let owner = item.owner;
      if (owner.id === userId) {
        userOwnedList.push(item);
      }
    });
    userOwnedList.sort((a, b) => {
      return b.tracks.total - a.tracks.total;
    });
    return userOwnedList;
  }
}
export const spotifyService = new SpotifyService();
