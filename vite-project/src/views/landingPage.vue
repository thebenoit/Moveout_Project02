<template>
    <div class="landing-page">
      <section class="header">
        <h1>Trouvez votre appartement 3X plus vite grâce à Moveout</h1>
        <p>Ne perdez plus de temps à chercher — laissez-nous trouver l'appartement parfait pour vous!</p>
        <img class="mx-auto" src="../assets/images/camionDemenage.svg" alt="noimage">
        <button>Rejoignez Moveout aujourd'hui gratuitement</button>
      </section>
      
      <section class="how-it-works ">
        <h2>Comment ça marche?</h2>
       

            
        <div class="steps">
          <div class="step">
       
          
                
            <h3>1. Inscrivez-vous sur Moveout</h3>
            <p>Moveout.ai recherche tout les site web de listing sur internet... vraiment tout</p>
          </div>
          <div class="step">
            
                
            <h3>2. Communiquez nous vos préférences</h3>
            <p>Moveout.ai analyse les meilleures listings selon vos goûts et préférences jours et nuits</p>
          </div>
          <div class="step">
           
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

  export default {
    name: 'LandingPage',
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
    color: #2a9d8f;
  }
  
  .header p {
    font-size: 1.25rem;
    margin: 1rem 0;
  }
  
  .header button {
    background-color: #e76f51;
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
  </style>
  