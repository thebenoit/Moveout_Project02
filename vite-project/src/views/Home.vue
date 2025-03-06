<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import connect from "@/assets/images/conect.png";
import robot from "@/assets/images/robot.png";
import detente from "@/assets/images/detente.png";
const router = useRouter();
function handleSubmitButton() {
  router.push("/listings");
  console.log("Navigating to apartments...");
}

function handleProceedLogin() {
  router.push("/login");
  console.log("Navigating to Login Page...");
}
//slide pour les images
const slides = ref([
  {
    image: `${connect}`,
    title: "1. Inscrivez-vous sur Moveout",
    description:
      "Moveout.ai recherche tout les sites web de listing sur internet.",
  },

  {
    image: `${robot}`,
    title: "2. Communiquez-nous vos préférences",
    description:
      "Moveout.ai analyse les meilleurs listings selon vos goûts et préférences jour et nuit.",
  },
  {
    image: `${detente}`,
    title: "3. Relaxez, on s'occupe du rest",
    description:
      "Dès qu'un appartement apparaît sur le web, vous serez le premier à le savoir.",
  },
]);

const currentSlideIndex = ref(0);

const changeSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.value.length;
};
onMounted(() => {
  setInterval(changeSlide, 5000);
});
</script>

<style>
  @keyframes slideInLeft {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slideInLeft {
    animation: slideInLeft 0.5s ease-out forwards;
  }

  @keyframes slideInRight {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slideInRight {
    animation: slideInRight 0.5s ease-out forwards;
  }
</style>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(120px);
}
</style>

<template>

  <div class="flex flex-col justify-center items-center h-screen">
    <p class="animate-slideInLeft mb-2 text-center text-gray-700">Already have an account?</p>
    <button @click="handleProceedLogin" class="w-80 bg-blue-main text-white py-3 px-6 rounded-full text-lg md:text-xl font-semibold hover:bg-blue-400 transition-colors shadow-lg hover:shadow-xl">
      Proceed to Login
    </button>
    <!-- source: https://chatgpt.com/c/6733d1cb-7d6c-8012-8978-dbeae9b43ac6 -->
    <div class="flex flex-col items-center mb-10 md:mb-0 max-w-xs m-3">
      <transition name="slide-fade" mode="out-in">
        <img
          :key="currentSlideIndex"
          :src="slides[currentSlideIndex].image"
          alt="Image"
          class="w-32 h-32 mb-4"
        />
      </transition>
      <!-- <transition name="slide-fade" mode="out-in">
        <h3
          :key="'title-' + currentSlideIndex"
          class="text-xl font-semibold mb-2 text-blue-main"
        >
          {{ slides[currentSlideIndex].title }}
        </h3>
      </transition> -->
      <!-- <transition name="slide-fade" mode="out-in">
        <p :key="'desc-' + currentSlideIndex" class="text-gray-600">
          {{ slides[currentSlideIndex].description }}
        </p>
      </transition> -->
    </div>

    <button @click="handleSubmitButton" class="w-80 bg-blue-main text-white py-3 px-6 rounded-full text-lg md:text-xl font-semibold hover:bg-blue-400 transition-colors shadow-lg hover:shadow-xl">
      Find an Appartement
    </button>
    <p class="animate-slideInRight mb-2 text-center text-gray-700 p-2">Just want to browse our catalogue of apartments?</p>
    <br>
    <p class="animate-slideInLeft mb-2 text-center text-gray-700 p-2">Want to create an account? <a href="/signup" class="underline text-blue-main">Click here!</a></p>
  </div>
</template>
