<template>
  <h3><strong>{{headerCaption}}</strong></h3>
</template>

<script>
import db from '../firebaseInit';
export default {
  name: "PlaylistExplorer",
  props: {
    headerCaption: String
  },
  data(){
    return{
      fbPlaylists: []
    }
  },
  methods: {
    /**
     * 
     */
    async getFirebasePlaylists(){
      
      const fbRawPlaylists = await db.collection('playlists').get();
      fbRawPlaylists.docs.forEach(doc=>{
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
        this.fbPlaylists.push(plObj);
        
      });
      
    }
  },
  created(){
    this.getFirebasePlaylists();
    
  }
}
</script>

<style>

</style>
