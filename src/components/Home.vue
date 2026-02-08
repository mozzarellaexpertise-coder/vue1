<template>
  <div class="home-container">
    <h1>Welcome to My Vue App!</h1>
    <p>This is the main page with some introductory text.</p>
    <div class="photo-holder">
      <img :src="photoUrl" alt="Sample Photo" />
    </div>
  </div>
</template>

<script>
// Import the image at the top
import serverImage from '@/assets/server.png';

export default {
  name: 'Home',
  data() {
    return {
      photoUrl: serverImage
    }
  }
}
</script>

<style scoped>
.home-container {
  text-align: center;
  padding: 40px;
}

.photo-holder img {
  max-width: 100%;
  height: auto;
  display: block;
}

</style>