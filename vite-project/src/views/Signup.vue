<script setup>
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import utils from '../utils/utils'
import { useRouter } from 'vue-router'

const firstName = ref("")
const lastName = ref("")
const phone = ref("")
const email = ref("")
const confirmEmail = ref("")
const password = ref("")
const confirmPassword = ref("")

const router = useRouter()


async function signup() {
  let result = await utils.post('api/client/signup',
    {
      "firstName": firstName.value,
      "lastName": lastName.value,
      "phone": phone.value,
      "email": email.value,
      "confirmEmail": confirmEmail.value,
      "password": password.value,
      "confirmPassword": confirmPassword.value
    }
  )


  result = await result.json()
  console.log(result.token)

  if (result.token) {
    utils.setToken(result.token)
    router.push({ path: '/foryou' })
  }

}

</script>
<template>
  <button class="btn" onclick="signup.showModal()">open modal</button>
<dialog id="signup" class="modal modal-bottom sm:modal-middle">
 <div class="absolute flex h-screen">
     <div class="mt-0">
       <Card class="bg-gray-200 backdrop-blur-3xl mt-16 lg:mt-0 ">
         <CardHeader>
           <CardTitle class="text-xl">
             Inscrivez-vous gratuitement!
           </CardTitle>
           <CardDescription class="text-lg">
             Rejoignez Moveout aujourd'hui gratuitement
           </CardDescription>
         </CardHeader>
         <CardContent>
           <div class="grid gap-4">
             <div class="grid grid-cols-2 gap-4">
               <div class="grid gap-2">
                 <Input class="btn text-left" id="first-name" placeholder="First name" required v-model="firstName" />
               </div>
               <div class="grid gap-2">
                 <Input class="btn text-left" id="last-name" placeholder="Last name" required v-model="lastName" />
               </div>
             </div>
             <div class="grid mt-1">
               <Input class="btn text-left" id="phone" type="phone" placeholder="Phone number" required v-model="phone" />
             </div>
             <div class="grid mt-1">
               <Input class="btn text-left" id="email" type="email" placeholder="Email" required v-model="email" />
             </div>
             <div class="grid mt-1">
               <Input class="btn text-left" id="password" type="password" placeholder="Password" v-model="password" />
             </div>
             <Button type="submit" class="btn btn-lg w-full text-lg bg-red-500 hover:bg-red-300 " @click="signup">
               Rejoignez Moveout gratuitement
             </Button>
           </div>
         </CardContent>
       </Card>
     </div>
 </div>
</dialog>
 <div class="landing-page">
   <section class="header">
     <h1>Trouvez votre appartement <span class="">3X</span> plus vite grâce à Moveout</h1>
     <p>Ne perdez plus de temps à chercher — laissez-nous trouver l'appartement parfait pour vous!</p>
     <img class="mx-auto" src="../assets/images/camionDemenage.svg" alt="noimage">
     <button onclick="signup.showModal()" >Rejoignez Moveout aujourd'hui gratuitement</button>
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

          <button onclick="signup.showModal()" class="mt-10 mb-5">Rejoignez Moveout aujourd'hui gratuitement</button>
   </section>
 </div>
</template>