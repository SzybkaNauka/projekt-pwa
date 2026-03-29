<script setup lang="ts">
import type { MediaItem } from '../composables/useCatalog'

const props = defineProps<{
  title: string
  items: Array<MediaItem & { progress?: number }>
  subtitle?: string
}>()

const hasProgressItems = computed(() => props.items.some(item => typeof item.progress === 'number'))
</script>

<template>
  <section class="media-row" :class="{ 'media-row--continue': hasProgressItems }">
    <div class="media-row__header">
      <div class="media-row__copy">
        <div class="media-row__title-wrap">
          <h2 class="media-row__title">{{ title }}</h2>
          <p v-if="hasProgressItems" class="media-row__microcopy">
            Usun z ogladaj dalej
          </p>
        </div>
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
  padding: 0 24px 40px;
}

.media-row--continue {
  position: relative;
}

.media-row--continue::before {
  content: "";
  position: absolute;
  inset: 8px 24px 16px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(51, 167, 255, 0.14), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.01));
  pointer-events: none;
}

.media-row__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  max-width: 1440px;
  margin: 0 auto 18px;
  position: relative;
  z-index: 1;
}

.media-row__copy {
  max-width: 820px;
}

.media-row__title-wrap {
  display: flex;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
}

.media-row__title {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.media-row__subtitle {
  margin: 8px 0 0;
  color: #9bb0c5;
  font-size: 15px;
  line-height: 1.6;
}

.media-row__microcopy {
  margin: 0;
  color: #8ebce6;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

</style>
