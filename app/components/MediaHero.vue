<script setup lang="ts">
import type { MediaItem } from '../composables/useCatalog'

const props = defineProps<{
  item: MediaItem
}>()

const { isFavorite, toggleFavorite } = useProfiles()

const favoriteActive = computed(() => isFavorite(props.item.id))
</script>

<template>
  <section
    class="hero"
    :style="{
      backgroundImage: `linear-gradient(90deg, rgba(7,19,31,0.96) 0%, rgba(7,19,31,0.88) 35%, rgba(7,19,31,0.25) 72%, rgba(7,19,31,0.9) 100%), url(${item.cover})`
    }"
  >
    <div class="hero__content">
      <p class="hero__eyebrow">streambox originals</p>
      <h1 class="hero__title">{{ item.title }}</h1>
      <p class="hero__ranking">{{ item.ranking }}</p>
      <p class="hero__description">{{ item.description }}</p>

      <div class="hero__meta">
        <span>{{ item.year }}</span>
        <span>{{ item.duration }}</span>
        <span>{{ item.maturity }}</span>
        <span>{{ item.genres.join(' / ') }}</span>
      </div>

      <div class="hero__actions">
        <NuxtLink :to="`/watch/${item.id}`" class="hero__button">
          Obejrzyj teraz
        </NuxtLink>

        <NuxtLink :to="`/watch/${item.id}?trailer=1`" class="hero__circle" title="Zwiastun">
          T
        </NuxtLink>

        <button class="hero__circle" type="button" title="Moja lista" @click="toggleFavorite(item.id)">
          {{ favoriteActive ? 'OK' : '+' }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 72vh;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.hero__content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 110px 24px 80px;
}

.hero__eyebrow {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #33a7ff;
}

.hero__title {
  max-width: 580px;
  margin: 0 0 14px;
  font-size: 84px;
  line-height: 0.95;
  text-transform: uppercase;
  letter-spacing: -0.04em;
}

.hero__ranking {
  margin: 0 0 14px;
  font-size: 26px;
  font-weight: 700;
  color: #22e4c7;
}

.hero__description {
  max-width: 650px;
  margin: 0 0 20px;
  font-size: 24px;
  line-height: 1.5;
  color: #d7e1ea;
}

.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 28px;
  color: #d7e1ea;
  font-size: 15px;
  font-weight: 600;
}

.hero__actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.hero__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: 14px;
  background-color: #fff;
  color: #07131f;
  font-size: 18px;
  font-weight: 700;
}

.hero__circle {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 900px) {
  .hero__content {
    padding-top: 80px;
  }

  .hero__title {
    font-size: 52px;
  }

  .hero__description {
    font-size: 18px;
  }
}
</style>
