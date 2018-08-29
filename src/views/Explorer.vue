<template>
  <div class="playlist-explorer">
    <h1>Playlist Explorer View</h1>
    <PlaylistExplorer headerCaption = "This is the Playlist Explorer component"></PlaylistExplorer>
  </div>
</template>

<script>
// @ is an alias to /src
import PlaylistExplorer from "@/components/PlaylistExplorer.vue";

export default {
  name: "explorer",
  components: {
    PlaylistExplorer
  }
};
</script>
