<template>
    <div class="landing-page">
      <section class="header">
        <h1>Trouvez votre appartement <p class="text-xl">3X</p> plus vite grâce à Moveout</h1>
        <p>Ne perdez plus de temps à chercher — laissez-nous trouver l'appartement parfait pour vous!</p>
        <img class="mx-auto" src="../assets/images/camionDemenage.svg" alt="noimage">
        <button @click="showForm = true">Rejoignez Moveout aujourd'hui gratuitement</button>
      </section>
  
      <section v-if="showForm" class="signup-form">
        <h2>Inscrivez-vous</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="firstName">Prénom</label>
            <input type="text" id="firstName" v-model="form.firstName" required>
          </div>
          <div class="form-group">
            <label for="lastName">Nom</label>
            <input type="text" id="lastName" v-model="form.lastName" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="form.email" required>
          </div>
          <div class="form-group">
            <label for="confirmEmail">Confirmer Email</label>
            <input type="email" id="confirmEmail" v-model="form.confirmEmail" required>
          </div>
          <div class="form-group">
            <label for="phone">Téléphone</label>
            <input type="tel" id="phone" v-model="form.phone" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="form.password" required>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer Password</label>
            <input type="password" id="confirmPassword" v-model="form.confirmPassword" required>
          </div>
          
          <button type="submit">Soumettre</button>
        </form>
      </section>
      
      <section class="how-it-works ">
        <h2>Comment ça marche?</h2>
        <div class="steps">
          <div class="step">
            <img class="mx-auto" src="../assets/images/conect.png" alt="noimage">
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
      </section>
    </div>
  </template>
  
  <script>
  import utils from '../utils/utils'
  
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
        console.log('resultat: ',result);

        if (result.token) {
          utils.setToken(result.token);
          this.$router.push({ path: '/foryou' });
        }
      } catch (error) {
        console.error('Error during signup:', error);
      }
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
  
  .header button {
    background-color: #FB1A35;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 25px;
  }
  
  .how-it-works {
    text-align: center;
    padding: 2rem 1rem;
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
    max-width: 100px;
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
    background-color: #264653;
    color: white;
    padding: 2rem;
  }
  
  .frustration h2 {
    font-size: 1.5rem;
  }
  
  .frustration p {
    font-size: 1.25rem;
  }
  
  .signup-form {
    text-align: center;
    background-color: #e9ecef;
    padding: 2rem;
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
  </style>
  