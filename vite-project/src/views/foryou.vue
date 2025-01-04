<script setup>

</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- En-tête -->
    <header class="bg-white shadow-custom">
      <nav class="container mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-poppins font-bold text-blue-main">MonSite</h1>
          <div class="space-x-4">
            <a href="#" class="font-roboto text-gray-600 hover:text-blue-main">Accueil</a>
            <a href="#" class="font-roboto text-gray-600 hover:text-blue-main">Services</a>
            <a href="#" class="font-roboto text-gray-600 hover:text-blue-main">Contact</a>
          </div>
        </div>
      </nav>
    </header>

    <!-- Section principale -->
    <main class="container mx-auto px-4 py-12">
      <section class="text-center mb-16">
        <h2 class="text-4xl font-poppins font-bold text-gray-800 mb-4">Bienvenue sur MonSite</h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">Découvrez nos services exceptionnels et laissez-nous vous aider à réaliser vos projets.</p>
      </section>

      <!-- Cartes de services -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-custom">
          <h3 class="text-xl font-poppins font-bold text-gray-800 mb-4">Service 1</h3>
          <p class="text-gray-600">Description détaillée du premier service offert.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-custom">
          <h3 class="text-xl font-poppins font-bold text-gray-800 mb-4">Service 2</h3>
          <p class="text-gray-600">Description détaillée du deuxième service offert.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-custom">
          <h3 class="text-xl font-poppins font-bold text-gray-800 mb-4">Service 3</h3>
          <p class="text-gray-600">Description détaillée du troisième service offert.</p>
        </div>
      </div>
    </main>

    <!-- Pied de page -->
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4 text-center">
        <p class="font-roboto">&copy; 2024 MonSite. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<style>

</style>
