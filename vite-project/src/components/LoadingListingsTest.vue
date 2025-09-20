<script setup>
import LoadingListings from "./loading_listings.vue";

const testItems = [
  {
    titre: "Chambre privée",
    url: "https://www.facebook.com/marketplace/item/825181392817467/",
    sr: "https://scontent-jnb2-1.xx.fbcdn.net/v/t45.5328-4/379115184_6869818256417124_4127280274751576727_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=103&ccb=1-7&_nc_sid=247b10&_nc_ohc=LyMAHAHA0r0Q7kNvwGtST7o&_nc_oc=Admwkt-s5UeWfCJlm8wE-5WEGYcwmvzyfnlKlxAsiLwTNLMVSmzWXJ_nzF0AIObI0AU&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=ClE-pms0vmr6-8due1L73A&oh=00_AfYe7sWRQypACam4S53VgwyUfiRjMBCtXRaRNgPsdOM90A&oe=68D3C375",
  },
  {
    titre: "Chambre privée",
    url: "https://www.facebook.com/marketplace/item/1053177362803031/",
    sr: "https://scontent-jnb2-1.xx.fbcdn.net/v/t39.30808-6/516462153_10162668397986897_8262445287004916352_n.jpg?stp=c0.169.1537.1537a_dst-jpg_s261x260_tt6&_nc_cat=110&ccb=1-7&_nc_sid=454cf4&_nc_ohc=3vfTqmwhfn4Q7kNvwH65KlI&_nc_oc=AdkOAtYawZGTm0bQQl_UF7CzNDl180GS_YIFNiLjNTWV-7TEFEAP_z5Z4ueIi2_eAkg&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=ClE-pms0vmr6-8due1L73A&oh=00_Afax_Zlm0uixbKe0EZToXq9IniklxQqA59DGPhhVfhRvIA&oe=68D3954E",
  },
];
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center">
    <div class="w-full max-w-6xl px-4 md:px-6">
      <div class="flex flex-col items-center justify-center gap-8">
        <LoadingListings
          :items="testItems"
          :size="88"
          :gap="16"
          :showText="true"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
