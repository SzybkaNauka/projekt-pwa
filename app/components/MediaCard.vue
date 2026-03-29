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
const hasContinueProgress = computed(() => typeof props.item.progress === 'number')
const progressValue = computed(() => Math.round(props.item.progress || 0))
const quickActionLabel = computed(() => hasContinueProgress.value ? 'Usun z ogladaj dalej' : 'Ukryj tytul')
const primaryActionLabel = computed(() => hasContinueProgress.value ? 'Wznow' : 'Odtworz')
const packageLabel = computed(() => hasContinueProgress.value ? 'W pakiecie StreamBox' : 'Dostepne w StreamBox')
</script>

<template>
  <article
    class="media-card"
    :class="{ 'media-card--continue': hasContinueProgress }"
    @mouseenter="showActions = true"
    @mouseleave="showActions = false"
    @focusin="showActions = true"
    @focusout="showActions = false"
  >
    <div class="media-card__surface">
      <img :src="item.poster" :alt="item.title" class="media-card__image">

      <div class="media-card__gradient"></div>

      <span class="media-card__image-badge">{{ item.badge }}</span>

      <button
        v-if="hasContinueProgress"
        class="media-card__quick-remove button is-dark is-small"
        type="button"
        title="Usun z ogladaj dalej"
        @click.stop="removeFromContinueWatching(item.id)"
      >
        <span class="media-card__quick-label">Kontynuuj ogladanie</span>
        <span class="media-card__quick-action">Usun z ogladaj dalej</span>
      </button>

      <div v-if="hasContinueProgress" class="media-card__progress">
        <div class="media-card__progress-bar" :style="{ width: `${progressValue}%` }"></div>
      </div>

      <span class="media-card__image-mark">streambox</span>
    </div>

    <transition name="fade-scale">
      <div v-if="showActions" class="media-card__panel">
        <h3 class="media-card__title">{{ item.title }}</h3>

        <p class="media-card__package">
          <span class="media-card__package-dot"></span>
          {{ packageLabel }}
        </p>

        <div class="media-card__buttons">
          <NuxtLink :to="`/watch/${item.id}`" class="media-card__play button is-light">
            {{ primaryActionLabel }}
          </NuxtLink>

          <NuxtLink
            :to="`/watch/${item.id}?trailer=1`"
            class="media-card__circle button is-dark is-rounded"
            title="Obejrzyj zwiastun"
          >
            Z
          </NuxtLink>

          <button
            class="media-card__circle button is-dark is-rounded"
            type="button"
            title="Moja lista"
            @click="toggleFavorite(item.id)"
          >
            {{ favoriteActive ? 'OK' : '+' }}
          </button>

          <button
            class="media-card__circle button is-dark is-rounded"
            type="button"
            :title="quickActionLabel"
            @click="hasContinueProgress ? removeFromContinueWatching(item.id) : hideTitle(item.id)"
          >
            X
          </button>
        </div>

        <p class="media-card__ranking">{{ item.ranking }}</p>

        <div class="media-card__meta">
          <span class="media-card__badge">{{ item.badge }}</span>
          <span class="media-card__badge media-card__badge--dark">{{ item.maturity }}</span>
          <span class="media-card__year">{{ item.year }}</span>
          <span class="media-card__year">{{ item.duration }}</span>
          <span class="media-card__year">{{ item.type === 'film' ? 'Film' : 'Serial' }}</span>
          <span v-if="hasContinueProgress" class="media-card__year">{{ progressValue }}% obejrzane</span>
        </div>

        <p class="media-card__description">{{ item.shortDescription }}</p>

        <button
          v-if="hasContinueProgress"
          class="media-card__remove button is-info is-light"
          type="button"
          @click.stop="removeFromContinueWatching(item.id)"
        >
          Usun z ogladaj dalej
        </button>
      </div>
    </transition>
  </article>
</template>

