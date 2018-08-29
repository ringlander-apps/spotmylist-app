import db from "@/firebaseInit";

class FirebaseService{
  constructor(){

  }

  async getUserByEmail(userEmail){
    let userObj = null;
    const queryResponse = await db.collection('users').where("userEmail","==",userEmail).get();
    if(queryResponse.docs.length===1){
      userObj = {
        userName: queryResponse.docs[0].data().userName,
        authProvider: queryResponse.docs[0].data().authProvider,
        spotifyUserId: queryResponse.docs[0].data().spotifyUserId,
        userId: queryResponse.docs[0].data().userId,
        lastLoginAt: queryResponse.docs[0].data().lastLoginAt,
        autoConnectToSpotify: queryResponse.docs[0].data().autoConnectToSpotify
      }
    }
    return userObj;
  }

  async getUserPlaylists(userId){
    let pls=[];
    const userPlaylists = await db.collection('playlists').where("userId","==",userId).get();
    userPlaylists.docs.forEach(doc=>{
      let plObj = {
        id: doc.id,
        url: doc.data().href,
        image: doc.data().image,
        owner: doc.data().owner,
        playlistHash: doc.data().playlistHash,
        spotifyId:doc.data().spotifyId,
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
      }
      pls.push(plObj);
    });
    return pls;
  }
}
export const firebaseService = new FirebaseService();