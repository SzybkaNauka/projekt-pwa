<script setup lang="ts">
import type { MediaItem } from '../composables/useCatalog'

defineProps<{
  item: MediaItem
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <aside class="xray" :class="{ 'xray--open': open }">
    <div class="xray__header">
      <div>
        <p class="xray__eyebrow">X-Ray</p>
        <h2 class="xray__title">{{ item.title }}</h2>
      </div>

      <button class="xray__close" type="button" @click="emit('close')">X</button>
    </div>

    <div class="xray__section">
      <p class="xray__label">Opis</p>
      <p class="xray__text">{{ item.description }}</p>
    </div>

    <div class="xray__section">
      <p class="xray__label">Szczegoly</p>
      <p class="xray__text">{{ item.year }} | {{ item.duration }} | {{ item.maturity }}</p>
      <p class="xray__text">{{ item.genres.join(' / ') }}</p>
    </div>

    <div class="xray__section">
      <p class="xray__label">Obsada</p>
      <ul class="xray__list">
        <li v-for="person in item.cast" :key="person">{{ person }}</li>
      </ul>
    </div>

    <div class="xray__section">
      <p class="xray__label">Soundtrack</p>
      <p class="xray__text">{{ item.music }}</p>
    </div>

    <div class="xray__section">
      <p class="xray__label">Ciekawostki</p>
      <ul class="xray__list">
        <li v-for="fact in item.trivia" :key="fact">{{ fact }}</li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.xray {
  position: fixed;
  top: 0;
  right: 0;
  width: min(420px, 100vw);
  height: 100vh;
  padding: 24px;
  background: rgba(8, 17, 28, 0.98);
  box-shadow: -12px 0 30px rgba(0, 0, 0, 0.35);
  transform: translateX(100%);
  transition: transform 0.25s ease;
  z-index: 90;
  overflow-y: auto;
}

.xray--open {
  transform: translateX(0);
}

.xray__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.xray__eyebrow {
  margin: 0 0 6px;
  color: #33a7ff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.xray__title {
  margin: 0;
  font-size: 28px;
}

.xray__close {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
}

.xray__section {
  margin-bottom: 22px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.xray__label {
  margin: 0 0 10px;
  color: #8ea2b6;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.xray__text {
  margin: 0 0 8px;
  line-height: 1.6;
  color: #d7e1ea;
}

.xray__list {
  margin: 0;
  padding-left: 18px;
  color: #d7e1ea;
}

.xray__list li + li {
  margin-top: 8px;
}
</style>
