<template>
    <div class="landing-page">
      <section class="header">
        <h1>Trouvez votre appartement <span class="">3X</span> plus vite grâce à Moveout</h1>
        <p>Ne perdez plus de temps à chercher — laissez-nous trouver l'appartement parfait pour vous!</p>
        <img class="mx-auto" src="../assets/images/camionDemenage.svg" alt="noimage">
        <button @click="clickCta" >Rejoignez Moveout aujourd'hui gratuitement</button>
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
          this.$router.push({ path: '/landingpage-signup' });
        }
      } catch (error) {
        console.error('Error during signup:', error);
      }
      },

      clickCta() {
        this.$router.push({path:'/landingpage-signup'})

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

  .popup{
    background: #000000(0,0,0,0.6);
    width: 100%;
    height: 100%;
    position: absolutet;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;

  }

  .popup-content{
    height: 250px;
    width: 500px;
    background:white;
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Ajoute une ombre portée */
    transition: box-shadow 0.3s ease; /* Ajoute une transition pour un effet lisse lors du hover */
  }

 button:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* Augmente l'ombre portée au survol */
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
    background: #000000(0,0,0,0.6);
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
  