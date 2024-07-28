<template>
  <div class="landing-page">
    <section class="header">
      <h1>Trouvez votre appartement <span class="">3X</span> plus vite grâce à Moveout</h1>
      <p>Ne perdez plus de temps à chercher — laissez-nous trouver l'appartement parfait pour vous!</p>
      <img class="mx-auto" src="../assets/images/camionDemenage.svg" alt="noimage">
      <button @click="clickCta">Rejoignez Moveout aujourd'hui gratuitement</button>
    </section>



    <section class="how-it-works ">
      <h1>Comment ça marche?</h1>
      <div class="steps">
        <div class="step">
          <img class="" src="../assets/images/conect.png" alt="noimage">
          <h3>1. Inscrivez-vous sur Moveout</h3>
          <p>Moveout.ai recherche tout les site web de listing sur internet... vraiment tout</p>
        </div>
        <div class="step">
          <img class="mx-auto" src="../assets/images/robot.png" alt="noimage">
          <h3>2. Communiquez nous vos préférences</h3>
          <p>Moveout.ai analyse les meilleures listings selon vos goûts et préférences jours et nuits</p>
        </div>
        <div class="step">
          <img class="mx-auto" src="../assets/images/detente.png" alt="noimage">
          <h3>3. Relaxez, on s'occupe du reste</h3>
          <p>Dès qu'un appartement apparaît sur le web, vous serez le premier à le savoir</p>

        </div>
      </div>
    </section>

    <section class="frustration">
      <h2>Êtes-vous frustré par la recherche interminable d'un appartement ?</h2>
      <p>Moveout.ai élimine le stress de la recherche en trouvant les meilleures annonces adaptées à vos préférences.</p>
      <br>
      <br>
      <h2>En avez-vous assez de rater de superbes appartements ?</h2>
      <p>Nos alertes en temps réel vous assurent d'être le premier informé des nouvelles annonces, pour ne jamais manquer une opportunité..</p>
      <br>
      <br>
      <h2>Craignez-vous de ne pas trouver un appartement qui réponde à tous vos besoins ?</h2>
      <p>Moveout.ai utilise des algorithmes avancés pour vous proposer des appartements correspondant à vos critères,
        vous faisant gagner du temps et des efforts.</p>

      <button @click="clickCta" class="mt-10 mb-5">Rejoignez Moveout aujourd'hui gratuitement</button>
    </section>
    <div class="mt-10 p-2 flex-col sm:flex sm:flex-row justify-center sm:space-x-10 max-w-sm sm:max-w-max sm:w-full mx-auto sm:space-y-0 space-y-10">
      <div class="flex flex-col border-red-600 border-2 shadow-red-600 shadow-lg rounded-3xl bg-white ring-1 ring-black/10">
        <div class="p-8 pb-0 sm:p-10 sm:pb-0">
          <h3 class="text-2xl font-semibold leading-8 tracking-tight text-red-600" id="tier-hobby">Sans Moveout</h3>
        </div>
        <div class="flex flex-1 flex-col p-2 pt-0">
          <div class="flex flex-1 flex-col justify-between rounded-2xl p-6 pt-0 sm:p-8">
            <ul role="list" class="space-y-6">
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Recherche manuelle de plusieurs sites</p>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Informations dispersées</p>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Manque de mises à jour fréquentes</p>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Peu de filtrage avancé</p>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Temps de réaction retardé</p>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Stress et frustration accrus</p>
              </li>
            </ul>
            <!-- <div class="mt-8">
              <a href="/login" class="inline-block w-full rounded-lg bg-gray-900 px-4 py-4 text-center text-sm font-semibold leading-5 text-white shadow-md hover:bg-white hover:text-gray-900 hover:ring hover:ring-gray-900" aria-describedby="tier-team">Get started today</a>
            </div> -->
          </div>
        </div>
      </div>
      <div class="flex flex-col border-blue-main border-2 shadow-blue-main shadow-lg rounded-3xl bg-white ring-1 ring-black/10">
        <div class="p-8 pb-0 sm:p-10 sm:pb-0">
          <h3 class="text-2xl font-semibold leading-8 tracking-tight text-blue-main" id="tier-team">Avec Moveout</h3>
        </div>
        <div class="flex flex-1 flex-col p-2 pt-0">
          <div class="flex flex-1 flex-col justify-between rounded-2xl p-6 pt-0 sm:p-8">
            <ul role="list" class="space-y-6">
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Accès centralisé aux annonces</p>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Filtres avancés et personnalisés</p>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Alertes instantanées</p>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Recommandations personnalisées</p>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Optimisation du temps</p>
              </li>
              <li class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                  </svg>
                </div>
                <p class="ml-3 text-sm leading-6 text-gray-600">Assistance 24/7</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex">
      <button @click="clickCta" class="mt-16 mb-5 mx-auto text-3xl shadow-lg shadow-red-600">Rejoignez Moveout aujourd'hui gratuitement</button>
    </div>
    

  </div>

