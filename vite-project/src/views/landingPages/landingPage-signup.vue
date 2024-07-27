<template>
  <div class="w-full min-h-screen grid lg:grid-cols-2">
    <div class="mx-auto max-w-sm content-center">
      <div
        class="bg-gray-200 backdrop-blur-3xl mt-16 lg:mt-0 p-6 rounded-lg shadow-lg"
      >
        <CardHeader class="cardTitle">
          Inscrivez-vous gratuitement!
          <CardDescription>
            <p v-if="errorMessages" class="text-red-500">{{ errorMessages }}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 lesInput">
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <input
                  id="first-name"
                  placeholder="Prénom"
                  required
                  v-model="form.firstName"
                />
              </div>
              <div class="grid gap-2">
                <input
                  id="last-name"
                  placeholder="Nom"
                  required
                  v-model="form.lastName"
                />
              </div>
            </div>
            <div class="grid mt-1">
              <input
                id="phone"
                type="phone"
                placeholder="Phone"
                required
                v-model="form.phone"
              />
            </div>
            <div class="grid mt-1">
              <input
                id="email"
                type="email"
                placeholder="Email"
                required
                v-model="form.email"
              />
            </div>
            <!-- <div class="grid mt-1">
              <input
                id="confirmEmail"
                type="email"
                placeholder="Confirm email"
                required
                v-model="form.confirmEmail"
              />
            </div> -->
            <!-- <div class="grid mt-1">
              <input
                id="password"
                type="password"
                placeholder="Password"
                required
                v-model="form.password"
              />
            </div> -->
            <!-- <div class="grid mt-1">
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                required
                v-model="form.confirmPassword"
              />
            </div> -->
            <Button type="submit" class="w-full" @click="submitForm">
              Rejoignez Moveout aujourd'hui gratuitement
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        src="@/assets/images/house-1477041_1920.jpg"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>

<script>
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"; // Importez vos composants UI correctement
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import utils from "../../utils/utils";

export default {
  data() {
    return {
      name: "LandingPage",
      showForm: false,
      errorMessages: "",
      form: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
      },
    };
  },
  methods: {
    async submitForm() {
    try {
        let result = await utils.post("api/client/lead", this.form);

        // Vérifiez si une erreur est retournée
        if (result.error) {
            this.errorMessages = result.error.message
                // "Une erreur est survenue lors de l'inscription. Vérifiez votre mot de passe : il doit contenir une majuscule, une minuscule, un caractère spécial et avoir au moins 8 caractères.";
        } else {
            // Utilisez directement `result` comme il est déjà au format JSON
            if (result.success == 1) {
                // utils.setToken(result.token);
                this.$router.push({ path: "/landingpage-success" });
            }
        }
    } catch (error) {
        console.error("Error during signup:", error);
        this.errorMessages =
            "Une erreur est survenue lors de l'inscription. Vérifiez votre mot de passe : il doit contenir une majuscule, une minuscule, un caractère spécial et avoir au moins 8 caractères.";
    }
}

  },
};
</script>

<style scoped>
.lesInput input {
  height: 50px;
  border-radius: 15px;
  align-items: center;
}

.lesInput ::placeholder {
  text-align: center;
}

.CardTitle {
  margin-bottom: 10px;
  text-align: center;
}

#first-name {
  width: 160px;
}

#last-name {
  width: 160px;
  align-self: flex-end;
}
.bg-gray-200 {
  background-color: #e9ecef;
}

.backdrop-blur-3xl {
  backdrop-filter: blur(12px);
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

button {
  background-color: #fb1a35;
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
</style>
