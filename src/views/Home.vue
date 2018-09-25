<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <ShowCase/>
  </div>
</template>

<script>
// @ is an alias to /src
import ShowCase from "@/components/Showcase.vue";

export default {
  name: "home",
  components: {
    ShowCase
  }
};
</script>
