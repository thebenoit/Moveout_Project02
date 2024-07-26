<template>
    <div class="w-full min-h-screen grid lg:grid-cols-2">
      <div class="mx-auto max-w-sm content-center">
        <Card class="bg-gray-200 backdrop-blur-3xl mt-16 lg:mt-0">
          <CardHeader>
            <CardTitle class="text-xl">
              Sign Up
            </CardTitle>
            <CardDescription>
              Fill the form below to get you started!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h2>Inscrivez-vous</h2>
            <form @submit.prevent="submitForm" class="popup-content">
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
          </CardContent>
        </Card>
      </div>
      <div class="hidden bg-muted lg:block">
        <img src="@/assets/images/house-1477041_1920.jpg" alt="Image" width="1920" height="1080" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale">
      </div>
    </div>
  </template>
  
  <script>
  import { CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card'; // Importez vos composants UI correctement
  import utils from '../utils/utils';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Button } from '@/components/ui/button';
  
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
            this.$router.push({ path: '/landingpage-success' });
          }
        } catch (error) {
          console.error('Error during signup:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Votre CSS ici */
  </style>
  