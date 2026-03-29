<script setup lang="ts">
import type { MediaItem } from '../composables/useCatalog'

const props = defineProps<{
  item: MediaItem
}>()

const { isFavorite, toggleFavorite } = useProfiles()

const favoriteActive = computed(() => isFavorite(props.item.id))
const titleLines = computed(() => {
  const words = props.item.title.toUpperCase().split(' ')
  const lines: string[] = []

  for (let index = 0; index < words.length; index += 1) {
    const nextWord = words[index + 1]
    lines.push(nextWord ? `${words[index]} ${nextWord}` : words[index])
    if (nextWord) {
      index += 1
    }
  }

  return lines
})
</script>

<template>
  <section
    class="hero"
    :style="{
      backgroundImage: `linear-gradient(90deg, rgba(2,8,16,0.98) 0%, rgba(2,8,16,0.94) 28%, rgba(2,8,16,0.58) 52%, rgba(2,8,16,0.18) 76%, rgba(2,8,16,0.82) 100%), url(${item.cover})`
    }"
  >
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__brand">streambox</p>

        <div class="hero__title-block">
          <h1 class="hero__title">
            <span v-for="line in titleLines" :key="line" class="hero__title-line">{{ line }}</span>
          </h1>
        </div>

        <p class="hero__ranking">{{ item.ranking }}</p>
        <p class="hero__description">{{ item.description }}</p>

        <div class="hero__actions">
          <NuxtLink :to="`/watch/${item.id}`" class="hero__button hero__button--primary">
            <span class="hero__play-icon">Start</span>
            Odtworz
          </NuxtLink>

          <button class="hero__button hero__button--round" type="button" title="Dodaj do listy" @click="toggleFavorite(item.id)">
            {{ favoriteActive ? 'OK' : '+' }}
          </button>

          <NuxtLink :to="`/watch/${item.id}?trailer=1`" class="hero__button hero__button--round" title="Szczegoly">
            i
          </NuxtLink>
        </div>

        <p class="hero__package">W pakiecie StreamBox Premium</p>
      </div>

      <div class="hero__stamp">
        <p class="hero__stamp-text">streambox premiere</p>
      </div>
    </div>

    <div class="hero__footer">
      <div class="hero__dots">
        <span class="hero__dot hero__dot--active"></span>
        <span class="hero__dot"></span>
        <span class="hero__dot"></span>
        <span class="hero__dot"></span>
      </div>

      <span class="hero__maturity">{{ item.maturity }}</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 74vh;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.hero::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 180px;
  background: linear-gradient(180deg, rgba(5, 16, 27, 0), #07131f 86%);
}

.hero__inner {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  max-width: 1520px;
  min-height: 74vh;
  margin: 0 auto;
  padding: 96px 24px 120px;
}

.hero__copy {
  position: relative;
  z-index: 1;
  max-width: 620px;
}

.hero__brand {
  margin: 0 0 12px;
  color: #1b88ff;
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
}

.hero__title-block {
  max-width: 520px;
  margin-bottom: 18px;
}

.hero__title {
  margin: 0;
  color: #fd611c;
  font-size: 112px;
  font-weight: 900;
  line-height: 0.88;
  letter-spacing: -0.07em;
  text-transform: uppercase;
  text-shadow: 0 6px 24px rgba(0, 0, 0, 0.28);
}

.hero__title-line {
  display: block;
}

.hero__ranking {
  margin: 0 0 12px;
  color: #1ae4b8;
  font-size: 24px;
  font-weight: 700;
}

.hero__description {
  max-width: 610px;
  margin: 0 0 26px;
  color: #f2f6f9;
  font-size: 22px;
  line-height: 1.42;
}

.hero__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.hero__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
}

.hero__button--primary {
  gap: 12px;
  padding: 0 24px;
  background: #ffffff;
  color: #07131f;
  font-size: 18px;
  font-weight: 700;
}

.hero__button--round {
  width: 54px;
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  backdrop-filter: blur(12px);
}

.hero__play-icon {
  font-size: 18px;
}

.hero__package {
  margin: 0;
  color: #c6d2de;
  font-size: 16px;
  font-weight: 600;
}

.hero__stamp {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__stamp-text {
  margin: 0;
  color: rgba(29, 135, 255, 0.92);
  font-size: 78px;
  font-weight: 800;
  letter-spacing: -0.06em;
  text-transform: lowercase;
  text-shadow: 0 14px 40px rgba(0, 0, 0, 0.24);
}

.hero__footer {
  position: absolute;
  right: 24px;
  bottom: 22px;
  left: 24px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.38);
}

.hero__dot--active {
  width: 18px;
  border-radius: 999px;
  background: #ffffff;
}

.hero__maturity {
  position: absolute;
  right: 0;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}
</style>
