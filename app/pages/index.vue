<script setup lang="ts">
const { catalog, movies, series, getByIds, filterVisible } = useCatalog()
const { currentProfile, hiddenIds, continueWatchingEntries, favoriteIds } = useProfiles()

const visibleCatalog = computed(() => filterVisible(catalog, currentProfile.value, hiddenIds.value))
const visibleMovies = computed(() => filterVisible(movies, currentProfile.value, hiddenIds.value))
const visibleSeries = computed(() => filterVisible(series, currentProfile.value, hiddenIds.value))

const heroItem = computed(() => visibleCatalog.value[0] || catalog[0])
const trendingItems = computed(() => visibleCatalog.value.slice(0, 6))
const freshItems = computed(() => visibleCatalog.value.slice(3, 9))
const movieSpotlight = computed(() => visibleMovies.value.slice(0, 6))
const seriesSpotlight = computed(() => visibleSeries.value.slice(0, 6))
const favorites = computed(() => getByIds(favoriteIds.value))
const continueItems = computed(() => {
  const progressById = new Map(continueWatchingEntries.value.map(entry => [entry.id, entry.progress]))
  return getByIds(continueWatchingEntries.value.map(entry => entry.id)).map(item => ({
    ...item,
    progress: progressById.get(item.id) || 0,
  }))
})
</script>

<template>
  <main class="home-page">
    <MediaHero :item="heroItem" />

    <MediaRow
      v-if="continueItems.length"
      title="Kontynuuj ogladanie"
      subtitle="Zapis postepu dziala osobno dla aktywnego profilu."
      :items="continueItems"
    />
    <MediaRow title="Top 10 w tym tygodniu" subtitle="Najmocniejsze premiery i powroty." :items="trendingItems" />
    <MediaRow title="Nowosci" subtitle="Swieze tytuly gotowe do odpalenia." :items="freshItems" />
    <MediaRow title="Filmy" subtitle="Kinowe premiery i mocne thrillery." :items="movieSpotlight" />
    <MediaRow title="Seriale" subtitle="Sezony, ktore wciagaja od pierwszego odcinka." :items="seriesSpotlight" />
    <MediaRow v-if="favorites.length" title="Moja lista" subtitle="Twoje zapisane tytuly." :items="favorites" />
  </main>
</template>

<style scoped>
.home-page {
  padding-bottom: 40px;
}
</style>
