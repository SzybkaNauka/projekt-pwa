<script setup lang="ts">
const { catalog, movies, series, getByIds, filterVisible } = useCatalog()
const { currentProfile, hiddenIds, continueWatchingEntries, favoriteIds } = useProfiles()

const visibleCatalog = computed(() => filterVisible(catalog, currentProfile.value, hiddenIds.value))
const visibleMovies = computed(() => filterVisible(movies, currentProfile.value, hiddenIds.value))
const visibleSeries = computed(() => filterVisible(series, currentProfile.value, hiddenIds.value))

const heroItem = computed(() => visibleCatalog.value[3] || visibleCatalog.value[0] || catalog[0])
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

    <section class="home-page__lead page-wrap">
      <p class="home-page__lead-title">Filmy, ktore moga Ci sie spodobac</p>
      <p class="home-page__lead-copy">
        Desktopowy uklad inspirowany platformami VOD: duzy hero, szybka szukajka, kategorie pod menu
        i przejrzyste sekcje ogladania.
      </p>
    </section>

    <MediaRow
      v-if="continueItems.length"
      title="Kontynuuj ogladanie"
      subtitle="Wroc do odtwarzania od ostatniego zapisanego momentu."
      :items="continueItems"
    />
    <MediaRow title="Popularne teraz" subtitle="Najczesciej odpalane tytuly w tym tygodniu." :items="trendingItems" />
    <MediaRow title="Nowosci" subtitle="Swieze premiery i glosne dodatki do biblioteki." :items="freshItems" />
    <MediaRow title="Filmy" subtitle="Akcja, thriller, science fiction i mocne premiery." :items="movieSpotlight" />
    <MediaRow title="Seriale" subtitle="Sezony, ktore warto zaczac jeszcze dzisiaj." :items="seriesSpotlight" />
    <MediaRow v-if="favorites.length" title="Moja lista" subtitle="Zapisane pozycje aktywnego profilu." :items="favorites" />
  </main>
</template>

<style scoped>
.home-page {
  padding-bottom: 40px;
}

.home-page__lead {
  padding-top: 12px;
  padding-bottom: 20px;
}

.home-page__lead-title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
  color: #f1f5f9;
}

.home-page__lead-copy {
  margin: 0;
  max-width: 840px;
  color: #93a8bc;
  font-size: 15px;
  line-height: 1.6;
}
</style>
