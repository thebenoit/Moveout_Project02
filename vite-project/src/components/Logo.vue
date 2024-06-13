<script>
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
      required: false
    },
    //action qui va etre fais en appuyant sur le logo
    action: {
      type: Function,
      required: false

    }
  }
}

</script>

<template>
  <div class="justify-self-start m-10 cursor-pointer 
  no-underline text-2xl flex items-center" @click="action">

    <img :src="imageSrc" alt="logo" class="w-[90px] inline-block align-middle -mr-3.5 " />

    <span class="p-2.5 text-[35px] -m-3.5 
 self-center justify-center inline-block align-middle">{{titre}}</span>

  </div>

</template>