<style scoped>
.media-card {
  position: relative;
  z-index: 0;
  flex: 0 0 280px;
  padding-bottom: 228px;
  margin-bottom: -228px;
  overflow: visible;
  isolation: isolate;
}

.media-card:hover,
.media-card:focus-within {
  z-index: 20;
}

.media-card__surface {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.015)),
    #091521;
  transform-origin: center top;
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
}

.media-card:hover .media-card__surface,
.media-card:focus-within .media-card__surface {
  transform: translateY(-12px) scale(1.06);
  border-color: rgba(96, 178, 244, 0.42);
  box-shadow: 0 34px 64px rgba(0, 0, 0, 0.5);
}

.media-card--continue .media-card__surface {
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
}

.media-card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  transition: transform 0.45s ease;
}

.media-card:hover .media-card__image,
.media-card:focus-within .media-card__image {
  transform: scale(1.08);
}

.media-card__gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(5, 9, 16, 0.03), rgba(5, 9, 16, 0.08) 36%, rgba(5, 9, 16, 0.44) 100%),
    linear-gradient(120deg, rgba(36, 108, 164, 0.14), transparent 42%);
}

.media-card__image-badge {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  padding: 3px 10px 4px;
  border-radius: 0 0 0 10px;
  background: rgba(255, 255, 255, 0.94);
  color: #1a2230;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.media-card__quick-remove {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 186px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  background: rgba(8, 17, 28, 0.78);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.media-card__quick-remove:hover {
  transform: translateY(-1px);
  border-color: rgba(96, 178, 244, 0.42);
  background: rgba(10, 22, 36, 0.9);
}

.media-card__quick-label {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.media-card__quick-action {
  font-size: 11px;
  color: #9fb8cf;
}

.media-card__panel {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  min-height: 220px;
  padding: 14px 16px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: none;
  border-radius: 0 0 18px 18px;
  background:
    linear-gradient(180deg, rgba(12, 22, 34, 0.98), #08111c 28%),
    #08111c;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.34);
}

.media-card__title {
  margin: 0 0 6px;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.media-card__package {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: #ecf3fa;
  font-size: 13px;
  font-weight: 600;
}

.media-card__package-dot {
  width: 11px;
  height: 11px;
  border: 2px solid #12d9a4;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px #08111c;
}

.media-card__buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.media-card__play {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 144px;
  padding: 12px 18px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff, #d8ebfb);
  color: #07131f;
  font-size: 16px;
  font-weight: 700;
}

.media-card__circle {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  min-width: 46px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.media-card__circle:hover {
  background-color: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.3);
}

.media-card__ranking {
  margin: 0 0 10px;
  color: #14d9a7;
  font-size: 13px;
  font-weight: 700;
}

.media-card__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.media-card__badge {
  padding: 3px 7px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.14);
  color: #eff7ff;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.media-card__badge--dark {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.media-card__year {
  color: #c7d7e8;
  font-size: 12px;
  font-weight: 600;
}

.media-card__description {
  margin: 0;
  color: #dfe9f2;
  font-size: 14px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.media-card__remove {
  margin-top: 14px;
  width: 100%;
  padding: 11px 14px;
  border: 1px solid rgba(96, 178, 244, 0.28);
  border-radius: 12px;
  background: rgba(31, 128, 215, 0.12);
  color: #dfefff;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.media-card__remove:hover {
  background: rgba(31, 128, 215, 0.22);
  border-color: rgba(96, 178, 244, 0.4);
}

.media-card__progress {
  position: absolute;
  inset: auto 0 0 0;
  height: 7px;
  background-color: rgba(255, 255, 255, 0.08);
}

.media-card__progress-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #f3f5f7, #ffffff);
}

.media-card__image-mark {
  position: absolute;
  right: 14px;
  bottom: 12px;
  z-index: 2;
  color: rgba(255, 255, 255, 0.92);
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.05em;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
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
</style>
