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

function handleProceedSignUp() {
  router.push("/signup");
  console.log("Navigating to Sign Up Page...");
}

const currentSlideIndex = ref(0);

const changeSlide = () => {
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.value.length;
};
onMounted(() => {
  setInterval(changeSlide, 5000);
});
</script>

<style>
  .hero-header-content {
    margin: 3.5rem 10% 0rem 10%;
    width: 80%;
    text-align: center;
  }

  .title-txt {
    font-size: 2.8rem;
    text-align: center;
    font-weight: 400;
    animation: fadeInUp 1s ease-out;
    animation-fill-mode: both;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .subtitle-txt {
    font-size: 1.2rem;
    text-align: center;
    font-weight: 300;
    color: gray;
    animation: fadeInUp 1s ease-out 0.5s;
    animation-fill-mode: both;
  }

  .title-btn {
    margin-top: 2rem;
    padding: 0.4rem 4rem;
    border-radius: 50px;
    font-size: medium;
    color: #ffffff;
    background-color: #333333;
    transition: background-color 0.3s ease, transform 0.2s ease;
    animation: fadeIn 1s ease-out 1s;
    animation-fill-mode: both;
  }

  .title-btn:focus, .title-btn:hover {
    background-color: #666666;
    transform: scale(1.05);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .pricing-section {
    width: 100%;
    padding: 4rem 1rem;
    background-color: #f8f9fa;
    margin-top: 6rem;
  }

  .pricing-content {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    padding-bottom: 2rem;
  }

  .pricing-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .pricing-header label {
    font-size: 2rem;
    font-weight: 600; 
    color: #333333; 
  }

  .pricing-header p {
    color: #666666;
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }

  .pricing-card {
    flex: 1;
    min-width: 280px;
    max-width: 400px;
    padding: 2.5rem;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .pricing-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }

  .pricing-card-header {
    padding-bottom: 2rem;
    border-bottom: 1px solid #eeeeee;
  }

  .pricing-card-header p {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333333;
    margin: 0;
  }

  .pricing-card-header span {
    font-weight: 400;
    color: #666666;
    font-size: 1.2rem;
  }

  .pricing-card-btn {
    width: 100%;
    height: 3rem;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    background-color: #333333;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 1.5rem;
  }

  .pricing-card-btn:hover {
    background-color: #666666;
    transform: scale(1.02);
  }

  .pricing-card-btn:active {
    transform: scale(0.98);
  }

  .pricing-card-content ul {
    list-style-type: none;
    padding: 0;
    margin: 1.5rem 0 0 0;
  }

  .pricing-card-content ul li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    font-size: 1rem;
    color: #333333;
  }

  .pricing-card-content ul li svg {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .pricing-content {
      flex-direction: column;
      gap: 1.5rem;
    }

    .pricing-card {
      width: 100%;
      max-width: none;
    }
  }

</style>

<script>
  
</script>

<template>
  <div class="hero-header-content">
    <label class="title-txt">Trouvez votre appartement idéal sans tracas <br> Laissez notre bot faire le travail !</label>
    <p class="subtitle-txt">Envoyez un message à Moveout Bot par SMS ou WhatsApp. <br> Disponible en 20 langues. Votre maison de rêve est à un message de distance.</p>
    <br>
    <button @click="handleProceedSignUp" class="title-btn">Commencez avec Moveout</button>
  </div>


  <section class="pricing-section">
  <div class="pricing-header">
    <label>Choisissez votre forfait</label>
    <p>Trouvez le forfait parfait pour vos besoins de recherche d'appartement.</p>
  </div>
  <div class="pricing-content">
    <!-- Free Plan Card -->
    <div class="pricing-card">
      <div class="pricing-card-header">
        <p>Gratuit : <br><span>0$/mois</span></p>
      </div>
      <button class="pricing-card-btn">Continuer Gratuitement</button>
      <div class="pricing-card-content">
        <ul>
          <li>
            <svg class="h-6 w-6 text-black-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg> Accès centralisé aux annonces
          </li>
          <li>
            <svg class="h-6 w-6 text-black-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg> Filtrage
          </li>
          <li>
            <svg class="h-6 w-6 text-black-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg> Mise a jour quotidienne
          </li>
        </ul>
      </div>
    </div>

    <!-- Pro Plan Card -->
    <div class="pricing-card">
      <div class="pricing-card-header">
        <p>Pro : <br><span>9.99$/mois</span></p>
      </div>
      <button class="pricing-card-btn">Aller Pro</button>
      <div class="pricing-card-content">
        <ul>
          <li>
            <svg class="h-6 w-6 text-blue-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg> Tout du plan Gratuit
          </li>
          <li>
            <svg class="h-6 w-6 text-blue-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg> Notifications en temps réel ultra-rapides ⚡
          </li>
          <li>
            <svg class="h-6 w-6 text-blue-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg> Recommandations personnalisées
          </li>
          <li>
            <svg class="h-6 w-6 text-blue-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg> +5 Appartements par jours 🏡
          </li>
          <li>
            <svg class="h-6 w-6 text-blue-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg> 📞 Assistance 24/7 pour ne jamais être bloqué
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
</template>
