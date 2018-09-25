import db from "@/firebaseInit";
import { ok } from "assert";

class FirebaseService {
  constructor() {
    const settings = {
      timestampsInSnapshots: true
    };
    db.settings(settings);
  }
  /**
   *
   * @param {*} playlistId
   */
  async getTracksForPlaylist(playlistId) {
    let tracks = [];

    const trackQueryResponse = await db
      .collection(`playlists/${playlistId}/tracks`)
      .get();

    trackQueryResponse.docs.forEach(doc => {
      let trackObj = {
        id: doc.id,
        spotifyTrackID: doc.data().spotifyTrackId,
        spotifyAddedAt: doc.data().spotifyAddedAt,
        name: doc.data().name,
        album: doc.data().album,
        artist: doc.data().artist,
        tempo: doc.data().tempo,
        key: doc.data().key,
        timeSignature: doc.data().timeSignature,
        duration: doc.data().duration
      };
      tracks.push(trackObj);
    });
    console.log(tracks);
    return tracks;
  }
  /**
   *
   * @param {*} userId
   */
  async getPlaylistsByUser(userId) {
    let pls = [];
    const queryResponse = await db
      .collection("playlists")
      .where("owner", "==", userId)
      .get();
    queryResponse.docs.forEach(doc => {
      let plObj = {
        id: doc.id,
        name: doc.data().name,
        url: doc.data().href,
        image: doc.data().image,
        owner: doc.data().owner,
        playlistHash: doc.data().playlistHash,
        spotifyId: doc.data().spotifyId,
        spotifyUser: doc.data().spotifyUser,
        updatedAt: doc.data().updatedAt,
        needSync: false,
        tracks: new Array(),
        source: "FIREBASE"
      };
      pls.push(plObj);
    });
    /* pls.forEach(async pl => {
      const trackQueryResponse = await db
        .collection(`playlists/${pl.id}/tracks`)
        .get();
      trackQueryResponse.docs.forEach(doc => {
        console.log(doc.data());
        let trackObj = {
          id: doc.id,
          spotifyTrackID: doc.data().spotifyTrackId,
          spotifyAddedAt: doc.data().spotifyAddedAt,
          name: doc.data().name,
          album: doc.data().album,
          artist: doc.data().artist,
          tempo: doc.data().tempo,
          key: doc.data().key,
          timeSignature: doc.data().timeSignature,
          duration: doc.data().duration
        };
        pl.tracks.push(trackObj);
      });
    }); */
    return pls;
  }
  /**
   *
   * @param {*} userEmail
   */
  async getUserByEmail(userEmail) {
    let userObj = null;
    const queryResponse = await db
      .collection("users")
      .where("userEmail", "==", userEmail)
      .get();
    if (queryResponse.docs.length === 1) {
      userObj = {
        userName: queryResponse.docs[0].data().userName,
        authProvider: queryResponse.docs[0].data().authProvider,
        spotifySettings: queryResponse.docs[0].data().spotifySettings,
        userId: queryResponse.docs[0].data().userId,
        lastLoginAt: queryResponse.docs[0].data().lastLoginAt,
        userImage: queryResponse.docs[0].data().userImage,
        fullName: queryResponse.docs[0].data().fullName,
        name: queryResponse.docs[0].data().name
      };
    }
    return userObj;
  }
  /**
   *
   * @param {*} updateUser
   */
  async updateUserProfile(updateUser) {
    let obj = null;
    const userQueryResponse = await db
      .collection("users")
      .where("userId", "==", updateUser.userId)
      .get();
    if (userQueryResponse.docs.length === 1) {
      userQueryResponse.docs.forEach(doc => {
        doc.ref
          .update({
            userName: updateUser.userName,
            name: updateUser.name,
            spotifySettings: updateUser.spotifySettings,
            fullName: updateUser.fullName
          })
          .then(() => {
            obj = Date.now();
          })
          .catch(err => {
            return err;
          });
      });
    }
    return obj;
  }
  /**
   *
   * @param {*} editUser
   */
  updateUser(editUser) {
    return new Promise((resolve, reject) => {
      let returnObj = {
        status: "",
        message: ""
      };
      db.collection("users")
        .where("userId", "==", editUser.userId)
        .get()
        .then(qs => {
          qs.forEach(doc => {
            doc.ref
              .update({
                userName: editUser.userName,
                name: editUser.name,
                spotifySettings: editUser.spotifySettings,
                updatedAt: new Date(),
                fullName: editUser.fullName
              })
              .then(() => {
                returnObj = {
                  status: "10",
                  message: "User updated successfully"
                };

                resolve(returnObj);
              })
              .catch(err => {
                reject(Error(err));
              });
          });
        });
    });
  }

  async getUserPlaylists(userId) {
    let pls = [];
    const userPlaylists = await db
      .collection("playlists")
      .where("userId", "==", userId)
      .get();
    userPlaylists.docs.forEach(doc => {
      let plObj = {
        id: doc.id,
        url: doc.data().href,
        image: doc.data().image,
        owner: doc.data().owner,
        playlistHash: doc.data().playlistHash,
        spotifyId: doc.data().spotifyId,
        spotifyUser: doc.data().spotifyUser,
        updatedAt: doc.data().updatedAt
        /**
         *
         * href
         * image :{
         * }
         * owner
         * playlistHash
         * spotifyId
         * spotifyUser :{
         * }
         * updatedAt
         * tracks: []
         *
         */
      };
      pls.push(plObj);
    });
    return pls;
  }
}
export const firebaseService = new FirebaseService();
