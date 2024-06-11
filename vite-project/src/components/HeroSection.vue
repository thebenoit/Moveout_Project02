<template>
  <div class="hero min-h-screen w-full h-full overflow-hidden">
    <video
      class=" inset-0 w-full h-full object-cover "
      src="@/assets/videos/mtlStreet.mp4"
      autoplay
      loop
      muted
    ></video>
    <div class="hero-overlay bg-opacity-70"></div>
    <div class="hero-content text-center text-neutral-content">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold">Tu cherches un Appartement Abordable?</h1>
        <p>Appuie sur le bouton ci-dessous</p>
        <button class="btn btn-outline m-10">Trouver Un Appartement!</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroSection'
};
</script>

<style scoped>
/* Vos styles supplémentaires ici si nécessaire */
</style>
