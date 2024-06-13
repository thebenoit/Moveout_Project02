<script setup>
export default {
  name: 'Logo',
  props: {
    //texte qui va etre afficher
    titre: {
      type: String,
      required: true
    },
    //image qui va etre afficher
    imageSrc: {
      type: String,
      required: true
    },
    //action qui va etre fais en appuyant sur le logo
    action: {
      type: Function,
      required: true

    }
  }
}

</script>

<template>
  <div class="justify-self-start m-10 cursor-pointer 
  no-underline text-2xl flex item-center" @click="action">

    <img :src="imageSrc" alt="logo" class="w-[70px] inline-block align-middle" />

    <span class="p-2.5 text-[35px] -m-2.5 
 self-center justify-center inline-block align-middle  ">titre</span>

  </div>

</template>
