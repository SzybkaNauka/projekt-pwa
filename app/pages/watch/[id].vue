<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getById } = useCatalog()
const { isFavorite, toggleFavorite, updateContinueWatching, removeFromContinueWatching } = useProfiles()

const mediaId = computed(() => String(route.params.id || ''))
const isTrailer = computed(() => route.query.trailer === '1')
const item = computed(() => getById(mediaId.value))

if (!item.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Nie znaleziono tytulu',
  })
}

const videoRef = ref<HTMLVideoElement | null>(null)
const playerRef = ref<HTMLElement | null>(null)
const playing = ref(false)
const loaded = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const showXRay = ref(false)
const selectedQuality = ref('1080p')

const videoSource = computed(() =>
  isTrailer.value ? item.value!.trailer : item.value!.videoSources[selectedQuality.value] || item.value!.trailer,
)
const favoriteActive = computed(() => isFavorite(item.value!.id))

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) {
    return '00:00'
  }

  const hours = Math.floor(value / 3600)
  const minutes = Math.floor((value % 3600) / 60)
  const seconds = Math.floor(value % 60)

  if (hours > 0) {
    return [hours, minutes, seconds].map(part => String(part).padStart(2, '0')).join(':')
  }

  return [minutes, seconds].map(part => String(part).padStart(2, '0')).join(':')
}

const syncState = () => {
  const video = videoRef.value
  if (!video) {
    return
  }

  currentTime.value = video.currentTime || 0
  duration.value = video.duration || 0
  volume.value = video.volume
  playing.value = !video.paused

  if (!isTrailer.value) {
    updateContinueWatching({
      id: item.value!.id,
      currentTime: currentTime.value,
      duration: duration.value,
    })
  }
}

const togglePlayback = async () => {
  const video = videoRef.value
  if (!video) {
    return
  }

  if (video.paused) {
    await video.play()
    playing.value = true
  } else {
    video.pause()
    playing.value = false
  }
}

const seekTo = (event: Event) => {
  const video = videoRef.value
  const target = event.target as HTMLInputElement
  if (!video) {
    return
  }

  const nextTime = Number(target.value)
  video.currentTime = nextTime
  currentTime.value = nextTime
}

const updateVolume = (event: Event) => {
  const video = videoRef.value
  const target = event.target as HTMLInputElement
  if (!video) {
    return
  }

  const nextVolume = Number(target.value)
  video.volume = nextVolume
  video.muted = nextVolume === 0
  volume.value = nextVolume
}

const toggleFullscreen = async () => {
  const player = playerRef.value
  if (!player) {
    return
  }

  if (document.fullscreenElement) {
    await document.exitFullscreen()
  } else {
    await player.requestFullscreen()
  }
}

const changeQuality = async (quality: string) => {
  const currentVideo = videoRef.value
  const lastTime = currentVideo?.currentTime || 0
  const wasPlaying = Boolean(currentVideo && !currentVideo.paused)

  selectedQuality.value = quality
  await nextTick()

  if (videoRef.value) {
    videoRef.value.currentTime = lastTime
    if (wasPlaying) {
      await videoRef.value.play()
    }
  }
}

const handleEnded = () => {
  playing.value = false
  if (!isTrailer.value) {
    removeFromContinueWatching(item.value!.id)
  }
}

onBeforeUnmount(() => {
  syncState()
})
</script>

