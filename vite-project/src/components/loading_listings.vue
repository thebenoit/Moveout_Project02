<script setup>
import { computed } from "vue";

const props = defineProps({
  count: { type: Number, default: 8 },
  size: { type: Number, default: 96 },
  gap: { type: Number, default: 12 },
  showText: { type: Boolean, default: true },
  imageSrc: {
    type: String,
    default:
      "https://scontent-jnb2-1.xx.fbcdn.net/v/t45.5328-4/379115184_6869818256417124_4127280274751576727_n.jpg?stp=c0.43.261.261a_dst-jpg_p261x260_tt6&_nc_cat=103&ccb=1-7&_nc_sid=247b10&_nc_ohc=LyMAHAHA0r0Q7kNvwGtST7o&_nc_oc=Admwkt-s5UeWfCJlm8wE-5WEGYcwmvzyfnlKlxAsiLwTNLMVSmzWXJ_nzF0AIObI0AU&_nc_zt=23&_nc_ht=scontent-jnb2-1.xx&_nc_gid=ClE-pms0vmr6-8due1L73A&oh=00_AfYe7sWRQypACam4S53VgwyUfiRjMBCtXRaRNgPsdOM90A&oe=68D3C375",
  },
  // Optional explicit items to render; if provided, we render exactly items.length
  items: { type: Array, default: () => [] },
  shineDuration: { type: Number, default: 1.6 },
});

const containerGapStyle = computed(() => ({
  gap: `${props.gap}px`,
}));

const renderCount = computed(() => {
  return props.items && props.items.length > 0
    ? props.items.length
    : props.count;
});

// Responsive size using CSS clamp for mobile friendliness
const computedSize = computed(() => `clamp(64px, 20vw, ${props.size}px)`);
const itemBoxStyle = computed(() => ({ minWidth: computedSize.value }));
const imageBoxStyle = computed(() => ({
  width: computedSize.value,
  height: computedSize.value,
}));
</script>

<template>
  <div
    class="w-full flex justify-center py-8 md:py-12"
    :style="{ '--shine-duration': `${props.shineDuration}s` }"
  >
    <div
      class="w-full max-w-6xl overflow-x-auto"
      role="status"
      aria-label="Loading listings"
    >
      <div
        class="flex items-start justify-center px-4 md:px-6"
        :style="containerGapStyle"
      >
        <div
          v-for="(n, idx) in renderCount"
          :key="idx"
          class="flex flex-col items-center"
          :style="itemBoxStyle"
        >
          <component
            :is="props.items[idx] && props.items[idx].url ? 'a' : 'div'"
            :href="
              props.items[idx] && props.items[idx].url
                ? props.items[idx].url
                : undefined
            "
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center group"
            :class="{
              'cursor-pointer': props.items[idx] && props.items[idx].url,
              'opacity-90': !(props.items[idx] && props.items[idx].url),
            }"
          >
            <div
              v-if="(props.items[idx] && props.items[idx].sr) || props.imageSrc"
              class="rounded-full overflow-hidden shiny"
              :style="imageBoxStyle"
            >
              <img
                :src="
                  props.items[idx] && props.items[idx].sr
                    ? props.items[idx].sr
                    : props.imageSrc
                "
                alt="listing image"
                class="w-full h-full object-cover"
              />
            </div>
            <div
              v-else
              class="rounded-full bg-gray-200 flex items-center justify-center shiny"
              :style="imageBoxStyle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#d1d5db"
                class="w-1/2 h-1/2"
              >
                <path
                  d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14l4-4h10l4 4z"
                />
              </svg>
            </div>
            <div v-if="props.showText" class="w-full mt-3 text-center">
              <div
                v-if="props.items[idx] && props.items[idx].titre"
                class="text-sm font-medium text-gray-600 clamp-2"
                :title="props.items[idx].titre"
              >
                {{ props.items[idx].titre }}
              </div>
              <div
                class="h-3 bg-gray-200 rounded animate-pulse shiny"
                style="width: 70%"
              ></div>
              <div
                class="h-3 bg-gray-100 rounded mt-2 animate-pulse shiny"
                style="width: 50%"
              ></div>
            </div>
          </component>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Shiny sweep effect */
.shiny {
  position: relative;
  overflow: hidden;
}
.shiny::after {
  content: "";
  position: absolute;
  top: 0;
  left: -150%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shine var(--shine-duration, 1.6s) infinite;
}

@keyframes shine {
  0% {
    left: -150%;
  }
  60% {
    left: 150%;
  }
  100% {
    left: 150%;
  }
}

/* two-line clamp utility */
.clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}
</style>
