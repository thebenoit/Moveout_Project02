<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  /** Texte à taper puis effacer en boucle */
  text: {
    type: String,
    required: true,
  },
  /** Délai en ms entre chaque caractère à l'écriture */
  typeSpeed: {
    type: Number,
    default: 60,
  },
  /** Délai en ms entre chaque caractère à l'effacement */
  eraseSpeed: {
    type: Number,
    default: 40,
  },
  /** Délai en ms avant de commencer la première frappe */
  startDelay: {
    type: Number,
    default: 800,
  },
  /** Pause en ms après avoir fini d'écrire, avant d'effacer */
  pauseBeforeErase: {
    type: Number,
    default: 1500,
  },
  /** Pause en ms après avoir tout effacé, avant de réécrire */
  pauseBeforeRetype: {
    type: Number,
    default: 600,
  },
  /** Nombre de cycles (écrire → effacer). null = infini */
  maxCycles: {
    type: Number,
    default: null,
  },
  /** Arrêter l'effacement quand il reste au moins ce nombre de caractères (ex: 18 pour "Already 150+ peo") */
  eraseMinLength: {
    type: Number,
    default: 0,
  },
  /** Afficher le curseur clignotant */
  showCursor: {
    type: Boolean,
    default: true,
  },
  /** Élément HTML pour le conteneur */
  tag: {
    type: String,
    default: "span",
  },
});

const displayed = ref("");
let timers = [];

function clearAllTimers() {
  timers.forEach((id) => clearTimeout(id));
  timers = [];
}

function schedule(fn, delay) {
  const id = setTimeout(fn, delay);
  timers.push(id);
}

const minLen = () => Math.min(props.eraseMinLength, props.text.length);

function runCycle(cycleCount, startFromIndex = 0) {
  const fullText = props.text;
  const maxCycles = props.maxCycles;
  const min = minLen();

  // Ne vider l'écran que si on repart du début (startFromIndex === 0)
  if (startFromIndex === 0) {
    displayed.value = "";
  }
  // Sinon on garde le texte déjà affiché (ex: "Already 150+ peo") et on complète

  let index = startFromIndex;

  function typeNext() {
    if (index < fullText.length) {
      displayed.value = fullText.slice(0, index + 1);
      index += 1;
      schedule(typeNext, props.typeSpeed);
    } else {
      // Fin d'écriture → pause puis effacer
      schedule(() => eraseNext(fullText.length), props.pauseBeforeErase);
    }
  }

  function eraseNext(len) {
    if (len > min) {
      displayed.value = fullText.slice(0, len - 1);
      schedule(() => eraseNext(len - 1), props.eraseSpeed);
    } else {
      // Arrêt à min caractères : garder displayed = fullText.slice(0, min)
      displayed.value = fullText.slice(0, min);
      const nextCycle = cycleCount == null ? 1 : cycleCount + 1;
      if (maxCycles != null && nextCycle >= maxCycles) {
        displayed.value = fullText;
        return;
      }
      // Reprendre en tapant à partir de min (sans effacer, pas de flash vide)
      schedule(
        () => runCycle(maxCycles == null ? null : nextCycle, min),
        props.pauseBeforeRetype,
      );
    }
  }

  const delay = startFromIndex === 0 ? props.startDelay : 0;
  schedule(typeNext, delay);
}

function start() {
  clearAllTimers();
  runCycle(0);
}

onMounted(() => {
  start();
});

onUnmounted(() => {
  clearAllTimers();
});
</script>

<template>
  <component :is="tag" class="typewriter-erase-text">
    <span>{{ displayed }}</span>
    <span v-if="showCursor" class="typewriter-cursor" aria-hidden="true"
      >|</span
    >
  </component>
</template>

<style scoped>
.typewriter-erase-text {
  display: inline;
}

.typewriter-cursor {
  display: inline-block;
  font-weight: 300;
  animation: typewriter-blink 0.7s step-end infinite;
  margin-left: 2px;
}

@keyframes typewriter-blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