<template>
  <main class="watch-page">
    <section class="watch-page__layout">
      <div class="watch-page__main">
        <div ref="playerRef" class="player">
          <video
            ref="videoRef"
            class="player__video"
            :src="videoSource"
            :poster="item!.cover"
            playsinline
            @loadedmetadata="loaded = true; syncState()"
            @timeupdate="syncState"
            @play="playing = true"
            @pause="playing = false"
            @ended="handleEnded"
          ></video>

          <div class="player__overlay">
            <div class="player__topbar">
              <button class="player__ghost" type="button" @click="router.back()">
                Wroc
              </button>

              <div class="player__top-actions">
                <button class="player__ghost" type="button" @click="toggleFavorite(item!.id)">
                  {{ favoriteActive ? 'Usun z listy' : 'Dodaj do listy' }}
                </button>
                <button class="player__ghost" type="button" @click="showXRay = !showXRay">
                  X-Ray
                </button>
              </div>
            </div>

            <div class="player__bottom">
              <div>
                <p class="player__eyebrow">{{ isTrailer ? 'Zwiastun' : item!.badge }}</p>
                <h1 class="player__title">{{ item!.title }}</h1>
                <p class="player__meta">
                  {{ item!.year }} • {{ item!.duration }} • {{ item!.maturity }}
                </p>
              </div>

              <div class="player__controls">
                <div class="player__timeline">
                  <span>{{ formatTime(currentTime) }}</span>
                  <input
                    class="player__range"
                    type="range"
                    min="0"
                    :max="duration || 0"
                    :value="currentTime"
                    step="0.1"
                    @input="seekTo"
                  >
                  <span>{{ formatTime(duration) }}</span>
                </div>

                <div class="player__actions">
                  <button class="player__button player__button--primary" type="button" @click="togglePlayback">
                    {{ playing ? 'Pauza' : loaded ? 'Play' : 'Ladowanie...' }}
                  </button>

                  <label class="player__volume">
                    Glosnosc
                    <input
                      class="player__range player__range--short"
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      :value="volume"
                      @input="updateVolume"
                    >
                  </label>

                  <div v-if="!isTrailer" class="player__quality">
                    <span>Jakosc</span>
                    <button
                      v-for="quality in Object.keys(item!.videoSources)"
                      :key="quality"
                      class="player__chip"
                      :class="{ 'player__chip--active': selectedQuality === quality }"
                      type="button"
                      @click="changeQuality(quality)"
                    >
                      {{ quality }}
                    </button>
                  </div>

                  <button class="player__button" type="button" @click="toggleFullscreen">
                    Fullscreen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section class="watch-page__details">
          <div>
            <p class="watch-page__eyebrow">Opis</p>
            <p class="watch-page__text">{{ item!.description }}</p>
          </div>

          <div>
            <p class="watch-page__eyebrow">Obsada</p>
            <p class="watch-page__text">{{ item!.cast.join(', ') }}</p>
          </div>

          <div>
            <p class="watch-page__eyebrow">Gatunki</p>
            <p class="watch-page__text">{{ item!.genres.join(' / ') }}</p>
          </div>
        </section>
      </div>

      <XRayPanel :item="item!" :open="showXRay" @close="showXRay = false" />
    </section>
  </main>
</template>

<style scoped>
.watch-page {
  min-height: calc(100vh - 78px);
  background: radial-gradient(circle at top, rgba(51, 167, 255, 0.12), transparent 30%), #07131f;
}

.watch-page__layout {
  position: relative;
}

.watch-page__main {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

.player {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  background-color: #000;
}

.player__video {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
}

.player__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  background: linear-gradient(180deg, rgba(7, 19, 31, 0.62), transparent 32%, rgba(7, 19, 31, 0.92));
  pointer-events: none;
}

.player__topbar,
.player__bottom,
.player__actions,
.player__top-actions,
.player__timeline {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player__topbar,
.player__bottom {
  justify-content: space-between;
}

.player__bottom {
  align-items: end;
}

.player__controls {
  min-width: min(620px, 100%);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.player__timeline {
  padding: 12px 14px;
  border-radius: 16px;
  background-color: rgba(7, 19, 31, 0.58);
  backdrop-filter: blur(12px);
}

.player__range {
  flex: 1;
}

.player__range--short {
  width: 140px;
}

.player__actions {
  flex-wrap: wrap;
  pointer-events: auto;
}

.player__ghost,
.player__button,
.player__chip {
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.player__ghost {
  padding: 10px 14px;
  background-color: rgba(255, 255, 255, 0.12);
  color: #fff;
  pointer-events: auto;
}

.player__button {
  padding: 12px 18px;
  background-color: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.player__button--primary {
  background-color: #fff;
  color: #07131f;
  font-weight: 700;
}

.player__quality {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
}

.player__chip {
  padding: 8px 10px;
  background-color: transparent;
  color: #d7e1ea;
}

.player__chip--active {
  background-color: #1f80d7;
  color: #fff;
}

.player__volume {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
}

.player__eyebrow {
  margin: 0 0 6px;
  color: #33a7ff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.player__title {
  margin: 0 0 6px;
  font-size: 44px;
}

.player__meta {
  margin: 0;
  color: #d7e1ea;
}

.watch-page__details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 24px;
}

.watch-page__details > div {
  padding: 20px;
  border-radius: 18px;
  background-color: #102131;
}

.watch-page__eyebrow {
  margin: 0 0 10px;
  color: #8ea2b6;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.watch-page__text {
  margin: 0;
  color: #d7e1ea;
  line-height: 1.7;
}

@media (max-width: 980px) {
  .player__overlay {
    padding: 18px;
  }

  .player__bottom {
    flex-direction: column;
    align-items: start;
  }

  .player__controls {
    min-width: 100%;
  }

  .watch-page__details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .watch-page__main {
    padding: 16px;
  }

  .player__title {
    font-size: 30px;
  }

  .player__timeline {
    flex-wrap: wrap;
  }
}
</style>
