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
  window.scrollTo(0, 0);
  router.push("/signup");
  // // Créer un lien SMS avec un message préformaté
  // const phoneNumber = "+12185953780";
  // const message = "Je cherche un appartement";
  // const smsLink = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;

  // // Ouvrir le lien SMS
  // window.location.href = smsLink;
  // console.log("Redirection vers SMS avec message préformaté");
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
.construction-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  color: #333333;
  text-align: center;
  padding: 2rem;
}

.construction-content {
  max-width: 600px;
  background: #ffffff;
  border-radius: 8px;
  padding: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
}

.construction-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  animation: fadeInUp 1s ease-out;
}

.construction-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: fadeInUp 1s ease-out 0.3s;
  animation-fill-mode: both;
}

.construction-date {
  font-size: 2rem;
  font-weight: 600;
  color: #333333;
  margin-bottom: 2rem;
  animation: fadeInUp 1s ease-out 0.6s;
  animation-fill-mode: both;
}

.construction-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.8;
  animation: fadeInUp 1s ease-out 0.9s;
  animation-fill-mode: both;
}

.construction-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Ancien CSS conservé en commentaire */
/*
  .hero-header-content {
    margin: 3.5rem 10% 0rem 10%;
    width: 80%;
    text-align: center;
  }

  .title-txt {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #2d3436;
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
    font-size: 1.1rem;
    color: #6c757d;
    margin-bottom: 3rem;
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

  @keyframes fadeInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-100%); 
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .pricing-section {
    width: 100%;
    padding: 8rem 1rem;
    background-color: #f8f9fa;
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

  .messaging-section {
    padding: 4rem 0;
    margin-top: 5rem;
    background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%);
  }

  .section-title {
    font-size: 2rem;
    font-weight: 600; 
    color: #333333; 
    animation: fadeIn 1s ease-out 1.2s;
    animation-fill-mode: both;
  }

  .section-subtitle {
    color: #666666;
    font-size: 1.1rem;
    margin-top: 0.5rem;
    animation: fadeIn 1s ease-out 1.2s;
    animation-fill-mode: both;
  }

  .feature-card {
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    animation: fadeInFromLeft 1s ease-out 1.3s;
    animation-fill-mode: both;
  }

  .feature-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .feature-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333333;
    margin-bottom: 0.75rem;
  }

  .feature-description {
    font-size: 1rem;
    color: #666666;
    line-height: 1.6;
  }

  .phone-mockup {
    max-width: 300px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .phone-mockup {
      margin-top: 2rem;
    }
  }
  */
</style>

<script></script>

<template>
  <div class="construction-container">
    <div class="construction-content">
      <div class="construction-icon">🏗️</div>
      <h1 class="construction-title">Site en Construction</h1>
      <p class="construction-subtitle">
        Nous travaillons dur pour vous offrir la meilleure expérience
      </p>
      <div class="construction-date">Disponible le 1er Août 2025</div>
      <p class="construction-description">
        Notre équipe développe actuellement une plateforme innovante pour vous
        aider à trouver votre appartement idéal. Revenez bientôt pour découvrir
        toutes nos fonctionnalités !
      </p>
    </div>
  </div>

  <!-- ANCIEN CODE COMMENTÉ -->
  <!--
  <div class="hero-header-content">
    <label class="title-txt " style="font-size: 2rem;">Tu cherches un appartement affordable? <br></label>
    <p class="subtitle-txt">Envoyez un message à Moveout Bot par SMS ou WhatsApp. <br> Votre maison de rêve est à un message de distance.</p>
    <br>
    <button @click="handleProceedSignUp" class="title-btn mb-5" style="">Clique pour trouver ton appartement</button>
    
    
  <div class="container my-4">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <img src="@/assets/screenshot.png" alt="Capture d'écran de l'application" class="img-fluid rounded shadow">
      </div>
    </div>
  </div>
  </div>


  <section id="sms-whatsapp" class="messaging-section">
    <div class="container mx-auto text-center">

      <div class="row align-items-center mt-[4rem] flex flex-col md:flex-row justify-center">
        
        <div class="col-md-6 mx-auto max-w-2xl">
          <div class="messaging-features">
            <h2 class="section-title">Trouvez des appartements par SMS ou WhatsApp</h2>
            <div class="feature-card">
              <div class="feature-icon">🚀</div>
              <h3 class="feature-title">Correspondances Instantanées et Personnalisées</h3>
              <p class="feature-description">
                Recevez des annonces adaptées à vos besoins, envoyées directement sur votre téléphone. Pas d'applications.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3 class="feature-title">Obtenez des correspondances instantanément</h3>
              <p class="feature-description">
                Notre bot IA scanne des milliers d'annonces et vous envoie les meilleures options en quelques secondes.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🌍</div>
              <h3 class="feature-title">Parlez votre langue</h3>
              <p class="feature-description">
                Discutez naturellement dans <strong>20 langues</strong>, dont l'anglais, l'espagnol, le mandarin et l'arabe.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">⏰</div>
              <h3 class="feature-title">Disponible 24h/24 et 7j/7</h3>
              <p class="feature-description">
                Notre bot ne dort jamais. Vous cherchez un appartement en pleine nuit ? On s'occupe de tout.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
  -->
</template>
