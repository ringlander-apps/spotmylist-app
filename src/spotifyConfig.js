export default {
  userEndpoint: "/me",
  currentUserPlaylistsEndpoint: "/playlists",
  userURL: "https://api.spotify.com/v1/me",
  userPlaylistsURL: "https://api.spotify.com/v1/me",
  userMyPlaylistsURL: "https://api.spotify.com/v1/me/playlists?limit=50",
  audioURL: "https://api.spotify.com/v1/audio-features?ids=",

  playlistTracksEndpoint: function(user_id, playlist_id) {
    return `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`;
  },
  spotifyHeaders: function(access_token) {
    return {
      Authorization: "Bearer " + access_token
    };
  }

  //	https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks
  //  https://api.spotify.com/v1/me/playlists
};
