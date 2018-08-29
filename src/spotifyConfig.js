export default {
  //baseAPI: "https://api.spotify.com/v1",
  userEndpoint: "/me",
  currentUserPlaylistsEndpoint: "/playlists",
  
  userPlaylistsURL: "https://api.spotify.com/v1/me",
  userMyPlaylistsURL: "https://api.spotify.com/v1/me/playlists?limit=50",
  //userURL: baseAPI+userEndPoint,

  playlistTracksEndpoint: function(user_id, playlist_id){
    return `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`;
  },
  spotifyHeaders: function(access_token){
    return {
      "Authorization":"Bearer " + access_token
    };
  }
  
  //	https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks
  //  https://api.spotify.com/v1/me/playlists

}