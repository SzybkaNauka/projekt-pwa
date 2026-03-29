<script setup lang="ts">
import type { MediaItem } from '~/app/composables/useCatalog'

const props = defineProps<{
  item: MediaItem & { progress?: number }
}>()

const {
  isFavorite,
  toggleFavorite,
  hideTitle,
  removeFromContinueWatching,
} = useProfiles()

const favoriteActive = computed(() => isFavorite(props.item.id))
const showActions = ref(false)
</script>

<template>
  <article
    class="media-card"
    @mouseenter="showActions = true"
    @mouseleave="showActions = false"
  >
    <img :src="item.poster" :alt="item.title" class="media-card__image">

    <div class="media-card__gradient"></div>

    <transition name="fade-scale">
      <div v-if="showActions" class="media-card__panel">
        <h3 class="media-card__title">{{ item.title }}</h3>
        <p class="media-card__prime">W pakiecie StreamBox</p>

        <div class="media-card__buttons">
          <NuxtLink :to="`/watch/${item.id}`" class="media-card__play">
            Play
          </NuxtLink>

          <NuxtLink :to="`/watch/${item.id}?trailer=1`" class="media-card__circle" title="Obejrzyj zwiastun">
            T
          </NuxtLink>

          <button class="media-card__circle" type="button" title="Moja lista" @click="toggleFavorite(item.id)">
            {{ favoriteActive ? 'OK' : '+' }}
          </button>

          <button class="media-card__circle" type="button" title="Ukryj tytul" @click="hideTitle(item.id)">
            X
          </button>
        </div>

        <p class="media-card__ranking">{{ item.ranking }}</p>

        <div class="media-card__meta">
          <span class="media-card__badge">{{ item.badge }}</span>
          <span class="media-card__badge media-card__badge--dark">{{ item.maturity }}</span>
          <span class="media-card__year">{{ item.year }}</span>
          <span class="media-card__year">{{ item.duration }}</span>
        </div>

        <p class="media-card__description">{{ item.shortDescription }}</p>

        <button
          v-if="item.progress"
          class="media-card__remove"
          type="button"
          @click="removeFromContinueWatching(item.id)"
        >
          Usun z kontynuuj
        </button>
      </div>
    </transition>

    <div v-if="item.progress" class="media-card__progress">
      <div class="media-card__progress-bar" :style="{ width: `${item.progress}%` }"></div>
    </div>
  </article>
</template>

<style scoped>
.media-card {
  position: relative;
  flex: 0 0 320px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  background-color: #102131;
  transform-origin: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.media-card:hover {
  transform: scale(1.04);
  z-index: 5;
  box-shadow: 0 20px 34px rgba(0, 0, 0, 0.4);
}

.media-card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.media-card__gradient {
  position: absolute;
  inset: auto 0 0 0;
  height: 120px;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.9));
}

.media-card__panel {
  position: absolute;
  inset: auto 0 0 0;
  padding: 16px;
  background-color: #08111c;
}

.media-card__title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
}

.media-card__prime {
  margin: 0 0 14px;
  color: #d7e1ea;
  font-size: 14px;
}

.media-card__buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.media-card__play {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  padding: 14px 18px;
  border-radius: 12px;
  background-color: #fff;
  color: #07131f;
  font-size: 18px;
  font-weight: 700;
}

.media-card__circle {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 50%;
  background-color: #2a2a2a;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.media-card__ranking {
  margin: 0 0 12px;
  color: #22e4c7;
  font-size: 15px;
  font-weight: 700;
}

.media-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.media-card__badge {
  padding: 2px 8px;
  border-radius: 6px;
  background-color: #fff;
  color: #07131f;
  font-size: 12px;
  font-weight: 700;
}

.media-card__badge--dark {
  background-color: #343a40;
  color: #fff;
}

.media-card__year {
  color: #cdd7e1;
  font-size: 14px;
  font-weight: 600;
}

.media-card__description {
  margin: 0;
  color: #fff;
  font-size: 15px;
  line-height: 1.5;
}

.media-card__remove {
  margin-top: 14px;
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  background-color: #1f80d7;
  color: #fff;
  cursor: pointer;
}

.media-card__progress {
  position: absolute;
  inset: auto 0 0 0;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.12);
}

.media-card__progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #18d0ff, #22e4c7);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 720px) {
  .media-card {
    flex-basis: 260px;
  }
}
</style>
