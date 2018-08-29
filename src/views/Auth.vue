<template>
  <div>
    <h3>Loading....</h3>
  </div>
</template>

<script>
import { mapActions,mapGetters } from "vuex";
import router from '../router';
import {USER_BY_EMAIL_REQUEST} from "@/store/actions/user";

export default {
  name: "Auth",

  computed: mapGetters(['AUTH_USER']),
  methods: mapActions(['HANDLE_AUTHENTICATION','HANDLE_AUTH','GET_USER_PROFILE_BY_EMAIL']),


  data(){
    return{
      authError: " "
    }
  },
  created(){
    // this.HANDLE_AUTHENTICATION()
    //   .then(()=>{
    //     console.log(this.AUTH_USER);  
    //     router.push({
    //       name: "home"
    //   });
    //   })
    //   .catch((err)=>{
    //     this.authError = err;
    //   });
    this.HANDLE_AUTH()
      .then((resp)=>{
        router.push({
          name: "home"
        });
        
      })
      .catch(err=>{
        if(err.message.indexOf("10")>-1){
          router.push({
            name: "user"
          });
        }
        
      });

  }
};
</script>

<style scoped>
</style>