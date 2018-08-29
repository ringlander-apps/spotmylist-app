<template>
  <div>
    <h1>This is the User View</h1>
    <UserProfile msg="Enter the user profile component"/>
  </div>
</template>

<script>
  import UserProfile from "@/components/UserProfile.vue";

  export default {
    name: "user",

    components:{
      UserProfile
    }
  }
</script>

<style scoped>

</style>