</template>

<script>
import utils from '../../utils/utils'

export default {
  data() {
    return {
      name: 'LandingPage',
      showForm: false,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        confirmEmail: '',
        phone: '',
        password: '',
        confirmPassword: ''

      }
    };
  },
  methods: {
    async submitForm() {
      try {
        let result = await utils.post('api/client/signup', this.form);
        result = await result.json();
        console.log('resultat: ', result);

        if (result.token) {
          utils.setToken(result.token);
          this.$router.push({ path: '/landingpage-signup' });
        }
      } catch (error) {
        console.error('Error during signup:', error);
      }
    },

    clickCta() {
      this.$router.push({ path: '/landingpage-signup' })

    }
  }



};
</script>

<style scoped>
.landing-page {
  font-family: Arial, sans-serif;
  color: #333;
}

.header {
  text-align: center;
  background-color: #f7f7f7;
  padding: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #000000;
}

.header p {
  font-size: 1.25rem;
  margin: 1rem 0;
  color: #2a9d8f;
}

.header span {
  color: #2a9d8f;
  font-weight: bold;

}

.popup {
  background: #000000(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  position: absolutet;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;

}

.popup-content {
  height: 250px;
  width: 500px;
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;


}



button {
  background-color: #FB1A35;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* Ajoute une ombre portée */
  transition: box-shadow 0.3s ease;
  /* Ajoute une transition pour un effet lisse lors du hover */
}

button:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  /* Augmente l'ombre portée au survol */
}

.how-it-works {
  text-align: center;
  padding: 2rem 1rem;
}

.how-it-works h1 {
  font-size: 30px;
  font-weight: bold;
  color: #2a9d8f;
}

.steps {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.step {
  margin: 1rem;
  text-align: center;
}

.step img {
  max-width: 500px;
  margin-bottom: 1rem;

}

.step h3 {
  font-size: 1.25rem;
  color: #2a9d8f;
}

.step p {
  font-size: 1rem;
}

.frustration {
  text-align: center;
  background-color: #0A1E65;

  padding: 2rem;
}

.frustration h2 {
  font-size: 1.5rem;
  color: #D4CD12;
}

.frustration p {
  font-size: 1.25rem;
  margin: 5px;
  color: white;
}



.signup-form {
  background: #000000(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  position: absolutet;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  /*text-align: center;
    background-color: #e9ecef;
    padding: 2rem;*/
}

.signup-form h2 {
  font-size: 2rem;
  color: #000;
}

.form-group {
  margin: 1rem 0;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.signup-form button {
  background-color: #FB1A35;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 25px;
  margin-top: 1rem;
}

@media all and (max-width: 700px) {
  .step img {
    max-width: 350px;
    margin-bottom: 1rem;

  }

  .frustration button {
    margin-bottom: 145px;
  }
}
</style>