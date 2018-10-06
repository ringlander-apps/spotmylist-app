export const SPOTIFY_LOADING_PLAYLISTS = {
  status: 101,
  message: "Fetching Spotify playlists...."
};
export const SPOTIFY_LOADING_PLAYLISTS_DONE = {
  status: 102,
  message: "Done fetching Spotify playlists"
};

export function currentPlaylistLoadingTracks(source, playlistName) {
  return {
    status: 10001,
    message: `Loading tracks for ${playlistName}`
  };
};
export function currentPlaylistProcessingTracks(source, playlistName) {
  return {
    status: 10002,
    message: `Processing tracks for ${playlistName}`
  };
};
export function currentPlaylistLoadingAFTracks(source, playlistName) {
  return {
    status: 10003,
    message: `Loading audio features for tracks in ${playlistName}`
  };
};
export function currentPlaylistMergeAFAndTracks(source, playlistName) {
  return {
    status: 10004,
    message: `Merging audio features with tracks for ${playlistName}`
  };
};

export const SPOTIFY_LOADING_PLAYLISTS_TRACKS = {
  status: 103,
  message: "Fetching and processing tracks for Spotify playlists"
};
export const SPOTIFY_LOADING_PLAYLISTS_TRACKS_DONE = {
  status: 104,
  message: "Done fetching and processing tracks for Spotify playlists"
};
export const SPOTIFY_LOADING_AUDIO_FEATURES = {
  status: 105,
  message: "Fetching audio features for Spotify playlist tracks"
};
export const SPOTIFY_LOADING_AUDIO_FEATURES_DONE = {
  status: 106,
  message: "Done fetching audio features for Spotify playlist tracks"
};
export const SPOTIFY_MERGING_TRACKS_AUDIO_FEATURES = {
  status: 107,
  message: "Merging audio features with Spotify playlist tracks"
};
export const SPOTIFY_MERGING_TRACKS_AUDIO_FEATURES_DONE = {
  status: 108,
  message: "Done merging audio features with Spotify playlist tracks"
};
export const FIRESTORE_LOADING_PLAYLISTS = {
  status: 201,
  message: "Fetching playlists from Firestore"
};
export const FIRESTORE_LOADING_PLAYLISTS_DONE = {
  status: 202,
  message: "Done fetching playlists from Firestore"
};
export const FIRESTORE_LOADING_PLAYLISTS_TRACKS = {
  status: 203,
  message: "Fetching tracks for Firestore playlists"
};
export const FIRESTORE_ADDING_TRACKS_TO_PLAYLIST = {
  status: 205,
  message: "Adding tracks to Firestore playlists"
};
export const FIRESTORE_LOADING_PLAYLISTS_TRACKS_DONE = {
  status: 204,
  message: "Done processing tracks for Firestore playlists"
};
export const PLAYLIST_OP_COMPLETE = {
  status: 1010,
  message: "Done processing the playlists"
};

export const SYNC_CHECK = {
  status: 10,
  message: "Checking if synchronization is needed"
};
export const ADD_CHECK = {
  status: 20,
  message: "Checking for new additions since last synchronization"
};
export const DUPE_CHECK = {
  status: 30,
  message: "Checking for duplicate playlists"
};
export const MERGE_LISTS = {
  status: 40,
  message: "Compiling and merging playlists"
};
export const PLAYLIST_LOADING = {
  status: 1020,
  message: "Loading the playlists"
};
export const PLAYLIST_LOADING_DONE = {
  status: 1030,
  message: "Loading of playlists done"
};

/* export const FIRESTORE_LOADING_PLAYLISTS_DONE = {
  status: 311,
  message: "Done fetching playlists from Firestore"
}; */