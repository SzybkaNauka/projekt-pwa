<script setup lang="ts">
import type { MediaItem } from '../composables/useCatalog'

defineProps<{
  title: string
  items: Array<MediaItem & { progress?: number }>
  subtitle?: string
}>()
</script>

<template>
  <section class="media-row">
    <div class="media-row__header">
      <div>
        <h2 class="media-row__title">{{ title }}</h2>
        <p v-if="subtitle" class="media-row__subtitle">{{ subtitle }}</p>
      </div>
    </div>

    <div v-if="items.length" class="row-scroll">
      <MediaCard
        v-for="item in items"
        :key="item.id"
        :item="item"
      />
    </div>

    <div v-else class="empty-state">
      Ta sekcja jest jeszcze pusta dla tego profilu.
    </div>
  </section>
</template>

<style scoped>
.media-row {
  padding: 0 24px 34px;
}

.media-row__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  max-width: 1440px;
  margin: 0 auto 18px;
}

.media-row__title {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
}

.media-row__subtitle {
  margin: 6px 0 0;
  color: #9bb0c5;
}

@media (max-width: 720px) {
  .media-row {
    padding-inline: 16px;
  }

  .media-row__title {
    font-size: 28px;
  }
}
</style>
