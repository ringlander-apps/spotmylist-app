import spotifyConfig from '@/spotifyConfig';

class SpotifyService{
  constructor(){

  }
  /**
   * 
   */
  getUserOwnedLists(fullist, owner){
    let userOwnedList = new Array();
    fulllist.forEach(item => {
      let owner = item.owner;
      if(owner.id===user){
        userOwnedList.push(item);
      }
    });
    userOwnedList.sort((a,b)=>{
      return b.tracks.total - a.tracks.total;
    });
    return userOwnedList;
  }
}
export const spotifyHelperService = new SpotifyService();