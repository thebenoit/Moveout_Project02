# Architecture des Vues avec Tailwind CSS

## 📁 Structure du Projet

```
src/
├── App.vue              # Composant racine (layout principal)
├── router/
│   └── index.js         # Configuration des routes
├── views/               # Pages complètes de l'application
│   ├── EarlyAccess.vue
│   ├── Login.vue
│   ├── Dashboard.vue
│   └── ...
├── components/          # Composants réutilisables
│   ├── Navbar.vue
│   └── Footer.vue
└── style.css           # Import Tailwind CSS
```

---

## 🔄 Flux de Navigation

### 1. **App.vue** - Le Conteneur Principal

```vue
<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    <main class="flex-grow">
      <RouterView />
      <!-- Ici s'affiche la vue active -->
    </main>
    <Footer />
  </div>
</template>
```

**Rôle :**

- Structure de base de l'application
- Contient les composants communs (Navbar, Footer)
- `<RouterView />` affiche la vue correspondant à l'URL actuelle

### 2. **Router (router/index.js)** - Le Gestionnaire de Routes

```javascript
{
  path: "/early-access",
  name: "earlyAccess",
  component: EarlyAccess,  // Vue chargée depuis src/views/
}
```

**Rôle :**

- Associe une URL à un composant Vue
- Les composants sont importés depuis `src/views/`
- Gère la navigation entre les pages

### 3. **Views** - Les Pages de l'Application

Chaque fichier dans `src/views/` représente une page complète :

- `EarlyAccess.vue` → Page d'accès anticipé
- `Login.vue` → Page de connexion
- `Dashboard.vue` → Tableau de bord
- etc.

---

## 🎨 Intégration Tailwind CSS

### Configuration

**1. Fichier de configuration : `tailwind.config.cjs`**

- Définit les couleurs personnalisées (`blue-main: '#0FB3AF'`)
- Configure les polices (`poppins`, `roboto`)
- Ajoute des animations personnalisées
- Configure DaisyUI (bibliothèque de composants)

**2. Import global : `src/style.css`**

```css
@tailwind base; /* Styles de base */
@tailwind components; /* Composants Tailwind */
@tailwind utilities; /* Classes utilitaires */
```

**3. PostCSS : `postcss.config.js`**

- Traite le CSS avec Tailwind
- Ajoute les préfixes navigateurs (autoprefixer)

---

## 💡 Utilisation de Tailwind dans les Vues

### Classes Utilitaires Directes

```vue
<template>
  <div class="min-h-screen bg-white">
    <!-- min-h-screen = hauteur minimale de l'écran -->
    <!-- bg-white = fond blanc -->

    <h1 class="text-3xl font-bold text-blue-main">
      <!-- text-3xl = taille de texte grande -->
      <!-- font-bold = gras -->
      <!-- text-blue-main = couleur personnalisée -->
    </h1>

    <button
      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      <!-- px-4 = padding horizontal -->
      <!-- py-2 = padding vertical -->
      <!-- rounded-lg = coins arrondis -->
      <!-- hover:bg-blue-600 = changement au survol -->
    </button>
  </div>
</template>
```

### Classes Personnalisées du Projet

D'après `tailwind.config.cjs`, vous pouvez utiliser :

- `text-blue-main` → Couleur principale du projet
- `font-poppins` → Police Poppins
- `font-roboto` → Police Roboto
- `animate-fadeInUp` → Animation personnalisée

### Exemple Complet dans une Vue

```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <!-- container = conteneur centré avec padding -->
    <!-- mx-auto = centrage horizontal -->

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- grid = système de grille -->
      <!-- Responsive : 1 colonne sur mobile, 2 sur tablette, 3 sur desktop -->
      <!-- gap-6 = espacement entre les éléments -->

      <div class="bg-white shadow-custom rounded-lg p-6">
        <!-- shadow-custom = ombre personnalisée du projet -->
        <!-- p-6 = padding -->
      </div>
    </div>
  </div>
</template>
```

---

## 🔑 Points Clés

1. **App.vue** = Layout principal avec Navbar/Footer
2. **Router** = Fait le lien entre URL et composants Vue
3. **Views** = Pages complètes de l'application
4. **Tailwind** = Classes CSS directement dans le HTML
5. **Configuration** = Personnalisation dans `tailwind.config.cjs`

---

## 📝 Résumé Simple

```
URL → Router → Vue (dans views/) → Composants (dans components/)
                                      ↓
                              Classes Tailwind CSS
```

**Exemple concret :**

- L'utilisateur visite `/early-access`
- Le router charge `EarlyAccess.vue` depuis `src/views/`
- `EarlyAccess.vue` s'affiche dans `<RouterView />` de `App.vue`
- Les classes Tailwind stylisent tous les éléments
