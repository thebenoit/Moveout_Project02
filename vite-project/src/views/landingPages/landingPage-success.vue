<template>
    <div class="w-full min-h-screen flex flex-col items-center justify-center">
      <div class="mx-auto max-w-md content-center">
        <div class="bg-gray-200 backdrop-blur-3xl p-6 rounded-lg shadow-lg text-center">
          <img src="@/assets/images/success.png" alt="Success Image" class="w-full h-auto mb-4">
          <h1 class="text-2xl font-bold mb-2">Félicitations !</h1>
          <p class="text-lg mb-4">Vous serez parmi les premiers à avoir accès à Moveout le 5 août.</p>
          <p class="text-base emailMessgae">Nous vous enverrons un email contenant les détails d'accès très bientôt. Merci pour votre intérêt et votre confiance !</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {  
        name: 'LandingPageSuccess',
      };
    },
  };
  </script>
  
  <style scoped>
  .bg-gray-200 {
    background-color: #e9ecef;
  }
  
  .backdrop-blur-3xl {
    backdrop-filter: blur(12px);
  }
  .emailMessgae{
    color: rgb(141, 141, 141);
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  
  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  img {
    display: block;
    margin: 0 auto;
  }
  
  h1 {
    color: #FB1A35;
  }
  
  p {
    color: #333;
  }
  </style>
  