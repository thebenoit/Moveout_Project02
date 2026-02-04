<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  /** Texte à afficher avec l'animation machine à écrire */
  text: {
    type: String,
    required: true,
  },
  /** Délai en ms entre chaque caractère */
  speed: {
    type: Number,
    default: 45,
  },
  /** Délai en ms avant de commencer la frappe */
  delay: {
    type: Number,
    default: 400,
  },
  /** Afficher le curseur clignotant à la fin */
  showCursor: {
    type: Boolean,
    default: true,
  },
  /** Élément HTML utilisé pour le conteneur (h1, p, span, div, etc.) */
  tag: {
    type: String,
    default: "span",
  },
  /** Relancer l'animation quand le texte change */
  restartOnChange: {
    type: Boolean,
    default: false,
  },
});

const displayed = ref("");
let timer = null;

function startTypewriter() {
  displayed.value = "";
  let index = 0;
  const fullText = props.text;

  function typeNext() {
    if (index < fullText.length) {
      displayed.value = fullText.slice(0, index + 1);
      index += 1;
      timer = setTimeout(typeNext, props.speed);
    }
  }

  timer = setTimeout(typeNext, props.delay);
}

function stopTypewriter() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

onMounted(() => {
  startTypewriter();
});

onUnmounted(() => {
  stopTypewriter();
});

watch(
  () => props.text,
  () => {
    if (props.restartOnChange) {
      stopTypewriter();
      startTypewriter();
    }
  },
);
</script>

<template>
  <component :is="tag" class="typewriter-text">
    <span>{{ displayed }}</span>
    <span v-if="showCursor" class="typewriter-cursor" aria-hidden="true"
      >|</span
    >
  </component>
</template>

<style scoped>
.typewriter-text {
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
