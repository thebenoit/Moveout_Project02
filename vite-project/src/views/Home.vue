<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import connect from "@/assets/images/conect.png";
import robot from "@/assets/images/robot.png";
import detente from "@/assets/images/detente.png";
import chat from "@/assets/images/chat.png";
import sofa from "@/assets/images/sofa.png";
import drone from "@/assets/images/drone.png";
import group from "@/assets/images/group.png";

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

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const scrollElements = document.querySelectorAll("[data-scroll]");
    
    const elementInView = (el, percentageScroll = 100) => {
      const elementTop = el.getBoundingClientRect().top;
      return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) * (percentageScroll / 100)
      );
    };

    const displayScrollElement = (element) => {
      element.classList.add("animate-fadeInUp"); // Use the Tailwind animation class
      element.classList.add("opacity-100"); // Make it visible
    };

    const hideScrollElement = (element) => {
      element.classList.remove("animate-fadeInUp");
      element.classList.add("opacity-0");
    };

    const handleScrollAnimation = () => {
      scrollElements.forEach((el) => {
        if (elementInView(el, 100)) {
          displayScrollElement(el);
        } else {
          hideScrollElement(el);
        }
      });
    };

    window.addEventListener("scroll", () => {
      handleScrollAnimation();
    });

    handleScrollAnimation(); // Run once on page load to catch elements already in view
  });
</script>

<template>

<div class="flex flex-col justify-center items-center h-screen">
    <p class="animate-slideInLeft mb-2 text-center text-gray-700">Vous avez déjà un compte ?</p>
    <button @click="handleProceedLogin" class="w-80 bg-blue-main text-white py-3 px-6 rounded-full text-lg md:text-xl font-semibold hover:bg-blue-400 transition-colors shadow-lg hover:shadow-xl">
      Se connecter
    </button>
    
    <div class="flex flex-col items-center mb-10 md:mb-0 max-w-xs m-3">
      <transition name="slide-fade" mode="out-in">
        <img
          :key="currentSlideIndex"
          :src="slides[currentSlideIndex].image"
          alt="Image"
          class="w-32 h-32 mb-4"
        />
      </transition>
    </div>

    <button @click="handleSubmitButton" class="w-80 bg-blue-main text-white py-3 px-6 rounded-full text-lg md:text-xl font-semibold hover:bg-blue-400 transition-colors shadow-lg hover:shadow-xl">
      Trouver un Appartement
    </button>
    
    <p class="animate-slideInRight mb-2 text-center text-gray-700 p-2">Vous souhaitez seulement parcourir notre catalogue d'appartements ?</p>
    <br>
    <p class="animate-slideInLeft mb-2 text-center text-gray-700 p-2">Vous voulez créer un compte ? <a href="/signup" class="underline text-blue-main">Cliquez ici !</a></p>
</div>

<section class="text-center mt-12 w-full px-4 bg-gray-200 pt-9 pb-7">
  <h2 class="text-3xl md:text-4xl font-bold text-blue-main mb-8">Comment ça marche ?</h2>
  <div class="flex flex-col md:flex-row justify-around items-center">
    
    <!-- Step 1 -->
    <div class="flex flex-col items-center mb-10 md:mb-0 max-w-xs step" data-scroll>
      <img :src="connect" alt="Inscrivez-vous" class="w-32 h-32 mb-4">
      <h3 class="text-xl font-semibold mb-2 text-blue-main">1. Inscrivez-vous sur Moveout</h3>
      <p class="text-gray-600">Moveout.ai recherche tout les sites web de listing sur internet... vraiment tout.</p>
    </div>

    <!-- Step 2 -->
    <div class="flex flex-col items-center mb-10 md:mb-0 max-w-xs step" data-scroll>
      <img :src="robot" alt="Préférences" class="w-32 h-32 mb-4">
      <h3 class="text-xl font-semibold mb-2 text-blue-main">2. Communiquez-nous vos préférences</h3>
      <p class="text-gray-600">Moveout.ai analyse les meilleurs listings selon vos goûts et préférences jour et nuit.</p>
    </div>

    <!-- Step 3 -->
    <div class="flex flex-col items-center max-w-xs step" data-scroll>
      <img :src="detente" alt="Relaxez" class="w-32 h-32 mb-4">
      <h3 class="text-xl font-semibold mb-2 text-blue-main">3. Relaxez, on s'occupe du reste</h3>
      <p class="text-gray-600">Dès qu'un appartement apparaît sur le web, vous serez le premier à le savoir.</p>
    </div>

  </div>
</section>

  <section class="flex flex-col md:flex-row mx-auto w-11/12 md:w-4/5 p-2 pt-6 pb-6 mt-[2rem] rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]" data-scroll>
  <div class="w-full md:w-[30%] p-5">
    <img :src="sofa" alt="Sauve du temps" class="w-[90%] h-auto md:h-[90%] p-[5%] mx-auto">
  </div>
  <div class="w-full md:w-[70%] p-5">
    <h3 class="text-xl font-semibold mb-2 text-blue-main">Sauve du temps</h3>
    <p class="text-black-600"> En 3 clics, configure ta recherche d’appartement et laisse notre bot s’occuper du reste.</p>
    <br>
    <ul class="list-disc pl-4">
      <li class="text-gray-500">Recherche ultra-rapide et automatisée, 24/7</li>
      <li class="text-gray-500">Dites adieu aux visites inutiles, gagnez du temps pour ce qui compte vraiment</li>
    </ul>
  </div>
</section>

<section class="flex flex-col md:flex-row mx-auto w-11/12 md:w-4/5 p-2 pt-6 pb-6 mt-[2rem] rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]" data-scroll>
  <div class="w-full md:w-[30%] p-5">
    <img :src="group" alt="Bye bye, arnaques" class="w-[90%] h-auto md:h-[90%] p-[5%] mx-auto">
  </div>
  <div class="w-full md:w-[70%] p-5">
    <h3 class="text-xl font-semibold mb-2 text-blue-main">Bye bye, arnaques !</h3>
    <p class="text-black-600"> Fini les annonces louches et les fausses promesses.</p>
    <br>
    <ul class="list-disc pl-4">
      <li class="text-gray-500">Système de notation intelligent : chaque propriétaire est évalué sur 5</li>
      <li class="text-gray-500">Priorisation des annonces avec les meilleures notes</li>
    </ul>
  </div>
</section>

<section class="flex flex-col md:flex-row mx-auto w-11/12 md:w-4/5 p-2 pt-6 pb-6 mt-[2rem] rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.1)]" data-scroll>
  <div class="w-full md:w-[30%] p-5">
    <img :src="drone" alt="Trouve la perle rare avant tout le monde" class="w-[90%] h-auto md:h-[90%] p-[5%] mx-auto">
  </div>
  <div class="w-full md:w-[70%] p-5">
    <h3 class="text-xl font-semibold mb-2 text-blue-main">Trouve la perle rare avant tout le monde</h3>
    <p class="text-black-600">Sois parmi les premiers à postuler et maximise tes chances de décrocher le logement idéal.</p>
    <br>
    <ul class="list-disc pl-4">
      <li class="text-gray-500">Accès prioritaire aux nouvelles annonces</li>
      <li class="text-gray-500">Système de classement par distance (transports, commodités)</li>
    </ul>
  </div>
</section>

</template>
